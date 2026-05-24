'use client';

/* Session-level "used peer" tracking for the preview pool. Lives in a
 * module-level Set so multiple players on the same page share state
 * (e.g. /podcast renders 14 player cards — each picks a unique peer
 * before rotation kicks in). Resets on hard refresh.
 */
const usedAudio = new Set<string>();
const usedPodcast = new Set<string>();
const usedVideo = new Set<string>();

interface PoolItem {
  bookId: string;
  slug: string;
  title: string;
}

type Kind = 'audio' | 'podcast' | 'video';

function setFor(kind: Kind): Set<string> {
  return kind === 'audio' ? usedAudio : kind === 'podcast' ? usedPodcast : usedVideo;
}

/* Pick a random item the session hasn't used yet. If everything's been
 * used, recycle from the full pool (better one repeat than no preview).
 * Deterministic-seed mode: pass a `prefer` value (e.g. the page's own
 * slug) and we'll exclude it from picks so we never preview a book
 * with its own borrowed file.
 */
export function pickPeer(
  pool: PoolItem[],
  kind: Kind,
  exclude?: string,
): PoolItem | null {
  if (pool.length === 0) return null;
  const used = setFor(kind);
  const eligible = pool.filter(
    (p) => p.bookId !== exclude && p.slug !== exclude && !used.has(p.bookId),
  );
  const candidatePool = eligible.length > 0 ? eligible : pool.filter((p) => p.bookId !== exclude && p.slug !== exclude);
  if (candidatePool.length === 0) return null;
  const choice = candidatePool[Math.floor(Math.random() * candidatePool.length)]!;
  used.add(choice.bookId);
  return choice;
}
