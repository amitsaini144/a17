from typing import Annotated

from fastapi import APIRouter, Cookie, Request, Response, status
from limits import RateLimitItemPerHour, RateLimitItemPerMinute

from app.auth.cookies import REFRESH_COOKIE, clear_session_cookies, set_session_cookies
from app.auth.dependencies import AuthServiceDep, CurrentUser
from app.auth.schemas import LoginRequest, RegisterRequest, UserRead
from app.core.config import get_settings
from app.core.exceptions import AuthenticationError, error_response
from app.core.rate_limit import client_ip, enforce

# Per-account limits are what stop password guessing (they hold however many IPs an attacker
# uses); per-IP limits slow down sweeps across many accounts.
LOGIN_PER_EMAIL = RateLimitItemPerMinute(10, 15)
LOGIN_PER_IP = RateLimitItemPerMinute(30)
REGISTER_PER_IP = RateLimitItemPerHour(10)
REFRESH_PER_IP = RateLimitItemPerMinute(60)

RefreshCookie = Annotated[str | None, Cookie(alias=REFRESH_COOKIE)]

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
async def register(
    data: RegisterRequest, request: Request, response: Response, service: AuthServiceDep
) -> UserRead:
    await enforce(REGISTER_PER_IP, "register", client_ip(request))
    session = await service.register(data)
    set_session_cookies(response, session.tokens, get_settings())
    return session.user


@router.post("/login", response_model=UserRead)
async def login(
    data: LoginRequest, request: Request, response: Response, service: AuthServiceDep
) -> UserRead:
    await enforce(LOGIN_PER_IP, "login-ip", client_ip(request))
    await enforce(LOGIN_PER_EMAIL, "login-email", data.email)
    session = await service.login(data)
    set_session_cookies(response, session.tokens, get_settings())
    return session.user


@router.post("/refresh", status_code=status.HTTP_204_NO_CONTENT)
async def refresh(
    request: Request, service: AuthServiceDep, refresh_token: RefreshCookie = None
) -> Response:
    await enforce(REFRESH_PER_IP, "refresh", client_ip(request))
    try:
        tokens = await service.refresh(refresh_token)
    except AuthenticationError as exc:
        # The session is over: drop its cookies too, or the UI's route guard (which only sees
        # the session hint cookie) would keep treating the browser as logged in.
        error = error_response(exc)
        clear_session_cookies(error, get_settings())
        return error
    response = Response(status_code=status.HTTP_204_NO_CONTENT)
    set_session_cookies(response, tokens, get_settings())
    return response


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(service: AuthServiceDep, refresh_token: RefreshCookie = None) -> Response:
    await service.logout(refresh_token)
    response = Response(status_code=status.HTTP_204_NO_CONTENT)
    clear_session_cookies(response, get_settings())
    return response


@router.get("/me", response_model=UserRead)
async def me(user: CurrentUser) -> UserRead:
    return UserRead(email=user.email)
