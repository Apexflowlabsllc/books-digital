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
 */
export async function getAudioPreviewPool(): Promise<PreviewPoolItem[]> {
  const res = await getCatalog({ limit: 636 });
  if (!res) return [];
  const pool: PreviewPoolItem[] = [];
  for (const b of res.books) {
    if (b.audio_status !== 'live') continue;
    const bookId = deriveBookId(b.series_slug, b.book_number);
    if (!bookId) continue;
    pool.push({ bookId, slug: b.slug, title: b.title });
  }
  return pool;
}

/* Backend signal for podcast availability isn't exposed in the catalog
 * yet (only the audio_status field is). Per the handoff, the podcast
 * pool is "S1 b1-8 + S2 b1-5" today; it's a strict subset of the audio
 * pool. Until backend ships podcastAvailable, treat any audio-live book
 * as a viable podcast peer too — close enough and degrades gracefully.
 */
export async function getPodcastPreviewPool(): Promise<PreviewPoolItem[]> {
  return getAudioPreviewPool();
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
