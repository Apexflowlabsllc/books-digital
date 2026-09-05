import Link from 'next/link';
import { PageShell } from '@/components/PageShell';
import { Hero } from '@/components/Hero';
import { JsonLdSchema } from '@/components/JsonLdSchema';
import { getPageSeo } from '@/lib/api';
import { buildMetadata, fallbackPageSchema } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Bundles — series + the 12-series everything bundle',
  description:
    'Series bundles at $79 ebook / $149 audio. 12-series complete ebook at $499. 12-series everything at $1,499.',
  path: '/bundles',
});

export const revalidate = 3600;

// Master §1.5 — locked SKUs. Backend owns the actual product/price config.
const BUNDLES = [
  {
    name: 'Single-Series Bundle',
    price: '$79',
    note: '53 books · one full series · ebook',
    body: 'Pick any one of the 12 series. All 53 books in ebook. Save ~70% vs. buying them one at a time. For the guy who knows exactly which fight he\'s in.',
    sku: 'series-bundle-ebook',
  },
  {
    name: 'Series — Audio',
    price: '$149',
    note: '53 audiobooks · one full series',
    body: 'All 53 audiobooks of a single series, narrated savage. For people who do their reading at 65 MPH between job sites.',
    sku: 'series-bundle-audio',
  },
  {
    name: 'The Twelve — Ebook Library',
    price: '$499',
    note: '636-title library · all 12 series · ebook',
    body: 'The complete library in ebook — all 636 titles as they release. Every series. Every chapter. For the reader who wants the whole catalog in one purchase instead of a membership.',
    sku: 'twelve-series-ebook',
  },
  {
    name: 'The Full Arsenal',
    price: '$1,499',
    note: '636-title library · ebook + audiobook',
    body: 'Every book, every format — ebook and audiobook, delivered as each one releases. The whole 90-day program across all 12 fronts. The cheapest path to the entire library without picking the Pass.',
    sku: 'twelve-series-everything',
  },
];

export default async function BundlesPage() {
  const seo = await getPageSeo('/bundles');

  return (
    <PageShell>
      <JsonLdSchema bundle={seo} fallback={fallbackPageSchema('/bundles', 'Bundles')} />

      <Hero
        eyebrow="Bundles"
        title={
          <>
            Because buying 53 books one at a time{' '}
            <span className="metallic-text">is exhausting.</span>
          </>
        }
        body="Pick a single series at $79. Grab the whole 636-title library in ebook at $499. Or get every book in every format, ebook and audiobook, delivered as each releases — $1,499 and never think about it again."
      />

      <section className="container-x py-16">
        <div className="grid gap-6 md:grid-cols-2">
          {BUNDLES.map((b) => (
            <div key={b.sku} className="flex flex-col border border-line bg-bg-subtle p-8">
              <p className="eyebrow">{b.note}</p>
              <p className="mt-3 font-display text-3xl text-ink">{b.name}</p>
              <p className="mt-2 font-display text-5xl text-accent">{b.price}</p>
              <p className="mt-4 flex-1 text-sm text-ink-dim">{b.body}</p>
              <form
                action={`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/checkout/start`}
                method="post"
                className="mt-6"
              >
                <input type="hidden" name="product" value={b.sku} />
                <input type="hidden" name="source" value="books-frontend-bundles" />
                <button type="submit" className="cta-primary w-full">
                  Buy {b.price}
                </button>
              </form>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-line bg-bg-subtle">
        <div className="container-x py-16">
          <div className="grid gap-4 md:grid-cols-2">
            <Link
              href="/founder-edition"
              className="flex flex-col gap-2 border border-accent/40 bg-bg p-8 hover:border-accent transition-colors"
            >
              <p className="eyebrow text-accent">$9,999 tier</p>
              <p className="font-display text-2xl text-ink">Founder Edition →</p>
              <p className="text-sm text-ink-dim">
                Signed 636-book hardcover set + Apex Vault membership + one-hour call
                with Brian. Application only. 100 spots ever.
              </p>
            </Link>
            <Link
              href="/membership"
              className="flex flex-col gap-2 border border-line bg-bg p-8 hover:border-accent transition-colors"
            >
              <p className="eyebrow">Books Pass</p>
              <p className="font-display text-2xl text-ink">$99/yr — full audiobook library →</p>
              <p className="text-sm text-ink-dim">
                Want unlimited audio + 20% off hardcovers instead of a bundle? The Pass
                is the better deal if you read continuously.
              </p>
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
