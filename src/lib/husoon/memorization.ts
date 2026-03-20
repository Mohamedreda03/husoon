import { MemorizedRange, PageRange } from './types';

/**
 * Parse memorized ranges from JSON string (stored in Appwrite)
 */
export function parseMemorizedRanges(json: string | null | undefined): MemorizedRange[] {
  if (!json) return [];
  try {
    const parsed = JSON.parse(json);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((r: MemorizedRange) => typeof r.from === 'number' && typeof r.to === 'number' && r.from >= 1 && r.to <= 604 && r.from <= r.to)
      .sort((a: MemorizedRange, b: MemorizedRange) => a.from - b.from);
  } catch {
    return [];
  }
}

/**
 * Serialize memorized ranges to JSON string for storage
 */
export function serializeMemorizedRanges(ranges: MemorizedRange[]): string {
  return JSON.stringify(mergeOverlappingRanges(ranges));
}

/**
 * Merge overlapping or adjacent ranges
 */
export function mergeOverlappingRanges(ranges: MemorizedRange[]): MemorizedRange[] {
  if (ranges.length === 0) return [];

  const sorted = [...ranges].sort((a, b) => a.from - b.from);
  const merged: MemorizedRange[] = [{ ...sorted[0] }];

  for (let i = 1; i < sorted.length; i++) {
    const last = merged[merged.length - 1];
    const current = sorted[i];

    // Overlapping or adjacent (e.g., [1,5] and [6,10] → [1,10])
    if (current.from <= last.to + 1) {
      last.to = Math.max(last.to, current.to);
    } else {
      merged.push({ ...current });
    }
  }

  return merged;
}

/**
 * Add a new memorized range, merging with existing ranges
 */
export function addMemorizedRange(ranges: MemorizedRange[], newRange: MemorizedRange): MemorizedRange[] {
  // Validate the new range
  const validRange: MemorizedRange = {
    from: Math.max(1, Math.min(newRange.from, newRange.to)),
    to: Math.min(604, Math.max(newRange.from, newRange.to)),
  };
  return mergeOverlappingRanges([...ranges, validRange]);
}

/**
 * Remove a range from memorized ranges (subtract/punch a hole)
 */
export function removeMemorizedRange(ranges: MemorizedRange[], rangeToRemove: MemorizedRange): MemorizedRange[] {
  const result: MemorizedRange[] = [];

  for (const range of ranges) {
    // No overlap — keep as is
    if (rangeToRemove.to < range.from || rangeToRemove.from > range.to) {
      result.push({ ...range });
      continue;
    }

    // Left portion survives
    if (rangeToRemove.from > range.from) {
      result.push({ from: range.from, to: rangeToRemove.from - 1 });
    }

    // Right portion survives
    if (rangeToRemove.to < range.to) {
      result.push({ from: rangeToRemove.to + 1, to: range.to });
    }
  }

  return result;
}

/**
 * Get total number of memorized pages across all ranges
 */
export function getTotalMemorizedPages(ranges: MemorizedRange[]): number {
  const merged = mergeOverlappingRanges(ranges);
  return merged.reduce((sum, range) => sum + (range.to - range.from + 1), 0);
}

/**
 * Check if a specific page is memorized
 */
export function isPageMemorized(ranges: MemorizedRange[], page: number): boolean {
  return ranges.some(r => page >= r.from && page <= r.to);
}

/**
 * Get the next page that needs to be memorized (first gap after startPage)
 */
export function getNextPageToMemorize(ranges: MemorizedRange[], startPage: number = 1): number {
  const merged = mergeOverlappingRanges(ranges);
  let page = startPage;

  for (const range of merged) {
    if (page < range.from) {
      return page; // Found a gap before this range
    }
    if (page >= range.from && page <= range.to) {
      page = range.to + 1; // Skip past this range
    }
  }

  return Math.min(page, 604); // Return next page or cap at 604
}

/**
 * Get list of fully memorized juz numbers (1-30)
 * A juz is ~20.13 pages. Using standard juz boundaries.
 */
export function getMemorizedJuz(ranges: MemorizedRange[]): number[] {
  const JUZ_START_PAGES = [
    1, 22, 42, 62, 82, 102, 121, 142, 162, 182,
    202, 222, 242, 262, 282, 302, 322, 342, 362, 382,
    402, 422, 442, 462, 482, 502, 522, 542, 562, 582,
  ];

  const memorizedJuz: number[] = [];

  for (let j = 0; j < 30; j++) {
    const juzStart = JUZ_START_PAGES[j];
    const juzEnd = j < 29 ? JUZ_START_PAGES[j + 1] - 1 : 604;

    // Check if every page in this juz is memorized
    let fullyMemorized = true;
    for (let p = juzStart; p <= juzEnd; p++) {
      if (!isPageMemorized(ranges, p)) {
        fullyMemorized = false;
        break;
      }
    }

    if (fullyMemorized) {
      memorizedJuz.push(j + 1);
    }
  }

  return memorizedJuz;
}

/**
 * Get the percentage of a specific juz that is memorized
 */
export function getJuzMemorizationPercent(ranges: MemorizedRange[], juzNumber: number): number {
  const JUZ_START_PAGES = [
    1, 22, 42, 62, 82, 102, 121, 142, 162, 182,
    202, 222, 242, 262, 282, 302, 322, 342, 362, 382,
    402, 422, 442, 462, 482, 502, 522, 542, 562, 582,
  ];

  const juzIndex = juzNumber - 1;
  if (juzIndex < 0 || juzIndex >= 30) return 0;

  const juzStart = JUZ_START_PAGES[juzIndex];
  const juzEnd = juzIndex < 29 ? JUZ_START_PAGES[juzIndex + 1] - 1 : 604;
  const totalPages = juzEnd - juzStart + 1;

  let memorizedCount = 0;
  for (let p = juzStart; p <= juzEnd; p++) {
    if (isPageMemorized(ranges, p)) {
      memorizedCount++;
    }
  }

  return Math.round((memorizedCount / totalPages) * 100);
}

/**
 * Get all memorized pages as a flat array — useful for near review calculation
 */
export function getMemorizedPagesList(ranges: MemorizedRange[]): number[] {
  const pages: number[] = [];
  for (const range of mergeOverlappingRanges(ranges)) {
    for (let p = range.from; p <= range.to; p++) {
      pages.push(p);
    }
  }
  return pages;
}

/**
 * Get last N memorized pages (for near review)
 */
export function getLastNMemorizedPages(ranges: MemorizedRange[], n: number): PageRange | null {
  const allPages = getMemorizedPagesList(ranges);
  if (allPages.length === 0) return null;

  const lastPages = allPages.slice(-n);
  if (lastPages.length === 0) return null;

  return {
    from: lastPages[0],
    to: lastPages[lastPages.length - 1],
  };
}

// Juz start pages exported for use in other modules
export const JUZ_START_PAGES = [
  1, 22, 42, 62, 82, 102, 121, 142, 162, 182,
  202, 222, 242, 262, 282, 302, 322, 342, 362, 382,
  402, 422, 442, 462, 482, 502, 522, 542, 562, 582,
];
