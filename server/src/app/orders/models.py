from __future__ import annotations

from datetime import datetime
from enum import StrEnum

from sqlalchemy import CheckConstraint, DateTime, Enum, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.shared.models import TimestampMixin


class OrderStatus(StrEnum):
    PENDING = "pending"  # Stripe Checkout started, not paid yet
    PAID = "paid"  # payment confirmed by Stripe (webhook)
    FULFILLED = "fulfilled"  # shipped
    CANCELLED = "cancelled"  # checkout expired, payment failed, or cancelled


class Order(TimestampMixin, Base):
    __tablename__ = "orders"
    __table_args__ = (CheckConstraint("subtotal_cents >= 0", name="subtotal_cents_non_negative"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    # RESTRICT: orders are financial records and must outlive accidental user deletion.
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="RESTRICT"), index=True)
    status: Mapped[OrderStatus] = mapped_column(
        Enum(
            OrderStatus,
            name="order_status",
            native_enum=False,
            create_constraint=True,
            length=16,
            values_callable=lambda statuses: [status.value for status in statuses],
        ),
        default=OrderStatus.PENDING,
        server_default=OrderStatus.PENDING.value,
    )
    currency: Mapped[str] = mapped_column(String(3))
    # Sum of the order items, computed by the server at checkout.
    subtotal_cents: Mapped[int]
    # What Stripe actually charged (set when paid).
    amount_total_cents: Mapped[int | None]
    stripe_checkout_session_id: Mapped[str | None] = mapped_column(String(255), unique=True)
    stripe_payment_intent_id: Mapped[str | None] = mapped_column(String(255))
    paid_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    items: Mapped[list[OrderItem]] = relationship(
        back_populates="order", order_by="OrderItem.id", cascade="all, delete-orphan"
    )


class OrderItem(Base):
    """A product as it was bought. Name, image and price are copied, not referenced, so later
    catalog changes never rewrite past orders."""

    __tablename__ = "order_items"
    __table_args__ = (
        CheckConstraint("quantity > 0", name="quantity_positive"),
        CheckConstraint("unit_price_cents >= 0", name="unit_price_cents_non_negative"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    order_id: Mapped[int] = mapped_column(ForeignKey("orders.id", ondelete="CASCADE"), index=True)
    # Kept for reference; SET NULL so a product can still be removed from the catalog.
    product_id: Mapped[int | None] = mapped_column(
        ForeignKey("products.id", ondelete="SET NULL"), index=True
    )
    product_slug: Mapped[str] = mapped_column(String(128))
    product_name: Mapped[str] = mapped_column(String(200))
    product_image_key: Mapped[str] = mapped_column(String(512))
    unit_price_cents: Mapped[int]
    quantity: Mapped[int]
    line_total_cents: Mapped[int]

    order: Mapped[Order] = relationship(back_populates="items")
