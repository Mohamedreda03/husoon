'use client';

import { useStats } from '@/hooks/useStats';
import { StatsGrid } from '@/components/stats/StatsGrid';
import { ProgressBars } from '@/components/stats/ProgressBars';
import { ActivityChart } from '@/components/stats/ActivityChart';
import { Button } from '@/components/ui/button';
import { ChevronRight, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
        <h2 className="text-xl font-bold text-primary">لا توجد بيانات كافية لعرض الإحصائيات</h2>
        <p className="text-muted-foreground mt-2">ابدأ بإنجاز المهام اليوم لتظهر لك الأرقام</p>
        <Button className="mt-6" onClick={() => router.push('/')}>العودة للرئيسية</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      <main className="container mx-auto px-4 mt-8 space-y-10 max-w-6xl">
        <section>
          <StatsGrid stats={stats} />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2">
            <ActivityChart logs={stats.logs} />
          </div>
          
          <div className="bg-primary/5 rounded-3xl p-8 border border-primary/10 flex flex-col items-center text-center justify-center space-y-4">
            <div className="w-24 h-24 rounded-full bg-white border-4 border-primary/20 flex items-center justify-center shadow-inner">
              <span className="text-4xl font-bold font-serif text-primary">{stats.completionPercentage}%</span>
            </div>
            <div>
              <h3 className="text-xl font-bold font-serif text-primary">إجمالي الإتمام</h3>
              <p className="text-sm text-muted-foreground mt-1">
                تبقت لك {stats.remainingPages} صفحة فقط للوصول إلى هدفك العظيم بختم القرآن الكريم.
              </p>
            </div>
            <div className="pt-2">
              <span className="text-xs bg-secondary/10 text-secondary px-3 py-1 rounded-full border border-secondary/20 font-bold uppercase tracking-wider">
                أنت تبلي بلاءً حسناً!
              </span>
            </div>
          </div>
        </section>

        <section>
          <ProgressBars pagesDone={stats.pagesDone} />
        </section>
      </main>
    </div>
  );
}
