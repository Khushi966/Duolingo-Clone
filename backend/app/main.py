import os
import sys

# Ensure backend directory is in sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.base import Base, engine, SessionLocal
from app.db.seed import seed_db
from app.routers import (
    path_router,
    lessons_router,
    users_router,
    leaderboard_router,
    dev_router,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_db(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title="Duolingo Clone API",
    description="Full-stack Duolingo clone backend API featuring gamification, streaks, heart regen, and exercises.",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows Next.js frontend on any port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(path_router)
app.include_router(lessons_router)
app.include_router(users_router)
app.include_router(leaderboard_router)
app.include_router(dev_router)


@app.get("/")
def root():
    return {
        "status": "healthy",
        "app": "Duolingo Clone API",
        "version": "1.0.0",
        "documentation": "/docs",
    }
