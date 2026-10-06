"""Pytest fixtures for backend test suite."""

from collections.abc import Generator

import pytest
from backend.app.main import app
from fastapi.testclient import TestClient


@pytest.fixture(scope="module")
def client() -> Generator[TestClient, None, None]:
    """Provide a TestClient instance for API tests."""
    with TestClient(app) as test_client:
        yield test_client
