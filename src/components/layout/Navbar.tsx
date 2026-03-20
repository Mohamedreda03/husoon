'use client';

import Link from 'next/link';
import { useUser } from '@/hooks/useUser';
import { useTodayPlan } from '@/hooks/useTodayPlan';
import { Button } from '@/components/ui/button';
import { LogOut, Trophy, Timer, CalendarDays, TrendingUp, Settings } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function Navbar() {
  const { logout } = useUser();
  const { profile } = useTodayPlan();
  const pathname = usePathname();

  // Don't show navbar on auth pages
  if (pathname === '/login' || pathname === '/register' || pathname === '/onboarding') {
    return null;
  }

  const navItems = [
    { name: 'المؤقت', href: '/timer', icon: Timer },
    { name: 'الجدول', href: '/schedule', icon: CalendarDays },
    { name: 'التقدم', href: '/stats', icon: TrendingUp },
    { name: 'الإعدادات', href: '/settings', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-primary/10 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-serif font-bold group-hover:rotate-12 transition-transform">
              ح
            </div>
            <h1 className="text-xl font-bold font-serif text-primary hidden sm:block">الحصون الخمسة</h1>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link 
                key={item.href} 
                href={item.href} 
                className={`text-sm font-medium flex items-center gap-2 transition-colors ${
                  pathname === item.href ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-secondary/10 px-3 py-1.5 rounded-full border border-secondary/20">
            <Trophy className="w-4 h-4 text-secondary" />
            <span className="text-sm font-bold text-secondary">
              {profile?.streakCount || 0} يوم متواصل
            </span>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => logout()} 
            className="text-muted-foreground hover:text-destructive hidden sm:flex"
            title="تسجيل الخروج"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
