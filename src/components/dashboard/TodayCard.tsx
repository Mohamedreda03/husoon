'use client';

import { ReferenceBadge } from '@/components/quran/ReferenceBadge';
import { getPageInfo } from '@/data/quranPages';
import { getReferenceFromPageRange } from '@/lib/quran/metadata';
import { CheckCircle2 } from 'lucide-react';

interface TodayCardProps {
  currentPage: number;
  completedTasks: number;
  totalTasks: number;
  onFinishDay?: () => void;
  isDayDone?: boolean;
  isFinishing?: boolean;
}

export function TodayCard({ currentPage, completedTasks, totalTasks, onFinishDay, isDayDone, isFinishing }: TodayCardProps) {
  const pageInfo = getPageInfo(currentPage);
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const todayReference = currentPage > 0 ? getReferenceFromPageRange(currentPage, currentPage) : undefined;

  return (
    <div className="bg-surface-container-low rounded-3xl p-8 h-full relative overflow-hidden group border border-primary/10 shadow-sm">
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg className="w-full h-full scale-150" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path d="M44.7,-76.4C58.1,-69.2,69.2,-58.1,76.4,-44.7C83.7,-31.3,87.1,-15.6,85.5,-0.9C83.9,13.8,77.3,27.5,68,39.3C58.7,51,46.7,60.8,33.3,67.3C19.9,73.8,5.1,77, -10.1,75.4C-25.3,73.8,-40.8,67.4,-53.4,57.1C-66,46.8,-75.7,32.6,-79.8,17.2C-83.9,1.8,-82.4,-14.8,-75.1,-29.1C-67.8,-43.4,-54.7,-55.4,-40.6,-62.3C-26.5,-69.2,-13.2,-71,-0.1,-70.8C13,-70.6,26.1,-68.4,44.7,-76.4Z" fill="currentColor" className="text-primary" transform="translate(100 100)"></path>
        </svg>
      </div>
      <div className="relative flex flex-col md:flex-row justify-between items-start md:items-end h-full gap-6">
        <div className="space-y-6 flex-1 w-full">
          <div className="space-y-1">
            <span className="text-secondary font-bold text-sm tracking-widest uppercase">اليوم</span>
            <h3 className="text-3xl font-serif font-bold text-primary">المراجعة الحالية: صفحة {currentPage}</h3>
            <ReferenceBadge reference={todayReference} title="المراجعة الحالية" className="mt-3" />
          </div>
          <div className="flex flex-wrap items-center gap-8">
            <div className="space-y-1">
              <p className="text-muted-foreground text-xs font-medium">التقدم اليومي</p>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
                </div>
                <span className="text-primary font-bold text-sm">{completedTasks}/{totalTasks} مهام</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-xs font-medium">سورة {pageInfo.surah}</p>
              <p className="text-primary font-bold text-sm">الجزء {pageInfo.juz}</p>
            </div>
          </div>
        </div>
        <button
          disabled={!isDayDone || isFinishing}
          onClick={onFinishDay}
          className={`px-8 py-4 shrink-0 rounded-xl font-bold flex items-center justify-center gap-2 transition-all w-full md:w-auto
            ${isDayDone
              ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20'
              : 'bg-muted text-muted-foreground cursor-not-allowed border'
            }`}
        >
          <span>{isFinishing ? 'جاري التسجيل...' : 'أتممت اليوم'}</span>
          <CheckCircle2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
