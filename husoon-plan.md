# 🕌 الحصون الخمسة — خطة بناء التطبيق الكاملة ✅
> نظام حفظ القرآن الكريم | Next.js + Appwrite + shadcn/ui + React Query

---

# 🚀 PHASES & STEPS

---

## PHASE 0 — الإعداد والبنية التحتية ✅
- [x] تثبيت المكتبات الأساسية (Appwrite, React Query, Zustand, shadcn)
- [x] إعداد Appwrite (Database, Collections, Permissions)
- [x] إعداد الـ Providers والخطوط العربية (Cairo/Amiri)

---

## PHASE 1 — نظام المصادقة (Authentication) ✅
- [x] إنشاء دوال Appwrite Auth و Hook `useUser`
- [x] بناء صفحات التسجيل والدخول و Onboarding Wizard
- [x] حماية المسارات باستخدام Middleware

---

## PHASE 2 — محرك الحصون الخمسة (The Engine) ✅
- [x] برمجة منطق حساب المهام اليومية في `engine.ts`
- [x] حساب جدول مراجعة البعيد في `calculator.ts`
- [x] التحقق من صحة الحسابات بالاختبارات (Vitest)

---

## PHASE 3 — الصفحة الرئيسية (Today Dashboard) ✅
- [x] بناء مكونات `TodayCard`, `FortressGrid`, `TaskList`
- [x] ربط البيانات الحية وتفعيل Optimistic Updates

---

## PHASE 4 — المؤقت (Timer) ✅
- [x] إنشاء `timerStore` وواجهة المؤقت التفاعلية
- [x] أتمتة إنهاء الجلسات وتحديث حالة المهام

---

## PHASE 5 — الجدول (Schedule) ✅
- [x] بناء `WeekView` و `PipelineTable`
- [x] عرض خطة الحفظ والمراجعة للأيام الـ 7 القادمة

---

## PHASE 6 — الإحصائيات (Stats) ✅
- [x] إنشاء `useStats` Hook لحساب كافة الأرقام
- [x] بناء الرسوم البيانية (Recharts) وتقدم الأجزاء

---

## PHASE 7 — نظام الإشعارات (Push Notifications) ✅
- [x] إعداد Service Worker والـ VAPID Keys
- [x] ربط اشتراكات الـ Push بـ Appwrite

---

## PHASE 8 — صفحة الإعدادات (Settings) ✅
- [x] تعديل بيانات الحفظ والوتيرة اليومية
- [x] إدارة البيانات (تصدير JSON / إعادة تعيين التقدم)

---

## PHASE 9 — الـ Layout والـ UX ✅
- [x] توحيد الـ Navbar وإضافة شريط التنقل السفلي للموبايل
- [x] تحسين الـ Responsive Design ومؤشرات التحميل

---

## PHASE 10 — الاختبار والنشر (Testing & Deployment) ✅
- [x] إصلاح كافة أخطاء الـ Lint والـ Type Check
- [x] نجاح عملية الـ Build النهائي للإنتاج
- [x] توثيق خطوات النشر في README.md

---

# 🏁 اكتمل المشروع بنجاح — تم بحمد الله 🕋✨
