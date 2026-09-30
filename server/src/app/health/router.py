from typing import Literal

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import text

from app.core.database import DbSession

router = APIRouter(prefix="/health", tags=["health"])


class HealthRead(BaseModel):
    status: Literal["ok"]


@router.get("", response_model=HealthRead)
async def liveness() -> HealthRead:
    """The process is up. Does not touch dependencies."""
    return HealthRead(status="ok")


@router.get("/ready", response_model=HealthRead)
async def readiness(session: DbSession) -> HealthRead:
    """The service can handle traffic: the database is reachable."""
    try:
        await session.execute(text("SELECT 1"))
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Database unavailable"
        ) from exc
    return HealthRead(status="ok")
