"""Tests for OAuth helper functions in auth/routes.py."""

import os
import time

os.environ.setdefault("JWT_SECRET_KEY", "test-secret-key-for-unit-tests-only")
os.environ.setdefault("DATABASE_URL", "sqlite://")


from auth.routes import (
    OAUTH_CODE_EXPIRE_SECONDS,
    _cleanup_expired_codes,
    _exchange_oauth_code,
    _store_oauth_code,
)


class TestOAuthCodeStore:
    """Tests for the OAuth temporary code exchange mechanism."""

    def test_store_returns_unique_codes(self):
        code1 = _store_oauth_code("token1")
        code2 = _store_oauth_code("token2")
        assert code1 != code2

    def test_store_and_retrieve(self):
        code = _store_oauth_code("my-jwt-token")
        token = _exchange_oauth_code(code)
        assert token == "my-jwt-token"

    def test_code_is_one_time_use(self):
        code = _store_oauth_code("jwt-abc")
        _exchange_oauth_code(code)
        # Second exchange must fail — GETDEL consumed the key
        assert _exchange_oauth_code(code) is None

    def test_invalid_code_returns_none(self):
        assert _exchange_oauth_code("nonexistent") is None

    def test_expired_code_returns_none(self, _mock_redis):
        """Codes with an elapsed TTL must not be retrievable."""
        code = "test-expired-code"
        # Store with a 1 ms TTL, then wait for Redis to evict it
        _mock_redis.set(f"oauth_code:{code}", "jwt-token", px=1)
        time.sleep(0.05)
        assert _exchange_oauth_code(code) is None

    def test_multiple_codes_independent(self):
        code1 = _store_oauth_code("token-a")
        code2 = _store_oauth_code("token-b")

        assert _exchange_oauth_code(code1) == "token-a"
        assert _exchange_oauth_code(code2) == "token-b"

    def test_cleanup_is_noop(self):
        """_cleanup_expired_codes is a no-op with Redis TTL — must not raise."""
        _store_oauth_code("some-token")
        _cleanup_expired_codes()  # should not raise

    def test_code_ttl_is_applied(self, _mock_redis):
        """Stored codes must have a TTL matching OAUTH_CODE_EXPIRE_SECONDS."""
        code = _store_oauth_code("jwt-ttl-test")
        ttl = _mock_redis.ttl(f"oauth_code:{code}")
        # TTL should be within [1, OAUTH_CODE_EXPIRE_SECONDS]
        assert 1 <= ttl <= OAUTH_CODE_EXPIRE_SECONDS


class TestExtractS3Key:
    """Additional tests for _extract_s3_key_from_url."""

    def test_standard_s3_url(self):
        from auth.routes import _extract_s3_key_from_url

        url = "https://mybucket.s3.eu-west-3.amazonaws.com/users/1/resume.pdf"
        assert _extract_s3_key_from_url(url) == "users/1/resume.pdf"

    def test_nested_path(self):
        from auth.routes import _extract_s3_key_from_url

        url = "https://bucket.s3.amazonaws.com/a/b/c/d.pdf"
        assert _extract_s3_key_from_url(url) == "a/b/c/d.pdf"

    def test_url_with_special_characters(self):
        from auth.routes import _extract_s3_key_from_url

        url = "https://bucket.s3.amazonaws.com/resumes/my%20resume.pdf"
        key = _extract_s3_key_from_url(url)
        assert key is not None
        assert "resume" in key
