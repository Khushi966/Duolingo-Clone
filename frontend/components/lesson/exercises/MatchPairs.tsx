"use client";

import React, { useState, useEffect } from "react";
import { Exercise } from "@/lib/api";
import { sounds } from "@/lib/sound";

interface MatchPairsProps {
  exercise: Exercise;
  value: Record<string, string>;
  onChange: (val: Record<string, string>) => void;
  disabled?: boolean;
}

export default function MatchPairs({
  exercise,
  value = {},
  onChange,
  disabled = false,
}: MatchPairsProps) {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [wrongPair, setWrongPair] = useState<[string, string] | null>(null);

  // Correct answer mapping
  const expectedPairs: Record<string, string> = exercise.correct_answer || {};

  // Extract left and right options
  const leftItems: string[] = exercise.options?.left || Object.keys(expectedPairs);
  const rightItems: string[] = exercise.options?.right || Object.values(expectedPairs);

  const matchedLeft = new Set(Object.keys(value));
  const matchedRight = new Set(Object.values(value));

  const handleLeftClick = (item: string) => {
    if (disabled || matchedLeft.has(item)) return;
    sounds.playClick();
    setSelectedLeft(item);

    if (selectedRight) {
      checkPair(item, selectedRight);
    }
  };

  const handleRightClick = (item: string) => {
    if (disabled || matchedRight.has(item)) return;
    sounds.playClick();
    setSelectedRight(item);

    if (selectedLeft) {
      checkPair(selectedLeft, item);
    }
  };

  const checkPair = (left: string, right: string) => {
    const isMatch = expectedPairs[left] === right;

    if (isMatch) {
      sounds.playCorrect();
      const nextMatches = { ...value, [left]: right };
      onChange(nextMatches);
      setSelectedLeft(null);
      setSelectedRight(null);
    } else {
      sounds.playIncorrect();
      setWrongPair([left, right]);
      setTimeout(() => {
        setWrongPair(null);
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 500);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center select-none">
      <h2 className="text-2xl sm:text-3xl font-black text-gray-800 dark:text-gray-100 text-left w-full mb-8">
        {exercise.prompt}
      </h2>

      <div className="w-full grid grid-cols-2 gap-4 sm:gap-6">
        {/* Left Column */}
        <div className="flex flex-col gap-3">
          {leftItems.map((item) => {
            const isMatched = matchedLeft.has(item);
            const isSelected = selectedLeft === item;
            const isWrong = wrongPair && wrongPair[0] === item;

            return (
              <button
                key={item}
                type="button"
                onClick={() => handleLeftClick(item)}
                disabled={disabled || isMatched}
                className={`w-full p-4 rounded-2xl border-2 font-black text-base transition-all text-center ${
                  isMatched
                    ? "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400 opacity-50 cursor-default"
                    : isWrong
                    ? "bg-red-100 border-red-500 text-red-600 animate-duo-shake border-b-4"
                    : isSelected
                    ? "bg-blue-50 dark:bg-blue-950/40 border-[#1CB0F6] text-[#1CB0F6] border-b-4 shadow-sm"
                    : "bg-white dark:bg-[#1B272D] border-gray-200 dark:border-[#2E383D] border-b-4 text-gray-800 dark:text-gray-100 hover:bg-gray-50 active:translate-y-1 cursor-pointer"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-3">
          {rightItems.map((item) => {
            const isMatched = matchedRight.has(item);
            const isSelected = selectedRight === item;
            const isWrong = wrongPair && wrongPair[1] === item;

            return (
              <button
                key={item}
                type="button"
                onClick={() => handleRightClick(item)}
                disabled={disabled || isMatched}
                className={`w-full p-4 rounded-2xl border-2 font-black text-base transition-all text-center ${
                  isMatched
                    ? "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400 opacity-50 cursor-default"
                    : isWrong
                    ? "bg-red-100 border-red-500 text-red-600 animate-duo-shake border-b-4"
                    : isSelected
                    ? "bg-blue-50 dark:bg-blue-950/40 border-[#1CB0F6] text-[#1CB0F6] border-b-4 shadow-sm"
                    : "bg-white dark:bg-[#1B272D] border-gray-200 dark:border-[#2E383D] border-b-4 text-gray-800 dark:text-gray-100 hover:bg-gray-50 active:translate-y-1 cursor-pointer"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
