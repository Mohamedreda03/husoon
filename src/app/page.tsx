"use client";

import { useTodayPlan } from "@/hooks/useTodayPlan";
import { useDailyLog } from "@/hooks/useDailyLog";
import { TodayCard } from "@/components/dashboard/TodayCard";
import { FortressGrid } from "@/components/dashboard/FortressGrid";
import { TaskList } from "@/components/dashboard/TaskList";
import { useUser } from "@/hooks/useUser";
import { useState } from "react";
import { updateUserProfile } from "@/lib/appwrite/database";
import { toast } from "sonner";
import Link from "next/link";
import { getDailyHadith } from "@/data/tips";
import { parseMemorizedRanges, getTotalMemorizedPages } from "@/lib/husoon/memorization";
import { estimateCompletionDate } from "@/lib/husoon/calculator";
import { getPagesPerDayFromGoalType, DailyGoalType, UserProgress } from "@/lib/husoon/types";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

export default function DashboardPage() {
  const { plan, profile, isLoading: isPlanLoading } = useTodayPlan();
  const { log, toggleTask, isLoading: isLogLoading } = useDailyLog();
  const { logout } = useUser();
  const [isFinishing, setIsFinishing] = useState(false);

  const completedTaskIds = log?.tasksCompleted || [];
  const isDayDone = plan?.tasks.every((t) => completedTaskIds.includes(t.id));

  // Dynamic data from profile
  const ranges = profile ? parseMemorizedRanges(profile.memorizedRanges) : [];
  const totalMemorized = getTotalMemorizedPages(ranges);
  const goalType = (profile?.dailyGoalType as DailyGoalType) || 'page';
  const pagesPerDay = getPagesPerDayFromGoalType(goalType);

  // Estimated completion
  const estimatedCompletion = profile ? (() => {
    const progress: UserProgress = {
      memorizedRanges: ranges,
      dailyGoalType: goalType,
      dailyGoalValue: profile.dailyGoalValue || 1,
      pagesDone: totalMemorized,
      pagesPerDay,
      startPage: profile.startPage || 1,
    };
    return estimateCompletionDate(progress);
  })() : null;

  // Daily hadith
  const dailyHadith = getDailyHadith();

  const handleFinishDay = async () => {
    if (!profile) return;
    setIsFinishing(true);
    try {
      await updateUserProfile(profile.$id, {
        pagesDone: totalMemorized + pagesPerDay,
        streakCount: (profile.streakCount || 0) + 1,
        lastActiveDate: new Date().toISOString(),
      });
      toast.success("مبارك! تم تسجيل إنجاز اليوم بنجاح 🎊");
    } catch {
      toast.error("حدث خطأ أثناء تحديث البيانات");
    } finally {
      setIsFinishing(false);
    }
  };

  if (isPlanLoading || isLogLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-primary font-serif animate-pulse">
            جاري تحميل خطتك اليومية...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20 px-4 md:px-12 space-y-12 max-w-7xl mx-auto">
      {/* Spiritual Quote Section — Dynamic */}
      <section className="max-w-4xl mx-auto text-center space-y-4 py-8">
        <h2 className="font-serif text-3xl md:text-4xl text-primary leading-relaxed italic">
          &quot;{dailyHadith.text}&quot;
        </h2>
        <p className="font-sans text-secondary font-medium">— {dailyHadith.source}</p>
      </section>

      {/* Today Summary & Task Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <TodayCard 
            currentPage={plan?.currentPage || 0}
            completedTasks={completedTaskIds.length}
            totalTasks={plan?.tasks.length || 0}
            onFinishDay={handleFinishDay}
            isDayDone={isDayDone}
            isFinishing={isFinishing}
          />
        </div>
        <div className="lg:col-span-4">
          <TaskList
            tasks={plan?.tasks || []}
            completedTaskIds={completedTaskIds}
            onToggleTask={toggleTask}
          />
        </div>
      </div>

      {/* Fortress Grid — Dynamic */}
      <FortressGrid 
        tasks={plan?.tasks || []} 
        completedTaskIds={completedTaskIds}
        totalMemorized={totalMemorized}
        dailyGoalType={goalType}
      />

      {/* Bottom CTA Section — Dynamic */}
      <section className="bg-emerald-950 rounded-[2.5rem] p-8 md:p-12 text-center space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-800/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-600/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        <div className="relative space-y-4">
          <h2 className="font-serif text-3xl md:text-4xl text-emerald-100">
            {isDayDone ? 'أحسنت! أتممت ورد اليوم 🎉' : 'هل أنت مستعد لمراجعة اليوم؟'}
          </h2>
          <p className="text-emerald-300/70 max-w-xl mx-auto font-sans">
            {totalMemorized >= 604 
              ? 'ما شاء الله! أتممت حفظ القرآن كاملاً. حافظ على المراجعة الدائمة.'
              : estimatedCompletion 
                ? `الموعد المتوقع لإتمام الحفظ: ${format(estimatedCompletion, 'dd MMMM yyyy', { locale: ar })}. استمر على هذا النهج!`
                : 'واصل الثبات والمراجعة لتحقيق أهدافك الإيمانية.'
            }
          </p>
        </div>
        <div className="relative flex flex-col md:flex-row justify-center gap-4">
          <button 
            disabled={!isDayDone || isFinishing}
            onClick={handleFinishDay}
            className="bg-amber-500 text-emerald-950 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-amber-400 transition-all shadow-xl shadow-amber-900/20 disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto">
            {isFinishing ? "جاري التسجيل..." : "تسجيل حفظ اليوم"}
          </button>
          <Link href="/schedule" className="bg-emerald-900/50 text-emerald-100 border border-emerald-800 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-emerald-800 transition-all text-center w-full md:w-auto">
            عرض الخطة الأسبوعية
          </Link>
        </div>
      </section>
    </div>
  );
}
