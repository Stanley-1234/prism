# ============================================================
# PRISM — DATABASE INITIALISER
# Creates all tables if they don't exist.
# Run once: python -m app.db.init_db
# Safe to run multiple times — won't drop existing data.
# ============================================================

from app.db.database import engine, Base
from app.db import models  # Import models so Base knows about them


def init_db():
    """Create all tables."""
    print("🗄️  Creating database tables...")
    Base.metadata.create_all(bind=engine, checkfirst=True)
    print("✅  Tables created successfully.")
    print("    Tables: scan_records, reviews")


if __name__ == "__main__":
    init_db()