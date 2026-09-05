import Link from 'next/link';
import { BookCard } from './BookCard';
import { CLUSTERS, getSiblings, type Cluster } from '@/lib/clusters';
import { empty } from '@/lib/voice';
import type { BookSummary } from '@/lib/types';

interface ClusterHubProps {
  cluster: Cluster;
  books: BookSummary[];
}

/* SEO landing page for a topic cluster. Renders the cluster's H1
 * keyword, a grid of every book the backend (or fallback catalog
 * filter) returned, internal links back into the storefront, and a
 * sibling-clusters rail at the bottom for crawl coverage.
 */
export function ClusterHub({ cluster, books }: ClusterHubProps) {
  const siblings = getSiblings(cluster.slug, 5);

  return (
    <>
      <nav aria-label="Breadcrumb" className="container-x pt-8">
        <ol className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-ink-mute">
          <li>
            <Link href="/books" className="hover:text-ink">
              Books
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-ink">{cluster.name}</li>
        </ol>
      </nav>

      <section className="container-x py-16 md:py-20">
        <p className="eyebrow mb-3 text-accent">Topic · {cluster.keyword}</p>
        <h1 className="font-display text-4xl text-ink md:text-6xl">
          {cluster.name}
          <span className="metallic-text">.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-base text-ink-dim md:text-lg">
          {cluster.description}
        </p>
        <p className="mt-3 max-w-2xl text-sm text-ink-mute">
          Curated from the Apex Flow Publishing House library — direct links to every book
          we publish on this topic. All formats, real prices.
        </p>
      </section>

      <section className="container-x pb-16">
        {books.length === 0 ? (
          <p className="border border-line bg-bg-subtle p-8 text-sm text-ink-dim">
            {empty.catalogColdBackend}
          </p>
        ) : (
          <>
            <div className="mb-6 flex items-baseline justify-between">
              <h2 className="font-display text-2xl text-ink md:text-3xl">
                {books.length} book{books.length === 1 ? '' : 's'}
              </h2>
              <Link href="/books" className="text-xs uppercase tracking-widest text-accent hover:text-ink">
                See all 636 →
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {books.map((b, i) => (
                <BookCard key={b.slug} book={b} priority={i < 4} />
              ))}
            </div>
          </>
        )}
      </section>

      {/* Sibling clusters — internal crawl coverage + reader continuity. */}
      <section className="border-t border-line bg-bg-subtle">
        <div className="container-x py-14">
          <p className="eyebrow mb-3 text-ink-dim">Also explore</p>
          <h2 className="mb-6 font-display text-2xl text-ink md:text-3xl">
            Other topics in the library
          </h2>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {siblings.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/books/${s.slug}`}
                  className="block border border-line bg-bg p-4 transition-colors hover:border-accent/60"
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent/70">
                    /books/{s.slug}
                  </p>
                  <p className="mt-2 font-display text-base text-ink leading-tight">
                    {s.name}
                  </p>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/books" className="cta-secondary">
              <span>Browse the full 636</span>
            </Link>
            <Link href="/series" className="cta-secondary">
              <span>Browse by series</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
