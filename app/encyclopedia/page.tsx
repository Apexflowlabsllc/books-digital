import { PageShell } from '@/components/PageShell';
import { Hero } from '@/components/Hero';
import { JsonLdSchema } from '@/components/JsonLdSchema';
import { buildMetadata } from '@/lib/seo';
import { env } from '@/lib/env';
import { ENCYCLOPEDIA, PHRASE_COUNT, TERM_COUNT, encyclopediaSchema } from '@/lib/encyclopedia';
import { EncyclopediaList } from './EncyclopediaList';

export const metadata = buildMetadata({
  title: 'The Self-Help Encyclopedia — Apex Flow Publishing House',
  description:
    'Every idea behind the catalog, defined in one paragraph, with what to actually do about it — and every way a real person says it out loud. Nobody searches for "rumination". They search for "I can\'t stop replaying that argument".',
  path: '/encyclopedia',
});

export const revalidate = 86400;

export default async function EncyclopediaPage() {
  const siteUrl = env.siteUrl.replace(/\/$/, '');

  return (
    <PageShell>
      {/* No backend-authored bundle for this page — the schema is generated
        * from the same array the page renders, so it can never drift. */}
      <JsonLdSchema bundle={null} fallback={encyclopediaSchema(siteUrl)} />

      <Hero
        eyebrow={`${TERM_COUNT} terms · ${PHRASE_COUNT} ways people say them`}
        title={
          <>
            The self-help
            <br />
            encyclopedia.
          </>
        }
        body={
          <>
            Every idea this catalog is built on, defined in one paragraph, with what to actually do
            about it — <strong>and every way a real person says it out loud.</strong> Nobody searches
            for &ldquo;rumination&rdquo;. They search for &ldquo;I can&rsquo;t stop replaying that
            argument&rdquo;. Both are here, and both find the same answer.
          </>
        }
        primary={{ href: '/books', label: 'See the books' }}
        secondary={{ href: '/about-brian', label: 'Who wrote them' }}
      />

      <section className="mx-auto w-full max-w-6xl px-6 py-16 md:py-24">
        <EncyclopediaList />
      </section>

      {/* The plain-language index, rendered as static links.
        * The interactive list above is a client component; this block is not.
        * A crawler that runs no JavaScript still gets every phrasing paired
        * with the term it resolves to, which is the entire point of the page. */}
      <section className="mx-auto w-full max-w-6xl border-t border-line px-6 py-16">
        <h2 className="font-display text-2xl text-fg">How people actually ask</h2>
        <p className="mt-3 max-w-[62ch] text-fg-muted">
          The same {TERM_COUNT} ideas, indexed by the words people use when they are not using the
          clinical ones.
        </p>
        <ul className="mt-8 grid gap-x-10 gap-y-2 md:grid-cols-2">
          {ENCYCLOPEDIA.flatMap((e) =>
            e.saidAs.map((p) => (
              <li key={`${e.term}-${p}`} className="text-[14px] leading-relaxed text-fg-muted">
                <span className="text-fg">&ldquo;{p}&rdquo;</span>
                <span className="mx-2 text-accent/50">→</span>
                <span className="font-mono text-[12px] uppercase tracking-wide text-accent">
                  {e.term}
                </span>
              </li>
            )),
          )}
        </ul>
      </section>
    </PageShell>
  );
}
