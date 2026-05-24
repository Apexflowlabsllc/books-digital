'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image, { type StaticImageData } from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import type { BookSummary } from '@/lib/types';

import b1 from '../public/b1.webp';
import b2 from '../public/b2.webp';
import b3 from '../public/b3.webp';
import b4 from '../public/b4.webp';
import b5 from '../public/b5.webp';
import b6 from '../public/b6.webp';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface FeaturedShowcaseProps {
  totalBooks: number;
  // First 6 real books from the live catalog. Titles, series names, and
  // slug links come from here; the visual cover is the local b1-b6 image
  // (cycled), not the backend's remote cover URL.
  books?: BookSummary[];
}

type Cover = {
  src: StaticImageData;
  title: string;
  series: string;
  slug: string;
};

const LOCAL_COVERS: StaticImageData[] = [b1, b2, b3, b4, b5, b6];

// Fallback used only on cold-backend renders so the carousel still shows
// something. Real data wins via the `books` prop.
const FALLBACK: Cover[] = [
  { src: b1, title: 'The Discipline Blueprint',  series: 'Discipline',   slug: 'the-discipline-blueprint' },
  { src: b2, title: 'The Comeback Blueprint',    series: 'Comeback',     slug: 'the-comeback-blueprint' },
  { src: b3, title: 'The Mind Reset Blueprint',  series: 'Mind Reset',   slug: 'the-mind-reset-blueprint' },
  { src: b4, title: 'The Success Blueprint',     series: 'Success',      slug: 'the-success-blueprint' },
  { src: b5, title: 'The Elite Blueprint',       series: 'Elite',        slug: 'the-elite-blueprint' },
  { src: b6, title: 'The Unstoppable Blueprint', series: 'Unstoppable',  slug: 'the-unstoppable-blueprint' },
];

