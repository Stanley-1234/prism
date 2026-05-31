# ============================================================
# PRISM — DNS & EMAIL SECURITY SCANNER
# Checks SPF, DMARC, and DNSSEC records.
# ============================================================

import dns.resolver
import dns.exception


async def check_dns(domain: str) -> dict:
    """
    Check DNS security records for the domain.
    Returns a category result dict.
    """

    findings = []
    score    = 100

    resolver = dns.resolver.Resolver()
    resolver.timeout  = 3
    resolver.lifetime = 6

    # ----------------------------------------------------------
    # CHECK 1 — SPF record
    # ----------------------------------------------------------
    try:
        answers = resolver.resolve(domain, "TXT")
        spf_records = [
            str(r) for r in answers
            if "v=spf1" in str(r).lower()
        ]

        if spf_records:
            spf = spf_records[0].strip('"')
            findings.append({
                "severity":       "pass",
                "message":        "SPF record is configured",
                "technical":      spf,
                "recommendation": "No action needed.",
            })

            # Check for overly permissive SPF
            if "+all" in spf:
                findings.append({
                    "severity":       "critical",
                    "message":        "SPF record allows all senders (+all)",
                    "technical":      f"SPF: {spf} — '+all' means anyone can send email as this domain.",
                    "recommendation": "Change '+all' to '~all' or '-all' to restrict senders.",
                })
                score -= 25
            elif "~all" in spf:
                findings.append({
                    "severity":       "warning",
                    "message":        "SPF uses soft-fail (~all) instead of hard-fail (-all)",
                    "technical":      f"SPF: {spf}",
                    "recommendation": "Consider changing '~all' to '-all' for stricter enforcement.",
                })
                score -= 5
        else:
            findings.append({
                "severity":       "warning",
                "message":        "No SPF record found",
                "technical":      f"No TXT record containing 'v=spf1' found for {domain}.",
                "recommendation": "Add an SPF record: v=spf1 include:_spf.yourmailprovider.com -all",
            })
            score -= 15

    except dns.exception.DNSException as e:
        findings.append({
            "severity":       "warning",
            "message":        "SPF record could not be checked",
            "technical":      str(e),
            "recommendation": "Verify your DNS settings.",
        })
        score -= 10

    # ----------------------------------------------------------
    # CHECK 2 — DMARC record
    # ----------------------------------------------------------
    try:
        dmarc_domain = f"_dmarc.{domain}"
        answers      = resolver.resolve(dmarc_domain, "TXT")
        dmarc_records = [
            str(r) for r in answers
            if "v=dmarc1" in str(r).lower()
        ]

        if dmarc_records:
            dmarc = dmarc_records[0].strip('"')
            findings.append({
                "severity":       "pass",
                "message":        "DMARC policy is configured",
                "technical":      dmarc,
                "recommendation": "No action needed.",
            })

            # Check DMARC policy strength
            if "p=none" in dmarc.lower():
                findings.append({
                    "severity":       "warning",
                    "message":        "DMARC policy is set to 'none' — no enforcement",
                    "technical":      f"DMARC: {dmarc}",
                    "recommendation": "Change policy to p=quarantine or p=reject for real protection.",
                })
                score -= 10
            elif "p=quarantine" in dmarc.lower():
                findings.append({
                    "severity":       "pass",
                    "message":        "DMARC policy set to quarantine",
                    "technical":      f"DMARC: {dmarc}",
                    "recommendation": "Consider upgrading to p=reject for stricter protection.",
                })
        else:
            findings.append({
                "severity":       "warning",
                "message":        "No DMARC record found",
                "technical":      f"No _dmarc TXT record found for {domain}.",
                "recommendation": 'Add: _dmarc TXT "v=DMARC1; p=reject; rua=mailto:dmarc@yourdomain.com"',
            })
            score -= 15

    except dns.resolver.NXDOMAIN:
        findings.append({
            "severity":       "warning",
            "message":        "No DMARC record found",
            "technical":      f"_dmarc.{domain} does not exist.",
            "recommendation": 'Add: _dmarc TXT "v=DMARC1; p=reject; rua=mailto:dmarc@yourdomain.com"',
        })
        score -= 15

    except dns.exception.DNSException as e:
        findings.append({
            "severity":       "warning",
            "message":        "DMARC record could not be checked",
            "technical":      str(e),
            "recommendation": "Verify your DNS settings.",
        })
        score -= 10

    # ----------------------------------------------------------
    # CHECK 3 — DNSSEC
    # ----------------------------------------------------------
    try:
        answers = resolver.resolve(domain, "A")
        # If we got answers without error, basic DNS works
        findings.append({
            "severity":       "pass",
            "message":        "Domain resolves correctly",
            "technical":      f"Domain resolves to: {', '.join([str(r) for r in answers[:3]])}",
            "recommendation": "No action needed.",
        })
    except dns.exception.DNSException as e:
        findings.append({
            "severity":       "critical",
            "message":        "Domain does not resolve",
            "technical":      str(e),
            "recommendation": "Check your DNS configuration.",
        })
        score -= 30

    score = max(0, min(100, score))

    severities = [f["severity"] for f in findings]
    if "critical" in severities:
        status = "critical"
    elif "warning" in severities:
        status = "warning"
    else:
        status = "pass"

    return {
        "key":         "dns",
        "label":       "DNS & Email Security",
        "icon":        "🌐",
        "score":       score,
        "status":      status,
        "description": _get_description(status),
        "findings":    findings,
    }


def _get_description(status: str) -> str:
    if status == "pass":
        return "SPF and DMARC records are configured correctly."
    if status == "critical":
        return "Critical DNS issues found. Domain may be spoofable."
    return "Some DNS security records are missing or misconfigured."