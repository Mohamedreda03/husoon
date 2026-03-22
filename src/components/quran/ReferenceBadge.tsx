'use client';

import Link from 'next/link';
import { BookOpenText } from 'lucide-react';
import { getReaderHref, getReferenceLabel, getReferenceMetaLabel } from '@/lib/quran/metadata';
import type { QuranReference } from '@/lib/quran/types';
import { cn } from '@/lib/utils';

interface ReferenceBadgeProps {
  reference?: QuranReference;
  title?: string;
  className?: string;
  compact?: boolean;
}

export function ReferenceBadge({
  reference,
  title,
  className,
  compact = false,
}: ReferenceBadgeProps) {
  if (!reference) {
    return null;
  }

  return (
    <Link
      href={getReaderHref(reference, title)}
      onClick={(event) => {
        event.stopPropagation();
      }}
      className={cn(
        'inline-flex max-w-full items-center gap-2 rounded-full border border-primary/10 bg-primary/5 px-3 py-1 text-right text-xs text-primary transition-colors hover:bg-primary/10',
        className,
      )}
    >
      <BookOpenText className="h-3.5 w-3.5 shrink-0" />
      <span className="min-w-0 leading-tight">
        <span className="block truncate font-bold">{getReferenceLabel(reference)}</span>
        {!compact && (
          <span className="block truncate text-[10px] text-primary/70">
            {getReferenceMetaLabel(reference)}
          </span>
        )}
      </span>
    </Link>
  );
}
