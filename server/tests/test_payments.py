import hashlib
import hmac
import json
import time
from collections.abc import Iterator
from datetime import datetime

import pytest
from httpx import AsyncClient, Response
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.main import app
from app.orders.models import Order, OrderStatus
from app.payments.dependencies import get_payment_gateway
from app.payments.gateway import (
    CheckoutLineItem,
    CreatedCheckout,
    PaymentProviderError,
    StripeGateway,
    WebhookEvent,
)
from app.payments.models import StripeEvent
from tests.factories import create_category, create_product

WEBHOOK_SECRET = "whsec_test_secret"


class FakeGateway:
    """Stands in for Stripe's API. Webhook parsing is the real Stripe code (signature included)."""

    def __init__(self) -> None:
        self.created: list[dict[str, object]] = []
        self.fail = False
        self._real = StripeGateway(secret_key="sk_test_unused", webhook_secret=WEBHOOK_SECRET)

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
        if self.fail:
            raise PaymentProviderError("Stripe is down")
        self.created.append(
            {
                "order_id": order_id,
                "currency": currency,
                "line_items": line_items,
                "customer_email": customer_email,
                "success_url": success_url,
                "cancel_url": cancel_url,
            }
        )
        return CreatedCheckout(
            session_id=f"cs_test_{order_id}", url=f"https://checkout.stripe.test/{order_id}"
        )

    def parse_webhook(self, payload: bytes, signature: str | None) -> WebhookEvent:
        return self._real.parse_webhook(payload, signature)


@pytest.fixture
def gateway(monkeypatch: pytest.MonkeyPatch) -> Iterator[FakeGateway]:
    fake = FakeGateway()
    monkeypatch.setattr(get_settings(), "public_site_url", "https://shop.test")
    app.dependency_overrides[get_payment_gateway] = lambda: fake
    yield fake
    app.dependency_overrides.pop(get_payment_gateway, None)


async def log_in(client: AsyncClient, email: str = "ada@example.com") -> None:
    response = await client.post(
        "/api/v1/auth/register", json={"email": email, "password": "correct horse battery"}
    )
    assert response.status_code == 201


async def seed_products(session: AsyncSession) -> None:
    phones = await create_category(session, slug="phone")
    await create_product(session, phones, slug="iphone", name="iPhone", price_cents=99_900)
    await create_product(session, phones, slug="case", name="Case", price_cents=2_500)


async def checkout(client: AsyncClient, items: list[dict[str, object]]) -> Response:
    return await client.post("/api/v1/checkout/sessions", json={"items": items})


def signed(event: dict[str, object], secret: str = WEBHOOK_SECRET) -> tuple[bytes, str]:
    """Sign a payload the way Stripe does: HMAC-SHA256 over "<timestamp>.<body>"."""
    payload = json.dumps(event).encode()
    timestamp = int(time.time())
    signature = hmac.new(
        secret.encode(), f"{timestamp}.".encode() + payload, hashlib.sha256
    ).hexdigest()
    return payload, f"t={timestamp},v1={signature}"


def session_event(
    event_id: str,
    event_type: str,
    order_id: int,
    *,
    payment_status: str = "paid",
    amount_total: int = 104_900,
) -> dict[str, object]:
    return {
        "id": event_id,
        "object": "event",
        "type": event_type,
        "data": {
            "object": {
                "id": f"cs_test_{order_id}",
                "object": "checkout.session",
                "client_reference_id": str(order_id),
                "payment_status": payment_status,
                "payment_intent": "pi_test_1",
                "amount_total": amount_total,
            }
        },
    }


async def deliver(client: AsyncClient, event: dict[str, object]) -> Response:
    payload, signature = signed(event)
    return await client.post(
        "/api/v1/payments/stripe/webhook",
        content=payload,
        headers={"Stripe-Signature": signature, "Content-Type": "application/json"},
    )


async def start_paid_flow(client: AsyncClient, session: AsyncSession) -> int:
    await seed_products(session)
    await log_in(client)
    response = await checkout(
        client, [{"slug": "iphone", "quantity": 1}, {"slug": "case", "quantity": 2}]
    )
    assert response.status_code == 200
    order_id: int = (await session.scalars(select(Order.id))).one()
    return order_id


async def test_checkout_requires_login(client: AsyncClient, gateway: FakeGateway) -> None:
    response = await checkout(client, [{"slug": "iphone", "quantity": 1}])

    assert response.status_code == 401
    assert gateway.created == []


async def test_checkout_creates_pending_order_priced_by_the_server(
    client: AsyncClient, db_session: AsyncSession, gateway: FakeGateway
) -> None:
    await seed_products(db_session)
    await log_in(client)

    response = await checkout(
        client,
        [{"slug": "iphone", "quantity": 1, "price_cents": 1}, {"slug": "case", "quantity": 2}],
    )

    assert response.status_code == 200
    assert response.json() == {
        "url": f"https://checkout.stripe.test/{gateway.created[0]['order_id']}"
    }
    order = (await db_session.scalars(select(Order))).one()
    await db_session.refresh(order, ["items"])
    assert order.status == OrderStatus.PENDING
    assert order.subtotal_cents == 104_900
    assert order.stripe_checkout_session_id == f"cs_test_{order.id}"
    assert [(i.product_name, i.unit_price_cents, i.quantity) for i in order.items] == [
        ("iPhone", 99_900, 1),
        ("Case", 2_500, 2),
    ]
    sent = gateway.created[0]
    assert sent["customer_email"] == "ada@example.com"
    assert (
        sent["success_url"] == "https://shop.test/checkout/success?session_id={CHECKOUT_SESSION_ID}"
    )
    assert sent["cancel_url"] == "https://shop.test/cart"
    assert [(li.name, li.unit_amount_cents, li.quantity) for li in sent["line_items"]] == [  # type: ignore[attr-defined]
        ("iPhone", 99_900, 1),
        ("Case", 2_500, 2),
    ]


