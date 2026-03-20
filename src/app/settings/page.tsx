'use client';

import { useUser } from '@/hooks/useUser';
import { useNotifications } from '@/hooks/useNotifications';
import { useTodayPlan } from '@/hooks/useTodayPlan';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { updateUserProfile, getUserLogs } from '@/lib/appwrite/database';
import { 
  User as UserIcon, 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Database, 
  Trash2, 
  LogOut, 
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Save,
  Edit2,
  BookOpen,
  Download
} from 'lucide-react';

export default function SettingsPage() {
  const { user, logout, isLoading: isUserLoading } = useUser();
  const { profile, isLoading: isProfileLoading } = useTodayPlan();
  const { isSubscribed, requestPermission, subscribe } = useNotifications();
  const router = useRouter();

  const [pagesDone, setPagesDone] = useState(0);
  const [pagesPerDay, setPagesPerDay] = useState(1);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setPagesDone(profile.pagesDone);
      setPagesPerDay(profile.pagesPerDay);
    }
  }, [profile]);

  const handleNotificationToggle = async () => {
    if (!isSubscribed) {
      const granted = await requestPermission();
      if (granted) {
        await subscribe();
      }
    } else {
      toast.info('لإيقاف الإشعارات تماماً، يرجى تعطيلها من إعدادات المتصفح');
    }
  };

  const handleSaveProgress = async () => {
    if (!profile) return;
    setIsSaving(true);
    try {
      await updateUserProfile(profile.$id, {
        pagesDone: Number(pagesDone),
        pagesPerDay: Number(pagesPerDay),
      });
      toast.success('تم تحديث بيانات الحفظ بنجاح ✅');
    } catch {
      toast.error('فشل في حفظ الإعدادات');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportData = async () => {
    if (!user) return;
    try {
      const logs = await getUserLogs(user.$id);
      const dataStr = JSON.stringify({ profile, logs }, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `husoon-backup-${new Date().toISOString().split('T')[0]}.json`;
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      toast.success('تم تصدير البيانات بنجاح 📂');
    } catch (error) {
      toast.error('فشل في تصدير البيانات');
    }
  };

  const handleResetProgress = async () => {
    if (!profile) return;
    if (!window.confirm("ستفقد جميع بيانات الحفظ الخاصة بك. هل أنت متأكد؟")) return;
    
    try {
      await updateUserProfile(profile.$id, {
        pagesDone: 0,
        streakCount: 0,
        lastActiveDate: undefined,
      });
      toast.success('تم إعادة تعيين التقدم بنجاح');
      router.push('/onboarding');
    } catch (error) {
      toast.error('حدث خطأ أثناء إعادة التعيين');
    }
  };

  if (isUserLoading || isProfileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-right" dir="rtl">
      <main className="py-12 px-6 md:px-16 min-h-screen">
        <div className="max-w-4xl mx-auto mt-8">
          {/* Page Title */}
          <div className="mb-12">
            <h2 className="font-serif text-4xl text-primary font-bold">الإعدادات</h2>
            <p className="font-sans text-on-surface-variant mt-2">قم بتخصيص تجربتك في حفظ القرآن الكريم</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column (RTL: actually right column conceptually but visually based on grid) */}
            <div className="lg:col-span-1 space-y-6">
              {/* Profile Section */}
              <section className="bg-surface-container-low rounded-xl p-8 text-center space-y-4 shadow-sm border border-primary/5">
                <div className="relative inline-block">
                  <div className="w-32 h-32 rounded-full border-4 border-surface-container-lowest bg-primary/10 flex flex-col items-center justify-center text-primary mx-auto">
                    <span className="font-serif text-4xl font-bold">{user?.name?.charAt(0) || 'م'}</span>
                  </div>
                  <button className="absolute bottom-1 left-1 bg-primary text-white p-2 rounded-full shadow-lg hover:bg-emerald-700 transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <h3 className="font-sans font-bold text-xl text-primary">{user?.name || 'مستخدم'}</h3>
                  <p className="font-sans text-sm text-on-surface-variant">{user?.email}</p>
                </div>
                <div className="pt-4 flex justify-center">
                  <span className="px-4 py-1 bg-secondary-container text-on-secondary-container text-xs rounded-full font-bold inline-block">
                    حافظ لـ {Math.floor(pagesDone / 20)} جزء
                  </span>
                </div>
              </section>

              {/* Data Export / Actions */}
              <section className="bg-surface-container-low rounded-xl p-6 space-y-4 shadow-sm border border-primary/5">
                <h4 className="font-sans font-bold text-sm text-primary">إجراءات سريعة</h4>
                <div className="space-y-3">
                  <button onClick={handleExportData} className="w-full flex items-center justify-between p-3 rounded-lg border border-primary/10 bg-surface hover:bg-surface-container transition-all">
                    <span className="font-sans text-sm font-medium flex items-center gap-2">
                       <Download className="w-4 h-4" />
                       تصدير بياناتي
                    </span>
                  </button>
                  <button onClick={() => logout()} className="w-full flex items-center justify-between p-3 rounded-lg border border-error/20 bg-error/5 text-error hover:bg-error/10 transition-all">
                    <span className="font-sans text-sm font-bold flex items-center gap-2">
                       <LogOut className="w-4 h-4" />
                       تسجيل الخروج
                    </span>
                  </button>
                </div>
              </section>

            </div>

            {/* Right Column (RTL: main content) */}
            <div className="lg:col-span-2 space-y-8">
              {/* Plan Settings */}
              <section className="bg-surface-container-low rounded-xl p-8 space-y-8 shadow-sm border border-primary/5">
                <div className="flex items-center gap-3 text-primary border-b border-surface-variant pb-4">
                  <BookOpen className="w-6 h-6" />
                  <h3 className="font-sans font-bold text-lg">إعدادات الخطة والحفظ</h3>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="font-sans text-sm font-medium text-on-surface-variant px-1">الصفحات المحفوظة حالياً</label>
                    <input 
                      type="number"
                      value={pagesDone}
                      onChange={(e) => setPagesDone(Number(e.target.value))}
                      className="w-full h-14 px-4 bg-surface-container-lowest rounded-xl border border-primary/10 focus:ring-2 focus:ring-primary font-sans text-on-surface transition-all outline-none"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="font-sans text-sm font-medium text-on-surface-variant px-1">المعدل اليومي للحفظ</label>
                    <select 
                      value={pagesPerDay.toString()}
                      onChange={(e) => setPagesPerDay(Number(e.target.value))}
                      className="w-full h-14 px-4 bg-surface-container-lowest rounded-xl border border-primary/10 focus:ring-2 focus:ring-primary font-sans text-on-surface transition-all outline-none"
                    >
                      <option value="0.5">نصف صفحة يومياً</option>
                      <option value="1">صفحة واحدة يومياً</option>
                      <option value="2">صفحتان يومياً</option>
                      <option value="3">ثلاث صفحات يومياً</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* Account Management & Notifications */}
              <section className="bg-surface-container-low rounded-xl p-8 space-y-8 shadow-sm border border-primary/5">
                <div className="flex items-center gap-3 text-primary border-b border-surface-variant pb-4">
                  <Bell className="w-6 h-6" />
                  <h3 className="font-sans font-bold text-lg">تنبيهات وإدارة الحساب</h3>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-xl border border-primary/10">
                    <div>
                      <h4 className="font-sans font-bold text-sm">إشعارات المتصفح</h4>
                      <p className="text-xs text-muted-foreground mt-1">تلقي تنبيهات يومية بموعد المراجعة</p>
                    </div>
                    <button 
                      onClick={handleNotificationToggle}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isSubscribed ? 'bg-primary' : 'bg-surface-variant'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isSubscribed ? '-translate-x-6' : '-translate-x-1'}`} />
                    </button>
                  </div>
                </div>

                <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <button 
                    onClick={handleResetProgress}
                    className="text-error font-sans font-bold text-sm hover:underline flex items-center gap-1"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    إعادة تعيين التقدم
                  </button>
                  <button 
                    onClick={handleSaveProgress}
                    disabled={isSaving}
                    className="w-full sm:w-auto px-8 py-3 bg-primary text-white font-sans font-bold rounded-xl shadow-lg hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSaving ? '...جاري الحفظ' : 'حفظ التغييرات'}
                  </button>
                </div>
              </section>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
