from datetime import UTC, datetime, timedelta

from app.core.security import (
    create_access_token,
    decode_access_token,
    hash_password,
    hash_refresh_token,
    verify_password,
)

SECRET = "test-secret-" + "x" * 32


async def test_password_hash_verifies_only_the_right_password() -> None:
    password_hash = await hash_password("correct horse battery")

    assert password_hash.startswith("$argon2id$")
    assert await verify_password(password_hash, "correct horse battery")
    assert not await verify_password(password_hash, "wrong")


async def test_missing_hash_never_verifies() -> None:
    assert not await verify_password(None, "anything")


def test_access_token_round_trips_subject() -> None:
    token = create_access_token(
        subject="42", secret=SECRET, issued_at=datetime.now(UTC), ttl=timedelta(minutes=5)
    )

    assert decode_access_token(token, secret=SECRET) == "42"


def test_access_token_signed_with_another_secret_is_rejected() -> None:
    token = create_access_token(
        subject="42", secret=SECRET, issued_at=datetime.now(UTC), ttl=timedelta(minutes=5)
    )

    assert decode_access_token(token, secret=SECRET + "-other") is None


def test_expired_access_token_is_rejected() -> None:
    token = create_access_token(
        subject="42",
        secret=SECRET,
        issued_at=datetime.now(UTC) - timedelta(minutes=10),
        ttl=timedelta(minutes=5),
    )

    assert decode_access_token(token, secret=SECRET) is None


def test_refresh_token_hash_is_stable_and_not_the_token() -> None:
    assert hash_refresh_token("abc") == hash_refresh_token("abc")
    assert hash_refresh_token("abc") != "abc"
    assert len(hash_refresh_token("abc")) == 64
