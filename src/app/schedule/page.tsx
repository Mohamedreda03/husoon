'use client';

import { useUser } from '@/hooks/useUser';
import { useTodayPlan } from '@/hooks/useTodayPlan';
import { WeekView } from '@/components/schedule/WeekView';
import { PipelineTable } from '@/components/schedule/PipelineTable';
import { WeeklyPlan } from '@/components/schedule/WeeklyPlan';
import { Button } from '@/components/ui/button';
import { ChevronRight, CalendarDays } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SchedulePage() {
  const { user, isLoading: isUserLoading } = useUser();
  const { profile, isLoading: isProfileLoading } = useTodayPlan();
  const router = useRouter();

  if (isUserLoading || isProfileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  if (!profile) {
    router.push('/onboarding');
    return null;
  }

  const progress = {
    pagesDone: profile.pagesDone || 0,
    pagesPerDay: profile.pagesPerDay || 1,
    startPage: profile.startPage || 3,
  };

  return (
    <div className="min-h-screen bg-background pb-12">
      <main className="container mx-auto px-4 mt-8 space-y-10 max-w-5xl">
        <section className="space-y-6">
          <WeekView progress={progress} />
        </section>

        <section className="space-y-6">
          <h3 className="text-xl font-bold font-serif text-primary px-1">خطة الحفظ والمراجعة</h3>
          <WeeklyPlan progress={progress} />
        </section>

        <section className="space-y-6 pb-6">
          <h3 className="text-xl font-bold font-serif text-primary px-1">توزيع مراجعة البعيد</h3>
          <PipelineTable progress={progress} />
          <p className="text-xs text-muted-foreground text-center px-4 leading-relaxed max-w-2xl mx-auto">
            يتم توزيع صفحات مراجعة البعيد (الصفحات المحفوظة سابقاً بعد استبعاد آخر 20 صفحة) على أيام الأسبوع بحد أقصى جزأين (40 صفحة) يومياً لضمان تثبيت الحفظ القديم.
          </p>
        </section>
      </main>
    </div>
  );
}
