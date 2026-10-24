/**
 * LEGAL / BUSINESS DETAILS: one file, imported by every legal page, the footer
 * and the consent banner. Values that are not known are `null` and the pages
 * leave that line out. Nothing here is invented.
 *
 * If the site's behavior changes (a new form, a new third-party script, a new
 * payment provider), change the matching page in the same commit.
 */
export const LEGAL_LAST_UPDATED = 'October 24, 2026';

export const BUSINESS = {
  legalName: 'Apex Flow Labs LLC',
  brand: 'Apex Flow Publishing House',
  location: 'Galt, California, United States',
  /** Public contact for legal, privacy, takedown and support requests. */
  contactEmail: 'info@apexflowlabs.com',
  /** Business mailing address. Omitted until a business address is confirmed (never a personal address). */
  mailingAddress: "10400 Twin Cities Rd, Ste 20, Galt, CA 95632, United States" as string | null,
} as const;

export const CONSENT_KEY = 'apex-books-consent';
export const OPEN_CONSENT_EVENT = 'apex-books-open-consent';

/** Every outside service the site uses, for the privacy and cookie pages. */
export const SERVICE_PROVIDERS = [
  'Vercel (website hosting and server logs)',
  'Supabase (sign-in, account storage and some cover images)',
  'Stripe (card payment on its own checkout pages)',
  'Lulu (printing and shipping of paperbacks and hardcovers, when you order them) and Printful (custom hardcover wraps for bulk orders)',
  'Resend (sending the emails you ask for, such as a free chapter)',
  'OpenAI (writing replies in the Books Concierge chat)',
  'Amazon Web Services Polly (generating audiobook narration; no visitor data is sent)',
] as const;
