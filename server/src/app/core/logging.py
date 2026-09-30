import logging

import structlog

from app.core.config import Settings


def configure_logging(settings: Settings) -> None:
    """Human-readable logs locally, JSON everywhere else."""
    level = logging.DEBUG if settings.debug else logging.INFO
    renderer: structlog.types.Processor = (
        structlog.dev.ConsoleRenderer()
        if settings.environment == "local"
        else structlog.processors.JSONRenderer()
    )
    structlog.configure(
        processors=[
            structlog.contextvars.merge_contextvars,
            structlog.processors.add_log_level,
            structlog.processors.TimeStamper(fmt="iso"),
            structlog.processors.StackInfoRenderer(),
            structlog.processors.format_exc_info,
            renderer,
        ],
        wrapper_class=structlog.make_filtering_bound_logger(level),
        cache_logger_on_first_use=True,
    )
