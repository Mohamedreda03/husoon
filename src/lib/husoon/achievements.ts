import { Award, Star, Medal, Trophy, Brain, Edit3, LucideIcon } from 'lucide-react';
import { isPageMemorized } from './memorization';
import { MemorizedRange } from './types';

export interface Achievement {
  name: string;
  icon: LucideIcon;
  active: boolean;
  color: string;
}

export function getAchievements(
  ranges: MemorizedRange[],
  juzCount: number,
  pagesDone: number,
  streakCount: number
): Achievement[] {
  return [
    { 
      name: 'أول جزء', 
      icon: Star, 
      active: juzCount >= 1,
      color: 'bg-primary-fixed text-on-primary-fixed-variant' 
    },
    { 
      name: 'ختم البقرة', 
      icon: Award, 
      active: (() => {
        // Check if pages 2-49 are all memorized (Al-Baqarah)
        for (let p = 2; p <= 49; p++) {
          if (!isPageMemorized(ranges, p)) return false;
        }
        return true;
      })(),
      color: 'bg-secondary-fixed text-on-secondary-container' 
    },
    { 
      name: '5 أجزاء', 
      icon: Medal, 
      active: juzCount >= 5,
      color: 'bg-primary-fixed text-on-primary-fixed-variant' 
    },
    { 
      name: '10 أجزاء', 
      icon: Brain, 
      active: juzCount >= 10,
      color: 'bg-tertiary-fixed text-on-tertiary-fixed-variant' 
    },
    { 
      name: '15 جزءاً', 
      icon: Trophy, 
      active: juzCount >= 15,
      color: 'bg-secondary-fixed text-on-secondary-container' 
    },
    { 
      name: '20 جزءاً', 
      icon: Medal, 
      active: juzCount >= 20,
      color: 'bg-primary-fixed text-on-primary-fixed-variant' 
    },
    { 
      name: '25 جزءاً', 
      icon: Brain, 
      active: juzCount >= 25,
      color: 'bg-tertiary-fixed text-on-tertiary-fixed-variant' 
    },
    { 
      name: 'خاتم القرآن', 
      icon: Edit3, 
      active: pagesDone >= 604,
      color: 'bg-secondary-fixed text-on-secondary-container' 
    },
    { 
      name: 'ثبات 30 يوم', 
      icon: Medal, 
      active: streakCount >= 30,
      color: 'bg-primary-fixed text-on-primary-fixed-variant' 
    },
    { 
      name: '100 صفحة', 
      icon: Trophy, 
      active: pagesDone >= 100,
      color: 'bg-tertiary-fixed text-on-tertiary-fixed-variant' 
    },
  ];
}

export function getLatestAchievement(
  ranges: MemorizedRange[],
  juzCount: number,
  pagesDone: number,
  streakCount: number
): string {
  const achievements = getAchievements(ranges, juzCount, pagesDone, streakCount);
  const activeAchievements = achievements.filter(a => a.active);
  
  if (activeAchievements.length === 0) return 'مبتدئ مبارك';

  // Define priority: we want to show the most "difficult" or "latest" milestone
  // Highest priority should be completion, then juz milestones, then others.
  const priority = [
    'خاتم القرآن',
    '25 جزءاً',
    '20 جزءاً',
    '15 جزءاً',
    '10 أجزاء',
    '5 أجزاء',
    '100 صفحة',
    'ختم البقرة',
    'أول جزء',
    'ثبات 30 يوم'
  ];

  for (const name of priority) {
    if (activeAchievements.some(a => a.name === name)) {
      return name;
    }
  }

  return activeAchievements[activeAchievements.length - 1].name;
}
