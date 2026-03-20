import { UserProgress, FarReviewSchedule, PageRange } from './types';
import { getTotalMemorizedPages, getMemorizedPagesList } from './memorization';

export function calculateFarReviewSchedule(progress: UserProgress): FarReviewSchedule[] {
  // الصفحات التي تجاوزت الـ 20 الملاصقة تُقسَّم على أيام الأسبوع
  // كل يوم يأخذ حتى 40 صفحة (جزآن)
  
  const totalMemorized = getTotalMemorizedPages(progress.memorizedRanges);
  const farPagesCount = totalMemorized - 20;
  if (farPagesCount <= 0) return [];
  
  // Get all memorized pages and take only the "far" ones (oldest pages, not the last 20)
  const allPages = getMemorizedPagesList(progress.memorizedRanges);
  const farPages = allPages.slice(0, farPagesCount);
  
  if (farPages.length === 0) return [];

  const schedule: FarReviewSchedule[] = [];
  const dayNames = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  let dayIndex = 6; // Start with Saturday (Index 6)
  
  // Group far pages into chunks of 40
  for (let i = 0; i < farPages.length; i += 40) {
    const chunk = farPages.slice(i, i + 40);
    const count = chunk.length;
    
    schedule.push({
      dayOfWeek: (dayIndex % 7) as 0 | 1 | 2 | 3 | 4 | 5 | 6,
      dayName: dayNames[dayIndex % 7],
      pages: { from: chunk[0], to: chunk[chunk.length - 1] },
      count: count,
      estimatedMinutes: count // 1 minute per page for review
    });
    
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
  const totalMemorized = getTotalMemorizedPages(progress.memorizedRanges);
  const remainingPages = totalPages - totalMemorized;
  const pagesPerDay = progress.pagesPerDay || 1;
  const daysRemaining = Math.ceil(remainingPages / pagesPerDay);
  
  const completionDate = new Date();
  completionDate.setDate(completionDate.getDate() + daysRemaining);
  return completionDate;
}
