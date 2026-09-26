"use client";

import React, { useRef, useEffect } from "react";
import { Exercise } from "@/lib/api";
import { sounds } from "@/lib/sound";

interface TypeAnswerProps {
  exercise: Exercise;
  value: string;
  onChange: (val: string) => void;
  onEnterPress?: () => void;
  disabled?: boolean;
}

export default function TypeAnswer({
  exercise,
  value = "",
  onChange,
  onEnterPress,
  disabled = false,
}: TypeAnswerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const accentChars = ["á", "é", "í", "ó", "ú", "ñ", "¿", "¡"];

  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled]);

  const handleCharInsert = (char: string) => {
    if (disabled) return;
    sounds.playClick();
    const nextVal = (value || "") + char;
    onChange(nextVal);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !disabled && value.trim()) {
      if (onEnterPress) {
        e.preventDefault();
        onEnterPress();
      }
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center select-none">
      <h2 className="text-2xl sm:text-3xl font-black text-gray-800 dark:text-gray-100 text-left w-full mb-8">
        {exercise.prompt}
      </h2>

      {/* Chunky Text Input Box */}
      <div className="w-full mb-6">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Type your translation in Spanish..."
          className="w-full p-4 text-xl font-black bg-white dark:bg-[#1B272D] text-gray-800 dark:text-gray-100 rounded-2xl border-2 border-gray-300 dark:border-[#2E383D] border-b-4 focus:border-[#1CB0F6] focus:outline-hidden transition-all shadow-inner placeholder:text-gray-400 placeholder:font-bold"
        />
      </div>

      {/* Special Character Accent Keyboard Buttons */}
      <div className="w-full flex flex-col items-center">
        <span className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">
          Quick Accents & Symbols
        </span>
        <div className="flex flex-wrap justify-center gap-2">
          {accentChars.map((char) => (
            <button
              key={char}
              type="button"
              onClick={() => handleCharInsert(char)}
              disabled={disabled}
              className="w-10 h-10 rounded-xl font-black text-base bg-white dark:bg-[#1B272D] border-2 border-gray-200 dark:border-[#2E383D] border-b-4 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#233139] active:translate-y-1 active:border-b-2 transition-all cursor-pointer"
            >
              {char}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
