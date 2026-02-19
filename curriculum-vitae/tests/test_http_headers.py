"""Tests for HTTP header helpers."""

from core.http_headers import build_content_disposition


class TestContentDisposition:
    def test_sanitizes_crlf_and_non_ascii(self):
        value = "CV\r\nInjected: nope\r\néà.pdf"
        header = build_content_disposition(value, disposition="inline", default="resume.pdf")
        assert "\r" not in header
        assert "\n" not in header
        assert "Injected:" not in header
        assert "é" not in header
        assert "à" not in header
        assert "filename*=" in header

    def test_uses_default_when_empty(self):
        header = build_content_disposition("", disposition="attachment", default="resume.pdf")
        assert header.startswith("attachment;")
        assert "resume.pdf" in header
        assert "filename*=" in header

    def test_encodes_filename_star(self):
        header = build_content_disposition("My CV 2024.pdf", disposition="inline", default="resume.pdf")
        assert "filename*=" in header
        assert "My%20CV%202024.pdf" in header
