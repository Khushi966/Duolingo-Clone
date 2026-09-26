from datetime import datetime, timezone
from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime,
    ForeignKey,
    JSON,
    PrimaryKeyConstraint,
)
from sqlalchemy.orm import relationship
from app.db.base import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    display_name = Column(String(100), nullable=False)
    avatar_url = Column(String(255), nullable=True)
    current_streak = Column(Integer, default=0, nullable=False)
    longest_streak = Column(Integer, default=0, nullable=False)
    last_activity_date = Column(String(10), nullable=True)  # YYYY-MM-DD
    total_xp = Column(Integer, default=0, nullable=False)
    hearts_current = Column(Integer, default=5, nullable=False)
    hearts_max = Column(Integer, default=5, nullable=False)
    last_heart_lost_at = Column(DateTime, nullable=True)
    gems = Column(Integer, default=100, nullable=False)
    daily_goal_xp = Column(Integer, default=50, nullable=False)

    # Relationships
    skill_progress = relationship("SkillProgress", back_populates="user", cascade="all, delete-orphan")
    lesson_attempts = relationship("LessonAttempt", back_populates="user", cascade="all, delete-orphan")
    user_achievements = relationship("UserAchievement", back_populates="user", cascade="all, delete-orphan")
    league_memberships = relationship("LeagueMembership", back_populates="user", cascade="all, delete-orphan")


class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(100), nullable=False)
    language_code = Column(String(10), nullable=False)
    description = Column(Text, nullable=True)

    # Relationships
    units = relationship("Unit", back_populates="course", cascade="all, delete-orphan", order_by="Unit.order_index")


class Unit(Base):
    __tablename__ = "units"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    title = Column(String(100), nullable=False)
    order_index = Column(Integer, default=1, nullable=False)
    theme_color = Column(String(20), default="#58CC02", nullable=False)

    # Relationships
    course = relationship("Course", back_populates="units")
    skills = relationship("Skill", back_populates="unit", cascade="all, delete-orphan", order_by="Skill.order_index")


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    unit_id = Column(Integer, ForeignKey("units.id"), nullable=False)
    title = Column(String(100), nullable=False)
    icon = Column(String(50), default="sparkles", nullable=False)
    order_index = Column(Integer, default=1, nullable=False)

    # Relationships
    unit = relationship("Unit", back_populates="skills")
    lessons = relationship("Lesson", back_populates="skill", cascade="all, delete-orphan", order_by="Lesson.order_index")
    progress = relationship("SkillProgress", back_populates="skill", cascade="all, delete-orphan")


class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    order_index = Column(Integer, default=1, nullable=False)
    lesson_type = Column(String(20), default="regular", nullable=False)  # regular, practice, legendary

    # Relationships
    skill = relationship("Skill", back_populates="lessons")
    exercises = relationship("Exercise", back_populates="lesson", cascade="all, delete-orphan", order_by="Exercise.order_index")
    attempts = relationship("LessonAttempt", back_populates="lesson", cascade="all, delete-orphan")


class Exercise(Base):
    __tablename__ = "exercises"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False)
    order_index = Column(Integer, default=1, nullable=False)
    exercise_type = Column(String(50), nullable=False)  # multiple_choice, translate_word_bank, match_pairs, fill_blank, type_answer
    prompt = Column(Text, nullable=False)
    correct_answer = Column(JSON, nullable=False)
    options = Column(JSON, nullable=True)
    meta_info = Column("metadata", JSON, nullable=True)

    # Relationships
    lesson = relationship("Lesson", back_populates="exercises")


class SkillProgress(Base):
    __tablename__ = "skill_progress"

    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True, nullable=False)
    skill_id = Column(Integer, ForeignKey("skills.id"), primary_key=True, nullable=False)
    status = Column(String(20), default="locked", nullable=False)  # locked, available, completed
    crown_level = Column(Integer, default=0, nullable=False)  # 0 to 5
    times_completed = Column(Integer, default=0, nullable=False)
    last_practiced_at = Column(DateTime, nullable=True)

    # Relationships
    user = relationship("User", back_populates="skill_progress")
    skill = relationship("Skill", back_populates="progress")


class LessonAttempt(Base):
    __tablename__ = "lesson_attempts"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False)
    started_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    completed_at = Column(DateTime, nullable=True)
    correct_count = Column(Integer, default=0, nullable=False)
    incorrect_count = Column(Integer, default=0, nullable=False)
    xp_earned = Column(Integer, default=0, nullable=False)
    hearts_lost = Column(Integer, default=0, nullable=False)

    # Relationships
    user = relationship("User", back_populates="lesson_attempts")
    lesson = relationship("Lesson", back_populates="attempts")


class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(100), nullable=False)
    description = Column(String(255), nullable=False)
    icon = Column(String(50), default="trophy", nullable=False)

    # Relationships
    user_achievements = relationship("UserAchievement", back_populates="achievement", cascade="all, delete-orphan")


class UserAchievement(Base):
    __tablename__ = "user_achievements"

    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True, nullable=False)
    achievement_id = Column(Integer, ForeignKey("achievements.id"), primary_key=True, nullable=False)
    unlocked_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    user = relationship("User", back_populates="user_achievements")
    achievement = relationship("Achievement", back_populates="user_achievements")


class LeagueMembership(Base):
    __tablename__ = "league_memberships"

    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True, nullable=False)
    week_start = Column(String(10), primary_key=True, nullable=False)  # YYYY-MM-DD (Monday of week)
    xp_this_week = Column(Integer, default=0, nullable=False)

    # Relationships
    user = relationship("User", back_populates="league_memberships")


class DevSetting(Base):
    __tablename__ = "dev_settings"

    key = Column(String(50), primary_key=True)
    value = Column(String(255), nullable=False)
