import Link from 'next/link';
import { AuthorityFooter } from './AuthorityFooter';

// Apex Flow Labs ecosystem — canonical 12-brand list with subdomain URLs.
// Every brand lives at {brand}.apexflowlabs.com. Books is the current site.
const ECOSYSTEM_BRANDS: Array<{ label: string; href: string; external?: boolean; current?: boolean }> = [
  { label: 'Apex Flow Labs',    href: 'https://www.apexflowlabs.com',          external: true },
  { label: 'Apex Books',        href: 'https://books.apexflowlabs.com',        external: true, current: true },
  { label: 'Apex Academy',      href: 'https://academy.apexflowlabs.com',      external: true },
  { label: 'Apex Health',       href: 'https://health.apexflowlabs.com',       external: true },
  { label: 'Apex Beauty',       href: 'https://beauty.apexflowlabs.com',       external: true },
  { label: 'Apex Pets',         href: 'https://pets.apexflowlabs.com',         external: true },
  { label: 'Apex Apparel',      href: 'https://gear.apexflowlabs.com',         external: true },
  { label: 'Apex Affiliates',   href: 'https://partners.apexflowlabs.com',     external: true },
  { label: 'Apex Companion AI', href: 'https://www.apexcompanion.ai/',         external: true },
  { label: 'Apex Warfare AI',   href: 'https://warfare.apexflowlabs.com',      external: true },
  { label: 'Apex Kids',         href: 'https://kids.apexflowlabs.com',         external: true },
  { label: 'Spiker',            href: 'https://spiker.apexflowlabs.com',       external: true },
];

const FOOTER_COLUMNS = [
  {
    heading: 'Library',
    links: [
      { href: '/books', label: 'All books' },
      { href: '/series', label: 'The 12 series' },
      { href: '/bundles', label: 'Series bundles' },
    ],
  },
  {
    heading: 'Authority',
    links: [
      { href: '/about-brian', label: 'About Brian' },
      { href: '/brian-spiker-real-world-proof', label: 'Real-world proof' },
      { href: '/press', label: 'Press' },
    ],
  },
  {
    heading: 'Commerce',
    links: [
      { href: '/membership', label: 'Books Pass — $99/yr' },
      { href: '/founder-edition', label: 'Founder Edition — $9,999' },
      { href: '/contact', label: 'Contact' },
    ],
  },
];

export function Footer() {
  return (
    <footer
      className="relative mt-24 overflow-hidden border-t border-[rgba(217,204,140,0.18)] backdrop-blur-xl"
      style={{
        background:
          'linear-gradient(180deg, rgba(0, 20, 40, 0.55) 0%, rgba(8, 6, 4, 0.7) 60%, rgba(0, 0, 0, 0.85) 100%)',
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(217,204,140,0.45) 25%, rgba(255,225,208,0.6) 50%, rgba(217,204,140,0.45) 75%, transparent 100%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 -top-32 h-72 w-72 rounded-full opacity-30 blur-3xl"
        style={{ background: 'radial-gradient(circle, #4A5C44 0%, transparent 70%)' }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full opacity-25 blur-3xl"
        style={{ background: 'radial-gradient(circle, #D9CC8C 0%, transparent 70%)' }}
      />

      <div className="container-x relative grid gap-12 py-20 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="flex items-center gap-3">
            <span aria-hidden className="text-2xl text-accent">▲</span>
            <p className="font-display text-[1.45rem] italic font-light text-cream tracking-tight">
              Apex Flow Publishing House
            </p>
          </div>
          <p className="mt-5 text-sm font-light leading-[1.7] text-ink-dim max-w-xs">
            A 636-title library across 12 series, releasing book by book. Written by Brian Spiker —
            founder of{' '}
            <a
              href="https://spikercarpetandtilecare.com"
              className="text-accent transition-colors hover:text-cream border-b border-[rgba(217,204,140,0.3)] hover:border-cream"
              rel="noopener noreferrer me"
              target="_blank"
            >
              Spiker Carpet and Tile Care
            </a>
            , operating since 2013. 13 years of receipts.
          </p>

          <div className="mt-8 flex items-center gap-3">
            <span aria-hidden className="h-px w-10 bg-[rgba(217,204,140,0.4)]" />
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-accent/70">
              Est. 2026
            </span>
          </div>
        </div>

        {FOOTER_COLUMNS.map((col) => (
          <div key={col.heading}>
            <p className="eyebrow-rail mb-5">{col.heading}</p>
            <ul className="space-y-3">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="group inline-flex items-center gap-2 text-[0.95rem] font-light text-ink-dim transition-colors hover:text-cream"
                  >
                    <span
                      aria-hidden
                      className="h-1 w-1 rotate-45 bg-accent/0 transition-all duration-300 group-hover:bg-accent"
                    />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Apex Flow Labs ecosystem strip — every brand under the parent */}
      <div className="container-x relative border-t border-[rgba(217,204,140,0.12)] py-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-accent/80">
          The Apex Flow Labs companies:
        </p>
        <ul className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3 text-[0.85rem]">
          {ECOSYSTEM_BRANDS.map((brand, i) => {
            const labelEl = (
              <>
                {brand.label}
                {brand.current ? (
                  <span className="ml-2 font-mono text-[9px] uppercase tracking-[0.3em] text-accent/60">
                    · you are here
                  </span>
                ) : null}
              </>
            );
            const classes = `transition-colors hover:text-accent ${
              brand.current ? 'text-accent' : 'text-ink-dim'
            }`;
            return (
              <li key={brand.label} className="flex items-center gap-3">
                {brand.external ? (
                  <a
                    href={brand.href}
                    target="_blank"
                    rel="noopener noreferrer me"
                    className={classes}
                    aria-current={brand.current ? 'page' : undefined}
                  >
                    {labelEl}
                  </a>
                ) : (
                  <Link
                    href={brand.href}
                    className={classes}
                    aria-current={brand.current ? 'page' : undefined}
                  >
                    {labelEl}
                  </Link>
                )}
                {i < ECOSYSTEM_BRANDS.length - 1 ? (
                  <span aria-hidden className="h-1 w-1 rotate-45 bg-accent/30" />
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="section-divider container-x !my-0 !py-0">
        <span />
      </div>

      <div className="container-x relative flex flex-col gap-3 py-7 text-xs text-ink-mute md:flex-row md:items-center md:justify-between">
        <p className="font-mono uppercase tracking-[0.3em]">
          © {new Date().getUTCFullYear()} Apex Flow Publishing House · All rights reserved
        </p>
        <p className="font-mono uppercase tracking-[0.3em]">
          Original business ·{' '}
          <a
            href="https://spikercarpetandtilecare.com"
            className="text-accent/80 hover:text-cream transition-colors"
            rel="noopener noreferrer me"
            target="_blank"
          >
            spikercarpetandtilecare.com
          </a>
        </p>
      </div>
    </footer>
  );
}

// Composed footer — drops the authority block above the existing footer so
// every page surfaces the 13-year claim + entity-unification link before the
// site nav columns appear.
export function FooterWithAuthority() {
  return (
    <>
      <AuthorityFooter />
      <Footer />
    </>
  );
}
