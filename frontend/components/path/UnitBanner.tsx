"use client";

import React, { useState } from "react";
import { BookOpen, Lock, Sparkles } from "lucide-react";
import { Unit } from "@/lib/api";
import ComingSoonModal from "../modals/ComingSoonModal";

interface UnitBannerProps {
  unit: Unit;
}

export default function UnitBanner({ unit }: UnitBannerProps) {
  const [showGuidebook, setShowGuidebook] = useState(false);

  return (
    <div
      className="relative w-full rounded-2xl p-5 mb-8 text-white shadow-lg overflow-hidden transition-transform"
      style={{ backgroundColor: unit.is_locked ? "#777777" : unit.theme_color }}
    >
      {/* Background Decorative Circles */}
      <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-white/10 pointer-events-none" />
      <div className="absolute right-12 -top-6 w-20 h-20 rounded-full bg-white/10 pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-black uppercase tracking-widest bg-black/20 px-2.5 py-0.5 rounded-md">
              Unit {unit.order_index}
            </span>
            {unit.is_locked && (
              <span className="flex items-center gap-1 text-xs font-bold bg-black/30 px-2 py-0.5 rounded-md text-gray-200">
                <Lock className="w-3 h-3" /> Locked
              </span>
            )}
          </div>
          <h2 className="text-2xl font-black tracking-tight">{unit.title}</h2>
          <p className="text-sm font-semibold text-white/90 max-w-md">
            {unit.order_index === 1
              ? "Learn Spanish fundamentals: essential greetings, family members, and dining phrases."
              : "Form complex sentences: master verbs (ser/estar), counting numbers, and travel navigation."}
          </p>
        </div>

        {/* Guidebook Button */}
        <button
          onClick={() => setShowGuidebook(true)}
          disabled={unit.is_locked}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider bg-white/20 hover:bg-white/30 backdrop-blur-xs border border-white/30 transition-all ${
            unit.is_locked ? "opacity-50 cursor-not-allowed" : "cursor-pointer active:scale-95"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Guidebook</span>
        </button>
      </div>

      <ComingSoonModal
        isOpen={showGuidebook}
        onClose={() => setShowGuidebook(false)}
        title={`${unit.title} Guidebook`}
        description="Grammar tips, vocabulary tables, and audio pronunciation guides will appear here!"
        tag="Study Notes"
      />
    </div>
  );
}
