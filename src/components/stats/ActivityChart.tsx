"use client";

import { DailyLog } from "@/lib/appwrite/database";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import { format, subDays } from "date-fns";
import { ar } from "date-fns/locale";
import { useEffect, useState } from "react";

interface ActivityChartProps {
  logs: DailyLog[];
}

export function ActivityChart({ logs }: ActivityChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Generate last 15 days data
  const data = Array.from({ length: 15 }, (_, i) => {
    const date = subDays(new Date(), 14 - i);
    const dateStr = format(date, "yyyy-MM-dd");
    const log = logs.find((l) => l.date === dateStr);

    return {
      date: format(date, "MMM d", { locale: ar }),
      minutes: log?.totalMinutes || 0,
      tasks: log?.tasksCompleted?.length || 0,
      fullDate: dateStr,
    };
  });

  return (
    <div className="bg-white rounded-xl p-8 border border-surface-container-high shadow-sm shadow-emerald-900/5 h-full">
      <div className="flex items-center justify-between mb-8">
        <h4 className="font-serif text-2xl font-bold text-primary">
          نشاط المراجعة الأسبوعي
        </h4>
      </div>

      <div className="h-64 min-w-0" dir="ltr">
        {!mounted ? (
          <div className="w-full h-full bg-muted/20 animate-pulse rounded-lg" />
        ) : (
          <ResponsiveContainer width="99%" height={256}>
            <BarChart data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#ebe8e2"
              />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "#404946", fontFamily: "Cairo" }}
                interval="preserveStartEnd"
              />
              <YAxis hide axisLine={false} tickLine={false} />
              <Tooltip
                cursor={{ fill: "#f6f3ed" }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-3 border border-surface-container-high shadow-xl rounded-xl text-right space-y-1">
                        <p className="text-xs font-bold text-primary" dir="rtl">
                          {payload[0].payload.date}
                        </p>
                        <p
                          className="text-[10px] text-muted-foreground"
                          dir="rtl"
                        >
                          {payload[0].value} دقيقة تدبر
                        </p>
                        <p
                          className="text-[10px] text-muted-foreground"
                          dir="rtl"
                        >
                          {payload[0].payload.tasks} مهام مكتملة
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="minutes" radius={[4, 4, 0, 0]} barSize={24}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.minutes > 0 ? "#004338" : "#e5e2dc"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
