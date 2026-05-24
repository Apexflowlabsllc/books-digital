'use client';

import Link from 'next/link';
import Image, { type StaticImageData } from 'next/image';
import type { SeriesSummary } from '@/lib/types';

import b1 from '../public/b1.webp';
import b2 from '../public/b2.webp';
import b3 from '../public/b3.webp';
import b4 from '../public/b4.webp';
import b5 from '../public/b5.webp';
import b6 from '../public/b6.webp';
import b7 from '../public/b7.webp';
import b8 from '../public/b8.webp';
import b9 from '../public/b9.webp';
import b10 from '../public/b10.webp';
import b11 from '../public/b11.webp';
import b12 from '../public/b12.webp';

type SeriesTile = {
  num: string;
  name: string;
  tag: string;
  slug: string;
  cover: StaticImageData;
};

const LOCAL_COVERS: StaticImageData[] = [b1, b2, b3, b4, b5, b6, b7, b8, b9, b10, b11, b12];

// Fallback used only when the backend series list is cold. Real data wins
// via the `seriesList` prop.
const FALLBACK_ROSTER: SeriesTile[] = [
  { num: 'S01', name: 'The Discipline Blueprint',     tag: 'For the guy who’s been "starting Monday" for years.', slug: 'discipline-blueprint',     cover: b1 },
  { num: 'S02', name: 'The Comeback Blueprint',       tag: 'For the guy who got knocked on his ass.',             slug: 'comeback-blueprint',       cover: b2 },
  { num: 'S03', name: 'The Mind Reset Blueprint',     tag: 'For the guy whose brain won’t shut up at 2 AM.',      slug: 'mind-reset-blueprint',     cover: b3 },
  { num: 'S04', name: 'The Success Blueprint',        tag: 'For the guy who reads business books and is broke.',  slug: 'success-blueprint',        cover: b4 },
  { num: 'S05', name: 'The Elite Blueprint',          tag: 'For the guy who’s good and wants to be way better.',  slug: 'elite-blueprint',          cover: b5 },
  { num: 'S06', name: 'The Unstoppable Blueprint',    tag: 'For the guy with all the motivation, no progress.',   slug: 'unstoppable-blueprint',    cover: b6 },
  { num: 'S07', name: 'The Nervous System Blueprint', tag: 'For the guy who’s been "fine" too long.',             slug: 'nervous-system-blueprint', cover: b7 },
  { num: 'S08', name: 'The Connection Blueprint',     tag: 'For the guy whose wife says "we need to talk."',      slug: 'connection-blueprint',     cover: b8 },
  { num: 'S09', name: 'The Power Blueprint',          tag: 'For the guy who keeps getting walked on.',            slug: 'power-blueprint',          cover: b9 },
  { num: 'S10', name: 'The Purpose Blueprint',        tag: 'For the guy with a good life he can’t enjoy.',        slug: 'purpose-blueprint',        cover: b10 },
  { num: 'S11', name: 'The Warrior Blueprint',        tag: 'For the guy carrying everybody, running on fumes.',   slug: 'warrior-blueprint',        cover: b11 },
  { num: 'S12', name: 'The Legend Blueprint',         tag: 'For the guy who knows he’ll die someday.',            slug: 'legend-blueprint',         cover: b12 },
];

// Plain-Brian taglines per series, indexed by wave (1-4). The backend
// promise field is the same across all books in a series — too long for a
// tile. These short hooks read better in the marquee.
const TAGLINE_BY_WAVE: Record<number, string> = {
  1: 'Foundation. Start where the ground is wet.',
  2: 'Pressure. When the company starts pulling.',
  3: 'Edge. Where most operators break.',
  4: 'Apex. The boring kind of winning.',
};

interface SeriesRosterMarqueeProps {
  // Real series from the live backend. When provided, tiles use real names
  // and slugs; the visual cover is the locked b1-b12 local image (cycled).
  seriesList?: SeriesSummary[];
}

