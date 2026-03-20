import { describe, it, expect } from 'vitest';
import {
  parseMemorizedRanges,
  serializeMemorizedRanges,
  mergeOverlappingRanges,
  addMemorizedRange,
  removeMemorizedRange,
  getTotalMemorizedPages,
  isPageMemorized,
  getNextPageToMemorize,
  getMemorizedJuz,
  getJuzMemorizationPercent,
  getLastNMemorizedPages,
} from './memorization';

describe('Memorization Helpers', () => {
  describe('parseMemorizedRanges', () => {
    it('should parse valid JSON', () => {
      const result = parseMemorizedRanges('[{"from":1,"to":20},{"from":582,"to":604}]');
      expect(result).toEqual([{ from: 1, to: 20 }, { from: 582, to: 604 }]);
    });

    it('should return empty array for null/undefined', () => {
      expect(parseMemorizedRanges(null)).toEqual([]);
      expect(parseMemorizedRanges(undefined)).toEqual([]);
      expect(parseMemorizedRanges('')).toEqual([]);
    });

    it('should filter invalid ranges', () => {
      const result = parseMemorizedRanges('[{"from":0,"to":20},{"from":1,"to":605},{"from":50,"to":30}]');
      expect(result).toEqual([]);
    });

    it('should sort ranges by from', () => {
      const result = parseMemorizedRanges('[{"from":100,"to":120},{"from":1,"to":20}]');
      expect(result[0].from).toBe(1);
      expect(result[1].from).toBe(100);
    });
  });

  describe('mergeOverlappingRanges', () => {
    it('should merge overlapping ranges', () => {
      const result = mergeOverlappingRanges([{ from: 1, to: 10 }, { from: 5, to: 15 }]);
      expect(result).toEqual([{ from: 1, to: 15 }]);
    });

    it('should merge adjacent ranges', () => {
      const result = mergeOverlappingRanges([{ from: 1, to: 10 }, { from: 11, to: 20 }]);
      expect(result).toEqual([{ from: 1, to: 20 }]);
    });

    it('should keep non-overlapping ranges separate', () => {
      const result = mergeOverlappingRanges([{ from: 1, to: 10 }, { from: 20, to: 30 }]);
      expect(result).toEqual([{ from: 1, to: 10 }, { from: 20, to: 30 }]);
    });

    it('should handle empty array', () => {
      expect(mergeOverlappingRanges([])).toEqual([]);
    });
  });

  describe('addMemorizedRange', () => {
    it('should add and merge', () => {
      const ranges = [{ from: 1, to: 10 }];
      const result = addMemorizedRange(ranges, { from: 8, to: 20 });
      expect(result).toEqual([{ from: 1, to: 20 }]);
    });

    it('should clamp to valid range', () => {
      const result = addMemorizedRange([], { from: -5, to: 700 });
      expect(result).toEqual([{ from: 1, to: 604 }]);
    });

    it('should handle reversed from/to', () => {
      const result = addMemorizedRange([], { from: 20, to: 10 });
      expect(result).toEqual([{ from: 10, to: 20 }]);
    });
  });

  describe('removeMemorizedRange', () => {
    it('should punch a hole in a range', () => {
      const ranges = [{ from: 1, to: 30 }];
      const result = removeMemorizedRange(ranges, { from: 10, to: 20 });
      expect(result).toEqual([{ from: 1, to: 9 }, { from: 21, to: 30 }]);
    });

    it('should trim from the start', () => {
      const ranges = [{ from: 1, to: 20 }];
      const result = removeMemorizedRange(ranges, { from: 1, to: 10 });
      expect(result).toEqual([{ from: 11, to: 20 }]);
    });

    it('should remove entirely', () => {
      const ranges = [{ from: 5, to: 10 }];
      const result = removeMemorizedRange(ranges, { from: 1, to: 20 });
      expect(result).toEqual([]);
    });

    it('should not affect non-overlapping ranges', () => {
      const ranges = [{ from: 1, to: 10 }, { from: 50, to: 60 }];
      const result = removeMemorizedRange(ranges, { from: 20, to: 30 });
      expect(result).toEqual([{ from: 1, to: 10 }, { from: 50, to: 60 }]);
    });
  });

  describe('getTotalMemorizedPages', () => {
    it('should count total pages', () => {
      expect(getTotalMemorizedPages([{ from: 1, to: 20 }, { from: 582, to: 604 }])).toBe(43);
    });

    it('should handle overlapping ranges', () => {
      expect(getTotalMemorizedPages([{ from: 1, to: 20 }, { from: 10, to: 30 }])).toBe(30);
    });

    it('should return 0 for empty', () => {
      expect(getTotalMemorizedPages([])).toBe(0);
    });
  });

  describe('isPageMemorized', () => {
    const ranges = [{ from: 1, to: 20 }, { from: 582, to: 604 }];

    it('should return true for memorized page', () => {
      expect(isPageMemorized(ranges, 10)).toBe(true);
      expect(isPageMemorized(ranges, 600)).toBe(true);
    });

    it('should return false for non-memorized page', () => {
      expect(isPageMemorized(ranges, 100)).toBe(false);
      expect(isPageMemorized(ranges, 21)).toBe(false);
    });
  });

  describe('getNextPageToMemorize', () => {
    it('should return first gap', () => {
      const ranges = [{ from: 1, to: 20 }];
      expect(getNextPageToMemorize(ranges, 1)).toBe(21);
    });

    it('should start from startPage', () => {
      const ranges = [{ from: 1, to: 10 }];
      expect(getNextPageToMemorize(ranges, 5)).toBe(11);
    });

    it('should skip to gap between ranges', () => {
      const ranges = [{ from: 1, to: 20 }, { from: 25, to: 30 }];
      expect(getNextPageToMemorize(ranges, 1)).toBe(21);
    });

    it('should return startPage when nothing is memorized', () => {
      expect(getNextPageToMemorize([], 1)).toBe(1);
    });

    it('should cap at 604', () => {
      const ranges = [{ from: 1, to: 604 }];
      expect(getNextPageToMemorize(ranges, 1)).toBe(604);
    });
  });

  describe('getMemorizedJuz', () => {
    it('should detect fully memorized juz', () => {
      // Juz 30 is pages 582-604
      const ranges = [{ from: 582, to: 604 }];
      expect(getMemorizedJuz(ranges)).toContain(30);
    });

    it('should not include partially memorized juz', () => {
      const ranges = [{ from: 582, to: 600 }]; // missing pages 601-604
      expect(getMemorizedJuz(ranges)).not.toContain(30);
    });

    it('should return empty for no memorization', () => {
      expect(getMemorizedJuz([])).toEqual([]);
    });
  });

  describe('getJuzMemorizationPercent', () => {
    it('should return 100 for fully memorized juz', () => {
      const ranges = [{ from: 582, to: 604 }];
      expect(getJuzMemorizationPercent(ranges, 30)).toBe(100);
    });

    it('should return 0 for unmemorized juz', () => {
      expect(getJuzMemorizationPercent([], 15)).toBe(0);
    });

    it('should return partial percentage', () => {
      // Juz 1 is pages 1-21 (21 pages)
      const ranges = [{ from: 1, to: 11 }]; // 11 out of 21
      const percent = getJuzMemorizationPercent(ranges, 1);
      expect(percent).toBeGreaterThan(0);
      expect(percent).toBeLessThan(100);
    });
  });

  describe('getLastNMemorizedPages', () => {
    it('should return last N pages', () => {
      const ranges = [{ from: 1, to: 50 }];
      const result = getLastNMemorizedPages(ranges, 20);
      expect(result).toEqual({ from: 31, to: 50 });
    });

    it('should return all if fewer than N', () => {
      const ranges = [{ from: 1, to: 10 }];
      const result = getLastNMemorizedPages(ranges, 20);
      expect(result).toEqual({ from: 1, to: 10 });
    });

    it('should return null for empty', () => {
      expect(getLastNMemorizedPages([], 20)).toBeNull();
    });
  });
});
