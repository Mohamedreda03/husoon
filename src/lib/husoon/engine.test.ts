import { describe, it, expect } from 'vitest';
import { calculateDayPlan } from './engine';
import { calculateFarReviewSchedule } from './calculator';
import { UserProgress } from './types';

describe('Husoon Engine Logic', () => {
  const newProgress: UserProgress = {
    memorizedRanges: [],
    dailyGoalType: 'page',
    dailyGoalValue: 1,
    pagesDone: 0,
    pagesPerDay: 1,
    startPage: 1,
  };

  it('should generate basic tasks for a new user', () => {
    const plan = calculateDayPlan(newProgress, new Date('2024-03-20'));
    
    expect(plan.currentPage).toBe(1);
    expect(plan.tasks.length).toBe(5); // new, qabli, layli, weekly, monthly — NO near/far
    
    const taskIds = plan.tasks.map(t => t.id);
    expect(taskIds).toContain('new');
    expect(taskIds).toContain('qabli');
    expect(taskIds).not.toContain('near');
    expect(taskIds).not.toContain('far');
  });

  it('should include Near Review after pages are memorized', () => {
    const progress: UserProgress = {
      ...newProgress,
      memorizedRanges: [{ from: 1, to: 5 }],
      pagesDone: 5,
    };
    const plan = calculateDayPlan(progress, new Date('2024-03-20'));
    
    const nearTask = plan.tasks.find(t => t.id === 'near');
    expect(nearTask).toBeDefined();
    expect(nearTask?.pages?.from).toBe(1);
    expect(nearTask?.pages?.to).toBe(5);
  });

  it('should include Far Review after 20 pages are memorized on specific days', () => {
    const progress: UserProgress = {
      ...newProgress,
      memorizedRanges: [{ from: 1, to: 25 }],
      pagesDone: 25,
    };
    // Saturday is 2024-03-23 (JS getDay is 6)
    const date = new Date('2024-03-23');
    const plan = calculateDayPlan(progress, date);
    
    const farTask = plan.tasks.find(t => t.id === 'far');
    expect(farTask).toBeDefined();
    expect(farTask?.pages?.from).toBe(1);
    expect(farTask?.pages?.to).toBe(5); // 25 - 20 = 5 pages for far review
  });

  it('should calculate correct Far Review schedule', () => {
    const progress: UserProgress = {
      ...newProgress,
      memorizedRanges: [{ from: 1, to: 100 }],
      pagesDone: 100,
    };
    const schedule = calculateFarReviewSchedule(progress);
    
    // 80 pages should be split into 2 days (40 per day)
    expect(schedule.length).toBe(2);
    expect(schedule[0].dayOfWeek).toBe(6); // Saturday
    expect(schedule[0].count).toBe(40);
    expect(schedule[1].dayOfWeek).toBe(5); // Friday
    expect(schedule[1].count).toBe(40);
  });

  it('should handle non-contiguous memorized ranges', () => {
    const progress: UserProgress = {
      ...newProgress,
      memorizedRanges: [{ from: 1, to: 20 }, { from: 582, to: 604 }],
      pagesDone: 43,
    };
    const plan = calculateDayPlan(progress, new Date('2024-03-20'));
    
    // currentPage should be first gap → page 21
    expect(plan.currentPage).toBe(21);
  });

  it('should handle fully memorized Quran', () => {
    const progress: UserProgress = {
      ...newProgress,
      memorizedRanges: [{ from: 1, to: 604 }],
      pagesDone: 604,
    };
    const plan = calculateDayPlan(progress, new Date('2024-03-20'));
    
    // currentPage should cap at 604
    expect(plan.currentPage).toBe(604);
  });
});
