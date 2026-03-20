'use client';

import { useUser } from '@/hooks/useUser';
import { useTodayPlan } from '@/hooks/useTodayPlan';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { updateUserProfile, getUserLogs } from '@/lib/appwrite/database';
import { parseMemorizedRanges, serializeMemorizedRanges, addMemorizedRange, removeMemorizedRange, getTotalMemorizedPages, getJuzMemorizationPercent, JUZ_START_PAGES } from '@/lib/husoon/memorization';
import { DailyGoalType, DAILY_GOAL_OPTIONS, MemorizedRange, getPagesPerDayFromGoalType } from '@/lib/husoon/types';
import { getPageInfo } from '@/data/quranPages';
import { 
  Settings as SettingsIcon, 
  Shield, 
  Trash2, 
  LogOut, 
  ShieldAlert,
  Save,
  Edit2,
  BookOpen,
  Download,
  Plus,
  X,
  Check,
  Target,
} from 'lucide-react';

export default function SettingsPage() {
  const { user, logout, isLoading: isUserLoading } = useUser();
  const { profile, isLoading: isProfileLoading } = useTodayPlan();
  const router = useRouter();

  // Memorization ranges state
  const [ranges, setRanges] = useState<MemorizedRange[]>([]);
  const [showAddRange, setShowAddRange] = useState(false);
  const [newRangeFrom, setNewRangeFrom] = useState(1);
  const [newRangeTo, setNewRangeTo] = useState(20);

  // Daily goal state
  const [dailyGoalType, setDailyGoalType] = useState<DailyGoalType>('page');

  // Edit name state
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState('');

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setRanges(parseMemorizedRanges(profile.memorizedRanges));
      setDailyGoalType((profile.dailyGoalType as DailyGoalType) || 'page');
      setEditedName(user?.name || '');
    }
  }, [profile, user]);

  const totalPages = getTotalMemorizedPages(ranges);
  const totalPercent = Math.round((totalPages / 604) * 100);

  const handleAddRange = () => {
    if (newRangeFrom < 1 || newRangeTo > 604 || newRangeFrom > newRangeTo) {
      toast.error('أرقام الصفحات غير صحيحة');
      return;
    }
    const updated = addMemorizedRange(ranges, { from: newRangeFrom, to: newRangeTo });
    setRanges(updated);
    setShowAddRange(false);
    setNewRangeFrom(1);
    setNewRangeTo(20);
  };

  const handleRemoveRange = (index: number) => {
    const rangeToRemove = ranges[index];
    const updated = removeMemorizedRange(ranges, rangeToRemove);
    setRanges(updated);
  };

  const handleQuickAdd = (from: number, to: number) => {
    const updated = addMemorizedRange(ranges, { from, to });
    setRanges(updated);
    toast.success('تم إضافة النطاق بنجاح');
  };

  const handleSaveAll = async () => {
    if (!profile) return;
    setIsSaving(true);
    try {
      const pagesPerDay = getPagesPerDayFromGoalType(dailyGoalType);
      const totalMemorized = getTotalMemorizedPages(ranges);
      await updateUserProfile(profile.$id, {
        memorizedRanges: serializeMemorizedRanges(ranges),
        dailyGoalType: dailyGoalType,
        dailyGoalValue: pagesPerDay,
        pagesDone: totalMemorized,
        pagesPerDay: pagesPerDay,
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
    } catch {
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
        memorizedRanges: '[]',
      });
      toast.success('تم إعادة تعيين التقدم بنجاح');
      router.push('/onboarding');
    } catch {
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
            
            {/* Left Column — Profile & Quick Actions */}
            <div className="lg:col-span-1 space-y-6">
              {/* Profile Section */}
              <section className="bg-surface-container-low rounded-xl p-8 text-center space-y-4 shadow-sm border border-primary/5">
                <div className="relative inline-block">
                  <div className="w-32 h-32 rounded-full border-4 border-surface-container-lowest bg-primary/10 flex flex-col items-center justify-center text-primary mx-auto">
                    <span className="font-serif text-4xl font-bold">{user?.name?.charAt(0) || 'م'}</span>
                  </div>
                  <button 
                    onClick={() => setIsEditingName(true)}
                    className="absolute bottom-1 left-1 bg-primary text-white p-2 rounded-full shadow-lg hover:bg-emerald-700 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  {isEditingName ? (
                    <div className="flex items-center gap-2 justify-center">
                      <input
                        type="text"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        className="px-3 py-1 bg-surface-container-lowest rounded-lg border border-primary/20 text-center font-sans font-bold text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                        autoFocus
                      />
                      <button
                        onClick={async () => {
                          if (profile && editedName.trim()) {
                            try {
                              await updateUserProfile(profile.$id, { name: editedName.trim() });
                              toast.success('تم تحديث الاسم');
                              setIsEditingName(false);
                            } catch { toast.error('فشل في تحديث الاسم'); }
                          }
                        }}
                        className="p-1 bg-primary text-white rounded-lg"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button onClick={() => setIsEditingName(false)} className="p-1 bg-error/10 text-error rounded-lg"><X className="w-4 h-4" /></button>
                    </div>
                  ) : (
                    <h3 className="font-sans font-bold text-xl text-primary">{user?.name || 'مستخدم'}</h3>
                  )}
                  <p className="font-sans text-sm text-on-surface-variant">{user?.email}</p>
                </div>
                <div className="pt-4 flex justify-center">
                  <span className="px-4 py-1 bg-secondary-container text-on-secondary-container text-xs rounded-full font-bold inline-block">
                    حافظ لـ {Math.floor(totalPages / 20)} جزء ({totalPercent}%)
                  </span>
                </div>
              </section>

              {/* Quick Actions */}
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

            {/* Right Column — Main Settings */}
            <div className="lg:col-span-2 space-y-8">

              {/* === Section 1: Memorization Ranges Manager === */}
              <section className="bg-surface-container-low rounded-xl p-8 space-y-6 shadow-sm border border-primary/5">
                <div className="flex items-center gap-3 text-primary border-b border-surface-variant pb-4">
                  <BookOpen className="w-6 h-6" />
                  <h3 className="font-sans font-bold text-lg">نطاقات الحفظ الحالية</h3>
                </div>

                {/* Summary Bar */}
                <div className="bg-primary/5 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <span className="font-sans text-sm text-on-surface-variant">إجمالي الحفظ</span>
                    <p className="font-serif text-2xl font-bold text-primary">{totalPages} <span className="text-sm font-sans font-normal">صفحة من 604</span></p>
                  </div>
                  <div className="w-24 h-24 relative">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="15.5" fill="none" stroke="currentColor" strokeWidth="2" className="text-surface-container-highest" />
                      <circle cx="18" cy="18" r="15.5" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-primary"
                        strokeDasharray={`${totalPercent} ${100 - totalPercent}`} strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center font-bold text-primary text-sm">{totalPercent}%</span>
                  </div>
                </div>

                {/* Ranges List */}
                {ranges.length > 0 ? (
                  <div className="space-y-2">
                    {ranges.map((range, idx) => (
                      <div key={`${range.from}-${range.to}`} className="flex items-center justify-between p-3 bg-surface-container-lowest rounded-xl border border-primary/5 group">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">{idx + 1}</div>
                          <div>
                            <p className="font-sans text-sm font-bold text-on-surface">صفحة {range.from} → {range.to}</p>
                            <p className="font-sans text-xs text-on-surface-variant">{getPageInfo(range.from).surah} — {getPageInfo(range.to).surah} · {range.to - range.from + 1} صفحة</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleRemoveRange(idx)}
                          className="opacity-0 group-hover:opacity-100 p-2 text-error hover:bg-error/10 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-on-surface-variant">
                    <p className="font-sans text-sm">لم يتم إضافة أي نطاقات بعد</p>
                  </div>
                )}

                {/* Add Range Form */}
                {showAddRange ? (
                  <div className="bg-surface-container-lowest rounded-xl p-4 border border-primary/10 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-sans text-xs text-on-surface-variant">من صفحة</label>
                        <input type="number" min={1} max={604} value={newRangeFrom} onChange={(e) => setNewRangeFrom(Number(e.target.value))}
                          className="w-full h-12 px-3 bg-surface rounded-xl border border-primary/10 focus:ring-2 focus:ring-primary font-sans outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-sans text-xs text-on-surface-variant">إلى صفحة</label>
                        <input type="number" min={1} max={604} value={newRangeTo} onChange={(e) => setNewRangeTo(Number(e.target.value))}
                          className="w-full h-12 px-3 bg-surface rounded-xl border border-primary/10 focus:ring-2 focus:ring-primary font-sans outline-none"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={handleAddRange} className="flex-1 py-2 bg-primary text-white font-bold rounded-xl text-sm">إضافة</button>
                      <button onClick={() => setShowAddRange(false)} className="px-4 py-2 bg-surface-container text-on-surface-variant rounded-xl text-sm">إلغاء</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setShowAddRange(true)} className="w-full py-3 bg-primary/5 text-primary font-bold rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-primary/10 transition-colors border border-dashed border-primary/20">
                    <Plus className="w-4 h-4" /> إضافة نطاق جديد
                  </button>
                )}

                {/* Quick Add Shortcuts */}
                <div className="space-y-2">
                  <p className="font-sans text-xs text-on-surface-variant font-bold">اختصارات سريعة</p>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => handleQuickAdd(582, 604)} className="px-3 py-1.5 bg-surface-container-highest text-on-surface-variant text-xs rounded-full font-bold hover:bg-surface-container transition-colors">جزء عم</button>
                    <button onClick={() => handleQuickAdd(562, 604)} className="px-3 py-1.5 bg-surface-container-highest text-on-surface-variant text-xs rounded-full font-bold hover:bg-surface-container transition-colors">آخر 3 أجزاء</button>
                    <button onClick={() => handleQuickAdd(502, 604)} className="px-3 py-1.5 bg-surface-container-highest text-on-surface-variant text-xs rounded-full font-bold hover:bg-surface-container transition-colors">آخر 5 أجزاء</button>
                    <button onClick={() => handleQuickAdd(1, 120)} className="px-3 py-1.5 bg-surface-container-highest text-on-surface-variant text-xs rounded-full font-bold hover:bg-surface-container transition-colors">أول 5 أجزاء</button>
                    <button onClick={() => handleQuickAdd(1, 302)} className="px-3 py-1.5 bg-surface-container-highest text-on-surface-variant text-xs rounded-full font-bold hover:bg-surface-container transition-colors">نصف القرآن</button>
                    <button onClick={() => handleQuickAdd(1, 604)} className="px-3 py-1.5 bg-tertiary-fixed text-on-tertiary-fixed text-xs rounded-full font-bold hover:opacity-90 transition-opacity">خاتم</button>
                  </div>
                </div>
              </section>

              {/* === Section 2: Daily Goal Selector === */}
              <section className="bg-surface-container-low rounded-xl p-8 space-y-6 shadow-sm border border-primary/5">
                <div className="flex items-center gap-3 text-primary border-b border-surface-variant pb-4">
                  <Target className="w-6 h-6" />
                  <h3 className="font-sans font-bold text-lg">الوتيرة اليومية للحفظ</h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {DAILY_GOAL_OPTIONS.map((option) => (
                    <button
                      key={option.type}
                      onClick={() => setDailyGoalType(option.type)}
                      className={`p-4 rounded-xl flex flex-col items-center gap-2 transition-all font-sans text-center border
                        ${dailyGoalType === option.type 
                          ? 'bg-primary text-on-primary shadow-lg scale-[1.02] border-primary' 
                          : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-high border-primary/5'
                        }`}
                    >
                      <span className={`text-lg font-bold ${dailyGoalType === option.type ? 'text-secondary-fixed' : 'text-primary'}`}>
                        {option.label}
                      </span>
                      <span className="text-xs opacity-80">{option.description}</span>
                    </button>
                  ))}
                </div>

                {dailyGoalType && (
                  <div className="bg-primary/5 rounded-xl p-3 text-center">
                    <p className="font-sans text-xs text-on-surface-variant">
                      الموعد المتوقع لختم القرآن: <span className="font-bold text-primary">
                        {(() => {
                          const remaining = 604 - totalPages;
                          const ppd = getPagesPerDayFromGoalType(dailyGoalType);
                          const days = Math.ceil(remaining / ppd);
                          if (days <= 0) return 'تم بحمد الله! 🎉';
                          const months = Math.floor(days / 30);
                          const remDays = days % 30;
                          if (months > 0) return `${months} شهر و ${remDays} يوم`;
                          return `${days} يوم`;
                        })()}
                      </span>
                    </p>
                  </div>
                )}
              </section>

              {/* === Section 3: Account Management === */}
              <section className="bg-surface-container-low rounded-xl p-8 space-y-6 shadow-sm border border-primary/5">
                <div className="flex items-center gap-3 text-primary border-b border-surface-variant pb-4">
                  <Shield className="w-6 h-6" />
                  <h3 className="font-sans font-bold text-lg">إدارة الحساب</h3>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <button 
                    onClick={handleResetProgress}
                    className="text-error font-sans font-bold text-sm hover:underline flex items-center gap-1"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    إعادة تعيين التقدم
                  </button>
                  <button 
                    onClick={handleSaveAll}
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
