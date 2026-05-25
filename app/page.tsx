import Link from 'next/link';
import { PageShell } from '@/components/PageShell';
import { HomeHero } from '@/components/HomeHero';
import { BookCard } from '@/components/BookCard';
import { JsonLdSchema } from '@/components/JsonLdSchema';
import { Reveal, RevealStagger, RevealItem } from '@/components/Reveal';
import { ReviewTile } from '@/components/ReviewTile';
import { Magnetic } from '@/components/Magnetic';
import { LeadCapture } from '@/components/LeadCapture';
import { FoundationSection } from '@/components/FoundationSection';
import { FeaturedShowcase } from '@/components/FeaturedShowcase';
import { LaunchOffer } from '@/components/LaunchOffer';
import { SeriesRosterMarquee } from '@/components/SeriesRosterMarquee';
import { LAUNCH } from '@/lib/launch';
import { TrustBar } from '@/components/TrustBar';
import { AnimatedReviewsRail } from '@/components/AnimatedReviewsRail';
import { WholePitch } from '@/components/WholePitch';
import { FounderNote } from '@/components/FounderNote';
import { AcrossEcosystem } from '@/components/AcrossEcosystem';
import { HomeReviews } from '@/components/HomeReviews';
import { getCatalog, getPageSeo, getSeriesList, getSpikerReviews } from '@/lib/api';
import { buildMetadata, fallbackPageSchema } from '@/lib/seo';
import { intensityGlyphs, waveLabel } from '@/lib/utils';
import { empty } from '@/lib/voice';
import type { Wave } from '@/lib/types';

export const metadata = buildMetadata({
  title: 'Apex Publishing House — 636 books. 12 series. One war manual library.',
  description:
    '636 books. 12 series. Operator-grade self-help built on 13 years of operations at Spiker Carpet and Tile Care.',
  path: '/',
});

export const revalidate = 300;

const WAVE_TILES: Array<{
  wave: Wave;
  label: string;
  tagline: string;
  body: string;
  gradient: string;
  border: string;
  accent: string;
  eyebrow: string;
}> = [
  // All four wave tiles use the same black + gold treatment; the rank is
  // signaled by intensity (border alpha + gold gradient strength), not hue.
  {
    wave: 1,
    label: 'Wave I · Foundation',
    tagline: 'The intake protocols.',
    body: 'Discipline, mornings, money basics, fitness, sleep. Three series, 159 books. Start here if the floor is wet.',
    gradient: 'from-accent/20 to-accent/0',
    border: 'border-accent/15',
    accent: 'text-accent/70',
    eyebrow: 'Live now',
  },
  {
    wave: 2,
    label: 'Wave II · Pressure',
    tagline: 'When the company starts pulling.',
    body: 'Hiring, leadership, scaling, customer ops, hard conversations. Three series, 159 books.',
    gradient: 'from-accent/25 to-accent/0',
    border: 'border-accent/25',
    accent: 'text-accent/80',
    eyebrow: 'Live now',
  },
  {
    wave: 3,
    label: 'Wave III · Edge',
    tagline: 'Where most operators break.',
    body: 'Burnout, marriage under pressure, second-location math, identity-vs-role. Three series, 159 books.',
    gradient: 'from-accent/30 to-accent/0',
    border: 'border-accent/35',
    accent: 'text-accent/90',
    eyebrow: 'Drops Q3 2026',
  },
  {
    wave: 4,
    label: 'Wave IV · Apex',
    tagline: 'The boring kind of winning.',
    body: 'Post-grind operations. Long-arc strategy. Legacy + handoff. Three series, 159 books.',
    gradient: 'from-accent/35 to-accent/0',
    border: 'border-accent/45',
    accent: 'text-accent',
    eyebrow: 'Drops Q1 2027',
  },
];

