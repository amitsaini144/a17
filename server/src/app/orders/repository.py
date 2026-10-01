from collections.abc import Sequence

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.orders.models import Order


class OrderRepository:
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def add(self, order: Order) -> Order:
        self._session.add(order)
        await self._session.flush()
        return order

    async def get_for_update(self, order_id: int) -> Order | None:
        """Lock the order: webhook deliveries for the same order are applied one at a time."""
        stmt = select(Order).where(Order.id == order_id).with_for_update()
        return await self._session.scalar(stmt)

    async def get_by_checkout_session(self, session_id: str, *, user_id: int) -> Order | None:
        stmt = (
            select(Order)
            .where(Order.stripe_checkout_session_id == session_id, Order.user_id == user_id)
            .options(selectinload(Order.items))
        )
        return await self._session.scalar(stmt)

    async def list_for_user(self, user_id: int) -> Sequence[Order]:
        stmt = (
            select(Order)
            .where(Order.user_id == user_id)
            .options(selectinload(Order.items))
            .order_by(Order.created_at.desc(), Order.id.desc())
        )
        result = await self._session.scalars(stmt)
        return result.all()

    async def commit(self) -> None:
        await self._session.commit()
