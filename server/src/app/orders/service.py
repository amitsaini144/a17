from app.orders.models import Order, OrderItem, OrderStatus
from app.orders.repository import OrderRepository
from app.orders.schemas import OrderItemRead, OrderRead
from app.storage.service import public_url

# The only status changes an order can make; anything else (e.g. paid -> pending from a late,
# out-of-order webhook) is ignored.
ALLOWED_TRANSITIONS: dict[OrderStatus, set[OrderStatus]] = {
    OrderStatus.PENDING: {OrderStatus.PAID, OrderStatus.CANCELLED},
    OrderStatus.PAID: {OrderStatus.FULFILLED},
    OrderStatus.FULFILLED: set(),
    OrderStatus.CANCELLED: set(),
}


def can_transition(order: Order, to: OrderStatus) -> bool:
    return to in ALLOWED_TRANSITIONS[order.status]


class OrderService:
    def __init__(self, repository: OrderRepository) -> None:
        self._repository = repository

    async def list_for_user(self, user_id: int) -> list[OrderRead]:
        return [order_read(order) for order in await self._repository.list_for_user(user_id)]


def order_read(order: Order) -> OrderRead:
    return OrderRead(
        id=order.id,
        status=order.status,
        currency=order.currency,
        subtotal_cents=order.subtotal_cents,
        amount_total_cents=order.amount_total_cents,
        created_at=order.created_at,
        paid_at=order.paid_at,
        items=[_item_read(item) for item in order.items],
    )


def _item_read(item: OrderItem) -> OrderItemRead:
    return OrderItemRead(
        product_slug=item.product_slug,
        product_name=item.product_name,
        image_url=public_url(item.product_image_key),
        unit_price_cents=item.unit_price_cents,
        quantity=item.quantity,
        line_total_cents=item.line_total_cents,
    )
