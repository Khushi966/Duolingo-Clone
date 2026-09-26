from app.routers.path import router as path_router
from app.routers.lessons import router as lessons_router
from app.routers.users import router as users_router
from app.routers.leaderboard import router as leaderboard_router
from app.routers.dev import router as dev_router

__all__ = [
    "path_router",
    "lessons_router",
    "users_router",
    "leaderboard_router",
    "dev_router",
]
