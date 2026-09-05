import Link from 'next/link';
import { PageShell } from '@/components/PageShell';
import { JsonLdSchema } from '@/components/JsonLdSchema';
import { buildMetadata, collectionPageSchema } from '@/lib/seo';
import { PROBLEM_PAGES } from '@/lib/problems';
import { TERM_COUNT } from '@/lib/encyclopedia';

export const metadata = buildMetadata({
  title: 'Start with the problem — Apex Flow Publishing House',
  description:
    'Name what is actually wrong and get the answer, what to do about it, and the books that work on it. Written for people, not for search engines.',
  path: '/problems',
});

export const revalidate = 3600;

/**
 * The index of problem pages.
 *
 * Deliberately short. Only terms carrying a real definition, a real action and
 * at least six recorded phrasings get a page, so this lists a dozen or so
 * rather than hundreds. The rest of the vocabulary lives in the encyclopedia,
 * which is the right place for a term that does not warrant a landing page.
 */
export default function ProblemsIndex() {
  const collection = collectionPageSchema({
    path: '/problems',
    name: 'Start with the problem',
    description:
      'Plain-language answers to the problems the catalog is written for, each connected to the books that address it.',
    items: PROBLEM_PAGES.map((p) => ({ url: `/problems/${p.slug}`, name: p.entry.term })),
  });

  return (
    <PageShell>
      <JsonLdSchema bundle={null} fallback={collection} />

      <section className="container-x pb-4 pt-16 sm:pt-20">
        <p className="font-mono text-[10px] uppercase tracking-[0.36em] text-accent/75">
          Start with the problem
        </p>
        <h1 className="mt-5 font-display text-[clamp(34px,5.4vw,64px)] font-light leading-[1.02] tracking-[-0.03em] text-ink">
          Name it first.
        </h1>
        <p className="mt-5 max-w-[58ch] text-[15px] leading-relaxed text-ink-dim">
          Most people do not know the word for what is wrong — they know the sentence. Each of these
          gives the plain answer, one thing to do today, and the books that work on it.
        </p>
      </section>

      <section className="container-x pb-24 pt-8">
        <ul className="grid gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {PROBLEM_PAGES.map((p) => (
            <li key={p.slug} className="bg-bg">
              <Link href={`/problems/${p.slug}`} className="block p-6 transition-colors hover:bg-bg-subtle">
                <span className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-accent">
                  {p.entry.term}
                </span>
                <span className="mt-3 block font-display text-[19px] font-light leading-snug text-ink">
                  {p.question}
                </span>
                <span className="mt-3 block text-[13px] leading-relaxed text-ink-dim">
                  {p.entry.definition.slice(0, 110)}…
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-10 text-[13px] text-ink-dim">
          {TERM_COUNT} terms in total live in{' '}
          <Link href="/encyclopedia" className="text-accent underline">
            the encyclopedia
          </Link>
          . These are the ones with enough written about them to stand as their own page.
        </p>
      </section>
    </PageShell>
  );
}
