"use client";

import { UserProgress } from "@/lib/husoon/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, ChevronLeft, Flag } from "lucide-react";
import { format, addDays } from "date-fns";
import { ar } from "date-fns/locale";

interface WeeklyPlanProps {
  progress: UserProgress;
}

export function WeeklyPlan({ progress }: WeeklyPlanProps) {
  const currentPage = progress.startPage + progress.pagesDone;
  const today = new Date();

  const nextWeekPages = Array.from({ length: 7 }, (_, i) => {
    const pageNum = currentPage + Math.floor(i * progress.pagesPerDay);
    const date = addDays(today, i);
    return { date, pageNum };
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="border-primary/10 shadow-sm p-0">
        <CardHeader className="bg-secondary/5 py-4 border-b border-primary/5">
          <CardTitle className="text-lg font-serif font-bold text-secondary flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            خطة الحفظ للأيام القادمة
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-4">
            {nextWeekPages.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b border-primary/5 last:border-0 pb-3 last:pb-0"
              >
                <div className="flex flex-col text-right">
                  <span className="text-sm font-medium">
                    {index === 0
                      ? "اليوم"
                      : format(item.date, "EEEE", { locale: ar })}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {format(item.date, "d MMMM", { locale: ar })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="font-mono text-primary border-primary/20"
                  >
                    صفحة {item.pageNum}
                  </Badge>
                  <ChevronLeft className="w-4 h-4 text-muted/30" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/10 shadow-sm bg-primary/5 border-dashed p-0">
        <CardHeader className="py-4 border-b border-primary/5">
          <CardTitle className="text-lg font-serif font-bold text-primary flex items-center gap-2">
            <Flag className="w-5 h-5" />
            أهداف المراجعة (الحصن 2)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-6">
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-secondary">
              التحضير الأسبوعي
            </h4>
            <div className="p-3 bg-white rounded-xl border border-primary/5">
              <p className="text-xs text-muted-foreground leading-relaxed">
                اقرأ 7 صفحات القادمة (من {currentPage + 1} إلى {currentPage + 7}
                ) مرة واحدة يومياً استماعاً أو نظراً لتسهيل حفظها.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold text-secondary">التحضير الليلي</h4>
            <div className="p-3 bg-white rounded-xl border border-primary/5">
              <p className="text-xs text-muted-foreground leading-relaxed">
                استمع لصفحة الغد (صفحة {currentPage + 1}) بتركيز تام لمدة 15
                دقيقة قبل النوم.
              </p>
            </div>
          </div>

          <div className="pt-2 text-center">
            <p className="text-[10px] text-muted-foreground italic">
              &quot;قليل مستمر خير من كثير منقطع&quot;
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
