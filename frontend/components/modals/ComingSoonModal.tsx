"use client";

import React from "react";
import { X, Sparkles } from "lucide-react";
import PipMascot from "../mascot/PipMascot";

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  tag?: string;
}

export default function ComingSoonModal({
  isOpen,
  onClose,
  title,
  description,
  tag = "Coming Soon",
}: ComingSoonModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-md p-6 bg-white dark:bg-[#1B272D] rounded-3xl border-2 border-gray-200 dark:border-[#2E383D] shadow-2xl animate-duo-pop text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Mascot */}
        <div className="flex justify-center mb-3">
          <PipMascot mood="thinking" size={110} />
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-1 px-3 py-1 mb-3 text-xs font-black uppercase tracking-wider rounded-full bg-blue-100 dark:bg-blue-950/60 text-[#1CB0F6]">
          <Sparkles className="w-3.5 h-3.5" />
          {tag}
        </div>

        <h3 className="text-2xl font-black text-gray-800 dark:text-gray-100 mb-2">
          {title}
        </h3>

        <p className="text-gray-500 dark:text-gray-300 text-sm mb-6 leading-relaxed">
          {description}
        </p>

        <button
          onClick={onClose}
          className="w-full py-3 duo-button duo-button-blue text-sm uppercase tracking-wider"
        >
          Got it!
        </button>
      </div>
    </div>
  );
}
