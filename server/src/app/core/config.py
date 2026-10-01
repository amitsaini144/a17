from functools import lru_cache
from typing import Literal

from pydantic import PostgresDsn, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict
from sqlalchemy.engine import make_url


class Settings(BaseSettings):
    """Application settings, loaded from environment variables (and `.env` locally)."""

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    project_name: str = "a17 API"
    environment: Literal["local", "test", "staging", "production"] = "local"
    debug: bool = False
    api_v1_prefix: str = "/api/v1"

    database_url: PostgresDsn
    cors_origins: list[str] = []

    # Public base URL for stored assets: the CloudFront domain in front of the S3 bucket.
    # Empty yields root-relative URLs like `/images/...` (used by the tests only).
    assets_base_url: str = ""

    @field_validator("database_url", mode="before")
    @classmethod
    def _to_asyncpg_url(cls, value: object) -> object:
        """Accept provider URLs as copied (e.g. Neon's `postgresql://...?sslmode=require`).

        asyncpg needs the `postgresql+asyncpg` scheme and takes `ssl` rather than libpq's
        `sslmode`; it doesn't support `channel_binding`.
        """
        if not isinstance(value, str):
            return value
        url = make_url(value)
        if url.drivername in {"postgres", "postgresql"}:
            url = url.set(drivername="postgresql+asyncpg")
        query = dict(url.query)
        query.pop("channel_binding", None)
        sslmode = query.pop("sslmode", None)
        if sslmode is not None and "ssl" not in query:
            query["ssl"] = sslmode
        return url.set(query=query).render_as_string(hide_password=False)

    @property
    def is_production(self) -> bool:
        return self.environment == "production"


@lru_cache
def get_settings() -> Settings:
    return Settings()
