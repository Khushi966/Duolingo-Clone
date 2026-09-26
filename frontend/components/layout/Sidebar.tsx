"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Trophy,
  User as UserIcon,
  Mic,
  Crown,
  Users,
  Sparkles,
} from "lucide-react";
import PipMascot from "../mascot/PipMascot";
import ComingSoonModal from "../modals/ComingSoonModal";

export default function Sidebar() {
  const pathname = usePathname();
  const [modalFeature, setModalFeature] = useState<{
    isOpen: boolean;
    title: string;
    desc: string;
    tag: string;
  }>({
    isOpen: false,
    title: "",
    desc: "",
    tag: "",
  });

  const openComingSoon = (title: string, desc: string, tag: string) => {
    setModalFeature({ isOpen: true, title, desc, tag });
  };

  const navItems = [
    {
      label: "LEARN",
      href: "/",
      icon: BookOpen,
      color: "text-[#58CC02]",
      activeColor: "bg-green-100 text-[#58CC02] border-[#58CC02]",
    },
    {
      label: "LEADERBOARDS",
      href: "/leaderboard",
      icon: Trophy,
      color: "text-[#FFC800]",
      activeColor: "bg-yellow-100 text-[#FFC800] border-[#FFC800]",
    },
    {
      label: "PROFILE",
      href: "/profile",
      icon: UserIcon,
      color: "text-[#1CB0F6]",
      activeColor: "bg-blue-100 text-[#1CB0F6] border-[#1CB0F6]",
    },
  ];

  return (
    <>
      <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 bg-white dark:bg-[#131F24] border-r-2 border-gray-200 dark:border-[#2E383D] p-4 select-none">
        {/* Brand Logo Header */}
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-3 mb-6 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <PipMascot mood="wave" size={44} />
          <div>
            <h1 className="text-2xl font-black tracking-tight text-[#58CC02] uppercase">
              Duolingo
            </h1>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">
              Web Clone
            </span>
          </div>
        </Link>

        {/* Navigation links */}
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl font-black text-sm tracking-wider uppercase transition-all ${
                  isActive
                    ? "bg-green-50 dark:bg-green-950/40 text-[#58CC02] border-2 border-[#58CC02] shadow-xs"
                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1B272D]"
                }`}
              >
                <Icon className={`w-6 h-6 ${isActive ? "text-[#58CC02]" : "text-gray-400"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          {/* Coming soon section dividers */}
          <div className="pt-4 pb-2">
            <div className="border-t border-gray-200 dark:border-[#2E383D] my-2" />
            <span className="text-[10px] font-black uppercase text-gray-400 px-4">
              Premium & Social
            </span>
          </div>

          {/* Speech Practice (Coming soon) */}
          <button
            onClick={() =>
              openComingSoon(
                "Speech & Pronunciation",
                "Interactive AI microphone speech recognition and phonetic grading are currently under active development.",
                "Speech Lab"
              )
            }
            className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1B272D] font-black text-sm tracking-wider uppercase transition-colors"
          >
            <div className="flex items-center gap-4">
              <Mic className="w-6 h-6 text-purple-400" />
              <span>Speech</span>
            </div>
            <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-500">
              SOON
            </span>
          </button>

          {/* Super Subscription (Coming soon) */}
          <button
            onClick={() =>
              openComingSoon(
                "Super Duolingo",
                "Unlimited hearts, personalized mistakes review, and legendary challenge skips will be available with Super.",
                "Premium Tier"
              )
            }
            className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1B272D] font-black text-sm tracking-wider uppercase transition-colors"
          >
            <div className="flex items-center gap-4">
              <Crown className="w-6 h-6 text-[#FF9600]" />
              <span>Super</span>
            </div>
            <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-orange-100 dark:bg-orange-950 text-[#FF9600]">
              VIP
            </span>
          </button>

          {/* Friends & Quests (Coming soon) */}
          <button
            onClick={() =>
              openComingSoon(
                "Friends & Friend Quests",
                "Compete with friends, share weekly quest progress, and exchange XP gifts!",
                "Social Network"
              )
            }
            className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1B272D] font-black text-sm tracking-wider uppercase transition-colors"
          >
            <div className="flex items-center gap-4">
              <Users className="w-6 h-6 text-blue-400" />
              <span>Friends</span>
            </div>
            <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-[#1CB0F6]">
              SOON
            </span>
          </button>
        </nav>

        {/* Mascot Banner in Footer */}
        <div className="mt-auto p-3 rounded-2xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900/50 flex items-center gap-3">
          <PipMascot mood="happy" size={48} />
          <div>
            <p className="text-xs font-black text-[#46A302] dark:text-[#58CC02]">
              Pip says:
            </p>
            <p className="text-[11px] text-gray-600 dark:text-gray-300 font-bold leading-tight">
              ¡Sigue practicando! (Keep practicing!)
            </p>
          </div>
        </div>
      </aside>

      <ComingSoonModal
        isOpen={modalFeature.isOpen}
        onClose={() => setModalFeature({ ...modalFeature, isOpen: false })}
        title={modalFeature.title}
        description={modalFeature.desc}
        tag={modalFeature.tag}
      />
    </>
  );
}
