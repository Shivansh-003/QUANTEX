"""System health check and diagnostic endpoints."""

from backend.app.core.config import Settings, get_settings
from backend.app.schemas.health import HealthResponse
from fastapi import APIRouter, Depends

router = APIRouter()


@router.get(
    "/health",
    response_model=HealthResponse,
    summary="System Health Check",
    description="Returns application health status, version, and dependency connectivity status.",
)
async def get_health(settings: Settings = Depends(get_settings)) -> HealthResponse:
    """Check health and operational status of the service."""
    return HealthResponse(
        status="UP",
        version=settings.VERSION,
        environment=settings.ENVIRONMENT,
        services={
            "database": "NOT_CONFIGURED",
            "redis": "NOT_CONFIGURED",
        },
    )
