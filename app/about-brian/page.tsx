import Link from 'next/link';
import { PageShell } from '@/components/PageShell';
import { Hero } from '@/components/Hero';
import { JsonLdSchema } from '@/components/JsonLdSchema';
import { CountUp } from '@/components/CountUp';
import { Reveal } from '@/components/Reveal';
import { getCatalog, getPageSeo } from '@/lib/api';
import { buildMetadata, fallbackPageSchema } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Brian Spiker — carpet guy since 2013, writes books at night',
  description:
    'Brian Spiker. Cleans carpets for a living — Spiker Carpet and Tile Care, since 2013. Carpet cleaning, upholstery, tile and grout, pet odors with enzyme treatment. Wrote 636 books in between jobs.',
  path: '/about-brian',
});

export const revalidate = 3600;

export default async function AboutBrianPage() {
  const [catalog, seo] = await Promise.all([
    getCatalog({ limit: 1 }),
    getPageSeo('/about-brian'),
  ]);

  const totalBooks = catalog?.total ?? 0;

  return (
    <PageShell>
      <JsonLdSchema
        bundle={seo}
        fallback={[
          ...fallbackPageSchema('/about-brian', 'About Brian Spiker'),
          {
            '@context': 'https://schema.org',
            '@type': 'ProfilePage',
            mainEntity: { '@id': 'https://apexflowlabs.com/about-brian#person' },
            url: 'https://books.apexflowlabs.com/about-brian',
          },
        ]}
      />

      <Hero
        eyebrow="Hi. I'm Brian."
        title={
          <>
            I clean carpets for a living.{' '}
            <span className="metallic-text">Have since 2013.</span>
          </>
        }
        body={
          <>
            That&apos;s pretty much it. I also write books, but the carpets came first. By a lot.
          </>
        }
        primary={{ href: '/brian-spiker-real-world-proof', label: 'See the receipts' }}
        secondary={{ href: '/books', label: 'Or just read a book — $6.99' }}
      />

      <section className="container-x py-16">
        <Reveal className="grid gap-12 md:grid-cols-3">
          <StatBlock label="Years cleaning carpets" sub="Spiker Carpet and Tile Care · 2013-now">
            <CountUp to={13} className="font-display text-6xl text-accent md:text-7xl" />
          </StatBlock>
          <StatBlock label="Books shipped" sub="Live count">
            {totalBooks > 0 ? (
              <CountUp to={totalBooks} className="font-display text-6xl text-accent md:text-7xl" />
            ) : (
              <span className="font-display text-6xl text-ink-mute md:text-7xl">—</span>
            )}
          </StatBlock>
          <StatBlock label="Books planned" sub="12 series × 53 books">
            <CountUp to={636} className="font-display text-6xl text-accent md:text-7xl" />
          </StatBlock>
        </Reveal>
      </section>

      <section className="border-t border-line bg-bg-subtle">
        <div className="container-x grid gap-12 py-16 md:grid-cols-[2fr_3fr]">
          <div>
            <p className="eyebrow mb-3 text-accent">The short version</p>
            <h2 className="font-display text-3xl text-ink md:text-4xl">
              One van. One wand.{' '}
              <span className="metallic-text">Knew how to clean carpets.</span> Didn&apos;t know
              how to run a business.
            </h2>
          </div>
          <div className="space-y-5 text-ink-dim text-base leading-[1.7]">
            <p>
              <span className="text-accent">2013</span> — Started Spiker Carpet and Tile Care. One
              van. One wand. Knew how to clean carpets. Didn&apos;t know how to run a business.
              Learned that part the hard way.
            </p>
            <p>
              <span className="text-accent">The work</span> — Carpet cleaning. Carpet protection.
              Upholstery cleaning and protection. Tile and grout — we clean it and seal it so it
              stops looking dirty 10 minutes after you mop. Pet smells — the wet-dog smell that
              gets baked into your carpet from microbiological oils, and urine which needs actual
              enzymes to break down or it just keeps coming back. Most guys won&apos;t bother with
              the enzyme treatment. I do, because otherwise we&apos;re just making the carpet look
              clean and the customer still smells dog piss for the next six months.
            </p>
            <p>
              <span className="text-accent">2016–2024</span> — Just kept working. Real customers.
              Real reviews. Real bad days. Days the truck broke down. Days the customer was crazy.
              Saturdays the weather wiped out. Years where I came home broke and exhausted and
              thought about quitting and didn&apos;t.
            </p>
            <p>
              <span className="text-accent">2024-ish</span> — Started writing. I was driving
              between jobs listening to self-help podcasts and getting mad at the radio. Half
              these guys have never had a real job. They were telling people stuff that sounded
              great in a studio but was wrong on a job site. So I started writing what I actually
              thought.
            </p>
            <p>
              Now there&apos;s 636 books planned. 12 series. First 12 are out.
            </p>
          </div>
        </div>
      </section>

      <section className="container-x py-20">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <p className="eyebrow mb-4 text-accent">What&apos;s different about my books</p>
            <ul className="space-y-4 text-ink-dim text-[0.97rem] leading-[1.65]">
              {DIFFERENT.map((line, i) => (
                <li key={i} className="flex gap-4">
                  <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent shrink-0 mt-1">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-4 text-accent/70">What&apos;s the same as other self-help books</p>
            <ul className="space-y-4 text-ink-dim text-[0.97rem] leading-[1.65]">
              {SAME.map((line, i) => (
                <li key={i} className="flex gap-4">
                  <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent/60 shrink-0 mt-1">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-12 max-w-2xl text-ink-dim italic text-base leading-[1.65]">
          If you read this far, you&apos;ll probably like the books.
          <br />
          If you hated this page, you&apos;ll hate them more.
          <br />
          Either way. Thanks for stopping by.
        </p>
        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.35em] text-accent/80">
          — Brian
        </p>
      </section>

      <section className="border-t border-line bg-bg-subtle">
        <div className="container-x py-16 max-w-3xl">
          <p className="eyebrow mb-3 text-accent">Stuff you can check yourself</p>
          <h2 className="font-display text-3xl text-ink md:text-4xl mb-8">
            Receipts.
          </h2>
          <ul className="space-y-3 text-ink-dim text-base leading-[1.65]">
            <li>
              <span className="text-accent">Spiker Carpet and Tile Care</span> — since 2013 —{' '}
              <a
                href="https://spikercarpetandtilecare.com"
                target="_blank"
                rel="noopener noreferrer me"
                className="text-cream border-b border-accent/40 hover:border-cream"
              >
                spikercarpetandtilecare.com
              </a>
            </li>
            <li>
              <span className="text-accent">Apex Flow Labs</span> — the parent company —{' '}
              <a
                href="https://apexflowlabs.com"
                target="_blank"
                rel="noopener noreferrer me"
                className="text-cream border-b border-accent/40 hover:border-cream"
              >
                apexflowlabs.com
              </a>
            </li>
            <li>
              <span className="text-accent">Apex Publishing House</span> — the books (you&apos;re here)
            </li>
            <li>
              <span className="text-accent">Apex Publishing House podcast</span> — free, every weekday
            </li>
          </ul>
          <p className="mt-8 italic text-ink-dim">
            If any of it&apos;s fake, email me. I pay the hosting bill. I&apos;d want to know.
          </p>
        </div>
      </section>

      <section className="container-x py-16">
        <div className="grid gap-4 md:grid-cols-2">
          <Link
            href="/brian-spiker-real-world-proof"
            className="flex flex-col gap-2 border border-line bg-bg-subtle p-8 hover:border-accent transition-colors"
          >
            <p className="eyebrow">The receipts</p>
            <p className="font-display text-2xl text-ink">See the proof →</p>
            <p className="text-sm text-ink-dim">
              Real Spiker reviews, the actual services we do, and 13 years of operating reality.
            </p>
          </Link>
          <Link
            href="/contact"
            className="flex flex-col gap-2 border border-line bg-bg-subtle p-8 hover:border-accent transition-colors"
          >
            <p className="eyebrow">Press / interviews</p>
            <p className="font-display text-2xl text-ink">Reach out →</p>
            <p className="text-sm text-ink-dim">
              Email goes to me, not an auto-responder. I still answer my own mail.
            </p>
          </Link>
        </div>
      </section>
    </PageShell>
  );
}

const DIFFERENT = [
  'I curse a lot. If you don’t curse, you’ll think I’m an asshole. That’s fine, just don’t say I didn’t warn you.',
  'I make fun of you. The way a friend would. I’m not mean about it — but I’m not going to pretend you’re not the one who downloaded five productivity apps last month.',
  'I make fun of myself more.',
  'Every chapter has a story from an actual carpet job. Not as a metaphor. Just because that’s what I have.',
  'There’s no "manifest your dreams" stuff. None. If that’s what you want, the door’s right there.',
  'There’s no morning routine chapter. Your morning routine isn’t the problem. You’re the problem and you know it.',
  'I’m not going to tell you to journal.',
];

const SAME = [
  'There’s a lot of them.',
  'They cost money. $6.99 for the ebook. Cocktail price.',
  'They’re trying to help you. I’m just trying to help the way a friend would. Which means telling you stuff you don’t want to hear.',
];

function StatBlock({
  label,
  sub,
  children,
}: {
  label: string;
  sub?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="eyebrow">{label}</p>
      <p className="mt-2">{children}</p>
      {sub ? <p className="mt-2 text-xs text-ink-mute">{sub}</p> : null}
    </div>
  );
}
