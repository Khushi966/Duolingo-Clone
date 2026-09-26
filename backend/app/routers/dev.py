from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from app.db.base import get_db
from app.models.models import User, DevSetting
from app.schemas.schemas import DevAdvanceDayRequest, DevAdvanceDayResponse
from app.services.dev_service import (
    advance_simulated_day,
    get_simulated_date_str,
    INITIAL_DEFAULT_DATE,
    SIMULATED_DATE_KEY,
)
from app.services.heart_service import calculate_and_update_hearts

router = APIRouter(prefix="/api/dev", tags=["dev"])


@router.post("/advance-day", response_model=DevAdvanceDayResponse)
def advance_day(
    payload: Optional[DevAdvanceDayRequest] = None,
    db: Session = Depends(get_db),
):
    days = payload.days if payload else 1
    prev_date, new_date = advance_simulated_day(db, days=days)

    user = db.query(User).filter(User.id == 1).first()
    if user:
        user = calculate_and_update_hearts(db, user)
        streak = user.current_streak
        hearts = user.hearts_current
    else:
        streak = 0
        hearts = 5

    return DevAdvanceDayResponse(
        message=f"Simulated day advanced by {days} day(s) from {prev_date} to {new_date}",
        simulated_date=new_date,
        previous_date=prev_date,
        user_current_streak=streak,
        user_hearts_current=hearts,
    )


@router.post("/reset-day")
def reset_day(db: Session = Depends(get_db)):
    setting = db.query(DevSetting).filter(DevSetting.key == SIMULATED_DATE_KEY).first()
    if setting:
        setting.value = INITIAL_DEFAULT_DATE
    else:
        setting = DevSetting(key=SIMULATED_DATE_KEY, value=INITIAL_DEFAULT_DATE)
        db.add(setting)
    db.commit()

    return {
        "message": f"Simulated date reset to {INITIAL_DEFAULT_DATE}",
        "simulated_date": INITIAL_DEFAULT_DATE,
    }
