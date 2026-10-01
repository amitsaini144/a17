from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse


class AppError(Exception):
    """Base for domain errors raised by services; mapped to HTTP responses in one place."""

    status_code: int = 500
    code: str = "internal_error"

    def __init__(self, message: str, *, headers: dict[str, str] | None = None) -> None:
        super().__init__(message)
        self.message = message
        self.headers = headers


class NotFoundError(AppError):
    status_code = 404
    code = "not_found"


class DatabaseUnavailableError(AppError):
    status_code = 503
    code = "database_unavailable"


class AuthenticationError(AppError):
    """Missing, invalid or expired credentials."""

    status_code = 401
    code = "not_authenticated"


class ConflictError(AppError):
    status_code = 409
    code = "conflict"


class RateLimitedError(AppError):
    status_code = 429
    code = "rate_limited"

    def __init__(self, retry_after_seconds: int) -> None:
        super().__init__(
            "Too many requests, please try again later",
            headers={"Retry-After": str(retry_after_seconds)},
        )


def error_response(exc: AppError) -> JSONResponse:
    """The one error body format. Use directly only when a route must add to the response."""
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.message, "code": exc.code},
        headers=exc.headers,
    )


async def _handle_app_error(_: Request, exc: Exception) -> JSONResponse:
    assert isinstance(exc, AppError)  # noqa: S101 - narrowed by registration below
    return error_response(exc)


def register_exception_handlers(app: FastAPI) -> None:
    app.add_exception_handler(AppError, _handle_app_error)
