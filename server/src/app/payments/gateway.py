"""The boundary to the payment provider. Everything Stripe-specific lives here, behind a small
interface, so services stay provider-agnostic and tests can swap in a fake."""

from dataclasses import dataclass
from datetime import datetime
from typing import Any, Protocol

import structlog
from stripe import HTTPXClient, SignatureVerificationError, StripeClient, StripeError
from stripe.params.checkout import SessionCreateParams
from stripe.params.checkout import SessionCreateParamsLineItemPriceDataProductData as ProductData

logger = structlog.get_logger()


class PaymentProviderError(Exception):
    """The provider couldn't be reached or refused the request."""


class InvalidWebhookError(Exception):
    """The webhook payload or its signature is invalid."""


@dataclass(frozen=True)
class CheckoutLineItem:
    name: str
    unit_amount_cents: int
    quantity: int
    image_url: str | None


@dataclass(frozen=True)
class CreatedCheckout:
    session_id: str
    url: str


@dataclass(frozen=True)
class CheckoutSessionData:
    session_id: str
    # Our order id, echoed back from `client_reference_id`.
    order_id: int | None
    payment_status: str
    payment_intent_id: str | None
    amount_total_cents: int | None


@dataclass(frozen=True)
class WebhookEvent:
    id: str
    type: str
    # Set for `checkout.session.*` events, the only kind this app acts on.
    checkout_session: CheckoutSessionData | None


class PaymentGateway(Protocol):
    async def create_checkout_session(
        self,
        *,
        order_id: int,
        currency: str,
        line_items: list[CheckoutLineItem],
        customer_email: str,
        success_url: str,
        cancel_url: str,
        expires_at: datetime,
    ) -> CreatedCheckout: ...

    def parse_webhook(self, payload: bytes, signature: str | None) -> WebhookEvent: ...


class StripeGateway:
    def __init__(self, *, secret_key: str, webhook_secret: str) -> None:
        self._client = StripeClient(secret_key, http_client=HTTPXClient())
        self._webhook_secret = webhook_secret

    async def create_checkout_session(
        self,
        *,
        order_id: int,
        currency: str,
        line_items: list[CheckoutLineItem],
        customer_email: str,
        success_url: str,
        cancel_url: str,
        expires_at: datetime,
    ) -> CreatedCheckout:
        params: SessionCreateParams = {
            "mode": "payment",
            "client_reference_id": str(order_id),
            "metadata": {"order_id": str(order_id)},
            "customer_email": customer_email,
            "success_url": success_url,
            "cancel_url": cancel_url,
            "expires_at": int(expires_at.timestamp()),
            "line_items": [
                {
                    "quantity": item.quantity,
                    "price_data": {
                        "currency": currency.lower(),
                        # Prices come from our database, never from the client.
                        "unit_amount": item.unit_amount_cents,
                        "product_data": _product_data(item),
                    },
                }
                for item in line_items
            ],
        }
        try:
            # Idempotency key: a retried request for the same order can't create a second session.
            session = await self._client.v1.checkout.sessions.create_async(
                params, {"idempotency_key": f"checkout-order-{order_id}"}
            )
        except StripeError as exc:
            logger.error("stripe_checkout_create_failed", order_id=order_id, error=str(exc))
            raise PaymentProviderError(str(exc)) from exc
        if not session.url:
            raise PaymentProviderError("Stripe returned a session without a URL")
        return CreatedCheckout(session_id=session.id, url=session.url)

    def parse_webhook(self, payload: bytes, signature: str | None) -> WebhookEvent:
        try:
            event = self._client.construct_event(payload, signature, self._webhook_secret)
        except (SignatureVerificationError, ValueError) as exc:
            raise InvalidWebhookError(str(exc)) from exc

        checkout_session = None
        if event.type.startswith("checkout.session."):
            # Stripe objects aren't dicts (since SDK v13); read them as plain data.
            checkout_session = _checkout_session_data(event.data.object.to_dict())
        return WebhookEvent(id=event.id, type=event.type, checkout_session=checkout_session)


def _product_data(item: CheckoutLineItem) -> ProductData:
    data: ProductData = {"name": item.name}
    if item.image_url:
        data["images"] = [item.image_url]
    return data


def _checkout_session_data(obj: dict[str, Any]) -> CheckoutSessionData:
    reference = obj.get("client_reference_id")
    payment_intent = obj.get("payment_intent")
    return CheckoutSessionData(
        session_id=obj["id"],
        order_id=int(reference) if isinstance(reference, str) and reference.isdigit() else None,
        payment_status=obj.get("payment_status") or "",
        payment_intent_id=payment_intent if isinstance(payment_intent, str) else None,
        amount_total_cents=obj.get("amount_total"),
    )
