"""Test cases for system health and diagnostics endpoints."""

from fastapi.testclient import TestClient


def test_health_check_returns_200(client: TestClient) -> None:
    """Verify that GET /api/v1/health responds with 200 and expected schema."""
    response = client.get("/api/v1/health")
    assert response.status_code == 200

    data = response.json()
    assert data["status"] == "UP"
    assert "version" in data
    assert "environment" in data
    assert "services" in data
    assert isinstance(data["services"], dict)


def test_openapi_schema_available(client: TestClient) -> None:
    """Verify that OpenAPI documentation endpoint is reachable."""
    response = client.get("/openapi.json")
    assert response.status_code == 200
    schema = response.json()
    assert schema["info"]["title"] == "QUANTEX Platform"
    assert "/api/v1/health" in schema["paths"]
