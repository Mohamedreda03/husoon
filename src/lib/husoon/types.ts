export type TaskType = 
  | 'new'       // الحفظ الجديد
  | 'qabli'     // التحضير القبلي
  | 'layli'     // التحضير الليلي
  | 'near'      // مراجعة القريب
  | 'far'       // مراجعة البعيد
  | 'weekly'    // التحضير الأسبوعي
  | 'monthly'   // القراءة المستمرة

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
  pagesDone: number
  pagesPerDay: number
  startPage: number
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
