"use client";

import { UserProgress } from "@/lib/husoon/types";
import { getNextPageToMemorize } from "@/lib/husoon/memorization";

interface WeeklyPlanProps {
  progress: UserProgress;
}

export function WeeklyPlan({ progress }: WeeklyPlanProps) {
  const currentPage = getNextPageToMemorize(
    progress.memorizedRanges,
    progress.startPage,
  );

  // Create strategy steps based on current progress
  const strategies = [
    {
      title: "التركيز على مراجعة البعيد",
      desc: "تقليل الأخطاء في المحفوظ القديم لضمان رسوخه",
    },
    {
      title: "التحضير الأسبوعي",
      desc: `اقرأ 7 صفحات القادمة (من ${currentPage + 1} إلى ${Math.min(604, currentPage + 7)}) مرة واحدة يومياً`,
    },
    {
      title: "التحضير الليلي",
      desc: `استمع لصفحة الغد (صفحة ${Math.min(604, currentPage + 1)}) بتركيز تام قبل النوم`,
    },
  ];

  return (
    <div className="bg-primary-container p-8 rounded-3xl text-on-primary-fixed-variant relative overflow-hidden h-full">
      <div className="absolute top-0 right-0 w-32 h-32 bg-secondary opacity-10 rounded-full -mr-10 -mt-10 blur-2xl"></div>

      <h3 className="font-serif text-2xl font-bold text-primary-fixed mb-6">
        استراتيجية الأسبوع
      </h3>

      <div className="space-y-6 relative z-10">
        {strategies.map((strategy, i) => (
          <div key={i} className="flex items-start gap-4">
            <span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-fixed font-bold shrink-0">
              {i + 1}
            </span>
            <div>
              <p className="font-sans font-bold text-sm text-surface">
                {strategy.title}
              </p>
              <p className="font-sans text-xs opacity-70 mt-1 text-surface">
                {strategy.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 pt-8 border-t border-primary-fixed/20">
        <div className="flex justify-between items-center mb-2">
          <span className="font-sans text-xs text-primary-fixed">
            مستوى الإنجاز الأسبوعي
          </span>
          <span className="font-sans text-xs font-bold text-primary-fixed">
            ٤٥٪
          </span>
        </div>
        <div className="w-full bg-primary/30 h-1.5 rounded-full overflow-hidden">
          <div className="bg-secondary-container h-full w-[45%]"></div>
        </div>
      </div>
    </div>
  );
}
