/**
 * A rate limiter for the one route that spends money.
 *
 * /api/concierge proxies to OpenAI on Brian's key with no limit of any kind:
 * no request cap, no input size cap, no origin check. A single loop from one
 * machine could run up an unbounded bill, and nothing in the code would slow
 * it down or even notice. That is the most expensive open door on the site.
 *
 * WHAT THIS IS AND IS NOT
 * -----------------------
 * This is an in-process token bucket. On serverless it is per-instance, so a
 * determined attacker spread across many cold starts gets more than the stated
 * budget. It is deliberately still worth having: it stops the trivial case —
 * one browser, one script, one loop — which is the realistic threat for a
 * bookstore, and it costs nothing.
 *
 * The durable version is a shared store (Upstash/Redis) keyed the same way,
 * and the interface here is written so that swap is a drop-in. Until then this
 * is a floor, not a guarantee, and it is documented as such rather than
 * presented as full protection.
 */

type Bucket = { tokens: number; last: number };

const BUCKETS = new Map<string, Bucket>();

/** Stop the map growing without bound if a lot of unique IPs show up. */
const MAX_KEYS = 5000;

export type RateLimitResult = {
  ok: boolean;
  /** Whole seconds until the next token, for Retry-After. */
  retryAfter: number;
  remaining: number;
};

export function rateLimit(
  key: string,
  { capacity, refillPerSecond }: { capacity: number; refillPerSecond: number },
): RateLimitResult {
  const now = Date.now();

  if (BUCKETS.size > MAX_KEYS) {
    // Cheap eviction: drop anything idle for over an hour, then give up and
    // clear if the map is still oversized. Better to lose limiter state than
    // to leak memory in a long-lived instance.
    for (const [k, b] of BUCKETS) {
      if (now - b.last > 3_600_000) BUCKETS.delete(k);
    }
    if (BUCKETS.size > MAX_KEYS) BUCKETS.clear();
  }

  let b = BUCKETS.get(key);
  if (!b) {
    b = { tokens: capacity, last: now };
    BUCKETS.set(key, b);
  }

  const elapsed = (now - b.last) / 1000;
  b.tokens = Math.min(capacity, b.tokens + elapsed * refillPerSecond);
  b.last = now;

  if (b.tokens < 1) {
    return {
      ok: false,
      retryAfter: Math.max(1, Math.ceil((1 - b.tokens) / refillPerSecond)),
      remaining: 0,
    };
  }

  b.tokens -= 1;
  return { ok: true, retryAfter: 0, remaining: Math.floor(b.tokens) };
}

/**
 * Best-effort client identity.
 *
 * Behind Vercel, x-forwarded-for is set by the platform and its FIRST entry is
 * the real client. Reading the last entry, or trusting a bare x-real-ip, lets a
 * caller forge the key and get a fresh bucket per request.
 */
export function clientKey(req: Request): string {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) {
    const first = xff.split(',')[0]?.trim();
    if (first) return first;
  }
  return req.headers.get('x-real-ip')?.trim() || 'unknown';
}
