import {
  findJuz,
  getPageMeta,
  getSurahMeta,
  meta,
} from "quran-meta/hafs";
import type {
  QuranPageInfo,
  QuranPageSegment,
  QuranReference,
} from "./types";

const MAX_PAGE = meta.numPages;
type QuranPageNumber = Parameters<typeof getPageMeta>[0];
type QuranSurahNumber = Parameters<typeof getSurahMeta>[0];
type QuranAyahNumber = Parameters<typeof findJuz>[1];

export function clampPage(page: number): number {
  if (!Number.isFinite(page)) {
    return 1;
  }

  return Math.max(1, Math.min(MAX_PAGE, Math.trunc(page)));
}

export function getPageSegments(pageNumber: number): QuranPageSegment[] {
  const page = clampPage(pageNumber) as QuranPageNumber;
  const pageMeta = getPageMeta(page);
  const [startSurah, startAyah] = pageMeta.first;
  const [endSurah, endAyah] = pageMeta.last;
  const segments: QuranPageSegment[] = [];

  for (let surah = startSurah; surah <= endSurah; surah += 1) {
    const typedSurah = surah as QuranSurahNumber;
    const surahMeta = getSurahMeta(typedSurah);
    const segmentStart = Number(surah === startSurah ? startAyah : 1) as QuranAyahNumber;
    const safeSegmentStart = Number(segmentStart || 1);
    const segmentEnd = Number(
      surah === endSurah ? endAyah : surahMeta.last[1],
    );
    segments.push({
      page,
      surah,
      surahName: surahMeta.name,
      ayahStart: safeSegmentStart,
      ayahEnd: segmentEnd,
      juz: findJuz(typedSurah, segmentStart),
    });
  }

  return segments;
}

export function getPageInfo(pageNumber: number): QuranPageInfo {
  const page = clampPage(pageNumber) as QuranPageNumber;
  const segments = getPageSegments(page);
  const first = segments[0];
  const last = segments[segments.length - 1];

  return {
    page,
    surah: first.surahName === last.surahName
      ? first.surahName
      : `${first.surahName} - ${last.surahName}`,
    juz: first.juz,
    surahNumber: first.surah,
    ayahStart: first.ayahStart,
    ayahEnd: last.ayahEnd,
    segments,
  };
}

export function getReferenceFromPageRange(
  fromPage: number,
  toPage: number,
): QuranReference {
  const pageStart = clampPage(Math.min(fromPage, toPage));
  const pageEnd = clampPage(Math.max(fromPage, toPage));
  const startMeta = getPageMeta(pageStart as QuranPageNumber);
  const endMeta = getPageMeta(pageEnd as QuranPageNumber);
  const startSurahMeta = getSurahMeta(startMeta.first[0] as QuranSurahNumber);
  const endSurahMeta = getSurahMeta(endMeta.last[0] as QuranSurahNumber);

  return {
    surahStart: startMeta.first[0],
    ayahStart: startMeta.first[1],
    surahEnd: endMeta.last[0],
    ayahEnd: endMeta.last[1],
    pageStart,
    pageEnd,
    juzStart: findJuz(
      startMeta.first[0] as QuranSurahNumber,
      startMeta.first[1] as QuranAyahNumber,
    ),
    juzEnd: findJuz(
      endMeta.last[0] as QuranSurahNumber,
      endMeta.last[1] as QuranAyahNumber,
    ),
    surahNameStart: startSurahMeta.name,
    surahNameEnd: endSurahMeta.name,
  };
}

export function getReferenceLabel(reference: QuranReference): string {
  if (reference.surahStart === reference.surahEnd) {
    return `${reference.surahNameStart} ${reference.ayahStart}-${reference.ayahEnd}`;
  }

  return `${reference.surahNameStart} ${reference.ayahStart} - ${reference.surahNameEnd} ${reference.ayahEnd}`;
}

export function getReferenceMetaLabel(reference: QuranReference): string {
  const pageLabel = reference.pageStart === reference.pageEnd
    ? `صفحة ${reference.pageStart}`
    : `ص ${reference.pageStart}-${reference.pageEnd}`;

  const juzLabel = reference.juzStart === reference.juzEnd
    ? `الجزء ${reference.juzStart}`
    : `الأجزاء ${reference.juzStart}-${reference.juzEnd}`;

  return `${pageLabel} · ${juzLabel}`;
}

export function getReaderHref(
  reference: QuranReference,
  title?: string,
): string {
  const params = new URLSearchParams({
    page: String(reference.pageStart),
    fromPage: String(reference.pageStart),
    toPage: String(reference.pageEnd),
  });

  if (title) {
    params.set("title", title);
  }

  return `/quran?${params.toString()}`;
}
