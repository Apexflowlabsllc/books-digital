'use client';

import Link from 'next/link';
import Image, { type StaticImageData } from 'next/image';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowUpRight } from 'lucide-react';
import type { BookSummary } from '@/lib/types';
import { imageProxy } from '@/lib/utils';
import { Magnetic } from './Magnetic';

// Static book covers shipped from /public — one per series (b1–b12).
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

interface HomeHeroProps {
  books: BookSummary[];
  totalBooks: number;
}

// 12 cover slots — one per series. Each book appears exactly once. The
// carousel rotates all 12 through the 4 visible positions over time.
const HERO_BOOK_IMAGES: StaticImageData[] = [
  b1, b2, b3, b4, b5, b6, b7, b8, b9, b10, b11, b12,
];

// 4 visible positions + 8 off-screen "queue" slots. 12 covers cycle through
// these 12 slots so only 4 are seen at any moment, but every series gets
// stage time as the carousel rotates. Widths are 20% smaller than before;
// every left% is shifted ~8% leftward so the visible deck sits closer to
// the left side of its column.
const CARD_LAYOUT: Array<{ left: string; top: string; w: string; z: number; rot: number; opacity?: number }> = [
  { left: '26%',   top: '50%', w: '37%', z: 60, rot: -2 },                 // 0 · CENTER-LEFT (visible)
  { left: '58%',   top: '50%', w: '37%', z: 60, rot:  2 },                 // 1 · CENTER-RIGHT (visible)
  { left: '0%',    top: '50%', w: '30%', z: 45, rot: -6 },                 // 2 · MID-LEFT (visible)
  { left: '84%',   top: '50%', w: '30%', z: 45, rot:  6 },                 // 3 · MID-RIGHT (visible)
  { left: '-38%',  top: '50%', w: '26%', z: 20, rot: -10, opacity: 0 },    // 4 · QUEUE-L-1
  { left: '122%',  top: '50%', w: '26%', z: 20, rot:  10, opacity: 0 },    // 5 · QUEUE-R-1
  { left: '-63%',  top: '50%', w: '24%', z: 18, rot: -12, opacity: 0 },    // 6 · QUEUE-L-2
  { left: '147%',  top: '50%', w: '24%', z: 18, rot:  12, opacity: 0 },    // 7 · QUEUE-R-2
  { left: '-88%',  top: '50%', w: '22%', z: 15, rot: -14, opacity: 0 },    // 8 · QUEUE-L-3
  { left: '172%',  top: '50%', w: '22%', z: 15, rot:  14, opacity: 0 },    // 9 · QUEUE-R-3
  { left: '-113%', top: '50%', w: '21%', z: 12, rot: -16, opacity: 0 },    // 10 · QUEUE-L-4
  { left: '197%',  top: '50%', w: '21%', z: 12, rot:  16, opacity: 0 },    // 11 · QUEUE-R-4
];

