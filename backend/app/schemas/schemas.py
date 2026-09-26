from typing import List, Optional, Any, Dict
from datetime import datetime
from pydantic import BaseModel, Field


# --- User Schemas ---
class UserBase(BaseModel):
    id: int
    username: str
    display_name: str
    avatar_url: Optional[str] = None
    current_streak: int
    longest_streak: int
    last_activity_date: Optional[str] = None
    total_xp: int
    hearts_current: int
    hearts_max: int
    last_heart_lost_at: Optional[datetime] = None
    gems: int
    daily_goal_xp: int
    daily_xp: int = 0

    class Config:
        from_attributes = True


class AchievementResponse(BaseModel):
    id: int
    title: str
    description: str
    icon: str
    unlocked: bool
    unlocked_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class LessonAttemptResponse(BaseModel):
    id: int
    lesson_id: int
    lesson_title: Optional[str] = None
    started_at: datetime
    completed_at: Optional[datetime] = None
    correct_count: int
    incorrect_count: int
    xp_earned: int
    hearts_lost: int

    class Config:
        from_attributes = True


class UserProfileResponse(UserBase):
    achievements: List[AchievementResponse] = []
    recent_attempts: List[LessonAttemptResponse] = []
    simulated_date: str


class HeartsRefillResponse(BaseModel):
    success: bool
    message: str
    hearts_current: int
    gems_remaining: int


# --- Path / Course Schemas ---
class SkillProgressResponse(BaseModel):
    status: str  # locked, available, completed
    crown_level: int
    times_completed: int
    last_practiced_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class SkillInPath(BaseModel):
    id: int
    unit_id: int
    title: str
    icon: str
    order_index: int
    total_lessons: int
    completed_lessons: int
    current_lesson_id: Optional[int] = None
    progress: SkillProgressResponse

    class Config:
        from_attributes = True


class UnitInPath(BaseModel):
    id: int
    course_id: int
    title: str
    order_index: int
    theme_color: str
    is_locked: bool
    skills: List[SkillInPath]

    class Config:
        from_attributes = True


class PathResponse(BaseModel):
    course_id: int
    course_title: str
    language_code: str
    units: List[UnitInPath]
    user: UserBase


# --- Lesson & Exercise Schemas ---
class ExerciseOption(BaseModel):
    id: str
    text: str
    image_url: Optional[str] = None


class ExerciseResponse(BaseModel):
    id: int
    lesson_id: int
    order_index: int
    exercise_type: str  # multiple_choice, translate_word_bank, match_pairs, fill_blank, type_answer
    prompt: str
    correct_answer: Optional[Any] = None
    options: Optional[Any] = None
    metadata: Optional[Any] = Field(default=None, alias="meta_info")

    class Config:
        from_attributes = True
        populate_by_name = True


class LessonDetailResponse(BaseModel):
    id: int
    skill_id: int
    skill_title: str
    unit_title: str
    order_index: int
    lesson_type: str
    exercises: List[ExerciseResponse]
    user_hearts: int

    class Config:
        from_attributes = True


class ExerciseSubmissionItem(BaseModel):
    exercise_id: int
    user_answer: Any  # string, array of tokens, dictionary of pairs, or selected option id/string


class LessonSubmissionRequest(BaseModel):
    answers: Optional[List[ExerciseSubmissionItem]] = None
    # In case user sends raw list or answers wrapper


class ExerciseGradingResult(BaseModel):
    exercise_id: int
    is_correct: bool
    user_answer: Any
    correct_answer: Any
    explanation: Optional[str] = None


class LessonSubmissionResponse(BaseModel):
    passed: bool
    xp_earned: int
    hearts_remaining: int
    hearts_lost: int
    correct_count: int
    incorrect_count: int
    crown_level_after: int
    streak_after: int
    streak_increased: bool
    gems_earned: int
    results: List[ExerciseGradingResult]
    newly_unlocked_achievements: List[AchievementResponse] = []


# --- Leaderboard Schemas ---
class LeaderboardUserItem(BaseModel):
    rank: int
    user_id: int
    username: str
    display_name: str
    avatar_url: Optional[str] = None
    xp_this_week: int
    is_current_user: bool


class LeaderboardResponse(BaseModel):
    league_name: str
    week_start: str
    users: List[LeaderboardUserItem]
    current_user_rank: Optional[int] = None


# --- Dev Schemas ---
class DevAdvanceDayRequest(BaseModel):
    days: int = 1


class DevAdvanceDayResponse(BaseModel):
    message: str
    simulated_date: str
    previous_date: str
    user_current_streak: int
    user_hearts_current: int
