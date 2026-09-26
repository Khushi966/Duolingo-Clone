"use client";

import React from "react";
import { Unit } from "@/lib/api";
import UnitBanner from "./UnitBanner";
import SkillNode from "./SkillNode";
import PipMascot from "../mascot/PipMascot";

interface PathTreeProps {
  units: Unit[];
}

export default function PathTree({ units }: PathTreeProps) {
  // Winding offset pattern: [center, left, center, right, left, center, right]
  const offsetClasses = [
    "translate-x-0",
    "-translate-x-12 sm:-translate-x-16",
    "translate-x-0",
    "translate-x-12 sm:translate-x-16",
  ];

  return (
    <div className="w-full max-w-2xl mx-auto py-6 px-4 flex flex-col items-center">
      {units.map((unit, unitIdx) => (
        <section key={unit.id} className="w-full mb-12 flex flex-col items-center">
          {/* Unit Header Banner */}
          <UnitBanner unit={unit} />

          {/* Skills Tree with Winding Path */}
          <div className="relative w-full flex flex-col items-center my-6">
            {/* Mascot cheering next to Unit 1 */}
            {unitIdx === 0 && (
              <div className="hidden lg:block absolute -left-32 top-8 animate-bounce-subtle">
                <PipMascot mood="cheering" size={120} />
                <div className="bg-white dark:bg-[#1B272D] px-3 py-1.5 rounded-xl border-2 border-gray-200 dark:border-[#2E383D] text-[11px] font-black shadow-md mt-1 text-center">
                  ¡Vamos! Let&apos;s go!
                </div>
              </div>
            )}

            {/* Mascot thinking next to Unit 2 */}
            {unitIdx === 1 && (
              <div className="hidden lg:block absolute -right-32 top-12">
                <PipMascot mood="thinking" size={115} />
                <div className="bg-white dark:bg-[#1B272D] px-3 py-1.5 rounded-xl border-2 border-gray-200 dark:border-[#2E383D] text-[11px] font-black shadow-md mt-1 text-center">
                  Unit 2 Challenges!
                </div>
              </div>
            )}

            {/* Skill Nodes Container */}
            <div className="flex flex-col items-center gap-6 relative z-10">
              {unit.skills.map((skill, skillIdx) => {
                const offsetClass = offsetClasses[skillIdx % offsetClasses.length];
                return (
                  <div
                    key={skill.id}
                    className={`transition-transform duration-300 ${offsetClass}`}
                  >
                    <SkillNode
                      skill={skill}
                      unitColor={unit.theme_color}
                      isUnitLocked={unit.is_locked}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
