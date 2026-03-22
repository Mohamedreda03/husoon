'use client';

import { useQuery } from '@tanstack/react-query';
import { useUser } from './useUser';
import { getUserProfile } from '@/lib/appwrite/database';
import { calculateDayPlan } from '@/lib/husoon/engine';
import { parseMemorizedRanges, getTotalMemorizedPages } from '@/lib/husoon/memorization';
import { getPagesPerDayFromGoalType, CustomGoalUnit, getTrackingModeFromUnit } from '@/lib/husoon/types';
import type { DailyGoalType, UserProgress } from '@/lib/husoon/types';

export function useTodayPlan() {
  const { user } = useUser();

  const profileQuery = useQuery({
    queryKey: ['profile', user?.$id],
    queryFn: () => (user?.$id ? getUserProfile(user.$id) : null),
    enabled: !!user?.$id,
  });

  const plan = profileQuery.data
    ? (() => {
        const ranges = parseMemorizedRanges(profileQuery.data.memorizedRanges);
        const goalType = (profileQuery.data.dailyGoalType as DailyGoalType) || 'page';
        const goalUnit = (profileQuery.data.dailyGoalUnit as CustomGoalUnit) || 'face';
        const pagesPerDay = getPagesPerDayFromGoalType(
          goalType, 
          profileQuery.data.dailyGoalValue,
          goalUnit
        );
        const totalMemorized = getTotalMemorizedPages(ranges);

        const progress: UserProgress = {
          memorizedRanges: ranges,
          dailyGoalType: goalType,
          dailyGoalValue: profileQuery.data.dailyGoalValue || 1,
          dailyGoalUnit: goalUnit,
          pagesDone: totalMemorized,
          pagesPerDay: pagesPerDay,
          startPage: profileQuery.data.startPage || 1,
        };

        return {
          ...calculateDayPlan(progress, new Date()),
          trackingMode: getTrackingModeFromUnit(goalUnit),
        };
      })()
    : null;

  return {
    plan,
    profile: profileQuery.data,
    isLoading: profileQuery.isLoading || profileQuery.isFetching,
  };
}
