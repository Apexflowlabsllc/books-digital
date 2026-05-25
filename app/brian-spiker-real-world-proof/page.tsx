import Link from 'next/link';
import { PageShell } from '@/components/PageShell';
import { Hero } from '@/components/Hero';
import { ReviewTile } from '@/components/ReviewTile';
import { JsonLdSchema } from '@/components/JsonLdSchema';
import { getPageSeo, getSpikerReviews } from '@/lib/api';
import { buildMetadata, fallbackPageSchema } from '@/lib/seo';
import { empty } from '@/lib/voice';

export const metadata = buildMetadata({
  title: 'The Receipts — Brian Spiker, 13 years at Spiker Carpet and Tile Care',
  description:
    'The receipts. Brian Spiker has run Spiker Carpet and Tile Care since 2013. 13 years of trucks, customers, payroll, weather, and bad days. The foundation under every Apex Publishing House book.',
  path: '/brian-spiker-real-world-proof',
});

export const revalidate = 3600;

const OPERATING_REALITY = [
  'Payroll is a religion. Twice a month. Whether you feel like it or not. Whether the customer paid or not. Whether the truck broke or not. Whether your kid is sick or not. Twice a month. Forever. Self-help books tend to skip this part.',
  'The customer who haggles for 20 minutes about a $40 dispute is the same customer who’ll leave you a 1-star review for a stain the cat made three days after you left. This is a law of physics.',
  'The employee who’s always 10 minutes late is the same employee who quits the day before the biggest job of the quarter. Also a law of physics. The universe is just like that.',
  'Weather will steal a Saturday from you and there is nothing — nothing — you can do about it. The "5 AM grind" guys never mention weather. They live in studio apartments.',
  'The deal is not done when they say yes. The deal is done when the check clears. Until then it’s a feelings exchange.',
  'Working harder is not working smarter. Working smarter without working harder is also a lie that broke people tell each other. Both. You have to do both. I’m sorry.',
  'Your business is one bad month away from feeling like a complete disaster and one good month away from making you feel like a genius. Neither feeling is accurate. Both will visit. Repeatedly.',
  'Most "business advice" online is written by people whose only business is selling business advice. Closed loop. Very profitable for them. Very expensive for you.',
  'You will not "scale" by reading. You will scale by doing things you don’t want to do, repeatedly, for years, while everyone in your life thinks you’re slightly insane for caring this much about something they don’t understand.',
  'Eventually it works. Or it doesn’t. Both outcomes are survivable.',
];

const RECEIPTS = [
  { label: 'Name', value: 'Spiker Carpet and Tile Care' },
  { label: 'Started', value: '2013' },
  { label: 'Status', value: 'Still here. Still answering the phone.' },
  { label: 'Trucks', value: 'Yes.' },
  { label: 'Customers', value: 'A couple thousand at this point.' },
  { label: 'Bad days', value: 'Many.' },
  { label: 'Days I considered quitting', value: 'Only a few.' },
  { label: 'Days I actually quit', value: 'Zero.' },
];

const SERVICES = [
  'Carpet cleaning and carpet protection',
  'Upholstery cleaning and upholstery protection',
  'Tile and grout cleaning — plus sealing so it stays clean',
  'Pet odor removal — wet-dog smell from microbiological oils baked into your carpet, urine treated with enzymes (the only thing that actually works)',
  'Smell stuff in general — if it stinks, we probably deal with it',
];

