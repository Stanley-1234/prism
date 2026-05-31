# ============================================================
# PRISM — SSL SCANNER
# Checks SSL certificate validity, expiry, and grade.
# Uses direct TLS connection via Python's ssl module.
# ============================================================

import ssl
import socket
from datetime import datetime, timezone
from typing import Any


async def check_ssl(url: str, domain: str) -> dict:
    """
    Check SSL certificate for the given domain.
    Returns a category result dict.
    """

    findings = []
    score    = 100

    try:
        # Strip port if present
        clean_domain = domain.split(":")[0]

        # Create SSL context
        context = ssl.create_default_context()

        # Connect and get certificate
        with socket.create_connection((clean_domain, 443), timeout=15) as sock:
            with context.wrap_socket(sock, server_hostname=clean_domain) as ssock:
                cert = ssock.getpeercert()
                protocol = ssock.version()

        # --------------------------------------------------
        # CHECK 1 — Certificate exists and is trusted
        # --------------------------------------------------
        if cert:
            findings.append({
                "severity":       "pass",
                "message":        "Valid SSL certificate installed",
                "technical":      f"Certificate verified by trusted authority. Protocol: {protocol}",
                "recommendation": "No action needed.",
            })
        else:
            findings.append({
                "severity":       "critical",
                "message":        "No valid SSL certificate found",
                "technical":      "Could not retrieve certificate from server.",
                "recommendation": "Install a valid SSL certificate immediately. Use Let's Encrypt for a free certificate.",
            })
            score -= 60

        # --------------------------------------------------
        # CHECK 2 — Expiry date
        # --------------------------------------------------
        if cert:
            expiry_str  = cert.get("notAfter", "")
            expiry_date = None

            if expiry_str:
                try:
                    expiry_date = datetime.strptime(
                        expiry_str, "%b %d %H:%M:%S %Y %Z"
                    ).replace(tzinfo=timezone.utc)
                except ValueError:
                    pass

            if expiry_date:
                now        = datetime.now(timezone.utc)
                days_left  = (expiry_date - now).days

                if days_left < 0:
                    findings.append({
                        "severity":       "critical",
                        "message":        "SSL certificate has expired",
                        "technical":      f"Certificate expired on {expiry_date.strftime('%d %b %Y')}.",
                        "recommendation": "Renew the certificate immediately. Enable auto-renewal.",
                    })
                    score -= 50
                elif days_left < 14:
                    findings.append({
                        "severity":       "critical",
                        "message":        f"SSL certificate expires in {days_left} days",
                        "technical":      f"Expires: {expiry_date.strftime('%d %b %Y')}.",
                        "recommendation": "Renew immediately. Enable auto-renewal via certbot.",
                    })
                    score -= 30
                elif days_left < 30:
                    findings.append({
                        "severity":       "warning",
                        "message":        f"SSL certificate expires in {days_left} days",
                        "technical":      f"Expires: {expiry_date.strftime('%d %b %Y')}.",
                        "recommendation": "Renew soon. Enable auto-renewal.",
                    })
                    score -= 10
                elif days_left < 90:
                    findings.append({
                        "severity":       "warning",
                        "message":        f"Certificate expires in {days_left} days",
                        "technical":      f"Expires: {expiry_date.strftime('%d %b %Y')}.",
                        "recommendation": "Enable auto-renewal to avoid expiry.",
                    })
                    score -= 5
                else:
                    findings.append({
                        "severity":       "pass",
                        "message":        f"Certificate valid for {days_left} more days",
                        "technical":      f"Expires: {expiry_date.strftime('%d %b %Y')}.",
                        "recommendation": "No action needed.",
                    })

        # --------------------------------------------------
        # CHECK 3 — Protocol version
        # --------------------------------------------------
        if protocol:
            if protocol in ("TLSv1", "TLSv1.1", "SSLv2", "SSLv3"):
                findings.append({
                    "severity":       "warning",
                    "message":        f"Outdated protocol in use: {protocol}",
                    "technical":      f"Server supports {protocol} which is deprecated.",
                    "recommendation": "Disable TLS 1.0 and 1.1. Use TLS 1.2 and 1.3 only.",
                })
                score -= 15
            else:
                findings.append({
                    "severity":       "pass",
                    "message":        f"Modern protocol in use: {protocol}",
                    "technical":      f"Server is using {protocol}.",
                    "recommendation": "No action needed.",
                })

    except ssl.SSLCertVerificationError as e:
        findings.append({
            "severity":       "critical",
            "message":        "SSL certificate is not trusted",
            "technical":      str(e),
            "recommendation": "Install a certificate from a trusted CA. Avoid self-signed certificates.",
        })
        score = 10

    except ssl.SSLError as e:
        findings.append({
            "severity":       "critical",
            "message":        "SSL connection failed",
            "technical":      str(e),
            "recommendation": "Check your SSL configuration on the server.",
        })
        score = 20

    except (socket.timeout, socket.gaierror, ConnectionRefusedError) as e:
        findings.append({
            "severity":       "critical",
            "message":        "Could not connect to server on port 443",
            "technical":      str(e),
            "recommendation": "Ensure the server is accessible and port 443 is open.",
        })
        score = 0

    except Exception as e:
        findings.append({
            "severity":       "warning",
            "message":        "SSL check could not be completed",
            "technical":      str(e),
            "recommendation": "Try again or check manually at ssllabs.com",
        })
        score = 50

    score = max(0, min(100, score))

    # Determine overall status
    severities = [f["severity"] for f in findings]
    if "critical" in severities:
        status = "critical"
    elif "warning" in severities:
        status = "warning"
    else:
        status = "pass"

    return {
        "key":         "ssl",
        "label":       "SSL Certificate",
        "icon":        "🔒",
        "score":       score,
        "status":      status,
        "description": _get_description(status),
        "findings":    findings,
    }


def _get_description(status: str) -> str:
    if status == "pass":
        return "Valid certificate from a trusted authority. Connection is encrypted."
    if status == "warning":
        return "Certificate is valid but has minor issues that should be addressed."
    return "SSL certificate has critical issues. Connection may not be secure."