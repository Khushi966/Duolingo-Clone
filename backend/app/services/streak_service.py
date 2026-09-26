from datetime import datetime, date
from sqlalchemy.orm import Session
from app.models.models import User
from app.services.dev_service import get_simulated_date_str, get_simulated_date


def update_streak_on_activity(db: Session, user: User, simulated_today_str: str = None) -> tuple[int, bool]:
    """
    Compares user.last_activity_date to the current simulated day:
    - If last activity was yesterday (diff == 1): increment streak by 1.
    - If gap > 1 day: reset streak to 1.
    - If same day (diff == 0): no-op on streak count.
    - If no previous activity: set streak to 1.
    Returns (current_streak, streak_increased).
    """
    if not simulated_today_str:
        simulated_today_str = get_simulated_date_str(db)
        today = get_simulated_date(db)
    else:
        today = datetime.strptime(simulated_today_str, "%Y-%m-%d").date()

    streak_increased = False

    if not user.last_activity_date:
        user.current_streak = 1
        user.longest_streak = max(user.longest_streak, 1)
        user.last_activity_date = simulated_today_str
        streak_increased = True
    else:
        try:
            last_date = datetime.strptime(user.last_activity_date, "%Y-%m-%d").date()
            delta_days = (today - last_date).days
        except ValueError:
            delta_days = 999

        if delta_days == 0:
            # Already practiced today
            streak_increased = False
        elif delta_days == 1:
            # Practiced yesterday -> increment streak
            user.current_streak += 1
            user.longest_streak = max(user.longest_streak, user.current_streak)
            user.last_activity_date = simulated_today_str
            streak_increased = True
        elif delta_days > 1:
            # Missed at least one day -> streak resets to 1
            user.current_streak = 1
            user.last_activity_date = simulated_today_str
            streak_increased = True
        else:
            # delta_days < 0 (simulated time moved backwards), preserve streak but update date
            user.last_activity_date = simulated_today_str

    db.commit()
    return user.current_streak, streak_increased