export function SeriesRosterMarquee({ seriesList }: SeriesRosterMarqueeProps = {}) {
  const ROSTER: SeriesTile[] =
    seriesList && seriesList.length > 0
      ? seriesList.slice(0, 12).map((s, i) => ({
          num: `S${String(i + 1).padStart(2, '0')}`,
          name: FALLBACK_ROSTER[i]?.name ?? s.name,
          tag: TAGLINE_BY_WAVE[s.wave] ?? s.short_desc ?? '',
          slug: s.slug,
          cover: LOCAL_COVERS[i % LOCAL_COVERS.length]!,
        }))
      : FALLBACK_ROSTER;

  // Split into two rows so each can scroll in an opposite direction.
  const ROW_A = ROSTER.slice(0, 6);
  const ROW_B = ROSTER.slice(6);
  return (
    <section className="relative z-10 overflow-hidden border-t border-white/5 bg-gradient-to-b from-transparent to-[#0a0a07]/60 py-12 sm:py-20 lg:py-28">
      <div className="container-x mb-10 sm:mb-16 max-w-2xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-accent">
          §04 · The full roster
        </p>
        <h2 className="mt-4 font-display text-4xl text-cream sm:text-5xl lg:text-6xl">
          All twelve, <span className="metallic-text">named.</span>
        </h2>
        <p className="mt-4 text-base text-ink-dim md:text-lg">
          12 covers. 12 fights. Pick the one that sounds most like your week.
        </p>
      </div>

      {/* Row A — scrolls left */}
      <div
        className="roster-mask relative overflow-hidden"
        style={{
          maskImage: 'linear-gradient(90deg, transparent 0%, #000 6%, #000 94%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, #000 6%, #000 94%, transparent 100%)',
        }}
      >
        <div className="flex w-max gap-6 animate-marquee-fwd py-6" style={{ animationDuration: '60s' }}>
          {[...ROW_A, ...ROW_A].map((s, i) => (
            <RosterTile key={`a-${i}`} tile={s} ariaHidden={i >= ROW_A.length} />
          ))}
        </div>
      </div>

      {/* Row B — scrolls right (reverse) */}
      <div
        className="roster-mask relative mt-6 overflow-hidden"
        style={{
          maskImage: 'linear-gradient(90deg, transparent 0%, #000 6%, #000 94%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, #000 6%, #000 94%, transparent 100%)',
        }}
      >
        <div className="flex w-max gap-6 animate-marquee-reverse py-6" style={{ animationDuration: '60s' }}>
          {[...ROW_B, ...ROW_B].map((s, i) => (
            <RosterTile key={`b-${i}`} tile={s} ariaHidden={i >= ROW_B.length} />
          ))}
        </div>
      </div>

      <div className="container-x mt-12 sm:mt-16 flex justify-center">
        <Link href="/series" className="cta-3d" data-cursor-label="Browse all">
          <span>Browse all 12 series</span>
        </Link>
      </div>
    </section>
  );
}

function RosterTile({ tile, ariaHidden }: { tile: SeriesTile; ariaHidden?: boolean }) {
  return (
    <Link
      href={`/series/${tile.slug}`}
      aria-hidden={ariaHidden}
      tabIndex={ariaHidden ? -1 : 0}
      className="group flex w-[180px] sm:w-[220px] lg:w-[260px] shrink-0 flex-col items-center gap-3"
      data-cursor-label="Open series"
    >
      {/* Cover */}
      <div
        className="relative w-full transition-transform duration-500 ease-out group-hover:-translate-y-2"
        style={{
          aspectRatio: '2 / 3',
          filter:
            'drop-shadow(0 30px 50px rgba(0, 0, 0, 0.8)) drop-shadow(0 0 36px rgba(217, 204, 140, 0.18))',
        }}
      >
        <Image
          src={tile.cover}
          alt={tile.name}
          fill
          sizes="(min-width: 1024px) 260px, (min-width: 640px) 220px, 180px"
          className="object-contain"
          draggable={false}
        />
      </div>

      {/* Caption */}
      <div className="w-full text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-accent/80">
          {tile.num}
        </p>
        <p
          className="mt-2 font-display font-light leading-[1.2] text-cream tracking-tight"
          style={{ fontSize: 'clamp(0.95rem, 1.2vw, 1.15rem)' }}
        >
          {tile.name}
        </p>
        <p className="mt-1 text-[11px] italic font-light leading-[1.35] text-ink-dim">
          {tile.tag}
        </p>
      </div>
    </Link>
  );
}
