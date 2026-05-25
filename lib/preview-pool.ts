import { getCatalog } from './api';

/* Pool of books whose audio/podcast files are real (not borrowed peers).
 * Used by non-authentic book detail pages to pick a random representative
 * sample to play for 30 seconds.
 *
 * Backend will eventually expose a dedicated `audioAvailable` /
 * `podcastAvailable` flag; until then we derive the pool from the
 * catalog's audio_status === 'live' filter (the closest signal we have).
 */
export interface PreviewPoolItem {
  bookId: string; // e.g. "s01_b01"
  slug: string;
  title: string;
}

/* Map of catalog slug → backend bookId. The backend doesn't yet include
 * bookId in the catalog summary response, so we derive it from
 * series_slug + book_number using the canonical s<NN>_b<NN> convention.
 */
function deriveBookId(seriesSlug: string, bookNumber: number): string | null {
  const seriesSlugToNum: Record<string, number> = {
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
  const s = seriesSlugToNum[seriesSlug];
  if (!s) return null;
  return `s${String(s).padStart(2, '0')}_b${String(bookNumber).padStart(2, '0')}`;
}

/* Fetch + filter the catalog to find all books with real audio. Cached
 * server-side via the same revalidate window as getCatalog (5 min).
 * Returns [] on backend hiccup — caller treats empty pool as "no
 * preview available" and renders accordingly.
 *
 * Prefers the explicit `audioAvailable` boolean when backend ships it.
 * Falls back to `audio_status === 'live'` as a close proxy until then.
 * Pool grew from 16 → 22 books in the 2026-05-25 backfill (S1 + S2).
 */
export async function getAudioPreviewPool(): Promise<PreviewPoolItem[]> {
  const res = await getCatalog({ limit: 636 });
  if (!res) return [];
  const pool: PreviewPoolItem[] = [];
  for (const b of res.books) {
    const explicit = (b as unknown as { audioAvailable?: boolean }).audioAvailable;
    const isAvailable = typeof explicit === 'boolean' ? explicit : b.audio_status === 'live';
    if (!isAvailable) continue;
    const bookId = deriveBookId(b.series_slug, b.book_number);
    if (!bookId) continue;
    pool.push({ bookId, slug: b.slug, title: b.title });
  }
  return pool;
}

/* Podcast pool. Prefers an explicit `podcastAvailable` boolean from the
 * catalog when backend ships it; otherwise falls back to the audio pool
 * (close approximation — podcast availability is a strict subset of
 * audio availability per Brian's handoff).
 */
export async function getPodcastPreviewPool(): Promise<PreviewPoolItem[]> {
  const res = await getCatalog({ limit: 636 });
  if (!res) return [];
  // If the catalog doesn't carry podcastAvailable, reuse the audio pool.
  const hasPodcastFlag = res.books.some(
    (b) => typeof (b as unknown as { podcastAvailable?: boolean }).podcastAvailable === 'boolean',
  );
  if (!hasPodcastFlag) return getAudioPreviewPool();

  const pool: PreviewPoolItem[] = [];
  for (const b of res.books) {
    if (!(b as unknown as { podcastAvailable?: boolean }).podcastAvailable) continue;
    const bookId = deriveBookId(b.series_slug, b.book_number);
    if (!bookId) continue;
    pool.push({ bookId, slug: b.slug, title: b.title });
  }
  return pool;
}

/* Construct the preview MP3 URL for a pool item. Same backend route as
 * the real audiobook — no extra Vercel egress since it's still a 302
 * redirect to R2.
 */
export function audioPreviewUrl(bookId: string): string {
  return `https://www.apexflowlabs.com/api/v1/books/audio/${bookId}/audiobook.mp3`;
}

export function podcastPreviewUrl(bookId: string): string {
  return `https://www.apexflowlabs.com/api/v1/books/audio/${bookId}/podcast/episode.mp3`;
}

export function podcastVideoPreviewUrl(bookId: string): string {
  return `https://www.apexflowlabs.com/api/v1/books/audio/${bookId}/podcast/episode.mp4`;
}
