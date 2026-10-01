"""Session cookies. Tokens only ever travel in httpOnly cookies, never in response bodies, so page
scripts (and anything injected into them) can't read them. Only the session hint is readable."""

from fastapi import Response

from app.auth.service import IssuedTokens
from app.core.config import Settings

ACCESS_COOKIE = "access_token"
REFRESH_COOKIE = "refresh_token"
# Holds no secret ("1"): tells the UI that a login session (a refresh token) exists. The UI's
# route guard can't see the refresh cookie, which is only sent to the auth endpoints, and page
# scripts read this one to skip auth calls entirely for visitors who aren't logged in.
SESSION_HINT_COOKIE = "session"


def _refresh_cookie_path(settings: Settings) -> str:
    # Sent only to the auth endpoints, not with every API and page request.
    return f"{settings.api_v1_prefix}/auth"


def set_session_cookies(response: Response, tokens: IssuedTokens, settings: Settings) -> None:
    response.set_cookie(
        ACCESS_COOKIE,
        tokens.access_token,
        max_age=settings.access_token_ttl_minutes * 60,
        path="/",
        secure=settings.cookie_secure,
        httponly=True,
        samesite="lax",
    )
    response.set_cookie(
        REFRESH_COOKIE,
        tokens.refresh_token,
        max_age=settings.refresh_token_ttl_days * 24 * 60 * 60,
        path=_refresh_cookie_path(settings),
        secure=settings.cookie_secure,
        httponly=True,
        samesite="lax",
    )
    response.set_cookie(
        SESSION_HINT_COOKIE,
        "1",
        max_age=settings.refresh_token_ttl_days * 24 * 60 * 60,
        path="/",
        secure=settings.cookie_secure,
        httponly=False,
        samesite="lax",
    )


def clear_session_cookies(response: Response, settings: Settings) -> None:
    # Attributes must match the ones the cookies were set with, or browsers keep them.
    response.delete_cookie(
        ACCESS_COOKIE, path="/", secure=settings.cookie_secure, httponly=True, samesite="lax"
    )
    response.delete_cookie(
        REFRESH_COOKIE,
        path=_refresh_cookie_path(settings),
        secure=settings.cookie_secure,
        httponly=True,
        samesite="lax",
    )
    response.delete_cookie(
        SESSION_HINT_COOKIE, path="/", secure=settings.cookie_secure, httponly=False, samesite="lax"
    )
