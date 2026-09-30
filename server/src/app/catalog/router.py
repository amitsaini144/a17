from typing import Annotated

from fastapi import APIRouter, Depends, Query

from app.catalog.repository import CatalogRepository
from app.catalog.schemas import CategoryDetail, CategoryRead, ProductDetail, ProductSummary
from app.catalog.service import CatalogService
from app.core.database import DbSession
from app.shared.schemas import Page


def get_catalog_service(session: DbSession) -> CatalogService:
    return CatalogService(CatalogRepository(session))


CatalogServiceDep = Annotated[CatalogService, Depends(get_catalog_service)]

router = APIRouter(tags=["catalog"])


@router.get("/categories", response_model=list[CategoryRead])
async def list_categories(service: CatalogServiceDep) -> list[CategoryRead]:
    return await service.list_categories()


@router.get("/categories/{slug}", response_model=CategoryDetail)
async def get_category(slug: str, service: CatalogServiceDep) -> CategoryDetail:
    return await service.get_category(slug)


@router.get("/products", response_model=Page[ProductSummary])
async def list_products(
    *,
    service: CatalogServiceDep,
    category: Annotated[str | None, Query(description="Category slug")] = None,
    featured: bool | None = None,
    q: Annotated[str | None, Query(min_length=1, max_length=100, description="Name search")] = None,
    limit: Annotated[int, Query(ge=1, le=100)] = 24,
    offset: Annotated[int, Query(ge=0)] = 0,
) -> Page[ProductSummary]:
    return await service.list_products(
        category_slug=category, featured=featured, search=q, limit=limit, offset=offset
    )


@router.get("/products/{slug}", response_model=ProductDetail)
async def get_product(slug: str, service: CatalogServiceDep) -> ProductDetail:
    return await service.get_product(slug)


@router.get("/products/{slug}/related", response_model=list[ProductSummary])
async def list_related_products(
    slug: str,
    service: CatalogServiceDep,
    limit: Annotated[int, Query(ge=1, le=12)] = 3,
) -> list[ProductSummary]:
    return await service.list_related_products(slug, limit)