export function FeaturedShowcase({ totalBooks, books }: FeaturedShowcaseProps) {
  const root = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState(0);

  // Build the cover list from real backend data when available — real titles,
  // real series names, real slug links — but mapped to a local b1-b6 image
  // (cycled) so the visual cover is the locked design asset, not the remote
  // book cover. Fall back to canonical 6 if the catalog is cold.
  const COVERS: Cover[] = (books && books.length > 0
    ? books.slice(0, 6).map((b, i) => ({
        src: LOCAL_COVERS[i % LOCAL_COVERS.length]!,
        title: b.title,
        series: b.series_name,
        slug: b.slug,
      }))
    : FALLBACK);

  const count = COVERS.length;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-feat-fade]', {
        y: 36,
        opacity: 0,
        stagger: 0.08,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: root.current, start: 'top 75%' },
      });

      const counter = root.current?.querySelector('[data-feat-counter]');
      if (counter) {
        const obj = { v: 0 };
        gsap.to(obj, {
          v: 12,
          duration: 1.4,
          ease: 'power3.out',
          onUpdate: () => {
            counter.textContent = String(Math.round(obj.v)).padStart(2, '0');
          },
          scrollTrigger: { trigger: counter, start: 'top 80%' },
        });
      }
    }, root);

    return () => ctx.revert();
  }, []);

  const step = (dir: 1 | -1) => {
    setActive((prev) => (prev + (dir === 1 ? 1 : count - 1)) % count);
  };

  // For each card index, compute its slot relative to the active card.
  // slot = -2, -1, 0 (center), 1, 2 — anything else hides.
  const slotFor = (i: number) => {
    let diff = i - active;
    if (diff > count / 2) diff -= count;
    if (diff < -count / 2) diff += count;
    return diff;
  };

  return (
    <section
      id="featured"
      ref={root}
      className="relative z-10 overflow-hidden py-12 sm:py-28 lg:py-36"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-1/4 h-[420px] w-[420px] rounded-full opacity-25 blur-3xl"
        style={{ background: 'radial-gradient(circle, #4A5C44 0%, transparent 70%)' }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 bottom-0 h-[420px] w-[420px] rounded-full opacity-25 blur-3xl"
        style={{ background: 'radial-gradient(circle, #D9CC8C 0%, transparent 70%)' }}
      />

      <div className="relative mx-auto w-full max-w-[1440px] px-6 lg:px-10">
        {/* CENTERED HEADER */}
        <div className="mx-auto max-w-3xl text-center">
          <p data-feat-fade className="eyebrow-rail mx-auto justify-center">
            §03 · Featured · This Week
          </p>

          <h2
            data-feat-fade
            className="mt-7 font-display font-light leading-[0.95] tracking-[-0.04em] text-cream"
            style={{ fontSize: 'clamp(3rem, 7.5vw, 7rem)' }}
          >
            Fresh from the{' '}
            <span className="italic font-extralight text-gold">warehouse.</span>
          </h2>

          <p
            data-feat-fade
            className="mt-8 mx-auto max-w-xl font-light leading-[1.7] text-ink-dim md:text-[1.05rem]"
          >
            The most recent shipments. Cadence is{' '}
            <span className="font-mono font-semibold text-accent">
              <span data-feat-counter>12</span> / week
            </span>
            . These are this week's cut — read while they're warm.
          </p>
        </div>

        {/* FLAT 3-UP CAROUSEL */}
        <div
          data-feat-fade
          className="carousel-stage relative mt-8 sm:mt-16 lg:mt-20 flex items-center justify-center"
        >
          {COVERS.map((c, i) => {
            const slot = slotFor(i);
            const visible = Math.abs(slot) <= 2;
            return (
              <Link
                key={i}
                href={`/books/${c.slug}`}
                className="carousel-card"
                data-cursor-label="Open"
                aria-label={c.title}
                tabIndex={visible ? 0 : -1}
                style={{
                  // Position by slot — pure horizontal translate, NO rotateY.
                  transform: `translate(-50%, -50%) translateX(${slot * 110}%) scale(${
                    slot === 0 ? 1 : Math.abs(slot) === 1 ? 0.74 : 0.5
                  })`,
                  opacity: visible ? (slot === 0 ? 1 : Math.abs(slot) === 1 ? 0.5 : 0.18) : 0,
                  zIndex: 50 - Math.abs(slot),
                  pointerEvents: visible ? 'auto' : 'none',
                }}
              >
                <div className="relative h-full w-full">
                  <Image
                    src={c.src}
                    alt={c.title}
                    fill
                    sizes="(min-width: 1024px) 30vw, 70vw"
                    className="object-contain"
                    priority={i < 3}
                    draggable={false}
                  />

                  {/* Title sticker — ALWAYS below the cover, tight spacing */}
                  {slot === 0 && (
                    <div
                      className="absolute left-1/2 z-20 -translate-x-1/2 flex flex-col items-center gap-1.5"
                      style={{ top: 'calc(100% + 0.35rem)' }}
                    >
                      <span
                        aria-hidden
                        className="h-1.5 w-1.5 rotate-45 bg-[#D9CC8C]"
                        style={{ boxShadow: '0 0 12px rgba(217, 204, 140, 0.65)' }}
                      />
                      <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.35em] text-accent whitespace-nowrap">
                        {c.series}
                      </span>
                      <span
                        className="font-display font-bold uppercase tracking-tight text-cream whitespace-nowrap"
                        style={{
                          fontSize: 'clamp(1.1rem, 1.7vw, 1.9rem)',
                          letterSpacing: '-0.01em',
                          textShadow: '0 4px 24px rgba(0, 0, 0, 0.95), 0 0 32px rgba(217, 204, 140, 0.25)',
                        }}
                      >
                        {c.title}
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}

          {/* Arrow controls */}
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="Previous"
            className="group absolute left-2 sm:left-6 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-[rgba(217,204,140,0.35)] bg-[#001428]/60 backdrop-blur-sm transition-all hover:border-accent hover:bg-[#4A5C44]/40"
          >
            <ArrowLeft className="h-5 w-5 text-accent transition-transform group-hover:-translate-x-0.5" strokeWidth={2.2} />
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            aria-label="Next"
            className="group absolute right-2 sm:right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-[rgba(217,204,140,0.35)] bg-[#001428]/60 backdrop-blur-sm transition-all hover:border-accent hover:bg-[#4A5C44]/40"
          >
            <ArrowRight className="h-5 w-5 text-accent transition-transform group-hover:translate-x-0.5" strokeWidth={2.2} />
          </button>
        </div>

        {/* Progress dots */}
        <div data-feat-fade className="mt-8 sm:mt-16 lg:mt-24 flex items-center justify-center gap-2">
          {COVERS.map((_, i) => (
            <span
              key={i}
              className="h-1.5 transition-all duration-500"
              style={{
                width: i === active ? '28px' : '6px',
                backgroundColor: i === active ? '#D9CC8C' : 'rgba(217,204,140,0.25)',
                borderRadius: '999px',
              }}
            />
          ))}
        </div>

        <div data-feat-fade className="mt-6 sm:mt-10 flex justify-center">
          <Link href="/books" className="cta-3d" data-cursor-label="All books">
            <span>See all {totalBooks > 0 ? totalBooks.toLocaleString() : '636'} books</span>
            <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} aria-hidden />
          </Link>
        </div>
      </div>

      <style jsx>{`
        .carousel-stage {
          height: clamp(320px, 50vh, 880px);
        }
        .carousel-card {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 200px;
          height: 300px;
          transition: transform 0.7s cubic-bezier(0.22, 1, 0.36, 1),
                      opacity 0.6s ease;
          filter:
            drop-shadow(0 50px 80px rgba(0, 0, 0, 0.85))
            drop-shadow(0 0 60px rgba(217, 204, 140, 0.18));
        }
        @media (min-width: 640px) {
          .carousel-stage {
            height: clamp(440px, 64vh, 720px);
          }
          .carousel-card {
            width: 400px;
            height: 600px;
          }
        }
        @media (min-width: 1024px) {
          .carousel-stage {
            height: clamp(520px, 78vh, 880px);
          }
          .carousel-card {
            width: 500px;
            height: 750px;
          }
        }
      `}</style>
    </section>
  );
}
