from __future__ import annotations

import unicodedata
from urllib.parse import quote


def _sanitize_filename(value: str | None, default: str) -> str:
    if not value:
        return default

    # Prevent header injection by stripping CR/LF early.
    value = value.replace("\r", "").replace("\n", "")

    # Normalize and drop non-ASCII characters.
    value = unicodedata.normalize("NFKD", value)
    value = value.encode("ascii", "ignore").decode("ascii")

    # Remove control characters and path separators.
    value = "".join(ch for ch in value if 32 <= ord(ch) <= 126)
    value = value.replace("/", "_").replace("\\", "_").replace(":", "_")

    value = value.strip()
    return value or default


def build_content_disposition(
    filename: str | None,
    *,
    disposition: str = "inline",
    default: str = "download.pdf",
) -> str:
    safe_name = _sanitize_filename(filename, default)
    quoted = safe_name.replace("\\", "\\\\").replace('"', '\\"')
    encoded = quote(safe_name, safe="")
    return f'{disposition}; filename="{quoted}"; filename*=UTF-8\'\'{encoded}'
