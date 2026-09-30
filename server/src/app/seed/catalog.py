"""Idempotent catalog seed: upserts categories/products by slug from `catalog.json`."""

import json
from pathlib import Path

from pydantic import BaseModel, Field
from sqlalchemy import delete, func, select
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.ext.asyncio import AsyncSession

from app.catalog.models import Category, CategoryFeature, Product, ProductImage

CATALOG_FILE = Path(__file__).with_name("catalog.json")


class SeedFeature(BaseModel):
    title: str
    description: str
    image_key: str


class SeedCategory(BaseModel):
    slug: str
    name: str
    cover_image_key: str
    features: list[SeedFeature]


class SeedProduct(BaseModel):
    slug: str
    name: str
    description: str
    price_cents: int = Field(ge=0)
    currency: str = Field(min_length=3, max_length=3)
    category: str
    image_key: str
    gallery_keys: list[str]
    is_featured: bool = False


class SeedCatalog(BaseModel):
    categories: list[SeedCategory]
    products: list[SeedProduct]


def load_catalog(path: Path = CATALOG_FILE) -> SeedCatalog:
    return SeedCatalog.model_validate(json.loads(path.read_text(encoding="utf-8")))


async def seed_catalog(session: AsyncSession, catalog: SeedCatalog) -> None:
    """Insert or update the catalog. Child rows (features, images) are replaced wholesale."""
    category_ids: dict[str, int] = {}
    for position, category in enumerate(catalog.categories):
        values = {
            "slug": category.slug,
            "name": category.name,
            "cover_image_key": category.cover_image_key,
            "position": position,
        }
        stmt = (
            insert(Category)
            .values(**values)
            .on_conflict_do_update(index_elements=[Category.slug], set_=values)
            .returning(Category.id)
        )
        category_id = (await session.execute(stmt)).scalar_one()
        category_ids[category.slug] = category_id

        await session.execute(
            delete(CategoryFeature).where(CategoryFeature.category_id == category_id)
        )
        session.add_all(
            CategoryFeature(category_id=category_id, position=i, **feature.model_dump())
            for i, feature in enumerate(category.features)
        )

    for product in catalog.products:
        values = {
            **product.model_dump(exclude={"category", "gallery_keys"}),
            "category_id": category_ids[product.category],
        }
        stmt = (
            insert(Product)
            .values(**values)
            .on_conflict_do_update(index_elements=[Product.slug], set_=values)
            .returning(Product.id)
        )
        product_id = (await session.execute(stmt)).scalar_one()

        await session.execute(delete(ProductImage).where(ProductImage.product_id == product_id))
        session.add_all(
            ProductImage(product_id=product_id, position=i, image_key=key)
            for i, key in enumerate(product.gallery_keys)
        )

    await session.flush()


async def count_products(session: AsyncSession) -> int:
    return await session.scalar(select(func.count()).select_from(Product)) or 0
