from app.services.heart_service import (
    calculate_and_update_hearts,
    deduct_hearts,
    refill_hearts,
)
from app.services.streak_service import update_streak_on_activity
from app.services.xp_service import award_lesson_xp
from app.services.grading_service import grade_exercise, normalize_text
from app.services.dev_service import (
    get_simulated_date,
    get_simulated_date_str,
    get_simulated_datetime,
    advance_simulated_day,
    get_current_week_start,
)

__all__ = [
    "calculate_and_update_hearts",
    "deduct_hearts",
    "refill_hearts",
    "update_streak_on_activity",
    "award_lesson_xp",
    "grade_exercise",
    "normalize_text",
    "get_simulated_date",
    "get_simulated_date_str",
    "get_simulated_datetime",
    "advance_simulated_day",
    "get_current_week_start",
]
