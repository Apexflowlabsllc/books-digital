'use client';

/**
 * THE WALL.
 *
 * Twelve series spines. Tap one and it rattles loose, ignites, climbs off the
 * top of the screen trailing exhaust, detonates — and the blast opens that
 * series' full shelf of covers.
 *
 * WHY IT IS BUILT THIS WAY
 * ------------------------
 * The spine you tap never moves. A fixed-position clone flies while the real
 * one stays put, so the wall never reflows and nothing shifts under a finger
 * mid-gesture. The flight is one requestAnimationFrame timeline with real
 * accumulating velocity rather than a CSS keyframe pretending — which is why
 * the detonation lands at a position the code knows instead of wherever a
 * guessed animation happened to end.
 *
 * Covers load straight from the public Supabase bucket at full quality; there
 * is no embedding or compression here the way there had to be in a preview.
 * They are Brian's finished artwork and are never regenerated or restyled.
 *
 * Everything degrades: prefers-reduced-motion skips the launch entirely and
 * opens the shelf directly, and a failed cover collapses to the series colour
 * rather than a broken image.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import type { SeriesSummary } from '@/lib/types';

const BUCKET =
  'https://rleowvglnvbraslessch.supabase.co/storage/v1/render/image/public/book-assets';

const pad2 = (n: number) => String(n).padStart(2, '0');

/** Series number is not on SeriesSummary, so derive it from catalog order. */
function coverUrl(seriesNumber: number, bookNumber: number, w = 220) {
  return `${BUCKET}/s${pad2(seriesNumber)}_b${pad2(bookNumber)}/cover_ebook.jpg?width=${w}&height=${Math.round(
    w * 1.6,
  )}&resize=cover&quality=72`;
}

/**
 * The front cover for the wall.
 *
 * Deliberately cover_ebook.jpg and NOT the print wrap. The wrap is only needed
 * for the spine; the front face just needs the front cover, and cover_ebook
 * exists for all 636 books while only ~370 wraps have synced so far. Sourcing
 * the front from the wrap is what left Purpose, Warrior and Legend as blank
 * plates when their artwork was sitting right there.
 */
function faceUrl(seriesNumber: number, bookNumber: number) {
  /* The face renders at ~117px wide. 300 is a 2x buffer for retina; 560 was
   * nearly 5x oversampled and cost ~100kB per book for no visible gain. */
  return `${BUCKET}/s${pad2(seriesNumber)}_b${pad2(
    bookNumber,
  )}/cover_ebook.jpg?width=300&resize=contain&quality=82`;
}

/**
 * THE WALL — twelve books standing on a shelf.
 *
 * WHY THIS IS NOT A ROW OF SPINE STRIPS
 * -------------------------------------
 * It was, twice, and both were wrong.
 *
 * First it cropped a fixed 4% of the wrap and stretched that to fill a 90px
 * button. The crop was wrong for nearly every book (the spine is 1.50%-4.62%
 * depending on page count) and the stretch smeared the vertical title sideways
 * by five.
 *
 * Then I fixed the crop and sized each spine to its TRUE proportion. The
 * measurement was right and the result was worse: a real 6x9 spine at 320px
 * tall is 20px wide, so the wall became twelve unreadable sticks. Truth to
 * scale and legibility are mutually exclusive for twelve books across one
 * screen — there is no tuning that gets both.
 *
 * So the books turn to face you instead. Each series stands as an actual book,
 * rotated about 30 degrees, showing its front cover AND its real spine at the
 * leading edge, overlapping its neighbour the way books lean on a shelf. The
 * cover is the artwork worth showing and it is legible at this size; the spine
 * is still the genuine printed spine, just seen at an angle where its width is
 * foreshortened rather than faked.
 *
 * The front cover is the real artwork (cover_ebook.jpg). The spine edge draws
 * in the series colour rather than downloading a 250kB print wrap to paint
 * about 11px — that alone was 2.6MB of the page.
 */

/**
 * One series, standing as a book.
 *
 * Split out so it can read its own wrap's aspect — the crop is per book and a
 * hook cannot run inside a loop in the parent.
 *
 * Only 253-370 of the 636 wraps are in the bucket while the sync runs, and
 * book 1 is missing for several series (4 starts at 11, 5 at 21, 9 at 2). So it
 * tries a ladder and takes whichever loads first, which self-heals as more
 * arrive rather than needing a manifest kept in sync by hand.
 */
