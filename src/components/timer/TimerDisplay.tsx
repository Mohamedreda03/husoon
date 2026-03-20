'use client';

import { useTimerStore } from '@/stores/timerStore';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, CheckCircle2 } from 'lucide-react';
import { useEffect } from 'react';

interface TimerDisplayProps {
  onComplete?: () => void;
}

export function TimerDisplay({ onComplete }: TimerDisplayProps) {
  const { 
    secondsRemaining, 
    totalDurationSeconds, 
    isRunning, 
    isPaused, 
    selectedTaskName,
    start, 
    pause, 
    reset, 
    tick 
  } = useTimerStore();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        tick();
      }, 1000);
    } else if (secondsRemaining === 0 && isRunning) {
      if (onComplete) onComplete();
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsRemaining, tick, onComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = totalDurationSeconds > 0 
    ? (secondsRemaining / totalDurationSeconds) * 100 
    : 0;

  const isWarning = secondsRemaining > 0 && secondsRemaining < 120; // Last 2 minutes

  return (
    <div className="flex flex-col items-center justify-center space-y-8 py-10">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-serif font-bold text-primary">
          {selectedTaskName || 'لم يتم اختيار مهمة'}
        </h2>
        <p className="text-muted-foreground">حافظ على تركيزك في رحاب الآيات</p>
      </div>

      <div className="relative flex items-center justify-center w-64 h-64 md:w-80 md:h-80">
        {/* Progress Circle */}
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r="48%"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            className="text-muted/20"
          />
          <circle
            cx="50%"
            cy="50%"
            r="48%"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            strokeDasharray="301.6%"
            strokeDashoffset={`${301.6 - (301.6 * progress) / 100}%`}
            strokeLinecap="round"
            className={`transition-all duration-1000 ease-linear ${
              isWarning ? 'text-destructive' : 'text-primary'
            }`}
          />
        </svg>

        {/* Time Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-1">
          <span className={`text-6xl md:text-7xl font-mono font-bold tracking-tighter ${
            isWarning ? 'text-destructive animate-pulse' : 'text-foreground'
          }`}>
            {formatTime(secondsRemaining)}
          </span>
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
            {isRunning ? 'جاري الحساب' : isPaused ? 'متوقف مؤقتاً' : 'جاهز'}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-6">
        <Button 
          variant="outline" 
          size="icon" 
          className="h-14 w-14 rounded-full border-primary/20 hover:bg-primary/5"
          onClick={reset}
        >
          <RotateCcw className="w-6 h-6" />
        </Button>

        {!isRunning ? (
          <Button 
            size="icon" 
            className="h-20 w-20 rounded-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
            onClick={start}
            disabled={secondsRemaining === 0}
          >
            <Play className="w-10 h-10 fill-current ml-1" />
          </Button>
        ) : (
          <Button 
            size="icon" 
            className="h-20 w-20 rounded-full bg-secondary hover:bg-secondary/90 shadow-lg shadow-secondary/20"
            onClick={pause}
          >
            <Pause className="w-10 h-10 fill-current" />
          </Button>
        )}

        <Button 
          variant="outline" 
          size="icon" 
          className="h-14 w-14 rounded-full border-primary/20 hover:bg-primary/5"
          onClick={() => { if(onComplete) onComplete() }}
        >
          <CheckCircle2 className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}
