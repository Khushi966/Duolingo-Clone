"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Trophy, User as UserIcon } from "lucide-react";

export default function MobileNav() {
  const pathname = usePathname();

  // Hide mobile nav during active lessons
  if (pathname.startsWith("/lesson/")) {
    return null;
  }

  const items = [
    { label: "Learn", href: "/", icon: BookOpen },
    { label: "Leagues", href: "/leaderboard", icon: Trophy },
    { label: "Profile", href: "/profile", icon: UserIcon },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#131F24]/95 backdrop-blur-md border-t-2 border-gray-200 dark:border-[#2E383D] px-6 py-2 flex justify-around items-center">
      {items.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 py-1 px-4 rounded-xl transition-all ${
              isActive
                ? "text-[#58CC02] font-black scale-105"
                : "text-gray-400 font-bold hover:text-gray-600 dark:hover:text-gray-300"
            }`}
          >
            <Icon className="w-6 h-6" />
            <span className="text-[11px] uppercase tracking-wider">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
