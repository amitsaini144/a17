from typing import Annotated

from fastapi import Cookie, Depends

from app.auth.cookies import ACCESS_COOKIE
from app.auth.models import User
from app.auth.repository import AuthRepository
from app.auth.service import AuthService
from app.core.config import get_settings
from app.core.database import DbSession


def get_auth_service(session: DbSession) -> AuthService:
    return AuthService(AuthRepository(session), get_settings())


AuthServiceDep = Annotated[AuthService, Depends(get_auth_service)]


async def get_current_user(
    service: AuthServiceDep,
    access_token: Annotated[str | None, Cookie(alias=ACCESS_COOKIE)] = None,
) -> User:
    return await service.get_current_user(access_token)


# Add to any route that requires a logged-in user (checkout, order history, ...).
CurrentUser = Annotated[User, Depends(get_current_user)]
