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

type Props = {
  coverUrl: string;
  title: string;
  seriesLabel: string;
  accent: string;
};

export function RotatingBook({ coverUrl, title, seriesLabel, accent }: Props) {
  const bookRef = useRef<HTMLDivElement>(null);
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
        style={{ ['--accent' as string]: accent }}
      >
        <div className="face f-back" />
        <div className="face f-spine">
          <span className="spine-title">{title}</span>
        </div>
        <div className="face f-pages" />
        <div className="face f-front">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={coverUrl} alt="" aria-hidden className="f-art" />
          <span className="f-mark">{seriesLabel}</span>
        </div>
      </div>
      <p className="grab-note">Grab it · drag to turn</p>
    </div>
  );
}
