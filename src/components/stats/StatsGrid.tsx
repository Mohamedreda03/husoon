'use client';

import { Flame, BookOpen, CheckCircle } from 'lucide-react';

interface StatsGridProps {
  stats: {
    pagesDone: number;
    remainingPages: number;
    completionPercentage: number;
    estimatedCompletion: Date;
    totalMinutes: number;
    totalTasks: number;
    streakCount: number;
    totalJuz: number;
  };
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      {/* Streak Card */}
      <div className="bg-surface-container-low p-8 rounded-xl flex flex-col justify-between relative overflow-hidden group border border-surface-container-high">
        <div className="absolute -left-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <Flame className="w-48 h-48 text-primary" />
        </div>
        <div className="flex items-start justify-between relative z-10">
          <div>
            <p className="font-sans text-sm text-secondary font-bold mb-1">الاستمرارية</p>
            <h3 className="font-serif text-5xl font-bold text-primary">{stats.streakCount} <span className="text-xl font-sans">يوماً</span></h3>
          </div>
          <div className="h-12 w-12 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-container">
            <Flame className="w-6 h-6" />
          </div>
        </div>
        <div className="mt-8 relative z-10">
          <div className="flex items-center gap-2 text-xs font-sans text-emerald-800">
            أفضل رقم قياسي لك!
          </div>
        </div>
      </div>
      
      {/* Pages Card */}
      <div className="bg-surface-container-low p-8 rounded-xl flex flex-col justify-between relative overflow-hidden group border border-surface-container-high">
        <div className="absolute -left-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <BookOpen className="w-48 h-48 text-primary" />
        </div>
        <div className="flex items-start justify-between relative z-10">
          <div>
            <p className="font-sans text-sm text-primary font-bold mb-1">إجمالي الصفحات</p>
            <h3 className="font-serif text-5xl font-bold text-primary">{stats.pagesDone} <span className="text-xl font-sans">صفحة</span></h3>
          </div>
          <div className="h-12 w-12 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed-variant">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>
        <div className="mt-8 relative z-10">
          <div className="flex items-center gap-2 text-xs font-sans text-primary">
            تذكر: من قرأ حرفا فله عشر حسنات
          </div>
        </div>
      </div>
      
      {/* Completion Rate */}
      <div className="bg-primary text-emerald-50 p-8 rounded-xl flex flex-col justify-between relative overflow-hidden group shadow-xl shadow-emerald-950/20 w-full">
        <div className="absolute right-0 bottom-0 w-32 h-32 bg-primary-container rounded-full blur-3xl opacity-50"></div>
        <div className="flex items-start justify-between relative z-10">
          <div>
            <p className="font-sans text-sm text-primary-fixed font-bold mb-1">نسبة الإنجاز الكلي</p>
            <h3 className="font-serif text-5xl font-bold text-white">{stats.completionPercentage}%</h3>
          </div>
          <div className="h-12 w-12 rounded-full bg-emerald-800/50 backdrop-blur-md flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>
        <div className="mt-8 relative z-10">
          <div className="w-full bg-primary-container h-1.5 rounded-full overflow-hidden">
            <div className="bg-secondary-fixed-dim h-full" style={{ width: `${stats.completionPercentage}%` }}></div>
          </div>
          <p className="text-[10px] mt-2 font-sans opacity-70">متبقي {Math.ceil(stats.remainingPages / 20)} أجزاء لختم القرآن الكريم</p>
        </div>
      </div>
    </section>
  );
}
