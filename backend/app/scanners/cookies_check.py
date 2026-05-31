# ============================================================
# PRISM — COOKIE SECURITY SCANNER
# Checks session cookies for security flags:
# HttpOnly, Secure, SameSite
# ============================================================

import httpx
from http.cookiejar import CookieJar


async def check_cookies(url: str) -> dict:
    """
    Fetch the URL and analyse Set-Cookie headers.
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

        # Collect all Set-Cookie headers
        set_cookie_headers = []
        for key, value in response.headers.multi_items():
            if key.lower() == "set-cookie":
                set_cookie_headers.append(value)

        if not set_cookie_headers:
            findings.append({
                "severity":       "pass",
                "message":        "No cookies set on this page",
                "technical":      "No Set-Cookie headers found in response.",
                "recommendation": "No action needed.",
            })
            return {
                "key":         "cookies",
                "label":       "Cookie Security",
                "icon":        "🍪",
                "score":       100,
                "status":      "pass",
                "description": "No cookies are set on this page.",
                "findings":    findings,
            }

        # Analyse each cookie
        cookie_issues = 0
        for raw_cookie in set_cookie_headers:
            parts       = [p.strip() for p in raw_cookie.split(";")]
            cookie_name = parts[0].split("=")[0].strip() if parts else "unknown"
            attrs       = [p.lower() for p in parts[1:]]

            has_httponly = "httponly" in attrs
            has_secure   = "secure" in attrs
            has_samesite = any(a.startswith("samesite") for a in attrs)

            # HttpOnly check
            if has_httponly:
                findings.append({
                    "severity":       "pass",
                    "message":        f"Cookie '{cookie_name}' has HttpOnly flag",
                    "technical":      f"Set-Cookie: {raw_cookie[:80]}...",
                    "recommendation": "No action needed.",
                })
            else:
                findings.append({
                    "severity":       "warning",
                    "message":        f"Cookie '{cookie_name}' missing HttpOnly flag",
                    "technical":      f"Cookie is readable by JavaScript — risk of session hijacking.",
                    "recommendation": f"Add HttpOnly flag: Set-Cookie: {cookie_name}=...; HttpOnly",
                })
                score -= 15
                cookie_issues += 1

            # Secure check
            if has_secure:
                findings.append({
                    "severity":       "pass",
                    "message":        f"Cookie '{cookie_name}' has Secure flag",
                    "technical":      "Cookie will only be sent over HTTPS.",
                    "recommendation": "No action needed.",
                })
            else:
                findings.append({
                    "severity":       "warning",
                    "message":        f"Cookie '{cookie_name}' missing Secure flag",
                    "technical":      "Cookie could be transmitted over HTTP — vulnerable to interception.",
                    "recommendation": f"Add Secure flag: Set-Cookie: {cookie_name}=...; Secure",
                })
                score -= 10
                cookie_issues += 1

            # SameSite check
            if has_samesite:
                samesite_val = next(
                    (a for a in attrs if a.startswith("samesite")), ""
                )
                findings.append({
                    "severity":       "pass",
                    "message":        f"Cookie '{cookie_name}' has SameSite attribute",
                    "technical":      f"Attribute: {samesite_val}",
                    "recommendation": "No action needed.",
                })
            else:
                findings.append({
                    "severity":       "warning",
                    "message":        f"Cookie '{cookie_name}' missing SameSite attribute",
                    "technical":      "Without SameSite, cookie is vulnerable to CSRF attacks.",
                    "recommendation": f"Add SameSite: Set-Cookie: {cookie_name}=...; SameSite=Strict",
                })
                score -= 10
                cookie_issues += 1

    except httpx.TimeoutException:
        findings.append({
            "severity":       "warning",
            "message":        "Request timed out",
            "technical":      "Server did not respond within 15 seconds.",
            "recommendation": "Check server availability.",
        })
        score = 50

    except Exception as e:
        findings.append({
            "severity":       "warning",
            "message":        "Cookie check could not be completed",
            "technical":      str(e),
            "recommendation": "Try again or check manually.",
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
        "key":         "cookies",
        "label":       "Cookie Security",
        "icon":        "🍪",
        "score":       score,
        "status":      status,
        "description": _get_description(status),
        "findings":    findings,
    }


def _get_description(status: str) -> str:
    if status == "pass":
        return "All cookies are set with proper security flags."
    if status == "critical":
        return "Session cookies have critical security misconfigurations."
    return "Some cookies are missing security flags."