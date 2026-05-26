import { PageShell } from '@/components/PageShell';
import { Hero } from '@/components/Hero';
import { CatalogFilters } from '@/components/CatalogFilters';
import { JsonLdSchema } from '@/components/JsonLdSchema';
import { SaleCallout } from '@/components/SaleCallout';
import { getCatalog, getPageSeo } from '@/lib/api';
import { buildMetadata, fallbackPageSchema } from '@/lib/seo';
import { empty } from '@/lib/voice';

export const metadata = buildMetadata({
  title: 'All books — Apex Publishing House',
  description:
    'The full Apex Publishing House library. 636 books across 12 series. Filter by series, wave, format, or voice intensity.',
  path: '/books',
});

export const revalidate = 300;

export default async function BooksPage() {
  const [catalog, seo] = await Promise.all([
    getCatalog({ limit: 200 }),
    getPageSeo('/books'),
  ]);

  const books = catalog?.books ?? [];

  return (
    <PageShell>
      <JsonLdSchema bundle={seo} fallback={fallbackPageSchema('/books', 'All books')} />

      <Hero
        eyebrow="The library"
        title={
          <>
            All books. <span className="metallic-text">Pick your fight.</span>
          </>
        }
        body="Filter by series, wave, format, or voice intensity. Sort defaults to Wave I → Wave IV, then by book number inside each series."
      />

      <section className="container-x pt-8">
        <SaleCallout />
      </section>

      <section className="container-x py-12">
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
