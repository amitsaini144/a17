from typing import Annotated

from fastapi import APIRouter, Depends

from app.auth.dependencies import CurrentUser
from app.core.database import DbSession
from app.orders.repository import OrderRepository
from app.orders.schemas import OrderRead
from app.orders.service import OrderService


def get_order_service(session: DbSession) -> OrderService:
    return OrderService(OrderRepository(session))


OrderServiceDep = Annotated[OrderService, Depends(get_order_service)]

router = APIRouter(prefix="/orders", tags=["orders"])


@router.get("", response_model=list[OrderRead])
async def list_my_orders(user: CurrentUser, service: OrderServiceDep) -> list[OrderRead]:
    return await service.list_for_user(user.id)
