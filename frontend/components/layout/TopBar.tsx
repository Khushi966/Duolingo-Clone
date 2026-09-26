"use client";

import React, { useState } from "react";
import { Flame, Heart, Gem, Zap, Moon, Sun, Plus, Globe } from "lucide-react";
import { User, refillHearts } from "@/lib/api";
import ComingSoonModal from "../modals/ComingSoonModal";

interface TopBarProps {
  user?: User | null;
  onRefreshUser?: () => void;
}

export default function TopBar({ user, onRefreshUser }: TopBarProps) {
  const [isDark, setIsDark] = useState(false);
  const [isRefilling, setIsRefilling] = useState(false);
  const [showLangModal, setShowLangModal] = useState(false);
  const [showHeartRefillModal, setShowHeartRefillModal] = useState(false);

  const toggleDarkMode = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleHeartRefill = async () => {
    setIsRefilling(true);
    try {
      await refillHearts();
      setShowHeartRefillModal(false);
      if (onRefreshUser) onRefreshUser();
    } catch (e) {
      console.error(e);
    } finally {
      setIsRefilling(false);
    }
  };

  const heartsCurrent = user?.hearts_current ?? 5;
  const heartsMax = user?.hearts_max ?? 5;
  const streak = user?.current_streak ?? 0;
  const gems = user?.gems ?? 100;
  const totalXp = user?.total_xp ?? 0;

  return (
    <>
      <header className="sticky top-0 z-30 w-full bg-white/90 dark:bg-[#131F24]/90 backdrop-blur-md border-b-2 border-gray-200 dark:border-[#2E383D] px-4 py-2.5 transition-colors">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          {/* Active Course / Language Switcher */}
          <button
            onClick={() => setShowLangModal(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer group"
          >
            <div className="w-7 h-5 rounded overflow-hidden shadow-xs border border-gray-300 flex items-center justify-center bg-red-600">
              {/* Spanish Flag representation */}
              <div className="w-full h-full flex flex-col">
                <div className="h-1/4 bg-red-600"></div>
                <div className="h-2/4 bg-yellow-400"></div>
                <div className="h-1/4 bg-red-600"></div>
              </div>
            </div>
            <span className="font-extrabold text-sm text-gray-700 dark:text-gray-200 uppercase tracking-wide group-hover:text-[#58CC02]">
              Spanish
            </span>
          </button>

          {/* User Stats Pill Bar */}
          <div className="flex items-center gap-3 md:gap-6">
            {/* Streak */}
            <div
              className="flex items-center gap-1.5 font-black text-sm text-orange-500 cursor-default"
              title={`Current Streak: ${streak} days (Longest: ${user?.longest_streak ?? streak} days)`}
            >
              <div className="p-1 rounded-lg bg-orange-100 dark:bg-orange-950/60">
                <Flame className="w-5 h-5 fill-orange-500 text-orange-500 animate-pulse" />
              </div>
              <span className="font-extrabold text-base">{streak}</span>
            </div>

            {/* Gems */}
            <div
              className="flex items-center gap-1.5 font-black text-sm text-blue-500 cursor-default"
              title={`Gems: ${gems}`}
            >
              <div className="p-1 rounded-lg bg-blue-100 dark:bg-blue-950/60">
                <Gem className="w-5 h-5 fill-blue-400 text-blue-500" />
              </div>
              <span className="font-extrabold text-base">{gems}</span>
            </div>

            {/* Hearts Counter & Quick Refill */}
            <button
              onClick={() => setShowHeartRefillModal(true)}
              className="flex items-center gap-1.5 font-black text-sm text-red-500 hover:opacity-90 cursor-pointer"
              title="Click to manage hearts"
            >
              <div className="p-1 rounded-lg bg-red-100 dark:bg-red-950/60 relative">
                <Heart className={`w-5 h-5 ${heartsCurrent > 0 ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
                {heartsCurrent < heartsMax && (
                  <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                    <Plus className="w-2.5 h-2.5" />
                  </div>
                )}
              </div>
              <span className="font-extrabold text-base">{heartsCurrent}</span>
            </button>

            {/* Total XP */}
            <div
              className="hidden sm:flex items-center gap-1.5 font-black text-sm text-yellow-500 cursor-default"
              title={`Total XP: ${totalXp}`}
            >
              <div className="p-1 rounded-lg bg-yellow-100 dark:bg-yellow-950/60">
                <Zap className="w-5 h-5 fill-yellow-400 text-yellow-500" />
              </div>
              <span className="font-extrabold text-base">{totalXp}</span>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-yellow-400 hover:scale-105 transition-all cursor-pointer"
              title="Toggle Dark/Light Mode"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Language Switcher Modal */}
      <ComingSoonModal
        isOpen={showLangModal}
        onClose={() => setShowLangModal(false)}
        title="Language Switcher"
        description="French, German, Japanese, and Italian courses are currently in production and arriving soon!"
        tag="More Languages"
      />

      {/* Heart Refill Modal */}
      {showHeartRefillModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-sm p-6 bg-white dark:bg-[#1B272D] rounded-3xl border-2 border-gray-200 dark:border-[#2E383D] shadow-2xl animate-duo-pop text-center">
            <div className="flex justify-center mb-3">
              <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-950/60 flex items-center justify-center">
                <Heart className="w-9 h-9 fill-red-500 text-red-500" />
              </div>
            </div>

            <h3 className="text-xl font-black text-gray-800 dark:text-gray-100 mb-1">
              Hearts: {heartsCurrent} / {heartsMax}
            </h3>

            <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">
              Hearts regenerate automatically over time (+1 every 30 mins) or can be instantly restored!
            </p>

            <div className="space-y-2">
              <button
                onClick={handleHeartRefill}
                disabled={isRefilling || heartsCurrent >= heartsMax}
                className={`w-full py-3 duo-button ${
                  heartsCurrent >= heartsMax ? "duo-button-disabled" : "duo-button-green"
                } text-sm`}
              >
                {heartsCurrent >= heartsMax
                  ? "Hearts are Full"
                  : isRefilling
                  ? "Refilling..."
                  : "Refill Hearts (50 Gems)"}
              </button>

              <button
                onClick={() => setShowHeartRefillModal(false)}
                className="w-full py-2.5 duo-button duo-button-white text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
