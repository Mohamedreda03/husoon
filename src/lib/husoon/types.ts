export type TaskType = 
  | 'new'       // الحفظ الجديد
  | 'qabli'     // التحضير القبلي
  | 'layli'     // التحضير الليلي
  | 'near'      // مراجعة القريب
  | 'far'       // مراجعة البعيد
  | 'weekly'    // التحضير الأسبوعي
  | 'monthly'   // القراءة المستمرة

export type DailyGoalType = 
  | 'ayat'      // 5 آيات
  | 'wajh'      // وجه (نصف صفحة)
  | 'page'      // صفحة واحدة
  | 'pages_2'   // صفحتان
  | 'pages_4'   // 4 صفحات
  | 'hizb'      // حزب (10 صفحات)

export interface MemorizedRange {
  from: number;
  to: number;
}

export interface HusoonTask {
  id: TaskType
  fortressNumber: 1 | 2 | 3 | 4 | 5
  name: string
  description: string
  durationMinutes: number
  pages?: { from: number; to: number }
  isRequired: boolean
  timeOfDay: 'morning' | 'evening' | 'night' | 'anytime'
}

export interface DayPlan {
  date: string
  currentPage: number        // الصفحة المراد حفظها اليوم
  tasks: HusoonTask[]
  totalMinutes: number
}

export interface UserProgress {
  memorizedRanges: MemorizedRange[];
  dailyGoalType: DailyGoalType;
  dailyGoalValue: number;
  pagesDone: number;          // computed from ranges
  pagesPerDay: number;        // computed from dailyGoalType
  startPage: number;
}

export interface FarReviewSchedule {
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6
  dayName: string
  pages: { from: number; to: number }
  count: number
  estimatedMinutes: number
}

export interface PageRange {
  from: number
  to: number
}

/** Daily goal type labels and their page equivalents */
export const DAILY_GOAL_OPTIONS: { 
  type: DailyGoalType; 
  label: string; 
  pagesPerDay: number; 
  description: string; 
}[] = [
  { type: 'ayat', label: '5 آيات', pagesPerDay: 0.3, description: 'مناسب للمبتدئين' },
  { type: 'wajh', label: 'وجه', pagesPerDay: 0.5, description: 'نصف صفحة يومياً' },
  { type: 'page', label: 'صفحة', pagesPerDay: 1, description: 'المعدل المعتاد' },
  { type: 'pages_2', label: 'صفحتان', pagesPerDay: 2, description: 'متقدم' },
  { type: 'pages_4', label: '4 صفحات', pagesPerDay: 4, description: 'مكثف' },
  { type: 'hizb', label: 'حزب', pagesPerDay: 10, description: 'مراجعة مكثفة جداً' },
];

/** Get pages per day from goal type */
export function getPagesPerDayFromGoalType(goalType: DailyGoalType): number {
  const option = DAILY_GOAL_OPTIONS.find(o => o.type === goalType);
  return option?.pagesPerDay ?? 1;
}
