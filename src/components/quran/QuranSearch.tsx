'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2, X, Book, Hash, Layers } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { SurahList, findPage, type Surah, type AyahNo } from 'quran-meta/hafs';
import { cn } from '@/lib/utils';

interface SearchResult {
  type: 'surah' | 'page' | 'juz' | 'ayah';
  title: string;
  subtitle: string;
  page: number;
}

interface QuranSearchProps {
  className?: string;
  variant?: 'default' | 'navbar';
}

/**
 * Normalizes Arabic text by removing diacritics (tashkeel)
 */
const normalizeArabic = (text: string) => {
  return text
    .replace(/[\u064B-\u0652]/g, "") // Remove tashkeel
    .replace(/أ|إ|آ/g, "ا") // Normalize Alef
    .replace(/ة/g, "ه") // Normalize Teh Marbuta
    .replace(/ى/g, "ي"); // Normalize Alef Maksura
};

// Fixed Quran Surah count
const NUM_SURAHS = 114;

export function QuranSearch({ className, variant = 'default' }: QuranSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const performSearch = (val: string) => {
    if (!val.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const newResults: SearchResult[] = [];
    const searchVal = val.toLowerCase().trim();
    const normalizedQuery = normalizeArabic(searchVal);

    // 1. Check for Surah Names
    SurahList.forEach((surah, index) => {
      const surahNum = index as Surah;
      if (surahNum < 1 || surahNum > NUM_SURAHS) return;
      
      const surahName = surah[4]; // Arabic name
      const normalizedSurahName = normalizeArabic(surahName);
      
      if (normalizedSurahName.includes(normalizedQuery) || surahNum.toString() === searchVal) {
        newResults.push({
          type: 'surah',
          title: `سورة ${surahName}`,
          subtitle: `السورة رقم ${surahNum}`,
          page: findPage(surahNum, 1),
        });
      }
    });

    // 2. Check for "Surah:Ayah" or Natural Language formats
    const digitMatches = searchVal.match(/\d+/g);
    if (digitMatches) {
      const numbers = digitMatches.map(n => parseInt(n));
      
      SurahList.forEach((surah, index) => {
        const surahNum = index as Surah;
        if (surahNum < 1 || surahNum > NUM_SURAHS) return;

        const surahName = surah[4];
        const normalizedSurahName = normalizeArabic(surahName);
        
        if (normalizedQuery.includes(normalizedSurahName)) {
          const ayahNum = numbers[0] as AyahNo;
          if (ayahNum >= 1 && ayahNum <= 300) {
            try {
              const page = findPage(surahNum, ayahNum);
              newResults.unshift({
                type: 'ayah',
                title: `سورة ${surahName} آية ${ayahNum}`,
                subtitle: `الآية رقم ${ayahNum} في السورة`,
                page: page,
              });
            } catch { /* Invalid ayah */ }
          }
        }
      });

      const directMatch = searchVal.match(/^(\d+)[:\s](\d+)$/);
      if (directMatch) {
        const sNum = parseInt(directMatch[1]) as Surah;
        const aNum = parseInt(directMatch[2]) as AyahNo;
        if (sNum >= 1 && sNum <= NUM_SURAHS) {
          try {
            const page = findPage(sNum, aNum);
            newResults.unshift({
              type: 'ayah',
              title: `سورة ${SurahList[sNum][4]} آية ${aNum}`,
              subtitle: `الانتقال المباشر للآية`,
              page: page,
            });
          } catch { /* Invalid ayah */ }
        }
      }
    }

    // 3. Check for Page numbers
    const pageNum = parseInt(searchVal);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= 604) {
      newResults.push({
        type: 'page',
        title: `صفحة ${pageNum}`,
        subtitle: `الانتقال إلى الصفحة ${pageNum}`,
        page: pageNum,
      });
    }

    // Deduplicate and limit
    const uniqueResults = Array.from(new Set(newResults.map(r => r.page)))
      .map(page => newResults.find(r => r.page === page)!);

    setResults(uniqueResults.slice(0, 8));
    setIsSearching(false);
    setIsOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    performSearch(val);
  };

  const handleSelect = (result: SearchResult) => {
    router.push(`/quran?page=${result.page}&fromPage=${result.page}&toPage=${result.page}`);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div className={cn("relative w-full", className)} ref={dropdownRef}>
      <div className="relative">
        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
          {isSearching ? (
            <Loader2 className="h-5 w-5 text-primary animate-spin" />
          ) : (
            <Search className="h-5 w-5 text-on-surface-variant" />
          )}
        </div>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => query.trim() && setIsOpen(true)}
          placeholder={variant === 'navbar' ? "البحث في القرآن..." : "ابحث عن سورة، صفحة، أو آية (مثال: البقرة أو 2:255)"}
          className={cn(
            "h-12 w-full rounded-2xl border border-primary/10 bg-surface-container-low pr-12 pl-4 text-right text-sm outline-none ring-primary/20 transition-all focus:border-primary focus:ring-4",
            variant === 'navbar' && "h-11 bg-transparent border-none ring-0 focus:ring-0"
          )}
          dir="rtl"
        />
        {query && (
          <button 
            onClick={() => { setQuery(''); setResults([]); setIsSearching(false); }}
            className="absolute inset-y-0 left-4 flex items-center"
          >
            <X className="h-4 w-4 text-on-surface-variant hover:text-primary" />
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className={cn(
          "absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border border-primary/10 bg-surface-bright shadow-xl animate-in fade-in zoom-in duration-200",
          variant === 'navbar' && "right-0 w-[320px] md:w-[400px]"
        )}>
          <div className="max-h-[400px] overflow-y-auto p-2">
            {results.map((result, idx) => (
              <button
                key={`${result.type}-${idx}`}
                onClick={() => handleSelect(result)}
                className="flex w-full items-center gap-4 rounded-xl p-3 text-right transition-colors hover:bg-primary/5"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {result.type === 'surah' && <Book className="h-5 w-5" />}
                  {result.type === 'page' && <Layers className="h-5 w-5" />}
                  {result.type === 'ayah' && <Hash className="h-5 w-5" />}
                </div>
                <div className="flex-1 overflow-hidden text-right">
                  <div className="truncate text-sm font-bold text-on-surface">{result.title}</div>
                  <div className="truncate text-xs text-on-surface-variant">{result.subtitle}</div>
                </div>
                <div className="text-xs font-bold text-primary bg-primary/5 px-2 py-1 rounded-md">
                  ص {result.page}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
