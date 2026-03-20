'use client';

import { useTodayPlan } from '@/hooks/useTodayPlan';
import { useDailyLog } from '@/hooks/useDailyLog';
import { TimerDisplay } from '@/components/timer/TimerDisplay';
import { TaskSelector } from '@/components/timer/TaskSelector';
import { useTimerStore } from '@/stores/timerStore';
import { toast } from 'sonner';

export default function TimerPage() {
  const { plan, isLoading: isPlanLoading } = useTodayPlan();
  const { log, toggleTask, isLoading: isLogLoading } = useDailyLog();
  const { selectedTaskId, selectedTaskName, complete } = useTimerStore();

  const handleCompleteSession = () => {
    if (selectedTaskId) {
      toggleTask(selectedTaskId);
      toast.success(`أحسنت! أتممت جلسة: ${selectedTaskName} ✅`);
      complete();
    }
  };

  if (isPlanLoading || isLogLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="min-h-screen py-10 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mt-8">
            
            {/* Centerpiece: Timer Display (Left/Center Column) */}
            <div className="lg:col-span-7 flex flex-col items-center justify-center space-y-12 h-full">
              <TimerDisplay onComplete={handleCompleteSession} />
            </div>

            {/* Right Sidebar: Tasks & Guidance */}
            <div className="lg:col-span-5 space-y-8">
              <TaskSelector 
                tasks={plan?.tasks || []} 
                completedTaskIds={log?.tasksCompleted || []} 
              />

              {/* Tip of the Day Card */}
              <div className="relative overflow-hidden bg-tertiary-container rounded-[2rem] p-8 text-on-tertiary-container mt-8 shadow-sm">
                <div className="absolute -top-12 -left-12 w-32 h-32 bg-secondary opacity-10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-primary opacity-20 rounded-full blur-2xl"></div>
                
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-sm text-tertiary-fixed font-sans">نصيحة اليوم للتركيز</span>
                  </div>
                  <p className="font-sans text-sm leading-relaxed text-tertiary-fixed-dim">
                    التركيز في الجلسة الواحدة أهم من طول وقتها. حاول إبعاد المشتتات تماماً والعيش مع الآيات بقلب حاضر. جرب الربط البصري بين الكلمات لمساعدة الذاكرة الصورية.
                  </p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-3xl shadow-sm border border-emerald-50 text-center">
                  <span className="font-sans text-[10px] text-emerald-800/40 uppercase block mb-1">جلسات اليوم</span>
                  <span className="font-serif text-3xl font-bold text-emerald-900">{log?.tasksCompleted?.length || 0}</span>
                </div>
                <div className="bg-white p-5 rounded-3xl shadow-sm border border-emerald-50 text-center">
                  <span className="font-sans text-[10px] text-emerald-800/40 uppercase block mb-1">إجمالي المهام</span>
                  <span className="font-serif text-3xl font-bold text-emerald-900">{plan?.tasks?.length || 0}</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
