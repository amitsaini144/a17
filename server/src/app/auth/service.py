import uuid
from collections.abc import Callable
from dataclasses import dataclass
from datetime import UTC, datetime, timedelta

import structlog
from sqlalchemy.exc import IntegrityError

from app.auth.models import RefreshToken, User
from app.auth.repository import AuthRepository
from app.auth.schemas import LoginRequest, RegisterRequest, UserRead
from app.core.config import Settings
from app.core.exceptions import AuthenticationError, ConflictError
from app.core.security import (
    create_access_token,
    decode_access_token,
    generate_refresh_token,
    hash_password,
    hash_refresh_token,
    password_needs_rehash,
    verify_password,
)

logger = structlog.get_logger()

# Two tabs refreshing at the same moment both send the same token; the loser finds it already
# rotated. Within this window that is treated as a race (plain 401, the other tab's new cookies
# win), not as theft.
REFRESH_REUSE_GRACE = timedelta(seconds=30)

# One message for unknown email and wrong password, so responses don't reveal registered emails.
INVALID_CREDENTIALS = "Invalid email or password"
NOT_AUTHENTICATED = "Not authenticated"
SESSION_EXPIRED = "Session expired, please log in again"


def _utcnow() -> datetime:
    return datetime.now(UTC)


@dataclass(frozen=True)
class IssuedTokens:
    access_token: str
    refresh_token: str


@dataclass(frozen=True)
class AuthSession:
    user: UserRead
    tokens: IssuedTokens


class AuthService:
    def __init__(
        self,
        repository: AuthRepository,
        settings: Settings,
        *,
        clock: Callable[[], datetime] = _utcnow,
    ) -> None:
        self._repository = repository
        self._settings = settings
        self._clock = clock

    async def register(self, data: RegisterRequest) -> AuthSession:
        # Without email verification there is no way to answer "taken" privately, so this does
        # reveal that the email has an account; registration is rate limited to bound that.
        if await self._repository.get_user_by_email(data.email) is not None:
            raise ConflictError("An account with this email already exists")

        user = User(email=data.email, password_hash=await hash_password(data.password))
        try:
            await self._repository.add_user(user)
        except IntegrityError as exc:  # registered concurrently since the check above
            await self._repository.rollback()
            raise ConflictError("An account with this email already exists") from exc

        tokens = await self._issue_tokens(user, family_id=uuid.uuid4())
        await self._repository.commit()
        logger.info("user_registered", user_id=user.id)
        return AuthSession(user=_user_read(user), tokens=tokens)

    async def login(self, data: LoginRequest) -> AuthSession:
        user = await self._repository.get_user_by_email(data.email)
        usable = user is not None and user.is_active
        # Always verify (against a dummy hash when there's no usable account) to keep timing equal.
        valid = await verify_password(
            user.password_hash if user and usable else None, data.password
        )
        if user is None or not usable or not valid:
            raise AuthenticationError(INVALID_CREDENTIALS)

        if password_needs_rehash(user.password_hash):
            user.password_hash = await hash_password(data.password)

        tokens = await self._issue_tokens(user, family_id=uuid.uuid4())
        await self._repository.commit()
        return AuthSession(user=_user_read(user), tokens=tokens)

    async def refresh(self, raw_refresh_token: str | None) -> IssuedTokens:
        """Exchange a refresh token for a new access + refresh token pair (rotation)."""
        if not raw_refresh_token:
            raise AuthenticationError(NOT_AUTHENTICATED)

        now = self._clock()
        token = await self._repository.get_refresh_token_for_update(
            hash_refresh_token(raw_refresh_token)
        )
        if token is None:
            raise AuthenticationError(SESSION_EXPIRED)

        if token.revoked_at is not None:
            if now - token.revoked_at > REFRESH_REUSE_GRACE:
                # An old token came back: someone holds a copy. End that whole login session.
                await self._repository.revoke_family(token.family_id, now)
                await self._repository.commit()
                logger.warning("refresh_token_reuse", user_id=token.user_id)
            raise AuthenticationError(SESSION_EXPIRED)

        if token.expires_at <= now:
            raise AuthenticationError(SESSION_EXPIRED)

        user = await self._repository.get_user_by_id(token.user_id)
        if user is None or not user.is_active:
            await self._repository.revoke_family(token.family_id, now)
            await self._repository.commit()
            raise AuthenticationError(SESSION_EXPIRED)

        token.revoked_at = now
        tokens = await self._issue_tokens(user, family_id=token.family_id)
        await self._repository.commit()
        return tokens

    async def logout(self, raw_refresh_token: str | None) -> None:
        """End the login session the refresh token belongs to. Idempotent."""
        if not raw_refresh_token:
            return
        token = await self._repository.get_refresh_token_for_update(
            hash_refresh_token(raw_refresh_token)
        )
        if token is not None:
            await self._repository.revoke_family(token.family_id, self._clock())
            await self._repository.commit()

    async def get_current_user(self, access_token: str | None) -> User:
        if not access_token:
            raise AuthenticationError(NOT_AUTHENTICATED)
        subject = decode_access_token(
            access_token, secret=self._settings.jwt_secret.get_secret_value()
        )
        if subject is None or not subject.isdigit():
            raise AuthenticationError(NOT_AUTHENTICATED)
        user = await self._repository.get_user_by_id(int(subject))
        if user is None or not user.is_active:
            raise AuthenticationError(NOT_AUTHENTICATED)
        return user

    async def _issue_tokens(self, user: User, *, family_id: uuid.UUID) -> IssuedTokens:
        now = self._clock()
        access_token = create_access_token(
            subject=str(user.id),
            secret=self._settings.jwt_secret.get_secret_value(),
            issued_at=now,
            ttl=timedelta(minutes=self._settings.access_token_ttl_minutes),
        )
        refresh_token = generate_refresh_token()
        await self._repository.add_refresh_token(
            RefreshToken(
                user_id=user.id,
                token_hash=hash_refresh_token(refresh_token),
                family_id=family_id,
                expires_at=now + timedelta(days=self._settings.refresh_token_ttl_days),
            )
        )
        return IssuedTokens(access_token=access_token, refresh_token=refresh_token)


def _user_read(user: User) -> UserRead:
    return UserRead(email=user.email)
