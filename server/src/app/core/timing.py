"""Per-request timing, reported in a `Server-Timing` response header.

Splits each request's latency into database connection checkout, query execution and
everything else, measured on the server. That tells slow database round trips (e.g. the API
and database in different regions) apart from slow application code (e.g. a throttled CPU).
The header shows up in browser DevTools (Network → Timing) and in `curl -i`.
"""

from collections.abc import Iterator
from contextlib import contextmanager
from contextvars import ContextVar
from dataclasses import dataclass
from time import perf_counter
from typing import Any

from sqlalchemy import event
from sqlalchemy.engine import Connection
from sqlalchemy.ext.asyncio import AsyncEngine
from starlette.datastructures import MutableHeaders
from starlette.types import ASGIApp, Message, Receive, Scope, Send

_QUERY_START_KEY = "timing_query_start"


@dataclass
class RequestTimings:
    """Durations in milliseconds accumulated over one request."""

    db_connect_ms: float | None = None
    db_query_ms: float = 0.0
    db_queries: int = 0
    # Set while checking out a connection, so setup queries a fresh connection runs
    # count towards checkout rather than being reported twice.
    connecting: bool = False

    def header_value(self, total_ms: float) -> str:
        db_ms = self.db_query_ms + (self.db_connect_ms or 0.0)
        queries = f"{self.db_queries} {'query' if self.db_queries == 1 else 'queries'}"
        metrics = [f'db;dur={self.db_query_ms:.1f};desc="{queries}"']
        if self.db_connect_ms is not None:
            metrics.append(f'db-conn;dur={self.db_connect_ms:.1f};desc="connection checkout"')
        metrics.append(f"app;dur={max(total_ms - db_ms, 0.0):.1f}")
        metrics.append(f"total;dur={total_ms:.1f}")
        return ", ".join(metrics)


# A mutable object per request: SQLAlchemy runs event hooks in a greenlet that shares the
# request's context, so the hooks can add to it but could not rebind the variable.
_current: ContextVar[RequestTimings | None] = ContextVar("request_timings", default=None)


def _elapsed_ms(start: float) -> float:
    return (perf_counter() - start) * 1000


@contextmanager
def measure_db_connect() -> Iterator[None]:
    """Attribute the enclosed connection checkout to the current request."""
    timings = _current.get()
    if timings is None:
        yield
        return
    start = perf_counter()
    timings.connecting = True
    try:
        yield
    finally:
        timings.connecting = False
        timings.db_connect_ms = (timings.db_connect_ms or 0.0) + _elapsed_ms(start)


def instrument_engine(engine: AsyncEngine) -> None:
    """Record every statement's execution time on the request that issued it."""

    @event.listens_for(engine.sync_engine, "before_cursor_execute", named=True)
    def _before(conn: Connection, **_: Any) -> None:
        conn.info[_QUERY_START_KEY] = perf_counter()

    @event.listens_for(engine.sync_engine, "after_cursor_execute", named=True)
    def _after(conn: Connection, **_: Any) -> None:
        start = conn.info.pop(_QUERY_START_KEY, None)
        timings = _current.get()
        if start is None or timings is None or timings.connecting:
            return
        timings.db_query_ms += _elapsed_ms(start)
        timings.db_queries += 1


class ServerTimingMiddleware:
    """Adds a `Server-Timing` header to every HTTP response.

    Plain ASGI rather than `BaseHTTPMiddleware`, which runs the endpoint in a separate task
    and adds overhead to every request.
    """

    def __init__(self, app: ASGIApp) -> None:
        self.app = app

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        timings = RequestTimings()
        token = _current.set(timings)
        start = perf_counter()

        async def send_with_timing(message: Message) -> None:
            # Measured when headers go out: work done while streaming a body isn't included.
            if message["type"] == "http.response.start":
                headers = MutableHeaders(scope=message)
                headers.append("Server-Timing", timings.header_value(_elapsed_ms(start)))
            await send(message)

        try:
            await self.app(scope, receive, send_with_timing)
        finally:
            _current.reset(token)
