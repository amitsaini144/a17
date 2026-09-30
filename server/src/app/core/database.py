from collections.abc import AsyncIterator
from typing import Annotated

import structlog
from fastapi import Depends
from sqlalchemy import MetaData
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from app.core.config import get_settings
from app.core.exceptions import DatabaseUnavailableError
from app.core.timing import instrument_engine, measure_db_connect

logger = structlog.get_logger()

# Deterministic constraint names so Alembic autogenerate produces stable migrations.
NAMING_CONVENTION = {
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_N_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s",
}


class Base(DeclarativeBase):
    metadata = MetaData(naming_convention=NAMING_CONVENTION)


_settings = get_settings()

engine = create_async_engine(
    str(_settings.database_url),
    echo=_settings.debug and not _settings.is_production,
    pool_pre_ping=True,
)
instrument_engine(engine)

SessionFactory = async_sessionmaker(engine, expire_on_commit=False, autoflush=False)


async def get_db_session() -> AsyncIterator[AsyncSession]:
    async with SessionFactory() as session:
        # Check out the connection up front so its cost (pool wait, pre-ping, or a fresh
        # connect after Neon suspends) is reported apart from query time.
        # The except is broad on purpose: this call only obtains a connection, and a failed
        # connect can surface as OSError, a SQLAlchemy error or a raw asyncpg error.
        with measure_db_connect():
            try:
                await session.connection()
            except Exception as exc:
                logger.warning("database_unavailable", exc_info=True)
                raise DatabaseUnavailableError("Database unavailable") from exc
        yield session


DbSession = Annotated[AsyncSession, Depends(get_db_session)]
