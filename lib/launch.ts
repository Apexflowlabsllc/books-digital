/* Single source of truth for the launch-week promo. Every sale-related
 * surface — banner, modal, catalog badge, detail hero pill, price
 * strikethrough — reads from this file. Flip ACTIVE to false once the
 * promo ends and the entire sale UI disappears in one commit.
 */

export const LAUNCH = {
  active: true,
  code: 'APEX30',
  percent: 30,
  headline: 'Launch Week — 30% off everything.',
  subhead:
    'Every format. Every book. Stripe applies the discount at checkout — paste the code or it auto-fills from the URL.',
  // Pretty-formatted % off label (no decimals). Used in compact spots.
  shortLabel: '30% OFF',
  // Sticker copy for catalog tiles.
  badgeLabel: '−30%',
  // When the promo expires. ISO string, UTC. Used by countdown copy
  // across the banner, modal, offer section, and the persistent
  // floating pill. Bump this date as you extend the promo. Once it
  // passes, countdown helpers return null and consumers should hide
  // the urgency copy (the promo itself stays live until you also
  // flip `active` to false).
  endsAt: '2026-06-02T23:59:59Z',
};

/* Days/hours remaining on the launch promo. Returns null when the
 * end date has passed (or active === false). Computed on demand —
 * client components call this in render so the value is fresh each
 * paint, server components get the value at SSR time. */
export function launchTimeLeft(now: Date = new Date()): {
  days: number;
  hours: number;
  totalMs: number;
} | null {
  if (!LAUNCH.active) return null;
  const end = new Date(LAUNCH.endsAt).getTime();
  const diff = end - now.getTime();
  if (diff <= 0) return null;
  const totalHours = Math.floor(diff / (1000 * 60 * 60));
  return {
    days: Math.floor(totalHours / 24),
    hours: totalHours % 24,
    totalMs: diff,
  };
}

/* Short human label for the countdown. "Ends in 6 days", "Ends in
 * 18 hours", "Last day". Returns empty string when the promo's done
 * so consumers can render `{launchCountdownLabel()}` without guards. */
export function launchCountdownLabel(now: Date = new Date()): string {
  const t = launchTimeLeft(now);
  if (!t) return '';
  if (t.days >= 1) return `Ends in ${t.days} day${t.days === 1 ? '' : 's'}`;
  if (t.hours >= 1) return `Ends in ${t.hours} hour${t.hours === 1 ? '' : 's'}`;
  return 'Last hour';
}

/* Apply the launch percent to a base USD price.
 * Returns the rounded discounted price (2 decimals). */
export function launchPrice(usd: number): number {
  if (!LAUNCH.active) return usd;
  return Math.round(usd * (100 - LAUNCH.percent)) / 100;
}