export function HomeHero({ books, totalBooks }: HomeHeroProps) {
  const root = useRef<HTMLElement | null>(null);

  useEffect(() => {
    let carouselTimer: gsap.core.Tween;
    
    const ctx = gsap.context(() => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      if (reduced) {
        gsap.set('[data-hero-fade], [data-hero-letter], [data-hero-card], [data-hero-rail], [data-hero-eyebrow]', {
          opacity: 1, y: 0, x: 0, rotate: 0, scale: 1, yPercent: 0
        });
        gsap.set('[data-hero-card-wrapper]', {
          left: (i) => CARD_LAYOUT[i].left,
          top: (i) => CARD_LAYOUT[i].top,
          width: (i) => CARD_LAYOUT[i].w,
          zIndex: (i) => CARD_LAYOUT[i].z,
          rotation: (i) => CARD_LAYOUT[i].rot,
          opacity: (i) => CARD_LAYOUT[i].opacity ?? 1,
        });
        return;
      }

      // GSAP is now the ONLY thing handling the transforms/opacity
      gsap.set('[data-hero-eyebrow]', { opacity: 0, y: 16 });
      gsap.set('[data-hero-fade]', { opacity: 0, y: 24 });
      gsap.set('[data-hero-letter]', { opacity: 0, yPercent: 120 });
      gsap.set('[data-hero-rail]', { opacity: 0, x: -20 });

      const cardWrappers = gsap.utils.toArray<HTMLElement>('[data-hero-card-wrapper]');

      // Set every card to its final position immediately — only opacity + y
      // are animated so all 6 books appear together, not one by one.
      gsap.set(cardWrappers, {
        left: (i) => CARD_LAYOUT[i].left,
        top: '50%',
        width: (i) => CARD_LAYOUT[i].w,
        rotation: (i) => CARD_LAYOUT[i].rot,
        zIndex: (i) => CARD_LAYOUT[i].z,
        opacity: 0,
        yPercent: 8,
      });

      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

      // Books animate immediately on mount — anchor visual lands first.
      // Text tweens run in parallel.
      tl.to(
        cardWrappers,
        {
          opacity: (i) => CARD_LAYOUT[i].opacity ?? 1,
          yPercent: 0,
          duration: 0.9,
          ease: 'power3.out',
        },
        0,
      )
        .to('[data-hero-eyebrow]', { opacity: 1, y: 0, duration: 0.6 }, 0)
        .to('[data-hero-rail]', { opacity: 1, x: 0, duration: 0.6 }, 0.05)
        .to(
          '[data-hero-letter]',
          { opacity: 1, yPercent: 0, duration: 0.9, stagger: 0.01, ease: 'power4.out' },
          0.1,
        )
        .to(
          '[data-hero-fade]',
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.06, ease: 'power3.out' },
          0.4,
        );

      // Carousel rotation cycles all 12 positions in a closed loop. Visual
      // order (sorted by left%): 10 → 8 → 6 → 4 → 2 → 0 → 1 → 3 → 5 → 7 →
      // 9 → 11 → wraps. Each tick every card slides one slot to the left;
      // queue cards become visible, visible cards drift off-screen.
      let currentPositions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
      const nextPosMap: Record<number, number> = {
        11: 9, 9: 7, 7: 5, 5: 3, 3: 1, 1: 0,
        0: 2, 2: 4, 4: 6, 6: 8, 8: 10, 10: 11,
      };

      const playCarousel = () => {
        carouselTimer = gsap.delayedCall(4.5, () => {
          currentPositions = currentPositions.map((p) => nextPosMap[p]);

          currentPositions.forEach((posIndex, cardIndex) => {
            const wrapper = cardWrappers[cardIndex];
            const pos = CARD_LAYOUT[posIndex];

            gsap.to(wrapper, {
              left: pos.left,
              width: pos.w,
              rotation: pos.rot,
              zIndex: pos.z,
              opacity: pos.opacity ?? 1,
              roundProps: 'zIndex',
              duration: 1.4,
              ease: 'power3.inOut',
            });
          });
          playCarousel();
        });
      };

      tl.call(playCarousel);

      const innerCards = gsap.utils.toArray<HTMLElement>('[data-hero-card]');
      const onMove = (e: PointerEvent) => {
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        const ry = (e.clientX - cx) / cx;
        const rx = (e.clientY - cy) / cy;
        
        innerCards.forEach((card, i) => {
          const depth = (i + 1) / innerCards.length;
          gsap.to(card, {
            x: ry * 28 * depth,
            y: rx * 20 * depth,
            rotateX: rx * -4 * depth,
            rotateY: ry * 6 * depth,
            duration: 1.2,
            ease: 'power3.out',
            transformPerspective: 1200,
            transformOrigin: 'center',
          });
        });
      };
      
      window.addEventListener('pointermove', onMove);
      return () => window.removeEventListener('pointermove', onMove);
      
    }, root);

    return () => {
      if (carouselTimer) carouselTimer.kill();
      ctx.revert();
    };
  }, []);

  const rawFeatured = books.slice(0, 12);
  const renderCards = rawFeatured.length === 12
    ? rawFeatured
    : [...rawFeatured, ...Array.from({ length: 12 - rawFeatured.length }).map(() => null)];

  return (
    <section
      ref={root}
      className="relative isolate flex w-full flex-col overflow-hidden text-white lg:min-h-[100vh]"
    >


      <div className="relative z-10 flex-1 flex items-start  lg:items-center">
        <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-20 px-6 pt-0 pb-16 lg:grid-cols-[1.1fr_1fr] lg:gap-20 lg:px-10 lg:py-12">

          {/* Text column — appears AFTER the deck on mobile (order-2), reverts
              to grid order on lg+ */}
          <div className="relative flex flex-col justify-center order-2 lg:order-1">
            <p
              data-hero-eyebrow
              className="mb-6 flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.4em] text-accent font-medium will-change-transform"
            >
              <span className="h-px w-12 bg-accent/60" />
              <span>Most self-help is written by people who&apos;ve never had a real job.</span>
            </p>

            <h1 className="font-display text-white flex flex-col items-start leading-[0.88]">
              <div className="flex items-start gap-5">
                
                <HeroLine
                  text="636"
                  className="text-[clamp(5.5rem,12vw,11rem)] font-light tracking-[-0.045em] text-white leading-[0.85]"
                  inline
                />
              </div>

              <HeroLine
                text="operator books,"
                className="mt-5 text-[clamp(1.4rem,2.6vw,2.1rem)] italic font-extralight text-white tracking-tight"
              />

              <div className="flex flex-wrap items-baseline gap-x-3 lg:gap-x-5 mt-2">
                <HeroLine
                  text="one"
                  className="text-[clamp(2.2rem,4.4vw,3.5rem)] italic font-extralight text-white tracking-tight"
                  inline
                />
                <HeroLine
                  text="war manual."
                  className="text-[clamp(4.2rem,8.8vw,7.8rem)] font-medium tracking-[-0.045em] lowercase text-white"
                  inline
                />
              </div>

              <span
                data-hero-rail
                aria-hidden
                className="mt-6 h-px w-20 bg-white/30 will-change-transform"
              />
            </h1>

            <p
              data-hero-fade
              className="mt-10 max-w-[500px] text-[1.05rem] font-light leading-[1.65] text-white/85 md:text-lg will-change-transform"
            >
              Brian Spiker has cleaned carpets since 2013 —{' '}
              <a
                href="https://spikercarpetandtilecare.com"
                target="_blank"
                rel="noopener noreferrer me"
                className="font-medium text-accent transition-colors hover:text-cream border-b border-accent/40 pb-0.5 hover:border-cream"
              >
                Spiker Carpet and Tile Care
              </a>
              . Carpet cleaning. Upholstery. Tile and grout — clean and seal. Pet odors —
              enzymes for the urine, treatment for the oils that bake wet-dog smell into your
              carpet fibers. The stuff most cleaners won&apos;t bother with.
            </p>

            <p
              data-hero-fade
              className="mt-5 max-w-[500px] text-[1.05rem] font-light leading-[1.65] text-white/70 md:text-lg will-change-transform"
            >
              He wrote 636 books on the side. They&apos;re{' '}
              <span className="text-cream">R-rated</span>. They&apos;re{' '}
              <span className="text-cream">funny</span>. They&apos;ll probably piss you off a
              little because they&apos;re going to call out the bullshit you&apos;ve been doing.
              Welcome.
            </p>

            <div
              data-hero-fade
              className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center will-change-transform"
            >
              <Magnetic>
                <Link
                  href="/books/the-discipline-blueprint"
                  className="cta-3d"
                  data-cursor-label="Start"
                >
                  <span>Start with Book #1 · $6.99</span>
                  <ArrowUpRight className="h-4 w-4" aria-hidden strokeWidth={2.5} />
                </Link>
              </Magnetic>
              <Magnetic strength={0.22}>
                <Link
                  href="/free-chapter/the-discipline-blueprint"
                  className="cta-3d-ghost"
                  data-cursor-label="Free"
                >
                  Free first chapter
                </Link>
              </Magnetic>
              <Magnetic strength={0.18}>
                <Link
                  href="/series"
                  className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent/80 transition-colors hover:text-cream border-b border-[rgba(217,204,140,0.3)] hover:border-cream pb-1"
                  data-cursor-label="See"
                >
                  Or see the 12 series →
                </Link>
              </Magnetic>
            </div>

            <ul
              data-hero-fade
              className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[10px] uppercase tracking-[0.3em] text-white/55 will-change-transform"
            >
              <li className="flex items-center gap-2">
                <span aria-hidden className="h-1.5 w-1.5 rotate-45 bg-accent" />
                Carpets · Upholstery · Tile &amp; Grout
              </li>
              <li className="flex items-center gap-2">
                <span aria-hidden className="h-1.5 w-1.5 rotate-45 bg-accent" />
                636 books between jobs
              </li>
              <li className="flex items-center gap-2">
                <span aria-hidden className="h-1.5 w-1.5 rotate-45 bg-accent" />
                Zero ayahuasca
              </li>
              <li className="flex items-center gap-2">
                <span aria-hidden className="h-1.5 w-1.5 rotate-45 bg-accent" />
                Zero ice baths
              </li>
              <li className="flex items-center gap-2">
                <span aria-hidden className="h-1.5 w-1.5 rotate-45 bg-accent" />
                Zero manifestation bullshit
              </li>
            </ul>
          </div>

          {/* Deck column — appears FIRST on mobile (order-1), shifted upward
              with negative top margin so the books read closer to the top. */}
          <div className="relative h-[32vh] min-h-[230px] lg:h-[88vh] lg:min-h-[700px] order-1 lg:order-2 -mt-2 lg:-mt-6">
            

            <div
              data-hero-deck
              // Mobile shifts the entire deck ~14% to the left so the
              // books visually lean off-page-left. Desktop is unchanged.
              className="absolute inset-0 -translate-x-[9%] lg:translate-x-0"
              style={{ transformStyle: 'preserve-3d', perspective: '1200px' }}
            >
              {renderCards.map((book, i) => {
                const isBook = typeof book === 'object' && book && 'slug' in book;
                const b = isBook ? (book as BookSummary) : null;
                
                return (
                  <div
                    key={b?.slug ?? i}
                    data-hero-card-wrapper
                    className="absolute aspect-[2/3]"
                    style={{ transform: 'translate(-50%, -50%)' }}
                  >
                    <div
                      data-hero-card
                      className="relative h-full w-full will-change-transform"
                    >
                      <CoverFrame
                        book={b}
                        index={i}
                        srcOverride={HERO_BOOK_IMAGES[i]}
                      />
                    </div>
                  </div>
                );
              })}

              <span
                data-hero-rail
                className="absolute bottom-2 left-0 flex items-center gap-4 text-[10px] sm:text-[11px] uppercase tracking-[0.35em] text-white/50 font-medium will-change-transform lg:-bottom-4"
              >
                <span className="font-mono ">FEATURED · 12 OF {totalBooks > 0 ? totalBooks : '636'}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

     

      <div
        data-hero-fade
        className="relative z-10 overflow-hidden border-y border-[rgba(217,204,140,0.22)] bg-black will-change-transform"
      >
        <div
          className="flex animate-marquee-fwd whitespace-nowrap py-6"
          style={{ animationDuration: '42s' }}
        >
          {[0, 1].map((dup) => (
            <div key={dup} className="flex shrink-0 items-center" aria-hidden={dup === 1}>
              <MarqueeWord text={totalBooks > 0 ? `${totalBooks.toLocaleString()} BOOKS` : '636 BOOKS'} />
              <MarqueeDot />
              <MarqueeWord text="12 SERIES" />
              <MarqueeDot />
              <MarqueeWord text="04 WAVES" />
              <MarqueeDot />
              <MarqueeWord text="ONE WAR MANUAL" />
              <MarqueeDot />
              <MarqueeWord text="90 CHAPTERS" />
              <MarqueeDot />
              <MarqueeWord text="16 YEARS LIVE" />
              <MarqueeDot />
              <MarqueeWord text="NO UPSELL" />
              <MarqueeDot />
              <MarqueeWord text="OPERATOR GRADE" />
              <MarqueeDot />
            </div>
          ))}
        </div>
      </div>

      <div
        data-hero-fade
        className="relative z-10 overflow-hidden border-b border-[rgba(255,225,208,0.22)] will-change-transform"
        style={{ backgroundColor: '#4A5C44' }}
      >
        <div
          className="flex animate-marquee-reverse whitespace-nowrap py-4"
          style={{ animationDuration: '55s' }}
        >
          {[0, 1].map((dup) => (
            <div key={dup} className="flex shrink-0 items-center" aria-hidden={dup === 1}>
              <MarqueeTag text="Scroll · The Foundation" icon />
              <MarqueeDiamond />
              <MarqueeTag text="Operator-grade · not guru-grade" />
              <MarqueeDiamond />
              <MarqueeTag text="90 chapters · 90 days · one book" />
              <MarqueeDiamond />
              <MarqueeTag text="No drip · No upsell" />
              <MarqueeDiamond />
              <MarqueeTag text="Built on thirteen years of payroll" />
              <MarqueeDiamond />
              <MarqueeTag text="Written by an operator, not a guru" />
              <MarqueeDiamond />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HeroLine({
  text,
  className,
  inline,
}: {
  text: string;
  className?: string;
  inline?: boolean;
}) {
  const Tag = inline ? 'span' : 'div';
  const words = text.split(' ');
  
  return (
    <Tag className={`relative overflow-hidden ${inline ? 'inline-flex' : 'flex'} flex-wrap ${className ?? ''}`}>
      {words.map((word, wIdx) => (
        <span key={wIdx} className="inline-flex overflow-hidden pb-[0.1em]">
          {word.split('').map((ch, cIdx) => (
            <span
              key={cIdx}
              data-hero-letter
              // REMOVED Tailwind transforms/opacity here so it doesn't fight GSAP
              className="inline-block will-change-transform"
            >
              {ch}
            </span>
          ))}
          {wIdx < words.length - 1 && (
            <span className="inline-block w-[0.25em]">&nbsp;</span>
          )}
        </span>
      ))}
    </Tag>
  );
}

function MarqueeWord({ text }: { text: string }) {
  return (
    <span
      className="font-sans font-black uppercase leading-none text-[#D9CC8C] px-8 lg:px-12"
      style={{
        fontSize: 'clamp(2.4rem, 5vw, 4.5rem)',
        letterSpacing: '-0.02em',
        fontStretch: '125%',
        fontVariationSettings: "'wght' 900",
      }}
    >
      {text}
    </span>
  );
}

function MarqueeDot() {
  return (
    <span
      aria-hidden
      className="inline-block h-3 w-3 lg:h-4 lg:w-4 shrink-0"
      style={{ backgroundColor: '#FFE1D0' }}
    />
  );
}

function MarqueeTag({ text, icon }: { text: string; icon?: boolean }) {
  return (
    <span
      className="font-display italic font-light leading-none px-7 lg:px-10 inline-flex items-center gap-3"
      style={{
        color: '#FFE1D0',
        fontSize: 'clamp(1rem, 1.4vw, 1.35rem)',
        letterSpacing: '-0.005em',
      }}
    >
      {icon && (
        <span
          aria-hidden
          className="inline-block h-2 w-2 rotate-45 shrink-0"
          style={{ backgroundColor: '#D9CC8C' }}
        />
      )}
      {text}
    </span>
  );
}

function MarqueeDiamond() {
  return (
    <span
      aria-hidden
      className="inline-block h-2.5 w-2.5 lg:h-3 lg:w-3 rotate-45 shrink-0"
      style={{ backgroundColor: '#D9CC8C' }}
    />
  );
}

function CoverFrame({
  book,
  index,
  srcOverride,
}: {
  book: BookSummary | null;
  index: number;
  srcOverride?: string | StaticImageData;
}) {
  const src: string | StaticImageData =
    srcOverride ?? (book ? imageProxy(book.cover_r2_key) : '');
  return (
    <div className="group relative h-full w-full">
      {src ? (
        <Image
          src={src}
          alt=""
          fill
          sizes="(min-width: 1024px) 60vw, 80vw"
          className="object-cover drop-shadow-[0_40px_80px_rgba(0,0,0,0.85)]"
          priority={index < 2}
        />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #222 0%, #111 50%, #222 100%)',
          }}
        >
          <span className="font-display text-[3.5rem] text-white/30" aria-hidden>▲</span>
        </div>
      )}

      {book ? (
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-4 p-6 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100"
          aria-hidden
        >
          <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-white/70 mb-1.5">
            {book.series_name}
          </p>
          <p className="font-display text-[1.1rem] leading-tight text-white">{book.title}</p>
        </div>
      ) : null}
    </div>
  );
}