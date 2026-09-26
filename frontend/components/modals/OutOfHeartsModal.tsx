"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, Gem, RotateCcw } from "lucide-react";
import PipMascot from "../mascot/PipMascot";
import { refillHearts } from "@/lib/api";
import { sounds } from "@/lib/sound";

interface OutOfHeartsModalProps {
  onRefilled: () => void;
}

export default function OutOfHeartsModal({ onRefilled }: OutOfHeartsModalProps) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    sounds.playHeartBreak();
  }, []);

  const handleRefill = async () => {
    setLoading(true);
    try {
      await refillHearts();
      sounds.playCorrect();
      onRefilled();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-md p-6 sm:p-8 bg-white dark:bg-[#1B272D] rounded-3xl border-2 border-gray-200 dark:border-[#2E383D] shadow-2xl animate-duo-shake text-center flex flex-col items-center">
        {/* Sad Mascot */}
        <div className="mb-2">
          <PipMascot mood="sad" size={130} />
        </div>

        {/* Title */}
        <h2 className="text-3xl font-black text-red-500 tracking-tight uppercase mb-1">
          You Ran Out of Hearts!
        </h2>
        <p className="text-sm font-bold text-gray-500 dark:text-gray-300 mb-6">
          Refill your hearts now to continue this lesson and safeguard your streak!
        </p>

        {/* Refill Button */}
        <div className="w-full space-y-3">
          <button
            onClick={handleRefill}
            disabled={loading}
            className="w-full py-4 duo-button duo-button-red text-sm font-black flex items-center justify-center gap-2 shadow-lg cursor-pointer"
          >
            <Heart className="w-5 h-5 fill-white" />
            <span>{loading ? "REFILLING..." : "REFILL HEARTS (50 GEMS)"}</span>
          </button>

          <Link
            href="/"
            className="w-full py-3.5 duo-button duo-button-white text-xs font-black block text-center"
          >
            QUIT LESSON & RETURN HOME
          </Link>
        </div>
      </div>
    </div>
  );
}
