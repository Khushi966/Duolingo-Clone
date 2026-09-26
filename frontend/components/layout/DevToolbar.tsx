"use client";

import React, { useState } from "react";
import { Calendar, FastForward, RotateCcw, Heart, Flame, Sparkles, Check, AlertCircle } from "lucide-react";
import { advanceDevDay, resetDevDay, refillHearts } from "@/lib/api";

interface DevToolbarProps {
  currentDate?: string;
  onRefresh?: () => void;
}

export default function DevToolbar({ currentDate = "2026-09-25", onRefresh }: DevToolbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const handleAdvance = async (days = 1) => {
    setLoading(true);
    setStatusMsg(null);
    try {
      const res = await advanceDevDay(days);
      setStatusMsg(`Advanced to ${res.simulated_date} (Streak: ${res.user_current_streak}d, Hearts: ${res.user_hearts_current})`);
      if (onRefresh) onRefresh();
    } catch (err: any) {
      setStatusMsg("Failed to advance day");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    setLoading(true);
    setStatusMsg(null);
    try {
      const res = await resetDevDay();
      setStatusMsg(`Reset to ${res.simulated_date}`);
      if (onRefresh) onRefresh();
    } catch (err: any) {
      setStatusMsg("Failed to reset");
    } finally {
      setLoading(false);
    }
  };

  const handleRefill = async () => {
    setLoading(true);
    setStatusMsg(null);
    try {
      const res = await refillHearts();
      setStatusMsg(res.message);
      if (onRefresh) onRefresh();
    } catch (err: any) {
      setStatusMsg("Failed to refill hearts");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Dev Float Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-20 md:bottom-6 right-6 z-40 flex items-center gap-2 px-3.5 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xl border-2 border-indigo-400 hover:scale-105 transition-all cursor-pointer"
        title="Open Dev Simulation Panel"
      >
        <Calendar className="w-4 h-4 text-yellow-300" />
        <span>Dev Simulator: {currentDate}</span>
      </button>

      {/* Dev Simulation Drawer / Modal */}
      {isOpen && (
        <div className="fixed bottom-32 md:bottom-18 right-6 z-50 w-80 p-4 bg-white dark:bg-[#1B272D] rounded-2xl border-2 border-indigo-300 dark:border-indigo-900 shadow-2xl animate-duo-pop">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800 mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <h4 className="text-sm font-black text-gray-800 dark:text-gray-100 uppercase tracking-wide">
                Day & Streak Simulator
              </h4>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 text-xs font-bold"
            >
              ✕
            </button>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 leading-tight">
            Simulate passing days to test consecutive streak increments, streak breaks (&gt;1 day gap), and lazy heart regeneration.
          </p>

          <div className="bg-indigo-50 dark:bg-indigo-950/40 p-2.5 rounded-xl border border-indigo-100 dark:border-indigo-900/50 mb-3 text-xs">
            <div className="flex justify-between font-bold text-indigo-900 dark:text-indigo-200">
              <span>Simulated Date:</span>
              <span className="font-mono bg-indigo-200 dark:bg-indigo-800 px-1.5 py-0.5 rounded">
                {currentDate}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => handleAdvance(1)}
              disabled={loading}
              className="w-full py-2 px-3 duo-button duo-button-green text-xs font-black flex items-center justify-center gap-2"
            >
              <FastForward className="w-4 h-4" />
              Advance +1 Day
            </button>

            <button
              onClick={() => handleAdvance(2)}
              disabled={loading}
              className="w-full py-2 px-3 duo-button duo-button-blue text-xs font-black flex items-center justify-center gap-2"
            >
              <Flame className="w-4 h-4 text-orange-200" />
              Skip 2 Days (Test Streak Break)
            </button>

            <button
              onClick={handleRefill}
              disabled={loading}
              className="w-full py-2 px-3 duo-button duo-button-red text-xs font-black flex items-center justify-center gap-2"
            >
              <Heart className="w-4 h-4 fill-white" />
              Refill Hearts (50 Gems)
            </button>

            <button
              onClick={handleReset}
              disabled={loading}
              className="w-full py-2 px-3 duo-button duo-button-white text-xs font-black flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              Reset Date (2026-09-25)
            </button>
          </div>

          {statusMsg && (
            <div className="mt-3 p-2 rounded-lg bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-900 text-green-700 dark:text-green-300 text-[11px] font-bold flex items-start gap-1.5 animate-fade-in">
              <Check className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>{statusMsg}</span>
            </div>
          )}
        </div>
      )}
    </>
  );
}
