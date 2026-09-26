from datetime import datetime, timezone
from typing import List
from sqlalchemy.orm import Session
from app.models.models import (
    User,
    LeagueMembership,
    Achievement,
    UserAchievement,
    LessonAttempt,
)
from app.services.dev_service import get_current_week_start
from app.services.dev_service import get_simulated_date_str
from app.schemas.schemas import AchievementResponse


def get_daily_xp(db: Session, user_id: int) -> int:
    simulated_date = get_simulated_date_str(db)
    attempts = (
        db.query(LessonAttempt)
        .filter(
            LessonAttempt.user_id == user_id,
            LessonAttempt.completed_at.isnot(None),
        )
        .all()
    )
    return sum(
        attempt.xp_earned
        for attempt in attempts
        if attempt.completed_at.strftime("%Y-%m-%d") == simulated_date
    )


def award_lesson_xp(
    db: Session,
    user: User,
    correct_count: int,
    incorrect_count: int,
    hearts_lost: int,
) -> tuple[int, List[AchievementResponse]]:
    """
    Awards XP to user based on correct answers, updates league XP, and evaluates achievements.
    Returns (xp_earned, newly_unlocked_achievements).
    """
    base_xp = correct_count * 3  # ~15-24 XP per lesson
    bonus_xp = 5 if incorrect_count == 0 and correct_count > 0 else 0
    xp_earned = max(5, base_xp + bonus_xp)

    # 1. Update user total XP
    user.total_xp += xp_earned

    # 2. Update League Membership for current week
    week_start = get_current_week_start(db)
    league_entry = (
        db.query(LeagueMembership)
        .filter(
            LeagueMembership.user_id == user.id,
            LeagueMembership.week_start == week_start,
        )
        .first()
    )
    if not league_entry:
        league_entry = LeagueMembership(
            user_id=user.id,
            week_start=week_start,
            xp_this_week=xp_earned,
        )
        db.add(league_entry)
    else:
        league_entry.xp_this_week += xp_earned

    db.commit()

    # 3. Check for newly unlocked achievements
    newly_unlocked: List[AchievementResponse] = []
    unlocked_ids = {
        ua.achievement_id
        for ua in db.query(UserAchievement).filter(UserAchievement.user_id == user.id).all()
    }

    all_achievements = db.query(Achievement).all()
    for ach in all_achievements:
        if ach.id in unlocked_ids:
            continue

        should_unlock = False

        # Criteria checks:
        if "Streak" in ach.title and user.current_streak >= 3:
            should_unlock = True
        elif "Titan" in ach.title and user.total_xp >= 500:
            should_unlock = True
        elif "Sharp Mind" in ach.title:
            perfect_attempts = (
                db.query(LessonAttempt)
                .filter(
                    LessonAttempt.user_id == user.id,
                    LessonAttempt.correct_count > 0,
                    LessonAttempt.incorrect_count == 0,
                    LessonAttempt.hearts_lost == 0,
                )
                .count()
            )
            current_attempt_is_perfect = (
                correct_count > 0 and incorrect_count == 0 and hearts_lost == 0
            )
            if perfect_attempts + int(current_attempt_is_perfect) >= 5:
                should_unlock = True

        if should_unlock:
            now_dt = datetime.now(timezone.utc)
            ua = UserAchievement(
                user_id=user.id,
                achievement_id=ach.id,
                unlocked_at=now_dt,
            )
            db.add(ua)
            db.commit()
            newly_unlocked.append(
                AchievementResponse(
                    id=ach.id,
                    title=ach.title,
                    description=ach.description,
                    icon=ach.icon,
                    unlocked=True,
                    unlocked_at=now_dt,
                )
            )

    return xp_earned, newly_unlocked
