from typing import Annotated

from fastapi import APIRouter, Depends

from app.cart.schemas import CartQuote, CartQuoteRequest
from app.cart.service import CartService
from app.catalog.repository import CatalogRepository
from app.core.database import DbSession


def get_cart_service(session: DbSession) -> CartService:
    return CartService(CatalogRepository(session))


CartServiceDep = Annotated[CartService, Depends(get_cart_service)]

router = APIRouter(prefix="/cart", tags=["cart"])


# POST because the cart travels in the body, but nothing is stored: the cart itself lives in the
# browser, and anyone (logged in or not) can price one.
@router.post("/quote", response_model=CartQuote)
async def quote_cart(data: CartQuoteRequest, service: CartServiceDep) -> CartQuote:
    return await service.quote(data.items)
