"use client";

import { useUser } from "@/hooks/useUser";
import { usePathname } from "next/navigation";
import { CalendarDays, LogOut } from "lucide-react";
import { QuranSearch } from "@/components/quran/QuranSearch";
import Link from "next/link";

export function Navbar() {
  const { logout } = useUser();
  const pathname = usePathname();

  // Don't show navbar on auth pages
  if (
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/onboarding"
  ) {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 md:right-64 h-20 bg-background/80 backdrop-blur-xl flex justify-between items-center px-4 md:px-12 z-40 border-b border-primary/5 gap-2">
      <div className="bg-surface-container-low px-2 py-1 rounded-full w-full max-w-[200px] xs:max-w-xs sm:max-w-sm md:w-96 transition-all duration-300">
        <QuranSearch variant="navbar" />
      </div>

      <div className="flex items-center gap-2 md:gap-6 shrink-0">
        <Link
          href="/schedule"
          className="text-primary hover:text-secondary transition-all"
          title="الجدول الزمني"
        >
          <CalendarDays className="w-6 h-6" />
        </Link>
        <button
          className="text-primary hover:text-destructive transition-all"
          onClick={() => logout()}
          title="تسجيل الخروج"
        >
          <LogOut className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
}
