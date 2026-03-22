'use client';

import { calculateFarReviewSchedule } from '@/lib/husoon/calculator';
import { UserProgress } from '@/lib/husoon/types';
import { getReferenceFromPageRange, getReferenceLabel } from '@/lib/quran/metadata';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { ar } from 'date-fns/locale';

interface WeekViewProps {
  progress: UserProgress;
}

export function WeekView({ progress }: WeekViewProps) {
  const farSchedule = calculateFarReviewSchedule(progress);
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 6 });

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(weekStart, i);
    const dayOfWeek = date.getDay();
    const farReview = farSchedule.find((s) => s.dayOfWeek === dayOfWeek);
    return { date, dayOfWeek, farReview };
  });

  return (
    <>
      {weekDays.map(({ date, farReview }) => {
        const isToday = isSameDay(date, today);
        const hasReview = !!farReview;

        if (isToday) {
          return (
            <div key={date.toISOString()} className="bg-surface-container-lowest p-6 rounded-2xl flex flex-col items-center gap-3 ring-2 ring-primary/10 border-b-4 border-secondary shadow-xl shadow-primary/5 scale-[1.02] z-10 transition-transform md:col-span-1 col-span-2">
              <span className="font-sans text-xs text-secondary font-bold">{format(date, 'EEEE', { locale: ar })} (اليوم)</span>
              <span className="font-serif text-2xl font-bold text-primary">{format(date, 'd')}</span>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-secondary"></div>
                {hasReview && <div className="w-2 h-2 rounded-full bg-secondary/30"></div>}
              </div>
              <div className="mt-2 text-center">
                <p className="text-[10px] font-sans font-bold text-primary">تثبيت جديد</p>
                {hasReview && <p className="text-[10px] font-sans text-on-surface-variant">مع مراجعة بعيد</p>}
              </div>
            </div>
          );
        }

        return (
          <div key={date.toISOString()} className="bg-surface-container-low p-6 rounded-2xl flex flex-col items-center gap-3 group hover:bg-surface-container-lowest transition-all duration-300">
            <span className="font-sans text-xs text-on-surface-variant opacity-60">
              {format(date, 'EEEE', { locale: ar })}
            </span>
            <span className="font-serif text-2xl font-bold text-primary">
              {format(date, 'd')}
            </span>
            <div className={`w-2 h-2 rounded-full ${hasReview ? 'bg-secondary' : 'bg-primary/20'}`}></div>
            <div className="mt-2 text-center h-8 flex flex-col justify-center">
              {hasReview ? (
                <>
                  <p className="text-[10px] font-sans font-bold text-primary">مراجعة بعيد</p>
                  <p className="text-[10px] font-sans text-on-surface-variant">
                    {getReferenceLabel(getReferenceFromPageRange(farReview.pages.from, farReview.pages.to))}
                  </p>
                </>
              ) : (
                <p className="text-[10px] font-sans font-bold text-primary">تثبيت أسبوعي</p>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
}
