"use client";

import { calculateFarReviewSchedule } from "@/lib/husoon/calculator";
import { UserProgress } from "@/lib/husoon/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, History } from "lucide-react";

interface PipelineTableProps {
  progress: UserProgress;
}

export function PipelineTable({ progress }: PipelineTableProps) {
  const farSchedule = calculateFarReviewSchedule(progress);
  const todayDayOfWeek = new Date().getDay();

  if (progress.pagesDone <= 20) {
    return (
      <Alert className="bg-primary/5 border-primary/20">
        <Info className="h-4 w-4 text-primary" />
        <AlertTitle className="text-primary font-bold">
          مراجعة البعيد لم تبدأ بعد
        </AlertTitle>
        <AlertDescription className="text-muted-foreground">
          ستبدأ مراجعة البعيد تلقائياً بعد حفظ أول 20 صفحة. استمر في الحفظ لتبدأ
          في بناء &quot;حصن مراجعة البعيد&quot;.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <History className="text-secondary w-6 h-6" />
          <h3 className="font-serif text-2xl font-bold text-primary">جدول مراجعة البعيد</h3>
        </div>
        <span className="px-3 py-1 bg-secondary-container text-on-secondary-container text-[10px] font-bold rounded-full uppercase tracking-wider">الأولوية القصوى</span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-right">
          <thead>
            <tr className="text-on-surface-variant/60 font-sans text-xs">
              <th className="pb-4 font-medium px-2">اليوم</th>
              <th className="pb-4 font-medium px-2">الصفحات</th>
              <th className="pb-4 font-medium px-2 text-center">العدد</th>
              <th className="pb-4 font-medium px-2 text-left">الوقت التقديري</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container-high/50 font-sans text-sm">
            {farSchedule.map((item, index) => {
              const isToday = item.dayOfWeek === todayDayOfWeek;
              // Add specific styling based on whether it is today
              
              return (
                <tr
                  key={index}
                  className={`group transition-colors ${
                    isToday ? "bg-surface-container-lowest/50 border-r-4 border-secondary" : "hover:bg-surface-container-highest/40"
                  }`}
                >
                  <td className="py-4 font-bold px-2">{item.dayName}</td>
                  <td className="py-4 px-2">
                    <span className="px-2 py-0.5 bg-surface-container-high rounded-full dir-ltr inline-block">
                      ص {item.pages.from} - {item.pages.to}
                    </span>
                  </td>
                  <td className="py-4 px-2 text-center">{item.count} صفحة</td>
                  <td className="py-4 px-2 text-left">
                    {isToday ? (
                      <button className="px-4 py-1.5 bg-secondary text-on-secondary rounded-lg text-xs font-bold shadow-md shadow-secondary/20 hover:scale-105 transition-transform">
                        بدء الآن
                      </button>
                    ) : (
                      <span className="text-on-surface-variant/40">{item.estimatedMinutes} دقيقة</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
