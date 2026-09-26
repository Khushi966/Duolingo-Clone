"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import TopBar from "@/components/layout/TopBar";
import DevToolbar from "@/components/layout/DevToolbar";
import PipMascot from "@/components/mascot/PipMascot";
import { fetchLeaderboard, fetchUserProfile, LeaderboardData, UserProfile } from "@/lib/api";
import { Trophy, Medal, Flame, Zap, Shield, ChevronUp, Loader2 } from "lucide-react";

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardData | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [lb, profile] = await Promise.all([fetchLeaderboard(), fetchUserProfile()]);
      setLeaderboard(lb);
      setUserProfile(profile);
    } catch (e) {
      console.error(e);
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
        <div className="flex items-center gap-2 mt-4 text-[#FFC800] font-black text-lg">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading League Standings...</span>
        </div>
      </div>
    );
  }

  const users = leaderboard?.users || [];
  const top3 = users.slice(0, 3);
  const remaining = users.slice(3);

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <TopBar user={userProfile} onRefreshUser={loadData} />

      <div className="max-w-5xl mx-auto w-full px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Leaderboard Column */}
        <div className="lg:col-span-8 flex flex-col items-center">
          {/* League Tier Header */}
          <div className="w-full p-6 mb-8 rounded-3xl bg-linear-to-r from-emerald-600 via-green-600 to-teal-700 text-white shadow-xl relative overflow-hidden flex items-center justify-between">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                <span className="text-xs font-black uppercase tracking-widest text-emerald-100">
                  CURRENT LEAGUE TIER
                </span>
              </div>
              <h2 className="text-3xl font-black tracking-tight">{leaderboard?.league_name || "Emerald League"}</h2>
              <p className="text-xs font-bold text-emerald-100/90 mt-1">
                Week Start: <span className="font-mono bg-black/20 px-2 py-0.5 rounded">{leaderboard?.week_start}</span> • Top 3 advance to Ruby League!
              </p>
            </div>

            <div className="relative z-10 hidden sm:block">
              <PipMascot mood="cheering" size={100} />
            </div>
          </div>

          {/* Top 3 Podium */}
          {top3.length >= 3 && (
            <div className="w-full grid grid-cols-3 gap-3 sm:gap-4 mb-8 items-end">
              {/* Rank 2 (Silver) */}
              <div className="duo-card p-4 flex flex-col items-center text-center bg-gray-50 dark:bg-[#1B272D] border-gray-300 order-1">
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-black text-gray-700 dark:text-gray-200 text-sm mb-2 shadow-xs">
                  2
                </div>
                <img
                  src={top3[1].avatar_url || "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100"}
                  alt={top3[1].display_name}
                  className="w-14 h-14 rounded-full border-3 border-gray-400 object-cover mb-2"
                />
                <h4 className="font-black text-sm text-gray-800 dark:text-gray-100 truncate w-full">
                  {top3[1].display_name}
                </h4>
                <div className="flex items-center gap-1 text-xs font-extrabold text-gray-500 mt-1">
                  <Zap className="w-3.5 h-3.5 fill-yellow-400 text-yellow-500" />
                  <span>{top3[1].xp_this_week} XP</span>
                </div>
              </div>

              {/* Rank 1 (Gold - Elevated) */}
              <div className="duo-card p-5 flex flex-col items-center text-center bg-yellow-50/70 dark:bg-yellow-950/30 border-yellow-400 -translate-y-4 shadow-lg order-2">
                <div className="w-9 h-9 rounded-full bg-yellow-400 flex items-center justify-center font-black text-amber-950 text-base mb-2 shadow-sm">
                  👑
                </div>
                <img
                  src={top3[0].avatar_url || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100"}
                  alt={top3[0].display_name}
                  className="w-16 h-16 rounded-full border-4 border-yellow-400 object-cover mb-2 shadow-md"
                />
                <h4 className="font-black text-base text-gray-900 dark:text-gray-100 truncate w-full">
                  {top3[0].display_name}
                </h4>
                <div className="flex items-center gap-1 text-sm font-black text-yellow-600 dark:text-yellow-400 mt-1">
                  <Zap className="w-4 h-4 fill-yellow-400 text-yellow-500" />
                  <span>{top3[0].xp_this_week} XP</span>
                </div>
              </div>

              {/* Rank 3 (Bronze) */}
              <div className="duo-card p-4 flex flex-col items-center text-center bg-amber-50/50 dark:bg-[#1B272D] border-amber-600/40 order-3">
                <div className="w-8 h-8 rounded-full bg-amber-200 dark:bg-amber-900 flex items-center justify-center font-black text-amber-900 dark:text-amber-200 text-sm mb-2 shadow-xs">
                  3
                </div>
                <img
                  src={top3[2].avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"}
                  alt={top3[2].display_name}
                  className="w-14 h-14 rounded-full border-3 border-amber-600 object-cover mb-2"
                />
                <h4 className="font-black text-sm text-gray-800 dark:text-gray-100 truncate w-full">
                  {top3[2].display_name} {top3[2].is_current_user && "(You)"}
                </h4>
                <div className="flex items-center gap-1 text-xs font-extrabold text-amber-600 dark:text-amber-400 mt-1">
                  <Zap className="w-3.5 h-3.5 fill-yellow-400 text-yellow-500" />
                  <span>{top3[2].xp_this_week} XP</span>
                </div>
              </div>
            </div>
          )}

          {/* Promotion Zone Separator */}
          <div className="w-full flex items-center gap-3 my-4">
            <div className="h-0.5 flex-1 bg-green-500/40" />
            <div className="flex items-center gap-1 text-xs font-black uppercase tracking-wider text-[#58CC02] bg-green-50 dark:bg-green-950/60 px-3 py-1 rounded-full border border-green-200 dark:border-green-900">
              <ChevronUp className="w-4 h-4 stroke-[3]" />
              <span>PROMOTION ZONE (TOP 3)</span>
            </div>
            <div className="h-0.5 flex-1 bg-green-500/40" />
          </div>

          {/* Leaderboard Table List */}
          <div className="w-full space-y-2.5">
            {users.map((u) => {
              const isCurrentUser = u.is_current_user;

              return (
                <div
                  key={u.user_id}
                  className={`p-3.5 sm:p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${
                    isCurrentUser
                      ? "bg-green-50 dark:bg-green-950/50 border-[#58CC02] shadow-md border-b-4 scale-[1.01]"
                      : "bg-white dark:bg-[#1B272D] border-gray-200 dark:border-[#2E383D] border-b-4 hover:bg-gray-50 dark:hover:bg-[#202C33]"
                  }`}
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    {/* Rank Number */}
                    <span
                      className={`w-7 text-center font-black text-base ${
                        u.rank === 1
                          ? "text-yellow-500"
                          : u.rank === 2
                          ? "text-gray-400"
                          : u.rank === 3
                          ? "text-amber-600"
                          : "text-gray-500"
                      }`}
                    >
                      {u.rank}
                    </span>

                    {/* Avatar */}
                    <img
                      src={u.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"}
                      alt={u.display_name}
                      className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border-2 ${
                        isCurrentUser ? "border-[#58CC02]" : "border-gray-300 dark:border-gray-600"
                      }`}
                    />

                    {/* Display Name */}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm sm:text-base text-gray-800 dark:text-gray-100">
                          {u.display_name}
                        </span>
                        {isCurrentUser && (
                          <span className="text-[10px] font-black uppercase bg-[#58CC02] text-white px-2 py-0.5 rounded-full">
                            YOU
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-bold text-gray-400">@{u.username}</span>
                    </div>
                  </div>

                  {/* XP */}
                  <div className="flex items-center gap-1.5 font-black text-sm sm:text-base text-gray-700 dark:text-gray-200">
                    <Zap className="w-4 h-4 fill-yellow-400 text-yellow-500" />
                    <span>{u.xp_this_week} XP</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Info Widgets */}
        <div className="hidden lg:flex lg:col-span-4 flex-col gap-5 sticky top-20">
          <div className="duo-card p-5">
            <h3 className="text-base font-black uppercase text-gray-800 dark:text-gray-100 flex items-center gap-2 mb-3">
              <Trophy className="w-5 h-5 text-[#FFC800]" />
              How Leagues Work
            </h3>
            <div className="space-y-3 text-xs font-bold text-gray-500 dark:text-gray-400 leading-relaxed">
              <p>• Complete lessons to gain XP and climb the Emerald League ranks.</p>
              <p>• Top 3 learners at the end of the week get promoted to the prestigious Ruby League!</p>
              <p>• Bottom 3 learners risk relegation to the Sapphire tier.</p>
            </div>
          </div>

          <div className="duo-card p-5 bg-orange-50/50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900/40 flex items-center gap-3">
            <PipMascot mood="cheering" size={60} />
            <div>
              <p className="text-xs font-black text-orange-600 dark:text-orange-400">
                XP Boost Tip:
              </p>
              <p className="text-[11px] text-gray-600 dark:text-gray-300 font-bold">
                Complete lessons with zero mistakes to earn a +5 bonus XP combo!
              </p>
            </div>
          </div>
        </div>
      </div>

      <DevToolbar
        currentDate={userProfile?.simulated_date || "2026-09-25"}
        onRefresh={loadData}
      />
    </div>
  );
}
