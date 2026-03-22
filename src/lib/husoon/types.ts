import type { QuranReference } from "@/lib/quran/types";

export type TaskType =
  | "new"
  | "qabli"
  | "layli"
  | "near"
  | "far"
  | "weekly"
  | "monthly";

export type DailyGoalType =
  | "ayat"
  | "wajh"
  | "page"
  | "pages_2"
  | "pages_4"
  | "hizb";

export interface MemorizedRange {
  from: number;
  to: number;
}

export interface HusoonTask {
  id: TaskType;
  fortressNumber: 1 | 2 | 3 | 4 | 5;
  name: string;
  description: string;
  durationMinutes: number;
  pages?: { from: number; to: number };
  references?: QuranReference[];
  isRequired: boolean;
  timeOfDay: "morning" | "evening" | "night" | "anytime";
}

export interface DayPlan {
  date: string;
  currentPage: number;
  tasks: HusoonTask[];
  totalMinutes: number;
}

export interface UserProgress {
  memorizedRanges: MemorizedRange[];
  dailyGoalType: DailyGoalType;
  dailyGoalValue: number;
  pagesDone: number;
  pagesPerDay: number;
  startPage: number;
}

export interface FarReviewSchedule {
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  dayName: string;
  pages: { from: number; to: number };
  count: number;
  estimatedMinutes: number;
}

export interface PageRange {
  from: number;
  to: number;
}

export const DAILY_GOAL_OPTIONS: {
  type: DailyGoalType;
  label: string;
  pagesPerDay: number;
  description: string;
}[] = [
  { type: "ayat", label: "5 آيات", pagesPerDay: 0.3, description: "مناسب للمبتدئين" },
  { type: "wajh", label: "وجه", pagesPerDay: 0.5, description: "نصف صفحة يومياً" },
  { type: "page", label: "صفحة", pagesPerDay: 1, description: "المعدل المعتاد" },
  { type: "pages_2", label: "صفحتان", pagesPerDay: 2, description: "متقدم" },
  { type: "pages_4", label: "4 صفحات", pagesPerDay: 4, description: "مكثف" },
  { type: "hizb", label: "حزب", pagesPerDay: 10, description: "مراجعة مكثفة جداً" },
];

export function getPagesPerDayFromGoalType(goalType: DailyGoalType): number {
  const option = DAILY_GOAL_OPTIONS.find((o) => o.type === goalType);
  return option?.pagesPerDay ?? 1;
}
