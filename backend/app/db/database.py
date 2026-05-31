# ============================================================
# PRISM — DATABASE CONNECTION
# SQLAlchemy setup with PostgreSQL.
# Connection pool, session management, base model.
# ============================================================

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import NullPool
import os
from dotenv import load_dotenv

load_dotenv()

# ------------------------------------------------------------
# DATABASE URL
# ------------------------------------------------------------

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:password@localhost:5432/prism"
)

# Fix for some PostgreSQL URL formats
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# ------------------------------------------------------------
# ENGINE
# ------------------------------------------------------------

engine = create_engine(
    DATABASE_URL,
    poolclass=NullPool,    # Fresh connection each request — safer for async
    echo=False,            # Set True to log all SQL queries
)

# ------------------------------------------------------------
# SESSION
# ------------------------------------------------------------

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

# ------------------------------------------------------------
# BASE MODEL
# All DB models inherit from this
# ------------------------------------------------------------

Base = declarative_base()

# ------------------------------------------------------------
# DEPENDENCY — get DB session
# Used in FastAPI route dependencies
# ------------------------------------------------------------

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()