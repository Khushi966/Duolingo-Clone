"use client";

import React from "react";
import { Exercise } from "@/lib/api";
import { sounds } from "@/lib/sound";

interface MultipleChoiceProps {
  exercise: Exercise;
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}

export default function MultipleChoice({
  exercise,
  value,
  onChange,
  disabled = false,
}: MultipleChoiceProps) {
  const options = Array.isArray(exercise.options) ? exercise.options : [];

  const handleSelect = (optId: string) => {
    if (disabled) return;
    sounds.playClick();
    onChange(optId);
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center">
      {/* Exercise Prompt */}
      <h2 className="text-2xl sm:text-3xl font-black text-gray-800 dark:text-gray-100 text-left w-full mb-8">
        {exercise.prompt}
      </h2>

      {/* Options Grid */}
      <div className="w-full space-y-3.5">
        {options.map((opt: any, index: number) => {
          const optId = typeof opt === "object" ? opt.id || opt.text : opt;
          const optText = typeof opt === "object" ? opt.text || opt.id : opt;
          const isSelected = value === optId;

          return (
            <button
              key={optId}
              type="button"
              onClick={() => handleSelect(optId)}
              disabled={disabled}
              className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between text-left font-extrabold text-lg transition-all ${
                isSelected
                  ? "bg-blue-50 dark:bg-blue-950/40 border-[#1CB0F6] text-[#1CB0F6] shadow-sm translate-y-0.5 border-b-4"
                  : "bg-white dark:bg-[#1B272D] border-gray-200 dark:border-[#2E383D] border-b-4 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#233139]"
              } ${disabled ? "cursor-default" : "cursor-pointer active:translate-y-1"}`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center text-xs font-black ${
                    isSelected
                      ? "border-[#1CB0F6] bg-[#1CB0F6] text-white"
                      : "border-gray-300 dark:border-gray-600 text-gray-400"
                  }`}
                >
                  {index + 1}
                </span>
                <span>{optText}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
