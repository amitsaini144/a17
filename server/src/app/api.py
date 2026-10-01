from fastapi import APIRouter

from app.auth.router import router as auth_router
from app.cart.router import router as cart_router
from app.catalog.router import router as catalog_router
from app.health.router import router as health_router
from app.orders.router import router as orders_router
from app.payments.router import router as payments_router

api_router = APIRouter()
api_router.include_router(health_router)
api_router.include_router(catalog_router)
api_router.include_router(auth_router)
api_router.include_router(cart_router)
api_router.include_router(orders_router)
api_router.include_router(payments_router)
