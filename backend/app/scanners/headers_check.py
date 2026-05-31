# ============================================================
# PRISM — SECURITY HEADERS SCANNER
# Makes an HTTP request and checks for security headers.
# ============================================================

import httpx


# Headers we check and their importance
SECURITY_HEADERS = {
    "strict-transport-security": {
        "label":          "HSTS (Strict-Transport-Security)",
        "severity":       "critical",
        "message_pass":   "HSTS header is set",
        "message_fail":   "HSTS not configured",
        "technical_fail": "Missing Strict-Transport-Security header — allows downgrade attacks.",
        "recommendation": "Add: Strict-Transport-Security: max-age=31536000; includeSubDomains",
        "score_penalty":  20,
    },
    "content-security-policy": {
        "label":          "Content Security Policy",
        "severity":       "critical",
        "message_pass":   "Content Security Policy is configured",
        "message_fail":   "No Content Security Policy found",
        "technical_fail": "Missing Content-Security-Policy header — exposes users to XSS attacks.",
        "recommendation": "Add a CSP header. Start with: Content-Security-Policy: default-src 'self'",
        "score_penalty":  20,
    },
    "x-frame-options": {
        "label":          "X-Frame-Options",
        "severity":       "warning",
        "message_pass":   "X-Frame-Options header is set",
        "message_fail":   "X-Frame-Options not set",
        "technical_fail": "Missing X-Frame-Options — site could be embedded in malicious iframes.",
        "recommendation": "Add: X-Frame-Options: DENY",
        "score_penalty":  10,
    },
    "x-content-type-options": {
        "label":          "X-Content-Type-Options",
        "severity":       "warning",
        "message_pass":   "X-Content-Type-Options header is set",
        "message_fail":   "X-Content-Type-Options not set",
        "technical_fail": "Missing X-Content-Type-Options — allows MIME sniffing attacks.",
        "recommendation": "Add: X-Content-Type-Options: nosniff",
        "score_penalty":  10,
    },
    "referrer-policy": {
        "label":          "Referrer-Policy",
        "severity":       "warning",
        "message_pass":   "Referrer-Policy header is set",
        "message_fail":   "Referrer-Policy not configured",
        "technical_fail": "Missing Referrer-Policy — may leak sensitive URLs to third parties.",
        "recommendation": "Add: Referrer-Policy: strict-origin-when-cross-origin",
        "score_penalty":  5,
    },
    "permissions-policy": {
        "label":          "Permissions-Policy",
        "severity":       "warning",
        "message_pass":   "Permissions-Policy header is set",
        "message_fail":   "Permissions-Policy not configured",
        "technical_fail": "Missing Permissions-Policy — browser features not explicitly restricted.",
        "recommendation": "Add: Permissions-Policy: geolocation=(), microphone=(), camera=()",
        "score_penalty":  5,
    },
}


async def check_headers(url: str) -> dict:
    """
    Fetch the URL and check for security headers.
    Returns a category result dict.
    """

    findings = []
    score    = 100

    try:
        async with httpx.AsyncClient(
            follow_redirects=True,
            timeout=15.0,
            verify=False,
        ) as client:
            response = await client.get(url, headers={
                "User-Agent": "Mozilla/5.0 (compatible; PrismScanner/1.0)"
            })

        response_headers = {k.lower(): v for k, v in response.headers.items()}

        # Check each security header
        for header_key, config in SECURITY_HEADERS.items():
            if header_key in response_headers:
                value = response_headers[header_key]
                findings.append({
                    "severity":       "pass",
                    "message":        config["message_pass"],
                    "technical":      f"{header_key}: {value}",
                    "recommendation": "No action needed.",
                })
            else:
                findings.append({
                    "severity":       config["severity"],
                    "message":        config["message_fail"],
                    "technical":      config["technical_fail"],
                    "recommendation": config["recommendation"],
                })
                score -= config["score_penalty"]

        # Bonus check — server version disclosure
        server = response_headers.get("server", "")
        if server and any(char.isdigit() for char in server):
            findings.append({
                "severity":       "warning",
                "message":        "Server software version is exposed",
                "technical":      f"Server: {server}",
                "recommendation": "Configure your server to suppress version information.",
            })
            score -= 5
        elif server:
            findings.append({
                "severity":       "pass",
                "message":        "Server header does not expose version",
                "technical":      f"Server: {server}",
                "recommendation": "No action needed.",
            })

    except httpx.TimeoutException:
        findings.append({
            "severity":       "warning",
            "message":        "Request timed out",
            "technical":      "The server did not respond within 15 seconds.",
            "recommendation": "Check server availability and response times.",
        })
        score = 50

    except Exception as e:
        findings.append({
            "severity":       "warning",
            "message":        "Headers check could not be completed",
            "technical":      str(e),
            "recommendation": "Try again or check manually at securityheaders.com",
        })
        score = 50

    score = max(0, min(100, score))

    severities = [f["severity"] for f in findings]
    if "critical" in severities:
        status = "critical"
    elif "warning" in severities:
        status = "warning"
    else:
        status = "pass"

    return {
        "key":         "headers",
        "label":       "Security Headers",
        "icon":        "🛡️",
        "score":       score,
        "status":      status,
        "description": _get_description(status, score),
        "findings":    findings,
    }


def _get_description(status: str, score: int) -> str:
    if status == "pass":
        return "All critical security headers are present and configured correctly."
    if status == "critical":
        return "Several critical security headers are missing."
    return f"Some security headers are missing. Score: {score}/100."