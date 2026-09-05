/**
 * The input guards for /api/concierge, kept as pure functions so they can be
 * tested without standing up a route or spending an OpenAI call.
 *
 * They were previously inline in the route handler and, in the case of history
 * validation, absent altogether: `history` came straight off the request body
 * and was spread into the model call. It was typed `Array<{role:'user'|'assistant'}>`,
 * which TypeScript enforces at compile time and the network does not enforce at
 * all — so a caller could post `{role:'system', content:'...'}` and rewrite the
 * concierge's instructions on a storefront that quotes prices in Brian's name.
 */

/** Hard caps. Without these one request can carry megabytes of billable tokens. */
export const MAX_MESSAGE_CHARS = 2_000;
export const MAX_HISTORY_TURNS = 10;
export const MAX_HISTORY_CHARS = 1_500;

export type ChatTurn = { role: 'user' | 'assistant'; content: string };

/**
 * Rebuild the conversation from only the roles we control, dropping anything
 * malformed rather than trying to repair it.
 */
export function safeHistory(raw: unknown): ChatTurn[] {
  if (!Array.isArray(raw)) return [];
  const out: ChatTurn[] = [];
  for (const item of raw.slice(-MAX_HISTORY_TURNS)) {
    if (!item || typeof item !== 'object') continue;
    const { role, content } = item as { role?: unknown; content?: unknown };
    if (role !== 'user' && role !== 'assistant') continue;
    if (typeof content !== 'string' || !content.trim()) continue;
    out.push({ role, content: content.slice(0, MAX_HISTORY_CHARS) });
  }
  return out;
}

/** Trim and cap the current message. */
export function safeMessage(raw: unknown): string {
  if (typeof raw !== 'string') return '';
  return raw.trim().slice(0, MAX_MESSAGE_CHARS);
}

/**
 * Reject cross-site callers. A missing Origin is allowed because same-origin
 * fetches may omit it; a present-but-foreign Origin is refused.
 */
export function isAllowedOrigin(origin: string | null, allowedHosts: string[]): boolean {
  if (!origin) return true;
  try {
    const host = new URL(origin).host;
    return allowedHosts.filter(Boolean).includes(host);
  } catch {
    return false;
  }
}
