from datetime import datetime, timezone
from typing import List, Union
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from app.db.base import get_db
from app.models.models import (
    User,
    Lesson,
    Exercise,
    Skill,
    Unit,
    SkillProgress,
    LessonAttempt,
)
from app.schemas.schemas import (
    LessonDetailResponse,
    ExerciseResponse,
    ExerciseSubmissionItem,
    LessonSubmissionRequest,
    LessonSubmissionResponse,
    ExerciseGradingResult,
    AchievementResponse,
)
from app.services.heart_service import (
    calculate_and_update_hearts,
    deduct_hearts,
)
from app.services.streak_service import update_streak_on_activity
from app.services.xp_service import award_lesson_xp
from app.services.grading_service import grade_exercise
from app.services.dev_service import get_simulated_datetime

router = APIRouter(prefix="/api/lessons", tags=["lessons"])


@router.get("/{lesson_id}", response_model=LessonDetailResponse)
def get_lesson(lesson_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == 1).first()
    if not user:
        raise HTTPException(status_code=404, detail="Default user not found")

    user = calculate_and_update_hearts(db, user)

    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail=f"Lesson {lesson_id} not found")

    skill = lesson.skill
    unit_title = skill.unit.title if skill and skill.unit else "General"
    skill_title = skill.title if skill else "Practice"

    exercise_responses = [
        ExerciseResponse(
            id=ex.id,
            lesson_id=ex.lesson_id,
            order_index=ex.order_index,
            exercise_type=ex.exercise_type,
            prompt=ex.prompt,
            correct_answer=ex.correct_answer,
            options=ex.options,
            meta_info=ex.meta_info,
        )
        for ex in lesson.exercises
    ]

    return LessonDetailResponse(
        id=lesson.id,
        skill_id=lesson.skill_id,
        skill_title=skill_title,
        unit_title=unit_title,
        order_index=lesson.order_index,
        lesson_type=lesson.lesson_type,
        exercises=exercise_responses,
        user_hearts=user.hearts_current,
    )


