"use client";

import { MemorizedRange } from "@/lib/husoon/types";
import {
  getJuzMemorizationPercent,
  JUZ_START_PAGES,
} from "@/lib/husoon/memorization";
import { useState } from "react";

interface ProgressBarsProps {
  pagesDone: number;
  memorizedRanges?: MemorizedRange[];
}

export function ProgressBars({
  pagesDone,
  memorizedRanges = [],
}: ProgressBarsProps) {
  const [showAll, setShowAll] = useState(false);

  // Group juz into sections of 10
  const sections = [
    {
      name: "العشرة الأولى",
      juzRange: [1, 10] as const,
      range: "الجزء 1 - 10",
    },
    {
      name: "العشرة الثانية",
      juzRange: [11, 20] as const,
      range: "الجزء 11 - 20",
    },
    {
      name: "العشرة الثالثة",
      juzRange: [21, 30] as const,
      range: "الجزء 21 - 30",
    },
  ];

  // Calculate section completion based on actual ranges
  const getSectionPercent = (juzFrom: number, juzTo: number): number => {
    let total = 0;
    let count = 0;
    for (let j = juzFrom; j <= juzTo; j++) {
      total += getJuzMemorizationPercent(memorizedRanges, j);
      count++;
    }
    return count > 0 ? Math.round(total / count) : 0;
  };

  return (
    <div className="bg-surface-container-low rounded-xl p-8 relative border border-surface-container-high h-full">
      <h4 className="font-serif text-2xl font-bold text-primary mb-6">
        تقدم الأجزاء الحالية
      </h4>

      <div className="space-y-8">
        {sections.map((section, index) => {
          const percentage = getSectionPercent(
            section.juzRange[0],
            section.juzRange[1],
          );

          return (
            <div key={index}>
              <div className="flex justify-between items-center mb-2">
                <span className="font-sans text-sm font-bold text-primary">
                  {section.name}
                </span>
                <span className="font-sans text-xs text-on-surface-variant">
                  {percentage}%
                </span>
              </div>
              <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-1000 rounded-full ${percentage === 100 ? "bg-emerald-500" : percentage > 0 ? "bg-primary" : "bg-surface-container"}`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Individual Juz Progress */}
      {showAll && (
        <div className="mt-6 space-y-3 animate-in fade-in duration-300">
          <div className="grid grid-cols-6 gap-2">
            {Array.from({ length: 30 }, (_, i) => i + 1).map((juz) => {
              const percent = getJuzMemorizationPercent(memorizedRanges, juz);
              return (
                <div
                  key={juz}
                  className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs font-bold border transition-all
                    ${
                      percent === 100
                        ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                        : percent > 0
                          ? "bg-amber-50 text-amber-800 border-amber-200"
                          : "bg-surface-container-highest text-on-surface-variant border-transparent"
                    }`}
                  title={`جزء ${juz}: ${percent}%`}
                >
                  <span className="font-serif">{juz}</span>
                  <span className="text-[8px] opacity-60">{percent}%</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-8 pt-6 border-t border-surface-container-high">
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full text-center text-secondary font-sans text-sm font-bold hover:underline"
        >
          {showAll ? "إخفاء التفاصيل" : "عرض جميع الأجزاء (30)"}
        </button>
      </div>
    </div>
  );
}
