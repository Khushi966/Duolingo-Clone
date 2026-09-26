"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { Zap, Flame, Gem, Crown, Trophy, Sparkles, CheckCircle2 } from "lucide-react";
import { LessonSubmissionResponse } from "@/lib/api";
import PipMascot from "../mascot/PipMascot";
import { sounds } from "@/lib/sound";

interface LessonCompleteModalProps {
  result: LessonSubmissionResponse;
}

export default function LessonCompleteModal({ result }: LessonCompleteModalProps) {
  useEffect(() => {
    // Play fanfare and trigger confetti shower
    sounds.playVictory();

    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#58CC02", "#1CB0F6", "#FFC800", "#FF4B4B", "#CE82FF"],
      });
    } catch (e) {
      // Confetti fallback
    }
  }, []);

  const totalQuestions = result.correct_count + result.incorrect_count;
  const accuracy = totalQuestions > 0 ? Math.round((result.correct_count / totalQuestions) * 100) : 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-lg p-6 sm:p-8 bg-white dark:bg-[#1B272D] rounded-3xl border-2 border-gray-200 dark:border-[#2E383D] shadow-2xl animate-duo-pop text-center flex flex-col items-center">
        {/* Celebrating Mascot */}
        <div className="mb-2">
          <PipMascot mood="celebrating" size={130} />
        </div>

        {/* Title */}
        <h2 className="text-3xl sm:text-4xl font-black text-[#58CC02] tracking-tight uppercase mb-1">
          Lesson Completed!
        </h2>
        <p className="text-sm font-bold text-gray-500 dark:text-gray-300 mb-6">
          Fantastic dedication! You are mastering Spanish.
        </p>

        {/* Stats Grid */}
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          {/* XP Earned */}
          <div className="p-3.5 rounded-2xl bg-yellow-50 dark:bg-yellow-950/40 border-2 border-yellow-200 dark:border-yellow-900/60 flex flex-col items-center">
            <span className="text-xs font-black uppercase text-yellow-600 dark:text-yellow-400 mb-1">
              TOTAL XP
            </span>
            <div className="flex items-center gap-1.5 font-black text-2xl text-yellow-500">
              <Zap className="w-6 h-6 fill-yellow-400" />
              <span>+{result.xp_earned}</span>
            </div>
          </div>

          {/* Accuracy */}
          <div className="p-3.5 rounded-2xl bg-green-50 dark:bg-green-950/40 border-2 border-green-200 dark:border-green-900/60 flex flex-col items-center">
            <span className="text-xs font-black uppercase text-green-600 dark:text-green-400 mb-1">
              ACCURACY
            </span>
            <div className="flex items-center gap-1.5 font-black text-2xl text-[#58CC02]">
              <CheckCircle2 className="w-6 h-6" />
              <span>{accuracy}%</span>
            </div>
          </div>

          {/* Streak */}
          <div className="col-span-2 sm:col-span-1 p-3.5 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border-2 border-orange-200 dark:border-orange-900/60 flex flex-col items-center">
            <span className="text-xs font-black uppercase text-orange-600 dark:text-orange-400 mb-1">
              STREAK
            </span>
            <div className="flex items-center gap-1.5 font-black text-2xl text-orange-500">
              <Flame className="w-6 h-6 fill-orange-500" />
              <span>{result.streak_after}d</span>
            </div>
          </div>
        </div>

        {/* Bonus Gems & Crown Progress */}
        <div className="w-full flex items-center justify-between p-3.5 mb-6 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border-2 border-blue-100 dark:border-blue-900/40 text-left">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900 text-[#1CB0F6]">
              <Gem className="w-6 h-6 fill-blue-400" />
            </div>
            <div>
              <p className="text-xs font-black text-blue-900 dark:text-blue-200">
                Bonus Gems Reward
              </p>
              <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400">
                +{result.gems_earned} gems added to your chest
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 font-black text-amber-500 bg-white dark:bg-[#131F24] px-2.5 py-1 rounded-xl border border-gray-200 dark:border-gray-700">
            <Crown className="w-4 h-4 fill-amber-400" />
            <span className="text-xs">Lvl {result.crown_level_after}</span>
          </div>
        </div>

        {/* Unlocked Achievements (if any) */}
        {result.newly_unlocked_achievements && result.newly_unlocked_achievements.length > 0 && (
          <div className="w-full p-4 mb-6 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border-2 border-purple-200 dark:border-purple-900/60 text-center animate-duo-pop">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Trophy className="w-5 h-5 text-purple-500" />
              <span className="text-xs font-black uppercase tracking-wider text-purple-600 dark:text-purple-300">
                Achievement Unlocked!
              </span>
            </div>
            {result.newly_unlocked_achievements.map((ach) => (
              <div key={ach.id} className="mt-1">
                <p className="text-base font-black text-purple-900 dark:text-purple-100">
                  {ach.title}
                </p>
                <p className="text-xs font-bold text-purple-600 dark:text-purple-300">
                  {ach.description}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Continue to Path */}
        <Link
          href="/"
          className="w-full py-4 duo-button duo-button-green text-base font-black tracking-wider uppercase shadow-lg"
        >
          CONTINUE TO HOME
        </Link>
      </div>
    </div>
  );
}
