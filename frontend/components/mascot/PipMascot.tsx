"use client";

import React from "react";

interface PipMascotProps {
  mood?: "happy" | "celebrating" | "thinking" | "sad" | "cheering" | "wave";
  size?: number;
  className?: string;
}

export default function PipMascot({
  mood = "happy",
  size = 120,
  className = "",
}: PipMascotProps) {
  return (
    <div
      className={`inline-block select-none transition-transform hover:scale-105 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        {/* Glow / Shadow under mascot */}
        <ellipse cx="80" cy="148" rx="46" ry="8" fill="#00000015" />

        {/* Tail */}
        <path
          d="M 40 120 C 15 130 10 95 30 90 C 45 86 42 105 40 120 Z"
          fill="#46A302"
          stroke="#388202"
          strokeWidth="3"
        />

        {/* Main Body - Pip the vibrant turquoise-green Chameleon */}
        <path
          d="M 45 110 C 35 70 65 30 95 35 C 125 40 135 85 125 120 C 115 142 55 142 45 110 Z"
          fill="#58CC02"
          stroke="#46A302"
          strokeWidth="4"
        />

        {/* Belly Patch (Lighter green/yellow highlight) */}
        <path
          d="M 60 85 C 60 65 85 55 100 65 C 112 75 115 115 95 130 C 75 140 60 125 60 85 Z"
          fill="#8EE000"
          opacity="0.8"
        />

        {/* Crest Feathers / Spikes on head */}
        <path
          d="M 75 35 C 70 18 85 15 88 32 Z"
          fill="#FF9600"
          stroke="#E07A00"
          strokeWidth="2"
        />
        <path
          d="M 90 35 C 92 12 106 14 102 34 Z"
          fill="#FFC800"
          stroke="#E5A500"
          strokeWidth="2"
        />
        <path
          d="M 104 38 C 112 22 122 28 114 42 Z"
          fill="#FF4B4B"
          stroke="#EA2B2B"
          strokeWidth="2"
        />

        {/* Left Big Eye */}
        <circle cx="68" cy="62" r="19" fill="#FFFFFF" stroke="#46A302" strokeWidth="3" />
        {/* Right Big Eye */}
        <circle cx="106" cy="64" r="19" fill="#FFFFFF" stroke="#46A302" strokeWidth="3" />

        {/* Mood based Pupils & Expressions */}
        {mood === "happy" && (
          <>
            {/* Pupils looking slightly right/up */}
            <circle cx="72" cy="62" r="9" fill="#2B3A42" />
            <circle cx="75" cy="59" r="3.5" fill="#FFFFFF" />
            <circle cx="110" cy="64" r="9" fill="#2B3A42" />
            <circle cx="113" cy="61" r="3.5" fill="#FFFFFF" />

            {/* Rosy Cheeks */}
            <ellipse cx="54" cy="80" rx="6" ry="4" fill="#FF4B4B" opacity="0.4" />
            <ellipse cx="120" cy="82" rx="6" ry="4" fill="#FF4B4B" opacity="0.4" />

            {/* Happy Smile */}
            <path
              d="M 75 88 Q 88 102 101 88"
              fill="#FFFFFF"
              stroke="#2B3A42"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Tongue */}
            <path d="M 84 95 Q 88 101 92 95 Z" fill="#FF4B4B" />
          </>
        )}

        {mood === "celebrating" && (
          <>
            {/* Star Sparkle Pupils */}
            <path
              d="M 68 53 L 71 61 L 79 62 L 72 67 L 74 75 L 68 70 L 62 75 L 64 67 L 57 62 L 65 61 Z"
              fill="#FFC800"
            />
            <path
              d="M 106 55 L 109 63 L 117 64 L 110 69 L 112 77 L 106 72 L 100 77 L 102 69 L 95 64 L 103 63 Z"
              fill="#FFC800"
            />

            {/* Party Hat */}
            <polygon points="88,5 65,36 112,34" fill="#CE82FF" stroke="#A54CE6" strokeWidth="2" />
            <circle cx="88" cy="5" r="5" fill="#FFC800" />
            <line x1="72" y1="28" x2="105" y2="26" stroke="#FFFFFF" strokeWidth="2.5" />
            <line x1="78" y1="18" x2="98" y2="17" stroke="#FF9600" strokeWidth="2.5" />

            {/* Cheerful wide open mouth */}
            <path
              d="M 72 86 Q 88 108 104 86 Z"
              fill="#FF4B4B"
              stroke="#2B3A42"
              strokeWidth="3.5"
            />
            <ellipse cx="88" cy="98" rx="8" ry="4" fill="#FF8080" />
          </>
        )}

        {mood === "thinking" && (
          <>
            {/* Thoughtful Eyes Looking Up */}
            <circle cx="68" cy="55" r="9" fill="#2B3A42" />
            <circle cx="71" cy="53" r="3" fill="#FFFFFF" />
            <circle cx="106" cy="57" r="9" fill="#2B3A42" />
            <circle cx="109" cy="55" r="3" fill="#FFFFFF" />

            {/* Quirky curved smile */}
            <path
              d="M 76 90 Q 88 88 98 94"
              fill="none"
              stroke="#2B3A42"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Little paw on chin */}
            <ellipse cx="98" cy="98" rx="7" ry="5" fill="#46A302" />
          </>
        )}

        {mood === "sad" && (
          <>
            {/* Droopy sad eyes */}
            <circle cx="68" cy="66" r="8" fill="#2B3A42" />
            <circle cx="106" cy="68" r="8" fill="#2B3A42" />
            <ellipse cx="68" cy="54" rx="10" ry="3" fill="#58CC02" />
            <ellipse cx="106" cy="56" rx="10" ry="3" fill="#58CC02" />

            {/* Tear drop */}
            <path d="M 60 74 C 58 78 58 83 62 83 C 65 83 65 78 60 74 Z" fill="#1CB0F6" />

            {/* Frown */}
            <path
              d="M 75 96 Q 88 86 101 96"
              fill="none"
              stroke="#2B3A42"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </>
        )}

        {mood === "cheering" && (
          <>
            {/* Happy Curved Wink & Big Eye */}
            <path
              d="M 58 65 Q 68 52 78 65"
              fill="none"
              stroke="#2B3A42"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <circle cx="106" cy="62" r="9" fill="#2B3A42" />
            <circle cx="109" cy="59" r="4" fill="#FFFFFF" />

            {/* Happy open mouth */}
            <path
              d="M 74 86 Q 88 106 102 86 Z"
              fill="#2B3A42"
              stroke="#2B3A42"
              strokeWidth="2"
            />
            <path d="M 80 94 Q 88 103 96 94 Z" fill="#FF4B4B" />

            {/* Cheering raised arm */}
            <path
              d="M 125 90 Q 145 65 140 55 C 132 50 120 75 115 95 Z"
              fill="#58CC02"
              stroke="#46A302"
              strokeWidth="3"
            />
          </>
        )}

        {mood === "wave" && (
          <>
            <circle cx="70" cy="62" r="9" fill="#2B3A42" />
            <circle cx="73" cy="59" r="3.5" fill="#FFFFFF" />
            <circle cx="108" cy="64" r="9" fill="#2B3A42" />
            <circle cx="111" cy="61" r="3.5" fill="#FFFFFF" />

            <path
              d="M 76 88 Q 88 100 100 88"
              fill="none"
              stroke="#2B3A42"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Waving hand */}
            <path
              d="M 35 90 Q 20 60 25 50 C 32 45 42 70 45 95 Z"
              fill="#58CC02"
              stroke="#46A302"
              strokeWidth="3"
            />
          </>
        )}

        {/* Feet */}
        <ellipse cx="65" cy="138" rx="14" ry="7" fill="#46A302" />
        <ellipse cx="105" cy="138" rx="14" ry="7" fill="#46A302" />
      </svg>
    </div>
  );
}
