'use client';

/**
 * A book you can pick up.
 *
 * Real CSS 3D — six faces on a preserve-3d container: front cover carrying the
 * artwork, back board, a spine with the title running vertically, and a page
 * block of striped paper edges. Grab it and drag to turn it; it idles with a
 * slow rotation until you touch it, which is how a visitor learns it is
 * grabbable without being told.
 *
 * Not a video, not a sprite sheet, not a canvas — which means it stays sharp
 * at any size, costs one element, and the cover is the same file the store
 * serves everywhere else.
 *
 * Keyboard: arrow keys turn it. Reduced motion: no idle spin, still draggable.
 */

import { useCallback, useEffect, useRef } from 'react';
import { useWrapAspect, spineBackgroundSize, spineDepthRatio } from '@/lib/wrapGeometry';

type Props = {
  /**
   * The PRINT WRAP — back cover, spine, front cover in one file, laid out left
   * to right. Every face of this book is rendered from it, so the object you
   * turn is the actual printed book rather than a front cover with invented
   * boards behind it.
   *
   * Edge detection across the wrap puts the spine at 48%-52% of the width.
   * Therefore:
   *   back   = 0%   .. 48%   -> background-size 208%, position left
   *   spine  = 48%  .. 52%   -> background-size 2500%, position centre
   *   front  = 52%  .. 100%  -> background-size 208%, position right
   */
  wrapUrl: string;
  title: string;
  seriesLabel: string;
  accent: string;
};

export function RotatingBook({ wrapUrl, title, seriesLabel, accent }: Props) {
  const bookRef = useRef<HTMLDivElement>(null);
  /* The wrap's aspect gives the real spine width, so the book is as thick as
   * the book actually is rather than a guessed 38px. */
  const aspect = useWrapAspect(wrapUrl);
  const state = useRef({ ry: -28, rx: 6, drag: false, lx: 0, ly: 0, touched: false });

  const apply = useCallback(() => {
    const el = bookRef.current;
    if (!el) return;
    const { ry, rx } = state.current;
    el.style.transform = `rotateY(${ry.toFixed(2)}deg) rotateX(${rx.toFixed(2)}deg)`;
  }, []);

  useEffect(() => {
    const el = bookRef.current;
    if (!el) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const point = (e: MouseEvent | TouchEvent) =>
      'touches' in e
        ? { x: e.touches[0]?.clientX ?? 0, y: e.touches[0]?.clientY ?? 0 }
        : { x: e.clientX, y: e.clientY };

    const down = (e: MouseEvent | TouchEvent) => {
      const p = point(e);
      state.current.drag = true;
      state.current.touched = true;
      state.current.lx = p.x;
      state.current.ly = p.y;
    };
    const move = (e: MouseEvent | TouchEvent) => {
      const s = state.current;
      if (!s.drag) return;
      const p = point(e);
      s.ry += (p.x - s.lx) * 0.45;
      s.rx = Math.max(-26, Math.min(26, s.rx - (p.y - s.ly) * 0.28));
      s.lx = p.x;
      s.ly = p.y;
      apply();
      if (e.cancelable) e.preventDefault();
    };
    const up = () => {
      state.current.drag = false;
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        state.current.ry -= 12;
        state.current.touched = true;
        apply();
      }
      if (e.key === 'ArrowRight') {
        state.current.ry += 12;
        state.current.touched = true;
        apply();
      }
    };

    el.addEventListener('mousedown', down);
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    el.addEventListener('touchstart', down, { passive: true });
    el.addEventListener('touchmove', move, { passive: false });
    window.addEventListener('touchend', up);
    el.addEventListener('keydown', key);

    let raf = 0;
    if (!reduced) {
      const spin = () => {
        const s = state.current;
        if (!s.touched && !s.drag) {
          s.ry += 0.16;
          apply();
        }
        raf = requestAnimationFrame(spin);
      };
      raf = requestAnimationFrame(spin);
    }
    apply();

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('mousedown', down);
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
      el.removeEventListener('touchstart', down);
      el.removeEventListener('touchmove', move);
      window.removeEventListener('touchend', up);
      el.removeEventListener('keydown', key);
    };
  }, [apply]);

  return (
    <div className="book-stage">
      <div
        ref={bookRef}
        className="book3d"
        tabIndex={0}
        role="img"
        aria-label={`${title} — three-dimensional book, drag or use arrow keys to rotate`}
        style={
          {
            ['--accent' as string]: accent,
            /* Real thickness: spine width as a share of the cover width,
             * applied to however wide the book renders. */
            ['--thick' as string]: `calc(var(--bw) * ${spineDepthRatio(aspect).toFixed(4)})`,
          } as React.CSSProperties
        }
      >
        {/* Every face cut from the one wrap file — real back, real spine,
          * real front, in the printer's own artwork. */}
        <div className="face f-back" style={{ backgroundImage: `url(${wrapUrl})` }} />
        <div
          className="face f-spine"
          style={{ backgroundImage: `url(${wrapUrl})`, backgroundSize: spineBackgroundSize(aspect) }}
        >
          <span className="sr-only">{title}</span>
        </div>
        <div className="face f-pages" />
        <div className="face f-front" style={{ backgroundImage: `url(${wrapUrl})` }}>
          <span className="f-mark">{seriesLabel}</span>
        </div>
      </div>
      <p className="grab-note">Grab it · drag to turn</p>
    </div>
  );
}
