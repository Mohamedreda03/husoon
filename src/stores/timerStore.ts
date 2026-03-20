'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface TimerState {
  selectedTaskId: string | null;
  selectedTaskName: string | null;
  secondsRemaining: number;
  isRunning: boolean;
  isPaused: boolean;
  totalDurationSeconds: number;
}

interface TimerActions {
  selectTask: (taskId: string, name: string, durationMinutes: number) => void;
  start: () => void;
  pause: () => void;
  reset: () => void;
  tick: () => void;
  complete: () => void;
}

export const useTimerStore = create<TimerState & TimerActions>()(
  persist(
    (set, get) => ({
      selectedTaskId: null,
      selectedTaskName: null,
      secondsRemaining: 0,
      isRunning: false,
      isPaused: false,
      totalDurationSeconds: 0,

      selectTask: (taskId, name, durationMinutes) => {
        const seconds = durationMinutes * 60;
        set({
          selectedTaskId: taskId,
          selectedTaskName: name,
          secondsRemaining: seconds,
          totalDurationSeconds: seconds,
          isRunning: false,
          isPaused: false,
        });
      },

      start: () => set({ isRunning: true, isPaused: false }),
      
      pause: () => set({ isRunning: false, isPaused: true }),

      reset: () => set((state) => ({
        secondsRemaining: state.totalDurationSeconds,
        isRunning: false,
        isPaused: false,
      })),

      tick: () => set((state) => {
        if (state.secondsRemaining <= 0) {
          return { isRunning: false, secondsRemaining: 0 };
        }
        return { secondsRemaining: state.secondsRemaining - 1 };
      }),

      complete: () => set({
        isRunning: false,
        isPaused: false,
        secondsRemaining: 0,
      }),
    }),
    {
      name: 'husoon-timer-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
