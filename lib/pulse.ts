/**
 * APEX PULSE — this store runs on it.
 *
 * The bookstore does not SELL Pulse. Pulse is sold on the digital store. This
 * store is one of the properties running it, the same way Spiker Carpet is,
 * and this page is the live proof of that — not a price list. Pricing lives in
 * exactly one place and it is not here.
 *
 * THE LAW THIS FILE OBEYS: real data only. Never a fabricated metric, follower
 * count, post count or citation score. The dashboard returns connection state
 * and published posts and nothing else, so nothing else is rendered. Where the
 * system cannot prove a number, the page says so plainly rather than showing a
 * plausible one — a fabricated dashboard is indistinguishable from a real one,
 * which is exactly what makes it dangerous.
 *
 * Measured state at time of writing: account `books` has 0 of 7 channels
 * connected and 0 posts published, against `spiker` at 6 of 7 and 5 posts. The
 * page reflects that honestly instead of dressing it up.
 */

const FLAGSHIP = 'https://www.apexflowlabs.com';

/** This store's Pulse account, the way Spiker Carpet's is `spiker`. */
export const PULSE_ACCOUNT = 'books';

/** Pulse is bought on the digital store, never here. */
export const PULSE_PRODUCT_URL = `${FLAGSHIP}/pulse`;

export type PulseChannel = {
  platform: string;
  label: string;
  connected: boolean;
  needsReconnect: boolean;
};

export type PulsePost = {
  title: string;
  url?: string;
  platform?: string;
  publishedAt?: string;
};

export type PulseState = {
  channels: PulseChannel[];
  connectedCount: number;
  posts: PulsePost[];
  blogPublished: number | null;
  /** True when the upstream call failed — render last-known/neutral, never a spinner. */
  degraded: boolean;
};

async function j<T>(url: string): Promise<T | null> {
  try {
    const r = await fetch(url, { next: { revalidate: 600, tags: ['pulse'] } });
    if (!r.ok) return null;
    return (await r.json()) as T;
  } catch {
    return null;
  }
}

export async function getPulseState(account = PULSE_ACCOUNT): Promise<PulseState> {
  const [dash, feed] = await Promise.all([
    j<{
      social?: Array<{
        platform?: string;
        label?: string;
        connected?: boolean;
        needs_reconnect?: boolean;
      }>;
      blog?: { published_count?: number };
    }>(`${FLAGSHIP}/api/v1/pulse/dashboard?account=${encodeURIComponent(account)}`),
    j<{ items?: Array<{ title?: string; url?: string; platform?: string; published_at?: string }> }>(
      `${FLAGSHIP}/api/v1/pulse/feed?account=${encodeURIComponent(account)}&limit=12`,
    ),
  ]);

  if (!dash) {
    return { channels: [], connectedCount: 0, posts: [], blogPublished: null, degraded: true };
  }

  const channels: PulseChannel[] = (dash.social ?? []).map((s) => ({
    platform: s.platform ?? '',
    label: s.label ?? s.platform ?? '',
    connected: Boolean(s.connected),
    needsReconnect: Boolean(s.needs_reconnect),
  }));

  const posts: PulsePost[] = (feed?.items ?? [])
    .filter((i) => typeof i.title === 'string' && i.title.trim())
    .map((i) => ({
      title: i.title as string,
      url: i.url,
      platform: i.platform,
      publishedAt: i.published_at,
    }));

  return {
    channels,
    connectedCount: channels.filter((c) => c.connected && !c.needsReconnect).length,
    posts,
    blogPublished: typeof dash.blog?.published_count === 'number' ? dash.blog.published_count : null,
    degraded: false,
  };
}

export function pulseSchema(siteUrl: string): unknown {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${siteUrl}/pulse#page`,
    url: `${siteUrl}/pulse`,
    name: 'Apex Pulse — the system this store publishes with',
    description:
      'Apex Flow Publishing House runs on Apex Pulse: live publishing across every channel, plus AI-citation visibility. Pulse is available from Apex Flow Labs.',
    about: {
      '@type': 'SoftwareApplication',
      name: 'Apex Pulse',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      url: PULSE_PRODUCT_URL,
    },
  };
}
