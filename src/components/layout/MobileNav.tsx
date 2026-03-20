'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Timer, CalendarDays, TrendingUp, Settings } from 'lucide-react';

export function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'اليوم', href: '/', icon: BookOpen },
    { name: 'المؤقت', href: '/timer', icon: Timer },
    { name: 'الجدول', href: '/schedule', icon: CalendarDays },
    { name: 'التقدم', href: '/stats', icon: TrendingUp },
    { name: 'الإعدادات', href: '/settings', icon: Settings },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t border-primary/10 px-4 h-16 safe-area-pb">
      <div className="flex items-center justify-between h-full max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 transition-all duration-200 ${
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-primary/70'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''}`} />
              <span className="text-[10px] font-bold">{item.name}</span>
              {isActive && (
                <span className="absolute -top-1 w-1 h-1 bg-primary rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
