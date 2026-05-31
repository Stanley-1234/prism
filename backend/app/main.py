# ============================================================
# PRISM BACKEND — MAIN APPLICATION
# ============================================================

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv

load_dotenv()

from app.routers import scan, reviews, bookings

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🔺 PRISM backend starting up...")
    print(f"   Environment: {os.getenv('ENVIRONMENT', 'development')}")
    yield
    print("🔻 PRISM backend shutting down...")

app = FastAPI(
    title="PRISM API",
    description="Security scanning API for PRISM — by SIU",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        FRONTEND_URL,
        "http://localhost:3000",
        "http://localhost:3001",
        "https://prismapp.space",
        "https://www.prismapp.space",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(scan.router,     prefix="/api", tags=["scan"])
app.include_router(reviews.router,  prefix="/api", tags=["reviews"])
app.include_router(bookings.router, prefix="/api", tags=["bookings"])

@app.get("/")
async def root():
    return {
        "service": "PRISM API",
        "version": "1.0.0",
        "status":  "running",
        "docs":    "/docs",
    }

@app.get("/health")
async def health():
    return {"status": "healthy"}