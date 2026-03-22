'use client';

import { useTimerStore } from '@/stores/timerStore';
import { Play, Pause, RotateCcw, CheckCircle2 } from 'lucide-react';
import { useEffect } from 'react';

interface TimerDisplayProps {
  onComplete?: () => void;
  trackingMode?: 'page' | 'verse';
}

export function TimerDisplay({ onComplete, trackingMode = 'page' }: TimerDisplayProps) {
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
    <div className="relative group w-full flex flex-col items-center">
      {/* Spiritual Glow Effect */}
      <div className="absolute inset-0 bg-emerald-100 blur-[80px] opacity-30 rounded-full animate-pulse z-0 pointer-events-none scale-75"></div>
      
      {/* Circular Timer Visual */}
      <div className="relative w-full max-w-64 aspect-square md:max-w-[420px] rounded-full bg-surface-container-lowest border-12 border-surface-container-low flex items-center justify-center shadow-2xl shadow-emerald-900/5 z-10 transition-transform">
        {/* Progress Ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle className="text-secondary/10" cx="50%" cy="50%" fill="transparent" r="46%" stroke="currentColor" strokeWidth="12"></circle>
          <circle 
            className={`transition-all duration-1000 ease-linear ${isWarning ? 'text-error' : 'text-secondary'}`} 
            cx="50%" 
            cy="50%" 
            fill="transparent" 
            r="46%" 
            stroke="currentColor" 
            strokeDasharray="289%"
            strokeDashoffset={`${289 - (289 * progress) / 100}%`}
            strokeLinecap="round" 
            strokeWidth="12"
          ></circle>
        </svg>

        <div className="text-center z-10 w-full px-8">
          <span className="font-sans text-emerald-800/40 text-sm tracking-[0.2em] mb-2 block uppercase">
            {trackingMode === 'page' ? 'تركيز على الصفحة' : 'تركيز على الآيات'}
          </span>
          <div className={`font-serif text-6xl md:text-8xl font-bold flex justify-center items-center gap-2 ${isWarning ? 'text-error animate-pulse' : 'text-emerald-900'}`}>
            <span>{formatTime(secondsRemaining).split(':')[0]}</span>
            <span className="text-secondary animate-pulse">:</span>
            <span>{formatTime(secondsRemaining).split(':')[1]}</span>
          </div>
          <div className="mt-6 flex flex-col items-center">
            <span className="font-sans text-secondary font-bold text-lg mb-1 truncate w-full px-4">
              {selectedTaskName || 'لم يتم اختيار مهمة'}
            </span>
            <span className="font-sans text-emerald-800/40 text-xs uppercase tracking-widest">
              {isRunning ? 'جاري التركيز' : isPaused ? 'متوقف مؤقتاً' : 'جاهز للبدء'}
            </span>
          </div>
        </div>
      </div>

      {/* Timer Controls Floating */}
      <div className="-mt-8 flex items-center gap-4 z-20 bg-background/50 backdrop-blur-md rounded-full px-2 py-1 shadow-sm">
        <button 
          onClick={reset}
          className="w-14 h-14 rounded-full bg-surface-container-highest text-emerald-900 flex items-center justify-center hover:bg-surface-container-high transition-all"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        {!isRunning ? (
          <button 
            disabled={secondsRemaining === 0}
            onClick={start}
            className="w-20 h-20 rounded-full bg-linear-to-br from-primary to-primary-container text-white flex items-center justify-center shadow-xl shadow-emerald-950/30 hover:scale-105 transition-transform disabled:opacity-50"
          >
            <Play className="w-8 h-8 fill-current ml-1" />
          </button>
        ) : (
          <button 
            onClick={pause}
            className="w-20 h-20 rounded-full bg-linear-to-br from-primary to-primary-container text-white flex items-center justify-center shadow-xl shadow-emerald-950/30 hover:scale-105 transition-transform"
          >
            <Pause className="w-8 h-8 fill-current" />
          </button>
        )}

        <button 
          onClick={() => { if(onComplete) onComplete(); }}
          className="w-14 h-14 rounded-full bg-surface-container-highest text-emerald-900 flex items-center justify-center hover:bg-surface-container-high transition-all"
        >
          <CheckCircle2 className="w-6 h-6" />
        </button>
      </div>

      {/* Focus Quote */}
      <div className="text-center max-w-md mt-12 px-4">
        <p className="font-serif text-2xl text-emerald-800 italic leading-relaxed">
          &quot;خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ&quot;
        </p>
        <p className="font-sans text-sm text-emerald-800/40 mt-3">— حديث شريف</p>
      </div>
    </div>
  );
}
