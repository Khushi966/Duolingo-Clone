"use client";

import React from "react";
import { Exercise } from "@/lib/api";
import { sounds } from "@/lib/sound";

interface FillBlankProps {
  exercise: Exercise;
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}

export default function FillBlank({
  exercise,
  value,
  onChange,
  disabled = false,
}: FillBlankProps) {
  const options: string[] = Array.isArray(exercise.options) ? exercise.options : [];
  const translation = exercise.metadata?.translation;

  const handleSelect = (word: string) => {
    if (disabled) return;
    sounds.playClick();
    onChange(word);
  };

  // Render sentence with blank
  const renderSentence = () => {
    const rawPrompt = exercise.prompt;
    const parts = rawPrompt.split("_____");

    if (parts.length >= 2) {
      return (
        <div className="flex flex-wrap items-center justify-center gap-2 text-2xl sm:text-3xl font-black text-gray-800 dark:text-gray-100 my-6">
          <span>{parts[0]}</span>
          <span
            className={`min-w-[100px] px-3 py-1.5 rounded-xl border-b-4 text-center inline-flex items-center justify-center text-xl font-black transition-all ${
              value
                ? "bg-blue-50 dark:bg-blue-950/40 border-[#1CB0F6] text-[#1CB0F6] animate-duo-pop"
                : "border-gray-400 dark:border-gray-600 bg-gray-100 dark:bg-[#1B272D] text-gray-400 border-dashed"
            }`}
          >
            {value || " "}
          </span>
          <span>{parts[1]}</span>
        </div>
      );
    }

    return (
      <div className="text-2xl font-black text-gray-800 dark:text-gray-100 text-center my-6">
        {rawPrompt}
      </div>
    );
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center select-none">
      <h2 className="text-lg font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-left w-full">
        Complete the sentence
      </h2>

      {/* Sentence with blank */}
      <div className="w-full p-6 my-4 bg-gray-50 dark:bg-[#1B272D]/50 rounded-2xl border-2 border-gray-200 dark:border-[#2E383D] text-center">
        {renderSentence()}
        {translation && (
          <p className="text-sm font-bold text-gray-500 dark:text-gray-400 italic">
            &ldquo;{translation}&rdquo;
          </p>
        )}
      </div>

      {/* Choice Tiles */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
        {options.map((opt) => {
          const isSelected = value === opt;

          return (
            <button
              key={opt}
              type="button"
              onClick={() => handleSelect(opt)}
              disabled={disabled}
              className={`p-3.5 rounded-2xl font-black text-base border-2 transition-all ${
                isSelected
                  ? "bg-blue-50 dark:bg-blue-950/40 border-[#1CB0F6] text-[#1CB0F6] border-b-4 shadow-sm"
                  : "bg-white dark:bg-[#1B272D] border-gray-200 dark:border-[#2E383D] border-b-4 text-gray-800 dark:text-gray-100 hover:bg-gray-50 active:translate-y-1"
              } ${disabled ? "cursor-default" : "cursor-pointer"}`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
