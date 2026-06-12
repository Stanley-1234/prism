# ============================================================
# PRISM BACKEND — SCAN ROUTER (FINAL)
# POST /api/scan — runs all scanners in parallel.
# Each scanner has an 20s individual timeout.
# DB save runs in background thread — never blocks response.
# ============================================================

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import asyncio
import uuid
import threading
from datetime import datetime, timezone

from app.scanners.ssl_check        import check_ssl
from app.scanners.headers_check    import check_headers
from app.scanners.cookies_check    import check_cookies
from app.scanners.dns_check        import check_dns
from app.scanners.reputation_check import check_reputation
from app.scanners.stack_check      import check_stack
from app.scoring.engine            import calculate_score

router = APIRouter()

# ------------------------------------------------------------
# MODELS
# ------------------------------------------------------------

class ScanRequest(BaseModel):
    url: str

class ScanResponse(BaseModel):
    success: bool
    data:    dict | None = None
    error:   str  | None = None

# ------------------------------------------------------------
# HELPERS
# ------------------------------------------------------------

def normalize_url(url: str) -> str:
    url = url.strip()
    if not url.startswith(("http://", "https://")):
        url = f"https://{url}"
    return url

def extract_domain(url: str) -> str:
    from urllib.parse import urlparse
    parsed = urlparse(url)
    domain = parsed.netloc or parsed.path
    return domain.replace("www.", "")

def domain_resolves(domain: str) -> bool:
    """Quick check if the domain has any DNS record at all."""
    import socket
    try:
        clean = domain.split(":")[0]
        socket.setdefaulttimeout(4)
        socket.gethostbyname(clean)
        return True
    except (socket.gaierror, socket.timeout, UnicodeError):
        return False

def save_scan_to_db(scan_id, url, domain, score_data, categories, scanned_at):
    """Save scan result to DB in a background thread — never blocks response."""
    try:
        from app.db.database import SessionLocal
        from app.db.models   import ScanRecord
        db = SessionLocal()
        record = ScanRecord(
            id            = scan_id,
            url           = url,
            domain        = domain,
            overall_score = score_data["overall_score"],
            grade         = score_data["grade"],
            verdict       = score_data["verdict"],
            ai_summary    = score_data.get("ai_summary", ""),
            categories    = categories,
            scanned_at    = scanned_at,
        )
        db.add(record)
        db.commit()
        db.close()
        print(f"✅  Saved: {domain} — {score_data['grade']} ({score_data['overall_score']})")
    except Exception as e:
        print(f"⚠️  DB save failed (scan still returned): {e}")

# ------------------------------------------------------------
# SCAN ENDPOINT
# ------------------------------------------------------------

@router.post("/scan", response_model=ScanResponse)
async def scan_url(request: ScanRequest):
    url    = normalize_url(request.url)
    domain = extract_domain(url)

    if not domain:
        raise HTTPException(status_code=400, detail="Invalid URL provided.")

    # Check the domain actually exists before running scanners
    if not domain_resolves(domain):
        raise HTTPException(
            status_code=404,
            detail="This website could not be found. Please check the URL and try again."
        )

    try:
        print(f"🔍 Scanning {domain}")

        results = await asyncio.gather(
            asyncio.wait_for(check_ssl(url, domain),   timeout=20.0),
            asyncio.wait_for(check_headers(url),       timeout=20.0),
            asyncio.wait_for(check_cookies(url),       timeout=20.0),
            asyncio.wait_for(check_dns(domain),        timeout=20.0),
            asyncio.wait_for(check_reputation(domain), timeout=20.0),
            asyncio.wait_for(check_stack(url),         timeout=20.0),
            return_exceptions=True,
        )

        def safe_result(result, key, label, icon):
            if isinstance(result, Exception):
                print(f"⚠️  Scanner [{key}] failed: {type(result).__name__}: {result}")
                return {
                    "key":         key,
                    "label":       label,
                    "icon":        icon,
                    "score":       75,
                    "status":      "warning",
                    "description": "This check timed out — likely a network issue, not a problem with the site.",
                    "findings": [{
                        "severity":       "warning",
                        "message":        "Check timed out — may be a network issue",
                        "technical":      str(result),
                        "recommendation": "Try scanning again for more accurate results.",
                    }],
                }
            return result

        categories = {
            "ssl":        safe_result(results[0], "ssl",        "SSL Certificate",         "🔒"),
            "headers":    safe_result(results[1], "headers",    "Security Headers",        "🛡️"),
            "cookies":    safe_result(results[2], "cookies",    "Cookie Security",         "🍪"),
            "dns":        safe_result(results[3], "dns",        "DNS & Email Security",    "🌐"),
            "reputation": safe_result(results[4], "reputation", "Reputation & Blacklists", "🔍"),
            "stack":      safe_result(results[5], "stack",      "Tech Stack Exposure",     "⚙️"),
        }

        # Count failed scanners
        timeout_count = sum(1 for r in results if isinstance(r, Exception))

        # If 3+ failed, return a clean error instead of a misleading score
        if timeout_count >= 3:
            return ScanResponse(
                success=False,
                error="Scan could not complete — please check your internet connection and try again.",
            )

        # Flag if any scanner failed — frontend will show connection toast
        network_issue = timeout_count > 0

        score_data = calculate_score(categories)
        scan_id    = str(uuid.uuid4())
        scanned_at = datetime.now(timezone.utc)

        print(f"📊 {domain} — {score_data['grade']} ({score_data['overall_score']})")

        threading.Thread(
            target=save_scan_to_db,
            args=(scan_id, url, domain, score_data, categories, scanned_at),
            daemon=True,
        ).start()

        return ScanResponse(
            success=True,
            data={
                "id":            scan_id,
                "url":           url,
                "domain":        domain,
                "scanned_at":    scanned_at.isoformat(),
                "overall_score": score_data["overall_score"],
                "grade":         score_data["grade"],
                "verdict":       score_data["verdict"],
                "ai_summary":    score_data.get("ai_summary", ""),
                "categories":    categories,
                "network_issue": network_issue,
            }
        )

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Scan failed for {url}: {e}")
        raise HTTPException(status_code=500, detail=f"Scan failed: {str(e)}")


# ------------------------------------------------------------
# GET RECENT SCANS FOR A DOMAIN
# ------------------------------------------------------------

@router.get("/scans/{domain}")
async def get_domain_scans(domain: str, limit: int = 5):
    try:
        from app.db.database import SessionLocal
        from app.db.models   import ScanRecord
        db      = SessionLocal()
        records = (
            db.query(ScanRecord)
            .filter(ScanRecord.domain == domain)
            .order_by(ScanRecord.scanned_at.desc())
            .limit(limit)
            .all()
        )
        db.close()
        return {
            "success": True,
            "domain":  domain,
            "data":    [r.to_dict() for r in records],
        }
    except Exception as e:
        return {"success": False, "error": str(e)}