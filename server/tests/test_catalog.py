from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from tests.factories import create_category, create_product


async def test_list_categories_ordered_by_position(
    client: AsyncClient, db_session: AsyncSession
) -> None:
    await create_category(db_session, slug="phone", name="Phones", position=1)
    await create_category(db_session, slug="monitor", name="Displays", position=0)

    response = await client.get("/api/v1/categories")

    assert response.status_code == 200
    assert response.json() == [
        {"slug": "monitor", "name": "Displays", "cover_image_url": "/images/monitor/cover.png"},
        {"slug": "phone", "name": "Phones", "cover_image_url": "/images/phone/cover.png"},
    ]


async def test_get_category_includes_features_in_order(
    client: AsyncClient, db_session: AsyncSession
) -> None:
    await create_category(db_session, slug="phone", features=["Fast", "Sleek", "Smart"])

    response = await client.get("/api/v1/categories/phone")

    assert response.status_code == 200
    assert [f["title"] for f in response.json()["features"]] == ["Fast", "Sleek", "Smart"]


async def test_get_unknown_category_returns_404(client: AsyncClient) -> None:
    response = await client.get("/api/v1/categories/nope")

    assert response.status_code == 404
    assert response.json() == {"detail": "Category 'nope' not found", "code": "not_found"}


async def test_list_products_filters_by_category(
    client: AsyncClient, db_session: AsyncSession
) -> None:
    phones = await create_category(db_session, slug="phone")
    monitors = await create_category(db_session, slug="monitor")
    phone = await create_product(db_session, phones)
    await create_product(db_session, monitors)

    response = await client.get("/api/v1/products", params={"category": "phone"})

    body = response.json()
    assert response.status_code == 200
    assert body["total"] == 1
    assert body["items"][0]["slug"] == phone.slug
    assert body["items"][0]["category"] == {"slug": "phone", "name": "Phone"}


async def test_list_products_filters_featured(
    client: AsyncClient, db_session: AsyncSession
) -> None:
    category = await create_category(db_session, slug="phone")
    featured = await create_product(db_session, category, is_featured=True)
    await create_product(db_session, category)

    response = await client.get("/api/v1/products", params={"featured": "true"})

    assert [p["slug"] for p in response.json()["items"]] == [featured.slug]


async def test_list_products_hides_inactive(client: AsyncClient, db_session: AsyncSession) -> None:
    category = await create_category(db_session, slug="phone")
    await create_product(db_session, category, is_active=False)

    response = await client.get("/api/v1/products")

    assert response.json()["total"] == 0


async def test_search_is_case_insensitive_and_literal(
    client: AsyncClient, db_session: AsyncSession
) -> None:
    category = await create_category(db_session, slug="phone")
    await create_product(db_session, category, name="iPhone 15 Red")
    await create_product(db_session, category, name="Watch 100% Steel")

    by_name = await client.get("/api/v1/products", params={"q": "IPHONE"})
    by_wildcard = await client.get("/api/v1/products", params={"q": "%"})

    assert [p["name"] for p in by_name.json()["items"]] == ["iPhone 15 Red"]
    # `%` must match literally, not act as a wildcard that returns everything.
    assert [p["name"] for p in by_wildcard.json()["items"]] == ["Watch 100% Steel"]


async def test_list_products_paginates(client: AsyncClient, db_session: AsyncSession) -> None:
    category = await create_category(db_session, slug="phone")
    products = [await create_product(db_session, category) for _ in range(5)]

    response = await client.get("/api/v1/products", params={"limit": 2, "offset": 2})

    body = response.json()
    assert body["total"] == 5
    assert (body["limit"], body["offset"]) == (2, 2)
    assert [p["slug"] for p in body["items"]] == [p.slug for p in products[2:4]]


async def test_list_products_rejects_invalid_limit(client: AsyncClient) -> None:
    response = await client.get("/api/v1/products", params={"limit": 0})

    assert response.status_code == 422


async def test_get_product_returns_detail_with_ordered_gallery(
    client: AsyncClient, db_session: AsyncSession
) -> None:
    category = await create_category(db_session, slug="phone", name="Phones")
    await create_product(db_session, category, slug="iphone", price_cents=79999, gallery=3)

    response = await client.get("/api/v1/products/iphone")

    body = response.json()
    assert response.status_code == 200
    assert body["price_cents"] == 79999
    assert body["gallery_urls"] == [
        "/images/iphone-0.png",
        "/images/iphone-1.png",
        "/images/iphone-2.png",
    ]
    assert body["category"]["cover_image_url"] == "/images/phone/cover.png"


async def test_get_unknown_product_returns_404(client: AsyncClient) -> None:
    response = await client.get("/api/v1/products/nope")

    assert response.status_code == 404


async def test_related_products_prefer_same_category(
    client: AsyncClient, db_session: AsyncSession
) -> None:
    phones = await create_category(db_session, slug="phone")
    monitors = await create_category(db_session, slug="monitor")
    monitor = await create_product(db_session, monitors)
    current = await create_product(db_session, phones)
    sibling = await create_product(db_session, phones)

    response = await client.get(f"/api/v1/products/{current.slug}/related", params={"limit": 3})

    # Current product excluded; same category first, then topped up from others.
    assert [p["slug"] for p in response.json()] == [sibling.slug, monitor.slug]
