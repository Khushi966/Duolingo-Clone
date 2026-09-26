"use client";

import React, { useState, useEffect } from "react";
import TopBar from "@/components/layout/TopBar";
import DevToolbar from "@/components/layout/DevToolbar";
import PipMascot from "@/components/mascot/PipMascot";
import { fetchUserProfile, UserProfile } from "@/lib/api";
import {
  Flame,
  Zap,
  Gem,
  Heart,
  Trophy,
  CheckCircle,
  Clock,
  Calendar,
  Sparkles,
  Shield,
  Loader2,
} from "lucide-react";

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const data = await fetchUserProfile();
      setProfile(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading || !profile) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh]">
        <PipMascot mood="thinking" size={120} className="animate-bounce" />
        <div className="flex items-center gap-2 mt-4 text-[#1CB0F6] font-black text-lg">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading Learner Profile...</span>
        </div>
      </div>
    );
  }

  const getAchievementIcon = (iconName: string) => {
    switch (iconName) {
      case "flame":
        return <Flame className="w-7 h-7 text-orange-500 fill-orange-500" />;
      case "zap":
        return <Zap className="w-7 h-7 text-yellow-500 fill-yellow-400" />;
      case "heart":
        return <Heart className="w-7 h-7 text-red-500 fill-red-500" />;
      default:
        return <Trophy className="w-7 h-7 text-[#FFC800] fill-[#FFC800]" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <TopBar user={profile} onRefreshUser={loadData} />

      <div className="max-w-4xl mx-auto w-full px-4 py-8 flex flex-col gap-8">
        {/* Profile Identity Hero */}
        <div className="duo-card p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 relative overflow-hidden">
          <div className="relative">
            <img
              src={profile.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200"}
              alt={profile.display_name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-[#58CC02] object-cover shadow-md"
            />
            <div className="absolute -bottom-1 -right-1 bg-[#58CC02] p-1.5 rounded-full border-2 border-white dark:border-[#1B272D]">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-800 dark:text-gray-100">
              {profile.display_name}
            </h2>
            <p className="text-sm font-bold text-gray-400 mb-4">@{profile.username}</p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-bold text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>Simulated Day: <strong className="text-indigo-600 dark:text-indigo-400 font-mono">{profile.simulated_date}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-gray-400" />
                <span>Last Active: {profile.last_activity_date || "Today"}</span>
              </div>
            </div>
          </div>

          <div className="hidden md:block">
            <PipMascot mood="happy" size={90} />
          </div>
        </div>

        {/* Statistics 4-Card Grid */}
        <div>
          <h3 className="text-xl font-black text-gray-800 dark:text-gray-100 mb-4 uppercase tracking-wide">
            Statistics
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Streak */}
            <div className="duo-card p-4 flex flex-col items-start">
              <div className="flex items-center gap-2 text-orange-500 mb-1">
                <Flame className="w-6 h-6 fill-orange-500" />
                <span className="text-2xl font-black">{profile.current_streak}</span>
              </div>
              <span className="text-xs font-bold text-gray-400">Day Streak</span>
              <span className="text-[10px] font-bold text-gray-400 mt-1">Best: {profile.longest_streak} days</span>
            </div>

            {/* Total XP */}
            <div className="duo-card p-4 flex flex-col items-start">
              <div className="flex items-center gap-2 text-yellow-500 mb-1">
                <Zap className="w-6 h-6 fill-yellow-400" />
                <span className="text-2xl font-black">{profile.total_xp}</span>
              </div>
              <span className="text-xs font-bold text-gray-400">Total XP</span>
              <span className="text-[10px] font-bold text-gray-400 mt-1">Goal: {profile.daily_goal_xp} XP/day</span>
            </div>

            {/* League */}
            <div className="duo-card p-4 flex flex-col items-start">
              <div className="flex items-center gap-2 text-emerald-500 mb-1">
                <Shield className="w-6 h-6 fill-emerald-500" />
                <span className="text-lg font-black truncate">Emerald</span>
              </div>
              <span className="text-xs font-bold text-gray-400">Current League</span>
              <span className="text-[10px] font-bold text-emerald-500 mt-1">Division 1</span>
            </div>

            {/* Gems */}
            <div className="duo-card p-4 flex flex-col items-start">
              <div className="flex items-center gap-2 text-[#1CB0F6] mb-1">
                <Gem className="w-6 h-6 fill-blue-400" />
                <span className="text-2xl font-black">{profile.gems}</span>
              </div>
              <span className="text-xs font-bold text-gray-400">Gems Chest</span>
              <span className="text-[10px] font-bold text-blue-400 mt-1">Hearts: {profile.hearts_current}/{profile.hearts_max}</span>
            </div>
          </div>
        </div>

        {/* Achievements Gallery */}
        <div>
          <h3 className="text-xl font-black text-gray-800 dark:text-gray-100 mb-4 uppercase tracking-wide">
            Achievements ({profile.achievements.filter((a) => a.unlocked).length} / {profile.achievements.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {profile.achievements.map((ach) => (
              <div
                key={ach.id}
                className={`p-4 rounded-2xl border-2 flex flex-col justify-between transition-all ${
                  ach.unlocked
                    ? "bg-white dark:bg-[#1B272D] border-[#FFC800] border-b-4 shadow-sm"
                    : "bg-gray-50 dark:bg-[#162025] border-gray-200 dark:border-gray-800 opacity-60"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`p-2.5 rounded-2xl ${
                        ach.unlocked ? "bg-amber-100 dark:bg-amber-950/60" : "bg-gray-200 dark:bg-gray-800"
                      }`}
                    >
                      {getAchievementIcon(ach.icon)}
                    </div>
                    {ach.unlocked ? (
                      <span className="text-[10px] font-black uppercase tracking-wider bg-yellow-400 text-amber-950 px-2 py-0.5 rounded-full">
                        UNLOCKED
                      </span>
                    ) : (
                      <span className="text-[10px] font-black uppercase tracking-wider bg-gray-200 dark:bg-gray-700 text-gray-500 px-2 py-0.5 rounded-full">
                        LOCKED
                      </span>
                    )}
                  </div>
                  <h4 className="font-black text-base text-gray-800 dark:text-gray-100 mb-1">
                    {ach.title}
                  </h4>
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 leading-relaxed">
                    {ach.description}
                  </p>
                </div>

                {ach.unlocked_at && (
                  <div className="mt-4 pt-2 border-t border-gray-100 dark:border-gray-800 text-[10px] font-bold text-gray-400">
                    Unlocked: {new Date(ach.unlocked_at).toLocaleDateString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Lesson History Attempts */}
        <div>
          <h3 className="text-xl font-black text-gray-800 dark:text-gray-100 mb-4 uppercase tracking-wide">
            Recent Practice History
          </h3>
          <div className="duo-card overflow-hidden">
            {profile.recent_attempts && profile.recent_attempts.length > 0 ? (
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {profile.recent_attempts.map((att) => (
                  <div
                    key={att.id}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50 dark:hover:bg-[#202C33] transition-colors"
                  >
                    <div>
                      <h5 className="font-black text-sm text-gray-800 dark:text-gray-100">
                        {att.lesson_title}
                      </h5>
                      <span className="text-xs font-bold text-gray-400">
                        {new Date(att.started_at).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-extrabold">
                      <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                        <CheckCircle className="w-4 h-4" />
                        <span>{att.correct_count} correct</span>
                      </div>
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Zap className="w-4 h-4 fill-yellow-400" />
                        <span>+{att.xp_earned} XP</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-400 font-bold text-sm">
                No recent practice sessions recorded. Start a lesson to build your history!
              </div>
            )}
          </div>
        </div>
      </div>

      <DevToolbar
        currentDate={profile.simulated_date || "2026-09-25"}
        onRefresh={loadData}
      />
    </div>
  );
}
