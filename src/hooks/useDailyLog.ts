'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useUser } from './useUser';
import { getTodayLog, createOrUpdateLog, DailyLog } from '@/lib/appwrite/database';
import { format } from 'date-fns';

export function useDailyLog() {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const today = format(new Date(), 'yyyy-MM-dd');

  const logQuery = useQuery({
    queryKey: ['dailyLog', user?.$id, today],
    queryFn: () => (user?.$id ? getTodayLog(user.$id, today) : null),
    enabled: !!user?.$id,
  });

  const updateLogMutation = useMutation({
    mutationFn: (data: Partial<DailyLog>) => (user?.$id ? createOrUpdateLog(user.$id, today, data) : Promise.reject('No user')),
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ['dailyLog', user?.$id, today] });
      const previousLog = queryClient.getQueryData(['dailyLog', user?.$id, today]);
      queryClient.setQueryData(['dailyLog', user?.$id, today], (old: DailyLog | undefined | null) => ({
        ...(old as object),
        ...newData,
      }));
      return { previousLog };
    },
    onError: (err, newData, context) => {
      queryClient.setQueryData(['dailyLog', user?.$id, today], context?.previousLog);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['dailyLog', user?.$id, today] });
    },
  });

  const toggleTask = (taskId: string) => {
    const currentCompleted = logQuery.data?.tasksCompleted || [];
    let newCompleted;
    if (currentCompleted.includes(taskId)) {
      newCompleted = currentCompleted.filter(id => id !== taskId);
    } else {
      newCompleted = [...currentCompleted, taskId];
    }
    updateLogMutation.mutate({ tasksCompleted: newCompleted });
  };

  return {
    log: logQuery.data,
    isLoading: logQuery.isLoading,
    toggleTask,
    isUpdating: updateLogMutation.isPending,
  };
}
