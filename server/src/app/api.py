from fastapi import APIRouter

from app.catalog.router import router as catalog_router
from app.health.router import router as health_router

api_router = APIRouter()
api_router.include_router(health_router)
api_router.include_router(catalog_router)
