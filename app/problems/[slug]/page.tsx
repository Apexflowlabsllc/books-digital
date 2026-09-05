import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageShell } from '@/components/PageShell';
import { JsonLdSchema } from '@/components/JsonLdSchema';
import { BookTile } from '@/components/BookTile';
import { buildMetadata } from '@/lib/seo';
import { env } from '@/lib/env';
import { getCatalog } from '@/lib/api';
import { PROBLEM_PAGES, findProblem } from '@/lib/problems';
import { matchProblem } from '@/lib/problemMatch';

export const revalidate = 3600;

export function generateStaticParams() {
  return PROBLEM_PAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = findProblem(slug);
  if (!p) return buildMetadata({ title: 'Not found', description: '', path: `/problems/${slug}` });
  return buildMetadata({
    title: `${p.entry.term} — what it is and what to do about it`,
    description: `${p.entry.definition.slice(0, 150)}`,
    path: `/problems/${slug}`,
  });
}

/**
 * ONE PROBLEM, ANSWERED PROPERLY.
 *
 * Problem -> answer -> what to do -> the books that address it -> the series ->
 * the author. Every element on the page already existed as real content: the
 * definition and action come from the encyclopedia, the phrasings are the ones
 * actually recorded for this term, and the books are chosen by the same
 * matcher that powers the search on /books — not by a keyword list written to
 * fill a page.
 *
 * The answer is written for a person and happens to be liftable by a machine,
 * which is the right way round. It is emitted once as visible text and once as
 * FAQPage built from the same strings, so the two cannot disagree.
 */
export default async function ProblemPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = findProblem(slug);
  if (!p) notFound();

  const catalog = await getCatalog();
  const books = catalog?.books ?? [];
  /* The same matcher the store's search uses, seeded with this term's own
   * phrasings so the recommendation is genuinely about this problem. */
  const match = matchProblem(`${p.entry.term} ${p.entry.saidAs.slice(0, 3).join(' ')}`, books);
  const picks = match.books.slice(0, 8);
  const url = `${env.siteUrl}/problems/${p.slug}`;

  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${url}#faq`,
    mainEntity: [
      {
        '@type': 'Question',
        name: p.question,
        acceptedAnswer: { '@type': 'Answer', text: p.entry.definition },
      },
      {
        '@type': 'Question',
        name: `What can I actually do about ${p.entry.term.toLowerCase()}?`,
        acceptedAnswer: { '@type': 'Answer', text: p.entry.action },
      },
    ],
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: env.siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Problems', item: `${env.siteUrl}/problems` },
      { '@type': 'ListItem', position: 3, name: p.entry.term, item: url },
    ],
  };

  return (
    <PageShell>
      <JsonLdSchema bundle={null} fallback={[faq, breadcrumb]} />

      <nav aria-label="Breadcrumb" className="container-x pt-8">
        <ol className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-ink-mute">
          <li>
            <Link href="/problems" className="hover:text-ink">
              Problems
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-ink">{p.entry.term}</li>
        </ol>
      </nav>

      <section className="container-x pb-4 pt-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.36em] text-accent/75">
          {p.entry.term}
          {p.entry.also ? ` · also called ${p.entry.also}` : ''}
        </p>
        <h1 className="mt-5 max-w-[20ch] font-display text-[clamp(30px,4.6vw,56px)] font-light leading-[1.04] tracking-[-0.03em] text-ink">
          {p.question}
        </h1>

        {/* The answer, in one paragraph, lifted whole by anything that wants it. */}
        <p className="mt-7 max-w-[62ch] text-[16px] leading-relaxed text-ink">
          {p.entry.definition}
        </p>

        <div className="mt-8 max-w-[62ch] border-l-2 border-accent/60 pl-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
            What to do about it
          </p>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-dim">{p.entry.action}</p>
        </div>
      </section>

      {picks.length > 0 && (
        <section className="container-x py-12">
          <div className="border-t border-line pt-10">
            <h2 className="font-display text-2xl font-light text-ink sm:text-3xl">
              Books that work on this
            </h2>
            <p className="mt-3 max-w-[58ch] text-[14px] leading-relaxed text-ink-dim">
              Each is a 90-day programme. Start with the first — later books assume the work in the
              earlier ones.
            </p>
            <div className="shelf-grid mt-8">
              {picks.map((b) => (
                <BookTile key={b.slug} book={b} />
              ))}
            </div>
            {match.concept && (
              <p className="mt-6 text-[13px] text-ink-dim">
                Part of the{' '}
                <Link href={`/series/${picks[0].series_slug}`} className="text-accent underline">
                  {picks[0].series_name} series
                </Link>
                .
              </p>
            )}
          </div>
        </section>
      )}

      <section className="container-x pb-16">
        <div className="border-t border-line pt-10">
          <h2 className="font-display text-2xl font-light text-ink">How people say it</h2>
          <p className="mt-3 max-w-[58ch] text-[14px] leading-relaxed text-ink-dim">
            Nobody looks this up by its clinical name. These are the ways it actually gets said.
          </p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {p.entry.saidAs.map((s) => (
              <li
                key={s}
                className="rounded-full border border-line px-3.5 py-2 text-[12.5px] text-ink-dim"
              >
                {s}
              </li>
            ))}
          </ul>

          <p className="mt-10 text-[13px] text-ink-dim">
            Written by{' '}
            <Link href="/about-brian" className="text-accent underline">
              Brian Spiker
            </Link>
            , who has run Spiker Carpet and Tile Care since 2013 —{' '}
            <Link href="/brian-spiker-real-world-proof" className="text-accent underline">
              the receipts
            </Link>
            . More terms in{' '}
            <Link href="/encyclopedia" className="text-accent underline">
              the encyclopedia
            </Link>
            .
          </p>
        </div>
      </section>
    </PageShell>
  );
}
