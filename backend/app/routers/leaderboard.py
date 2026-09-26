from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.base import get_db
from app.models.models import User, LeagueMembership
from app.schemas.schemas import LeaderboardResponse, LeaderboardUserItem
from app.services.dev_service import get_current_week_start

router = APIRouter(prefix="/api/leaderboard", tags=["leaderboard"])


@router.get("", response_model=LeaderboardResponse)
def get_leaderboard(db: Session = Depends(get_db)):
    week_start = get_current_week_start(db)

    # Ensure user 1 exists in league_memberships for current week
    user_1 = db.query(User).filter(User.id == 1).first()
    if user_1:
        entry = (
            db.query(LeagueMembership)
            .filter(
                LeagueMembership.user_id == user_1.id,
                LeagueMembership.week_start == week_start,
            )
            .first()
        )
        if not entry:
            entry = LeagueMembership(
                user_id=user_1.id,
                week_start=week_start,
                xp_this_week=180,
            )
            db.add(entry)
            db.commit()

    # Query all memberships for this week joined with User
    memberships = (
        db.query(LeagueMembership, User)
        .join(User, LeagueMembership.user_id == User.id)
        .filter(LeagueMembership.week_start == week_start)
        .order_by(LeagueMembership.xp_this_week.desc())
        .all()
    )

    users_list: list[LeaderboardUserItem] = []
    current_user_rank = None

    for index, (mem, usr) in enumerate(memberships):
        rank = index + 1
        is_me = (usr.id == 1)
        if is_me:
            current_user_rank = rank

        users_list.append(
            LeaderboardUserItem(
                rank=rank,
                user_id=usr.id,
                username=usr.username,
                display_name=usr.display_name,
                avatar_url=usr.avatar_url,
                xp_this_week=mem.xp_this_week,
                is_current_user=is_me,
            )
        )

    return LeaderboardResponse(
        league_name="Emerald League",
        week_start=week_start,
        users=users_list,
        current_user_rank=current_user_rank,
    )
