import { UserProgress, FarReviewSchedule, PageRange } from './types';
import { format } from 'date-fns';

export function calculateFarReviewSchedule(progress: UserProgress): FarReviewSchedule[] {
  // الصفحات التي تجاوزت الـ 20 الملاصقة تُقسَّم على أيام الأسبوع
  // كل يوم يأخذ حتى 40 صفحة (جزآن)
  // أيام الأسبوع: السبت(6) → الجمعة(5)
  
  const farPagesCount = progress.pagesDone - 20;
  if (farPagesCount <= 0) return [];
  
  const schedule: FarReviewSchedule[] = [];
  const dayNames = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const startPage = progress.startPage;
  let dayIndex = 6; // Start with Saturday (Index 6)
  
  const totalFarEndPage = progress.startPage + farPagesCount - 1;
  
  let currentStart = startPage;
  while (currentStart <= totalFarEndPage) {
    const currentEnd = Math.min(currentStart + 39, totalFarEndPage);
    const count = currentEnd - currentStart + 1;
    
    schedule.push({
      dayOfWeek: (dayIndex % 7) as 0 | 1 | 2 | 3 | 4 | 5 | 6,
      dayName: dayNames[dayIndex % 7],
      pages: { from: currentStart, to: currentEnd },
      count: count,
      estimatedMinutes: count // 1 minute per page for review
    });
    
    currentStart = currentEnd + 1;
    dayIndex--;
    if (dayIndex < 0) dayIndex = 6;
  }
  
  return schedule;
}

export function calculateFarReviewForToday(progress: UserProgress, date: Date): PageRange | null {
  const schedule = calculateFarReviewSchedule(progress);
  const todayDayOfWeek = date.getDay(); // 0 (Sun) to 6 (Sat)
  
  const todayTask = schedule.find(s => s.dayOfWeek === todayDayOfWeek);
  return todayTask ? todayTask.pages : null;
}

export function estimateCompletionDate(progress: UserProgress): Date {
  const totalPages = 604;
  const remainingPages = totalPages - (progress.startPage + progress.pagesDone - 1);
  const daysRemaining = Math.ceil(remainingPages / progress.pagesPerDay);
  
  const completionDate = new Date();
  completionDate.setDate(completionDate.getDate() + daysRemaining);
  return completionDate;
}
