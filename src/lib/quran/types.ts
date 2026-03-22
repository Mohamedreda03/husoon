export interface QuranReference {
  surahStart: number;
  ayahStart: number;
  surahEnd: number;
  ayahEnd: number;
  pageStart: number;
  pageEnd: number;
  juzStart: number;
  juzEnd: number;
  surahNameStart: string;
  surahNameEnd: string;
}

export interface QuranPageSegment {
  page: number;
  surah: number;
  surahName: string;
  ayahStart: number;
  ayahEnd: number;
  juz: number;
}

export interface QuranPageInfo {
  page: number;
  surah: string;
  juz: number;
  surahNumber: number;
  ayahStart: number;
  ayahEnd: number;
  segments: QuranPageSegment[];
}

export interface QuranVerseText {
  ayah: number;
  text: string;
}

export interface QuranReaderSegment extends QuranPageSegment {
  verses: QuranVerseText[];
}

export interface QuranReaderPage {
  page: number;
  juz: number;
  segments: QuranReaderSegment[];
}
