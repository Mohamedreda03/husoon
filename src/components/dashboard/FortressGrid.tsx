'use client';

import { HusoonTask } from '@/lib/husoon/types';
import { Star, History, Layers, Repeat, Headset } from 'lucide-react';

interface FortressGridProps {
  tasks: HusoonTask[];
  completedTaskIds: string[];
}

const FORTRESS_CONFIG = [
  { num: 1, title: 'الجديد', desc: 'المحفوظ اليومي المخطط له', val: '2 صفحة', icon: Star, colorClass: 'border-emerald-700 bg-emerald-100 text-emerald-800 hover:bg-emerald-50/50', valColor: 'text-emerald-900' },
  { num: 2, title: 'المراجعة القريبة', desc: 'آخر 20 صفحة تم حفظها', val: '20 صفحة', icon: History, colorClass: 'border-amber-500 bg-amber-100 text-amber-800 hover:bg-amber-50/50', valColor: 'text-amber-700' },
  { num: 3, title: 'المراجعة البعيدة', desc: 'المحفوظ القديم العام', val: '5 أجزاء', icon: Layers, colorClass: 'border-stone-400 bg-stone-200 text-stone-700 hover:bg-stone-50', valColor: 'text-stone-700' },
  { num: 4, title: 'التكرار', desc: 'عملية الربط والتثبيت', val: '15 مرة', icon: Repeat, colorClass: 'border-emerald-900 bg-emerald-900 text-emerald-100 hover:bg-emerald-50/50', valColor: 'text-emerald-900', iconBg: 'bg-emerald-900 text-emerald-100' },
  { num: 5, title: 'الاستماع', desc: 'المادة الصوتية للورد', val: '45 دقيقة', icon: Headset, colorClass: 'border-amber-300 bg-amber-200 text-amber-900 hover:bg-amber-50/50', valColor: 'text-amber-800', iconBg: 'bg-amber-200 text-amber-900' }
];

export function FortressGrid({ tasks, completedTaskIds }: FortressGridProps) {
  return (
    <section className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h3 className="font-serif text-3xl font-bold text-primary">الحصون الخمسة</h3>
          <p className="text-on-surface-variant text-sm mt-1">منهجية الحفظ والضبط المتكاملة</p>
        </div>
        <button className="text-secondary font-bold text-sm hover:underline">عرض المنهجية</button>
      </div>
      
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
