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
};

/* Apply the launch percent to a base USD price.
 * Returns the rounded discounted price (2 decimals). */
export function launchPrice(usd: number): number {
  if (!LAUNCH.active) return usd;
  return Math.round(usd * (100 - LAUNCH.percent)) / 100;
}
