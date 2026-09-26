"use client";

import React from "react";
import { Exercise } from "@/lib/api";
import { sounds } from "@/lib/sound";

interface TranslateWordBankProps {
  exercise: Exercise;
  value: string[];
  onChange: (val: string[]) => void;
  disabled?: boolean;
}

export default function TranslateWordBank({
  exercise,
  value = [],
  onChange,
  disabled = false,
}: TranslateWordBankProps) {
  const options: string[] = Array.isArray(exercise.options) ? exercise.options : [];

  // Selected words can be multiple copies or indexed
  const handleAddWord = (word: string, index: number) => {
    if (disabled) return;
    sounds.playClick();
    onChange([...value, word]);
  };

  const handleRemoveWord = (wordIndexToRemove: number) => {
    if (disabled) return;
    sounds.playClick();
    const nextVal = value.filter((_, idx) => idx !== wordIndexToRemove);
    onChange(nextVal);
  };

  // Check how many times a word is available in bank vs how many times it was used
  const getUsedCount = (word: string) => {
    return value.filter((w) => w === word).length;
  };

  const getAvailableCountInBank = (word: string) => {
    return options.filter((w) => w === word).length;
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center select-none">
      {/* Exercise Prompt */}
      <h2 className="text-2xl sm:text-3xl font-black text-gray-800 dark:text-gray-100 text-left w-full mb-6">
        {exercise.prompt}
      </h2>

      {/* Answer Sentence Assembly Line */}
      <div className="w-full min-h-[90px] p-3.5 mb-8 rounded-2xl border-2 border-dashed border-gray-300 dark:border-[#2E383D] bg-gray-50/70 dark:bg-[#1B272D]/50 flex flex-wrap items-center gap-2.5 transition-all">
        {value.length === 0 ? (
          <span className="text-sm font-bold text-gray-400 italic px-2">
            Click words from below to construct your translation
          </span>
        ) : (
          value.map((word, idx) => (
            <button
              key={`${word}-${idx}`}
              type="button"
              onClick={() => handleRemoveWord(idx)}
              disabled={disabled}
              className="px-4 py-2.5 rounded-xl font-black text-base bg-white dark:bg-[#1B272D] border-2 border-gray-200 dark:border-[#2E383D] border-b-4 text-gray-800 dark:text-gray-100 shadow-xs hover:border-red-300 dark:hover:border-red-800 active:scale-95 transition-all cursor-pointer animate-duo-pop"
            >
              {word}
            </button>
          ))
        )}
      </div>

      {/* Word Bank Pool */}
      <div className="w-full flex flex-wrap justify-center gap-3">
        {options.map((word, index) => {
          // Determine if this instance in bank is already picked
          const bankOccurrencesBeforeThis = options.slice(0, index + 1).filter((w) => w === word).length;
          const isUsed = getUsedCount(word) >= bankOccurrencesBeforeThis;

          return (
            <div key={`${word}-${index}`} className="relative">
              {/* Placeholder slot when word is selected */}
              <div
                className={`px-4 py-2.5 rounded-xl font-black text-base border-2 border-gray-200 dark:border-[#2E383D] bg-gray-200 dark:bg-[#202C33] text-transparent ${
                  isUsed ? "opacity-40" : "hidden"
                }`}
              >
                {word}
              </div>

              {/* Active clickable tile */}
              {!isUsed && (
                <button
                  type="button"
                  onClick={() => handleAddWord(word, index)}
                  disabled={disabled}
                  className="px-4 py-2.5 rounded-xl font-black text-base bg-white dark:bg-[#1B272D] border-2 border-gray-200 dark:border-[#2E383D] border-b-4 text-gray-800 dark:text-gray-100 shadow-xs hover:bg-gray-50 dark:hover:bg-[#233139] active:translate-y-1 active:border-b-2 transition-all cursor-pointer"
                >
                  {word}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
