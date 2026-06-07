"""Shared HTTP client for all scrapers.

Centralizes browser-like headers and timeouts so every scraper looks like a
real browser instead of the default ``python-requests`` user agent.

Two modes:
  * default (``impersonate=False``) uses the ``requests`` library. This keeps
    the scrapers' existing ``requests_mock``-based tests working.
  * ``impersonate=True`` uses ``curl_cffi`` to mimic a real browser's TLS
    handshake (JA3/JA4 fingerprint). Some sites (e.g. Forvo) block based on the
    TLS fingerprint of the container's OpenSSL build, which a User-Agent header
    alone cannot defeat.

Both backends return a response object exposing ``.status_code``, ``.ok``,
``.text`` and ``.content``, so scraper logic does not need to branch.
"""

import requests

BROWSER_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
    ),
    "Accept": (
        "text/html,application/xhtml+xml,application/xml;q=0.9,"
        "image/avif,image/webp,*/*;q=0.8"
    ),
    "Accept-Language": "en-US,en;q=0.5",
    "Connection": "keep-alive",
}

DEFAULT_TIMEOUT = 20


def fetch(url, headers=None, timeout=DEFAULT_TIMEOUT, impersonate=False):
    """Perform a GET request with browser-like headers.

    Parameters
    ------------
        url: str
            The URL to fetch.
        headers: dict | None
            Extra headers merged on top of BROWSER_HEADERS.
        timeout: int
            Request timeout in seconds.
        impersonate: bool
            When True, use curl_cffi with browser TLS impersonation to bypass
            TLS-fingerprint-based blocking.

    Return
    ------------
        A response object with .status_code, .ok, .text and .content.
    """
    merged_headers = {**BROWSER_HEADERS, **(headers or {})}
    if impersonate:
        from curl_cffi import requests as cffi_requests

        return cffi_requests.get(
            url, headers=merged_headers, timeout=timeout, impersonate="chrome"
        )
    return requests.get(url, headers=merged_headers, timeout=timeout)
