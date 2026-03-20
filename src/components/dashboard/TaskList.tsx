'use client';

import { HusoonTask } from '@/lib/husoon/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { PlayCircle, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

import { useRouter } from 'next/navigation';
import { useTimerStore } from '@/stores/timerStore';

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

  // Sort tasks by time of day
  const timeWeight = { morning: 0, anytime: 1, evening: 2, night: 3 };
  const sortedTasks = [...tasks].sort((a, b) => timeWeight[a.timeOfDay] - timeWeight[b.timeOfDay]);

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold font-serif text-primary px-1">مهام اليوم</h3>
      {sortedTasks.map((task) => {
        const isCompleted = completedTaskIds.includes(task.id);
        
        return (
          <Card key={task.id} className={`transition-all duration-200 ${isCompleted ? 'bg-muted/50 opacity-80' : 'bg-card'}`}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="flex items-center gap-4 flex-1">
                <Checkbox 
                  id={task.id} 
                  checked={isCompleted} 
                  onCheckedChange={() => onToggleTask(task.id)}
                  className="w-6 h-6 border-primary/40 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <div className="space-y-1 text-right">
                  <label 
                    htmlFor={task.id}
                    className={`font-bold block cursor-pointer transition-all ${isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'}`}
                  >
                    {task.name}
                    {task.pages && (
                      <span className="text-xs font-normal text-secondary bg-secondary/10 px-2 py-0.5 rounded-full mr-2">
                        ص {task.pages.from} - {task.pages.to}
                      </span>
                    )}
                  </label>
                  <p className="text-xs text-muted-foreground">{task.description}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
                  <Clock className="w-3 h-3" />
                  <span>{task.durationMinutes} د</span>
                </div>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="text-primary hover:text-primary hover:bg-primary/10 h-10 w-10"
                  onClick={() => handleStartTimer(task)}
                >
                  <PlayCircle className="w-6 h-6" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
