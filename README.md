# 🕌 تطبيق الحصون الخمسة (Husoon)

نظام ذكي متكامل لحفظ القرآن الكريم وتطبيق منهج الحصون الخمسة، مبني باستخدام أحدث التقنيات.

## 🚀 التقنيات المستخدمة
- **Next.js 14+** (App Router)
- **Appwrite** (Backend & Auth)
- **TanStack Query v5**
- **Zustand** (State Management)
- **shadcn/ui** & **Tailwind CSS**
- **Web Push API** (Notifications)

## 🛠️ إعدادات النشر (Deployment)

### 1. المتطلبات الأساسية
- حساب على [Appwrite Cloud](https://cloud.appwrite.io/) أو نسخة Self-hosted.
- مشروع Next.js مربوط بـ GitHub.

### 2. متغيرات البيئة (Environment Variables)
يجب ضبط المتغيرات التالية في Vercel أو في ملف `.env.local`:

```env
# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
NEXT_PUBLIC_APPWRITE_DATABASE_ID=husoon_db
NEXT_PUBLIC_APPWRITE_USERS_COLLECTION=users
NEXT_PUBLIC_APPWRITE_LOGS_COLLECTION=dailyLogs
NEXT_PUBLIC_APPWRITE_SESSIONS_COLLECTION=sessions
NEXT_PUBLIC_APPWRITE_PUSH_COLLECTION=pushSubscriptions

# Web Push (VAPID Keys)
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_public_key
VAPID_PRIVATE_KEY=your_private_key
```

### 3. خطوات النشر على Vercel
1. ارفع الكود على GitHub.
2. اربط المستودع بـ Vercel.
3. أضف كافة متغيرات البيئة المذكورة أعلاه.
4. اضغط **Deploy**.
5. بعد النشر، تأكد من إضافة رابط الموقع (Domain) إلى قائمة **Web Platforms** في إعدادات Appwrite للسماح بالاتصال.

## 📱 ميزات التطبيق
- **المؤقت الذكي**: يساعدك على التركيز في جلسات الحفظ والمراجعة.
- **جدول الأنابيب**: حساب تلقائي لمراجعة البعيد وتوزيعه على أيام الأسبوع.
- **إحصائيات التقدم**: عرض بصري لمدى تقدمك في الحفظ والختم المتوقع.
- **تنبيهات يومية**: تذكير بموعد الحفظ لضمان الاستمرارية.

---
تم تطويره بكل حب لخدمة حفظة كتاب الله.
