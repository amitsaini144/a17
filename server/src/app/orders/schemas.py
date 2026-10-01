from datetime import datetime

from pydantic import BaseModel

from app.orders.models import OrderStatus


class OrderItemRead(BaseModel):
    product_slug: str
    product_name: str
    image_url: str
    unit_price_cents: int
    quantity: int
    line_total_cents: int


class OrderRead(BaseModel):
    id: int
    status: OrderStatus
    currency: str
    subtotal_cents: int
    amount_total_cents: int | None
    created_at: datetime
    paid_at: datetime | None
    items: list[OrderItemRead]
