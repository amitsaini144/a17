from typing import Annotated

from fastapi import APIRouter, Header, Request, Response, status
from limits import RateLimitItemPerMinute

from app.auth.dependencies import CurrentUser
from app.core.rate_limit import enforce
from app.orders.schemas import OrderRead
from app.payments.dependencies import CheckoutServiceDep, WebhookServiceDep
from app.payments.schemas import CheckoutRequest, CheckoutResponse

# Each checkout creates an order and a Stripe session; a shopper never needs many per minute.
CHECKOUT_PER_USER = RateLimitItemPerMinute(10)

router = APIRouter(tags=["payments"])


@router.post("/checkout/sessions", response_model=CheckoutResponse)
async def start_checkout(
    data: CheckoutRequest, user: CurrentUser, service: CheckoutServiceDep
) -> CheckoutResponse:
    await enforce(CHECKOUT_PER_USER, "checkout", str(user.id))
    return CheckoutResponse(url=await service.start(user, data.items))


@router.get("/checkout/sessions/{session_id}", response_model=OrderRead)
async def get_checkout_order(
    session_id: str, user: CurrentUser, service: CheckoutServiceDep
) -> OrderRead:
    """The order behind a checkout, for the success page (only the buyer can see it)."""
    return await service.get_order_for_session(user, session_id)


@router.post("/payments/stripe/webhook", status_code=status.HTTP_200_OK, include_in_schema=False)
async def stripe_webhook(
    request: Request,
    service: WebhookServiceDep,
    stripe_signature: Annotated[str | None, Header()] = None,
) -> Response:
    # The signature covers the exact bytes Stripe sent, so read the raw body, not parsed JSON.
    await service.handle(await request.body(), stripe_signature)
    return Response(status_code=status.HTTP_200_OK)
