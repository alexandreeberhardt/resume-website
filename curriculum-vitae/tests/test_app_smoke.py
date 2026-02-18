"""Smoke tests for the FastAPI application."""

import pytest
from types import SimpleNamespace
from fastapi.testclient import TestClient

from app import app
from auth.dependencies import get_current_user


@pytest.fixture()
def client():
    app.dependency_overrides[get_current_user] = lambda: SimpleNamespace(
        is_guest=False,
        is_premium=False,
        bonus_downloads=0,
        download_count=0,
        download_count_reset_at=None,
    )
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


def test_app_starts_and_serves_openapi(client):
    """The app boots and the OpenAPI schema is available."""
    response = client.get("/openapi.json")
    assert response.status_code == 200
    schema = response.json()
    assert schema["info"]["title"] == "CV Generator API"


def test_generate_rejects_empty_body(client):
    """POST /generate without a body returns 422."""
    response = client.post("/generate")
    assert response.status_code == 422
