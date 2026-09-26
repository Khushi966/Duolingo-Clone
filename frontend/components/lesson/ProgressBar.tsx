"use client";

import React from "react";

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(5, (current / Math.max(1, total)) * 100));

  return (
    <div className="w-full h-4 bg-gray-200 dark:bg-[#2E383D] rounded-full overflow-hidden relative shadow-inner">
      <div
        className="h-full bg-[#58CC02] rounded-full transition-all duration-500 ease-out relative"
        style={{ width: `${percentage}%` }}
      >
        {/* Glossy top shine */}
        <div className="absolute top-1 left-2 right-2 h-1 bg-white/30 rounded-full" />
      </div>
    </div>
  );
}
