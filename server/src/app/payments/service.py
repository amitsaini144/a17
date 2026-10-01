from collections.abc import Callable
from datetime import UTC, datetime, timedelta

import structlog

from app.auth.models import User
from app.cart.schemas import CartItem
from app.cart.service import CartService
from app.core.exceptions import (
    BadRequestError,
    ConflictError,
    InvalidRequestError,
    NotFoundError,
    ServiceUnavailableError,
)
from app.orders.models import Order, OrderItem, OrderStatus
from app.orders.repository import OrderRepository
from app.orders.schemas import OrderRead
from app.orders.service import can_transition, order_read
from app.payments.gateway import (
    CheckoutLineItem,
    CheckoutSessionData,
    InvalidWebhookError,
    PaymentGateway,
    PaymentProviderError,
)
from app.payments.repository import StripeEventRepository
from app.storage.service import public_url

logger = structlog.get_logger()


def _utcnow() -> datetime:
    return datetime.now(UTC)


class CheckoutService:
    def __init__(
        self,
        *,
        cart: CartService,
        orders: OrderRepository,
        gateway: PaymentGateway,
        site_url: str,
        session_ttl: timedelta,
        clock: Callable[[], datetime] = _utcnow,
    ) -> None:
        self._cart = cart
        self._orders = orders
        self._gateway = gateway
        self._site_url = site_url.rstrip("/")
        self._session_ttl = session_ttl
        self._clock = clock

    async def start(self, user: User, items: list[CartItem]) -> str:
        """Create a pending order priced from the database and a Stripe Checkout page for it.

        Returns the Stripe-hosted URL to send the shopper to.
        """
        priced = await self._cart.price(items)
        if priced.unavailable_slugs:
            # The shopper must see the updated cart before paying for something different.
            raise ConflictError("Some products in your cart are no longer available")
        if not priced.lines or priced.currency is None:
            raise InvalidRequestError("Your cart is empty")

        order = Order(
            user_id=user.id,
            status=OrderStatus.PENDING,
            currency=priced.currency,
            subtotal_cents=priced.subtotal_cents,
            items=[
                OrderItem(
                    product_id=line.product.id,
                    product_slug=line.product.slug,
                    product_name=line.product.name,
                    product_image_key=line.product.image_key,
                    unit_price_cents=line.product.price_cents,
                    quantity=line.quantity,
                    line_total_cents=line.line_total_cents,
                )
                for line in priced.lines
            ],
        )
        await self._orders.add(order)
        # Committed before calling Stripe, so the order Stripe refers to always exists.
        await self._orders.commit()

        line_items = [
            CheckoutLineItem(
                name=item.product_name,
                unit_amount_cents=item.unit_price_cents,
                quantity=item.quantity,
                image_url=_absolute_or_none(public_url(item.product_image_key)),
            )
            for item in order.items
        ]
        try:
            checkout = await self._gateway.create_checkout_session(
                order_id=order.id,
                currency=order.currency,
                line_items=line_items,
                customer_email=user.email,
                success_url=f"{self._site_url}/checkout/success?session_id={{CHECKOUT_SESSION_ID}}",
                cancel_url=f"{self._site_url}/cart",
                expires_at=self._clock() + self._session_ttl,
            )
        except PaymentProviderError as exc:
            order.status = OrderStatus.CANCELLED
            await self._orders.commit()
            raise ServiceUnavailableError(
                "Payments are unavailable right now, please try again"
            ) from exc

        order.stripe_checkout_session_id = checkout.session_id
        await self._orders.commit()
        logger.info("checkout_started", order_id=order.id, user_id=user.id)
        return checkout.url

    async def get_order_for_session(self, user: User, session_id: str) -> OrderRead:
        order = await self._orders.get_by_checkout_session(session_id, user_id=user.id)
        if order is None:
            raise NotFoundError("Order not found")
        return order_read(order)


class WebhookService:
    def __init__(
        self,
        *,
        events: StripeEventRepository,
        orders: OrderRepository,
        gateway: PaymentGateway,
        clock: Callable[[], datetime] = _utcnow,
    ) -> None:
        self._events = events
        self._orders = orders
        self._gateway = gateway
        self._clock = clock

    async def handle(self, payload: bytes, signature: str | None) -> None:
        try:
            event = self._gateway.parse_webhook(payload, signature)
        except InvalidWebhookError as exc:
            raise BadRequestError("Invalid webhook signature") from exc

        # Recorded in the same transaction as its effect, so each event applies exactly once.
        if not await self._events.record(event.id, event.type):
            logger.info("stripe_event_duplicate", event_id=event.id)
            return

        session = event.checkout_session
        if session is not None:
            if (
                event.type == "checkout.session.completed" and session.payment_status == "paid"
            ) or event.type == "checkout.session.async_payment_succeeded":
                await self._mark_paid(session)
            elif event.type in {
                "checkout.session.expired",
                "checkout.session.async_payment_failed",
            }:
                await self._cancel(session)
            # `completed` with payment_status "unpaid" (delayed methods): wait for the async event.

        await self._orders.commit()

    async def _mark_paid(self, session: CheckoutSessionData) -> None:
        order = await self._order_for(session)
        if order is None or not can_transition(order, OrderStatus.PAID):
            return
        order.status = OrderStatus.PAID
        order.paid_at = self._clock()
        order.stripe_payment_intent_id = session.payment_intent_id
        order.amount_total_cents = session.amount_total_cents
        if session.amount_total_cents != order.subtotal_cents:
            # Expected only once tax or shipping are added at Stripe; worth a look otherwise.
            logger.warning(
                "order_amount_mismatch",
                order_id=order.id,
                charged=session.amount_total_cents,
                subtotal=order.subtotal_cents,
            )
        logger.info("order_paid", order_id=order.id)

    async def _cancel(self, session: CheckoutSessionData) -> None:
        order = await self._order_for(session)
        if order is not None and can_transition(order, OrderStatus.CANCELLED):
            order.status = OrderStatus.CANCELLED
            logger.info("order_cancelled", order_id=order.id)

    async def _order_for(self, session: CheckoutSessionData) -> Order | None:
        order = await self._orders.get_for_update(session.order_id) if session.order_id else None
        if order is None or order.stripe_checkout_session_id != session.session_id:
            # Acknowledged anyway (2xx), or Stripe would keep retrying an event we can't use.
            logger.warning("stripe_event_unknown_order", session_id=session.session_id)
            return None
        return order


def _absolute_or_none(url: str) -> str | None:
    # Stripe fetches product images itself, so it needs an absolute URL (not set in tests/dev).
    return url if url.startswith("https://") else None
