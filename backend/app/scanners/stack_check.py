# ============================================================
# PRISM — TECH STACK EXPOSURE SCANNER
# Detects exposed software and versions from headers
# and page content. Matches against known risky versions.
# ============================================================

import httpx
import re


# Technologies we look for and how to detect them
TECH_SIGNATURES = {
    "WordPress": {
        "header_patterns": [],
        "body_patterns": [
            r'<meta name="generator" content="WordPress ([0-9.]+)"',
            r"/wp-content/",
            r"/wp-includes/",
        ],
        "version_regex": r"WordPress ([0-9.]+)",
        "latest_safe":   "6.5",
    },
    "Drupal": {
        "header_patterns": ["x-generator"],
        "body_patterns": [
            r'<meta name="generator" content="Drupal ([0-9.]+)"',
            r"/sites/default/files/",
        ],
        "version_regex": r"Drupal ([0-9.]+)",
        "latest_safe":   "10.0",
    },
    "Joomla": {
        "header_patterns": [],
        "body_patterns": [
            r'<meta name="generator" content="Joomla! ([0-9.]+)"',
            r"/components/com_",
        ],
        "version_regex": r"Joomla! ([0-9.]+)",
        "latest_safe":   "4.0",
    },
    "PHP": {
        "header_patterns": ["x-powered-by"],
        "body_patterns": [],
        "version_regex": r"PHP/([0-9.]+)",
        "latest_safe":   "8.1",
    },
    "nginx": {
        "header_patterns": ["server"],
        "body_patterns": [],
        "version_regex": r"nginx/([0-9.]+)",
        "latest_safe":   "1.24",
    },
    "Apache": {
        "header_patterns": ["server"],
        "body_patterns": [],
        "version_regex": r"Apache/([0-9.]+)",
        "latest_safe":   "2.4",
    },
    "ASP.NET": {
        "header_patterns": ["x-powered-by", "x-aspnet-version"],
        "body_patterns": [],
        "version_regex": r"ASP\.NET",
        "latest_safe":   None,
    },
}


def is_version_outdated(version: str, latest_safe: str) -> bool:
    """Compare version strings numerically."""
    if not version or not latest_safe:
        return False
    try:
        v_parts = [int(x) for x in version.split(".")[:2]]
        s_parts = [int(x) for x in latest_safe.split(".")[:2]]
        return v_parts < s_parts
    except (ValueError, AttributeError):
        return False


async def check_stack(url: str) -> dict:
    """
    Detect tech stack from headers and page content.
    Returns a category result dict.
    """

    findings  = []
    score     = 100
    detected  = []

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
        body             = response.text[:50000]  # Limit body size

        # --------------------------------------------------
        # DETECT EACH TECHNOLOGY
        # --------------------------------------------------
        for tech_name, config in TECH_SIGNATURES.items():
            version_found = None
            detection_source = None

            # Check headers
            for header_key in config["header_patterns"]:
                header_val = response_headers.get(header_key, "")
                if header_val:
                    match = re.search(config["version_regex"], header_val, re.IGNORECASE)
                    if match:
                        version_found    = match.group(1) if match.lastindex else None
                        detection_source = f"Header: {header_key}: {header_val}"
                    elif tech_name.lower() in header_val.lower():
                        detection_source = f"Header: {header_key}: {header_val}"

            # Check body
            if not detection_source:
                for pattern in config["body_patterns"]:
                    match = re.search(pattern, body, re.IGNORECASE)
                    if match:
                        version_match = re.search(
                            config["version_regex"], body, re.IGNORECASE
                        )
                        if version_match and version_match.lastindex:
                            version_found = version_match.group(1)
                        detection_source = f"Page source: {pattern}"
                        break

            if not detection_source:
                continue

            detected.append(tech_name)

            # Version outdated?
            if version_found and config.get("latest_safe"):
                if is_version_outdated(version_found, config["latest_safe"]):
                    findings.append({
                        "severity":       "warning",
                        "message":        f"{tech_name} version {version_found} detected — may be outdated",
                        "technical":      f"Detected via: {detection_source}. Latest stable: {config['latest_safe']}+",
                        "recommendation": f"Update {tech_name} to the latest stable version.",
                    })
                    score -= 10
                else:
                    findings.append({
                        "severity":       "pass",
                        "message":        f"{tech_name} {version_found} detected — up to date",
                        "technical":      f"Detected via: {detection_source}.",
                        "recommendation": "Keep updating regularly.",
                    })
            elif version_found:
                # Version exposed but we can't assess it
                findings.append({
                    "severity":       "warning",
                    "message":        f"{tech_name} version {version_found} is exposed in headers",
                    "technical":      f"Detected via: {detection_source}.",
                    "recommendation": f"Suppress {tech_name} version disclosure in your server config.",
                })
                score -= 8
            else:
                # Tech detected but no version
                findings.append({
                    "severity":       "pass",
                    "message":        f"{tech_name} detected — version not exposed",
                    "technical":      f"Detected via: {detection_source}. Version not disclosed.",
                    "recommendation": "No action needed.",
                })

        # --------------------------------------------------
        # NO TECH DETECTED
        # --------------------------------------------------
        if not detected:
            findings.append({
                "severity":       "pass",
                "message":        "No software versions exposed in headers or source",
                "technical":      "Server and framework versions are not disclosed.",
                "recommendation": "No action needed.",
            })
            score = 100

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
            "message":        "Stack check could not be completed",
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

    desc = f"Detected: {', '.join(detected)}." if detected else "No software versions exposed."

    return {
        "key":         "stack",
        "label":       "Tech Stack Exposure",
        "icon":        "⚙️",
        "score":       score,
        "status":      status,
        "description": desc,
        "findings":    findings,
    }