import { PageShell } from '@/components/PageShell';
import { JsonLdSchema } from '@/components/JsonLdSchema';
import { buildMetadata, fallbackPageSchema } from '@/lib/seo';
import { env } from '@/lib/env';
import { getPulseState, pulseSchema, PULSE_PRODUCT_URL } from '@/lib/pulse';

export const metadata = buildMetadata({
  title: 'Apex Pulse — the system this store publishes with',
  description:
    'Apex Flow Publishing House runs on Apex Pulse: live publishing across every channel and AI-citation visibility. Available from Apex Flow Labs.',
  path: '/pulse',
});

export const revalidate = 600;

/**
 * THIS STORE RUNS ON PULSE. IT DOES NOT SELL IT.
 *
 * Pulse is sold on the digital store, and pricing lives there and nowhere
 * else. The bookstore is one of the properties running it — the same role
 * Spiker Carpet plays — so this page is live proof, not a pricing table.
 *
 * Everything below is read from the Pulse API for this account. Nothing is
 * asserted that the system cannot prove: no follower counts, no reach, no
 * citation scores, because the API does not return them. If no channel is
 * connected yet, the page says exactly that.
 */
export default async function PulsePage() {
  const state = await getPulseState();
  const live = state.connectedCount > 0;

  return (
    <PageShell>
      <JsonLdSchema
        bundle={null}
        fallback={[...fallbackPageSchema('/pulse', 'Apex Pulse'), pulseSchema(env.siteUrl)]}
      />

      <section className="container-x pb-4 pt-16 sm:pt-20">
        <p className="font-mono text-[10px] uppercase tracking-[0.36em] text-accent/75">
          Running on Apex Pulse
        </p>
        <h1 className="mt-5 font-display text-[clamp(34px,5.4vw,64px)] font-light leading-[1.02] tracking-[-0.03em] text-ink">
          The system this store publishes with.
        </h1>
        <p className="mt-5 max-w-[60ch] text-[15px] leading-relaxed text-ink-dim">
          Every Apex Flow property runs on Pulse — it publishes across each channel, watches the
          health of every connection, and tracks where answer engines are citing the business. This
          page is not a demo. It is this store&rsquo;s own live state.
        </p>
      </section>

      <section className="container-x pb-24 pt-8">
        {state.degraded ? (
          <p className="max-w-[60ch] border border-line bg-bg-subtle p-8 text-sm leading-relaxed text-ink-dim">
            Couldn&rsquo;t reach Pulse just now. Nothing here is cached from a previous state, so
            rather than show you a number we cannot currently prove, this is blank on purpose.
          </p>
        ) : (
          <>
            <div className="pulse-head">
              <h2 className="pulse-h2">Channels</h2>
              <span className="pulse-count">
                {state.connectedCount} of {state.channels.length} connected
              </span>
            </div>

            <ul className="pulse-grid">
              {state.channels.map((c) => (
                <li
                  key={c.platform}
                  className={`pulse-chan ${
                    c.needsReconnect ? 'is-warn' : c.connected ? 'is-on' : 'is-off'
                  }`}
                >
                  <span className="pulse-dot" aria-hidden />
                  <span className="pulse-name">{c.label}</span>
                  <span className="pulse-state">
                    {c.needsReconnect ? 'Needs reconnect' : c.connected ? 'Connected' : 'Not connected'}
                  </span>
                </li>
              ))}
            </ul>

            {!live && (
              <p className="mt-7 max-w-[62ch] border-l-2 border-accent/50 pl-5 text-[14px] leading-relaxed text-ink-dim">
                No channel is connected on this store yet, so there is nothing published to show. We
                are not going to fill this space with a number we cannot prove — when the channels
                are connected, the real posts appear here on their own.
              </p>
            )}

            {state.posts.length > 0 && (
              <>
                <div className="pulse-head mt-14">
                  <h2 className="pulse-h2">Published</h2>
                  <span className="pulse-count">{state.posts.length} recent</span>
                </div>
                <ul className="pulse-posts">
                  {state.posts.map((p, i) => (
                    <li key={`${p.title}-${i}`} className="pulse-post">
                      {p.platform && <span className="pulse-post-plat">{p.platform}</span>}
                      {p.url ? (
                        <a href={p.url} rel="noopener">
                          {p.title}
                        </a>
                      ) : (
                        <span>{p.title}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </>
            )}

            <div className="mt-14 border-t border-line pt-10">
              <h2 className="font-display text-2xl font-light text-ink">Want it on your site?</h2>
              <p className="mt-3 max-w-[58ch] text-[14px] leading-relaxed text-ink-dim">
                Pulse is an Apex Flow Labs product. It is sold on the digital store, along with the
                current plans.
              </p>
              <a
                href={PULSE_PRODUCT_URL}
                className="mt-6 inline-block rounded-sm border border-line px-7 py-4 font-mono text-[11px] uppercase tracking-[0.14em] text-ink"
              >
                See Apex Pulse →
              </a>
            </div>
          </>
        )}
      </section>
    </PageShell>
  );
}