function SeriesSpine({
  s,
  n,
  visible,
  onLaunch,
}: {
  s: SeriesSummary;
  n: number;
  visible: boolean;
  onLaunch: (el: HTMLButtonElement, s: SeriesSummary) => void;
}) {
  /*
   * THE SPINE NO LONGER DOWNLOADS A PRINT WRAP.
   *
   * It used to, and it was the single most expensive thing on the site:
   * twelve full wraps at 180-270kB each, 2.6MB, to paint a spine edge that is
   * about 11px wide once the book is rotated 34 degrees. Lighthouse measured
   * 3.19MB of images out of a 3.75MB page because of it.
   *
   * The edge now draws in the series colour. At 11px nobody could read the
   * printed spine anyway, and the front cover — which is what people actually
   * look at — is still the real artwork.
   */
  const cover = visible && n ? faceUrl(n, 1) : undefined;

  return (
    <figure className="shelf-slot">
      <button
        type="button"
        className="wall-book"
        style={
          {
            '--accent': s.color_hex,
            /* Real thickness, foreshortened by the rotation in CSS. */
            /* A representative 6x9 thickness. Measuring the real one meant
             * downloading the wrap, which is what this change removes. */
            '--thick': 'calc(var(--cw) * 0.0805)',
          } as React.CSSProperties
        }
        aria-label={`${s.name} — ${s.book_count} books`}
        onClick={(e) => onLaunch(e.currentTarget, s)}
      >
        <span className="wb-3d">
          {/* Front cover. A face at the cover's own aspect crops itself with
            * `auto 100%`, so this is exact with no measurement. */}
          <span
            className="wb-front"
            style={cover ? { backgroundImage: `url(${cover})` } : undefined}
          />
          {/* The genuine printed spine at the leading edge. */}
          <span className="wb-spine" />
          <span className="wb-pages" />
        </span>
      </button>
      <figcaption className="shelf-cap">
        <span className="shelf-cap-name">{s.name}</span>
        <span className="shelf-cap-count">{s.book_count} books</span>
      </figcaption>
    </figure>
  );
}

type Props = {
  series: SeriesSummary[];
  /** slug -> series number, so covers resolve to the right bucket folder */
  numbers: Record<string, number>;
};

