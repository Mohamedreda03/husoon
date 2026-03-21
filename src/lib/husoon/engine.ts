import { UserProgress, DayPlan, HusoonTask } from './types';
import { calculateFarReviewForToday } from './calculator';
import { getNextPageToMemorize, getTotalMemorizedPages, getLastNMemorizedPages } from './memorization';
import { format } from 'date-fns';

export function calculateDayPlan(progress: UserProgress, date: Date): DayPlan {
  const tasks: HusoonTask[] = [];
  const totalMemorized = getTotalMemorizedPages(progress.memorizedRanges);
  const currentPage = getNextPageToMemorize(progress.memorizedRanges, progress.startPage);
  
  // 1. الحصن الخامس — الحفظ الجديد (15 دقيقة)
  tasks.push({
    id: 'new',
    fortressNumber: 5,
    name: 'الحفظ الجديد',
    description: 'قراءة الصفحة الجديدة بتأني مع التركيز والتكرار حتى الإتقان',
    durationMinutes: 15,
    pages: { from: currentPage, to: currentPage },
    isRequired: true,
    timeOfDay: 'morning'
  });

  // 2. الحصن الثاني — التحضير القبلي (15 دقيقة، قبل الحفظ)
  tasks.push({
    id: 'qabli',
    fortressNumber: 2,
    name: 'التحضير القبلي',
    description: 'الاستماع للصفحة الجديدة وقراءتها 15 مرة قبل جلسة الحفظ',
    durationMinutes: 15,
    pages: { from: currentPage, to: currentPage },
    isRequired: true,
    timeOfDay: 'morning'
  });

  // 3. الحصن الثاني — التحضير الليلي (15 دقيقة، لليوم التالي)
  const nextPage = currentPage + 1;
  tasks.push({
    id: 'layli',
    fortressNumber: 2,
    name: 'التحضير الليلي',
    description: 'قراءة صفحة الغد 15 مرة قبل النوم',
    durationMinutes: 15,
    pages: { from: nextPage, to: nextPage },
    isRequired: true,
    timeOfDay: 'night'
  });

  // 4. الحصن الثالث — مراجعة القريب (الـ 20 صفحة الأخيرة)
  if (totalMemorized >= 1) {
    const nearPages = getLastNMemorizedPages(progress.memorizedRanges, Math.min(20, totalMemorized));
    if (nearPages) {
      const nearCount = nearPages.to - nearPages.from + 1;
      tasks.push({
        id: 'near',
        fortressNumber: 3,
        name: 'مراجعة القريب',
        description: 'مراجعة آخر 20 صفحة تم حفظها لربط الحفظ الجديد بالقديم',
        durationMinutes: nearCount,
        pages: nearPages,
        isRequired: true,
        timeOfDay: 'evening'
      });
    }
  }

  // 5. الحصن الرابع — مراجعة البعيد (تقسيم ما بعد الـ 20 صفحة على الأسبوع)
  if (totalMemorized > 20) {
    const farPages = calculateFarReviewForToday(progress, date);
    if (farPages) {
      const count = farPages.to - farPages.from + 1;
      tasks.push({
        id: 'far',
        fortressNumber: 4,
        name: 'مراجعة البعيد',
        description: 'مراجعة الحفظ القديم (الذي تجاوز 20 صفحة) بمعدل جزأين يومياً',
        durationMinutes: count * 1.5,
        pages: farPages,
        isRequired: true,
        timeOfDay: 'anytime'
      });
    }
  }

  // 6. الحصن الثاني — التحضير الأسبوعي (10 دقائق)
  const weeklyFrom = currentPage + 1;
  const weeklyTo = currentPage + 7;
  tasks.push({
    id: 'weekly',
    fortressNumber: 2,
    name: 'التحضير الأسبوعي',
    description: 'قراءة الصفحات السبعة القادمة مرة واحدة في اليوم',
    durationMinutes: 10,
    pages: { from: weeklyFrom, to: weeklyTo },
    isRequired: true,
    timeOfDay: 'anytime'
  });

  // 7. الحصن الأول — القراءة المستمرة / الورد المستمر (40 دقيقة)
  tasks.push({
    id: 'monthly',
    fortressNumber: 1,
    name: 'الورد المستمر',
    description: 'قراءة جزأين من القرآن يومياً (ختمة كل 15 يوم) نظراً من المصحف',
    durationMinutes: 40,
    isRequired: true,
    timeOfDay: 'anytime'
  });

  // Sort tasks by fortress number (1 -> 5)
  tasks.sort((a, b) => a.fortressNumber - b.fortressNumber);

  const totalMinutes = tasks.reduce((sum, task) => sum + task.durationMinutes, 0);

  return {
    date: format(date, 'yyyy-MM-dd'),
    currentPage,
    tasks,
    totalMinutes
  };
}
