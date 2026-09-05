import { PageShell } from '@/components/PageShell';
import { JsonLdSchema } from '@/components/JsonLdSchema';
import { buildMetadata, fallbackPageSchema } from '@/lib/seo';
import { getPulseOffer, pulseMonthly, pulseSchema, PULSE_HOME } from '@/lib/pulse';

export const metadata = buildMetadata({
  title: 'Apex Pulse — live publishing and AI-citation visibility',
  description:
    'Apex Pulse keeps a business publishing across every platform and shows where answer engines are citing it. Carried on every Apex Flow store.',
  path: '/pulse',
});

export const revalidate = 600;

/**
 * APEX PULSE, ON THE BOOKSTORE.
 *
 * Every Apex Flow store carries Pulse. This page is the bookstore's shelf for
 * it — not a second product page competing with the flagship's, and not a
 * second copy of the pricing.
 *
 * Tiers come from the flagship's live API. Billing is currently deactivated
 * upstream (`active: false`), which is a real state rather than a fault: when
 * it is off this page does not render a checkout button that leads nowhere, it
 * sends the buyer to the flagship. When it flips on, the button appears here
 * with no code change.
 */
export default async function PulsePage() {
  const offer = await getPulseOffer();

  return (
    <PageShell>
      <JsonLdSchema
        bundle={null}
        fallback={[...fallbackPageSchema('/pulse', 'Apex Pulse'), pulseSchema()]}
      />

      <section className="container-x pb-4 pt-16 sm:pt-20">
        <p className="font-mono text-[10px] uppercase tracking-[0.36em] text-accent/75">
          Apex Flow Labs · carried on every store
        </p>
        <h1 className="mt-5 font-display text-[clamp(34px,5.4vw,64px)] font-light leading-[1.02] tracking-[-0.03em] text-ink">
          Apex Pulse
        </h1>
        <p className="mt-5 max-w-[58ch] text-[15px] leading-relaxed text-ink-dim">
          Publishing that does not stop when you get busy. Pulse posts across every channel, watches
          the health of each one, and shows you where answer engines are citing your business —
          which is the part almost nobody is measuring yet.
        </p>
      </section>

      <section className="container-x pb-24 pt-6">
        {offer.tiers.length === 0 ? (
          <p className="max-w-[58ch] border border-line bg-bg-subtle p-8 text-sm leading-relaxed text-ink-dim">
            Pulse pricing is not loading right now. It lives on{' '}
            <a href={PULSE_HOME} className="text-accent underline">
              apexflowlabs.com/pulse
            </a>{' '}
            — that page is the source of truth.
          </p>
        ) : (
          <>
            <dl className="grid gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-3">
              {offer.tiers.map((t) => (
                <div key={t.key} className="fmt-tile bg-bg p-6">
                  <dt className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-accent">
                    {t.name}
                  </dt>
                  <dd className="mt-3">
                    <span className="font-display text-3xl font-light text-ink">
                      {pulseMonthly(t.priceCents)}
                    </span>
                    <span className="ml-1 font-mono text-[11px] text-ink-dim">/ month</span>
                    <span className="mt-3 block text-[13px] leading-relaxed text-ink-dim">
                      {t.blurb}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href={PULSE_HOME}
                className="rounded-sm bg-accent px-7 py-4 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-bg"
              >
                {offer.active ? 'Start Pulse' : 'See Pulse on Apex Flow Labs'}
              </a>
              <p className="font-mono text-[10.5px] text-ink-dim">
                Billed monthly · cancel any time · runs on the web, nothing to install
              </p>
            </div>

            {!offer.active && (
              <p className="mt-5 max-w-[62ch] text-[13px] leading-relaxed text-ink-dim">
                Checkout for Pulse runs on Apex Flow Labs rather than here, so you buy it once and
                use it across every property.
              </p>
            )}
          </>
        )}
      </section>
    </PageShell>
  );
}
