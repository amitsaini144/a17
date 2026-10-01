from pydantic import BaseModel, Field, field_validator

from app.catalog.schemas import ProductSummary

# Bounds keep a quote (and later a checkout) cheap to compute and the cart realistic.
MAX_QUANTITY = 10
MAX_LINES = 50


class CartItem(BaseModel):
    slug: str = Field(min_length=1, max_length=128)
    quantity: int = Field(ge=1, le=MAX_QUANTITY)


class CartQuoteRequest(BaseModel):
    items: list[CartItem] = Field(max_length=MAX_LINES)

    @field_validator("items")
    @classmethod
    def _one_line_per_product(cls, items: list[CartItem]) -> list[CartItem]:
        slugs = [item.slug for item in items]
        if len(set(slugs)) != len(slugs):
            raise ValueError("each product may appear only once")
        return items


class CartLine(BaseModel):
    product: ProductSummary
    quantity: int
    line_total_cents: int


class CartQuote(BaseModel):
    """A cart priced from the database. The client's own view of prices is never used."""

    lines: list[CartLine]
    subtotal_cents: int
    # None for an empty cart.
    currency: str | None
    # Requested products that no longer exist or aren't for sale; the client drops them.
    unavailable_slugs: list[str]
