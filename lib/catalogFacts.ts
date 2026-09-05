import type { BookSummary } from './types';

/**
 * ONE SOURCE OF TRUTH FOR WHAT THE LIBRARY ACTUALLY IS.
 *
 * The site said "636 books" everywhere. Measured against the catalog API:
 *
 *   titles in the catalog        636
 *   purchasable in some format   384      (252 cannot be bought at all)
 *   audiobooks actually live      24      (612 are still in production)
 *
 * So "all 636 audiobooks" — which the membership page sold as a benefit, in
 * its title, its description, its benefit list and its body copy — described
 * 612 files that do not exist. That is the most serious claim on the site,
 * because people were paying $99/yr for it.
 *
 * Every number the site states about the size of the library now comes from
 * here, and here derives them from catalog data rather than storing its own
 * copy. The same discipline the pricing bug forced: if it can drift, it will.
 *
 * The distinction that has to survive everywhere:
 *   PLANNED   — the full 636-title programme, which is real and worth saying
 *   AVAILABLE — what someone can buy or listen to today
 * Saying the first and implying the second is the thing to never do again.
 */

export type CatalogFacts = {
  /** Every title in the catalog, published or not. The programme's full size. */
  titlesPlanned: number;
  /** Titles a customer can actually buy in at least one format. */
  titlesAvailable: number;
  /** Audiobooks that actually exist and stream. */
  audiobooksLive: number;
  /** Audiobooks recorded but not yet released. */
  audiobooksInProduction: number;
  /** Series represented in the catalog. */
  seriesCount: number;
};

export function catalogFacts(books: BookSummary[]): CatalogFacts {
  const titlesPlanned = books.length;
  const titlesAvailable = books.filter((b) => (b.formats ?? []).some((f) => f.available)).length;
  const audiobooksLive = books.filter((b) => b.audio_status === 'live').length;
  const audiobooksInProduction = books.filter((b) => b.audio_status === 'production').length;
  const seriesCount = new Set(books.map((b) => b.series_slug).filter(Boolean)).size;

  return { titlesPlanned, titlesAvailable, audiobooksLive, audiobooksInProduction, seriesCount };
}

/**
 * The library's size in one honest phrase.
 *
 * Never "636 books" on its own. Either the planned programme is named as
 * planned, or the available count is given, or both — never the big number
 * standing in for the small one.
 */
export function libraryLine(f: CatalogFacts): string {
  if (f.titlesAvailable >= f.titlesPlanned) {
    return `${f.titlesPlanned.toLocaleString()} books across ${f.seriesCount} series`;
  }
  return `${f.titlesAvailable.toLocaleString()} books available now · ${f.titlesPlanned.toLocaleString()}-title programme across ${f.seriesCount} series`;
}

/** Audiobook availability, stated the way it actually is. */
export function audioLine(f: CatalogFacts): string {
  if (f.audiobooksLive === 0) return 'Audiobooks in production';
  if (f.audiobooksInProduction === 0) {
    return `${f.audiobooksLive.toLocaleString()} audiobooks, narrated and live`;
  }
  return `${f.audiobooksLive.toLocaleString()} audiobooks live, the rest in production`;
}
