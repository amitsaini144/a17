"""Session lifecycle rules that depend on time, tested with a controllable clock."""

from datetime import UTC, datetime, timedelta

import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.repository import AuthRepository
from app.auth.schemas import RegisterRequest
from app.auth.service import REFRESH_REUSE_GRACE, AuthService
from app.core.config import get_settings
from app.core.exceptions import AuthenticationError


class Clock:
    def __init__(self) -> None:
        self.now = datetime(2026, 1, 1, tzinfo=UTC)

    def __call__(self) -> datetime:
        return self.now

    def advance(self, delta: timedelta) -> None:
        self.now += delta


@pytest.fixture
def clock() -> Clock:
    return Clock()


@pytest.fixture
def service(db_session: AsyncSession, clock: Clock) -> AuthService:
    return AuthService(AuthRepository(db_session), get_settings(), clock=clock)


async def logged_in(service: AuthService) -> str:
    session = await service.register(
        RegisterRequest(email="ada@example.com", password="correct horse battery")
    )
    return session.tokens.refresh_token


async def test_reusing_a_rotated_token_within_grace_keeps_the_session(
    service: AuthService, clock: Clock
) -> None:
    original = await logged_in(service)
    rotated = (await service.refresh(original)).refresh_token

    # A second tab sent the same token at the same time and lost the race.
    clock.advance(timedelta(seconds=5))
    with pytest.raises(AuthenticationError):
        await service.refresh(original)

    assert (await service.refresh(rotated)).refresh_token


async def test_reusing_a_rotated_token_after_grace_revokes_the_session(
    service: AuthService, clock: Clock
) -> None:
    original = await logged_in(service)
    rotated = (await service.refresh(original)).refresh_token

    # A copy of the old token shows up later: treat it as stolen.
    clock.advance(REFRESH_REUSE_GRACE + timedelta(seconds=1))
    with pytest.raises(AuthenticationError):
        await service.refresh(original)

    with pytest.raises(AuthenticationError):
        await service.refresh(rotated)


async def test_expired_refresh_token_is_rejected(service: AuthService, clock: Clock) -> None:
    token = await logged_in(service)

    clock.advance(timedelta(days=get_settings().refresh_token_ttl_days, seconds=1))

    with pytest.raises(AuthenticationError):
        await service.refresh(token)


async def test_expired_access_token_is_rejected(service: AuthService, clock: Clock) -> None:
    session = await service.register(
        RegisterRequest(email="ada@example.com", password="correct horse battery")
    )
    # PyJWT checks expiry against the real clock, and this one was issued at the fixed (past)
    # clock time, so it expired long ago.
    ttl = timedelta(minutes=get_settings().access_token_ttl_minutes)
    assert clock.now + ttl < datetime.now(UTC)

    with pytest.raises(AuthenticationError):
        await service.get_current_user(session.tokens.access_token)
