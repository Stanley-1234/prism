# ============================================================
# PRISM — DATABASE MODELS
# ============================================================

from sqlalchemy import (
    Column, String, Integer, Boolean,
    DateTime, Text, JSON, Index
)
from sqlalchemy.sql import func
from app.db.database import Base


# ------------------------------------------------------------
# SCAN RECORD
# ------------------------------------------------------------

class ScanRecord(Base):
    __tablename__ = "scan_records"

    id            = Column(String,   primary_key=True, index=True)
    url           = Column(String,   nullable=False)
    domain        = Column(String,   nullable=False, index=True)
    overall_score = Column(Integer,  nullable=False)
    grade         = Column(String,   nullable=False)
    verdict       = Column(String,   nullable=False)
    ai_summary    = Column(Text,     nullable=True)
    categories    = Column(JSON,     nullable=True)
    scanned_at    = Column(DateTime, server_default=func.now(), nullable=False)
    ip_address    = Column(String,   nullable=True)

    __table_args__ = (
        Index("ix_scan_records_domain_scanned_at", "domain", "scanned_at"),
        Index("ix_scan_records_overall_score",     "overall_score"),
    )

    def to_dict(self) -> dict:
        return {
            "id":            self.id,
            "url":           self.url,
            "domain":        self.domain,
            "overall_score": self.overall_score,
            "grade":         self.grade,
            "verdict":       self.verdict,
            "ai_summary":    self.ai_summary,
            "categories":    self.categories,
            "scanned_at":    self.scanned_at.isoformat() if self.scanned_at else None,
        }


# ------------------------------------------------------------
# REVIEW
# ------------------------------------------------------------

class Review(Base):
    __tablename__ = "reviews"

    id             = Column(String,   primary_key=True, index=True)
    rating         = Column(Integer,  nullable=False)
    comment        = Column(Text,     nullable=False)
    reviewer_name  = Column(String,   nullable=True,  default="Anonymous")
    domain_scanned = Column(String,   nullable=True)
    show_domain    = Column(Boolean,  nullable=False, default=False)
    is_approved    = Column(Boolean,  nullable=False, default=True)
    created_at     = Column(DateTime, server_default=func.now(), nullable=False)

    __table_args__ = (
        Index("ix_reviews_is_approved_created_at", "is_approved", "created_at"),
    )

    def to_dict(self) -> dict:
        return {
            "id":             self.id,
            "rating":         self.rating,
            "comment":        self.comment,
            "reviewer_name":  self.reviewer_name or "Anonymous",
            "domain_scanned": self.domain_scanned if self.show_domain else None,
            "show_domain":    self.show_domain,
            "is_approved":    self.is_approved,
            "created_at":     self.created_at.isoformat() if self.created_at else None,
        }


# ------------------------------------------------------------
# BOOKING
# Every pen test / audit enquiry submitted via contact form
# ------------------------------------------------------------

class Booking(Base):
    __tablename__ = "bookings"

    id           = Column(String,   primary_key=True, index=True)
    name         = Column(String,   nullable=False)
    email        = Column(String,   nullable=False, index=True)
    phone        = Column(String,   nullable=True)
    company      = Column(String,   nullable=True)
    website      = Column(String,   nullable=True)
    service_type = Column(String,   nullable=False)  # pen_test / audit / consultation
    message      = Column(Text,     nullable=True)
    scan_score   = Column(Integer,  nullable=True)   # Score from their scan if applicable
    scan_domain  = Column(String,   nullable=True)   # Domain they scanned
    status       = Column(String,   nullable=False, default="new")  # new / contacted / closed
    created_at   = Column(DateTime, server_default=func.now(), nullable=False)

    __table_args__ = (
    Index("ix_bookings_status_created_at", "status", "created_at"),
    )
    def to_dict(self) -> dict:
        return {
            "id":           self.id,
            "name":         self.name,
            "email":        self.email,
            "phone":        self.phone,
            "company":      self.company,
            "website":      self.website,
            "service_type": self.service_type,
            "message":      self.message,
            "scan_score":   self.scan_score,
            "scan_domain":  self.scan_domain,
            "status":       self.status,
            "created_at":   self.created_at.isoformat() if self.created_at else None,
        }