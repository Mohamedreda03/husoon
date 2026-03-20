'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle } from 'lucide-react';
import { HusoonTask } from '@/lib/husoon/types';

interface FortressGridProps {
  tasks: HusoonTask[];
  completedTaskIds: string[];
}

const FORTRESS_NAMES = [
  "قراءة الورد المستمر",
  "التحضير",
  "مراجعة البعيد",
  "مراجعة القريب",
  "الحفظ الجديد"
];

export function FortressGrid({ tasks, completedTaskIds }: FortressGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {[1, 2, 3, 4, 5].map((num) => {
        const fortressTasks = tasks.filter(t => t.fortressNumber === num);
        const isCompleted = fortressTasks.length > 0 && fortressTasks.every(t => completedTaskIds.includes(t.id));
        
        return (
          <Card 
            key={num} 
            className={`transition-all duration-300 border-primary/10 ${isCompleted ? 'bg-primary/5 border-primary/30 shadow-md' : 'bg-card'}`}
          >
            <CardContent className="p-4 flex flex-col items-center text-center gap-2">
              <div className="flex justify-between w-full items-start">
                <Badge variant={isCompleted ? "default" : "outline"} className={isCompleted ? "bg-primary" : "text-muted-foreground border-muted"}>
                  الحصن {num}
                </Badge>
                {isCompleted ? <CheckCircle2 className="w-5 h-5 text-primary" /> : <Circle className="w-5 h-5 text-muted/30" />}
              </div>
              <h3 className={`font-serif text-sm font-bold mt-2 ${isCompleted ? 'text-primary' : 'text-foreground'}`}>
                {FORTRESS_NAMES[num - 1]}
              </h3>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
