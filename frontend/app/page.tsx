"use client";

import React, { useEffect, useState } from "react";
import TopBar from "@/components/layout/TopBar";
import PathTree from "@/components/path/PathTree";
import DevToolbar from "@/components/layout/DevToolbar";
import PipMascot from "@/components/mascot/PipMascot";
import ComingSoonModal from "@/components/modals/ComingSoonModal";
import { fetchPath, fetchUserProfile, PathData, UserProfile } from "@/lib/api";
import { Zap, Crown, Flame, ShieldAlert, Sparkles, Trophy, Loader2 } from "lucide-react";

export default function HomePage() {
  const [pathData, setPathData] = useState<PathData | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSuperModal, setShowSuperModal] = useState(false);

  const loadData = async () => {
    try {
      const [path, profile] = await Promise.all([fetchPath(), fetchUserProfile()]);
      setPathData(path);
      setUserProfile(profile);
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError("Unable to connect to Duolingo backend API. Make sure FastAPI server is running on http://127.0.0.1:8000.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh]">
        <PipMascot mood="thinking" size={120} className="animate-bounce" />
        <div className="flex items-center gap-2 mt-4 text-[#58CC02] font-black text-lg">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading your language path...</span>
        </div>
      </div>
    );
  }

  if (error || !pathData) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <PipMascot mood="sad" size={130} />
        <h2 className="text-2xl font-black text-red-500 mt-4 mb-2">Backend Connection Error</h2>
        <p className="text-sm font-bold text-gray-500 max-w-md mb-6">{error}</p>
        <button
          onClick={() => {
            setLoading(true);
            loadData();
          }}
          className="py-3 px-6 duo-button duo-button-green text-sm"
        >
          RETRY CONNECTION
        </button>
      </div>
    );
  }

  const user = userProfile || pathData.user;
  const dailyXp = Math.min(user.daily_xp, user.daily_goal_xp);
  const dailyProgress = Math.min(100, Math.round((dailyXp / user.daily_goal_xp) * 100));

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Top Status Bar */}
      <TopBar user={user} onRefreshUser={loadData} />

      {/* Main Content Layout: Skill Path + Desktop Right Widgets */}
      <div className="max-w-6xl mx-auto w-full px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left / Center Column: Learning Path Tree */}
        <div className="lg:col-span-8 flex flex-col items-center">
          <PathTree units={pathData.units} />
        </div>

        {/* Right Column: Desktop Side Cards & Widgets */}
        <div className="hidden lg:flex lg:col-span-4 flex-col gap-5 sticky top-20">
          {/* Super Duolingo Promotion Card */}
          <div className="p-5 rounded-3xl bg-linear-to-br from-indigo-900 to-purple-950 text-white border-2 border-indigo-700 shadow-xl relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 w-28 h-28 rounded-full bg-white/10 pointer-events-none" />
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-6 h-6 text-yellow-400 fill-yellow-400 animate-pulse" />
              <span className="text-xs font-black uppercase tracking-widest text-yellow-300">
                SUPER DUOLINGO
              </span>
            </div>
            <h3 className="text-xl font-black mb-1">Unlimited Hearts</h3>
            <p className="text-xs text-indigo-200 mb-4 leading-relaxed font-bold">
              Never run out of hearts and speed through exercises with zero interruptions.
            </p>
            <button
              onClick={() => setShowSuperModal(true)}
              className="w-full py-2.5 rounded-xl font-black text-xs uppercase tracking-wider bg-yellow-400 text-indigo-950 hover:bg-yellow-300 active:scale-95 transition-all cursor-pointer shadow-md"
            >
              START 2 WEEKS FREE
            </button>
          </div>

          {/* Daily Quests Widget */}
          <div className="duo-card p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-black uppercase text-gray-800 dark:text-gray-100 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500 fill-yellow-400" />
                Daily XP Quest
              </h3>
              <span className="text-xs font-black text-gray-400">
                {dailyXp} / {user.daily_goal_xp} XP
              </span>
            </div>

            {/* Daily Goal Bar */}
            <div className="w-full h-3.5 bg-gray-200 dark:bg-[#2E383D] rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                style={{ width: `${dailyProgress}%` }}
              />
            </div>
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400">
              Earn {Math.max(0, user.daily_goal_xp - dailyXp)} more XP today to complete your daily challenge!
            </p>
          </div>

          {/* League Mini Standings Widget */}
          <div className="duo-card p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-black uppercase text-gray-800 dark:text-gray-100 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[#FFC800]" />
                Emerald League
              </h3>
              <span className="text-xs font-black text-[#58CC02]">TOP 10</span>
            </div>
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 leading-relaxed mb-3">
              You are competing in the weekly league. Finish in the top 3 to earn the Ruby League promotion!
            </p>
            <a
              href="/leaderboard"
              className="text-xs font-black uppercase tracking-wider text-[#1CB0F6] hover:underline"
            >
              VIEW LEAGUE STANDINGS →
            </a>
          </div>
        </div>
      </div>

      {/* Super Duolingo Modal */}
      <ComingSoonModal
        isOpen={showSuperModal}
        onClose={() => setShowSuperModal(false)}
        title="Super Duolingo Trial"
        description="Unlock unlimited hearts, practice hub, mistake reviews, and legendary mastery badges with Super!"
        tag="Super Duolingo"
      />

      {/* Dev Simulator Tool */}
      <DevToolbar
        currentDate={userProfile?.simulated_date || "2026-09-25"}
        onRefresh={loadData}
      />
    </div>
  );
}
