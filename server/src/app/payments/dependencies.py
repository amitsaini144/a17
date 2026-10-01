from datetime import timedelta
from functools import lru_cache
from typing import Annotated

from fastapi import Depends

from app.cart.service import CartService
from app.catalog.repository import CatalogRepository
from app.core.config import get_settings
from app.core.database import DbSession
from app.core.exceptions import ServiceUnavailableError
from app.orders.repository import OrderRepository
from app.payments.gateway import PaymentGateway, StripeGateway
from app.payments.repository import StripeEventRepository
from app.payments.service import CheckoutService, WebhookService


@lru_cache
def _stripe_gateway(secret_key: str, webhook_secret: str) -> StripeGateway:
    # One client (and connection pool) for the process.
    return StripeGateway(secret_key=secret_key, webhook_secret=webhook_secret)


def get_payment_gateway() -> PaymentGateway:
    settings = get_settings()
    if not (
        settings.stripe_secret_key and settings.stripe_webhook_secret and settings.public_site_url
    ):
        raise ServiceUnavailableError("Payments are not configured")
    return _stripe_gateway(
        settings.stripe_secret_key.get_secret_value(),
        settings.stripe_webhook_secret.get_secret_value(),
    )


GatewayDep = Annotated[PaymentGateway, Depends(get_payment_gateway)]


def get_checkout_service(session: DbSession, gateway: GatewayDep) -> CheckoutService:
    settings = get_settings()
    return CheckoutService(
        cart=CartService(CatalogRepository(session)),
        orders=OrderRepository(session),
        gateway=gateway,
        site_url=settings.public_site_url,
        session_ttl=timedelta(minutes=settings.checkout_session_ttl_minutes),
    )


def get_webhook_service(session: DbSession, gateway: GatewayDep) -> WebhookService:
    return WebhookService(
        events=StripeEventRepository(session), orders=OrderRepository(session), gateway=gateway
    )


CheckoutServiceDep = Annotated[CheckoutService, Depends(get_checkout_service)]
WebhookServiceDep = Annotated[WebhookService, Depends(get_webhook_service)]
