'use client';

import { Card, CardContent } from '@/components/ui/card';
import { getPageInfo } from '@/data/quranPages';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface TodayCardProps {
  currentPage: number;
  completedTasks: number;
  totalTasks: number;
}

export function TodayCard({ currentPage, completedTasks, totalTasks }: TodayCardProps) {
  const pageInfo = getPageInfo(currentPage);
  const today = format(new Date(), 'EEEE, do MMMM', { locale: ar });
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/10 via-background to-accent/20">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-right space-y-2">
            <h2 className="text-muted-foreground font-medium">{today}</h2>
            <div className="flex items-baseline gap-2">
              <h1 className="text-4xl font-bold font-serif text-primary">صفحة {currentPage}</h1>
              <span className="text-secondary text-xl font-serif">سورة {pageInfo.surah}</span>
            </div>
            <p className="text-muted-foreground">الجزء {pageInfo.juz} • الحصن الخامس</p>
          </div>

          <div className="relative flex items-center justify-center w-32 h-32">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="58"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-muted/30"
              />
              <circle
                cx="64"
                cy="64"
                r="58"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeDasharray={364.4}
                strokeDashoffset={364.4 - (364.4 * progressPercent) / 100}
                strokeLinecap="round"
                className="text-primary transition-all duration-1000 ease-in-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-primary">{progressPercent}%</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">الإنجاز</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
