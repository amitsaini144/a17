"""Import every ORM model so `Base.metadata` is complete (used by Alembic and tests)."""

from app.catalog.models import Category, CategoryFeature, Product, ProductImage

__all__ = ["Category", "CategoryFeature", "Product", "ProductImage"]
