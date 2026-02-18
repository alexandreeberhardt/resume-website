"""Tests for auth endpoint rate limiting."""

import auth.routes as auth_routes


def _set_low_limits(monkeypatch):
    monkeypatch.setattr(
        auth_routes,
        "RATE_LIMIT_CONFIG",
        {
            "register": (1, 60),
            "login": (2, 60),
            "forgot_password": (1, 60),
            "resend_verification": (1, 60),
        },
    )


def test_register_rate_limited(client, monkeypatch):
    _set_low_limits(monkeypatch)
    auth_routes._reset_rate_limit_state()

    resp1 = client.post(
        "/api/auth/register",
        json={"email": "rl1@example.com", "password": "StrongPass123!"},
    )
    assert resp1.status_code == 200

    resp2 = client.post(
        "/api/auth/register",
        json={"email": "rl2@example.com", "password": "StrongPass123!"},
    )
    assert resp2.status_code == 429


def test_login_rate_limited(client, monkeypatch):
    _set_low_limits(monkeypatch)
    auth_routes._reset_rate_limit_state()

    client.post(
        "/api/auth/register",
        json={"email": "loginrl@example.com", "password": "StrongPass123!"},
    )
    auth_routes._reset_rate_limit_state()

    resp1 = client.post("/api/auth/login", data={"username": "loginrl@example.com", "password": "wrongpass"})
    assert resp1.status_code == 401
    resp2 = client.post("/api/auth/login", data={"username": "loginrl@example.com", "password": "wrongpass"})
    assert resp2.status_code == 401

    resp3 = client.post("/api/auth/login", data={"username": "loginrl@example.com", "password": "wrongpass"})
    assert resp3.status_code == 429


def test_forgot_password_rate_limited(client, monkeypatch):
    _set_low_limits(monkeypatch)
    auth_routes._reset_rate_limit_state()

    resp1 = client.post("/api/auth/forgot-password", json={"email": "nobody@example.com"})
    assert resp1.status_code == 200

    resp2 = client.post("/api/auth/forgot-password", json={"email": "nobody@example.com"})
    assert resp2.status_code == 429


def test_resend_verification_rate_limited(client, monkeypatch):
    _set_low_limits(monkeypatch)
    auth_routes._reset_rate_limit_state()

    resp1 = client.post("/api/auth/resend-verification", json={"email": "nobody@example.com"})
    assert resp1.status_code == 200

    resp2 = client.post("/api/auth/resend-verification", json={"email": "nobody@example.com"})
    assert resp2.status_code == 429
