"""Import every ORM model so `Base.metadata` is complete (used by Alembic and tests)."""

from app.auth.models import RefreshToken, User
from app.catalog.models import Category, CategoryFeature, Product, ProductImage
from app.orders.models import Order, OrderItem
from app.payments.models import StripeEvent

__all__ = [
    "Category",
    "CategoryFeature",
    "Order",
    "OrderItem",
    "Product",
    "ProductImage",
    "RefreshToken",
    "StripeEvent",
    "User",
]
