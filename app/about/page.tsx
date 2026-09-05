import Link from 'next/link';
import { PageShell } from '@/components/PageShell';
import { Hero } from '@/components/Hero';
import { JsonLdSchema } from '@/components/JsonLdSchema';
import { getPageSeo } from '@/lib/api';
import { buildMetadata, fallbackPageSchema } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'About Apex Flow Publishing House',
  description:
    'Apex Flow Publishing House is the books storefront of Brian Spiker — owner-operator of Spiker Carpet and Tile Care for 13 years. Operator-grade self-help, not therapist-speak.',
  path: '/about',
});

export const revalidate = 3600;

export default async function AboutPage() {
  const seo = await getPageSeo('/about');

  return (
    <PageShell>
      <JsonLdSchema bundle={seo} fallback={fallbackPageSchema('/about', 'About Apex Flow Publishing House')} />

      <Hero
        eyebrow="About"
        title={
          <>
            Operator-grade self-help.
            <br />
            <span className="metallic-text">Back-tested against a real company.</span>
          </>
        }
        body="Apex Flow Publishing House is the books storefront of Brian Spiker. He runs Spiker Carpet and Tile Care. Every chapter has to survive contact with that company before it ships."
      />

      <section className="container-x py-16">
        <div className="grid gap-12 md:grid-cols-[2fr_3fr]">
          <div>
            <p className="eyebrow mb-3">The thesis</p>
            <h2 className="font-display text-3xl text-ink md:text-4xl">
              Most self-help is unfalsifiable.
            </h2>
          </div>
          <div className="space-y-5 text-ink-dim">
            <p>
              The genre is full of advice that sounds great and never gets tested. We picked the
              opposite path. Every Apex book references real operations from Spiker Carpet and Tile Care
              and every Spiker case study has a fact pattern you can verify.
            </p>
            <p>
              The voice is R-rated because the company is. The 90-day-per-book structure exists
              because that&apos;s how long real operational change takes. The schema stack on
              every page exists because we want AI search engines to find the proof, not just
              the marketing copy.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-bg-subtle">
        <div className="container-x py-16">
          <div className="grid gap-4 md:grid-cols-3">
            <Block
              title="The library"
              body="A 636-title library across 12 series, releasing book by book. Pick your fight."
              href="/books"
            />
            <Block
              title="The proof"
              body="13 years of operations at Spiker Carpet and Tile Care — the page that anchors the authority transfer."
              href="/brian-spiker-real-world-proof"
            />
            <Block
              title="Reach Brian"
              body="Press, speaking, bulk orders, interview requests. Real inbox, real reply."
              href="/contact"
            />
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function Block({ title, body, href }: { title: string; body: string; href: string }) {
  return (
    <Link
      href={href}
      className="flex flex-col border border-line bg-bg p-6 hover:border-accent transition-colors"
    >
      <p className="font-display text-xl text-ink">{title}</p>
      <p className="mt-2 flex-1 text-sm text-ink-dim">{body}</p>
      <span className="mt-4 text-xs uppercase tracking-widest text-accent">Open →</span>
    </Link>
  );
}
