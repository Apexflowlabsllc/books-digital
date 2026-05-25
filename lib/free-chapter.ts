import { env } from './env';

/* Single client for the free-chapter capture. Tries the new endpoint
 * /api/v1/books/free-chapter first (returns { ok, message_id } per
 * Brian's 2026-05-25 contract). If that route isn't yet serving POST
 * (current state: 405), transparently fall back to the legacy
 * /api/v1/lead-magnets/free-chapter so captures still land while the
 * backend rolls out. Once the new route is live, it'll succeed on
 * the first call and we never hit the legacy path.
 */
export interface FreeChapterArgs {
  // Backend's stable book id (e.g. s01_b01). Fall back to s01_b01 if
  // the calling surface doesn't have it (homepage banner, etc.).
  bookId?: string;
  bookSlug: string;
  email: string;
  utmSource?: string;
  discount?: string;
  optInAsset?: string;
}

export interface FreeChapterResult {
  ok: boolean;
  // message_id is only present from the new endpoint. We accept
  // success without it on the legacy path so users still get the
  // "check your inbox" confirmation during rollout.
  messageId?: string;
  // Identifies which endpoint actually handled the call — useful in
  // dev tools to confirm the migration is progressing.
  via: 'new' | 'legacy';
  error?: string;
}

export async function sendFreeChapter(args: FreeChapterArgs): Promise<FreeChapterResult> {
  const id = args.bookId ?? 's01_b01';

  // 1) Try the new endpoint.
  try {
    const res = await fetch(`${env.backendUrl}/api/v1/books/free-chapter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bookId: id,
        email: args.email,
        bookSlug: args.bookSlug,
        utmSource: args.utmSource ?? 'organic',
        ...(args.discount ? { discount: args.discount } : {}),
        ...(args.optInAsset ? { optInAsset: args.optInAsset } : {}),
      }),
    });
    if (res.ok) {
      const data = (await res.json()) as { ok?: boolean; message_id?: string };
      if (data.ok && data.message_id) {
        return { ok: true, messageId: data.message_id, via: 'new' };
      }
      // Backend responded 2xx but without a delivery id — treat as
      // partial. Fall through to legacy so the user doesn't see an
      // error. The new endpoint's "ok without message_id" branch
      // shouldn't ever happen per Brian's contract, but better safe.
    }
  } catch {
    /* network blip — fall through to legacy */
  }

  // 2) Legacy fallback.
  try {
    const res = await fetch(`${env.backendUrl}/api/v1/lead-magnets/free-chapter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: args.email,
        bookSlug: args.bookSlug,
        utmSource: args.utmSource ?? 'organic',
        ...(args.discount ? { discount: args.discount } : {}),
        ...(args.optInAsset ? { optInAsset: args.optInAsset } : {}),
      }),
    });
    if (!res.ok) {
      return { ok: false, via: 'legacy', error: `legacy ${res.status}` };
    }
    const data = (await res.json()) as { ok?: boolean };
    if (data.ok) {
      return { ok: true, via: 'legacy' };
    }
    return { ok: false, via: 'legacy', error: 'legacy responded without ok' };
  } catch (err) {
    return {
      ok: false,
      via: 'legacy',
      error: err instanceof Error ? err.message : 'network',
    };
  }
}
