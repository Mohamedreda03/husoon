# 🕌 الحصون الخمسة — خطة بناء التطبيق الكاملة
> نظام حفظ القرآن الكريم | Next.js + Appwrite + shadcn/ui + React Query

---

## 📌 نظرة عامة على المشروع

**الهدف:** بناء تطبيق ويب متكامل يطبّق نظام الحصون الخمسة لحفظ القرآن الكريم تلقائياً — بحيث يحسب التطبيق كل شيء (ماذا تحفظ اليوم، ماذا تراجع، متى، وكيف) دون أن يفكر المستخدم في أي حسابات.

**التقنيات:**
- **Frontend:** Next.js 14+ (App Router) + shadcn/ui + Tailwind CSS
- **Backend/Auth/DB:** Appwrite (Self-hosted أو Cloud)
- **Data Fetching:** TanStack React Query v5
- **Notifications:** Web Push API + Appwrite Functions
- **State Management:** Zustand (للـ UI state المحلي)
- **Forms:** React Hook Form + Zod
- **Date/Time:** date-fns
- **Charts:** Recharts
- **Icons:** Lucide React (مع shadcn)

---

## 🗺️ هيكل قاعدة البيانات (Appwrite Collections)

```
users
├── userId (string) — Appwrite Auth ID
├── name (string)
├── pagesDone (integer) — عدد الصفحات المحفوظة حتى الآن
├── startPage (integer, default: 3) — صفحة البداية في المصحف
├── pagesPerDay (float, default: 1)
├── streakCount (integer, default: 0)
├── lastActiveDate (datetime)
├── notificationsEnabled (boolean)
├── notificationTime (string) — e.g. "07:00"
└── timezone (string)

dailyLogs
├── logId (string)
├── userId (string)
├── date (string) — "YYYY-MM-DD"
├── pageMemorized (integer) — رقم الصفحة التي حُفظت
├── tasksCompleted (string[]) — ["new","qabli","layli","near","far","weekly","monthly"]
├── totalMinutes (integer)
└── notes (string)

sessions (سجل جلسات المؤقت)
├── sessionId (string)
├── userId (string)
├── date (string)
├── taskType (string) — "new" | "qabli" | "layli" | "near" | "far" | "weekly" | "monthly"
├── durationSeconds (integer)
└── completedAt (datetime)

pushSubscriptions
├── subscriptionId (string)
├── userId (string)
├── endpoint (string)
├── p256dh (string)
├── auth (string)
└── createdAt (datetime)
```

---

## 📐 هيكل المجلدات (Next.js App Router)

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx          ← الـ layout الرئيسي مع الـ sidebar/navbar
│   │   ├── page.tsx            ← Today Dashboard (الصفحة الرئيسية)
│   │   ├── timer/page.tsx
│   │   ├── schedule/page.tsx
│   │   ├── stats/page.tsx
│   │   └── settings/page.tsx
│   ├── api/
│   │   ├── push/subscribe/route.ts
│   │   ├── push/send/route.ts
│   │   └── push/vapid/route.ts
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                     ← shadcn components (auto-generated)
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   └── MobileNav.tsx
│   ├── dashboard/
│   │   ├── TodayCard.tsx
│   │   ├── FortressGrid.tsx
│   │   ├── TaskList.tsx
│   │   ├── ProgressRing.tsx
│   │   └── DailyStats.tsx
│   ├── timer/
│   │   ├── TimerDisplay.tsx
│   │   ├── TaskSelector.tsx
│   │   └── SessionLog.tsx
│   ├── schedule/
│   │   ├── WeekView.tsx
│   │   ├── PipelineTable.tsx
│   │   └── WeeklyPlan.tsx
│   ├── stats/
│   │   ├── StatsGrid.tsx
│   │   ├── HeatMap.tsx
│   │   ├── ProgressBars.tsx
│   │   └── StreakCard.tsx
│   └── shared/
│       ├── LoadingSpinner.tsx
│       ├── ErrorBoundary.tsx
│       └── NotificationBell.tsx
├── lib/
│   ├── appwrite/
│   │   ├── client.ts           ← Appwrite client init
│   │   ├── auth.ts             ← Auth functions
│   │   ├── database.ts         ← DB helpers
│   │   └── config.ts           ← IDs وثوابت Appwrite
│   ├── husoon/
│   │   ├── engine.ts           ← 🧠 منطق الحصون الخمسة كاملاً
│   │   ├── calculator.ts       ← حساب المراجعات والجدول
│   │   └── types.ts            ← TypeScript types
│   ├── push/
│   │   ├── vapid.ts
│   │   └── sendNotification.ts
│   └── utils.ts
├── hooks/
│   ├── useUser.ts
│   ├── useTodayPlan.ts
│   ├── useDailyLog.ts
│   ├── useStats.ts
│   ├── useTimer.ts
│   └── useNotifications.ts
├── stores/
│   └── timerStore.ts           ← Zustand للمؤقت
├── providers/
│   ├── QueryProvider.tsx
│   └── AppwriteProvider.tsx
└── types/
    └── index.ts
