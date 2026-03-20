'use client';

import { useTodayPlan } from '@/hooks/useTodayPlan';
import { useDailyLog } from '@/hooks/useDailyLog';
import { TodayCard } from '@/components/dashboard/TodayCard';
import { FortressGrid } from '@/components/dashboard/FortressGrid';
import { TaskList } from '@/components/dashboard/TaskList';
import { Button } from '@/components/ui/button';
import { useUser } from '@/hooks/useUser';
import { LogOut, CheckCircle2, Trophy, Timer, CalendarDays } from 'lucide-react';
import { useState } from 'react';
import { updateUserProfile } from '@/lib/appwrite/database';
import { toast } from 'sonner';
import Link from 'next/link';

export default function DashboardPage() {
  const { plan, profile, isLoading: isPlanLoading } = useTodayPlan();
  const { log, toggleTask, isLoading: isLogLoading } = useDailyLog();
  const { logout } = useUser();
  const [isFinishing, setIsFinishing] = useState(false);

  const completedTaskIds = log?.tasksCompleted || [];
  const isDayDone = plan?.tasks.every(t => completedTaskIds.includes(t.id));

  const handleFinishDay = async () => {
    if (!profile) return;
    setIsFinishing(true);
    try {
      await updateUserProfile(profile.$id, {
        pagesDone: profile.pagesDone + (profile.pagesPerDay || 1),
        streakCount: (profile.streakCount || 0) + 1,
        lastActiveDate: new Date().toISOString(),
      });
      toast.success('مبارك! تم تسجيل إنجاز اليوم بنجاح 🎊');
    } catch (error) {
      toast.error('حدث خطأ أثناء تحديث البيانات');
    } finally {
      setIsFinishing(false);
    }
  };

  if (isPlanLoading || isLogLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-primary font-serif animate-pulse">جاري تحميل خطتك اليومية...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      <main className="container mx-auto px-4 mt-8 space-y-8 max-w-5xl">
        {/* Today Summary */}
        <TodayCard 
          currentPage={plan?.currentPage || 0} 
          completedTasks={completedTaskIds.length} 
          totalTasks={plan?.tasks.length || 0} 
        />

        {/* Fortress Overview */}
        <FortressGrid 
          tasks={plan?.tasks || []} 
          completedTaskIds={completedTaskIds} 
        />

        {/* Tasks Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <TaskList 
              tasks={plan?.tasks || []} 
              completedTaskIds={completedTaskIds} 
              onToggleTask={toggleTask} 
            />
          </div>

          {/* Side Info / Call to Action */}
          <div className="space-y-6">
            <Card className={`border-primary/20 ${isDayDone ? 'bg-primary/5' : 'bg-card'}`}>
              <CardContent className="p-6 text-center space-y-4">
                <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${isDayDone ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold font-serif text-primary">
                    {isDayDone ? 'أتممت مهام اليوم!' : 'بانتظار الإنجاز...'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isDayDone 
                      ? 'لقد أكملت جميع مهام الحصون الخمسة لليوم، اضغط الزر بالأسفل لتسجيل حفظك' 
                      : 'أكمل جميع المهام أعلاه لتتمكن من تسجيل إنجاز اليوم'}
                  </p>
                </div>
                <Button 
                  className="w-full h-12 text-lg font-bold" 
                  disabled={!isDayDone || isFinishing}
                  onClick={handleFinishDay}
                >
                  {isFinishing ? 'جاري التسجيل...' : 'تسجيل حفظ اليوم'}
                </Button>
              </CardContent>
            </Card>

            <div className="p-4 rounded-xl bg-accent/30 border border-primary/10 text-right">
              <h4 className="font-bold text-primary mb-2">💡 تذكير مبارك</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                &quot;مَنْ قَرَأَ حَرْفًا مِنْ كِتَابِ اللَّهِ فَلَهُ بِهِ حَسَنَةٌ، وَالْحَسَنَةُ بِعَشْرِ أَمْثَالِهَا&quot;
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function Card({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`rounded-xl border shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function CardContent({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}
