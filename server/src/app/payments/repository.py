from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.ext.asyncio import AsyncSession

from app.payments.models import StripeEvent


class StripeEventRepository:
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def record(self, event_id: str, event_type: str) -> bool:
        """Record an event as processed; False if it already was.

        `ON CONFLICT DO NOTHING` makes this safe under concurrent redeliveries too: the second
        insert waits for the first transaction, then finds the row and inserts nothing.
        """
        stmt = (
            insert(StripeEvent)
            .values(id=event_id, type=event_type)
            .on_conflict_do_nothing(index_elements=[StripeEvent.id])
            .returning(StripeEvent.id)
        )
        return await self._session.scalar(stmt) is not None
