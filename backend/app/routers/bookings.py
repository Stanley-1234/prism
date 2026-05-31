# ============================================================
# PRISM BACKEND — BOOKINGS ROUTER
# POST /api/bookings — submit a booking enquiry
# GET  /api/bookings — list all bookings (admin)
# ============================================================

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import uuid
import os
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
# EMAIL HELPERS
# ------------------------------------------------------------

SERVICE_LABELS = {
    "pen_test":     "Penetration Test",
    "audit":        "Security Audit",
    "consultation": "Security Consultation",
}

def send_emails(booking):
    """Send notification to SIU and confirmation to client."""
    try:
        import httpx

        resend_key = os.getenv("RESEND_API_KEY", "")
        if not resend_key:
            print("⚠️  RESEND_API_KEY not set — skipping emails")
            return

        print(f"🔑 RESEND KEY EXISTS: True (starts with {resend_key[:6]}...)")

        service_label = SERVICE_LABELS.get(booking.service_type, booking.service_type)
        first_name    = booking.name.split()[0]

        # ---- NOTIFICATION TO SIU ----
        notification_html = f"""
        <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
          <h1 style="font-size: 22px; font-weight: 800; color: #1a1a1a;">
            🔔 New Booking — {service_label}
          </h1>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #888; width: 120px;">Name</td>
                <td style="padding: 8px 0; font-weight: 600;">{booking.name}</td></tr>
            <tr><td style="padding: 8px 0; color: #888;">Email</td>
                <td style="padding: 8px 0; font-weight: 600;">{booking.email}</td></tr>
            <tr><td style="padding: 8px 0; color: #888;">Phone</td>
                <td style="padding: 8px 0;">{booking.phone or '—'}</td></tr>
            <tr><td style="padding: 8px 0; color: #888;">Company</td>
                <td style="padding: 8px 0;">{booking.company or '—'}</td></tr>
            <tr><td style="padding: 8px 0; color: #888;">Service</td>
                <td style="padding: 8px 0; color: #2d9e5f; font-weight: 700;">{service_label}</td></tr>
          </table>
          {f'<p><strong>Message:</strong> {booking.message}</p>' if booking.message else ''}
          <p style="color: #aaa; font-size: 12px;">Submitted via prismapp.space · {datetime.now().strftime("%d %b %Y, %H:%M")} UTC</p>
        </div>
        """

        # ---- CONFIRMATION TO CLIENT ----
        confirmation_html = f"""
        <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
          <h1 style="font-size: 22px; font-weight: 800; color: #1a1a1a;">
            Hi {first_name}, we got your enquiry ✓
          </h1>
          <p style="color: #444; font-size: 15px; line-height: 1.7;">
            Thanks for reaching out. We've received your enquiry for a
            <strong>{service_label}</strong> and a member of our team will be in touch within
            <strong>24 hours</strong>.
          </p>
          <p style="color: #444; font-size: 14px;">— The SIU Security Team</p>
          <p style="color: #aaa; font-size: 12px;">SIU Security · siutech.info@gmail.com · prismapp.space</p>
        </div>
        """

        headers = {
            "Authorization": f"Bearer {resend_key}",
            "Content-Type":  "application/json",
        }

        with httpx.Client(timeout=10.0) as client:
            r1 = client.post(
                "https://api.resend.com/emails",
                headers=headers,
                json={
                    "from":    "Prism Bookings <bookings@prismapp.space>",
                    "to":      ["siutech.info@gmail.com"],
                    "subject": f"New Booking: {service_label} — {booking.name}",
                    "html":    notification_html,
                },
            )
            print(f"📨 Notification email: {r1.status_code} — {r1.text}")

            r2 = client.post(
                "https://api.resend.com/emails",
                headers=headers,
                json={
                    "from":    "SIU Security <bookings@prismapp.space>",
                    "to":      [booking.email],
                    "subject": f"We received your enquiry — {service_label}",
                    "html":    confirmation_html,
                },
            )
            print(f"📨 Confirmation email: {r2.status_code} — {r2.text}")

        print(f"✉️  Emails sent for booking: {booking.name}")

    except Exception as e:
        import traceback
        print(f"⚠️  Email send failed: {e}")
        traceback.print_exc()


# ------------------------------------------------------------
# SUBMIT BOOKING
# ------------------------------------------------------------

@router.post("/bookings")
async def submit_booking(request: BookingRequest):
    """Save booking to DB and send emails."""

    if not request.name.strip():
        raise HTTPException(status_code=400, detail="Name is required.")
    if not request.email.strip() or "@" not in request.email:
        raise HTTPException(status_code=400, detail="Valid email is required.")
    if request.service_type not in ["pen_test", "audit", "consultation"]:
        raise HTTPException(status_code=400, detail="Invalid service type.")

    try:
        import threading

        def save_and_notify():
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
                print(f"📧 Calling send_emails...")
                send_emails(booking)
                print(f"📧 send_emails() done")

            except Exception as e:
                print(f"⚠️  Booking save failed: {e}")

        threading.Thread(target=save_and_notify, daemon=True).start()

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