'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CalendarDays, EyeOff, TrendingUp, Settings } from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { useTodayPlan } from '@/hooks/useTodayPlan';

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const { profile } = useTodayPlan();

  // Hide sidebar on auth/onboarding pages
  if (pathname === '/login' || pathname === '/register' || pathname === '/onboarding') {
    return null;
  }

  const navItems = [
    { name: 'لوحة التحكم', href: '/', icon: LayoutDashboard },
    { name: 'الجدول الزمني', href: '/schedule', icon: CalendarDays },
    { name: 'وضع التركيز', href: '/timer', icon: EyeOff },
    { name: 'الإحصائيات', href: '/stats', icon: TrendingUp },
    { name: 'الإعدادات', href: '/settings', icon: Settings },
  ];

  return (
    <aside className="hidden md:flex h-screen w-64 fixed right-0 top-0 border-l-0 shadow-none bg-emerald-950 flex-col py-8 space-y-2 rtl z-50">
      <div className="px-6 mb-8">
        <h1 className="text-3xl font-bold text-emerald-100 font-serif">حسون</h1>
        <p className="text-emerald-200/60 text-xs mt-1">تحفيظ القرآن الكريم</p>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-row items-center gap-3 px-6 py-3 transition-colors duration-200 ${
                isActive
                  ? 'bg-emerald-800/50 text-emerald-100 font-bold border-r-4 border-amber-400 translate-x-1'
                  : 'text-emerald-200/70 hover:bg-emerald-800/30 hover:text-emerald-100'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-6 mt-auto">
        <Link href="/">
          <button className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold rounded-xl transition-all flex items-center justify-center gap-2">
            <span>ابدأ المراجعة</span>
          </button>
        </Link>
        
        <div className="mt-6 flex items-center gap-3 py-4 border-t border-emerald-900/50">
          <div className="w-10 h-10 rounded-full bg-emerald-800 flex items-center justify-center text-emerald-100 font-bold">
            {user?.name?.charAt(0) || 'م'}
          </div>
          <div className="overflow-hidden">
            <p className="text-emerald-100 text-sm font-bold truncate">
              {user?.name || 'مستخدم'}
            </p>
            <p className="text-emerald-400 text-xs">
              {profile?.streakCount ? `متصل لـ ${profile.streakCount} أيام` : 'حافظ متقن'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
