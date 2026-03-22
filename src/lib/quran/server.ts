import { cache } from "react";
import { readFile } from "fs/promises";
import path from "path";
import { getPageInfo, getPageSegments } from "./metadata";
import type { QuranReaderPage, QuranReaderSegment } from "./types";

interface QuranChapterData {
  id: number;
  name: string;
  verses: Array<{
    id: number;
    text: string;
  }>;
}

const getChapterData = cache(async (surah: number): Promise<QuranChapterData> => {
  const filePath = path.join(
    process.cwd(),
    "node_modules",
    "quran-json",
    "dist",
    "chapters",
    `${surah}.json`,
  );

  const raw = await readFile(filePath, "utf8");
  return JSON.parse(raw) as QuranChapterData;
});

export const getReaderPage = cache(async (page: number): Promise<QuranReaderPage> => {
  const info = getPageInfo(page);
  const segments = getPageSegments(page);

  const readerSegments = await Promise.all(
    segments.map(async (segment): Promise<QuranReaderSegment> => {
      const chapter = await getChapterData(segment.surah);
      return {
        ...segment,
        verses: chapter.verses
          .filter((verse) => verse.id >= segment.ayahStart && verse.id <= segment.ayahEnd)
          .map((verse) => ({
            ayah: verse.id,
            text: verse.text,
          })),
      };
    }),
  );

  return {
    page: info.page,
    juz: info.juz,
    segments: readerSegments,
  };
});
