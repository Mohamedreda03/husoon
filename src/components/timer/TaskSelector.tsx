'use client';

import { HusoonTask } from '@/lib/husoon/types';
import { useTimerStore } from '@/stores/timerStore';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

interface TaskSelectorProps {
  tasks: HusoonTask[];
  completedTaskIds: string[];
}

export function TaskSelector({ tasks, completedTaskIds }: TaskSelectorProps) {
  const { selectTask, selectedTaskId } = useTimerStore();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold font-serif text-primary text-right px-1">اختر المهمة</h3>
      <div className="grid grid-cols-1 gap-3">
        {tasks.map((task) => {
          const isSelected = selectedTaskId === task.id;
          const isCompleted = completedTaskIds.includes(task.id);

          return (
            <Card 
              key={task.id}
              className={`cursor-pointer transition-all duration-200 border-primary/10 hover:border-primary/30 ${
                isSelected ? 'ring-2 ring-primary bg-primary/5' : 'bg-card'
              } ${isCompleted ? 'opacity-60' : ''}`}
              onClick={() => selectTask(task.id, task.name, task.durationMinutes)}
            >
              <CardContent className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {task.durationMinutes} د
                  </div>
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  ) : (
                    <Circle className="w-4 h-4 text-muted/30" />
                  )}
                </div>
                
                <div className="text-right">
                  <span className={`font-bold block ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                    {task.name}
                  </span>
                  <p className="text-[10px] text-muted-foreground">الحصن {task.fortressNumber}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
