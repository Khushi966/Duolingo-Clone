from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.base import get_db
from app.models.models import User, Course, Unit, Skill, SkillProgress, Lesson
from app.schemas.schemas import PathResponse, UnitInPath, SkillInPath, SkillProgressResponse, UserBase
from app.services.heart_service import calculate_and_update_hearts
from app.services.xp_service import get_daily_xp

router = APIRouter(prefix="/api/path", tags=["path"])


@router.get("", response_model=PathResponse)
def get_learning_path(db: Session = Depends(get_db)):
    # Default learner
    user = db.query(User).filter(User.id == 1).first()
    if not user:
        raise HTTPException(status_code=404, detail="Default user not found. Please run seed script.")

    # Lazy heart regen
    user = calculate_and_update_hearts(db, user)

    # Fetch default Course (Spanish)
    course = db.query(Course).first()
    if not course:
        raise HTTPException(status_code=404, detail="No courses found. Please seed the database.")

    # Fetch user's skill progress map
    progress_records = db.query(SkillProgress).filter(SkillProgress.user_id == user.id).all()
    progress_map = {p.skill_id: p for p in progress_records}

    units_data: list[UnitInPath] = []
    unit_1_completed = True

    # First pass to check unit 1 completion for unlocking unit 2
    for u in course.units:
        skills_in_unit: list[SkillInPath] = []
        unit_all_skills_done = True

        for s in u.skills:
            prog = progress_map.get(s.id)
            total_lessons = len(s.lessons)
            
            if prog:
                status = prog.status
                crown_level = prog.crown_level
                times_completed = prog.times_completed
                last_practiced_at = prog.last_practiced_at
            else:
                status = "locked"
                crown_level = 0
                times_completed = 0
                last_practiced_at = None

            if crown_level == 0 and status != "completed":
                unit_all_skills_done = False

            # Active lesson calculation
            current_lesson_id = None
            if s.lessons:
                # Pick lesson based on times_completed % total_lessons
                lesson_idx = times_completed % max(1, total_lessons)
                current_lesson_id = s.lessons[lesson_idx].id if lesson_idx < len(s.lessons) else s.lessons[0].id

            skills_in_unit.append(
                SkillInPath(
                    id=s.id,
                    unit_id=s.unit_id,
                    title=s.title,
                    icon=s.icon,
                    order_index=s.order_index,
                    total_lessons=total_lessons,
                    completed_lessons=times_completed,
                    current_lesson_id=current_lesson_id,
                    progress=SkillProgressResponse(
                        status=status,
                        crown_level=crown_level,
                        times_completed=times_completed,
                        last_practiced_at=last_practiced_at,
                    ),
                )
            )

        is_unit_locked = False
        if u.order_index > 1 and not unit_1_completed:
            is_unit_locked = True

        if u.order_index == 1:
            unit_1_completed = unit_all_skills_done

        units_data.append(
            UnitInPath(
                id=u.id,
                course_id=u.course_id,
                title=u.title,
                order_index=u.order_index,
                theme_color=u.theme_color,
                is_locked=is_unit_locked,
                skills=skills_in_unit,
            )
        )

    user_response = UserBase.model_validate(user).model_copy(
        update={"daily_xp": get_daily_xp(db, user.id)}
    )

    return PathResponse(
        course_id=course.id,
        course_title=course.title,
        language_code=course.language_code,
        units=units_data,
        user=user_response,
    )
