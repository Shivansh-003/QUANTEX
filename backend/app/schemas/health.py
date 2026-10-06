"""Pydantic schemas for health and system diagnostics."""


from pydantic import BaseModel, Field


class ServiceStatus(BaseModel):
    """Status details for connected dependencies."""

    db: str = Field(default="NOT_CONNECTED", description="Database service status")
    redis: str = Field(default="NOT_CONNECTED", description="Redis cache status")


class HealthResponse(BaseModel):
    """Structured response schema for system health check endpoint."""

    status: str = Field(default="UP", description="Overall application health status")
    version: str = Field(..., description="Application semantic version")
    environment: str = Field(..., description="Active runtime environment")
    services: dict[str, str] = Field(
        default_factory=dict, description="Status of auxiliary services"
    )
