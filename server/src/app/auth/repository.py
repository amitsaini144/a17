import uuid
from datetime import datetime

from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.models import RefreshToken, User


class AuthRepository:
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def get_user_by_id(self, user_id: int) -> User | None:
        return await self._session.get(User, user_id)

    async def get_user_by_email(self, email: str) -> User | None:
        return await self._session.scalar(select(User).where(User.email == email))

    async def add_user(self, user: User) -> User:
        """Insert and flush, so a duplicate email surfaces here as `IntegrityError`."""
        self._session.add(user)
        await self._session.flush()
        return user

    async def add_refresh_token(self, token: RefreshToken) -> None:
        self._session.add(token)
        await self._session.flush()

    async def get_refresh_token_for_update(self, token_hash: str) -> RefreshToken | None:
        """Lock the row: concurrent refreshes with the same token are handled one at a time."""
        stmt = select(RefreshToken).where(RefreshToken.token_hash == token_hash).with_for_update()
        return await self._session.scalar(stmt)

    async def revoke_family(self, family_id: uuid.UUID, at: datetime) -> None:
        stmt = (
            update(RefreshToken)
            .where(RefreshToken.family_id == family_id, RefreshToken.revoked_at.is_(None))
            .values(revoked_at=at)
        )
        await self._session.execute(stmt)

    async def commit(self) -> None:
        await self._session.commit()

    async def rollback(self) -> None:
        await self._session.rollback()
