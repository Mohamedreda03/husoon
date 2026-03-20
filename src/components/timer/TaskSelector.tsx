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
    <div className="bg-surface-container-low rounded-[2rem] p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-2xl text-emerald-950">مهام اليوم</h3>
        <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-[10px] font-bold font-sans">
          {tasks.length - completedTaskIds.length} مهام متبقية
        </span>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => {
          const isSelected = selectedTaskId === task.id;
          const isCompleted = completedTaskIds.includes(task.id);

          return (
            <div 
              key={task.id}
              onClick={() => selectTask(task.id, task.name, task.durationMinutes)}
              className={`p-5 rounded-2xl flex items-center gap-4 transition-colors cursor-pointer ${
                isSelected 
                  ? 'bg-surface-container-lowest border-r-4 border-secondary shadow-sm' 
                  : 'bg-surface/50 hover:bg-surface-container-highest'
              } ${isCompleted ? 'opacity-60' : ''}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isSelected ? 'bg-secondary/10 text-secondary' : 'bg-emerald-100 text-emerald-900'
              }`}>
                {!isCompleted ? (
                   <Clock className="w-5 h-5" />
                ) : (
                   <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                )}
              </div>
              
              <div className="flex-1 text-right">
                <h4 className={`font-sans font-bold text-sm ${isSelected ? 'text-emerald-900' : 'text-emerald-900'}`}>{task.name}</h4>
                <p className="font-sans text-xs text-emerald-800/60">الحصن {task.fortressNumber} • {task.durationMinutes} دقيقة</p>
              </div>

              {isSelected && !isCompleted && (
                 <CheckCircle2 className="w-5 h-5 text-secondary" />
              )}
            </div>
          );
        })}
      </div>
      
      <button className="w-full py-4 border-2 border-dashed border-outline-variant rounded-2xl text-emerald-800/40 font-sans text-sm hover:border-secondary hover:text-secondary transition-all">
        + إضافة ورد جديد
      </button>
    </div>
  );
}
