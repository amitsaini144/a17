from functools import lru_cache
from typing import Literal, Self

from pydantic import PostgresDsn, SecretStr, field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict
from sqlalchemy.engine import make_url

# Lets the app run locally and in tests without setup; refused in production (see below).
_DEV_JWT_SECRET = "dev-only-insecure-jwt-secret-change-me"  # noqa: S105 - refused in production
_MIN_JWT_SECRET_LENGTH = 32


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

    # Auth. The access token is a short-lived JWT; the refresh token is an opaque random value
    # stored hashed in the database, so sessions can be revoked.
    jwt_secret: SecretStr = SecretStr(_DEV_JWT_SECRET)
    access_token_ttl_minutes: int = 15
    refresh_token_ttl_days: int = 30
    # Browsers treat http://localhost as secure, so Secure cookies work in local dev too.
    cookie_secure: bool = True

    # `limits` storage URI. In-memory suits a single instance; use `async+redis://...` once the
    # API runs more than one, so all instances share the counters.
    rate_limit_storage_uri: str = "async+memory://"

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

    @model_validator(mode="after")
    def _require_real_jwt_secret_in_production(self) -> Self:
        secret = self.jwt_secret.get_secret_value()
        if self.is_production and (
            secret == _DEV_JWT_SECRET or len(secret) < _MIN_JWT_SECRET_LENGTH
        ):
            raise ValueError(
                f"JWT_SECRET must be set to a random value of at least {_MIN_JWT_SECRET_LENGTH} "
                "characters in production"
            )
        return self

    @property
    def is_production(self) -> bool:
        return self.environment == "production"


@lru_cache
def get_settings() -> Settings:
    return Settings()
