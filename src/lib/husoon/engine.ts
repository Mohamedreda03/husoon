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

  tasks.push({
    id: "new",
    fortressNumber: 5,
    name: "الحفظ الجديد",
    description: "قراءة الصفحة الجديدة بتأنٍ مع التركيز والتكرار حتى الإتقان",
    durationMinutes: 15,
    pages: { from: currentPage, to: currentPage },
    references: buildTaskReferences({ from: currentPage, to: currentPage }),
    isRequired: true,
    timeOfDay: "morning",
  });

  tasks.push({
    id: "qabli",
    fortressNumber: 2,
    name: "التحضير القبلي",
    description: "الاستماع للصفحة الجديدة وقراءتها 15 مرة قبل جلسة الحفظ",
    durationMinutes: 15,
    pages: { from: currentPage, to: currentPage },
    references: buildTaskReferences({ from: currentPage, to: currentPage }),
    isRequired: true,
    timeOfDay: "morning",
  });

  const nextPage = Math.min(604, currentPage + 1);
  tasks.push({
    id: "layli",
    fortressNumber: 2,
    name: "التحضير الليلي",
    description: "قراءة صفحة الغد 15 مرة قبل النوم",
    durationMinutes: 15,
    pages: { from: nextPage, to: nextPage },
    references: buildTaskReferences({ from: nextPage, to: nextPage }),
    isRequired: true,
    timeOfDay: "night",
  });

  if (totalMemorized >= 1) {
    const nearPages = getLastNMemorizedPages(
      progress.memorizedRanges,
      Math.min(20, totalMemorized),
    );

    if (nearPages) {
      const nearCount = nearPages.to - nearPages.from + 1;
      tasks.push({
        id: "near",
        fortressNumber: 3,
        name: "مراجعة القريب",
        description: "مراجعة آخر 20 صفحة تم حفظها لربط الحفظ الجديد بالقديم",
        durationMinutes: nearCount,
        pages: nearPages,
        references: buildTaskReferences(nearPages),
        isRequired: true,
        timeOfDay: "evening",
      });
    }
  }

  if (totalMemorized > 20) {
    const farPages = calculateFarReviewForToday(progress, date);
    if (farPages) {
      const count = farPages.to - farPages.from + 1;
      tasks.push({
        id: "far",
        fortressNumber: 4,
        name: "مراجعة البعيد",
        description: "مراجعة الحفظ القديم الذي تجاوز 20 صفحة بتقسيمه على أيام الأسبوع",
        durationMinutes: count * 1.5,
        pages: farPages,
        references: buildTaskReferences(farPages),
        isRequired: true,
        timeOfDay: "anytime",
      });
    }
  }

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

  tasks.sort((a, b) => a.fortressNumber - b.fortressNumber);

  return {
    date: format(date, "yyyy-MM-dd"),
    currentPage,
    tasks,
    totalMinutes: tasks.reduce((sum, task) => sum + task.durationMinutes, 0),
  };
}
