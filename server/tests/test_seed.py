from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.catalog.models import CategoryFeature, Product, ProductImage
from app.seed.catalog import load_catalog, seed_catalog


async def _count(session: AsyncSession, model: type[object]) -> int:
    return await session.scalar(select(func.count()).select_from(model)) or 0


async def test_seed_is_idempotent(db_session: AsyncSession) -> None:
    catalog = load_catalog()

    await seed_catalog(db_session, catalog)
    await seed_catalog(db_session, catalog)

    assert await _count(db_session, Product) == len(catalog.products)
    assert await _count(db_session, ProductImage) == sum(
        len(p.gallery_keys) for p in catalog.products
    )
    assert await _count(db_session, CategoryFeature) == sum(
        len(c.features) for c in catalog.categories
    )


def test_seed_file_references_known_categories() -> None:
    catalog = load_catalog()
    slugs = {c.slug for c in catalog.categories}

    assert {p.category for p in catalog.products} <= slugs
    assert len({p.slug for p in catalog.products}) == len(catalog.products)
