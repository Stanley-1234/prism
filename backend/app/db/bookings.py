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

        service_label = SERVICE_LABELS.get(booking.service_type, booking.service_type)
        first_name    = booking.name.split()[0]

        # ---- NOTIFICATION TO SIU ----
        notification_html = f"""
        <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #ffffff;">
          <div style="border-bottom: 2px solid #f0ede8; padding-bottom: 20px; margin-bottom: 28px;">
            <h1 style="font-size: 22px; font-weight: 800; color: #1a1a1a; margin: 0;">
              🔔 New Booking — {service_label}
            </h1>
          </div>

          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #888; font-size: 13px; width: 120px;">Name</td>
                <td style="padding: 8px 0; color: #1a1a1a; font-weight: 600;">{booking.name}</td></tr>
            <tr><td style="padding: 8px 0; color: #888; font-size: 13px;">Email</td>
                <td style="padding: 8px 0; color: #1a1a1a; font-weight: 600;">{booking.email}</td></tr>
            <tr><td style="padding: 8px 0; color: #888; font-size: 13px;">Phone</td>
                <td style="padding: 8px 0; color: #1a1a1a;">{booking.phone or '—'}</td></tr>
            <tr><td style="padding: 8px 0; color: #888; font-size: 13px;">Company</td>
                <td style="padding: 8px 0; color: #1a1a1a;">{booking.company or '—'}</td></tr>
            <tr><td style="padding: 8px 0; color: #888; font-size: 13px;">Website</td>
                <td style="padding: 8px 0; color: #1a1a1a;">{booking.website or '—'}</td></tr>
            <tr><td style="padding: 8px 0; color: #888; font-size: 13px;">Service</td>
                <td style="padding: 8px 0; color: #2d9e5f; font-weight: 700;">{service_label}</td></tr>
            {'<tr><td style="padding: 8px 0; color: #888; font-size: 13px;">Scan Score</td><td style="padding: 8px 0; color: #1a1a1a;">' + str(booking.scan_score) + '/100 — ' + (booking.scan_domain or '') + '</td></tr>' if booking.scan_score else ''}
          </table>

          {f'<div style="margin-top: 24px; background: #f9f7f4; border-radius: 8px; padding: 16px;"><p style="color: #888; font-size: 12px; margin: 0 0 6px;">Message</p><p style="color: #1a1a1a; font-size: 14px; margin: 0;">{booking.message}</p></div>' if booking.message else ''}

          <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #f0ede8; font-size: 12px; color: #aaa;">
            Submitted via prismapp.space · {datetime.now().strftime('%d %b %Y, %H:%M')} UTC
          </div>
        </div>
        """

        # ---- CONFIRMATION TO CLIENT ----
        confirmation_html = f"""
        <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #ffffff;">
          <div style="border-bottom: 2px solid #f0ede8; padding-bottom: 20px; margin-bottom: 28px;">
            <h1 style="font-size: 22px; font-weight: 800; color: #1a1a1a; margin: 0 0 4px;">
              Hi {first_name}, we got your enquiry ✓
            </h1>
            <p style="color: #888; font-size: 14px; margin: 0;">SIU Security · prismapp.space</p>
          </div>

          <p style="color: #444; font-size: 15px; line-height: 1.7; margin: 0 0 24px;">
            Thanks for reaching out. We've received your enquiry for a
            <strong style="color: #1a1a1a;">{service_label}</strong> and a member of our
            team will be in touch within <strong style="color: #1a1a1a;">24 hours</strong>.
          </p>

          <div style="background: #f9f7f4; border-radius: 10px; padding: 20px 24px; margin-bottom: 28px;">
            <p style="font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #888; margin: 0 0 12px;">Your enquiry summary</p>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 6px 0; color: #888; font-size: 13px; width: 100px;">Service</td>
                  <td style="padding: 6px 0; color: #1a1a1a; font-weight: 600;">{service_label}</td></tr>
              {f'<tr><td style="padding: 6px 0; color: #888; font-size: 13px;">Website</td><td style="padding: 6px 0; color: #1a1a1a;">{booking.website}</td></tr>' if booking.website else ''}
              {f'<tr><td style="padding: 6px 0; color: #888; font-size: 13px;">Company</td><td style="padding: 6px 0; color: #1a1a1a;">{booking.company}</td></tr>' if booking.company else ''}
            </table>
          </div>

          <p style="color: #444; font-size: 14px; line-height: 1.7; margin: 0 0 8px;">
            In the meantime, feel free to reply to this email with any questions.
          </p>

          <p style="color: #444; font-size: 14px; margin: 0 0 32px;">
            — The SIU Security Team
          </p>

          <div style="padding-top: 20px; border-top: 1px solid #f0ede8; font-size: 12px; color: #aaa;">
            SIU Security · siutech.info@gmail.com · +234 707 240 3048<br/>
            <a href="https://prismapp.space" style="color: #2d9e5f;">prismapp.space</a>
          </div>
        </div>
        """

        headers = {
            "Authorization": f"Bearer {resend_key}",
            "Content-Type":  "application/json",
        }

        with httpx.Client(timeout=10.0) as client:
            # Send notification to SIU
            client.post(
                "https://api.resend.com/emails",
                headers=headers,
                json={
                    "from":    "Prism Bookings <bookings@prismapp.space>",
                    "to":      ["siutech.info@gmail.com"],
                    "subject": f"New Booking: {service_label} — {booking.name}",
                    "html":    notification_html,
                },
            )

            # Send confirmation to client
            client.post(
                "https://api.resend.com/emails",
                headers=headers,
                json={
                    "from":    "SIU Security <bookings@prismapp.space>",
                    "to":      [booking.email],
                    "subject": f"We received your enquiry — {service_label}",
                    "html":    confirmation_html,
                },
            )

        print(f"✉️  Emails sent for booking: {booking.name}")

    except Exception as e:
        print(f"⚠️  Email send failed (booking still saved): {e}")


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
                send_emails(booking)

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