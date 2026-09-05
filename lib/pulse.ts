import { env } from './env';

/**
 * APEX PULSE — carried by every Apex Flow store.
 *
 * Pulse is a product sold across the ecosystem, and the flagship already owns
 * the truth about it: GET /api/v1/pulse/checkout returns the live tier list
 * and whether billing is switched on. This module reads that endpoint rather
 * than keeping a second copy of the prices.
 *
 * That is deliberate and it is the same lesson the book catalog just taught:
 * every price on this site was wrong because three places each held their own
 * copy of the number and none agreed. Pulse gets one source from day one.
 *
 * `active: false` is a real state, not an error — billing is built and
 * deliberately deactivated. When it is false the page must not render a buy
 * button that leads nowhere; it points at the flagship instead.
 */

export type PulseTier = {
  key: string;
  name: string;
  priceCents: number;
  blurb: string;
};

export type PulseOffer = {
  active: boolean;
  tiers: PulseTier[];
  /** True when the upstream call failed and we are rendering nothing priced. */
  degraded: boolean;
};

const FLAGSHIP = 'https://www.apexflowlabs.com';

/** Display order, cheapest first. The API returns an object, which has no order. */
const ORDER = ['starter', 'pro', 'agency'];

export async function getPulseOffer(): Promise<PulseOffer> {
  try {
    const res = await fetch(`${FLAGSHIP}/api/v1/pulse/checkout`, {
      next: { revalidate: 600, tags: ['pulse'] },
    });
    if (!res.ok) return { active: false, tiers: [], degraded: true };

    const raw = (await res.json()) as {
      active?: boolean;
      tiers?: Record<string, { name?: string; priceCents?: number; blurb?: string }>;
    };

    const entries = Object.entries(raw.tiers ?? {});
    const tiers: PulseTier[] = entries
      .filter(([, v]) => typeof v?.priceCents === 'number' && v.priceCents > 0)
      .map(([key, v]) => ({
        key,
        name: v.name ?? key,
        priceCents: v.priceCents as number,
        blurb: v.blurb ?? '',
      }))
      .sort((a, b) => {
        const ai = ORDER.indexOf(a.key);
        const bi = ORDER.indexOf(b.key);
        if (ai !== -1 && bi !== -1) return ai - bi;
        return a.priceCents - b.priceCents;
      });

    return { active: Boolean(raw.active), tiers, degraded: false };
  } catch {
    return { active: false, tiers: [], degraded: true };
  }
}

export function pulseMonthly(cents: number): string {
  return `$${Math.round(cents / 100)}`;
}

/** Where a buyer goes. Checkout lives on the flagship, not on the bookstore. */
export const PULSE_HOME = `${FLAGSHIP}/pulse`;

export function pulseSchema(): unknown {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': `${env.siteUrl}/pulse#software`,
    name: 'Apex Pulse',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: `${env.siteUrl}/pulse`,
    sameAs: PULSE_HOME,
    publisher: { '@id': `${env.siteUrl}/#organization` },
    description:
      'Live social publishing, channel health, and AI-citation visibility. Apex Pulse keeps a business publishing across every platform and shows where it is being cited by answer engines.',
  };
}
