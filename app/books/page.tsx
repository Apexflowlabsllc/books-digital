import { PageShell } from '@/components/PageShell';
import { CatalogFilters } from '@/components/CatalogFilters';
import { JsonLdSchema } from '@/components/JsonLdSchema';
import { getCatalog, getPageSeo } from '@/lib/api';
import { buildMetadata, fallbackPageSchema, collectionPageSchema } from '@/lib/seo';
import { empty } from '@/lib/voice';
import { catalogFacts } from '@/lib/catalogFacts';

export const metadata = buildMetadata({
  title: 'All books — Apex Flow Publishing House',
  description:
    'The full Apex Flow Publishing House library — a 636-title programme across 12 series, releasing book by book. Filter by series, wave, format, or voice intensity.',
  path: '/books',
});

export const revalidate = 300;

/**
 * THE LIBRARY.
 *
 * This page used to open with the full marketing Hero — a 5.5rem headline on
 * an opaque panel, a gold radial wash behind it, then a gold launch-sale strip
 * — before a single book appeared. Landing on it meant a screen of gold before
 * any catalog, and then 636 large cards arriving at once underneath.
 *
 * A catalog index is not a landing page. The header is now three lines, the
 * sale lives where it already lived (the site banner and the floating pill),
 * and the books start immediately. Everything below is shelved by series in
 * CatalogFilters.
 */
export default async function BooksPage() {
  const [catalog, seo] = await Promise.all([
    // No limit — getCatalog reads the backend's own `total` and fetches all of
    // them. Passing 200 here is what kept 436 of the 636 books off this page.
    getCatalog(),
    getPageSeo('/books'),
  ]);

  const books = catalog?.books ?? [];
  const facts = catalogFacts(books);
  const seriesCount = facts.seriesCount;

  /* Audited live: this page carried only Organization/Person/WebPage. 636
   * books listed and no ItemList, CollectionPage or BreadcrumbList — an engine
   * saw a wall of links with no statement of what the list is. */
  const collection = collectionPageSchema({
    path: '/books',
    name: 'All books',
    description: `Every Apex Flow Publishing House title: ${facts.titlesAvailable} available now of a ${facts.titlesPlanned}-title programme across ${seriesCount} series, each a 90-day course.`,
    items: books.map((b) => ({ url: `/books/${b.slug}`, name: b.title })),
  });

  return (
    <PageShell>
      <JsonLdSchema
        bundle={seo}
        fallback={[...fallbackPageSchema('/books', 'All books'), ...collection]}
      />

      <section className="container-x pb-2 pt-16 sm:pt-20">
        <p className="font-mono text-[10px] uppercase tracking-[0.36em] text-accent/75">
          The library
        </p>
        <h1 className="mt-5 font-display text-[clamp(34px,5.4vw,64px)] font-light leading-[1.02] tracking-[-0.03em] text-ink">
          Every book, by series.
        </h1>
        <p className="mt-5 max-w-[58ch] text-[15px] leading-relaxed text-ink-dim">
          {facts.titlesAvailable.toLocaleString()} books available now, from a {facts.titlesPlanned.toLocaleString()}-title programme across {seriesCount} series, each one a 90-day
          course. Shelves open one at a time — pick a fight and the rest gets out of the way.
        </p>
      </section>

      <section className="container-x pb-24 pt-8">
        {books.length === 0 ? (
          <p className="border border-line bg-bg-subtle p-8 text-sm text-ink-dim">
            {empty.catalogColdBackend}
          </p>
        ) : (
          <CatalogFilters books={books} />
        )}
      </section>
    </PageShell>
  );
}