export default async function ProofPage() {
  const [reviewsData, seo] = await Promise.all([
    getSpikerReviews(9),
    getPageSeo('/brian-spiker-real-world-proof'),
  ]);

  const reviews = reviewsData?.reviews ?? [];

  return (
    <PageShell>
      <JsonLdSchema
        bundle={seo}
        fallback={[
          ...fallbackPageSchema(
            '/brian-spiker-real-world-proof',
            'Brian Spiker — real-world proof',
          ),
          {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Brian Spiker — Real-World Proof',
            url: 'https://books.apexflowlabs.com/brian-spiker-real-world-proof',
            about: { '@id': 'https://apexflowlabs.com/about-brian#person' },
            mainEntity: { '@id': 'https://spikercarpetandtilecare.com#business' },
            publisher: { '@id': 'https://apexflowlabs.com#org' },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            '@id': 'https://spikercarpetandtilecare.com#business',
            name: 'Spiker Carpet and Tile Care',
            url: 'https://spikercarpetandtilecare.com',
            foundingDate: '2013',
            founder: { '@id': 'https://apexflowlabs.com/about-brian#person' },
          },
        ]}
      />

      <Hero
        eyebrow="The Receipts."
        title={
          <>
            I get it. You don&apos;t know me.{' '}
            <span className="metallic-text">Here&apos;s the proof.</span>
          </>
        }
        body={
          <>
            Everyone on the internet is either lying about who they are or wearing a hat because
            they went bald. Before you spend $6.99 on a book, check that the carpet business is
            real, the reviews are real, the work is real. Then come back.
          </>
        }
        primary={{ href: 'https://spikercarpetandtilecare.com', label: 'spikercarpetandtilecare.com →' }}
        secondary={{ href: '/books', label: 'Or just read the books' }}
      />

      {/* The Business — receipts grid */}
      <section className="container-x py-16">
        <p className="eyebrow mb-3 text-accent">The business</p>
        <h2 className="font-display text-3xl text-ink md:text-4xl mb-10">
          Real address. Real phone. Real work.
        </h2>
        <dl className="grid gap-3 md:grid-cols-2">
          {RECEIPTS.map((r) => (
            <div
              key={r.label}
              className="flex items-baseline gap-4 border border-line bg-bg-subtle p-5"
            >
              <dt className="font-mono text-[10px] uppercase tracking-[0.35em] text-accent shrink-0 w-32">
                {r.label}
              </dt>
              <dd className="text-ink text-base">{r.value}</dd>
            </div>
          ))}
        </dl>

        {/* What we actually do — locked Brian-authorized services */}
        <div className="mt-10 border border-[rgba(217,204,140,0.3)] bg-bg-subtle p-6 md:p-8">
          <p className="eyebrow mb-3 text-accent">What we actually do</p>
          <ul className="space-y-3 text-ink-dim text-base leading-[1.65]">
            {SERVICES.map((s, i) => (
              <li key={i} className="flex gap-3">
                <span aria-hidden className="mt-2 h-1.5 w-1.5 rotate-45 bg-accent shrink-0" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-8 text-ink-dim text-sm leading-[1.65]">
          Or just Google &quot;Spiker Carpet and Tile Care.&quot; You&apos;ll find it in about 4
          seconds.
        </p>
        <p className="mt-3 text-ink-dim text-sm leading-[1.65] italic">
          This isn&apos;t a fake business set up to make a self-help guy look real. This is a real
          business that, after 13 years, made the owner so opinionated he started writing books.
          You&apos;re holding what came out of that.
        </p>
      </section>

      {/* Reviews */}
      <section className="border-t border-line bg-bg-subtle">
        <div className="container-x py-16">
          <div className="mb-10 max-w-2xl">
            <p className="eyebrow mb-2 text-accent">What 13 years of customers sound like</p>
            <h2 className="font-display text-3xl text-ink md:text-4xl">
              Real reviews. Real names. Real dates.
            </h2>
            <p className="mt-4 text-ink-dim text-base leading-[1.65]">
              Authorized reviews from real Spiker Carpet and Tile Care customers. No invented
              testimonials. You can verify any of them on Google Maps in about 90 seconds.
            </p>
            <p className="mt-2 text-ink-mute italic text-sm">
              If you find a 1-star, send it to me. I bet there&apos;s a story.
            </p>
          </div>

          {reviews.length === 0 ? (
            <p className="border border-line bg-bg p-8 text-sm text-ink-dim">
              {empty.reviewsNone}
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {reviews.map((r) => (
                <ReviewTile key={r.id} review={r} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Operating reality — 10-point savage list */}
      <section className="container-x py-20">
        <div className="max-w-3xl mb-10">
          <p className="eyebrow mb-3 text-accent">Operating reality, the savage version</p>
          <h2 className="font-display text-3xl text-ink md:text-4xl">
            What 13 years of carpet and tile teaches you that a 6-week mastermind doesn&apos;t.
          </h2>
        </div>
        <ol className="space-y-5">
          {OPERATING_REALITY.map((line, i) => (
            <li
              key={i}
              className="grid grid-cols-[auto_1fr] gap-5 border-t border-line pt-5"
            >
              <span className="font-display text-4xl text-accent leading-none md:text-5xl">
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className="text-ink-dim text-base leading-[1.65] md:text-[1.05rem]">{line}</p>
            </li>
          ))}
        </ol>
        <p className="mt-10 italic text-ink-dim text-center">
          All 636 books come from this. From figuring it out. Not from a podcast booth.
        </p>
      </section>

      {/* Closer + sister-site reciprocity */}
      <section className="border-t border-line bg-bg-subtle">
        <div className="container-x py-16">
          <div className="max-w-2xl">
            <p className="eyebrow mb-3 text-accent">The closer</p>
            <h2 className="font-display text-3xl text-ink md:text-4xl mb-6">
              You don&apos;t have to trust an author.
              <br />
              <span className="metallic-text">You can trust someone who has a business address.</span>
            </h2>
            <p className="text-ink-dim text-base leading-[1.65] mb-3">
              I am both. The carpet business came first. By 11 years. Then I started writing.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <Link
              href="/books/the-discipline-blueprint"
              className="cta-primary"
              data-cursor-label="Start"
            >
              Start with Book #1
            </Link>
            <a
              href="https://spikercarpetandtilecare.com"
              target="_blank"
              rel="noopener noreferrer me"
              className="cta-secondary"
              data-cursor-label="Verify"
            >
              Verify the carpet business
            </a>
            <Link href="/podcast" className="cta-secondary" data-cursor-label="Listen">
              Listen to the podcast
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
