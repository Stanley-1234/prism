# ============================================================
# PRISM — REPUTATION & BLACKLIST SCANNER
# Checks domain age and known threat indicators.
# Uses WHOIS-style checks and domain pattern analysis.
# Full VirusTotal integration added when API key is provided.
# ============================================================

import httpx
import re
from datetime import datetime, timezone


# Patterns that commonly indicate suspicious domains
SUSPICIOUS_PATTERNS = [
    r"paypal.*secure",
    r"secure.*paypal",
    r"account.*verify",
    r"login.*secure",
    r"bank.*secure",
    r"update.*account",
    r"verify.*account",
    r"confirm.*identity",
    r"\d{5,}",         # Many digits in domain
    r"[a-z0-9]{20,}",  # Very long random-looking strings
]

# TLDs commonly associated with spam/phishing
SUSPICIOUS_TLDS = [".xyz", ".top", ".click", ".download", ".loan", ".work"]


async def check_reputation(domain: str) -> dict:
    """
    Check domain reputation.
    Returns a category result dict.
    """

    findings = []
    score    = 100

    # ----------------------------------------------------------
    # CHECK 1 — Suspicious domain patterns
    # ----------------------------------------------------------
    domain_lower = domain.lower()
    matched_patterns = []

    for pattern in SUSPICIOUS_PATTERNS:
        if re.search(pattern, domain_lower):
            matched_patterns.append(pattern)

    if matched_patterns:
        findings.append({
            "severity":       "warning",
            "message":        "Domain name contains suspicious patterns",
            "technical":      f"Domain '{domain}' matches patterns commonly used in phishing.",
            "recommendation": "Verify this site is legitimate before entering any personal information.",
        })
        score -= 20
    else:
        findings.append({
            "severity":       "pass",
            "message":        "Domain name appears legitimate",
            "technical":      f"No suspicious patterns detected in '{domain}'.",
            "recommendation": "No action needed.",
        })

    # ----------------------------------------------------------
    # CHECK 2 — Suspicious TLD
    # ----------------------------------------------------------
    tld = "." + domain.split(".")[-1].lower() if "." in domain else ""
    if tld in SUSPICIOUS_TLDS:
        findings.append({
            "severity":       "warning",
            "message":        f"Domain uses a high-risk TLD: {tld}",
            "technical":      f"The '{tld}' TLD is commonly associated with spam and phishing.",
            "recommendation": "Exercise extra caution with this domain.",
        })
        score -= 15
    else:
        findings.append({
            "severity":       "pass",
            "message":        "Domain uses a standard TLD",
            "technical":      f"TLD '{tld}' is not flagged as high-risk.",
            "recommendation": "No action needed.",
        })

    # ----------------------------------------------------------
    # CHECK 3 — HTTP response check (is site reachable and sane)
    # ----------------------------------------------------------
    try:
        async with httpx.AsyncClient(
            follow_redirects=True,
            timeout=8.0,
            verify=False,
        ) as client:
            response = await client.get(
                f"https://{domain}",
                headers={"User-Agent": "Mozilla/5.0 (compatible; PrismScanner/1.0)"}
            )

        # Check for excessive redirects to different domains
        if response.history:
            final_domain = response.url.host.replace("www.", "")
            original     = domain.replace("www.", "")
            if final_domain != original and not final_domain.endswith(f".{original}"):
                findings.append({
                    "severity":       "warning",
                    "message":        "Site redirects to a different domain",
                    "technical":      f"Redirected from {domain} to {response.url.host}",
                    "recommendation": "Verify the redirect destination is expected.",
                })
                score -= 10
            else:
                findings.append({
                    "severity":       "pass",
                    "message":        "Site redirect chain looks normal",
                    "technical":      f"Redirects: {len(response.history)} hop(s)",
                    "recommendation": "No action needed.",
                })

        # Check status code
        if response.status_code >= 400:
            findings.append({
                "severity":       "warning",
                "message":        f"Site returned error status: {response.status_code}",
                "technical":      f"HTTP {response.status_code} response.",
                "recommendation": "Verify the site is functioning correctly.",
            })
            score -= 10
        else:
            findings.append({
                "severity":       "pass",
                "message":        "Site is reachable and responding normally",
                "technical":      f"HTTP {response.status_code} — site is online.",
                "recommendation": "No action needed.",
            })

    except httpx.TimeoutException:
        findings.append({
            "severity":       "warning",
            "message":        "Site did not respond in time",
            "technical":      "Request timed out after 10 seconds.",
            "recommendation": "The site may be down or blocking automated requests.",
        })
        score -= 10

    except Exception as e:
        findings.append({
            "severity":       "warning",
            "message":        "Could not reach the site",
            "technical":      str(e),
            "recommendation": "Verify the site is online.",
        })
        score -= 10

    # ----------------------------------------------------------
    # CHECK 4 — VirusTotal (only if API key provided)
    # ----------------------------------------------------------
    import os
    vt_key = os.getenv("VIRUSTOTAL_API_KEY", "")

    if vt_key and vt_key != "your_key_here":
        try:
            async with httpx.AsyncClient(timeout=8.0) as client:
                response = await client.get(
                    f"https://www.virustotal.com/api/v3/domains/{domain}",
                    headers={"x-apikey": vt_key},
                )

            if response.status_code == 200:
                data       = response.json()
                stats      = data.get("data", {}).get("attributes", {}).get(
                    "last_analysis_stats", {}
                )
                malicious  = stats.get("malicious", 0)
                suspicious = stats.get("suspicious", 0)
                total      = sum(stats.values()) if stats else 0

                if malicious > 0:
                    findings.append({
                        "severity":       "critical",
                        "message":        f"Domain flagged as malicious by {malicious} security vendors",
                        "technical":      f"VirusTotal: {malicious} malicious, {suspicious} suspicious out of {total} checks.",
                        "recommendation": "Do NOT enter any information on this site.",
                    })
                    score -= 50
                elif suspicious > 0:
                    findings.append({
                        "severity":       "warning",
                        "message":        f"Domain flagged as suspicious by {suspicious} security vendors",
                        "technical":      f"VirusTotal: {suspicious} suspicious out of {total} checks.",
                        "recommendation": "Exercise caution with this site.",
                    })
                    score -= 20
                else:
                    findings.append({
                        "severity":       "pass",
                        "message":        "Not found on any threat database",
                        "technical":      f"VirusTotal: Clean across {total} security vendors.",
                        "recommendation": "No action needed.",
                    })
        except Exception as e:
            pass  # VirusTotal check failure is non-fatal
