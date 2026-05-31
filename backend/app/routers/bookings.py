# ============================================================
# PRISM BACKEND — BOOKINGS ROUTER
# POST /api/bookings — submit a booking enquiry
# GET  /api/bookings — list all bookings (admin)
# ============================================================

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import uuid
from datetime import datetime, timezone

router = APIRouter()

# ------------------------------------------------------------
# REQUEST MODEL
# ------------------------------------------------------------

class BookingRequest(BaseModel):
    name:         str
    email:        str
    phone:        Optional[str] = None
    company:      Optional[str] = None
    website:      Optional[str] = None
    service_type: str
    message:      Optional[str] = None
    scan_score:   Optional[int] = None
    scan_domain:  Optional[str] = None

# ------------------------------------------------------------
# SUBMIT BOOKING
# ------------------------------------------------------------

@router.post("/bookings")
async def submit_booking(request: BookingRequest):
    """Save booking to DB. Email sent when domain is ready."""

    # Validate
    if not request.name.strip():
        raise HTTPException(status_code=400, detail="Name is required.")
    if not request.email.strip() or "@" not in request.email:
        raise HTTPException(status_code=400, detail="Valid email is required.")
    if request.service_type not in ["pen_test", "audit", "consultation"]:
        raise HTTPException(status_code=400, detail="Invalid service type.")

    try:
        import threading

        def save_booking():
            try:
                from app.db.database import SessionLocal
                from app.db.models   import Booking
                db = SessionLocal()
                booking = Booking(
                    id           = str(uuid.uuid4()),
                    name         = request.name.strip(),
                    email        = request.email.strip().lower(),
                    phone        = request.phone,
                    company      = request.company,
                    website      = request.website,
                    service_type = request.service_type,
                    message      = request.message,
                    scan_score   = request.scan_score,
                    scan_domain  = request.scan_domain,
                    status       = "new",
                    created_at   = datetime.now(timezone.utc),
                )
                db.add(booking)
                db.commit()
                db.close()
                print(f"📅 New booking: {request.name} ({request.email}) — {request.service_type}")

                # EMAIL PLACEHOLDER
                # Uncomment and fill in when domain is ready:
                # send_notification_email(booking)
                # send_confirmation_email(booking)

            except Exception as e:
                print(f"⚠️  Booking save failed: {e}")

        threading.Thread(target=save_booking, daemon=True).start()

        return {
            "success": True,
            "message": "Booking received. We will be in touch within 24 hours.",
        }

    except Exception as e:
        print(f"❌ Booking failed: {e}")
        raise HTTPException(status_code=500, detail="Could not save booking.")


# ------------------------------------------------------------
# GET ALL BOOKINGS (ADMIN)
# ------------------------------------------------------------

@router.get("/bookings")
async def get_bookings(limit: int = 50, status: Optional[str] = None):
    """Return all bookings. Add auth before making this public."""
    try:
        from app.db.database import SessionLocal
        from app.db.models   import Booking
        db    = SessionLocal()
        query = db.query(Booking)
        if status:
            query = query.filter(Booking.status == status)
        bookings = query.order_by(Booking.created_at.desc()).limit(limit).all()
        db.close()
        return {
            "success": True,
            "data":    [b.to_dict() for b in bookings],
            "total":   len(bookings),
        }
    except Exception as e:
        return {"success": False, "error": str(e)}