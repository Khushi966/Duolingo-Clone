"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Lock,
  Check,
  Crown,
  Sparkles,
  Handshake,
  Users,
  Utensils,
  BookOpen,
  Binary,
  Plane,
  Star,
  Play,
} from "lucide-react";
import { Skill } from "@/lib/api";

interface SkillNodeProps {
  skill: Skill;
  unitColor?: string;
  isUnitLocked?: boolean;
}

export default function SkillNode({
  skill,
  unitColor = "#58CC02",
  isUnitLocked = false,
}: SkillNodeProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const isLocked = isUnitLocked || skill.progress.status === "locked";
  const isCompleted = skill.progress.status === "completed" || skill.progress.crown_level > 0;
  const crownLevel = skill.progress.crown_level;
  const totalLessons = skill.total_lessons || 2;
  const completedLessons = skill.completed_lessons || 0;
  const currentLessonId = skill.current_lesson_id || skill.id;

  // Choose icon component
  const getIcon = () => {
    if (isLocked) return <Lock className="w-8 h-8 text-gray-400" />;
    switch (skill.icon) {
      case "handshake":
        return <Handshake className="w-9 h-9" />;
      case "users":
        return <Users className="w-9 h-9" />;
      case "utensils":
        return <Utensils className="w-9 h-9" />;
      case "book-open":
        return <BookOpen className="w-9 h-9" />;
      case "binary":
        return <Binary className="w-9 h-9" />;
      case "plane":
        return <Plane className="w-9 h-9" />;
      default:
        return <Sparkles className="w-9 h-9" />;
    }
  };

  // Outer Crown Progress Ring calculation
  const ringRadius = 46;
  const circumference = 2 * Math.PI * ringRadius;
  const progressPercent = Math.min(1, Math.max(0, crownLevel / 5));
  const strokeDashoffset = circumference - progressPercent * circumference;

  return (
    <div className="relative flex flex-col items-center select-none my-4">
      {/* Skill Node Main Circular Button */}
      <div className="relative group">
        {/* Crown Progress SVG Ring (around the node) */}
        {!isLocked && (
          <svg
            className="absolute -top-3.5 -left-3.5 w-28 h-28 pointer-events-none -rotate-90"
            viewBox="0 0 112 112"
          >
            {/* Background track */}
            <circle
              cx="56"
              cy="56"
              r={ringRadius}
              fill="none"
              stroke="#E5E5E5"
              strokeWidth="6"
              className="dark:stroke-gray-700"
            />
            {/* Progress fill */}
            <circle
              cx="56"
              cy="56"
              r={ringRadius}
              fill="none"
              stroke={crownLevel > 0 ? "#FFC800" : unitColor}
              strokeWidth="6"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
            />
          </svg>
        )}

        {/* Chunky 3D Node Button */}
        <button
          onClick={() => !isLocked && setShowTooltip(!showTooltip)}
          disabled={isLocked}
          style={{
            backgroundColor: isLocked ? "#E5E5E5" : isCompleted ? "#FFC800" : unitColor,
            borderColor: isLocked ? "#CECECE" : isCompleted ? "#E5A500" : "#46A302",
          }}
          className={`relative z-10 w-21 h-21 rounded-full flex items-center justify-center text-white border-b-6 shadow-md transition-all ${
            isLocked
              ? "cursor-not-allowed dark:bg-[#2E383D] dark:border-[#202C33]"
              : "cursor-pointer hover:scale-105 active:scale-95 active:border-b-2 active:translate-y-1"
          }`}
        >
          <div className={isLocked ? "text-gray-400 dark:text-gray-500" : "text-white"}>
            {getIcon()}
          </div>

          {/* Crown Badge */}
          {crownLevel > 0 && !isLocked && (
            <div className="absolute -top-1.5 -right-1.5 bg-[#FFC800] border-2 border-white dark:border-[#131F24] rounded-full px-1.5 py-0.5 flex items-center gap-0.5 shadow-sm">
              <Crown className="w-3.5 h-3.5 text-amber-950 fill-amber-950" />
              <span className="text-[11px] font-black text-amber-950">{crownLevel}</span>
            </div>
          )}

          {/* Completed Checkmark Indicator */}
          {isCompleted && (
            <div className="absolute -bottom-1 bg-[#58CC02] border-2 border-white dark:border-[#131F24] rounded-full p-1 shadow-sm">
              <Check className="w-3 h-3 text-white stroke-[3.5]" />
            </div>
          )}
        </button>
      </div>

      {/* Skill Title Label */}
      <span className="mt-3 font-extrabold text-sm text-gray-700 dark:text-gray-200 tracking-wide text-center">
        {skill.title}
      </span>

      {/* Duolingo-style Popover Dialog */}
      {showTooltip && (
        <>
          {/* Overlay to dismiss */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowTooltip(false)}
          />

          {/* Popover Bubble */}
          <div className="absolute top-26 z-50 w-72 p-4 bg-white dark:bg-[#1B272D] rounded-2xl border-2 border-gray-200 dark:border-[#2E383D] shadow-2xl animate-duo-pop text-center">
            {/* Arrow on top */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white dark:bg-[#1B272D] border-t-2 border-l-2 border-gray-200 dark:border-[#2E383D] rotate-45" />

            <div className="relative z-10">
              <div className="flex items-center justify-center gap-1.5 mb-1 text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400">
                <Crown className="w-4 h-4 text-yellow-500 fill-yellow-400" />
                <span>Level {crownLevel} / 5</span>
              </div>

              <h4 className="text-lg font-black text-gray-800 dark:text-gray-100 mb-1">
                {skill.title}
              </h4>

              <p className="text-xs font-semibold text-gray-500 dark:text-gray-300 mb-4">
                {isCompleted ? "Practice to solidify mastery!" : `Lesson ${(completedLessons % totalLessons) + 1} of ${totalLessons}`}
              </p>

              <Link
                href={`/lesson/${currentLessonId}`}
                className="w-full py-3 duo-button duo-button-green text-sm flex items-center justify-center gap-2 shadow-md"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{isCompleted ? "PRACTICE +10 XP" : "START +10 XP"}</span>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
