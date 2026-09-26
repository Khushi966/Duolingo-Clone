// API client for Duolingo Clone backend

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export interface User {
  id: number;
  username: string;
  display_name: string;
  avatar_url?: string;
  current_streak: number;
  longest_streak: number;
  last_activity_date?: string;
  total_xp: number;
  hearts_current: number;
  hearts_max: number;
  last_heart_lost_at?: string;
  gems: number;
  daily_goal_xp: number;
  daily_xp: number;
}

export interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlocked_at?: string;
}

export interface LessonAttempt {
  id: number;
  lesson_id: number;
  lesson_title?: string;
  started_at: string;
  completed_at?: string;
  correct_count: number;
  incorrect_count: number;
  xp_earned: number;
  hearts_lost: number;
}

export interface UserProfile extends User {
  achievements: Achievement[];
  recent_attempts: LessonAttempt[];
  simulated_date: string;
}

export interface SkillProgress {
  status: "locked" | "available" | "completed";
  crown_level: number;
  times_completed: number;
  last_practiced_at?: string;
}

export interface Skill {
  id: number;
  unit_id: number;
  title: string;
  icon: string;
  order_index: number;
  total_lessons: number;
  completed_lessons: number;
  current_lesson_id?: number;
  progress: SkillProgress;
}

export interface Unit {
  id: number;
  course_id: number;
  title: string;
  order_index: number;
  theme_color: string;
  is_locked: boolean;
  skills: Skill[];
}

export interface PathData {
  course_id: number;
  course_title: string;
  language_code: string;
  units: Unit[];
  user: User;
}

export interface ExerciseOption {
  id: string;
  text: string;
  hint?: string;
}

export interface Exercise {
  id: number;
  lesson_id: number;
  order_index: number;
  exercise_type: "multiple_choice" | "translate_word_bank" | "match_pairs" | "fill_blank" | "type_answer";
  prompt: string;
  correct_answer?: any;
  options?: any;
  metadata?: any;
}

export interface LessonDetail {
  id: number;
  skill_id: number;
  skill_title: string;
  unit_title: string;
  order_index: number;
  lesson_type: string;
  exercises: Exercise[];
  user_hearts: number;
}

export interface ExerciseGradingResult {
  exercise_id: number;
  is_correct: boolean;
  user_answer: any;
  correct_answer: any;
  explanation?: string;
}

export interface LessonSubmissionResponse {
  passed: boolean;
  xp_earned: number;
  hearts_remaining: number;
  hearts_lost: number;
  correct_count: number;
  incorrect_count: number;
  crown_level_after: number;
  streak_after: number;
  streak_increased: boolean;
  gems_earned: number;
  results: ExerciseGradingResult[];
  newly_unlocked_achievements: Achievement[];
}

export interface LeaderboardUser {
  rank: number;
  user_id: number;
  username: string;
  display_name: string;
  avatar_url?: string;
  xp_this_week: number;
  is_current_user: boolean;
}

export interface LeaderboardData {
  league_name: string;
  week_start: string;
  users: LeaderboardUser[];
  current_user_rank?: number;
}

export interface DevAdvanceDayResponse {
  message: string;
  simulated_date: string;
  previous_date: string;
  user_current_streak: number;
  user_hearts_current: number;
}

// API Functions
export async function fetchPath(): Promise<PathData> {
  const res = await fetch(`${API_BASE}/api/path`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch path");
  return res.json();
}

export async function fetchLesson(lessonId: number): Promise<LessonDetail> {
  const res = await fetch(`${API_BASE}/api/lessons/${lessonId}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch lesson ${lessonId}`);
  return res.json();
}

export async function submitLesson(
  lessonId: number,
  answers: { exercise_id: number; user_answer: any }[]
): Promise<LessonSubmissionResponse> {
  const res = await fetch(`${API_BASE}/api/lessons/${lessonId}/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answers }),
  });
  if (!res.ok) throw new Error("Failed to submit lesson");
  return res.json();
}

export async function fetchUserProfile(): Promise<UserProfile> {
  const res = await fetch(`${API_BASE}/api/users/me`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch user profile");
  return res.json();
}

export async function refillHearts(): Promise<{ success: boolean; message: string; hearts_current: number; gems_remaining: number }> {
  const res = await fetch(`${API_BASE}/api/users/me/hearts/refill`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to refill hearts");
  return res.json();
}

export async function fetchLeaderboard(): Promise<LeaderboardData> {
  const res = await fetch(`${API_BASE}/api/leaderboard`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch leaderboard");
  return res.json();
}

export async function advanceDevDay(days: number = 1): Promise<DevAdvanceDayResponse> {
  const res = await fetch(`${API_BASE}/api/dev/advance-day`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ days }),
  });
  if (!res.ok) throw new Error("Failed to advance simulated day");
  return res.json();
}

export async function resetDevDay(): Promise<{ message: string; simulated_date: string }> {
  const res = await fetch(`${API_BASE}/api/dev/reset-day`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to reset simulated day");
  return res.json();
}
