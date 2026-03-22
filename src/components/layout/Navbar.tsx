'use client';

import { useUser } from '@/hooks/useUser';
import { usePathname } from 'next/navigation';
import { Bell, CalendarDays, LogOut } from 'lucide-react';
import { QuranSearch } from '@/components/quran/QuranSearch';

export function Navbar() {
  const { logout } = useUser();
  const pathname = usePathname();

  // Don't show navbar on auth pages
  if (pathname === '/login' || pathname === '/register' || pathname === '/onboarding') {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 md:right-64 h-20 bg-background/80 backdrop-blur-xl flex justify-between items-center px-4 md:px-12 z-40 border-b border-primary/5">
      <div className="bg-surface-container-low px-2 py-1 rounded-full w-full max-w-sm md:w-96">
        <QuranSearch variant="navbar" />
      </div>
      
      <div className="flex items-center gap-4 md:gap-6">
        <button className="relative text-primary hover:text-secondary transition-all">
          <Bell className="w-6 h-6" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-amber-500 rounded-full"></span>
        </button>
        <button className="text-primary hover:text-secondary transition-all hidden md:block">
          <CalendarDays className="w-6 h-6" />
        </button>
        <button className="text-primary hover:text-destructive transition-all" onClick={() => logout()} title="تسجيل الخروج">
          <LogOut className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
}
