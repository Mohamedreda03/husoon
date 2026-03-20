import { describe, it, expect } from 'vitest';
import { calculateDayPlan } from './engine';
import { calculateFarReviewSchedule } from './calculator';
import { UserProgress } from './types';

describe('Husoon Engine Logic', () => {
  const newProgress: UserProgress = {
    pagesDone: 0,
    pagesPerDay: 1,
    startPage: 3
  };

  it('should generate basic tasks for a new user', () => {
    const plan = calculateDayPlan(newProgress, new Date('2024-03-20'));
    
    expect(plan.currentPage).toBe(3);
    expect(plan.tasks.length).toBe(5); // new, qabli, layli, weekly, monthly, and NO near/far
    
    const taskIds = plan.tasks.map(t => t.id);
    expect(taskIds).toContain('new');
    expect(taskIds).toContain('qabli');
    expect(taskIds).not.toContain('near');
    expect(taskIds).not.toContain('far');
  });

  it('should include Near Review after 1 page is done', () => {
    const progress: UserProgress = { ...newProgress, pagesDone: 5 };
    const plan = calculateDayPlan(progress, new Date('2024-03-20'));
    
    const nearTask = plan.tasks.find(t => t.id === 'near');
    expect(nearTask).toBeDefined();
    expect(nearTask?.pages).toEqual({ from: 3, to: 7 }); // current is 8 (3+5)
  });

  it('should include Far Review after 20 pages are done on specific days', () => {
    const progress: UserProgress = { ...newProgress, pagesDone: 25 }; // 25 pages done
    // Saturday is 2024-03-23 (JS getDay is 6)
    const date = new Date('2024-03-23');
    const plan = calculateDayPlan(progress, date);
    
    const farTask = plan.tasks.find(t => t.id === 'far');
    expect(farTask).toBeDefined();
    expect(farTask?.pages?.from).toBe(3);
    expect(farTask?.pages?.to).toBe(7); // 25 - 20 = 5 pages for far review
  });

  it('should calculate correct Far Review schedule', () => {
    const progress: UserProgress = { ...newProgress, pagesDone: 100 }; // 80 pages for far review
    const schedule = calculateFarReviewSchedule(progress);
    
    // 80 pages should be split into 2 days (40 per day)
    expect(schedule.length).toBe(2);
    expect(schedule[0].dayOfWeek).toBe(6); // Saturday
    expect(schedule[0].count).toBe(40);
    expect(schedule[1].dayOfWeek).toBe(5); // Friday
    expect(schedule[1].count).toBe(40);
  });
});
