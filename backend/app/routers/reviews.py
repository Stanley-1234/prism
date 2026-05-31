# ============================================================
# PRISM BACKEND — REVIEWS ROUTER (WITH DB)
# POST /api/reviews — submit a review, save to DB
# GET  /api/reviews — fetch approved reviews from DB
# ============================================================

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import Optional
import uuid
from datetime import datetime, timezone

from app.db.database import get_db
from app.db.models   import Review

router = APIRouter()

# ------------------------------------------------------------
# REQUEST MODEL
# ------------------------------------------------------------

class ReviewRequest(BaseModel):
    rating:         int
    comment:        str
    reviewer_name:  Optional[str] = "Anonymous"
    domain_scanned: Optional[str] = None
    show_domain:    bool          = False

# ------------------------------------------------------------
# GET REVIEWS
# ------------------------------------------------------------

@router.get("/reviews")
async def get_reviews(
    limit:  int     = 50,
    offset: int     = 0,
    db:     Session = Depends(get_db),
):
    """Return approved reviews from DB, newest first."""
    try:
        reviews = (
            db.query(Review)
            .filter(Review.is_approved == True)
            .order_by(Review.created_at.desc())
            .offset(offset)
            .limit(limit)
            .all()
        )
        total = (
            db.query(Review)
            .filter(Review.is_approved == True)
            .count()
        )

        return {
            "success": True,
            "data":    [r.to_dict() for r in reviews],
            "total":   total,
        }

    except Exception as e:
        print(f"⚠️  DB read failed for reviews: {e}")
        # Return empty rather than crash
        return {
            "success": True,
            "data":    [],
            "total":   0,
        }

# ------------------------------------------------------------
# POST REVIEW
# ------------------------------------------------------------

@router.post("/reviews")
async def submit_review(
    request: ReviewRequest,
    db:      Session = Depends(get_db),
):
    """Submit and save a review to DB."""

    if not 1 <= request.rating <= 5:
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5.")

    if len(request.comment.strip()) < 10:
        raise HTTPException(status_code=400, detail="Comment must be at least 10 characters.")

    if len(request.comment) > 500:
        raise HTTPException(status_code=400, detail="Comment must be under 500 characters.")

    try:
        review = Review(
            id             = str(uuid.uuid4()),
            rating         = request.rating,
            comment        = request.comment.strip(),
            reviewer_name  = (request.reviewer_name or "Anonymous").strip(),
            domain_scanned = request.domain_scanned if request.show_domain else None,
            show_domain    = request.show_domain,
            is_approved    = True,
            created_at     = datetime.now(timezone.utc),
        )

        db.add(review)
        db.commit()
        db.refresh(review)

        print(f"⭐  New review: {review.rating}/5 from {review.reviewer_name}")

        return {
            "success": True,
            "data":    review.to_dict(),
        }

    except Exception as e:
        db.rollback()
        print(f"❌  Review save failed: {e}")
        raise HTTPException(status_code=500, detail="Could not save review.")