async def test_checkout_refuses_unavailable_products(
    client: AsyncClient, db_session: AsyncSession, gateway: FakeGateway
) -> None:
    await seed_products(db_session)
    await log_in(client)

    response = await checkout(
        client, [{"slug": "iphone", "quantity": 1}, {"slug": "gone", "quantity": 1}]
    )

    assert response.status_code == 409
    assert gateway.created == []


async def test_checkout_refuses_an_empty_cart(client: AsyncClient, gateway: FakeGateway) -> None:
    await log_in(client)

    response = await checkout(client, [])

    assert response.status_code == 422


async def test_provider_failure_cancels_the_order(
    client: AsyncClient, db_session: AsyncSession, gateway: FakeGateway
) -> None:
    await seed_products(db_session)
    await log_in(client)
    gateway.fail = True

    response = await checkout(client, [{"slug": "iphone", "quantity": 1}])

    assert response.status_code == 503
    order = (await db_session.scalars(select(Order))).one()
    assert order.status == OrderStatus.CANCELLED


async def test_checkout_without_payment_config_is_unavailable(
    client: AsyncClient, db_session: AsyncSession, monkeypatch: pytest.MonkeyPatch
) -> None:
    monkeypatch.setattr(get_settings(), "stripe_secret_key", None)
    await seed_products(db_session)
    await log_in(client)

    response = await checkout(client, [{"slug": "iphone", "quantity": 1}])

    assert response.status_code == 503


async def test_webhook_rejects_a_bad_signature(client: AsyncClient, gateway: FakeGateway) -> None:
    payload, signature = signed(session_event("evt_1", "checkout.session.completed", 1), "wrong")

    response = await client.post(
        "/api/v1/payments/stripe/webhook", content=payload, headers={"Stripe-Signature": signature}
    )

    assert response.status_code == 400


async def test_paid_webhook_marks_the_order_paid(
    client: AsyncClient, db_session: AsyncSession, gateway: FakeGateway
) -> None:
    order_id = await start_paid_flow(client, db_session)

    response = await deliver(client, session_event("evt_1", "checkout.session.completed", order_id))

    assert response.status_code == 200
    order = await client.get(f"/api/v1/checkout/sessions/cs_test_{order_id}")
    assert order.status_code == 200
    body = order.json()
    assert body["status"] == "paid"
    assert body["amount_total_cents"] == 104_900
    assert body["paid_at"] is not None
    orders = (await client.get("/api/v1/orders")).json()
    assert [(o["id"], o["status"], len(o["items"])) for o in orders] == [(order_id, "paid", 2)]


async def test_redelivered_webhook_is_applied_once(
    client: AsyncClient, db_session: AsyncSession, gateway: FakeGateway
) -> None:
    order_id = await start_paid_flow(client, db_session)
    event = session_event("evt_1", "checkout.session.completed", order_id)

    first = await deliver(client, event)
    second = await deliver(client, event)

    assert first.status_code == second.status_code == 200
    recorded = await db_session.scalar(select(func.count()).select_from(StripeEvent))
    assert recorded == 1


async def test_expired_checkout_cancels_and_a_late_payment_cannot_revive_it(
    client: AsyncClient, db_session: AsyncSession, gateway: FakeGateway
) -> None:
    order_id = await start_paid_flow(client, db_session)

    await deliver(client, session_event("evt_1", "checkout.session.expired", order_id))
    await deliver(client, session_event("evt_2", "checkout.session.completed", order_id))

    body = (await client.get(f"/api/v1/checkout/sessions/cs_test_{order_id}")).json()
    assert body["status"] == "cancelled"


async def test_unpaid_completion_waits_for_the_async_result(
    client: AsyncClient, db_session: AsyncSession, gateway: FakeGateway
) -> None:
    order_id = await start_paid_flow(client, db_session)

    await deliver(
        client,
        session_event("evt_1", "checkout.session.completed", order_id, payment_status="unpaid"),
    )
    pending = (await client.get(f"/api/v1/checkout/sessions/cs_test_{order_id}")).json()
    await deliver(
        client, session_event("evt_2", "checkout.session.async_payment_succeeded", order_id)
    )
    paid = (await client.get(f"/api/v1/checkout/sessions/cs_test_{order_id}")).json()

    assert (pending["status"], paid["status"]) == ("pending", "paid")


async def test_webhook_for_an_unknown_order_is_acknowledged(
    client: AsyncClient, gateway: FakeGateway
) -> None:
    response = await deliver(client, session_event("evt_1", "checkout.session.completed", 999))

    assert response.status_code == 200


async def test_orders_are_private_to_their_buyer(
    client: AsyncClient, db_session: AsyncSession, gateway: FakeGateway
) -> None:
    order_id = await start_paid_flow(client, db_session)
    await client.post("/api/v1/auth/logout")
    await log_in(client, "bob@example.com")

    assert (await client.get("/api/v1/orders")).json() == []
    other = await client.get(f"/api/v1/checkout/sessions/cs_test_{order_id}")
    assert other.status_code == 404
