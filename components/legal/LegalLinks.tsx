import Link from 'next/link';
import { BUSINESS } from '@/lib/legal';
import { CookieSettingsButton } from './ConsentBanner';

const LINKS: Array<[string, string]> = [
  ['Privacy', '/privacy'],
  ['Terms', '/terms'],
  ['Refunds and delivery', '/refunds'],
  ['Cookies', '/cookies'],
  ['Accessibility', '/accessibility'],
  ['Editorial policy', '/editorial-policy'],
  ['Not therapy or advice', '/disclaimer'],
  ['Copyright and takedown', '/report-content'],
  ['Privacy requests', '/privacy-request'],
];

/** Legal links, business identity and contact. Rendered at the bottom of the site footer. */
export function LegalLinks() {
  return (
    <div className="container-x relative border-t border-[rgba(217,204,140,0.12)] py-6 text-xs text-ink-dim">
      <nav aria-label="Legal">
        <ul className="flex flex-wrap gap-x-5 gap-y-1">
          {LINKS.map(([label, href]) => (
            <li key={href}>
              <Link href={href} className="inline-block py-2 underline-offset-4 hover:text-accent hover:underline">
                {label}
              </Link>
            </li>
          ))}
          <li>
            <CookieSettingsButton className="inline-block py-2 underline underline-offset-4 hover:text-accent" />
          </li>
        </ul>
      </nav>
      <p className="mt-3 max-w-3xl leading-relaxed">
        {BUSINESS.brand} is a business of {BUSINESS.legalName}, {BUSINESS.mailingAddress ?? BUSINESS.location}. Contact{' '}
        <a href={`mailto:${BUSINESS.contactEmail}`} className="underline underline-offset-4 hover:text-accent">
          {BUSINESS.contactEmail}
        </a>
        . Self-help books are education and entertainment, not medical, mental-health, legal or financial advice.
      </p>
    </div>
  );
}