export function SeriesLaunchWall({ series, numbers }: Props) {
  const railRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  /*
   * COVERS STAY OFF THE CRITICAL PATH UNTIL THE WALL IS NEAR.
   *
   * These are CSS background-images inside server-rendered markup, so the
   * browser discovered all twelve during the initial parse and fetched about
   * 360kB before the page had finished painting. On a phone the wall is well
   * below the fold, and Lighthouse's simulated LCP was pricing in that
   * contention: observed LCP was 236ms while simulated LCP was 3,959ms.
   *
   * Held back until the rail is within a screen of the viewport, so first
   * paint competes with nothing and the covers are already there by the time
   * anyone scrolls to them.
   */
  const [railNear, setRailNear] = useState(false);
  const blastRef = useRef<HTMLCanvasElement>(null);
  const [open, setOpen] = useState<SeriesSummary | null>(null);
  const flyingRef = useRef(false);

  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- particles ---------- */
  const partsRef = useRef<
    { x: number; y: number; vx: number; vy: number; g: number; drag: number; r: number; life: number; decay: number; c: string }[]
  >([]);
  const runningRef = useRef(false);

  const pump = useCallback(() => {
    if (runningRef.current) return;
    runningRef.current = true;
    const cv = blastRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;

    const tick = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (cv.width !== window.innerWidth * dpr) {
        cv.width = window.innerWidth * dpr;
        cv.height = window.innerHeight * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      let alive = 0;
      for (const p of partsRef.current) {
        if (p.life <= 0) continue;
        alive++;
        p.life -= p.decay;
        p.vy += p.g;
        p.vx *= p.drag;
        p.vy *= p.drag;
        p.x += p.vx;
        p.y += p.vy;
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.c;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * (0.4 + Math.max(0, p.life) * 0.6), 0, 6.2832);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (alive > 0) requestAnimationFrame(tick);
      else {
        runningRef.current = false;
        partsRef.current = [];
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      }
    };
    requestAnimationFrame(tick);
  }, []);

  const exhaust = useCallback(
    (x: number, y: number) => {
      for (let i = 0; i < 5; i++) {
        partsRef.current.push({
          x: x + (Math.random() - 0.5) * 10,
          y,
          vx: (Math.random() - 0.5) * 1.6,
          vy: 1.6 + Math.random() * 2.4,
          g: 0.06,
          drag: 0.97,
          r: 2 + Math.random() * 3.4,
          life: 1,
          decay: 0.045,
          c: Math.random() < 0.45 ? '#FFE9B4' : Math.random() < 0.6 ? '#F0A93C' : '#C4451F',
        });
      }
      pump();
    },
    [pump],
  );

  const detonate = useCallback(
    (x: number, y: number, accent: string) => {
      const N = 120;
      for (let i = 0; i < N; i++) {
        const ang = (i / N) * 6.2832 + Math.random() * 0.16;
        const spd = i % 3 === 0 ? 9 + Math.random() * 7 : 3.5 + Math.random() * 6;
        partsRef.current.push({
          x,
          y,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          g: 0.13,
          drag: 0.955,
          r: 1.4 + Math.random() * 3.6,
          life: 1,
          decay: 0.014 + Math.random() * 0.016,
          c: i % 7 === 0 ? '#FFFFFF' : i % 3 === 0 ? '#FFE9B4' : accent,
        });
      }
      for (let j = 0; j < 16; j++) {
        partsRef.current.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 3,
          vy: (Math.random() - 0.5) * 3,
          g: 0,
          drag: 0.9,
          r: 8 + Math.random() * 14,
          life: 1,
          decay: 0.09,
          c: '#FFF6DC',
        });
      }
      pump();
    },
    [pump],
  );

  /* ---------- the launch ---------- */
  const launch = useCallback(
    (el: HTMLButtonElement, s: SeriesSummary) => {
      if (reduced) {
        setOpen(s);
        return;
      }
      if (flyingRef.current) return;
      flyingRef.current = true;

      el.classList.add('rattling');
      window.setTimeout(() => {
        el.classList.remove('rattling');

        const r = el.getBoundingClientRect();
        const fly = el.cloneNode(true) as HTMLElement;
        fly.classList.add('flyer');
        fly.style.cssText += `;position:fixed;left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px;margin:0;z-index:61;pointer-events:none;`;
        const plume = document.createElement('span');
        plume.className = 'plume';
        fly.appendChild(plume);
        document.body.appendChild(fly);
        el.style.visibility = 'hidden';

        const x0 = r.left + r.width / 2;
        const y0 = r.top + r.height / 2;
        const start = performance.now();
        let last = start;
        let v = 0;
        let y = 0;
        let spark = 0;

        const frame = (now: number) => {
          const dt = Math.min((now - last) / 1000, 0.05);
          last = now;
          const age = (now - start) / 1000;

          if (age < 0.16) y += 26 * dt;
          else {
            v += 1750 * dt;
            y -= v * dt;
          }
          const wob = Math.sin(age * 26) * (age < 0.9 ? 1.6 : 0.5);
          fly.style.transform = `translate(${wob.toFixed(2)}px,${y.toFixed(1)}px) rotate(${(
            Math.sin(age * 7) * 2.2
          ).toFixed(2)}deg) scale(${Math.max(0.55, 1 - age * 0.22).toFixed(3)})`;
          plume.style.height = `${Math.min(190, Math.max(0, (age - 0.14) * 460))}px`;
          plume.style.opacity = age < 0.16 ? '0' : '1';

          spark += dt;
          if (age > 0.15 && spark > 0.016) {
            spark = 0;
            exhaust(x0 + wob, y0 + y + r.height / 2);
          }

          if (y0 + y > -r.height && age < 3) requestAnimationFrame(frame);
          else {
            fly.remove();
            el.style.visibility = '';
            const bx = Math.max(40, Math.min(window.innerWidth - 40, x0));
            detonate(bx, Math.max(46, window.innerHeight * 0.13), s.color_hex);
            window.setTimeout(() => {
              setOpen(s);
              flyingRef.current = false;
            }, 210);
          }
        };
        requestAnimationFrame(frame);
      }, 380);
    },
    [detonate, exhaust, reduced],
  );

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setRailNear(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setRailNear(true);
          io.disconnect();
        }
      },
      { rootMargin: '100% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  /* Bring the opened shelf into view. It expands in the flow rather than
   * covering the page, so without this the covers can open below the fold. */
  useEffect(() => {
    if (!open || !panelRef.current) return;
    panelRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [open]);

  const openNo = open ? numbers[open.slug] : 0;

  return (
    <>
      <canvas ref={blastRef} className="pointer-events-none fixed inset-0 z-[60]" aria-hidden />

      <div ref={railRef} className="series-rail">
        {series.map((s) => (
          <SeriesSpine key={s.slug} s={s} n={numbers[s.slug]} visible={railNear} onLaunch={launch} />
        ))}
      </div>

      {/* ── THE SHELF, IN THE PAGE ──────────────────────────────────
        * This used to be a fixed overlay that covered the site, and the page
        * behind it kept scrolling underneath so the next section's text ran
        * over the covers. It is a normal block in the flow now: the wall
        * opens, the shelf pushes the rest of the page down, and everything
        * below stays below. One page, no layer on top of it. */}
      {open && (
        <section
          ref={panelRef}
          className="series-panel"
          aria-label={open.name}
          style={{ ['--accent' as string]: open.color_hex }}
        >
          <header className="series-panel-head">
            <div>
              <p className="series-kicker">{open.book_count} books · 90 days each</p>
              <h2 className="series-title">{open.name}</h2>
            </div>
            <button type="button" className="series-close" onClick={() => setOpen(null)}>
              Close
            </button>
          </header>
          {open.short_desc && <p className="series-desc">{open.short_desc}</p>}

          <div className="series-shelf">
            {Array.from({ length: open.book_count }, (_, i) => i + 1).map((b) => (
              <a key={b} href={`/series/${open.slug}`} className="shelf-item">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={coverUrl(openNo, b, 150)}
                  alt={`${open.name} book ${b}`}
                  loading="lazy"
                  decoding="async"
                  width={150}
                  height={240}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.visibility = 'hidden';
                  }}
                />
                <span>{pad2(b)}</span>
              </a>
            ))}
          </div>

          <div className="series-actions">
            <a href={`/series/${open.slug}`} className="series-cta">
              Open {open.name}
            </a>
          </div>
        </section>
      )}
    </>
  );
}
