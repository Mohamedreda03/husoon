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
  | "hizb"
  | "custom";

export type CustomGoalUnit = "face" | "page" | "quarter" | "verse";

export const UNIT_CONVERSIONS: Record<CustomGoalUnit, number> = {
  face: 1,      // 1 side
  page: 2,      // 2 sides
  quarter: 2.5, // 1 Rub' (roughly 2.5 faces)
  verse: 0.066, // 1/15 of a face (roughly)
};

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
  dailyGoalUnit: CustomGoalUnit;
  pagesDone: number;
  pagesPerDay: number;
  startPage: number;
}

export function getTrackingModeFromUnit(unit: CustomGoalUnit): "page" | "verse" {
  return unit === "verse" ? "verse" : "page";
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
  { type: "custom", label: "مخصص", pagesPerDay: 1, description: "تحديد كمية مخصصة" },
];

export function getPagesPerDayFromGoalType(
  goalType: DailyGoalType, 
  customValue?: number,
  customUnit: CustomGoalUnit = "face"
): number {
  if (goalType === "custom") {
    const multiplier = UNIT_CONVERSIONS[customUnit] || 1;
    return (customValue ?? 1) * multiplier;
  }
  const option = DAILY_GOAL_OPTIONS.find((o) => o.type === goalType);
  return option?.pagesPerDay ?? 1;
}
