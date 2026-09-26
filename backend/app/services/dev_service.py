from datetime import datetime, date, timedelta, timezone
from sqlalchemy.orm import Session
from app.models.models import DevSetting

SIMULATED_DATE_KEY = "simulated_date_override"
INITIAL_DEFAULT_DATE = "2026-09-25"


def get_simulated_date_str(db: Session) -> str:
    setting = db.query(DevSetting).filter(DevSetting.key == SIMULATED_DATE_KEY).first()
    if setting:
        return setting.value
    return INITIAL_DEFAULT_DATE


def get_simulated_date(db: Session) -> date:
    date_str = get_simulated_date_str(db)
    try:
        return datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
        return datetime.strptime(INITIAL_DEFAULT_DATE, "%Y-%m-%d").date()


def get_simulated_datetime(db: Session) -> datetime:
    sim_date = get_simulated_date(db)
    # Default to 12:00:00 PM on simulated date
    return datetime(sim_date.year, sim_date.month, sim_date.day, 12, 0, 0)


def advance_simulated_day(db: Session, days: int = 1) -> tuple[str, str]:
    current_str = get_simulated_date_str(db)
    current_date = get_simulated_date(db)
    new_date = current_date + timedelta(days=days)
    new_date_str = new_date.strftime("%Y-%m-%d")

    setting = db.query(DevSetting).filter(DevSetting.key == SIMULATED_DATE_KEY).first()
    if not setting:
        setting = DevSetting(key=SIMULATED_DATE_KEY, value=new_date_str)
        db.add(setting)
    else:
        setting.value = new_date_str

    db.commit()
    return current_str, new_date_str


def get_current_week_start(db: Session) -> str:
    sim_date = get_simulated_date(db)
    # Find Monday of the current simulated week
    monday = sim_date - timedelta(days=sim_date.weekday())
    return monday.strftime("%Y-%m-%d")
