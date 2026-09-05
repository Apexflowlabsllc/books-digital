import Link from 'next/link';
import { Check } from 'lucide-react';
import { PageShell } from '@/components/PageShell';
import { Hero } from '@/components/Hero';
import { JsonLdSchema } from '@/components/JsonLdSchema';
import { getPageSeo } from '@/lib/api';
import { buildMetadata, fallbackPageSchema } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'The Insider Pass — $99/yr · 636 books · all audio · 20% off the empire',
  description:
    'The Insider Pass — $99/year. All 636 books, all 636 audiobooks, 20% off every Apex brand. One credit card swipe per year for the whole library.',
  path: '/membership',
});

export const revalidate = 3600;

const BENEFITS = [
  'All 636 books — read on any device, forever, including the ones not written yet',
  'All 636 audiobooks — streamed, narrated, mastered, in your ears on the way to a job',
  'Early access to new releases — you read before the public because you’re paying us $99 and the public is not',
  '20% off every other Apex brand — Digital, Apparel, Beauty, Health, Pets, Academy, Kids, Companion AI, Affiliates, Spiker, and the parent at apexflowlabs.com',
  'Field notes — a Saturday email from Brian, written from a job site or his couch at 11 PM, no theme, just whatever’s on his mind',
  'First crack at Founder Edition when it opens',
  'Cancel anytime. Refund unused portion. We don’t lock you in. We’re not a gym in 2009.',
];

export default async function MembershipPage() {
  const seo = await getPageSeo('/membership');

  return (
    <PageShell>
      <JsonLdSchema
        bundle={seo}
        fallback={fallbackPageSchema('/membership', 'The Insider Pass — $99/yr')}
      />

      <Hero
        eyebrow="The Insider Pass"
        title={
          <>
            <span className="metallic-text">$99 a year.</span> The whole empire. One pass.
          </>
        }
        body={
          <>
            You can buy the books one at a time at $6.99 each. You can do the math on that. ($6.99
            × 636 = a lot.) Or for $99/year you get all 636 books, all 636 audiobooks, 20% off
            every other Apex brand, and a Saturday email from me.
          </>
        }
        primary={{ href: '#join', label: 'Get the Pass — $99/yr' }}
        secondary={{ href: '/books', label: 'Or buy one at a time' }}
      />

      <section className="container-x py-16">
        <div className="grid gap-12 md:grid-cols-[2fr_3fr]">
          <div>
            <p className="eyebrow mb-3 text-accent">What&apos;s in it</p>
            <h2 className="font-display text-3xl text-ink md:text-4xl">
              The whole library + 20% off everything else.
            </h2>
            <p className="mt-4 text-ink-dim text-base leading-[1.65]">
              $99 a year. $8.25 a month. Less than coffee for a week. Less than the last course
              you didn&apos;t finish.
            </p>
          </div>
          <ul className="space-y-3">
            {BENEFITS.map((b, i) => (
              <li
                key={i}
                className="flex items-start gap-3 border border-line bg-bg-subtle p-4 text-sm text-ink"
              >
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="join" className="border-y border-line bg-bg-subtle">
        <div className="container-x py-16 text-center">
          <p className="eyebrow mb-3 text-accent">Join the Pass</p>
          <h2 className="font-display text-4xl text-ink md:text-6xl">
            <span className="metallic-text">$99</span>
            <span className="text-ink-dim"> / year</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-ink-dim">
            One charge. Cancel anytime. We&apos;re not a gym in 2009.
          </p>
          <form
            action={`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/checkout/start`}
            method="post"
            className="mx-auto mt-8 inline-flex flex-col items-center gap-3"
          >
            <input type="hidden" name="product" value="books-insider-pass" />
            <input type="hidden" name="source" value="books-frontend-membership" />
            <button type="submit" className="cta-primary px-10 py-4 text-base">
              Get the Pass — $99/yr
            </button>
            <p className="text-xs text-ink-mute">
              Or buy one at a time. Up to you.
            </p>
          </form>
        </div>
      </section>

      <section className="container-x py-16">
        <div className="border border-line bg-bg-subtle p-6 md:p-8">
          <p className="eyebrow mb-3 text-accent">Per-store pass</p>
          <h3 className="font-display text-2xl text-ink">
            One Apex store. One Pass. No tier confusion.
          </h3>
          <p className="mt-3 max-w-2xl text-ink-dim text-base leading-[1.65]">
            Apex Flow Publishing House runs multiple storefronts. Each owns its own Pass. The Books Pass
            covers everything you read on this site — all 636 books, all the audio, 20% off every
            other Apex brand. There is no upgrade ladder — we just charge once for what you
            actually use.
          </p>
          <Link href="/founder-edition" className="cta-secondary mt-6 inline-flex">
            Want lifetime + a call with Brian? Founder Edition →
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
