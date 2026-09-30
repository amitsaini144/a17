from __future__ import annotations

from sqlalchemy import CheckConstraint, ForeignKey, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.shared.models import TimestampMixin


class Category(TimestampMixin, Base):
    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(primary_key=True)
    slug: Mapped[str] = mapped_column(String(64), unique=True)
    name: Mapped[str] = mapped_column(String(128))
    cover_image_key: Mapped[str] = mapped_column(String(512))
    position: Mapped[int] = mapped_column(default=0, server_default="0")

    features: Mapped[list[CategoryFeature]] = relationship(
        back_populates="category",
        order_by="CategoryFeature.position",
        cascade="all, delete-orphan",
    )
    products: Mapped[list[Product]] = relationship(back_populates="category")


class CategoryFeature(Base):
    """Marketing highlight shown on product pages of a category."""

    __tablename__ = "category_features"
    __table_args__ = (UniqueConstraint("category_id", "position"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    category_id: Mapped[int] = mapped_column(ForeignKey("categories.id", ondelete="CASCADE"))
    title: Mapped[str] = mapped_column(String(200))
    description: Mapped[str] = mapped_column(Text)
    image_key: Mapped[str] = mapped_column(String(512))
    position: Mapped[int]

    category: Mapped[Category] = relationship(back_populates="features")


class Product(TimestampMixin, Base):
    __tablename__ = "products"
    __table_args__ = (CheckConstraint("price_cents >= 0", name="price_cents_non_negative"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    slug: Mapped[str] = mapped_column(String(128), unique=True)
    name: Mapped[str] = mapped_column(String(200))
    description: Mapped[str] = mapped_column(Text)
    price_cents: Mapped[int]
    currency: Mapped[str] = mapped_column(String(3), default="USD", server_default="USD")
    image_key: Mapped[str] = mapped_column(String(512))
    is_active: Mapped[bool] = mapped_column(default=True, server_default="true")
    is_featured: Mapped[bool] = mapped_column(default=False, server_default="false")
    # RESTRICT: a category with products must not be deleted by accident.
    category_id: Mapped[int] = mapped_column(
        ForeignKey("categories.id", ondelete="RESTRICT"), index=True
    )

    category: Mapped[Category] = relationship(back_populates="products")
    images: Mapped[list[ProductImage]] = relationship(
        back_populates="product",
        order_by="ProductImage.position",
        cascade="all, delete-orphan",
    )


class ProductImage(Base):
    """Gallery image of a product; `position` defines display order."""

    __tablename__ = "product_images"
    __table_args__ = (UniqueConstraint("product_id", "position"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id", ondelete="CASCADE"))
    image_key: Mapped[str] = mapped_column(String(512))
    position: Mapped[int]

    product: Mapped[Product] = relationship(back_populates="images")
