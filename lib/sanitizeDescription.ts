/**
 * STALE BOILERPLATE IN BACKEND BOOK DESCRIPTIONS.
 *
 * Measured across 120 of the 636 books:
 *
 *   "apexflowlabs.com/books"           120/120 — every single book
 *   "Apex Raw Motivation series"        10/120 — roughly 53 books
 *   "Four books total"                   1/120
 *
 * All of it lives in the backend's `description` field, not in this codebase.
 * lib/types.ts already carried a comment admitting the backend "may still say
 * Apex Raw Motivation", so this is known drift from an earlier architecture
 * that was never cleaned up.
 *
 * What it does to a reader: a book page states "Discipline · Book 1 · Wave I"
 * in its own metadata and then the description says "This is Book 1 in the
 * Apex Raw Motivation series. Four books total." — contradicting the 12-series,
 * 53-books-per-series library on every other page. And every description points
 * at apexflowlabs.com/books, which is the parent company, not this store.
 *
 * Fixing the database is the real fix and belongs to whoever owns the content
 * pipeline. This sanitises at render so all 636 books read correctly today, and
 * it is written to be a no-op the moment the source text is corrected — nothing
 * here fires unless the stale pattern is actually present.
 *
 * Deliberately conservative: it removes only sentences known to be stale and
 * rewrites only the wrong domain. It never rewrites Brian's actual prose.
 */

/** Sentences that describe an architecture the catalog no longer has. */
const STALE_SENTENCES: RegExp[] = [
  // "This is Book 1 in the Apex Raw Motivation series. Four books total."
  /This is Book\s+\d+\s+in the Apex Raw Motivation series\.\s*(?:(?:Four|Three|Five|Two)\s+books total\.\s*)?/gi,
  // the same claim without the leading sentence
  /(?:Four|Three|Five|Two)\s+books total\.\s*/gi,
  // any other lingering reference to the retired series name
  /\bthe Apex Raw Motivation series\b/gi,
];

export function sanitizeDescription(input: string | undefined | null): string {
  if (!input) return '';
  let out = input;

  for (const re of STALE_SENTENCES) {
    out = out.replace(re, '');
  }

  /* The store is books.apexflowlabs.com. apexflowlabs.com/books is the parent
   * company and does not serve this catalog. Handles the bare domain and any
   * scheme/www variant. */
  out = out.replace(
    /(?:https?:\/\/)?(?:www\.)?apexflowlabs\.com\/books\/?/gi,
    'books.apexflowlabs.com',
  );

  /* "Apex Publishing House" is not the brand — locked naming is Apex Flow
   * Publishing House, and every business is "Apex Flow ___". */
  out = out.replace(/\bApex Publishing House\b/g, 'Apex Flow Publishing House');

  // Tidy whitespace the removals leave behind, without touching paragraphing.
  out = out.replace(/[ \t]{2,}/g, ' ').replace(/\n{3,}/g, '\n\n').trim();

  return out;
}
