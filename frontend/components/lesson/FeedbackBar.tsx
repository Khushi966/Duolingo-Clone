"use client";

import React, { useEffect } from "react";
import { Check, X, ArrowRight } from "lucide-react";

interface FeedbackBarProps {
  status: "idle" | "correct" | "incorrect";
  isCheckDisabled: boolean;
  correctAnswerText?: string;
  onCheck: () => void;
  onContinue: () => void;
  onSkip?: () => void;
}

export default function FeedbackBar({
  status,
  isCheckDisabled,
  correctAnswerText,
  onCheck,
  onContinue,
  onSkip,
}: FeedbackBarProps) {
  const cheerPhrases = [
    "Amazing job!",
    "You are on fire!",
    "Nicely done!",
    "Great work!",
    "Spot on!",
    "Perfect!",
  ];
  const cheer = cheerPhrases[Math.floor(Math.random() * cheerPhrases.length)];

  // Enter key → Continue when feedback is displayed
  useEffect(() => {
    if (status === "idle") return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        onContinue();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [status, onContinue]);

  return (
    <footer
      className={`w-full border-t-2 py-4 px-6 md:px-12 transition-all duration-300 ${
        status === "correct"
          ? "bg-[#D7FFB8] dark:bg-[#1A3922] border-[#58CC02]"
          : status === "incorrect"
          ? "bg-[#FFDFE0] dark:bg-[#3D1C22] border-[#FF4B4B]"
          : "bg-white dark:bg-[#131F24] border-gray-200 dark:border-[#2E383D]"
      }`}
    >
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Status Message Area */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {status === "correct" && (
            <div className="flex items-center gap-3.5 animate-duo-pop">
              <div className="w-12 h-12 rounded-full bg-white dark:bg-[#131F24] border-3 border-[#58CC02] flex items-center justify-center shrink-0">
                <Check className="w-7 h-7 text-[#58CC02] stroke-[3.5]" />
              </div>
              <div>
                <h3 className="text-xl font-black text-[#46A302] dark:text-[#58CC02]">
                  {cheer}
                </h3>
              </div>
            </div>
          )}

          {status === "incorrect" && (
            <div className="flex items-start gap-3.5 animate-duo-shake">
              <div className="w-12 h-12 rounded-full bg-white dark:bg-[#131F24] border-3 border-[#FF4B4B] flex items-center justify-center shrink-0">
                <X className="w-7 h-7 text-[#FF4B4B] stroke-[3.5]" />
              </div>
              <div>
                <h3 className="text-xl font-black text-[#EA2B2B] dark:text-[#FF4B4B]">
                  Correct answer:
                </h3>
                <p className="text-sm font-bold text-[#EA2B2B] dark:text-red-300">
                  {correctAnswerText || "Review the solution above."}
                </p>
              </div>
            </div>
          )}

          {status === "idle" && (
            <div className="hidden sm:block text-xs font-bold text-gray-400">
              Press Enter ↵ or click Check to continue
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {status === "idle" && onSkip && (
            <button
              onClick={onSkip}
              className="px-6 py-3.5 duo-button duo-button-white text-xs font-black"
            >
              SKIP
            </button>
          )}

          {status === "idle" ? (
            <button
              onClick={onCheck}
              disabled={isCheckDisabled}
              className={`w-full sm:w-44 py-3.5 duo-button ${
                isCheckDisabled ? "duo-button-disabled" : "duo-button-green"
              } text-sm font-black shadow-md`}
            >
              CHECK
            </button>
          ) : (
            <button
              onClick={onContinue}
              className={`w-full sm:w-48 py-3.5 duo-button ${
                status === "correct" ? "duo-button-green" : "duo-button-red"
              } text-sm font-black flex items-center justify-center gap-2 shadow-md animate-duo-pop`}
            >
              <span>CONTINUE</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          )}
        </div>
      </div>
    </footer>
  );
}
