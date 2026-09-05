'use client';

import { useEffect, useState } from 'react';

/**
 * WHERE THE SPINE IS.
 *
 * cover_wrap.jpg is the file the printer uses: back cover | spine | front
 * cover, laid out left to right, with bleed. Everything the site renders in
 * three dimensions is cut from it, so the geometry has to be exact — and it
 * was not.
 *
 * WHAT WAS WRONG
 * --------------
 * The old code assumed the spine was a fixed 4% of the width, centred. That is
 * true for exactly one page count. Measured across 33 wraps spanning all
 * twelve series, the spine runs from 1.50% to 4.62% of the width, because a
 * thicker book has a wider spine while the covers either side never change.
 * So most spines on the site were showing a slice of the back cover with the
 * real spine art squeezed into part of it.
 *
 * WHAT IS ACTUALLY TRUE
 * ---------------------
 * Measured on those same 33 wraps, without exception:
 *
 *   height          2775px always            9.25in at 300dpi (9in + bleed)
 *   cover width     1838px always            6.125in (6in + outer bleed)
 *   total width     3751px .. 3857px         varies with page count
 *   spine width     W - 3676                 56px .. 178px, i.e. 0.19in .. 0.59in
 *
 * The covers are a constant, so the spine is simply whatever is left over, and
 * it is always centred. That makes every crop derivable from one number: the
 * image's natural width.
 *
 * Because the covers are constant, a face whose aspect ratio is COVER_ASPECT
 * can show its cover exactly with `background-size: auto 100%` and no
 * measurement at all — the scale factor cancels out. Only the spine, whose
 * width genuinely varies, needs the natural width, and that arrives when the
 * image loads.
 */

/** Every wrap is 2775px tall — 9in plus 0.125in bleed top and bottom, at 300dpi. */
export const WRAP_H = 2775;

/** Every cover is 1838px wide — 6in plus 0.125in outer bleed, at 300dpi. */
export const COVER_W = 1838;

/** One cover's aspect. A face with this ratio crops itself, no JS required. */
export const COVER_ASPECT = COVER_W / WRAP_H; // 0.6623

/**
 * The most common spine fraction (a 3824px wrap, which is what most of the
 * catalog is). Used only until the real aspect is known, so the first paint is
 * close rather than wrong by a factor of three.
 */
const FALLBACK_SPINE_FRACTION = (3824 - 2 * COVER_W) / 3824;

/**
 * What share of the wrap's width the spine occupies.
 *
 * Takes the ASPECT RATIO rather than a pixel width on purpose. The bucket is
 * read through Supabase's image-transform endpoint, so the file that actually
 * arrives has been resized — its natural width is 1200, not 3851. Ratios are
 * scale-invariant, so normalising through the known 2775px height recovers the
 * true width whatever size the CDN decided to send.
 */
export function spineFraction(aspect: number | null): number {
  if (!aspect || aspect <= 0) return FALLBACK_SPINE_FRACTION;
  const w = aspect * WRAP_H;
  if (w <= 2 * COVER_W) return FALLBACK_SPINE_FRACTION;
  return (w - 2 * COVER_W) / w;
}

/**
 * `background-size` that makes an element show ONLY the spine.
 *
 * The spine is centred, so `background-position: 50% 50%` is always correct
 * and only the scale changes: blow the image up until the spine's share of it
 * fills the element.
 */
export function spineBackgroundSize(aspect: number | null): string {
  return `${(100 / spineFraction(aspect)).toFixed(1)}% 100%`;
}

/**
 * The spine's OWN aspect ratio: its width over the wrap's height.
 *
 * Shape an element to this and the spine artwork fills it exactly, with no
 * horizontal stretch. A 6x9 book runs about 1:16 to 1:50 depending on how
 * thick it is.
 */
export function spineAspect(aspect: number | null): number {
  const w = aspect && aspect > 0 ? aspect * WRAP_H : 3824;
  const spine = w - 2 * COVER_W;
  return spine > 0 ? spine / WRAP_H : (3824 - 2 * COVER_W) / WRAP_H;
}

/** How thick the book is, relative to the width of its front cover. */
export function spineDepthRatio(aspect: number | null): number {
  const w = aspect && aspect > 0 ? aspect * WRAP_H : 3824;
  const safe = w > 2 * COVER_W ? w : 3824;
  return (safe - 2 * COVER_W) / COVER_W;
}

/**
 * Read a wrap's ASPECT RATIO once it has loaded.
 *
 * Cheap: the browser is fetching this image anyway to paint it, so this
 * resolves off the same cached response rather than a second request. Returns
 * width/height, which survives whatever resizing the CDN applied.
 */
export function useWrapAspect(url: string | undefined): number | null {
  const [a, setA] = useState<number | null>(null);

  useEffect(() => {
    if (!url) return;
    let alive = true;
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => {
      if (alive && img.naturalWidth > 0 && img.naturalHeight > 0) {
        setA(img.naturalWidth / img.naturalHeight);
      }
    };
    img.src = url;
    return () => {
      alive = false;
    };
  }, [url]);

  return a;
}
