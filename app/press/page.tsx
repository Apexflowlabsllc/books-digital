import Link from 'next/link';
import { PageShell } from '@/components/PageShell';
import { Hero } from '@/components/Hero';
import { JsonLdSchema } from '@/components/JsonLdSchema';
import { getPageSeo } from '@/lib/api';
import { buildMetadata, fallbackPageSchema } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Press — Apex Flow Publishing House',
  description:
    'Press kit for Apex Flow Publishing House. Boilerplate, bio, high-res assets, and the answer to "is the rug-cleaning thing real?" — yes.',
  path: '/press',
});

export const revalidate = 3600;

const FACTS = [
  ['Founder', 'Brian Spiker'],
  ['Original business', 'Spiker Carpet and Tile Care (since 2013 · spikercarpetandtilecare.com)'],
  ['What Spiker does', 'Carpet cleaning + protection · upholstery cleaning + protection · tile and grout cleaning + sealing · pet odor removal (enzymes for urine, treatment for wet-dog oils)'],
  ['Library size', '636-title programme · 12 series · 53 titles per series · releasing book by book'],
  ['Cadence', 'One short chapter per day · 90 chapters per book'],
  ['Pricing', 'Ebook $6.99 · Paperback $14.99 · Hardcover $24.99 · Audiobook $14.99'],
  ['Insider Pass', '$99 / year — the whole library as it releases, audio as it is narrated, 20% off every Apex brand'],
  ['Founder Edition', '$9,999 — 100 founding spots ever · application only'],
  ['Audiobook narration', 'AI-narrated · supervised by Brian'],
];

export default async function PressPage() {
  const seo = await getPageSeo('/press');

  return (
    <PageShell>
      <JsonLdSchema bundle={seo} fallback={fallbackPageSchema('/press', 'Press kit')} />

      <Hero
        eyebrow="Press kit"
        title={
          <>
            <span className="metallic-text">Press kit.</span> Just the facts.
          </>
        }
        body="If you write about books, podcasts, or self-help and want to interview Brian or get review copies — this is for you. If you're a customer who just wants to check that the carpet business is real, go straight to spikercarpetandtilecare.com."
      />

      <section className="container-x py-16">
        <div className="grid gap-12 md:grid-cols-[2fr_3fr]">
          <div>
            <p className="eyebrow mb-3">One-liner</p>
            <h2 className="font-display text-3xl text-ink md:text-4xl">
              <span className="metallic-text">R-rated self-help</span> from a guy who&apos;s cleaned
              carpets since 2013.
            </h2>
            <p className="mt-4 text-ink-dim">
              That&apos;s the whole story in one sentence. The rest is supporting evidence.
            </p>
          </div>

          <div>
            <p className="eyebrow mb-3">Fact sheet</p>
            <dl className="border border-line bg-bg-subtle">
              {FACTS.map(([k, v], i) => (
                <div
                  key={i}
                  className="grid grid-cols-[140px_1fr] gap-4 border-b border-line p-4 last:border-b-0 md:grid-cols-[180px_1fr]"
                >
                  <dt className="text-xs uppercase tracking-widest text-ink-mute">{k}</dt>
                  <dd className="text-sm text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-bg-subtle">
        <div className="container-x py-16">
          <p className="eyebrow mb-3 text-accent">Boilerplate (use this in articles)</p>
          <div className="border border-line bg-bg p-6 text-sm text-ink leading-relaxed md:p-8">
            <p>
              Brian Spiker started Spiker Carpet and Tile Care in 2013. The business does carpet
              cleaning, upholstery cleaning, tile and grout cleaning and sealing, and pet odor
              removal — including enzyme treatment for urine and microbiological oil treatment
              for wet-dog smells. After 13 years of running it, he started writing Apex Book
              Publishing, a 636-book self-help catalog across 12 series in an R-rated, savage,
              plain-spoken voice. He&apos;s the founder of Apex Flow Labs, a 12-brand ecosystem
              spanning books, podcasts, courses, digital products, apparel, AI tools, and
              consumer brands.
            </p>
          </div>
        </div>
      </section>

      <section className="container-x py-16">
        <div className="grid gap-4 md:grid-cols-3">
          <Link
            href="/about-brian"
            className="border border-line bg-bg-subtle p-6 hover:border-accent transition-colors"
          >
            <p className="eyebrow">About Brian</p>
            <p className="mt-2 font-display text-xl text-ink">Background + bio →</p>
          </Link>
          <Link
            href="/brian-spiker-real-world-proof"
            className="border border-line bg-bg-subtle p-6 hover:border-accent transition-colors"
          >
            <p className="eyebrow">The proof page</p>
            <p className="mt-2 font-display text-xl text-ink">Receipts + Spiker reviews →</p>
          </Link>
          <a
            href="mailto:press@apexflowlabs.com"
            className="border border-line bg-bg-subtle p-6 hover:border-accent transition-colors"
          >
            <p className="eyebrow">Press contact</p>
            <p className="mt-2 font-display text-xl text-ink">press@apexflowlabs.com →</p>
          </a>
        </div>
      </section>
    </PageShell>
  );
}
