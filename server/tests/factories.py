"""Small helpers to insert catalog rows in tests."""

from itertools import count

from sqlalchemy.ext.asyncio import AsyncSession

from app.catalog.models import Category, CategoryFeature, Product, ProductImage

_seq = count(1)


async def create_category(
    session: AsyncSession,
    *,
    slug: str,
    name: str | None = None,
    position: int = 0,
    features: list[str] | None = None,
) -> Category:
    category = Category(
        slug=slug,
        name=name or slug.title(),
        cover_image_key=f"images/{slug}/cover.png",
        position=position,
        features=[
            CategoryFeature(
                title=title, description=f"{title} description", image_key=f"f{i}.png", position=i
            )
            for i, title in enumerate(features or [])
        ],
    )
    session.add(category)
    await session.flush()
    return category


async def create_product(
    session: AsyncSession,
    category: Category,
    *,
    slug: str | None = None,
    name: str | None = None,
    price_cents: int = 1000,
    is_featured: bool = False,
    is_active: bool = True,
    gallery: int = 0,
) -> Product:
    n = next(_seq)
    slug = slug or f"product-{n}"
    product = Product(
        slug=slug,
        name=name or f"Product {n}",
        description="A product",
        price_cents=price_cents,
        currency="USD",
        image_key=f"images/{slug}.png",
        is_featured=is_featured,
        is_active=is_active,
        category=category,
        images=[
            ProductImage(image_key=f"images/{slug}-{i}.png", position=i) for i in range(gallery)
        ],
    )
    session.add(product)
    await session.flush()
    return product
