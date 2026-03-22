import { format } from "date-fns";
import { getReferenceFromPageRange } from "@/lib/quran/metadata";
import { calculateFarReviewForToday } from "./calculator";
import {
  getLastNMemorizedPages,
  getNextPageToMemorize,
  getTotalMemorizedPages,
} from "./memorization";
import { DayPlan, HusoonTask, UserProgress } from "./types";

function buildTaskReferences(pages?: { from: number; to: number }) {
  if (!pages) {
    return undefined;
  }

  return [getReferenceFromPageRange(pages.from, pages.to)];
}

export function calculateDayPlan(progress: UserProgress, date: Date): DayPlan {
  const tasks: HusoonTask[] = [];
  const totalMemorized = getTotalMemorizedPages(progress.memorizedRanges);
  const currentPage = getNextPageToMemorize(
    progress.memorizedRanges,
    progress.startPage,
  );

  // 1. الحصن الأول: الورد المستمر (القراءة المستمرة)
  const dailyReadingPages = {
    from: currentPage,
    to: Math.min(604, currentPage + 19),
  };
  tasks.push({
    id: "monthly",
    fortressNumber: 1,
    name: "الورد المستمر",
    description: "قراءة جزأين يومياً من القرآن نظراً للمحافظة على الصلة اليومية بالقرآن كاملاً",
    durationMinutes: 40,
    pages: dailyReadingPages,
    references: buildTaskReferences(dailyReadingPages),
    isRequired: true,
    timeOfDay: "anytime",
  });

  // 2. الحصن الثاني: التحضير (أسبوعي، ليلي، قبلي)
  const weeklyFrom = Math.min(604, currentPage + 1);
  const weeklyTo = Math.min(604, currentPage + 7);
  tasks.push({
    id: "weekly",
    fortressNumber: 2,
    name: "التحضير الأسبوعي",
    description: "قراءة الصفحات السبع القادمة مرة واحدة في اليوم",
    durationMinutes: 10,
    pages: { from: weeklyFrom, to: weeklyTo },
    references: buildTaskReferences({ from: weeklyFrom, to: weeklyTo }),
    isRequired: true,
    timeOfDay: "anytime",
  });

  const nextPage = Math.min(604, currentPage + 1);
  tasks.push({
    id: "layli",
    fortressNumber: 2,
    name: "التحضير الليلي",
    description: "استماع مركز لصفحة الغد أو قراءتها 15 مرة قبل النوم",
    durationMinutes: 15,
    pages: { from: nextPage, to: nextPage },
    references: buildTaskReferences({ from: nextPage, to: nextPage }),
    isRequired: true,
    timeOfDay: "night",
  });

  tasks.push({
    id: "qabli",
    fortressNumber: 2,
    name: "التحضير القبلي",
    description: "تكرار الصفحة الجديدة 15 مرة بتركيز تام قبل البدء في الحفظ",
    durationMinutes: 15,
    pages: { from: currentPage, to: currentPage },
    references: buildTaskReferences({ from: currentPage, to: currentPage }),
    isRequired: true,
    timeOfDay: "morning",
  });

  // 3. الحصن الثالث: مراجعة البعيد
  if (totalMemorized > 20) {
    const farPages = calculateFarReviewForToday(progress, date);
    if (farPages) {
      const count = farPages.to - farPages.from + 1;
      tasks.push({
        id: "far",
        fortressNumber: 3,
        name: "مراجعة البعيد",
        description: "مراجعة الحفظ القديم الذي تجاوز 20 صفحة",
        durationMinutes: count * 1.5,
        pages: farPages,
        references: buildTaskReferences(farPages),
        isRequired: true,
        timeOfDay: "anytime",
      });
    }
  }

  // 4. الحصن الرابع: مراجعة القريب
  if (totalMemorized >= 1) {
    const nearPages = getLastNMemorizedPages(
      progress.memorizedRanges,
      Math.min(20, totalMemorized),
    );

    if (nearPages) {
      const nearCount = nearPages.to - nearPages.from + 1;
      tasks.push({
        id: "near",
        fortressNumber: 4,
        name: "مراجعة القريب",
        description: "مراجعة آخر 20 صفحة تم حفظها يومياً",
        durationMinutes: nearCount,
        pages: nearPages,
        references: buildTaskReferences(nearPages),
        isRequired: true,
        timeOfDay: "evening",
      });
    }
  }

  // 5. الحصن الخامس: الحفظ الجديد
  const newPagesTo = Math.min(604, currentPage + Math.max(1, Math.round(progress.pagesPerDay)) - 1);
  tasks.push({
    id: "new",
    fortressNumber: 5,
    name: "الحفظ الجديد",
    description: "حفظ الصفحة الجديدة بإتقان بعد إتمام التحضير",
    durationMinutes: 15 * Math.max(1, progress.pagesPerDay),
    pages: { from: currentPage, to: newPagesTo },
    references: buildTaskReferences({ from: currentPage, to: newPagesTo }),
    isRequired: true,
    timeOfDay: "morning",
  });

  // Note: We don't need a final sort if we push them in order, 
  // but keeping a stable sort ensures consistency if logic changes.
  tasks.sort((a, b) => {
    if (a.fortressNumber !== b.fortressNumber) {
      return a.fortressNumber - b.fortressNumber;
    }
    // Sub-order for Fortress 2 (Preparation)
    const prepOrder = { weekly: 1, layli: 2, qabli: 3 };
    if (a.fortressNumber === 2) {
      return (prepOrder[a.id as keyof typeof prepOrder] || 0) - (prepOrder[b.id as keyof typeof prepOrder] || 0);
    }
    return 0;
  });

  return {
    date: format(date, "yyyy-MM-dd"),
    currentPage,
    tasks,
    totalMinutes: tasks.reduce((sum, task) => sum + task.durationMinutes, 0),
  };
}
