"use client";

import { useUser } from "@/hooks/useUser";
import { useTodayPlan } from "@/hooks/useTodayPlan";
import { WeekView } from "@/components/schedule/WeekView";
import { PipelineTable } from "@/components/schedule/PipelineTable";
import { WeeklyPlan } from "@/components/schedule/WeeklyPlan";
import { CalendarDays, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import {
  parseMemorizedRanges,
  getTotalMemorizedPages,
} from "@/lib/husoon/memorization";
import { getPagesPerDayFromGoalType, DailyGoalType } from "@/lib/husoon/types";

export default function SchedulePage() {
  const { user, isLoading: isUserLoading } = useUser();
  const { profile, isLoading: isProfileLoading } = useTodayPlan();
  const router = useRouter();

  useEffect(() => {
    if (isUserLoading || isProfileLoading) return;

    if (!user) {
      router.push("/login");
    } else if (!profile) {
      router.push("/onboarding");
    }
  }, [user, profile, isUserLoading, isProfileLoading, router]);

  if (isUserLoading || isProfileLoading || !user || !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const ranges = parseMemorizedRanges(profile.memorizedRanges);
  const totalMemorized = getTotalMemorizedPages(ranges);
  const goalType = (profile.dailyGoalType as DailyGoalType) || "page";
  const pagesPerDay = getPagesPerDayFromGoalType(goalType);

  const progress = {
    pagesDone: totalMemorized,
    pagesPerDay: pagesPerDay,
    startPage: profile.startPage || 1,
    memorizedRanges: ranges,
    dailyGoalType: goalType,
    dailyGoalValue: profile.dailyGoalValue || 1,
  };

  // Basic estimation of weekly completion based on current day of week
  const completionPercent = Math.round(((new Date().getDay() + 1) / 7) * 100);

  const handleCopySchedule = () => {
    // Generate text version of the weekly schedule
    const days = [
      "السبت",
      "الأحد",
      "الاثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس",
      "الجمعة",
    ];
    let text = "📅 جدول الحفظ الأسبوعي\n\n";
    days.forEach((day) => {
      text += `${day}: حفظ جديد + مراجعة\n`;
    });
    text += `\n📊 إجمالي الحفظ: ${totalMemorized} صفحة (${Math.round((totalMemorized / 604) * 100)}%)\n`;
    text += `⏱ المعدل اليومي: ${pagesPerDay} صفحة\n`;

    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success("تم نسخ الجدول إلى الحافظة 📋");
      })
      .catch(() => {
        toast.error("فشل في نسخ الجدول");
      });
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="py-12 px-6 md:px-12 min-h-screen">
        <div className="max-w-6xl mx-auto space-y-10">
          {/* Page Header */}
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="font-serif text-4xl text-primary font-bold">
                الجدول الزمني الأسبوعي
              </h2>
              <p className="font-sans text-on-surface-variant mt-2">
                خطة مراجعة وحفظ الأسبوع الحالي
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCopySchedule}
                className="bg-surface-container-low px-6 py-2 rounded-full font-sans text-sm text-primary font-medium flex items-center gap-2 hover:bg-surface-container-highest transition-colors"
              >
                📋 نسخ الجدول
              </button>
              <button
                onClick={() => router.push("/settings")}
                className="bg-primary text-on-primary px-6 py-2 rounded-full font-sans text-sm font-bold flex items-center gap-2 shadow-lg shadow-primary/20"
              >
                <CalendarDays className="w-4 h-4" />
                تعديل الخطة
              </button>
            </div>
          </header>

          {/* Section 1: Week View Visualization */}
          <section className="grid grid-cols-2 md:grid-cols-7 gap-4">
            <WeekView progress={progress} />
          </section>

          {/* Section 2: Weekly Strategy & Pipeline Table */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6 flex flex-col h-full">
              <WeeklyPlan
                progress={progress}
                completionPercent={completionPercent}
              />
            </div>
            <div className="lg:col-span-2 bg-surface-container-low p-8 rounded-3xl space-y-6">
              <PipelineTable progress={progress} />
            </div>
          </div>

          {/* Focus Mode Prompt Card */}
          <div className="relative bg-tertiary-container rounded-[2rem] p-10 overflow-hidden flex flex-col md:flex-row items-center gap-10 mt-12">
            <div className="relative z-10 space-y-4 md:w-2/3">
              <h3 className="font-serif text-3xl font-bold text-tertiary-fixed">
                هل أنت مستعد لجلسة تثبيت عميقة؟
              </h3>
              <p className="font-sans text-tertiary-fixed-dim text-lg leading-relaxed">
                قم بتفعيل وضع التركيز لإخفاء التنبيهات والتركيز التام على ورد
                اليوم.
              </p>
              <button
                onClick={() => router.push("/timer")}
                className="mt-4 px-8 py-3 bg-secondary-container text-on-secondary-container font-bold rounded-xl hover:bg-secondary-fixed transition-all shadow-xl shadow-black/20"
              >
                تفعيل وضع التركيز الآن
              </button>
            </div>
            <div className="md:w-1/3 flex justify-center relative">
              <div className="w-48 h-48 bg-secondary/20 rounded-full flex items-center justify-center animate-pulse">
                <EyeOff className="w-24 h-24 text-secondary-fixed-dim" />
              </div>
            </div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
          </div>
        </div>
      </main>
    </div>
  );
}
