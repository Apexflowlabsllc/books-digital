import { PageShell } from '@/components/PageShell';
import { Hero } from '@/components/Hero';
import { FounderApplicationForm } from '@/components/FounderApplicationForm';
import { JsonLdSchema } from '@/components/JsonLdSchema';
import { getPageSeo } from '@/lib/api';
import { buildMetadata, fallbackPageSchema } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Founder Edition — $9,999 · 100 spots ever · application only',
  description:
    'Founder Edition — $9,999. Signed 636-book hardcover set, Apex Vault membership across every Apex store, one-hour private call with Brian, your name in the next book’s Founding Operators appendix. Only 100 spots ever sold. Application only.',
  path: '/founder-edition',
});

export const revalidate = 3600;

// Master §1.6 — locked at $9,999. Limited to 100 LIFETIME spots (per the
// Final Build doc — not 100/year). Application form, NOT Stripe Checkout.

const DELIVERABLES = [
  {
    title: 'The 12-Series Complete Hardcover Set',
    body: 'All 636 titles, hardcover, signed by Brian, shipped in a custom case as each one releases. Yes, all 636. Yes, the case is heavy. Yes, you need a shelf.',
  },
  {
    title: 'Apex Vault membership',
    body: 'The top tier, across the whole ecosystem. Books, Digital, and every Apex storefront we launch — you’re in, at founding rate, for as long as you keep the membership active.',
  },
  {
    title: 'One-Hour Call With Brian',
    body: 'Scheduled at your pace. Any topic. He’s a carpet guy. He doesn’t have time to bullshit you.',
  },
  {
    title: 'Your Name in the Next Book',
    body: '"Founding Operators" appendix. Printed in the book. Future readers will see it. The names that funded the empire when it was 12 books deep.',
  },
  {
    title: 'Early Access to Everything Apex Ever Makes',
    body: 'Books, courses, apparel, AI tools, future brands. You’re in at founder level. Treated accordingly.',
  },
  {
    title: 'Limited to 100 Founding Spots',
    body: 'A single founding class. When 100 are sold, the door closes and does not reopen.',
  },
];

export default async function FounderEditionPage() {
  const seo = await getPageSeo('/founder-edition');

  return (
    <PageShell>
      <JsonLdSchema
        bundle={seo}
        fallback={fallbackPageSchema('/founder-edition', 'Founder Edition')}
      />

      <Hero
        eyebrow="Founder Edition · $9,999 · 100 spots ever"
        title={
          <>
            For the 100 people who don&apos;t read the books —{' '}
            <span className="metallic-text">they build with them.</span>
          </>
        }
        body={
          <>
            This isn&apos;t for everyone. This isn&apos;t even for most of the people who buy the
            books. This is for the max 100 people, ever, who want to be part of the early Apex
            story.{' '}
            <span className="text-accent">$9,999. Founding tier. Only 100 spots ever.</span>
          </>
        }
        primary={{ href: '#apply', label: 'Reserve a spot' }}
        secondary={{ href: '/bundles', label: 'Or just grab a bundle' }}
      />

      <section className="container-x py-16">
        <div className="mb-10 max-w-2xl">
          <p className="eyebrow mb-3 text-accent">What you get</p>
          <h2 className="font-display text-3xl text-ink md:text-4xl">
            Six deliverables.{' '}
            <span className="metallic-text">One number — 1 through 100.</span>
          </h2>
        </div>
        <ol className="grid gap-4 md:grid-cols-2">
          {DELIVERABLES.map((d, i) => (
            <li key={i} className="flex gap-5 border border-line bg-bg-subtle p-6">
              <span className="font-display text-3xl text-accent">0{i + 1}</span>
              <div>
                <p className="font-display text-xl text-ink">{d.title}</p>
                <p className="mt-2 text-sm text-ink-dim leading-[1.6]">{d.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="container-x py-12">
        <div className="max-w-3xl mx-auto border border-accent/30 bg-bg-subtle p-8 md:p-10">
          <p className="eyebrow mb-3 text-accent">The honest version</p>
          <h2 className="font-display text-2xl text-ink md:text-3xl mb-5">
            $9,999 is a lot of money.
          </h2>
          <div className="space-y-4 text-ink-dim text-base leading-[1.65]">
            <p>
              Brian knows what $9,999 feels like to someone serious. He&apos;s been running a
              business since 2013. He&apos;s seen $9,999 expenses that changed the company and
              $9,999 expenses that were complete disasters.
            </p>
            <p>
              This is the first one, not the second one — but Brian&apos;s not going to sit here
              and convince you of that. Either you&apos;re in or you&apos;re not.
            </p>
            <p>
              If you&apos;re considering it: email Brian directly before you buy. He&apos;ll get
              on the phone. He&apos;ll tell you whether it makes sense for your specific
              situation. He&apos;ll probably talk some of you out of it. That&apos;s fine.
              He&apos;d rather have 100 right people than 100 anyone.
            </p>
          </div>
        </div>
      </section>

      <section id="apply" className="border-t border-line bg-bg-subtle">
        <div className="container-x py-16">
          <div className="mb-8 max-w-2xl">
            <p className="eyebrow mb-3 text-accent">Apply</p>
            <h2 className="font-display text-3xl text-ink md:text-4xl">
              The application goes to a queue Brian reads personally.
            </h2>
            <p className="mt-4 text-ink-dim text-base leading-[1.65]">
              If you fit, you get a calendar invite within 7 days. If not, you get a direct no —
              no waitlist limbo, no follow-up sequence, no "let&apos;s revisit in Q4." We&apos;re
              not running a coaching funnel.
            </p>
          </div>

          <FounderApplicationForm />
        </div>
      </section>

      <section className="container-x py-16">
        <div className="border border-line bg-bg-subtle p-6 md:p-8">
          <p className="eyebrow mb-3 text-accent">FAQ</p>
          <div className="divide-y divide-line">
            <Faq
              q="Why isn’t this just a buy button?"
              a="Because 100 of these go out, total, ever. The form is the filter — it saves both of us a phone call when this is not a fit."
            />
            <Faq
              q="What if the 100 are gone?"
              a={"The application closes and does not reopen. We don’t run a “next cohort” — there are only 100 founding spots. We don’t waitlist. Wait is dishonest."}
            />
            <Faq
              q="Do I get the audiobook versions too?"
              a="Yes. The Apex Vault membership covers every audiobook across every Apex store while it is active. The hardcover set is the physical version; the membership is the audio + future books."
            />
            <Faq
              q="When does my number ship?"
              a="Book by book, as each title releases. The shelf and signature plate ship after acceptance. The Apex Vault membership is active the same day you’re accepted."
            />
            <Faq
              q="Can I email Brian before I apply?"
              a="Yes. brian@apexflowlabs.com. He answers his own mail. If you’re close-but-not-sure, write him."
            />
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  return (
    <details className="group py-4 [&_summary::-webkit-details-marker]:hidden">
      <summary className="flex cursor-pointer items-center justify-between gap-4">
        <span className="font-display text-lg text-ink">{q}</span>
        <span className="text-accent transition-transform group-open:rotate-45" aria-hidden>
          +
        </span>
      </summary>
      <p className="mt-3 text-sm text-ink-dim">{a}</p>
    </details>
  );
}