export default async function HomePage() {
  const [catalog, series, reviews, seo] = await Promise.all([
    getCatalog({ limit: 12 }),
    getSeriesList(),
    getSpikerReviews(3),
    getPageSeo('/'),
  ]);

  const featured = (catalog?.books ?? []).slice(0, 8);
  const heroCovers = (catalog?.books ?? []).slice(0, 7);
  const allSeries = (series?.series ?? []).slice(0, 12);
  const spikerReviews = reviews?.reviews ?? [];
  const totalBooks = catalog?.total ?? 0;

  return (
    <PageShell>
      <JsonLdSchema bundle={seo} fallback={fallbackPageSchema('/', 'Apex Publishing House')} />

      <HomeHero books={heroCovers} totalBooks={totalBooks} />

      {/* Press credibility strip — first trust signal under the hero */}
      <TrustBar />

      {/* The Foundation — cinematic chrome-text section */}
      <FoundationSection />

      {/* Launch-week offer — replaces the Featured parallax during the
          promo window. When LAUNCH.active flips to false in
          lib/launch.ts, falls back to the Featured carousel
          automatically. */}
      {LAUNCH.active ? (
        <LaunchOffer totalBooks={totalBooks} />
      ) : featured.length === 0 ? (
        <section id="featured" className="relative z-10 px-6 py-12 sm:py-28 lg:py-32">
          <div className="mx-auto w-full max-w-7xl">
            <Reveal>
              <p className="text-[10px] uppercase tracking-[0.36em] text-accent">Featured</p>
              <h2 className="mt-3 font-display text-4xl text-ink sm:text-5xl">
                Fresh from the warehouse.
              </h2>
              <p className="mt-14 rounded-[1.5rem] border border-line bg-bg/40 p-8 text-sm text-ink-dim backdrop-blur-md">
                {empty.catalogColdBackend}
              </p>
            </Reveal>
          </div>
        </section>
      ) : (
        <FeaturedShowcase totalBooks={totalBooks} books={featured} />
      )}

      {/* The 12 series — 4 wave tiles, digital-art categories style */}
      <section className="relative z-10 border-t border-white/5 px-6 py-12 sm:py-28 lg:py-32">
        <div className="mx-auto w-full max-w-7xl">
          <Reveal>
            <p className="text-[10px] uppercase tracking-[0.36em] text-accent">The 12 series</p>
            <h2 className="mt-3 max-w-3xl font-display text-4xl text-ink sm:text-6xl">
              Four waves. Twelve fronts. <span className="metallic-text">One operator.</span>
            </h2>
            <p className="mt-4 max-w-2xl text-base text-ink-dim md:text-lg">
              Foundation, Pressure, Edge, Apex. Each wave compounds on the last. Each series picks
              a different battlefield — pick the war you are fighting now.
            </p>
          </Reveal>

          <RevealStagger className="mt-14 grid gap-5 md:grid-cols-2" amount={0.1}>
            {WAVE_TILES.map((t) => (
              <RevealItem key={t.wave}>
                <Link
                  href={`/series?wave=${t.wave}`}
                  className={`group relative block overflow-hidden rounded-[2rem] border ${t.border} bg-gradient-to-br ${t.gradient} p-10 backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_-20px_rgba(217,204,140,0.4)]`}
                  data-cursor-label="Open wave"
                >
                  <div className="flex items-start justify-between">
                    <p className={`text-[10px] uppercase tracking-[0.32em] ${t.accent}`}>
                      {t.eyebrow}
                    </p>
                    <span className="font-display text-2xl text-ink/50">0{t.wave}</span>
                  </div>
                  <h3 className="mt-6 font-display text-3xl text-ink md:text-4xl">{t.label}</h3>
                  <p className="mt-3 font-display text-xl text-ink-dim italic">{t.tagline}</p>
                  <p className="mt-5 text-sm leading-relaxed text-ink-dim">{t.body}</p>
                  <p className="mt-8 text-[11px] uppercase tracking-[0.28em] text-ink-dim transition-colors group-hover:text-accent">
                    Browse wave →
                  </p>
                </Link>
              </RevealItem>
            ))}
          </RevealStagger>
        </div>
      </section>

      {/* All 12 series — real series data from the live backend, displayed
          via the locked b1–b12 local covers. */}
      <SeriesRosterMarquee seriesList={allSeries} />

      {/* Authority — real-world proof, gradient bg */}
      <section className="relative z-10 overflow-hidden border-t border-white/5 px-6 py-12 sm:py-28 lg:py-36">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(70% 80% at 80% 50%, rgba(217,204,140,0.12) 0%, transparent 70%), radial-gradient(50% 70% at 0% 100%, rgba(217,204,140,0.06) 0%, transparent 70%)',
          }}
        />
        <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-16 md:grid-cols-[5fr_4fr]">
          <Reveal>
            <p className="text-[10px] uppercase tracking-[0.36em] text-accent">Real-world proof</p>
            <h2 className="mt-3 font-display text-4xl text-ink sm:text-6xl">
              <span className="metallic-text">13 years.</span>
              <br />
              Not a single ghostwriter.
            </h2>
            <p className="mt-6 max-w-xl text-base text-ink-dim md:text-lg">
              Brian ran Spiker Carpet and Tile Care for thirteen years before he wrote a word. Every chapter is
              back-tested against a real payroll, real customers, real failures. The books are the
              field notes — and the schema on every page on this site points at the original
              business so AI search can verify the receipts.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Magnetic>
                <Link
                  href="/brian-spiker-real-world-proof"
                  className="cta-primary"
                  data-cursor-label="See proof"
                >
                  <span>See the 16-year timeline</span>
                </Link>
              </Magnetic>
              <Magnetic strength={0.2}>
                <a
                  href="https://spikercarpetandtilecare.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cta-secondary"
                  data-cursor-label="Open"
                >
                  <span>Visit Spiker Carpet and Tile Care</span>
                </a>
              </Magnetic>
            </div>
          </Reveal>

          {spikerReviews.length === 0 ? (
            <Reveal>
              <AnimatedReviewsRail />
            </Reveal>
          ) : (
            <RevealStagger className="grid gap-4" amount={0.1}>
              {spikerReviews.map((r) => (
                <RevealItem key={r.id}>
                  <ReviewTile review={r} />
                </RevealItem>
              ))}
            </RevealStagger>
          )}
        </div>
      </section>

      {/* Lead capture banner */}
      <section className="relative z-10 px-6 py-10 sm:py-24">
        <div className="mx-auto w-full max-w-3xl">
          <Reveal>
            <LeadCapture
              sourcePage="/"
              optInAsset="home-banner"
              heading="Free chapter + 15% off your first order"
              subheading="Drop your email. We send chapter one of The Discipline Blueprint and a one-time 15% discount code. No drip, no daily nag — that is a promise."
              cta="Send chapter one"
            />
          </Reveal>
        </div>
      </section>

      {/* Membership / bundles / founder — pricing trifecta, digital-art vault style */}
      <section className="relative z-10 border-t border-white/5 bg-gradient-to-b from-transparent via-[#1a0a07]/40 to-transparent px-6 py-12 sm:py-28 lg:py-32">
        <div className="mx-auto w-full max-w-7xl">
          <Reveal className="max-w-3xl">
            <p className="text-[10px] uppercase tracking-[0.36em] text-accent">Three ways in</p>
            <h2 className="mt-3 font-display text-4xl text-ink sm:text-6xl">
              Pick your tier.
            </h2>
            <p className="mt-4 text-base text-ink-dim md:text-lg">
              One annual Pass, four one-time bundles, or a 100/year application-only Founder
              Edition. Same library, different relationship with it.
            </p>
          </Reveal>

          <RevealStagger className="mt-14 grid gap-6 md:grid-cols-3" amount={0.1}>
            <RevealItem>
              <Tier
                eyebrow="Books Pass"
                price="$99"
                priceSub="/ year"
                body="Full audiobook library, 20% off all hardcovers, monthly bonus episode, early access."
                href="/membership"
                cta="Get the Pass"
                tone="default"
              />
            </RevealItem>
            <RevealItem>
              <Tier
                eyebrow="Series bundles"
                price="$79"
                priceSub="ebook · $149 audio"
                body="One series — 53 books — one price. Or the 12-series everything bundle at $1,499."
                href="/bundles"
                cta="See bundles"
                tone="default"
              />
            </RevealItem>
            <RevealItem>
              <Tier
                eyebrow="Founder Edition"
                price="$9,999"
                priceSub="application only · 100/year"
                body="Signed 636-book hardcover set, lifetime Pass, 90-min call with Brian, numbered 1–100."
                href="/founder-edition"
                cta="Apply"
                tone="accent"
              />
            </RevealItem>
          </RevealStagger>
        </div>
      </section>

      {/* Reader file — site-wide reviews marquee */}
      <HomeReviews reviews={spikerReviews} />

      {/* The whole pitch — Scale.tsx-style climax */}
      <WholePitch />

      {/* Founder note — handwritten card from Brian */}
      <FounderNote />

      {/* Across the ecosystem — 11 sister Apex Flow Labs + Spiker */}
      <AcrossEcosystem />

      {/* AI Concierge invite — like CompanionInvite */}
      <section className="relative z-10 px-6 py-10 sm:py-24">
        <div className="mx-auto w-full max-w-7xl">
          <Reveal
            className="relative overflow-hidden rounded-[2rem] border border-accent/30 bg-gradient-to-br from-accent/15 to-transparent p-10 backdrop-blur-md md:p-16"
          >
            <span
              aria-hidden
              className="absolute right-12 top-12 hidden h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_16px_4px_rgba(217,204,140,0.6)] md:block"
            />
            <p className="text-[10px] uppercase tracking-[0.36em] text-accent">
              Section · 10 · Concierge AI
            </p>
            <h2 className="mt-6 max-w-[14ch] font-display text-5xl text-ink md:text-7xl lg:text-[80px]">
              Talk to the <span className="metallic-text">system.</span>
            </h2>
            <p className="mt-8 max-w-2xl text-base text-ink-dim md:text-xl">
              The chat button in the corner is wired to a concierge trained on the entire library.
              Ask what to start with, what the 12 series cover, or which book maps to your
              operation. It points, it does not pitch.
            </p>
            <p className="mt-6 text-xs uppercase tracking-[0.28em] text-ink-mute">
              ↘ Tap the floating button bottom-right
            </p>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}

