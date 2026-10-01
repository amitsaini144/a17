from http.cookies import SimpleCookie

import pytest
from httpx import AsyncClient, Response
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.models import User
from app.core.security import hash_password

PASSWORD = "correct horse battery"


def set_cookies(response: Response) -> SimpleCookie:
    cookies: SimpleCookie = SimpleCookie()
    for header in response.headers.get_list("set-cookie"):
        cookies.load(header)
    return cookies


async def register(client: AsyncClient, email: str = "ada@example.com") -> Response:
    return await client.post("/api/v1/auth/register", json={"email": email, "password": PASSWORD})


async def create_user(session: AsyncSession, email: str, *, is_active: bool = True) -> None:
    session.add(User(email=email, password_hash=await hash_password(PASSWORD), is_active=is_active))
    await session.flush()


async def test_register_creates_account_and_logs_in(client: AsyncClient) -> None:
    response = await register(client, "  Ada@Example.COM ")

    assert response.status_code == 201
    assert response.json() == {"email": "ada@example.com"}
    me = await client.get("/api/v1/auth/me")
    assert me.status_code == 200
    assert me.json() == {"email": "ada@example.com"}


async def test_session_cookies_are_httponly_secure_and_lax(client: AsyncClient) -> None:
    cookies = set_cookies(await register(client))

    for name in ("access_token", "refresh_token"):
        assert cookies[name]["httponly"] is True
        assert cookies[name]["secure"] is True
        assert cookies[name]["samesite"] == "lax"
    assert cookies["access_token"]["path"] == "/"
    # The refresh token is only ever sent to the auth endpoints.
    assert cookies["refresh_token"]["path"] == "/api/v1/auth"


async def test_tokens_are_never_in_the_response_body(client: AsyncClient) -> None:
    response = await register(client)

    assert set(response.json()) == {"email"}


async def test_register_rejects_taken_email_case_insensitively(client: AsyncClient) -> None:
    await register(client, "ada@example.com")

    response = await register(client, "ADA@example.com")

    assert response.status_code == 409
    assert response.json()["code"] == "conflict"


@pytest.mark.parametrize(
    "payload",
    [
        {"email": "not-an-email", "password": PASSWORD},
        {"email": "ada@example.com", "password": "short"},
        {"email": "ada@example.com", "password": "x" * 129},
    ],
)
async def test_register_validates_input(client: AsyncClient, payload: dict[str, str]) -> None:
    response = await client.post("/api/v1/auth/register", json=payload)

    assert response.status_code == 422


async def test_login_with_correct_password(client: AsyncClient, db_session: AsyncSession) -> None:
    await create_user(db_session, "ada@example.com")

    response = await client.post(
        "/api/v1/auth/login", json={"email": "Ada@example.com", "password": PASSWORD}
    )

    assert response.status_code == 200
    assert response.json() == {"email": "ada@example.com"}
    assert {"access_token", "refresh_token"} <= set(set_cookies(response))


async def test_login_errors_do_not_reveal_whether_the_email_exists(
    client: AsyncClient, db_session: AsyncSession
) -> None:
    await create_user(db_session, "ada@example.com")

    wrong_password = await client.post(
        "/api/v1/auth/login", json={"email": "ada@example.com", "password": "wrong password"}
    )
    unknown_email = await client.post(
        "/api/v1/auth/login", json={"email": "bob@example.com", "password": PASSWORD}
    )

    assert wrong_password.status_code == unknown_email.status_code == 401
    assert wrong_password.json() == unknown_email.json()
    assert "set-cookie" not in wrong_password.headers


async def test_inactive_user_cannot_log_in(client: AsyncClient, db_session: AsyncSession) -> None:
    await create_user(db_session, "ada@example.com", is_active=False)

    response = await client.post(
        "/api/v1/auth/login", json={"email": "ada@example.com", "password": PASSWORD}
    )

    assert response.status_code == 401


async def test_me_requires_a_valid_access_token(client: AsyncClient) -> None:
    anonymous = await client.get("/api/v1/auth/me")
    client.cookies.set("access_token", "not.a.jwt", domain="test")
    forged = await client.get("/api/v1/auth/me")

    assert anonymous.status_code == forged.status_code == 401
    assert anonymous.json()["code"] == "not_authenticated"


async def test_refresh_rotates_the_refresh_token(client: AsyncClient) -> None:
    first = set_cookies(await register(client))["refresh_token"].value

    response = await client.post("/api/v1/auth/refresh")

    assert response.status_code == 204
    rotated = set_cookies(response)["refresh_token"].value
    assert rotated != first
    assert (await client.get("/api/v1/auth/me")).status_code == 200


async def test_refresh_without_cookie_is_rejected(client: AsyncClient) -> None:
    response = await client.post("/api/v1/auth/refresh")

    assert response.status_code == 401


async def test_logout_clears_cookies_and_ends_the_session(client: AsyncClient) -> None:
    refresh_token = set_cookies(await register(client))["refresh_token"].value

    response = await client.post("/api/v1/auth/logout")

    assert response.status_code == 204
    cleared = set_cookies(response)
    assert cleared["access_token"]["max-age"] == "0"
    assert cleared["refresh_token"]["max-age"] == "0"
    # Even a saved copy of the refresh token no longer works.
    client.cookies.set("refresh_token", refresh_token, domain="test", path="/api/v1/auth")
    assert (await client.post("/api/v1/auth/refresh")).status_code == 401


async def test_logout_without_session_succeeds(client: AsyncClient) -> None:
    response = await client.post("/api/v1/auth/logout")

    assert response.status_code == 204


async def test_login_is_rate_limited_per_email(
    client: AsyncClient, db_session: AsyncSession
) -> None:
    await create_user(db_session, "ada@example.com")
    attempt = {"email": "ada@example.com", "password": "wrong password"}
    for _ in range(10):
        assert (await client.post("/api/v1/auth/login", json=attempt)).status_code == 401

    response = await client.post("/api/v1/auth/login", json=attempt)

    assert response.status_code == 429
    assert response.json()["code"] == "rate_limited"
    assert int(response.headers["retry-after"]) > 0
