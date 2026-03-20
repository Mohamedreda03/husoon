'use client';

import { useQuery } from '@tanstack/react-query';
import { useUser } from './useUser';
import { getUserLogs, getUserProfile } from '@/lib/appwrite/database';
import { estimateCompletionDate } from '@/lib/husoon/calculator';
import { parseMemorizedRanges, getTotalMemorizedPages, getMemorizedJuz } from '@/lib/husoon/memorization';
import { getPagesPerDayFromGoalType, DailyGoalType, UserProgress } from '@/lib/husoon/types';

export function useStats() {
  const { user } = useUser();

  return useQuery({
    queryKey: ['stats', user?.$id],
    queryFn: async () => {
      if (!user) throw new Error('User not found');
      
      const [logs, profile] = await Promise.all([
        getUserLogs(user.$id),
        getUserProfile(user.$id)
      ]);

      if (!profile) throw new Error('Profile not found');

      const ranges = parseMemorizedRanges(profile.memorizedRanges);
      const totalPages = 604;
      const pagesDone = getTotalMemorizedPages(ranges);
      const completionPercentage = Math.round((pagesDone / totalPages) * 100);
      const remainingPages = totalPages - pagesDone;
      const goalType = (profile.dailyGoalType as DailyGoalType) || 'page';
      const pagesPerDay = getPagesPerDayFromGoalType(goalType);

      const progress: UserProgress = {
        memorizedRanges: ranges,
        dailyGoalType: goalType,
        dailyGoalValue: profile.dailyGoalValue || 1,
        pagesDone,
        pagesPerDay,
        startPage: profile.startPage || 1,
      };

      const estimatedCompletion = estimateCompletionDate(progress);

      // Calculate total minutes from logs
      const totalMinutes = logs.reduce((acc, log) => acc + (log.totalMinutes || 0), 0);
      const totalTasks = logs.reduce((acc, log) => acc + (log.tasksCompleted?.length || 0), 0);

      const memorizedJuz = getMemorizedJuz(ranges);

      return {
        pagesDone,
        remainingPages,
        completionPercentage,
        estimatedCompletion,
        totalMinutes,
        totalTasks,
        streakCount: profile.streakCount || 0,
        logs: logs.slice(0, 30),
        totalJuz: memorizedJuz.length,
        memorizedJuz,
        memorizedRanges: ranges,
      };
    },
    enabled: !!user,
  });
}
