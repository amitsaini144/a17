"""Request rate limiting backed by the `limits` library.

Limits are declared where they apply (e.g. the auth router) and checked with `enforce`. The
storage comes from settings, so moving from in-memory to Redis is a configuration change.
"""

import math
import time
from functools import lru_cache

from fastapi import Request
from limits import RateLimitItem
from limits.aio.storage import Storage
from limits.aio.strategies import MovingWindowRateLimiter
from limits.storage import storage_from_string

from app.core.config import get_settings
from app.core.exceptions import RateLimitedError


@lru_cache
def _storage() -> Storage:
    storage = storage_from_string(get_settings().rate_limit_storage_uri)
    if not isinstance(storage, Storage):
        raise TypeError("rate_limit_storage_uri must name an async storage (async+...://)")
    return storage


@lru_cache
def _limiter() -> MovingWindowRateLimiter:
    return MovingWindowRateLimiter(_storage())


async def enforce(limit: RateLimitItem, *identifiers: str) -> None:
    """Count one hit against `limit` for `identifiers`; raise once the limit is exceeded."""
    limiter = _limiter()
    if await limiter.hit(limit, *identifiers):
        return
    stats = await limiter.get_window_stats(limit, *identifiers)
    raise RateLimitedError(retry_after_seconds=max(1, math.ceil(stats.reset_time - time.time())))


async def reset() -> None:
    """Clear all counters (tests)."""
    await _storage().reset()


def client_ip(request: Request) -> str:
    """Best-effort client address for per-IP limits.

    Browsers reach the API through the Next.js proxy (Vercel), which sets `X-Forwarded-For` to the
    real client address. The API is also reachable directly, where that header can be forged, so
    per-IP limits are a coarse first line; per-account limits are what stop credential guessing.
    """
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",", 1)[0].strip()
    return request.client.host if request.client else "unknown"
