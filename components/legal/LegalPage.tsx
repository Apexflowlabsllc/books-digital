import type { ReactNode } from 'react';
import { PageShell } from '@/components/PageShell';
import { BUSINESS, LEGAL_LAST_UPDATED } from '@/lib/legal';

/** Shared shell for every legal page: same header, footer and nav as the rest of the site. */
export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <PageShell>
      <article className="container-x py-16 md:py-24">
        <div className="max-w-3xl text-[15px] leading-[1.7] text-ink-dim [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-cream [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:text-ink [&_li]:mt-2 [&_ol]:mt-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mt-4 [&_strong]:text-ink [&_table]:mt-4 [&_table]:w-full [&_td]:border [&_td]:border-line [&_td]:p-3 [&_td]:align-top [&_th]:border [&_th]:border-line [&_th]:p-3 [&_th]:text-left [&_th]:text-ink [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-6">
          <h1 className="font-display text-4xl leading-tight text-ink md:text-5xl">{title}</h1>
          <p className="mt-3 text-sm text-ink-dim">
            Last updated {LEGAL_LAST_UPDATED}. {BUSINESS.brand} is a business of {BUSINESS.legalName}, {BUSINESS.location}.
          </p>
          {children}
        </div>
      </article>
    </PageShell>
  );
}

export function ContactLine() {
  return (
    <p>
      Email <a href={`mailto:${BUSINESS.contactEmail}`}>{BUSINESS.contactEmail}</a>, call <a href={BUSINESS.phoneHref}>{BUSINESS.phone}</a>
      {BUSINESS.mailingAddress ? (
        <>
          {' '}
          or write to {BUSINESS.legalName}, {BUSINESS.mailingAddress}
        </>
      ) : null}
      .
    </p>
  );
}

/** A button-looking mailto link with a prefilled subject. */
export function MailButton({ subject, body, children }: { subject: string; body?: string; children: ReactNode }) {
  const href = `mailto:${BUSINESS.contactEmail}?subject=${encodeURIComponent(subject)}${body ? `&body=${encodeURIComponent(body)}` : ''}`;
  return (
    <a
      href={href}
      className="mt-4 inline-block min-h-[44px] rounded-full border-2 border-ink px-6 py-3 font-semibold !text-ink no-underline hover:bg-ink hover:!text-bg"
    >
      {children}
    </a>
  );
}