@router.post("/{lesson_id}/submit", response_model=LessonSubmissionResponse)
def submit_lesson(
    lesson_id: int,
    payload: Union[LessonSubmissionRequest, List[ExerciseSubmissionItem]] = Body(...),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.id == 1).first()
    if not user:
        raise HTTPException(status_code=404, detail="Default user not found")

    user = calculate_and_update_hearts(db, user)

    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail=f"Lesson {lesson_id} not found")

    # Extract answers array whether wrapped in { answers: [...] } or list directly
    if isinstance(payload, LessonSubmissionRequest):
        answers = payload.answers or []
    elif isinstance(payload, list):
        answers = payload
    else:
        answers = []

    answer_map = {item.exercise_id: item.user_answer for item in answers}

    exercises = (
        db.query(Exercise)
        .filter(Exercise.lesson_id == lesson_id)
        .order_by(Exercise.order_index)
        .all()
    )

    results: List[ExerciseGradingResult] = []
    correct_count = 0
    incorrect_count = 0

    for ex in exercises:
        user_ans = answer_map.get(ex.id)
        is_correct, feedback_note = grade_exercise(
            ex.exercise_type, ex.correct_answer, user_ans
        )

        if is_correct:
            correct_count += 1
        else:
            incorrect_count += 1

        results.append(
            ExerciseGradingResult(
                exercise_id=ex.id,
                is_correct=is_correct,
                user_answer=user_ans,
                correct_answer=ex.correct_answer,
                explanation=feedback_note,
            )
        )

    # Deduct hearts for mistakes
    initial_hearts = user.hearts_current
    hearts_lost = min(initial_hearts, incorrect_count)
    if incorrect_count > 0:
        deduct_hearts(db, user, count=incorrect_count)

    hearts_remaining = user.hearts_current
    passed = hearts_remaining > 0

    xp_earned = 0
    streak_after = user.current_streak
    streak_increased = False
    gems_earned = 0
    newly_unlocked_achievements: List[AchievementResponse] = []
    crown_level_after = 0

    # Fetch current skill progress
    skill_prog = (
        db.query(SkillProgress)
        .filter(
            SkillProgress.user_id == user.id,
            SkillProgress.skill_id == lesson.skill_id,
        )
        .first()
    )

    if not skill_prog:
        skill_prog = SkillProgress(
            user_id=user.id,
            skill_id=lesson.skill_id,
            status="available",
            crown_level=0,
            times_completed=0,
        )
        db.add(skill_prog)
        db.commit()

    if passed:
        # 1. XP and league progression + achievements
        xp_earned, newly_unlocked_achievements = award_lesson_xp(
            db, user, correct_count, incorrect_count, hearts_lost
        )

        # 2. Streak update
        streak_after, streak_increased = update_streak_on_activity(db, user)

        # 3. Gems reward (+10 gems per passed lesson, +5 bonus for 0 mistakes)
        gems_earned = 10 + (5 if incorrect_count == 0 else 0)
        user.gems += gems_earned

        # 4. Skill progress update
        skill_prog.times_completed += 1
        # Crown level goes up (capped at 5)
        new_crown = min(5, (skill_prog.times_completed // 2) + 1)
        skill_prog.crown_level = max(skill_prog.crown_level, new_crown)
        skill_prog.status = "completed" if skill_prog.crown_level >= 1 else "available"
        skill_prog.last_practiced_at = datetime.now(timezone.utc)

        # 5. Unlock subsequent skill in the same unit if available
        curr_skill = lesson.skill
        if curr_skill:
            next_skill = (
                db.query(Skill)
                .filter(
                    Skill.unit_id == curr_skill.unit_id,
                    Skill.order_index == curr_skill.order_index + 1,
                )
                .first()
            )
            if next_skill:
                next_prog = (
                    db.query(SkillProgress)
                    .filter(
                        SkillProgress.user_id == user.id,
                        SkillProgress.skill_id == next_skill.id,
                    )
                    .first()
                )
                if not next_prog:
                    next_prog = SkillProgress(
                        user_id=user.id,
                        skill_id=next_skill.id,
                        status="available",
                        crown_level=0,
                        times_completed=0,
                    )
                    db.add(next_prog)
                elif next_prog.status == "locked":
                    next_prog.status = "available"

            # Check if all skills in unit 1 are complete to unlock unit 2
            unit = curr_skill.unit
            if unit:
                all_skills = unit.skills
                all_done = all(
                    db.query(SkillProgress)
                    .filter(
                        SkillProgress.user_id == user.id,
                        SkillProgress.skill_id == s.id,
                        SkillProgress.crown_level >= 1,
                    )
                    .first()
                    is not None
                    for s in all_skills
                )
                if all_done:
                    # Unlock first skill of next unit
                    next_unit = (
                        db.query(Unit)
                        .filter(
                            Unit.course_id == unit.course_id,
                            Unit.order_index == unit.order_index + 1,
                        )
                        .first()
                    )
                    if next_unit and next_unit.skills:
                        first_skill_next_unit = next_unit.skills[0]
                        nu_prog = (
                            db.query(SkillProgress)
                            .filter(
                                SkillProgress.user_id == user.id,
                                SkillProgress.skill_id == first_skill_next_unit.id,
                            )
                            .first()
                        )
                        if not nu_prog:
                            nu_prog = SkillProgress(
                                user_id=user.id,
                                skill_id=first_skill_next_unit.id,
                                status="available",
                                crown_level=0,
                                times_completed=0,
                            )
                            db.add(nu_prog)
                        elif nu_prog.status == "locked":
                            nu_prog.status = "available"

    crown_level_after = skill_prog.crown_level

    # Record Attempt
    simulated_now = get_simulated_datetime(db)
    attempt = LessonAttempt(
        user_id=user.id,
        lesson_id=lesson.id,
        started_at=simulated_now,
        completed_at=simulated_now if passed else None,
        correct_count=correct_count,
        incorrect_count=incorrect_count,
        xp_earned=xp_earned,
        hearts_lost=hearts_lost,
    )
    db.add(attempt)
    db.commit()

    return LessonSubmissionResponse(
        passed=passed,
        xp_earned=xp_earned,
        hearts_remaining=hearts_remaining,
        hearts_lost=hearts_lost,
        correct_count=correct_count,
        incorrect_count=incorrect_count,
        crown_level_after=crown_level_after,
        streak_after=streak_after,
        streak_increased=streak_increased,
        gems_earned=gems_earned,
        results=results,
        newly_unlocked_achievements=newly_unlocked_achievements,
    )
