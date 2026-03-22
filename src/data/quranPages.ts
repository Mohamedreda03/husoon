import { getPageInfo as getQuranPageInfo } from "@/lib/quran/metadata";

export interface QuranPageInfo {
  page: number;
  surah: string;
  juz: number;
}

export const getPageInfo = (pageNumber: number): QuranPageInfo => {
  const info = getQuranPageInfo(pageNumber);
  return {
    page: info.page,
    surah: info.surah,
    juz: info.juz,
  };
};
