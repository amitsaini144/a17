"""Seed the database: `uv run python -m app.seed`."""

import asyncio

import structlog

from app.core.config import get_settings
from app.core.database import SessionFactory, engine
from app.core.logging import configure_logging
from app.seed.catalog import count_products, load_catalog, seed_catalog

logger = structlog.get_logger()


async def main() -> None:
    catalog = load_catalog()
    try:
        async with SessionFactory() as session, session.begin():
            await seed_catalog(session, catalog)
            total = await count_products(session)
        logger.info(
            "catalog_seeded",
            categories=len(catalog.categories),
            products_in_file=len(catalog.products),
            products_in_db=total,
        )
    finally:
        await engine.dispose()


if __name__ == "__main__":
    configure_logging(get_settings())
    asyncio.run(main())
