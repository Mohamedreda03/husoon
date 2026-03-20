'use client';

interface ProgressBarsProps {
  pagesDone: number;
}

export function ProgressBars({ pagesDone }: ProgressBarsProps) {
  const sections = [
    { name: 'العشرة الأولى', pages: 200, range: 'الجزء 1 - 10' },
    { name: 'العشرة الثانية', pages: 200, range: 'الجزء 11 - 20' },
    { name: 'العشرة الثالثة', pages: 204, range: 'الجزء 21 - 30' },
  ];

  let remainingPages = pagesDone;

  return (
    <div className="bg-surface-container-low rounded-xl p-8 relative border border-surface-container-high h-full">
      <h4 className="font-serif text-2xl font-bold text-primary mb-6">تقدم الأجزاء الحالية</h4>
      
      <div className="space-y-8">
        {sections.map((section, index) => {
          const currentProgress = Math.min(section.pages, remainingPages);
          const percentage = Math.round((currentProgress / section.pages) * 100);
          remainingPages = Math.max(0, remainingPages - section.pages);

          return (
            <div key={index}>
              <div className="flex justify-between items-center mb-2">
                <span className="font-sans text-sm font-bold text-primary">{section.name}</span>
                <span className="font-sans text-xs text-on-surface-variant">{percentage}%</span>
              </div>
              <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-1000" 
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-8 pt-6 border-t border-surface-container-high">
        <button className="w-full text-center text-secondary font-sans text-sm font-bold hover:underline">
          عرض جميع الأجزاء (30)
        </button>
      </div>
    </div>
  );
}
