"use client";

import React from "react";
import { Heart } from "lucide-react";

interface HeartsDisplayProps {
  hearts: number;
  maxHearts?: number;
  isShaking?: boolean;
}

export default function HeartsDisplay({
  hearts,
  maxHearts = 5,
  isShaking = false,
}: HeartsDisplayProps) {
  return (
    <div
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 transition-transform ${
        isShaking ? "animate-duo-shake" : ""
      }`}
    >
      <Heart className={`w-6 h-6 ${hearts > 0 ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
      <span className="font-black text-red-600 dark:text-red-400 text-base">
        {hearts}
      </span>
    </div>
  );
}
