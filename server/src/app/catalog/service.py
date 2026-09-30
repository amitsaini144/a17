from app.catalog.models import Category, Product
from app.catalog.repository import CatalogRepository
from app.catalog.schemas import (
    CategoryDetail,
    CategoryFeatureRead,
    CategoryRead,
    CategoryRef,
    ProductDetail,
    ProductSummary,
)
from app.core.exceptions import NotFoundError
from app.shared.schemas import Page
from app.storage.service import public_url


class CatalogService:
    def __init__(self, repository: CatalogRepository) -> None:
        self._repository = repository

    async def list_categories(self) -> list[CategoryRead]:
        return [_category_read(c) for c in await self._repository.list_categories()]

    async def get_category(self, slug: str) -> CategoryDetail:
        category = await self._repository.get_category_by_slug(slug)
        if category is None:
            raise NotFoundError(f"Category '{slug}' not found")
        return CategoryDetail(
            **_category_read(category).model_dump(),
            features=[
                CategoryFeatureRead(
                    title=f.title, description=f.description, image_url=public_url(f.image_key)
                )
                for f in category.features
            ],
        )

    async def list_products(
        self,
        *,
        category_slug: str | None,
        featured: bool | None,
        search: str | None,
        limit: int,
        offset: int,
    ) -> Page[ProductSummary]:
        products, total = await self._repository.list_products(
            category_slug=category_slug,
            featured=featured,
            search=search,
            limit=limit,
            offset=offset,
        )
        return Page(
            items=[_product_summary(p) for p in products], total=total, limit=limit, offset=offset
        )

    async def get_product(self, slug: str) -> ProductDetail:
        product = await self._get_product_or_raise(slug)
        return ProductDetail(
            **_product_summary(product).model_dump(exclude={"category"}),
            description=product.description,
            gallery_urls=[public_url(image.image_key) for image in product.images],
            category=_category_read(product.category),
        )

    async def list_related_products(self, slug: str, limit: int) -> list[ProductSummary]:
        product = await self._get_product_or_raise(slug)
        related = await self._repository.list_related_products(product, limit)
        return [_product_summary(p) for p in related]

    async def _get_product_or_raise(self, slug: str) -> Product:
        product = await self._repository.get_product_by_slug(slug)
        if product is None:
            raise NotFoundError(f"Product '{slug}' not found")
        return product


def _category_read(category: Category) -> CategoryRead:
    return CategoryRead(
        slug=category.slug,
        name=category.name,
        cover_image_url=public_url(category.cover_image_key),
    )


def _product_summary(product: Product) -> ProductSummary:
    return ProductSummary(
        slug=product.slug,
        name=product.name,
        price_cents=product.price_cents,
        currency=product.currency,
        image_url=public_url(product.image_key),
        is_featured=product.is_featured,
        category=CategoryRef(slug=product.category.slug, name=product.category.name),
    )
