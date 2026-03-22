'use client';

import { ReferenceBadge } from '@/components/quran/ReferenceBadge';
import { HusoonTask } from '@/lib/husoon/types';
import { useRouter } from 'next/navigation';
import { useTimerStore } from '@/stores/timerStore';
import { Check } from 'lucide-react';

interface TaskListProps {
  tasks: HusoonTask[];
  completedTaskIds: string[];
  onToggleTask: (taskId: string) => void;
}

export function TaskList({ tasks, completedTaskIds, onToggleTask }: TaskListProps) {
  const router = useRouter();
  const { selectTask } = useTimerStore();

  const handleStartTimer = (task: HusoonTask) => {
    selectTask(task.id, task.name, task.durationMinutes);
    router.push('/timer');
  };

  const sortedTasks = [...tasks].sort((a, b) => a.fortressNumber - b.fortressNumber);

  return (
    <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm shadow-emerald-900/5 h-full">
      <h4 className="text-xl font-serif font-bold text-primary mb-6">قائمة المهام</h4>
      <ul className="space-y-4">
        {sortedTasks.map((task) => {
          const isCompleted = completedTaskIds.includes(task.id);

          return (
            <li
              key={task.id}
              className="flex items-center gap-4 group cursor-pointer"
              onClick={() => onToggleTask(task.id)}
            >
              <div
                className={`w-6 h-6 shrink-0 rounded-lg flex items-center justify-center transition-colors 
                  ${isCompleted
                    ? 'bg-emerald-100 text-emerald-600'
                    : 'border-2 border-emerald-100 group-hover:border-emerald-500'
                  }`}
              >
                {isCompleted && <Check className="w-4 h-4" strokeWidth={3} />}
              </div>

              <div className="flex-1 flex items-center justify-between gap-2 overflow-hidden">
                <div className="min-w-0">
                  <span className={`block text-sm truncate transition-colors ${isCompleted ? 'text-on-surface-variant line-through' : 'text-on-surface font-medium'}`}>
                    {task.name}
                  </span>
                  <ReferenceBadge
                    reference={task.references?.[0]}
                    title={task.name}
                    className="mt-1"
                    compact
                  />
                </div>

                {!isCompleted && (
                  <button
                    onClick={(e) => { e.stopPropagation(); handleStartTimer(task); }}
                    className="text-xs font-bold text-primary bg-primary/5 hover:bg-primary/10 px-3 py-1 rounded-full transition-colors shrink-0"
                  >
                    {task.durationMinutes} د
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
