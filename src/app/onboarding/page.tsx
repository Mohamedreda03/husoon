"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { databases } from "@/lib/appwrite/client";
import { APPWRITE_CONFIG } from "@/lib/appwrite/config";
import { useUser } from "@/hooks/useUser";
import { Query, ID } from "appwrite";
import { ArrowLeft, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DailyGoalType,
  DAILY_GOAL_OPTIONS,
  MemorizedRange,
  getPagesPerDayFromGoalType,
  CustomGoalUnit,
} from "@/lib/husoon/types";
import {
  addMemorizedRange,
  serializeMemorizedRanges,
  getTotalMemorizedPages,
} from "@/lib/husoon/memorization";
import { getPageInfo } from "@/data/quranPages";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [ranges, setRanges] = useState<MemorizedRange[]>([]);
  const [dailyGoalType, setDailyGoalType] = useState<DailyGoalType>("page");
  const [customGoalValue, setCustomGoalValue] = useState<number>(1);
  const [dailyGoalUnit, setDailyGoalUnit] = useState<CustomGoalUnit>('face');
  const [showAddRange, setShowAddRange] = useState(false);
  const [newRangeFrom, setNewRangeFrom] = useState(1);
  const [newRangeTo, setNewRangeTo] = useState(20);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useUser();
  const router = useRouter();
  const queryClient = useQueryClient();

  const totalPages = getTotalMemorizedPages(ranges);
  const totalPercent = Math.round((totalPages / 604) * 100);

  const handleQuickAdd = (from: number, to: number) => {
    const updated = addMemorizedRange(ranges, { from, to });
    setRanges(updated);
    toast.success("تم إضافة النطاق بنجاح");
  };

  const handleAddRange = () => {
    if (newRangeFrom < 1 || newRangeTo > 604 || newRangeFrom > newRangeTo) {
      toast.error("أرقام الصفحات غير صحيحة");
      return;
    }
    const updated = addMemorizedRange(ranges, {
      from: newRangeFrom,
      to: newRangeTo,
    });
    setRanges(updated);
    setShowAddRange(false);
    toast.success("تم إضافة النطاق بنجاح");
    setNewRangeFrom(1);
    setNewRangeTo(20);
  };

  const handleRemoveRange = (index: number) => {
    setRanges((prev) => prev.filter((_, i) => i !== index));
  };

  const handleComplete = async () => {
    if (!user) return;
    setIsSubmitting(true);
    try {
      const pagesPerDay = getPagesPerDayFromGoalType(dailyGoalType, customGoalValue, dailyGoalUnit);
      const profiles = await databases.listDocuments<import("@/lib/appwrite/database").UserProfile>(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.users,
        [Query.equal("userId", user.$id)],
      );

      if (profiles.documents.length > 0) {
        await databases.updateDocument(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.collections.users,
          profiles.documents[0].$id,
          {
            memorizedRanges: serializeMemorizedRanges(ranges),
            dailyGoalType: dailyGoalType,
            dailyGoalValue: customGoalValue,
            dailyGoalUnit: dailyGoalUnit,
            pagesDone: totalPages,
            pagesPerDay: pagesPerDay,
          },
        );
      } else {
        // Create new profile if it doesn't exist (failsafe)
        await databases.createDocument(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.collections.users,
          ID.unique(),
          {
            userId: user.$id,
            name: user.name,
            memorizedRanges: serializeMemorizedRanges(ranges),
            dailyGoalType: dailyGoalType,
            dailyGoalValue: customGoalValue,
            dailyGoalUnit: dailyGoalUnit,
            pagesDone: totalPages,
            pagesPerDay: pagesPerDay,
            streakCount: 0,
            startPage: 1,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
        );
      }

      // Invalidate profile cache so all pages get fresh data immediately
      await queryClient.invalidateQueries({ queryKey: ["profile", user.$id] });

      router.push("/");
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (step < 2) setStep(step + 1);
    else handleComplete();
  };

  return (
    <div
      className="text-on-surface bg-background min-h-screen flex flex-col items-center"
      dir="rtl"
    >
      {/* Background Ornaments */}
      <div className="fixed bottom-0 left-0 w-full overflow-hidden h-64 -z-10 pointer-events-none opacity-20">
        <div className="absolute -bottom-10 -left-10 w-96 h-96 bg-primary-container rounded-full blur-[100px]"></div>
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[800px] h-40 bg-surface-container-highest rounded-full blur-[80px]"></div>
      </div>

      <div className="w-full max-w-2xl px-8 py-16 md:py-24">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="font-serif text-5xl font-bold text-primary mb-4 tracking-tight">
            حصون
          </h1>
          <p className="font-sans text-on-surface-variant tracking-wide">
            رحلة تثبيت القرآن الكريم
          </p>
        </header>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-8 mb-20 w-full px-4">
          <div className="flex flex-col items-center gap-2">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-sm ${step >= 1 ? "bg-primary text-on-primary" : "bg-surface-container-highest text-outline"}`}
            >
              ١
            </div>
            <span
              className={`text-xs font-bold font-sans ${step >= 1 ? "text-primary" : "text-outline"}`}
            >
              الحفظ الحالي
            </span>
          </div>
          <div className="h-[2px] bg-surface-container-highest grow max-w-32">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: step >= 2 ? "100%" : "0%" }}
            ></div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-sm ${step >= 2 ? "bg-primary text-on-primary" : "bg-surface-container-highest text-outline"}`}
            >
              ٢
            </div>
            <span
              className={`text-xs font-medium font-sans ${step >= 2 ? "text-primary font-bold" : "text-outline"}`}
            >
              الخطة
            </span>
          </div>
        </div>

        {/* Main Content */}
        <main className="space-y-12 min-h-[350px]">
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="text-center space-y-4 mb-8">
                <h2 className="font-serif text-3xl md:text-4xl text-on-surface font-bold">
                  ماذا حفظت من القرآن؟
                </h2>
                <p className="font-sans text-on-surface-variant text-lg">
                  حدد النطاقات التي أتممت حفظها
                </p>
              </div>

              {/* Summary */}
              {totalPages > 0 && (
                <div className="bg-primary/5 rounded-xl p-4 mb-6 text-center">
                  <span className="font-serif text-3xl font-bold text-primary">
                    {totalPages}
                  </span>
                  <span className="font-sans text-sm text-on-surface-variant mr-2">
                    صفحة ({totalPercent}%)
                  </span>
                </div>
              )}

              {/* Added Ranges */}
              {ranges.length > 0 && (
                <div className="space-y-2 mb-6">
                  {ranges.map((range, idx) => (
                    <div
                      key={`${range.from}-${range.to}`}
                      className="flex items-center justify-between p-3 bg-surface-container-low rounded-xl border border-primary/5"
                    >
                      <div>
                        <p className="font-sans text-sm font-bold text-on-surface">
                          صفحة {range.from} → {range.to}
                        </p>
                        <p className="font-sans text-xs text-on-surface-variant">
                          {getPageInfo(range.from).surah} —{" "}
                          {getPageInfo(range.to).surah} ·{" "}
                          {range.to - range.from + 1} صفحة
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveRange(idx)}
                        className="p-2 text-error hover:bg-error/10 rounded-lg transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Range Form */}
              {showAddRange ? (
                <div className="bg-surface-container-low rounded-xl p-4 border border-primary/5 space-y-4 mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-sans text-xs text-on-surface-variant">
                        من صفحة
                      </label>
                      <Input 
                        type="number" 
                        min={1} 
                        max={604} 
                        value={newRangeFrom || ''} 
                        onChange={(e) => setNewRangeFrom(e.target.value === '' ? 0 : Number(e.target.value))}
                        className="h-10 text-center font-sans focus-visible:ring-primary"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-sans text-xs text-on-surface-variant">
                        إلى صفحة
                      </label>
                      <Input 
                        type="number" 
                        min={1} 
                        max={604} 
                        value={newRangeTo || ''} 
                        onChange={(e) => setNewRangeTo(e.target.value === '' ? 0 : Number(e.target.value))}
                        className="h-10 text-center font-sans focus-visible:ring-primary"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddRange}
                      className="flex-1 py-2 bg-primary text-white font-bold rounded-xl text-sm"
                    >
                      إضافة
                    </button>
                    <button
                      onClick={() => setShowAddRange(false)}
                      className="px-4 py-2 bg-surface-container text-on-surface-variant rounded-xl text-sm"
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowAddRange(true)}
                  className="w-full py-3 bg-primary/5 text-primary font-bold rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-primary/10 transition-colors border border-dashed border-primary/20 mb-6"
                >
                  <Plus className="w-4 h-4" /> إضافة نطاق يدوياً
                </button>
              )}

              {/* Quick Add Shortcuts */}
              <div className="space-y-3">
                <p className="font-sans text-xs text-on-surface-variant font-bold text-center">
                  اختصارات سريعة
                </p>
                <div className="grid grid-cols-2 xs:grid-cols-3 gap-3">
                  <button
                    onClick={() => handleQuickAdd(582, 604)}
                    className="py-3 px-4 rounded-xl bg-surface-container-low text-on-surface-variant text-xs font-bold font-sans hover:bg-surface-container transition-colors border border-primary/5"
                  >
                    جزء عم
                  </button>
                  <button
                    onClick={() => handleQuickAdd(562, 581)}
                    className="py-3 px-4 rounded-xl bg-surface-container-low text-on-surface-variant text-xs font-bold font-sans hover:bg-surface-container transition-colors border border-primary/5"
                  >
                    جزء تبارك
                  </button>
                  <button
                    onClick={() => handleQuickAdd(562, 604)}
                    className="py-3 px-4 rounded-xl bg-surface-container-low text-on-surface-variant text-xs font-bold font-sans hover:bg-surface-container transition-colors border border-primary/5"
                  >
                    آخر 3 أجزاء
                  </button>
                  <button
                    onClick={() => handleQuickAdd(1, 120)}
                    className="py-3 px-4 rounded-xl bg-surface-container-low text-on-surface-variant text-xs font-bold font-sans hover:bg-surface-container transition-colors border border-primary/5"
                  >
                    أول 5 أجزاء
                  </button>
                  <button
                    onClick={() => handleQuickAdd(1, 302)}
                    className="py-3 px-4 rounded-xl bg-surface-container-low text-on-surface-variant text-xs font-bold font-sans hover:bg-surface-container transition-colors border border-primary/5"
                  >
                    نصف القرآن
                  </button>
                  <button
                    onClick={() => handleQuickAdd(1, 604)}
                    className="py-3 px-4 rounded-xl bg-tertiary-fixed text-on-tertiary-fixed text-xs font-bold font-sans hover:opacity-90 transition-opacity"
                  >
                    خاتم ✨
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500 space-y-12">
              {/* Daily Goal */}
              <div className="space-y-6">
                <div className="text-center space-y-4">
                  <h2 className="font-serif text-3xl md:text-4xl text-on-surface font-bold">
                    ما هي وتيرة الحفظ اليومية؟
                  </h2>
                  <p className="font-sans text-on-surface-variant text-lg">
                    بناءً على هذا المعدل سيتم اقتراح مهامك اليومية
                  </p>
                </div>

                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 text-amber-900 text-sm font-sans max-w-sm mx-auto flex items-start gap-3">
                  <div className="mt-1 bg-amber-200 text-amber-900 rounded-full p-1 leading-none">ℹ️</div>
                  <div>
                    <p className="font-bold mb-1">تنبيه حول &quot;وحدة الحفظ&quot;:</p>
                    <p className="leading-relaxed text-xs">المقصود بالوحدة هنا هو &quot;وجه&quot; واحد من المصحف (Front Page). فكل ورقة لها وجهان، والنظام يعتمد الوجه الواحد كوحدة قياس أساسية.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 xs:grid-cols-2 gap-4 max-w-sm mx-auto">
                  {DAILY_GOAL_OPTIONS.map((option) => (
                    <button
                      key={option.type}
                      onClick={() => setDailyGoalType(option.type)}
                      className={`py-6 px-4 rounded-2xl flex flex-col items-center gap-2 transition-all font-sans font-bold ${dailyGoalType === option.type ? "bg-primary text-on-primary shadow-lg scale-105" : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high border border-outline/10"}`}
                    >
                      <span
                        className={`text-lg ${dailyGoalType === option.type ? "text-secondary-fixed" : "text-primary"}`}
                      >
                        {option.label}
                      </span>
                      <span className="text-xs opacity-80">
                        {option.description}
                      </span>
                    </button>
                  ))}
                </div>

                {dailyGoalType === 'custom' && (
                  <div className="bg-surface-container-lowest p-6 rounded-xl border border-primary/10 space-y-4 max-w-sm mx-auto mt-6 animate-in fade-in slide-in-from-top-2">
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-1 w-full">
                        <label className="font-sans font-bold text-sm text-primary text-right">الكمية اليومية المخصصة</label>
                        <Select 
                          value={dailyGoalUnit}
                          onValueChange={(value) => setDailyGoalUnit(value as CustomGoalUnit)}
                          dir="rtl"
                        >
                          <SelectTrigger className="w-full h-10 font-sans text-sm border-primary/10">
                            <SelectValue placeholder="اختر الوحدة" />
                          </SelectTrigger>
                          <SelectContent className="font-sans">
                            <SelectItem value="face">وجه</SelectItem>
                            <SelectItem value="page">صفحة كاملة</SelectItem>
                            <SelectItem value="quarter">ربع حزب</SelectItem>
                            <SelectItem value="verse">آية</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Button 
                            size="icon"
                            variant="outline"
                            className="h-8 w-8 rounded-full"
                            onClick={() => setCustomGoalValue(Math.max(0, customGoalValue - 0.5))}
                          >-</Button>
                          <Input 
                            type="number" 
                            step="0.1"
                            min="0"
                            value={customGoalValue || ''} 
                            onChange={(e) => setCustomGoalValue(e.target.value === '' ? 0 : Number(e.target.value))}
                            className="w-16 h-10 text-center font-sans font-bold text-primary focus-visible:ring-primary"
                          />
                          <Button 
                            size="icon"
                            variant="outline"
                            className="h-8 w-8 rounded-full"
                            onClick={() => setCustomGoalValue(customGoalValue + 0.5)}
                          >+</Button>
                        </div>
                        <span className="font-sans text-xs text-on-surface-variant">الكمية</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Estimated completion */}
                <div className="bg-primary/5 rounded-xl p-4 mt-8 text-center max-w-sm mx-auto">
                  <p className="font-sans text-xs text-on-surface-variant">
                    الموعد المتوقع لختم القرآن:{" "}
                    <span className="font-bold text-primary">
                      {(() => {
                        const remaining = 604 - totalPages;
                        const ppd = getPagesPerDayFromGoalType(dailyGoalType, customGoalValue, dailyGoalUnit);
                        if (ppd <= 0) return "حدد الكمية للحساب...";
                        const days = Math.ceil(remaining / ppd);
                        if (days <= 0) return "تم بحمد الله! 🎉";
                        const months = Math.floor(days / 30);
                        const remDays = days % 30;
                        if (months > 0) return `${months} شهر و ${remDays} يوم`;
                        return `${days} يوم`;
                      })()}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-12 flex flex-col items-center gap-6">
            <button
              onClick={handleNext}
              disabled={isSubmitting}
              className="w-full max-w-sm py-5 rounded-xl bg-linear-to-br from-primary to-primary-container text-on-primary font-sans font-bold text-lg shadow-lg shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              <span>
                {isSubmitting
                  ? "جاري التحضير..."
                  : step === 2
                    ? "ابدأ رحلة الحفظ"
                    : "التالي"}
              </span>
              {!isSubmitting && <ArrowLeft className="w-5 h-5" />}
            </button>
            {step === 1 && (
              <button
                onClick={() => setStep(2)}
                className="font-sans text-secondary font-medium hover:text-on-secondary-container transition-colors"
              >
                تخطي — لم أحفظ شيئاً بعد
              </button>
            )}
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="font-sans text-outline hover:text-primary transition-colors mt-2 text-sm"
              >
                العودة للخطوة السابقة
              </button>
            )}
          </div>
        </main>

        <footer className="mt-20 text-center opacity-30 pointer-events-none">
          <p className="font-serif text-sm">«خيركم من تعلم القرآن وعلمه»</p>
        </footer>
      </div>
    </div>
  );
}
