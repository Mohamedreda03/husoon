"use client";

import { calculateFarReviewSchedule } from "@/lib/husoon/calculator";
import { UserProgress } from "@/lib/husoon/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, Clock, BookOpen } from "lucide-react";

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
    <Card className="border-primary/10 shadow-sm overflow-hidden">
      <CardHeader className="bg-primary/5 py-4 border-b border-primary/10">
        <CardTitle className="text-lg font-serif font-bold text-primary flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          جدول الأنابيب (مراجعة البعيد)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-muted/30 border-b border-primary/5 text-xs text-muted-foreground font-bold">
                <th className="px-4 py-3">اليوم</th>
                <th className="px-4 py-3">الصفحات</th>
                <th className="px-4 py-3 text-center">العدد</th>
                <th className="px-4 py-3 text-center">الوقت التقديري</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {farSchedule.map((item, index) => {
                const isToday = item.dayOfWeek === todayDayOfWeek;
                return (
                  <tr
                    key={index}
                    className={`border-b border-primary/5 last:border-0 transition-colors ${
                      isToday ? "bg-primary/10 font-bold" : "hover:bg-muted/20"
                    }`}
                  >
                    <td className="px-4 py-4 flex items-center gap-2">
                      {item.dayName}
                      {isToday && (
                        <span className="text-[10px] bg-primary text-primary-foreground px-1 rounded">
                          اليوم
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 font-mono dir-ltr text-left">
                      ص {item.pages.from} - {item.pages.to}
                    </td>
                    <td className="px-4 py-4 text-center">{item.count}</td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {item.estimatedMinutes} د
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
