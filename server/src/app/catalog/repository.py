from collections.abc import Sequence

from sqlalchemy import Select, case, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload, selectinload

from app.catalog.models import Category, Product


def _escape_like(value: str) -> str:
    """Treat user input literally inside LIKE patterns."""
    return value.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_")


class CatalogRepository:
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def list_categories(self) -> Sequence[Category]:
        result = await self._session.scalars(select(Category).order_by(Category.position))
        return result.all()

    async def get_category_by_slug(self, slug: str) -> Category | None:
        stmt = (
            select(Category).where(Category.slug == slug).options(selectinload(Category.features))
        )
        return await self._session.scalar(stmt)

    async def list_products(
        self,
        *,
        category_slug: str | None,
        featured: bool | None,
        search: str | None,
        limit: int,
        offset: int,
    ) -> tuple[Sequence[Product], int]:
        stmt = select(Product).join(Product.category).where(Product.is_active.is_(True))
        if category_slug is not None:
            stmt = stmt.where(Category.slug == category_slug)
        if featured is not None:
            stmt = stmt.where(Product.is_featured.is_(featured))
        if search:
            stmt = stmt.where(Product.name.ilike(f"%{_escape_like(search)}%", escape="\\"))

        total = await self._session.scalar(select(func.count()).select_from(stmt.subquery()))
        page = stmt.options(joinedload(Product.category)).order_by(Product.id)
        result = await self._session.scalars(page.limit(limit).offset(offset))
        return result.all(), total or 0

    async def get_product_by_slug(self, slug: str) -> Product | None:
        stmt = (
            self._active_products()
            .where(Product.slug == slug)
            .options(selectinload(Product.images))
        )
        return await self._session.scalar(stmt)

    async def get_active_products_by_slugs(self, slugs: Sequence[str]) -> Sequence[Product]:
        if not slugs:
            return []
        result = await self._session.scalars(self._active_products().where(Product.slug.in_(slugs)))
        return result.all()

    async def list_related_products(self, product: Product, limit: int) -> Sequence[Product]:
        """Same-category products first, topped up with other categories."""
        same_category_first = case((Product.category_id == product.category_id, 0), else_=1)
        stmt = (
            self._active_products()
            .where(Product.id != product.id)
            .order_by(same_category_first, Product.id)
            .limit(limit)
        )
        result = await self._session.scalars(stmt)
        return result.all()

    @staticmethod
    def _active_products() -> Select[Product]:
        return (
            select(Product).where(Product.is_active.is_(True)).options(joinedload(Product.category))
        )
