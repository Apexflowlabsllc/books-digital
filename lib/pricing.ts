import type { BookSummary, Format, FormatPrice } from './types';

/**
 * PRICES COME FROM THE CATALOG. NEVER FROM A CONSTANT.
 *
 * Audited 2026-09-05 against all 636 books. Every price displayed on the site
 * disagreed with what the catalog actually charges:
 *
 *   format      site said     catalog charges
 *   ebook       $5.99         $6.99
 *   audiobook   $12.99        $14.99
 *   paperback   $20.09        $14.99
 *   hardcover   $34.99        $24.99
 *
 * Two of them under-quoted, so a customer was told $5.99 and billed $6.99.
 * Two over-quoted, so we were talking people out of a cheaper product than we
 * actually sell. Both directions are bad; the under-quote is the one that
 * causes chargebacks and complaints.
 *
 * The cause was hardcoded strings in app/page.tsx and, separately, hardcoded
 * prices inside the AI concierge's system prompt — three copies of the truth,
 * none of them wired to it. This module is the single place the site derives
 * display prices, and it derives them from catalog data rather than storing
 * its own copy, so it cannot drift again.
 */

export const FORMAT_ORDER: Format[] = ['ebook', 'audiobook', 'paperback', 'hardcover'];

export const FORMAT_LABEL: Record<Format, string> = {
  ebook: 'Ebook',
  audiobook: 'Audiobook',
  paperback: 'Paperback',
  hardcover: 'Hardcover',
};

export const FORMAT_NOTE: Record<Format, string> = {
  ebook: 'EPUB, delivered by email. Nothing ships.',
  audiobook: 'Narrated MP3. Download and keep the files.',
  paperback: '6×9 inches, perfect bound, printed and shipped.',
  hardcover: '6×9 inches, case wrap, printed and shipped.',
};

export function formatMoney(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export type CatalogPrice = { format: Format; label: string; price: string | null; note: string };

/**
 * The prevailing price per format across the catalog.
 *
 * Takes the most common price rather than the first book's, so one oddly
 * priced title cannot set the headline number. Returns null for a format with
 * no priced entries at all, which the caller shows as "Coming soon" rather
 * than inventing a figure.
 */
export function catalogPrices(books: BookSummary[]): CatalogPrice[] {
  const tally = new Map<Format, Map<number, number>>();

  for (const b of books) {
    for (const f of (b.formats ?? []) as FormatPrice[]) {
      if (typeof f.price_cents !== 'number' || f.price_cents <= 0) continue;
      let inner = tally.get(f.format);
      if (!inner) {
        inner = new Map();
        tally.set(f.format, inner);
      }
      inner.set(f.price_cents, (inner.get(f.price_cents) ?? 0) + 1);
    }
  }

  return FORMAT_ORDER.map((format) => {
    const inner = tally.get(format);
    let best: number | null = null;
    let bestCount = 0;
    if (inner) {
      for (const [cents, count] of inner) {
        if (count > bestCount) {
          bestCount = count;
          best = cents;
        }
      }
    }
    return {
      format,
      label: FORMAT_LABEL[format],
      price: best === null ? null : formatMoney(best),
      note: FORMAT_NOTE[format],
    };
  });
}

/** How many books can actually be bought in at least one format. */
export function purchasableCount(books: BookSummary[]): number {
  return books.filter((b) => (b.formats ?? []).some((f) => f.available)).length;
}