```

---

---

# 🚀 PHASES & STEPS

---

## PHASE 0 — الإعداد والبنية التحتية
**الهدف:** تجهيز البيئة الكاملة قبل كتابة أي كود للتطبيق

---

### Step 0.1 — تثبيت المكتبات الأساسية

- [ ] تثبيت Appwrite SDK:
  ```bash
  npm install appwrite node-appwrite
  ```
- [ ] تثبيت React Query:
  ```bash
  npm install @tanstack/react-query @tanstack/react-query-devtools
  ```
- [ ] تثبيت Zustand:
  ```bash
  npm install zustand
  ```
- [ ] تثبيت React Hook Form + Zod:
  ```bash
  npm install react-hook-form zod @hookform/resolvers
  ```
- [ ] تثبيت date-fns:
  ```bash
  npm install date-fns
  ```
- [ ] تثبيت Recharts:
  ```bash
  npm install recharts
  ```
- [ ] تثبيت web-push (للـ server-side notifications):
  ```bash
  npm install web-push
  npm install -D @types/web-push
  ```
- [ ] تثبيت shadcn components المطلوبة:
  ```bash
  npx shadcn@latest add button card badge progress dialog sheet
  npx shadcn@latest add form input label select switch tabs toast
  npx shadcn@latest add dropdown-menu separator skeleton avatar
  npx shadcn@latest add alert-dialog tooltip popover calendar
  ```

---

### Step 0.2 — إعداد Appwrite

- [ ] إنشاء project جديد في Appwrite Console
- [ ] تفعيل **Email/Password** authentication
- [ ] إنشاء database باسم `husoon_db`
- [ ] إنشاء Collection: **`users`** مع الـ attributes التالية:
  ```
  userId        → String(36)    required
  name          → String(100)   required
  pagesDone     → Integer       default: 0
  startPage     → Integer       default: 3
  pagesPerDay   → Float         default: 1.0
  streakCount   → Integer       default: 0
  lastActiveDate → DateTime
  notificationsEnabled → Boolean default: false
  notificationTime → String(5)  default: "07:00"
  timezone      → String(50)    default: "Africa/Cairo"
  ```
- [ ] إنشاء Collection: **`dailyLogs`** مع الـ attributes:
  ```
  userId        → String(36)    required
  date          → String(10)    required  (YYYY-MM-DD)
  pageMemorized → Integer
  tasksCompleted → String[]     (array)
  totalMinutes  → Integer       default: 0
  notes         → String(500)
  ```
- [ ] إنشاء Collection: **`sessions`** مع الـ attributes:
  ```
  userId        → String(36)    required
  date          → String(10)    required
  taskType      → String(20)    required
  durationSeconds → Integer     required
  completedAt   → DateTime      required
  ```
- [ ] إنشاء Collection: **`pushSubscriptions`**:
  ```
  userId        → String(36)    required
  endpoint      → String(500)   required
  p256dh        → String(200)   required
  auth          → String(100)   required
  ```
- [ ] إضافة **Indexes** على كل collection:
  - `users`: index على `userId`
  - `dailyLogs`: index على `userId` + `date`
  - `sessions`: index على `userId` + `date`
  - `pushSubscriptions`: index على `userId`
- [ ] ضبط **Permissions** لكل collection:
  - Users يقرأون ويكتبون فقط documents الخاصة بهم
  - Rules: `read("user:[userId]")` + `write("user:[userId]")`

---

### Step 0.3 — ملفات الـ Config والـ Environment

- [ ] إنشاء `.env.local`:
  ```env
  NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
  NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
  NEXT_PUBLIC_APPWRITE_DATABASE_ID=husoon_db
  NEXT_PUBLIC_APPWRITE_USERS_COLLECTION=users
  NEXT_PUBLIC_APPWRITE_LOGS_COLLECTION=dailyLogs
  NEXT_PUBLIC_APPWRITE_SESSIONS_COLLECTION=sessions
  NEXT_PUBLIC_APPWRITE_PUSH_COLLECTION=pushSubscriptions
  
  # Web Push (VAPID Keys - generate with: npx web-push generate-vapid-keys)
  NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_public_key
  VAPID_PRIVATE_KEY=your_private_key
  VAPID_SUBJECT=mailto:your@email.com
  
  # Appwrite Server SDK (للـ API Routes)
  APPWRITE_API_KEY=your_server_api_key
  ```
- [ ] إنشاء `src/lib/appwrite/config.ts`:
  ```typescript
  export const APPWRITE_CONFIG = {
    endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!,
    projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!,
    databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
    collections: {
      users: process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION!,
      dailyLogs: process.env.NEXT_PUBLIC_APPWRITE_LOGS_COLLECTION!,
      sessions: process.env.NEXT_PUBLIC_APPWRITE_SESSIONS_COLLECTION!,
      pushSubs: process.env.NEXT_PUBLIC_APPWRITE_PUSH_COLLECTION!,
    }
  }
  ```
- [ ] إنشاء `src/lib/appwrite/client.ts` — Appwrite client singleton
- [ ] إضافة `.env.local` إلى `.gitignore`

---

### Step 0.4 — إعداد Providers

- [ ] إنشاء `src/providers/QueryProvider.tsx`:
  ```typescript
  'use client'
  import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
  import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
  // QueryClient مع staleTime و retry مناسبين
  ```
- [ ] إنشاء `src/providers/AppwriteProvider.tsx` — context للـ Appwrite session
- [ ] لف الـ app في `src/app/layout.tsx` بالـ providers
- [ ] إعداد `src/app/globals.css` — Arabic font (Cairo/Amiri) + RTL direction
- [ ] إضافة `dir="rtl"` و `lang="ar"` لـ `<html>` tag في root layout

---

---

## PHASE 1 — نظام المصادقة (Authentication)
**الهدف:** تسجيل الدخول والتسجيل وحماية الصفحات

---

### Step 1.1 — Appwrite Auth Functions

- [ ] إنشاء `src/lib/appwrite/auth.ts` بالدوال التالية:
  ```typescript
  // تسجيل مستخدم جديد
  async function registerUser(email, password, name): Promise<User>
  
  // تسجيل الدخول
  async function loginUser(email, password): Promise<Session>
  
  // تسجيل الخروج
  async function logoutUser(): Promise<void>
  
  // جلب المستخدم الحالي
  async function getCurrentUser(): Promise<User | null>
  
  // إنشاء profile في users collection بعد التسجيل
  async function createUserProfile(userId, name): Promise<void>
  ```

---

### Step 1.2 — Auth Hook

- [ ] إنشاء `src/hooks/useUser.ts`:
  ```typescript
  // useQuery لجلب المستخدم الحالي
  // useMutation للـ login, register, logout
  // redirect تلقائي للـ dashboard بعد الدخول
  // redirect للـ login إذا لم يكن هناك session
  ```
- [ ] ضبط `staleTime: Infinity` للـ user query (بيانات المستخدم لا تتغير كثيراً)

---

### Step 1.3 — صفحة التسجيل (`/register`)

- [ ] تصميم الصفحة بـ shadcn Card + Form
- [ ] Fields: الاسم، البريد الإلكتروني، كلمة المرور، تأكيد كلمة المرور
- [ ] Validation بـ Zod:
  ```typescript
  const registerSchema = z.object({
    name: z.string().min(2, "الاسم قصير جداً"),
    email: z.string().email("بريد إلكتروني غير صحيح"),
    password: z.string().min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
    confirmPassword: z.string()
  }).refine(data => data.password === data.confirmPassword, {
    message: "كلمتا المرور غير متطابقتان",
    path: ["confirmPassword"]
  })
  ```
- [ ] بعد التسجيل الناجح: عرض **Onboarding Wizard** (إعداد بيانات الحفظ الأولية)

---

### Step 1.4 — صفحة الدخول (`/login`)

- [ ] تصميم بـ shadcn Card + Form
- [ ] Fields: البريد الإلكتروني، كلمة المرور
- [ ] Loading state أثناء الـ mutation
- [ ] Error handling: رسائل خطأ عربية واضحة
- [ ] Redirect للـ `/` بعد الدخول

---

### Step 1.5 — حماية الصفحات (Middleware)

- [ ] إنشاء `src/middleware.ts`:
  ```typescript
  // فحص وجود Appwrite session cookie
  // redirect لـ /login إذا لم يكن هناك session
  // redirect لـ / إذا كان هناك session وحاول الدخول لـ /login
  // matcher: جميع صفحات الـ dashboard
  ```
- [ ] إنشاء `src/app/(auth)/layout.tsx` — layout مبسّط لصفحات الـ auth
- [ ] إنشاء `src/app/(dashboard)/layout.tsx` — layout كامل مع navbar

---

### Step 1.6 — Onboarding Wizard (للمستخدمين الجدد)

- [ ] إنشاء `src/components/onboarding/OnboardingWizard.tsx`
- [ ] **Step 1 من الـ Wizard:** كم صفحة حفظت حتى الآن؟ (0 إذا لم تبدأ)
  - Slider أو Input رقمي من 0 إلى 604
  - عرض اسم الجزء تلقائياً بناءً على الصفحة
- [ ] **Step 2 من الـ Wizard:** ما وتيرة الحفظ؟
  - خيار: نصف صفحة / صفحة / صفحتان يومياً
- [ ] **Step 3 من الـ Wizard:** ضبط وقت الإشعار اليومي
  - Time picker بسيط
- [ ] حفظ البيانات في `users` collection عند إنهاء الـ wizard
- [ ] Redirect لـ Dashboard الرئيسي

---

---

## PHASE 2 — محرك الحصون الخمسة (The Engine)
**الهدف:** كتابة المنطق الأساسي الذي يحسب كل شيء تلقائياً

> ⚠️ هذا أهم جزء في المشروع — كل شيء يعتمد عليه

---

### Step 2.1 — TypeScript Types

- [ ] إنشاء `src/lib/husoon/types.ts`:
  ```typescript
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
    farReviewPages?: { from: number; to: number }
    nearReviewPages?: { from: number; to: number }
    weeklyPrepPages?: { from: number; to: number }
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
  ```

---

### Step 2.2 — حساب خطة اليوم (`engine.ts`)

- [ ] إنشاء `src/lib/husoon/engine.ts`
- [ ] دالة `calculateDayPlan(progress: UserProgress, date: Date): DayPlan`:
  ```typescript
  // 1. حساب الصفحة الحالية للحفظ
  const currentPage = progress.startPage + progress.pagesDone
  
  // 2. الحصن الخامس — الحفظ الجديد (15 دقيقة)
  tasks.push({ id: 'new', durationMinutes: 15, pages: { from: currentPage, to: currentPage } })
  
  // 3. الحصن الثاني — التحضير القبلي (15 دقيقة، قبل الحفظ)
  tasks.push({ id: 'qabli', durationMinutes: 15, pages: { from: currentPage, to: currentPage } })
  
  // 4. الحصن الثاني — التحضير الليلي (15 دقيقة، بعد الحفظ/ليلاً)
  const nextPage = currentPage + 1
  tasks.push({ id: 'layli', durationMinutes: 15, pages: { from: nextPage, to: nextPage } })
  
  // 5. الحصن الرابع — مراجعة القريب (تتراكم حتى 20 صفحة)
  if (progress.pagesDone >= 1) {
    const nearCount = Math.min(20, progress.pagesDone)
    const nearFrom = Math.max(progress.startPage, currentPage - nearCount)
    tasks.push({ id: 'near', durationMinutes: nearCount, pages: { from: nearFrom, to: currentPage - 1 } })
  }
  
  // 6. الحصن الثالث — مراجعة البعيد (مرة أسبوعياً فقط)
  if (progress.pagesDone > 20) {
    const todayFarPages = calculateFarReviewForToday(progress, date)
    if (todayFarPages) {
      tasks.push({ id: 'far', durationMinutes: todayFarPages.count, pages: todayFarPages })
    }
  }
  
  // 7. الحصن الثاني — التحضير الأسبوعي (10 دقائق)
  const weeklyFrom = currentPage + 7
  const weeklyTo = currentPage + 13
  tasks.push({ id: 'weekly', durationMinutes: 10, pages: { from: weeklyFrom, to: weeklyTo } })
  
  // 8. الحصن الأول — القراءة المستمرة (40 دقيقة)
  tasks.push({ id: 'monthly', durationMinutes: 40 })
  ```

---

### Step 2.3 — حساب جدول مراجعة البعيد (`calculator.ts`)

- [ ] إنشاء `src/lib/husoon/calculator.ts`
- [ ] دالة `calculateFarReviewSchedule(progress: UserProgress): FarReviewSchedule[]`:
  ```typescript
  // الصفحات التي تجاوزت الـ 20 الملاصقة تُقسَّم على أيام الأسبوع
  // كل يوم يأخذ حتى 40 صفحة (جزآن)
  // أيام الأسبوع: السبت(6) → الجمعة(5)
  
  const farPages = progress.pagesDone - 20
  if (farPages <= 0) return []
  
  const schedule: FarReviewSchedule[] = []
  const dayNames = ['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت']
  let start = progress.startPage
  let dayIndex = 6 // السبت أولاً
  
  while (start <= progress.startPage + farPages - 1) {
    const end = Math.min(start + 39, progress.startPage + farPages - 1)
    schedule.push({
      dayOfWeek: dayIndex % 7,
      dayName: dayNames[dayIndex % 7],
      pages: { from: start, to: end },
      count: end - start + 1,
      estimatedMinutes: end - start + 1
    })
    start = end + 1
    dayIndex--
    if (dayIndex < 0) dayIndex = 6
  }
  return schedule
  ```
- [ ] دالة `calculateFarReviewForToday(progress, date): PageRange | null`:
  - تحدد هل اليوم يوم مراجعة بعيد؟ وأي صفحات؟
- [ ] دالة `estimateCompletionDate(progress): Date`:
  - يحسب متى ستنتهي من حفظ القرآن بناءً على الوتيرة الحالية
- [ ] دالة `calculateStreak(logs: DailyLog[]): number`:
  - يحسب عدد الأيام المتواصلة

---

### Step 2.4 — اختبار المنطق

- [ ] تثبيت Vitest:
  ```bash
  npm install -D vitest
  ```
- [ ] كتابة اختبارات للحالات الحدّية:
  - [ ] مستخدم جديد (0 صفحات)
  - [ ] مستخدم عند الـ 20 صفحة (نقطة بداية مراجعة البعيد)
  - [ ] مستخدم عند الـ 60 صفحة (جزآن مكتملان)
  - [ ] مستخدم أتم الحفظ (604 صفحات)
  - [ ] التأكد أن مجموع الدقائق صحيح لكل نموذج في الكتاب

---

---

## PHASE 3 — الصفحة الرئيسية (Today Dashboard)
**الهدف:** الصفحة التي يفتحها المستخدم كل يوم ويرى فيها كل شيء

---

### Step 3.1 — Data Fetching Hooks

- [ ] إنشاء `src/lib/appwrite/database.ts`:
  ```typescript
  // getUserProfile(userId): Promise<UserProfile>
  // updateUserProfile(userId, data): Promise<void>
  // getTodayLog(userId, date): Promise<DailyLog | null>
  // createOrUpdateLog(userId, date, data): Promise<void>
  // getLogHistory(userId, limit): Promise<DailyLog[]>
  ```
- [ ] إنشاء `src/hooks/useTodayPlan.ts`:
  ```typescript
  // useQuery لجلب user profile
  // حساب خطة اليوم بـ calculateDayPlan()
  // لا تحتاج API call — الحساب يتم client-side من بيانات المستخدم
  // staleTime: 5 minutes
  ```
- [ ] إنشاء `src/hooks/useDailyLog.ts`:
  ```typescript
  // useQuery لجلب log اليوم (المهام المنجزة)
  // useMutation لتحديث المهام المنجزة
  // Optimistic updates — يتحدث الـ UI فوراً قبل رد السيرفر
  ```

---

### Step 3.2 — Header Card (بطاقة اليوم)

- [ ] إنشاء `src/components/dashboard/TodayCard.tsx`:
  - عرض التاريخ بالعربية (يوم، تاريخ)
  - اسم الصفحة المراد حفظها مع رقمها
  - اسم السورة (قاموس بسيط من صفحة → سورة)
  - عداد دائري للتقدم (% المهام المكتملة)
  - إجمالي الوقت المتبقي للجلسات

---

### Step 3.3 — Fortress Grid (شبكة الحصون)

- [ ] إنشاء `src/components/dashboard/FortressGrid.tsx`:
  - 5 بطاقات للحصون الخمسة
  - كل بطاقة تعرض: رقم الحصن، الاسم، حالة الإنجاز (✓ أو ○)
  - الحصن يتحول للون أخضر عند إنجاز جميع مهامه
  - Animation عند الإنجاز (shadcn badge + CSS transition)

---

### Step 3.4 — Task List (قائمة المهام)

- [ ] إنشاء `src/components/dashboard/TaskList.tsx`:
  - عرض جميع المهام من `DayPlan`
  - كل مهمة: checkbox + اسم + وصف + مدة + زر المؤقت
  - Checkbox يُحدث `dailyLogs` في Appwrite فوراً (optimistic update)
  - المهام المكتملة تأخذ strikethrough style
  - ترتيب المهام حسب وقت اليوم (صباح → مساء → ليل)
  - عند إنجاز مهمة: toast "أحسنت! ✅"
  - زر "بدء المؤقت" بجانب كل مهمة — ينقل للـ Timer مع اختيار المهمة

---

### Step 3.5 — Daily Completion Flow

- [ ] زر "تسجيل حفظ اليوم" كبير وواضح في أسفل الصفحة
- [ ] عند الضغط: Dialog للتأكيد + ملاحظات اختيارية
- [ ] بعد التأكيد:
  - [ ] تحديث `pagesDone` + 1 (أو القيمة المحددة) في `users` collection
  - [ ] تحديث `dailyLogs` بحالة `done: true`
  - [ ] حساب وتحديث `streakCount`
  - [ ] تحديث `lastActiveDate`
  - [ ] Invalidate جميع الـ queries المرتبطة
  - [ ] عرض رسالة تهنئة + animation

---

---

## PHASE 4 — المؤقت (Timer)
**الهدف:** مؤقت ذكي مرتبط بكل مهمة يساعد على التركيز

---

### Step 4.1 — Timer Store (Zustand)

- [ ] إنشاء `src/stores/timerStore.ts`:
  ```typescript
  interface TimerStore {
    // State
    selectedTask: TaskType | null
    secondsRemaining: number
    isRunning: boolean
    isPaused: boolean
    
    // Actions
    selectTask: (task: TaskType, durationMinutes: number) => void
    start: () => void
    pause: () => void
    reset: () => void
    tick: () => void  // يُستدعى كل ثانية
    complete: () => void
  }
  ```
- [ ] الـ store يستخدم `useEffect` + `setInterval` في الـ component
- [ ] حفظ الـ timer state في `sessionStorage` حتى لا يُفقد عند reload الصفحة

---

### Step 4.2 — Timer Component

- [ ] إنشاء `src/components/timer/TimerDisplay.tsx`:
  - عرض الوقت بالصيغة `MM:SS` بخط كبير (Amiri serif)
  - شريط تقدم دائري (SVG stroke-dashoffset animation)
  - أزرار: ابدأ / أوقف / أعد
  - اسم المهمة المحددة + وصفها + عدد الصفحات
  - تغيير لون العداد عند اقتراب النهاية (آخر دقيقتين → أحمر)

- [ ] إنشاء `src/components/timer/TaskSelector.tsx`:
  - قائمة بجميع مهام اليوم
  - كل مهمة تعرض: الاسم + المدة + حالة الإنجاز
  - اختيار مهمة يضبط الوقت تلقائياً

---

### Step 4.3 — إنهاء الجلسة

- [ ] عند انتهاء الوقت:
  - صوت تنبيه (Web Audio API)
  - Dialog: "انتهت الجلسة! هل تريد تسجيل هذه المهمة كمنجزة؟"
  - عند الموافقة: يُحدث `dailyLogs` + يُنشئ record في `sessions`
  - عرض ملخص الجلسة: المهمة، المدة، إجمالي جلسات اليوم

- [ ] إنشاء `src/hooks/useTimer.ts`:
  - يربط `timerStore` بـ `useDailyLog` mutation
  - يحفظ الجلسة في Appwrite عند الإنهاء

---

### Step 4.4 — Session Log

- [ ] إنشاء `src/components/timer/SessionLog.tsx`:
  - عرض جلسات اليوم من `sessions` collection
  - كل جلسة: المهمة، المدة، الوقت
  - إجمالي دقائق اليوم

---

---

## PHASE 5 — الجدول (Schedule)
**الهدف:** عرض جدول المراجعة الأسبوعي وخطة الحفظ بشكل واضح

---

### Step 5.1 — Week View

- [ ] إنشاء `src/components/schedule/WeekView.tsx`:
  - عرض أيام الأسبوع (السبت → الجمعة)
  - تظليل اليوم الحالي
  - كل يوم يعرض: هل يوم مراجعة بعيد؟ + عدد الصفحات
  - النقر على يوم يعرض تفاصيله

---

### Step 5.2 — Pipeline Table (جدول الأنابيب)

- [ ] إنشاء `src/components/schedule/PipelineTable.tsx`:
  - جدول يعرض توزيع مراجعة البعيد على الأيام
  - بناءً على `calculateFarReviewSchedule()`
  - Columns: اليوم | الصفحات | العدد | الوقت التقديري
  - تظليل يوم اليوم
  - رسالة واضحة إذا كانت الصفحات أقل من 20 "ابدأ مراجعة البعيد بعد 20 صفحة"

---

### Step 5.3 — Weekly Plan Card

- [ ] إنشاء `src/components/schedule/WeeklyPlan.tsx`:
  - هذا الأسبوع: الصفحات المراد حفظها (currentPage → currentPage+6)
  - التحضير الأسبوعي (الآن): الصفحات التي تُقرأ يومياً
  - الأسبوع القادم: ما سيُحفظ
  - Timeline view بسيط

---

---

## PHASE 6 — الإحصائيات (Stats)
**الهدف:** تحفيز المستخدم بعرض تقدمه بشكل جميل

---

### Step 6.1 — Stats Data Hook

- [ ] إنشاء `src/hooks/useStats.ts`:
  ```typescript
  // useQuery لجلب آخر 90 يوم من dailyLogs
  // حساب: streak, totalPages, totalJuz, completionPct, daysRemaining
  // queryKey: ['stats', userId]
  // staleTime: 10 minutes
  ```

---

### Step 6.2 — Stats Grid (البطاقات الرقمية)

- [ ] إنشاء `src/components/stats/StatsGrid.tsx`:
  - 6 بطاقات: صفحات محفوظة / أجزاء مكتملة / نسبة الإتمام / أيام متواصلة / صفحات متبقية / تاريخ الإتمام المتوقع
  - كل بطاقة: رقم كبير + وصف صغير + اتجاه التغيير (↑↓)

---

### Step 6.3 — Heatmap (خريطة الحرارة)

- [ ] إنشاء `src/components/stats/HeatMap.tsx`:
  - Grid من الخلايا (52 × 7 أيام = سنة كاملة)
  - 4 درجات لون: لا نشاط / قليل / متوسط / مكثّف
  - Tooltip عند hover: التاريخ + المهام المنجزة
  - بناءً على `dailyLogs` data

---

### Step 6.4 — Progress Bars (شريط التقدم)

- [ ] إنشاء `src/components/stats/ProgressBars.tsx`:
  - 3 أشرطة: الجزء 1-10 / 11-20 / 21-30
  - Animated fill عند التحميل
  - بناءً على Recharts أو shadcn Progress component

---

### Step 6.5 — Recharts Chart

- [ ] إنشاء `src/components/stats/ActivityChart.tsx`:
  - Line/Bar chart لآخر 30 يوم
  - Y axis: دقائق النشاط اليومي
  - X axis: التاريخ
  - استخدام Recharts `ResponsiveContainer`

---

---

## PHASE 7 — نظام الإشعارات (Push Notifications)
**الهدف:** تذكير يومي بوقت الحفظ

---

### Step 7.1 — VAPID Keys & Service Worker

- [ ] توليد VAPID Keys:
  ```bash
  npx web-push generate-vapid-keys
  ```
  وحفظها في `.env.local`

- [ ] إنشاء `public/sw.js` (Service Worker):
  ```javascript
  self.addEventListener('push', (event) => {
    const data = event.data.json()
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icon-192.png',
      badge: '/badge-72.png',
      dir: 'rtl',
      lang: 'ar',
      actions: [
        { action: 'open', title: 'افتح التطبيق' },
        { action: 'dismiss', title: 'لاحقاً' }
      ],
      data: { url: data.url || '/' }
    })
  })
  
  self.addEventListener('notificationclick', (event) => {
    event.notification.close()
    if (event.action === 'open' || !event.action) {
      clients.openWindow(event.notification.data.url)
    }
  })
  ```

---

### Step 7.2 — Client-Side Subscription

- [ ] إنشاء `src/hooks/useNotifications.ts`:
  ```typescript
  // checkPermission(): 'granted' | 'denied' | 'default'
  // requestPermission(): Promise<boolean>
  // subscribe(): Promise<void>
  //   1. تسجيل الـ service worker
  //   2. طلب push subscription من المتصفح
  //   3. حفظ الـ subscription في Appwrite pushSubscriptions
  // unsubscribe(): Promise<void>
  // isSubscribed: boolean (من useQuery)
  ```

---

### Step 7.3 — API Routes (Server-Side)

- [ ] إنشاء `src/app/api/push/vapid/route.ts`:
  ```typescript
  GET /api/push/vapid
  // يُرجع الـ VAPID public key للـ client
  ```

- [ ] إنشاء `src/app/api/push/subscribe/route.ts`:
  ```typescript
  POST /api/push/subscribe
  // Body: { userId, subscription }
  // يحفظ في Appwrite pushSubscriptions collection
  ```

- [ ] إنشاء `src/app/api/push/send/route.ts`:
  ```typescript
  POST /api/push/send
  // Body: { userId, title, body, url }
  // يجلب subscription من Appwrite
  // يرسل Push notification بـ web-push
  // Protected: يتحقق من Appwrite API key
  ```

---

### Step 7.4 — Appwrite Function (للإشعارات المجدولة)

- [ ] إنشاء Appwrite Function باسم `sendDailyReminders`:
  ```javascript
  // يُشغَّل بـ Cron: "0 * * * *" (كل ساعة)
  // يجلب جميع المستخدمين من users collection
  // يتحقق: هل وقت الإشعار للمستخدم = الساعة الحالية؟
  // هل المستخدم لم يفتح التطبيق اليوم بعد؟
  // يستدعي /api/push/send لكل مستخدم مؤهل
  ```
- [ ] ضبط الـ Function environment variables في Appwrite Console
- [ ] اختبار الـ Function يدوياً قبل تفعيل الـ Cron

---

### Step 7.5 — Settings UI للإشعارات

- [ ] في صفحة الإعدادات: قسم "الإشعارات اليومية"
  - [ ] Switch لتفعيل/إلغاء الإشعارات
  - [ ] Time picker لاختيار وقت التذكير
  - [ ] زر "اختبار الإشعار" — يرسل push فوري للتأكد
  - [ ] رسالة توضيحية: "سيُذكّرك التطبيق يومياً بوقت حفظك"

---

---

## PHASE 8 — صفحة الإعدادات (Settings)
**الهدف:** تحكم كامل في بيانات الحفظ والتفضيلات

---

### Step 8.1 — بيانات الحفظ

- [ ] عرض وتعديل عدد الصفحات المحفوظة الحالي (مع تحذير: هذا يؤثر على جميع الحسابات)
- [ ] تعديل وتيرة الحفظ اليومي
- [ ] عرض تاريخ بدء الحفظ

---

### Step 8.2 — إعدادات الحساب

- [ ] تعديل الاسم
- [ ] تغيير كلمة المرور
- [ ] المنطقة الزمنية

---

### Step 8.3 — إعادة التعيين

- [ ] زر "إعادة تعيين التقدم" مع Alert Dialog للتأكيد ثم تأكيد ثانٍ (اكتب "موافق")
- [ ] زر "تصدير البيانات" — يُنزّل JSON بجميع السجلات

---

---

## PHASE 9 — الـ Layout والـ UX
**الهدف:** تجربة مستخدم سلسة ومريحة

---

### Step 9.1 — Navbar & Navigation

- [ ] إنشاء `src/components/layout/Navbar.tsx`:
  - شعار التطبيق + اسمه
  - عداد الـ streak في الزاوية
  - أيقونة الإشعارات مع Unread Badge
  - زر الخروج + صورة المستخدم

- [ ] Sidebar للشاشات الكبيرة + Bottom Nav للموبايل:
  - 📖 اليوم
  - ⏱ المؤقت
  - 📅 الجدول
  - 📊 التقدم
  - ⚙️ الإعدادات

---

### Step 9.2 — Loading & Error States

- [ ] Skeleton components لكل بطاقة أثناء الـ loading
- [ ] Error boundary يعرض رسالة عربية + زر "حاول مجدداً"
- [ ] Toast notifications للعمليات (نجاح/فشل) — استخدام shadcn Sonner

---

### Step 9.3 — Responsive Design

- [ ] التأكد من عمل التطبيق على الموبايل (320px+)
- [ ] الـ Bottom Navigation يظهر فقط على الشاشات الصغيرة
- [ ] جميع الجداول تستخدم horizontal scroll على الموبايل

---

### Step 9.4 — PWA Setup

- [ ] إنشاء `public/manifest.json`:
  ```json
  {
    "name": "الحصون الخمسة",
    "short_name": "الحصون",
    "dir": "rtl",
    "lang": "ar",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#0d1117",
    "theme_color": "#c8a84b",
    "icons": [...]
  }
  ```
- [ ] إضافة meta tags للـ PWA في root layout
- [ ] أيقونات التطبيق (192px + 512px)

---

---

## PHASE 10 — الاختبار والنشر (Testing & Deployment)

---

### Step 10.1 — اختبار يدوي شامل

- [ ] اختبار تدفق التسجيل والدخول الكامل
- [ ] اختبار الـ Onboarding Wizard
- [ ] التحقق من صحة حسابات الحصون الخمسة (مقارنة بنماذج الكتاب)
- [ ] اختبار المؤقت: بدء، إيقاف، انتهاء، حفظ الجلسة
- [ ] اختبار الإشعارات على Chrome وFirefox وSafari (iOS)
- [ ] اختبار الاستجابة على الموبايل

---

### Step 10.2 — Performance

- [ ] تشغيل Lighthouse audit — هدف: 90+ في جميع المحاور
- [ ] إضافة `loading.tsx` لكل صفحة (Next.js Suspense)
- [ ] تحسين صور الأيقونات (WebP format)

---

### Step 10.3 — النشر

- [ ] رفع المشروع على GitHub
- [ ] Deploy على Vercel:
  ```bash
  npx vercel --prod
  ```
- [ ] إضافة Environment Variables في Vercel Dashboard
- [ ] ربط دومين مخصص (اختياري)
- [ ] تحديث Appwrite allowed domains بدومين الإنتاج

---

---

## 📊 ملخص الـ Phases

| Phase | الوصف | التقدير الزمني |
|-------|-------|----------------|
| 0 | الإعداد والبنية التحتية | 2-3 ساعات |
| 1 | المصادقة + Onboarding | 4-5 ساعات |
| 2 | محرك الحصون (Engine) | 3-4 ساعات |
| 3 | Dashboard اليوم | 5-6 ساعات |
| 4 | المؤقت | 3-4 ساعات |
| 5 | الجدول | 2-3 ساعات |
| 6 | الإحصائيات | 3-4 ساعات |
| 7 | نظام الإشعارات | 4-5 ساعات |
| 8 | الإعدادات | 2-3 ساعات |
| 9 | Layout & UX | 3-4 ساعات |
| 10 | الاختبار والنشر | 2-3 ساعات |
| **المجموع** | | **~33-44 ساعة** |

---

## 🔑 ملاحظات مهمة

> **الأولوية القصوى:** Phase 2 (Engine) يجب أن يُبنى ويُختبر بشكل كامل قبل البدء في أي شيء آخر — كل الـ UI يعتمد على صحة هذه الحسابات.

> **قاعدة بيانات الصفحات:** ستحتاج لبناء ملف `src/data/quranPages.ts` يربط كل صفحة بالسورة واسمها لعرضها في الـ UI.

> **الإشعارات على iOS Safari:** تحتاج iOS 16.4+ وإضافة التطبيق لـ Home Screen كـ PWA — وضّح هذا للمستخدمين.

> **RTL:** تأكد من `dir="rtl"` على كل `<html>` وأن shadcn components تدعم RTL بشكل صحيح — بعضها يحتاج override بسيط في CSS.
