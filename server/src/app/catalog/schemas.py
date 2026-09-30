from pydantic import BaseModel


class CategoryRef(BaseModel):
    slug: str
    name: str


class CategoryRead(CategoryRef):
    cover_image_url: str


class CategoryFeatureRead(BaseModel):
    title: str
    description: str
    image_url: str


class CategoryDetail(CategoryRead):
    features: list[CategoryFeatureRead]


class ProductSummary(BaseModel):
    slug: str
    name: str
    price_cents: int
    currency: str
    image_url: str
    is_featured: bool
    category: CategoryRef


class ProductDetail(ProductSummary):
    description: str
    gallery_urls: list[str]
    category: CategoryRead
