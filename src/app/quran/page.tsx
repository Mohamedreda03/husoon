import Link from "next/link";
import { ChevronLeft, ChevronRight, BookOpenText } from "lucide-react";
import { ReferenceBadge } from "@/components/quran/ReferenceBadge";
import { AyahMarker } from "@/components/quran/AyahMarker";
import { QuranSearch } from "@/components/quran/QuranSearch";
import {
  clampPage,
  getPageInfo,
  getReferenceFromPageRange,
  getReferenceLabel,
  getReferenceMetaLabel,
} from "@/lib/quran/metadata";
import { getReaderPage } from "@/lib/quran/server";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

function readParam(
  searchParams: { [key: string]: string | string[] | undefined },
  key: string,
) {
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] : value;
}

function readPageValue(
  searchParams: { [key: string]: string | string[] | undefined },
  key: string,
  fallback: number,
) {
  const raw = readParam(searchParams, key);
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? clampPage(parsed) : fallback;
}

function buildPageHref(
  page: number,
  fromPage: number,
  toPage: number,
  title?: string,
) {
  const params = new URLSearchParams({
    page: String(page),
    fromPage: String(fromPage),
    toPage: String(toPage),
  });

  if (title) {
    params.set("title", title);
  }

  return `/quran?${params.toString()}`;
}

export default async function QuranPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const query = await searchParams;
  const title = readParam(query, "title");
  const currentPage = readPageValue(query, "page", 1);
  const fromPage = readPageValue(query, "fromPage", currentPage);
  const toPage = readPageValue(query, "toPage", currentPage);
  const selectedRange = getReferenceFromPageRange(fromPage, toPage);
  const readerPage = await getReaderPage(currentPage);
  const pageInfo = getPageInfo(currentPage);
  const pagesInRange = Array.from(
    { length: selectedRange.pageEnd - selectedRange.pageStart + 1 },
    (_, index) => selectedRange.pageStart + index,
  );

  return (
    <main className="min-h-screen bg-background px-4 py-10 md:px-12">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="overflow-hidden rounded-[2rem] border border-primary/10 bg-surface-container-low shadow-sm">
          <div className="relative overflow-hidden p-8 md:p-10">
            <div className="absolute left-0 top-0 h-48 w-48 -translate-x-1/3 -translate-y-1/3 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-56 w-56 translate-x-1/3 translate-y-1/3 rounded-full bg-secondary/10 blur-3xl" />
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/5 px-4 py-2 text-sm font-bold text-primary">
                  <BookOpenText className="h-4 w-4" />
                  <span>{title || "مصحف حصون"}</span>
                </div>
                <div>
                  <h1 className="font-serif text-4xl text-primary">
                    القرآن الكريم
                  </h1>
                  <p className="mt-2 text-sm text-on-surface-variant">
                    {getReferenceLabel(selectedRange)} ·{" "}
                    {getReferenceMetaLabel(selectedRange)}
                  </p>
                </div>
                <ReferenceBadge
                  reference={selectedRange}
                  title={title || "القرآن الكريم"}
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href={buildPageHref(
                    Math.max(1, currentPage - 1),
                    selectedRange.pageStart,
                    selectedRange.pageEnd,
                    title,
                  )}
                  className="inline-flex items-center gap-2 rounded-xl border border-primary/10 bg-background px-4 py-2 text-sm font-bold text-primary hover:bg-primary/5"
                >
                  <ChevronRight className="h-4 w-4" />
                  <span>الصفحة السابقة</span>
                </Link>
                <Link
                  href={buildPageHref(
                    Math.min(604, currentPage + 1),
                    selectedRange.pageStart,
                    selectedRange.pageEnd,
                    title,
                  )}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90"
                >
                  <span>الصفحة التالية</span>
                  <ChevronLeft className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-primary/10 bg-surface-container-low p-6 shadow-sm">
              <h2 className="font-serif text-2xl text-primary mb-4">
                بحث سريع
              </h2>
              <QuranSearch />

              <div className="mt-8 space-y-2 text-sm text-on-surface-variant border-t border-primary/5 pt-6">
                <p>
                  الصفحة الحالية:{" "}
                  <span className="font-bold text-primary">
                    {readerPage.page}
                  </span>
                </p>
                <p>
                  السورة:{" "}
                  <span className="font-bold text-primary">
                    {pageInfo.surah}
                  </span>
                </p>
                <p>
                  الجزء:{" "}
                  <span className="font-bold text-primary">
                    {readerPage.juz}
                  </span>
                </p>
              </div>
            </div>

            <div className="rounded-[2rem] border border-primary/10 bg-surface-container-low p-6 shadow-sm">
              <h2 className="font-serif text-2xl text-primary">
                صفحات التكليف
              </h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {pagesInRange.map((page) => {
                  const isActive = page === currentPage;
                  return (
                    <Link
                      key={page}
                      href={buildPageHref(
                        page,
                        selectedRange.pageStart,
                        selectedRange.pageEnd,
                        title,
                      )}
                      className={`rounded-full px-3 py-1.5 text-sm font-bold transition-colors ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "bg-background text-primary hover:bg-primary/5"
                      }`}
                    >
                      {page}
                    </Link>
                  );
                })}
              </div>
            </div>
          </aside>

          <section className="space-y-6">
            <div className="rounded-[2.5rem] border border-primary/10 bg-white p-6 md:p-10 shadow-sm">
              <div className="mb-8 flex items-center justify-between border-b border-primary/10 pb-6">
                <div>
                  <p className="text-sm font-bold text-secondary">
                    صفحة {readerPage.page}
                  </p>
                  <h2 className="font-serif text-3xl text-primary mt-4">
                    {pageInfo.surah}
                  </h2>
                </div>
                <p className="text-sm text-on-surface-variant">
                  الجزء {readerPage.juz}
                </p>
              </div>

              <div className="space-y-8">
                {readerPage.segments.map((segment) => (
                  <article
                    key={`${segment.page}-${segment.surah}-${segment.ayahStart}`}
                    className="space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-surface-container-low px-5 py-4">
                      <div>
                        <h3 className="font-serif text-xl xs:text-2xl text-primary">
                          {segment.surahName}
                        </h3>
                        <p className="text-xs text-on-surface-variant mt-2">
                          الآيات {segment.ayahStart}-{segment.ayahEnd}
                        </p>
                      </div>
                      <span className="rounded-full bg-primary/5 px-3 py-1 text-xs font-bold text-primary">
                        الجزء {segment.juz}
                      </span>
                    </div>

                    <div className="rounded-[2rem] bg-background/70 px-5 py-6 overflow-hidden">
                      <p className="text-right font-quran text-2xl xs:text-3xl leading-[2.35] text-on-surface">
                        {segment.verses.map((verse) => (
                          <span
                            key={`${segment.surah}-${verse.ayah}`}
                            className="inline"
                          >
                            {verse.text} <AyahMarker ayah={verse.ayah} />{" "}
                          </span>
                        ))}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
