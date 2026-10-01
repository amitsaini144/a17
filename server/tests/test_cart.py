import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from tests.factories import create_category, create_product


async def quote(client: AsyncClient, items: list[dict[str, object]]) -> dict[str, object]:
    response = await client.post("/api/v1/cart/quote", json={"items": items})
    assert response.status_code == 200, response.text
    body: dict[str, object] = response.json()
    return body


async def test_quote_prices_lines_from_the_database(
    client: AsyncClient, db_session: AsyncSession
) -> None:
    phones = await create_category(db_session, slug="phone")
    await create_product(db_session, phones, slug="iphone", price_cents=99_900)
    await create_product(db_session, phones, slug="case", price_cents=2_500)

    body = await quote(client, [{"slug": "case", "quantity": 2}, {"slug": "iphone", "quantity": 1}])

    lines = body["lines"]
    assert isinstance(lines, list)
    # Request order is kept, so the cart doesn't reshuffle.
    assert [(line["product"]["slug"], line["line_total_cents"]) for line in lines] == [
        ("case", 5_000),
        ("iphone", 99_900),
    ]
    assert body["subtotal_cents"] == 104_900
    assert body["currency"] == "USD"
    assert body["unavailable_slugs"] == []


async def test_quote_ignores_any_price_sent_by_the_client(
    client: AsyncClient, db_session: AsyncSession
) -> None:
    phones = await create_category(db_session, slug="phone")
    await create_product(db_session, phones, slug="iphone", price_cents=99_900)

    body = await quote(client, [{"slug": "iphone", "quantity": 1, "price_cents": 1}])

    assert body["subtotal_cents"] == 99_900


async def test_quote_reports_missing_and_inactive_products(
    client: AsyncClient, db_session: AsyncSession
) -> None:
    phones = await create_category(db_session, slug="phone")
    await create_product(db_session, phones, slug="iphone", price_cents=99_900)
    await create_product(db_session, phones, slug="retired", is_active=False)

    body = await quote(
        client,
        [
            {"slug": "gone", "quantity": 1},
            {"slug": "iphone", "quantity": 1},
            {"slug": "retired", "quantity": 1},
        ],
    )

    assert body["unavailable_slugs"] == ["gone", "retired"]
    assert body["subtotal_cents"] == 99_900


async def test_empty_cart_quotes_zero(client: AsyncClient) -> None:
    body = await quote(client, [])

    assert body == {"lines": [], "subtotal_cents": 0, "currency": None, "unavailable_slugs": []}


async def test_mixed_currencies_are_rejected(client: AsyncClient, db_session: AsyncSession) -> None:
    phones = await create_category(db_session, slug="phone")
    await create_product(db_session, phones, slug="usd", currency="USD")
    await create_product(db_session, phones, slug="eur", currency="EUR")

    response = await client.post(
        "/api/v1/cart/quote",
        json={"items": [{"slug": "usd", "quantity": 1}, {"slug": "eur", "quantity": 1}]},
    )

    assert response.status_code == 422
    assert response.json()["code"] == "invalid_request"


@pytest.mark.parametrize(
    "items",
    [
        [{"slug": "iphone", "quantity": 0}],
        [{"slug": "iphone", "quantity": 11}],
        [{"slug": "iphone", "quantity": 1}, {"slug": "iphone", "quantity": 2}],
        [{"slug": f"p{i}", "quantity": 1} for i in range(51)],
    ],
)
async def test_quote_validates_items(client: AsyncClient, items: list[dict[str, object]]) -> None:
    response = await client.post("/api/v1/cart/quote", json={"items": items})

    assert response.status_code == 422
