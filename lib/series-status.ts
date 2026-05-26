// Cross-cutting helpers for "is this series live yet" logic. Brian's
// release cadence: S01-S05 live now, S06-S12 still in production.
// Book detail pages for S06+ show a Coming Soon panel + notify-me
// capture instead of the full purchase stack.

import type { BookDetail, BookSummary } from './types';

const SERIES_SLUG_TO_NUM: Record<string, number> = {
  'discipline-blueprint': 1,
  'comeback-blueprint': 2,
  'mind-reset-blueprint': 3,
  'success-blueprint': 4,
  'elite-blueprint': 5,
  'unstoppable-blueprint': 6,
  'nervous-system-blueprint': 7,
  'connection-blueprint': 8,
  'power-blueprint': 9,
  'purpose-blueprint': 10,
  'warrior-blueprint': 11,
  'legend-blueprint': 12,
};

/* Returns the series number (1-12) for a book. Prefers book_id when
 * the backend has surfaced it (e.g. s06_b03 → 6); falls back to the
 * series_slug mapping above. Returns null when neither resolves. */
export function seriesNumberFromBook(book: BookSummary | BookDetail): number | null {
  const id = (book as BookDetail).book_id;
  if (id) {
    const m = /^s(\d{2})_/.exec(id);
    if (m) {
      const n = parseInt(m[1]!, 10);
      if (!Number.isNaN(n) && n >= 1 && n <= 12) return n;
    }
  }
  const n = SERIES_SLUG_TO_NUM[book.series_slug];
  return n ?? null;
}

// First series that hasn't been written yet. S06 (Unstoppable Blueprint)
// and everything after gets the Coming Soon treatment. Flip this number
// up as Brian finishes each series.
export const FIRST_COMING_SOON_SERIES = 6;

export function isComingSoonBook(book: BookSummary | BookDetail): boolean {
  const n = seriesNumberFromBook(book);
  return n !== null && n >= FIRST_COMING_SOON_SERIES;
}

/* Wave → planned drop window. Brian's roadmap from the homepage
 * Wave tiles. Used as fallback copy on Coming Soon panels. */
export function plannedDropLabel(wave: number | undefined): string {
  switch (wave) {
    case 2:
      return 'Coming soon';
    case 3:
      return 'Drops Q3 2026';
    case 4:
      return 'Drops Q1 2027';
    default:
      return 'Coming soon';
  }
}