function Tier({
  eyebrow,
  price,
  priceSub,
  body,
  href,
  cta,
  tone,
}: {
  eyebrow: string;
  price: string;
  priceSub: string;
  body: string;
  href: string;
  cta: string;
  tone: 'default' | 'accent';
}) {
  return (
    <div
      className={`group relative flex h-full flex-col overflow-hidden rounded-[2rem] border p-10 backdrop-blur-md transition-all duration-500 hover:-translate-y-1 ${
        tone === 'accent'
          ? 'border-accent/40 bg-gradient-to-br from-accent/20 to-transparent hover:border-accent'
          : 'border-white/10 bg-black/30 hover:border-ink-dim'
      }`}
    >
      <p
        className={`text-[10px] uppercase tracking-[0.32em] ${
          tone === 'accent' ? 'text-accent' : 'text-ink-dim'
        }`}
      >
        {eyebrow}
      </p>
      <p className="mt-6 font-display text-5xl text-ink">
        {price}
        <span className="ml-2 text-base text-ink-dim">{priceSub}</span>
      </p>
      <p className="mt-5 flex-1 text-sm leading-relaxed text-ink-dim">{body}</p>
      <Magnetic strength={0.2}>
        <Link
          href={href}
          className="cta-primary mt-8 rounded-full px-8 py-3.5 tracking-[0.28em]"
          data-cursor-label="Open"
        >
          <span>{cta} →</span>
        </Link>
      </Magnetic>
    </div>
  );
}