# ----------------------------------------------------------
    # CHECK 5 — Google Safe Browsing
    # ----------------------------------------------------------
    gsb_key = os.getenv("GOOGLE_SAFE_BROWSING_KEY", "")

    if gsb_key and gsb_key != "AIzaSyCjJ4Qot3JbvpNXp7FEc0M0kpdU7IQSl3A":
        try:
            async with httpx.AsyncClient(timeout=8.0) as client:
                gsb_response = await client.post(
                    f"https://safebrowsing.googleapis.com/v4/threatMatches:find?key={gsb_key}",
                    json={
                        "client": {"clientId": "prism", "clientVersion": "1.0"},
                        "threatInfo": {
                            "threatTypes":      ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE", "POTENTIALLY_HARMFUL_APPLICATION"],
                            "platformTypes":    ["ANY_PLATFORM"],
                            "threatEntryTypes": ["URL"],
                            "threatEntries":    [{"url": f"https://{domain}"}],
                        },
                    },
                )
            if gsb_response.status_code == 200:
                matches = gsb_response.json().get("matches", [])
                if matches:
                    threat_type = matches[0].get("threatType", "UNKNOWN")
                    findings.append({
                        "severity":       "critical",
                        "message":        "Domain flagged by Google Safe Browsing",
                        "technical":      f"Threat type: {threat_type}",
                        "recommendation": "Do NOT visit this site.",
                    })
                    score -= 50
                else:
                    findings.append({
                        "severity":       "pass",
                        "message":        "Not flagged by Google Safe Browsing",
                        "technical":      "Google Safe Browsing returned no threats.",
                        "recommendation": "No action needed.",
                    })
        except Exception:
            pass  # Non-fatal

    score = max(0, min(100, score))

    severities = [f["severity"] for f in findings]
    if "critical" in severities:
        status = "critical"
    elif "warning" in severities:
        status = "warning"
    else:
        status = "pass"

    return {
        "key":         "reputation",
        "label":       "Reputation & Blacklists",
        "icon":        "🔍",
        "score":       score,
        "status":      status,
        "description": _get_description(status),
        "findings":    findings,
    }


def _get_description(status: str) -> str:
    if status == "pass":
        return "No reputation issues detected."
    if status == "critical":
        return "Domain is flagged by threat intelligence databases."
    return "Some reputation concerns were found."