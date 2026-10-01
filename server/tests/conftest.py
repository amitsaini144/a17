import os
from collections.abc import AsyncIterator

import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy.engine import make_url
from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession, create_async_engine
from sqlalchemy.pool import NullPool

from app import models  # noqa: F401  (registers all models on Base.metadata)
from app.core.config import get_settings
from app.core.database import Base, get_db_session
from app.core.timing import instrument_engine
from app.main import app

TEST_DATABASE_URL = os.environ.get(
    "TEST_DATABASE_URL", "postgresql+asyncpg://a17:a17@localhost:5432/a17_test"
)


@pytest.fixture(autouse=True)
def root_relative_asset_urls(monkeypatch: pytest.MonkeyPatch) -> None:
    """Expect `/images/...` URLs regardless of the developer's `.env` (which points at the CDN)."""
    monkeypatch.setattr(get_settings(), "assets_base_url", "")


@pytest.fixture(scope="session")
async def engine() -> AsyncIterator[AsyncEngine]:
    # The schema is dropped and recreated: never let that happen to a non-test database.
    database = make_url(TEST_DATABASE_URL).database or ""
    if not database.endswith("_test"):
        pytest.exit(f"Refusing to run tests against '{database}': name must end with '_test'.")

    engine = create_async_engine(TEST_DATABASE_URL, poolclass=NullPool)
    instrument_engine(engine)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    yield engine
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    await engine.dispose()


@pytest.fixture
async def db_session(engine: AsyncEngine) -> AsyncIterator[AsyncSession]:
    """Session inside an outer transaction that is rolled back after each test."""
    async with engine.connect() as conn:
        transaction = await conn.begin()
        session = AsyncSession(
            bind=conn, expire_on_commit=False, join_transaction_mode="create_savepoint"
        )
        try:
            yield session
        finally:
            await session.close()
            await transaction.rollback()


@pytest.fixture
async def client(db_session: AsyncSession) -> AsyncIterator[AsyncClient]:
    async def override_get_db_session() -> AsyncIterator[AsyncSession]:
        yield db_session

    app.dependency_overrides[get_db_session] = override_get_db_session
    try:
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
            yield ac
    finally:
        app.dependency_overrides.clear()
