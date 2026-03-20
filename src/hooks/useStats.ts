'use client';

import { useQuery } from '@tanstack/react-query';
import { useUser } from './useUser';
import { getUserLogs, getUserProfile } from '@/lib/appwrite/database';
import { estimateCompletionDate } from '@/lib/husoon/calculator';

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

      const totalPages = 604;
      const pagesDone = profile.pagesDone || 0;
      const completionPercentage = Math.round((pagesDone / totalPages) * 100);
      const remainingPages = totalPages - pagesDone;
      const estimatedCompletion = estimateCompletionDate({
        pagesDone,
        pagesPerDay: profile.pagesPerDay || 1,
        startPage: profile.startPage || 3,
      });

      // Calculate total minutes from logs
      const totalMinutes = logs.reduce((acc, log) => acc + (log.totalMinutes || 0), 0);
      const totalTasks = logs.reduce((acc, log) => acc + (log.tasksCompleted?.length || 0), 0);

      return {
        pagesDone,
        remainingPages,
        completionPercentage,
        estimatedCompletion,
        totalMinutes,
        totalTasks,
        streakCount: profile.streakCount || 0,
        logs: logs.slice(0, 30), // Last 30 days for charts
        totalJuz: Math.floor(pagesDone / 20),
      };
    },
    enabled: !!user,
  });
}
