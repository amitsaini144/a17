from pydantic import BaseModel

from app.cart.schemas import CartQuoteRequest


class CheckoutRequest(CartQuoteRequest):
    """The cart to buy: slugs and quantities only. Prices are looked up on the server."""


class CheckoutResponse(BaseModel):
    # Stripe-hosted payment page to redirect the shopper to.
    url: str
