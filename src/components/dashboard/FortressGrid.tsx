'use client';

import { HusoonTask, DailyGoalType, DAILY_GOAL_OPTIONS } from '@/lib/husoon/types';
import { Star, History, Layers, Repeat, Headset } from 'lucide-react';
import { useState } from 'react';

interface FortressGridProps {
  tasks: HusoonTask[];
  completedTaskIds: string[];
  totalMemorized?: number;
  dailyGoalType?: DailyGoalType;
}

export function FortressGrid({ tasks, completedTaskIds, totalMemorized = 0, dailyGoalType = 'page' }: FortressGridProps) {
  const [showMethodology, setShowMethodology] = useState(false);

  const goalOption = DAILY_GOAL_OPTIONS.find(o => o.type === dailyGoalType);
  const nearCount = Math.min(20, totalMemorized);
  const farCount = Math.max(0, totalMemorized - 20);

  const FORTRESS_CONFIG = [
    { num: 1, title: 'الجديد', desc: 'المحفوظ اليومي المخطط له', val: goalOption?.label || 'صفحة', icon: Star, colorClass: 'border-emerald-700 bg-emerald-100 text-emerald-800 hover:bg-emerald-50/50', valColor: 'text-emerald-900' },
    { num: 2, title: 'المراجعة القريبة', desc: 'آخر 20 صفحة تم حفظها', val: `${nearCount} صفحة`, icon: History, colorClass: 'border-amber-500 bg-amber-100 text-amber-800 hover:bg-amber-50/50', valColor: 'text-amber-700' },
    { num: 3, title: 'المراجعة البعيدة', desc: 'المحفوظ القديم العام', val: farCount > 0 ? `${farCount} صفحة` : 'لا يوجد', icon: Layers, colorClass: 'border-stone-400 bg-stone-200 text-stone-700 hover:bg-stone-50', valColor: 'text-stone-700' },
    { num: 4, title: 'التكرار', desc: 'عملية الربط والتثبيت', val: '15 مرة', icon: Repeat, colorClass: 'border-emerald-900 bg-emerald-900 text-emerald-100 hover:bg-emerald-50/50', valColor: 'text-emerald-900', iconBg: 'bg-emerald-900 text-emerald-100' },
    { num: 5, title: 'الاستماع', desc: 'المادة الصوتية للورد', val: `${Math.round((goalOption?.pagesPerDay || 1) * 15)} دقيقة`, icon: Headset, colorClass: 'border-amber-300 bg-amber-200 text-amber-900 hover:bg-amber-50/50', valColor: 'text-amber-800', iconBg: 'bg-amber-200 text-amber-900' }
  ];

  return (
    <section className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h3 className="font-serif text-3xl font-bold text-primary">الحصون الخمسة</h3>
          <p className="text-on-surface-variant text-sm mt-1">منهجية الحفظ والضبط المتكاملة</p>
        </div>
        <button 
          onClick={() => setShowMethodology(!showMethodology)}
          className="text-secondary font-bold text-sm hover:underline"
        >
          {showMethodology ? 'إخفاء المنهجية' : 'عرض المنهجية'}
        </button>
      </div>

      {/* Methodology Explanation */}
      {showMethodology && (
        <div className="bg-surface-container-lowest rounded-2xl p-6 border border-primary/10 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <h4 className="font-serif text-xl font-bold text-primary">منهجية الحصون الخمسة</h4>
          <div className="space-y-3 text-sm font-sans text-on-surface-variant leading-relaxed">
            <p><strong className="text-primary">الحصن الأول — الورد المستمر:</strong> قراءة جزأين يومياً من القرآن نظراً (ختمة كل 15 يوم) لتبقى صلتك بالقرآن كاملاً.</p>
            <p><strong className="text-primary">الحصن الثاني — التحضير:</strong> الاستعداد للحفظ الجديد بالقراءة 15 مرة (قبلي + ليلي + أسبوعي).</p>
            <p><strong className="text-primary">الحصن الثالث — مراجعة البعيد:</strong> مراجعة ما تجاوز 20 صفحة من الحفظ بتقسيمه على أيام الأسبوع.</p>
            <p><strong className="text-primary">الحصن الرابع — مراجعة القريب:</strong> مراجعة آخر 20 صفحة محفوظة يومياً لتثبيتها.</p>
            <p><strong className="text-primary">الحصن الخامس — الحفظ الجديد:</strong> حفظ الورد الجديد بإتقان وتركيز.</p>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {FORTRESS_CONFIG.map((fort) => {
          const fortressTasks = tasks.filter(t => t.fortressNumber === fort.num);
          const isCompleted = fortressTasks.length > 0 && fortressTasks.every(t => completedTaskIds.includes(t.id));
          
          return (
            <div key={fort.num} className={`bg-surface-container-low p-6 rounded-3xl space-y-4 transition-all border-r-8 ${fort.colorClass} ${isCompleted ? 'opacity-50 grayscale' : ''}`}>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${fort.iconBg || fort.colorClass.split(' ').slice(1,3).join(' ')}`}>
                <fort.icon className="w-6 h-6" />
              </div>
              <div>
                <h5 className="font-bold text-primary">{fort.title}</h5>
                <p className="text-xs text-on-surface-variant mt-1">{fort.desc}</p>
              </div>
              <p className={`text-2xl font-serif font-bold ${fort.valColor}`}>
                {fort.val}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
