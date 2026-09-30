import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from sqlalchemy.pool import NullPool

from app.core import database
from app.main import app


async def test_liveness_returns_ok(client: AsyncClient) -> None:
    response = await client.get("/api/v1/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


async def test_readiness_returns_503_when_database_is_unreachable(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    # Nothing listens on port 1, so every connection attempt is refused.
    engine = create_async_engine("postgresql+asyncpg://a17:a17@127.0.0.1:1/a17", poolclass=NullPool)
    monkeypatch.setattr(database, "SessionFactory", async_sessionmaker(engine))
    try:
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
            response = await ac.get("/api/v1/health/ready")
    finally:
        await engine.dispose()

    assert response.status_code == 503
    assert response.json() == {"detail": "Database unavailable", "code": "database_unavailable"}
    assert "server-timing" in response.headers
