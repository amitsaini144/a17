from dataclasses import dataclass

from app.cart.schemas import CartItem, CartLine, CartQuote
from app.catalog.models import Product
from app.catalog.repository import CatalogRepository
from app.catalog.service import product_summary
from app.core.exceptions import InvalidRequestError


@dataclass(frozen=True)
class PricedLine:
    product: Product
    quantity: int
    line_total_cents: int


@dataclass(frozen=True)
class PricedCart:
    lines: list[PricedLine]
    subtotal_cents: int
    currency: str | None
    unavailable_slugs: list[str]


class CartService:
    def __init__(self, catalog: CatalogRepository) -> None:
        self._catalog = catalog

    async def price(self, items: list[CartItem]) -> PricedCart:
        """Price `items` from current catalog data, keeping the order they were given in.

        The single place a cart's prices are computed: the cart page's quote and checkout both
        use it, so what the shopper sees is exactly what they're charged.
        """
        products = await self._catalog.get_active_products_by_slugs([i.slug for i in items])
        by_slug = {product.slug: product for product in products}

        lines: list[PricedLine] = []
        unavailable: list[str] = []
        for item in items:
            product = by_slug.get(item.slug)
            if product is None:
                unavailable.append(item.slug)
                continue
            lines.append(
                PricedLine(
                    product=product,
                    quantity=item.quantity,
                    line_total_cents=product.price_cents * item.quantity,
                )
            )

        currencies = {line.product.currency for line in lines}
        if len(currencies) > 1:
            # One payment can only be in one currency.
            raise InvalidRequestError("Products in different currencies can't be bought together")

        return PricedCart(
            lines=lines,
            subtotal_cents=sum(line.line_total_cents for line in lines),
            currency=currencies.pop() if currencies else None,
            unavailable_slugs=unavailable,
        )

    async def quote(self, items: list[CartItem]) -> CartQuote:
        priced = await self.price(items)
        return CartQuote(
            lines=[
                CartLine(
                    product=product_summary(line.product),
                    quantity=line.quantity,
                    line_total_cents=line.line_total_cents,
                )
                for line in priced.lines
            ],
            subtotal_cents=priced.subtotal_cents,
            currency=priced.currency,
            unavailable_slugs=priced.unavailable_slugs,
        )
