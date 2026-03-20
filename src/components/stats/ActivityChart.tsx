'use client';

import { DailyLog } from '@/lib/appwrite/database';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { format, parseISO, subDays } from 'date-fns';
import { ar } from 'date-fns/locale';
import { useEffect, useState } from 'react';

interface ActivityChartProps {
  logs: DailyLog[];
}

export function ActivityChart({ logs }: ActivityChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate last 15 days data
  const data = Array.from({ length: 15 }, (_, i) => {
    const date = subDays(new Date(), 14 - i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const log = logs.find((l) => l.date === dateStr);
    
    return {
      date: format(date, 'MMM d', { locale: ar }),
      minutes: log?.totalMinutes || 0,
      tasks: log?.tasksCompleted?.length || 0,
      fullDate: dateStr,
    };
  });

  return (
    <Card className="border-primary/10 shadow-sm">
      <CardHeader className="py-4 border-b border-primary/5">
        <CardTitle className="text-lg font-serif font-bold text-primary">نشاط آخر 15 يوم</CardTitle>
      </CardHeader>
      <CardContent className="pt-6 pb-2 px-2 h-64 min-w-0">
        {!mounted ? (
          <div className="w-full h-full bg-muted/20 animate-pulse rounded-lg" />
        ) : (
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#64748b' }} 
                interval={1}
              />
              <YAxis 
                hide 
                axisLine={false} 
                tickLine={false} 
              />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-3 border border-primary/10 shadow-xl rounded-xl text-right space-y-1">
                        <p className="text-xs font-bold text-primary">{payload[0].payload.date}</p>
                        <p className="text-[10px] text-muted-foreground">{payload[0].value} دقيقة تدبر</p>
                        <p className="text-[10px] text-muted-foreground">{payload[0].payload.tasks} مهام مكتملة</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar 
                dataKey="minutes" 
                radius={[4, 4, 0, 0]} 
                barSize={24}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.minutes > 0 ? 'oklch(0.45 0.12 165)' : 'oklch(0.92 0.01 165)'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
