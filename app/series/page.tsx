import { PageShell } from '@/components/PageShell';
import { Hero } from '@/components/Hero';
import { SeriesCard } from '@/components/SeriesCard';
import { SeriesLaunchWall } from '@/components/SeriesLaunchWall';
import { JsonLdSchema } from '@/components/JsonLdSchema';
import { getPageSeo, getSeriesList } from '@/lib/api';
import { buildMetadata, fallbackPageSchema } from '@/lib/seo';
import { empty } from '@/lib/voice';
import type { SeriesSummary, Wave } from '@/lib/types';
import { waveLabel } from '@/lib/utils';

export const metadata = buildMetadata({
  title: 'The 12 series — Apex Flow Publishing House',
  description:
    '12 series across 4 waves. Foundation, Pressure, Edge, Apex. Each series picks a different battlefield.',
  path: '/series',
});

export const revalidate = 3600;

function groupByWave(list: SeriesSummary[]) {
  const buckets: Record<Wave, SeriesSummary[]> = { 1: [], 2: [], 3: [], 4: [] };
  for (const s of list) {
    if (s.wave && buckets[s.wave]) buckets[s.wave].push(s);
  }
  return buckets;
}

export default async function SeriesPage() {
  const [data, seo] = await Promise.all([getSeriesList(), getPageSeo('/series')]);
  const list = data?.series ?? [];
  const waves = groupByWave(list);

  /* The cover bucket is keyed s01..s12, but SeriesSummary carries no series
   * number — only a slug. The backend returns series in catalog order, so the
   * index IS the number. Derived here rather than hardcoded so a reordered or
   * extended catalog stays correct. */
  const numbers: Record<string, number> = {};
  list.forEach((s, i) => {
    numbers[s.slug] = i + 1;
  });

  return (
    <PageShell>
      <JsonLdSchema bundle={seo} fallback={fallbackPageSchema('/series', 'The 12 series')} />

      <Hero
        eyebrow="The 12 series"
        title={
          <>
            Four waves. <span className="metallic-text">Twelve fronts.</span> One library.
          </>
        }
        body="Foundation. Pressure. Edge. Apex. Each wave is three series of 53 books — one chapter per day. Pick the series that maps to the war you are fighting now."
      />

      {/* THE WALL — twelve spines. Tap one and it rattles loose, ignites,
        * flies off the top of the screen and detonates, and the blast opens
        * that series' full shelf. Placed above the wave grid because it is the
        * thing worth arriving to; the grid below stays as the scannable,
        * no-JavaScript fallback. */}
      {list.length > 0 && (
        <section className="container-x pt-6">
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-4">
            <h2 className="font-display text-2xl text-ink">The wall</h2>
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-dim">
              {list.length} series · {list.reduce((n, s) => n + s.book_count, 0)} books · tap one and stand back
            </span>
          </div>
          <SeriesLaunchWall series={list} numbers={numbers} />
        </section>
      )}

      <section className="container-x py-16">
        {list.length === 0 ? (
          <p className="border border-line bg-bg-subtle p-8 text-sm text-ink-dim">
            {empty.seriesNone}
          </p>
        ) : (
          <div className="space-y-16">
            {([1, 2, 3, 4] as Wave[]).map((w) => {
              const inWave = waves[w];
              if (inWave.length === 0) return null;
              return (
                <div key={w}>
                  <div className="mb-6 flex items-baseline justify-between">
                    <h2 className="font-display text-2xl text-ink md:text-3xl">{waveLabel(w)}</h2>
                    <span className="eyebrow text-ink-mute">
                      {inWave.length} series · {inWave.reduce((sum, s) => sum + s.book_count, 0)}{' '}
                      books
                    </span>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {inWave.map((s) => (
                      <SeriesCard key={s.slug} series={s} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </PageShell>
  );
}
