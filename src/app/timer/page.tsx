'use client';

import { useTodayPlan } from '@/hooks/useTodayPlan';
import { useDailyLog } from '@/hooks/useDailyLog';
import { TimerDisplay } from '@/components/timer/TimerDisplay';
import { TaskSelector } from '@/components/timer/TaskSelector';
import { useTimerStore } from '@/stores/timerStore';
import { Button } from '@/components/ui/button';
import { ChevronRight, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function TimerPage() {
  const { plan, isLoading: isPlanLoading } = useTodayPlan();
  const { log, toggleTask, isLoading: isLogLoading } = useDailyLog();
  const { selectedTaskId, selectedTaskName, complete } = useTimerStore();
  const router = useRouter();

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
    <div className="min-h-screen bg-background pb-10">
      <main className="container mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl">
        <div className="lg:col-span-2 flex flex-col items-center justify-center bg-card/50 rounded-3xl border border-primary/10 shadow-sm p-6 min-h-[500px]">
          <TimerDisplay onComplete={handleCompleteSession} />
        </div>

        <div className="space-y-6">
          <TaskSelector 
            tasks={plan?.tasks || []} 
            completedTaskIds={log?.tasksCompleted || []} 
          />
          
          <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 text-right space-y-3">
            <h4 className="font-bold text-primary">نصيحة الحفظ</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              &quot;التركيز في الجلسة الواحدة أهم من طول وقتها. حاول إبعاد المشتتات تماماً والعيش مع الآيات بقلب حاضر.&quot;
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
