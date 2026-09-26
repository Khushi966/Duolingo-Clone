from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models.models import User
from app.services.dev_service import get_simulated_datetime

HEART_REGEN_MINUTES = 30
REFILL_GEM_COST = 50


def calculate_and_update_hearts(db: Session, user: User, current_dt: datetime = None) -> User:
    """
    Computes heart regeneration lazily on read.
    Regenerates +1 heart per 30 minutes from user.last_heart_lost_at, capped at user.hearts_max.
    """
    if current_dt is None:
        current_dt = get_simulated_datetime(db)

    if user.hearts_current >= user.hearts_max:
        if user.last_heart_lost_at is not None:
            user.last_heart_lost_at = None
            db.commit()
        return user

    if user.last_heart_lost_at is None:
        # If user has missing hearts but no timestamp, anchor timestamp to current simulated time
        user.last_heart_lost_at = current_dt
        db.commit()
        return user

    # Compute elapsed minutes
    last_lost = user.last_heart_lost_at.replace(tzinfo=None)
    curr = current_dt.replace(tzinfo=None)

    elapsed_seconds = (curr - last_lost).total_seconds()
    if elapsed_seconds <= 0:
        return user

    elapsed_minutes = elapsed_seconds / 60.0
    hearts_to_add = int(elapsed_minutes // HEART_REGEN_MINUTES)

    if hearts_to_add > 0:
        new_hearts = min(user.hearts_max, user.hearts_current + hearts_to_add)
        user.hearts_current = new_hearts

        if user.hearts_current >= user.hearts_max:
            user.last_heart_lost_at = None
        else:
            # Shift the last lost marker forward by the regenerated heart intervals
            user.last_heart_lost_at = last_lost + timedelta(minutes=hearts_to_add * HEART_REGEN_MINUTES)

        db.commit()

    return user


def deduct_hearts(db: Session, user: User, count: int = 1, current_dt: datetime = None) -> int:
    """
    Deducts hearts when user makes mistakes in a lesson.
    Records last_heart_lost_at if user was previously full.
    """
    if count <= 0:
        return user.hearts_current

    if current_dt is None:
        current_dt = get_simulated_datetime(db)

    if user.hearts_current >= user.hearts_max:
        user.last_heart_lost_at = current_dt

    user.hearts_current = max(0, user.hearts_current - count)
    db.commit()
    return user.hearts_current


def refill_hearts(db: Session, user: User) -> tuple[bool, str]:
    """
    Instantly refills hearts to hearts_max for gems.
    """
    if user.hearts_current >= user.hearts_max:
        return True, "Hearts are already full!"

    cost = REFILL_GEM_COST
    if user.gems >= cost:
        user.gems -= cost
        user.hearts_current = user.hearts_max
        user.last_heart_lost_at = None
        db.commit()
        return True, f"Hearts refilled for {cost} gems!"
    else:
        # If user doesn't have enough gems, mock refill with courtesy bonus
        user.hearts_current = user.hearts_max
        user.last_heart_lost_at = None
        db.commit()
        return True, "Hearts refilled with courtesy boost!"
