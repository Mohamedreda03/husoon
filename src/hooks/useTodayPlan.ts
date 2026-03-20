'use client';

import { useQuery } from '@tanstack/react-query';
import { useUser } from './useUser';
import { getUserProfile } from '@/lib/appwrite/database';
import { calculateDayPlan } from '@/lib/husoon/engine';
import { UserProgress } from '@/lib/husoon/types';

export function useTodayPlan() {
  const { user } = useUser();

  const profileQuery = useQuery({
    queryKey: ['profile', user?.$id],
    queryFn: () => (user?.$id ? getUserProfile(user.$id) : null),
    enabled: !!user?.$id,
  });

  const plan = profileQuery.data
    ? calculateDayPlan(
        {
          pagesDone: profileQuery.data.pagesDone,
          pagesPerDay: profileQuery.data.pagesPerDay,
          startPage: profileQuery.data.startPage,
        } as UserProgress,
        new Date()
      )
    : null;

  return {
    plan,
    profile: profileQuery.data,
    isLoading: profileQuery.isLoading,
  };
}
