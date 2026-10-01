import pytest
from pydantic import ValidationError

from app.core.config import Settings


@pytest.mark.parametrize(
    ("given", "expected"),
    [
        (
            "postgresql://u:p@ep-x.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
            "postgresql+asyncpg://u:p@ep-x.aws.neon.tech/neondb?ssl=require",
        ),
        ("postgres://u:p@host:5432/db", "postgresql+asyncpg://u:p@host:5432/db"),
        (
            "postgresql+asyncpg://u:p@localhost:5432/a17",
            "postgresql+asyncpg://u:p@localhost:5432/a17",
        ),
    ],
)
def test_database_url_is_normalized_for_asyncpg(given: str, expected: str) -> None:
    settings = Settings(database_url=given, _env_file=None)  # type: ignore[call-arg]

    assert str(settings.database_url) == expected


def test_database_url_keeps_special_characters_in_password() -> None:
    settings = Settings(database_url="postgresql://u:p%40ss@host/db", _env_file=None)  # type: ignore[call-arg]

    assert str(settings.database_url) == "postgresql+asyncpg://u:p%40ss@host/db"


def test_production_refuses_the_dev_jwt_secret() -> None:
    with pytest.raises(ValidationError, match="JWT_SECRET"):
        Settings(database_url="postgresql://u:p@h/db", environment="production", _env_file=None)


def test_production_refuses_a_short_jwt_secret() -> None:
    with pytest.raises(ValidationError, match="JWT_SECRET"):
        Settings(
            database_url="postgresql://u:p@h/db",
            environment="production",
            jwt_secret="too-short",
            _env_file=None,
        )


def test_production_accepts_a_long_random_jwt_secret() -> None:
    settings = Settings(
        database_url="postgresql://u:p@h/db",
        environment="production",
        jwt_secret="s" * 48,
        _env_file=None,
    )

    assert settings.jwt_secret.get_secret_value() == "s" * 48
