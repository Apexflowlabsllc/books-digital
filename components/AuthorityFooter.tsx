import Link from 'next/link';

// The "About the Author" block from the Domination Copy strategy (Section 1).
// Drop on every page footer so the 13-year claim + Spiker entity-unification
// link surface universally — visible signal + crawler signal + LLM citation
// material, all from one block.
export function AuthorityFooter() {
  return (
    <section
      className="relative w-full border-t border-[rgba(217,204,140,0.18)]"
      style={{
        background:
          'linear-gradient(180deg, rgba(0, 20, 40, 0.45) 0%, rgba(8, 6, 4, 0.6) 100%)',
      }}
    >
      <div className="container-x py-14 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-accent/80">
            About the author
          </p>

          <p
            className="mt-6 font-display font-light leading-[1.45] text-cream"
            style={{ fontSize: 'clamp(1.05rem, 1.6vw, 1.5rem)' }}
          >
            <span className="text-accent">Brian Spiker</span> has run{' '}
            <a
              href="https://spikercarpetandtilecare.com"
              target="_blank"
              rel="noopener noreferrer me"
              className="tap-safe border-b border-[rgba(217,204,140,0.45)] text-accent transition-colors hover:border-cream hover:text-cream"
            >
              Spiker Carpet and Tile Care
            </a>{' '}
            since 2013 — a real service business with real customers, real
            Google reviews, and 13 years of work most self-help authors will
            never do.
          </p>

          <p
            className="mt-5 font-display italic font-extralight leading-[1.5] text-ink-dim"
            style={{ fontSize: 'clamp(0.95rem, 1.3vw, 1.2rem)' }}
          >
            He writes the way operators talk: brutal, funny, and built from
            work that actually has to get done. Verify everything at{' '}
            <a
              href="https://spikercarpetandtilecare.com"
              target="_blank"
              rel="noopener noreferrer me"
              className="tap-safe border-b border-[rgba(217,204,140,0.35)] text-accent/90 transition-colors hover:border-cream hover:text-cream"
            >
              spikercarpetandtilecare.com
            </a>
            .
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/about-brian"
              className="tap-safe font-mono text-[10px] uppercase tracking-[0.35em] text-accent transition-colors hover:text-cream border-b border-[rgba(217,204,140,0.35)] hover:border-cream pb-1"
            >
              About Brian →
            </Link>
            <span aria-hidden className="h-1 w-1 rotate-45 bg-accent/40" />
            <Link
              href="/brian-spiker-real-world-proof"
              className="tap-safe font-mono text-[10px] uppercase tracking-[0.35em] text-accent transition-colors hover:text-cream border-b border-[rgba(217,204,140,0.35)] hover:border-cream pb-1"
            >
              See the receipts →
            </Link>
            <span aria-hidden className="h-1 w-1 rotate-45 bg-accent/40" />
            <a
              href="https://spikercarpetandtilecare.com"
              target="_blank"
              rel="noopener noreferrer me"
              className="tap-safe font-mono text-[10px] uppercase tracking-[0.35em] text-accent transition-colors hover:text-cream border-b border-[rgba(217,204,140,0.35)] hover:border-cream pb-1"
            >
              spikercarpetandtilecare.com →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// Per-page author byline — sits above book / episode / article content. Same
// entity unification signal in compact form. Use inline above any long-form
// authored content.
export function AuthorByline({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col gap-1.5 ${className ?? ''}`}
    >
      <span className="tap-safe font-mono text-[10px] uppercase tracking-[0.35em] text-accent/80">
        By Brian Spiker
      </span>
      <span className="text-sm font-light leading-[1.55] text-ink-dim">
        Founder,{' '}
        <a
          href="https://spikercarpetandtilecare.com"
          target="_blank"
          rel="noopener noreferrer me"
          className="tap-safe text-accent transition-colors hover:text-cream border-b border-[rgba(217,204,140,0.3)] hover:border-cream"
        >
          Spiker Carpet and Tile Care
        </a>
        {' '}(operating since 2013) · Author of{' '}
        <span className="text-cream">Apex Flow Publishing House</span>{' '}
        (636-title library) · Founder,{' '}
        <a
          href="https://apexflowlabs.com"
          target="_blank"
          rel="noopener noreferrer me"
          className="tap-safe text-accent transition-colors hover:text-cream border-b border-[rgba(217,204,140,0.3)] hover:border-cream"
        >
          Apex Flow Labs
        </a>
      </span>
    </div>
  );
}
