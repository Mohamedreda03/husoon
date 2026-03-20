'use client';

import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Trophy, Calendar, Target, Clock, Star } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface StatsGridProps {
  stats: {
    pagesDone: number;
    remainingPages: number;
    completionPercentage: number;
    estimatedCompletion: Date;
    totalMinutes: number;
    totalTasks: number;
    streakCount: number;
    totalJuz: number;
  };
}

export function StatsGrid({ stats }: StatsGridProps) {
  const cards = [
    {
      title: 'الصفحات المكتملة',
      value: stats.pagesDone,
      label: 'صفحة',
      icon: BookOpen,
      color: 'text-primary',
      bg: 'bg-primary/5',
    },
    {
      title: 'الأجزاء المنجزة',
      value: stats.totalJuz,
      label: 'جزء',
      icon: Star,
      color: 'text-secondary',
      bg: 'bg-secondary/5',
    },
    {
      title: 'نسبة الإتمام',
      value: stats.completionPercentage,
      label: '%',
      icon: Target,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      title: 'الاستمرارية',
      value: stats.streakCount,
      label: 'يوم',
      icon: Trophy,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      title: 'إجمالي الدقائق',
      value: stats.totalMinutes,
      label: 'دقيقة',
      icon: Clock,
      color: 'text-sky-600',
      bg: 'bg-sky-50',
    },
    {
      title: 'تاريخ الختم المتوقع',
      value: format(stats.estimatedCompletion, 'yyyy/MM/dd'),
      label: '',
      icon: Calendar,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      isDate: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((card, index) => (
        <Card key={index} className="border-primary/10 shadow-sm overflow-hidden">
          <CardContent className="p-4 flex flex-col items-center text-center gap-2">
            <div className={`p-2 rounded-full ${card.bg} ${card.color}`}>
              <card.icon className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                {card.title}
              </p>
              <div className="flex items-baseline justify-center gap-1">
                <span className={`text-xl font-bold font-serif ${card.isDate ? 'text-sm' : ''}`}>
                  {card.value}
                </span>
                <span className="text-[10px] font-medium text-muted-foreground">{card.label}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
