'use client';

import { useStats } from '@/hooks/useStats';
import { StatsGrid } from '@/components/stats/StatsGrid';
import { ProgressBars } from '@/components/stats/ProgressBars';
import { ActivityChart } from '@/components/stats/ActivityChart';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { getAchievements } from '@/lib/husoon/achievements';

export default function StatsPage() {
  const { data: stats, isLoading } = useStats();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-6 bg-background">
        <h2 className="text-xl font-bold font-serif text-primary">لا توجد بيانات كافية لعرض الإحصائيات</h2>
        <p className="text-on-surface-variant font-sans mt-2">ابدأ بإنجاز المهام اليوم لتظهر لك الأرقام</p>
        <Button className="mt-6" onClick={() => router.push('/')}>العودة للرئيسية</Button>
      </div>
    );
  }

  // Dynamic achievements based on actual stats
  const ranges = stats.memorizedRanges || [];
  const juzCount = stats.memorizedJuz.length;

  const ACHIEVEMENTS = getAchievements(ranges, juzCount, stats.pagesDone, stats.streakCount);

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto max-w-7xl pt-12 px-6 pb-24">
        
        {/* Header Section */}
        <header className="mb-12">
          <h2 className="font-serif text-4xl font-bold text-primary mb-2">إحصائيات الإنجاز</h2>
          <p className="font-sans text-on-surface-variant max-w-2xl">
            تتبع رحلتك في رحاب القرآن الكريم، واصل الثبات والمراجعة لتحقيق أهدافك الإيمانية.
          </p>
        </header>

        {/* Stats Grid (Bento Style) */}
        <StatsGrid stats={stats} />

        {/* Activity Chart & Progress Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ActivityChart logs={stats.logs} />
          </div>
          <div>
            <ProgressBars pagesDone={stats.pagesDone} memorizedRanges={ranges} />
          </div>
        </section>

        {/* Achievements Bento — Dynamic */}
        <section className="mt-12">
          <h4 className="font-serif text-2xl font-bold text-primary mb-6">الأوسمة والجوائز</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {ACHIEVEMENTS.map((achieve, i) => (
              <div 
                key={i} 
                className={`aspect-square bg-white rounded-xl flex flex-col items-center justify-center p-4 shadow-sm shadow-emerald-900/5 group border border-surface-container-high transition-all 
                  ${achieve.active ? '' : 'opacity-50 grayscale hover:grayscale-0 hover:opacity-100'}`}
              >
                <div className={`h-16 w-16 rounded-full flex items-center justify-center mb-3 transition-transform ${achieve.active ? 'group-hover:scale-110' : ''} ${achieve.color}`}>
                  <achieve.icon className="w-8 h-8" />
                </div>
                <span className={`font-sans text-[10px] text-center font-bold ${achieve.active ? 'text-primary' : 'text-on-surface-variant'}`}>
                  {achieve.name}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Mushaf Progress Card */}
        <section className="mt-12 bg-white rounded-xl overflow-hidden relative border border-surface-container-high shadow-sm shadow-emerald-900/5">
          <div className="absolute right-0 top-0 bottom-0 w-2 bg-secondary"></div>
          <div className="flex flex-col md:flex-row items-center p-8 gap-8">
            <div className="flex-1">
              <h4 className="font-serif text-2xl font-bold text-primary mb-2">رحلة الختمة الحالية</h4>
              <p className="font-sans text-sm text-on-surface-variant mb-6">
                استمر في القراءة كل يوم. الموعد المتوقع للإتمام: {format(stats.estimatedCompletion, 'dd MMMM yyyy', { locale: ar })}
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => router.push('/')}
                  className="px-6 py-2 rounded-lg bg-primary text-emerald-50 font-sans text-sm font-bold hover:bg-primary/90 transition-colors"
                >
                  متابعة الورد
                </button>
                <button 
                  onClick={() => router.push('/settings')}
                  className="px-6 py-2 rounded-lg bg-surface-container text-primary font-sans text-sm font-bold hover:bg-surface-container-high transition-colors"
                >
                  تعديل الخطة
                </button>
              </div>
            </div>
            <div className="shrink-0 w-48 h-32 bg-surface-container-low rounded-lg flex flex-col items-center justify-center border border-dashed border-outline-variant">
              <span className="font-serif text-3xl font-bold text-primary">{stats.remainingPages}</span>
              <span className="font-sans text-xs text-on-surface-variant">صفحة متبقية</span>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
