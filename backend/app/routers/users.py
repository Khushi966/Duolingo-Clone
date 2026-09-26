from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.base import get_db
from app.models.models import (
    User,
    Achievement,
    UserAchievement,
    LessonAttempt,
)
from app.schemas.schemas import (
    UserProfileResponse,
    HeartsRefillResponse,
    AchievementResponse,
    LessonAttemptResponse,
)
from app.services.heart_service import (
    calculate_and_update_hearts,
    refill_hearts,
)
from app.services.dev_service import get_simulated_date_str
from app.services.xp_service import get_daily_xp

router = APIRouter(prefix="/api/users", tags=["users"])


@router.get("/me", response_model=UserProfileResponse)
def get_current_user_profile(db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == 1).first()
    if not user:
        raise HTTPException(status_code=404, detail="Default user not found")

    user = calculate_and_update_hearts(db, user)

    # Fetch achievements
    all_achievements = db.query(Achievement).all()
    user_ach_map = {
        ua.achievement_id: ua.unlocked_at
        for ua in db.query(UserAchievement).filter(UserAchievement.user_id == user.id).all()
    }

    achievements_res = [
        AchievementResponse(
            id=ach.id,
            title=ach.title,
            description=ach.description,
            icon=ach.icon,
            unlocked=ach.id in user_ach_map,
            unlocked_at=user_ach_map.get(ach.id),
        )
        for ach in all_achievements
    ]

    # Fetch recent lesson attempts (up to 10)
    attempts = (
        db.query(LessonAttempt)
        .filter(LessonAttempt.user_id == user.id)
        .order_by(LessonAttempt.started_at.desc())
        .limit(10)
        .all()
    )

    recent_attempts_res = [
        LessonAttemptResponse(
            id=att.id,
            lesson_id=att.lesson_id,
            lesson_title=f"{att.lesson.skill.title} - Lesson {att.lesson.order_index}" if att.lesson and att.lesson.skill else f"Lesson #{att.lesson_id}",
            started_at=att.started_at,
            completed_at=att.completed_at,
            correct_count=att.correct_count,
            incorrect_count=att.incorrect_count,
            xp_earned=att.xp_earned,
            hearts_lost=att.hearts_lost,
        )
        for att in attempts
    ]

    sim_date = get_simulated_date_str(db)
    daily_xp = get_daily_xp(db, user.id)

    return UserProfileResponse(
        id=user.id,
        username=user.username,
        display_name=user.display_name,
        avatar_url=user.avatar_url,
        current_streak=user.current_streak,
        longest_streak=user.longest_streak,
        last_activity_date=user.last_activity_date,
        total_xp=user.total_xp,
        hearts_current=user.hearts_current,
        hearts_max=user.hearts_max,
        last_heart_lost_at=user.last_heart_lost_at,
        gems=user.gems,
        daily_goal_xp=user.daily_goal_xp,
        daily_xp=daily_xp,
        achievements=achievements_res,
        recent_attempts=recent_attempts_res,
        simulated_date=sim_date,
    )


@router.post("/me/hearts/refill", response_model=HeartsRefillResponse)
def refill_user_hearts(db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == 1).first()
    if not user:
        raise HTTPException(status_code=404, detail="Default user not found")

    success, message = refill_hearts(db, user)

    return HeartsRefillResponse(
        success=success,
        message=message,
        hearts_current=user.hearts_current,
        gems_remaining=user.gems,
    )
