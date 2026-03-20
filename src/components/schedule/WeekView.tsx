'use client';

import { calculateFarReviewSchedule } from '@/lib/husoon/calculator';
import { UserProgress } from '@/lib/husoon/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { ar } from 'date-fns/locale';

interface WeekViewProps {
  progress: UserProgress;
}

export function WeekView({ progress }: WeekViewProps) {
  const farSchedule = calculateFarReviewSchedule(progress);
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 6 }); // Starts on Saturday

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(weekStart, i);
    const dayOfWeek = date.getDay();
    const farReview = farSchedule.find((s) => s.dayOfWeek === dayOfWeek);
    return { date, dayOfWeek, farReview };
  });

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold font-serif text-primary px-1">جدول الأسبوع</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
        {weekDays.map(({ date, farReview }) => {
          const isToday = isSameDay(date, today);
          return (
            <Card 
              key={date.toISOString()} 
              className={`transition-all duration-300 border-primary/10 ${
                isToday ? 'ring-2 ring-primary bg-primary/5 shadow-md' : 'bg-card'
              }`}
            >
              <CardContent className="p-3 flex flex-col items-center text-center gap-2">
                <span className={`text-xs font-medium ${isToday ? 'text-primary' : 'text-muted-foreground'}`}>
                  {format(date, 'EEEE', { locale: ar })}
                </span>
                <span className={`text-lg font-bold ${isToday ? 'text-primary' : 'text-foreground'}`}>
                  {format(date, 'd')}
                </span>
                {farReview ? (
                  <Badge variant="secondary" className="text-[10px] px-1 py-0 h-5 leading-none">
                    مراجعة بعيد
                  </Badge>
                ) : (
                  <div className="h-5" /> // Spacer
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
