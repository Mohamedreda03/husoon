'use client';

import { Progress } from '@/components/ui/progress';

interface ProgressBarsProps {
  pagesDone: number;
}

export function ProgressBars({ pagesDone }: ProgressBarsProps) {
  const sections = [
    { name: 'العشرة الأولى', pages: 200, range: 'الجزء 1 - 10' },
    { name: 'العشرة الثانية', pages: 200, range: 'الجزء 11 - 20' },
    { name: 'العشرة الثالثة', pages: 204, range: 'الجزء 21 - 30' },
  ];

  let remainingPages = pagesDone;

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold font-serif text-primary px-1">تقدم الأجزاء</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sections.map((section, index) => {
          const currentProgress = Math.min(section.pages, remainingPages);
          const percentage = Math.round((currentProgress / section.pages) * 100);
          remainingPages = Math.max(0, remainingPages - section.pages);

          return (
            <div key={index} className="space-y-3 bg-card p-4 rounded-2xl border border-primary/10">
              <div className="flex justify-between items-end">
                <div className="text-right">
                  <h4 className="font-bold text-sm">{section.name}</h4>
                  <p className="text-[10px] text-muted-foreground">{section.range}</p>
                </div>
                <span className="text-lg font-bold font-serif text-primary">{percentage}%</span>
              </div>
              <Progress value={percentage} className="h-2 bg-primary/10" />
              <p className="text-[10px] text-muted-foreground text-center">
                تم حفظ {currentProgress} من {section.pages} صفحة
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
