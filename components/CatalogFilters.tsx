'use client';

import { useMemo, useState } from 'react';
import type { BookSummary, Format } from '@/lib/types';
import { BookTile } from './BookTile';
import { empty } from '@/lib/voice';
import { sortFormats } from '@/lib/utils';
import { matchProblem, STARTER_PROBLEMS } from '@/lib/problemMatch';
import { TERM_COUNT } from '@/lib/encyclopedia';

/**
 * THE LIBRARY, ORGANISED.
 *
 * The old version dumped all 636 books into one four-column grid of large
 * cards. Everything arrived at once, every card wore a gold sale badge and a
 * gold series label, and there was no order a visitor could feel — so it read
 * as a single wall of yellow rather than a catalog.
 *
 * Three changes fix that:
 *
 * 1. SHELVES, NOT A HEAP. Books group into their twelve series, in catalog
 *    order, each shelf numbered and ruled in that series own colour. Twelve
 *    colours instead of one, and an order you can follow down the page.
 *
 * 2. ONE ROW EACH, THEN ASK. A shelf shows its first eight books; the rest sit
 *    behind "Show all 53". First paint is ~96 covers rather than 636, so the
 *    page arrives calm and opens on demand. Filtering to a single series
 *    expands it automatically, because at that point you asked for all of it.
 *
 * 3. SMALLER. BookTile instead of BookCard — the cover carries the book and
 *    everything else drops to a title and a price.
 *
 * The filters still do exactly what they did; they are just quieter and sit on
 * one line.
 */

interface CatalogFiltersProps {
  books: BookSummary[];
}

type WaveFilter = 'all' | '1' | '2' | '3' | '4';
type FormatFilter = 'all' | Format;
type VoiceFilter = 'all' | 'low' | 'medium' | 'high';

/** How many covers a shelf shows before it asks. One desktop row. */
const PEEK = 8;

export function CatalogFilters({ books }: CatalogFiltersProps) {
  const [series, setSeries] = useState<string>('all');
  const [wave, setWave] = useState<WaveFilter>('all');
  const [format, setFormat] = useState<FormatFilter>('all');
  const [voice, setVoice] = useState<VoiceFilter>('all');
  const [opened, setOpened] = useState<Record<string, boolean>>({});
  const [q, setQ] = useState('');

  /* Say-the-problem search. Runs entirely in memory over books already on the
   * page, so it answers on every keystroke with no request. */
  const searching = q.trim().length >= 2;
  const found = useMemo(
    () => (searching ? matchProblem(q, books) : null),
    [q, books, searching],
  );

  const seriesOptions = useMemo(() => {
    const m = new Map<string, string>();
    for (const b of books) m.set(b.series_slug, b.series_name);
    return [...m.entries()];
  }, [books]);

  const filtered = useMemo(() => {
    return books.filter((b) => {
      if (series !== 'all' && b.series_slug !== series) return false;
      if (wave !== 'all' && String(b.wave) !== wave) return false;
      if (format !== 'all') {
        const has = sortFormats(b.formats).some((f) => f.format === format && f.available);
        if (!has) return false;
      }
      if (voice !== 'all') {
        const v = b.voice_intensity ?? 0;
        if (voice === 'low' && v > 3) return false;
        if (voice === 'medium' && (v < 4 || v > 6)) return false;
        if (voice === 'high' && v < 7) return false;
      }
      return true;
    });
  }, [books, series, wave, format, voice]);

  /**
   * Shelves in catalog order, each sorted by book number so the number printed
   * on the spine matches the order on the screen.
   */
  const shelves = useMemo(() => {
    const order: string[] = [];
    const bag = new Map<string, BookSummary[]>();
    for (const b of filtered) {
      if (!bag.has(b.series_slug)) {
        bag.set(b.series_slug, []);
        order.push(b.series_slug);
      }
      bag.get(b.series_slug)!.push(b);
    }
    return order.map((slug, i) => {
      const list = bag.get(slug)!.sort((a, b) => (a.book_number ?? 0) - (b.book_number ?? 0));
      return {
        slug,
        no: i + 1,
        name: list[0].series_name,
        color: list[0].series_color ?? '#C98B3E',
        books: list,
      };
    });
  }, [filtered]);

  /* A narrowed view is already a request to see everything in it. */
  const forceOpen = series !== 'all' || shelves.length === 1;
  const touched = series !== 'all' || wave !== 'all' || format !== 'all' || voice !== 'all';

  const reset = () => {
    setSeries('all');
    setWave('all');
    setFormat('all');
    setVoice('all');
  };

  return (
    <div>
      {/* ── SAY THE PROBLEM ──────────────────────────────────────────
        * The first thing on the page, before any filter, because the person
        * who needs these books least knows what to call what is wrong. They
        * do not know they want "Rumination"; they know their brain will not
        * shut off. The encyclopedia already holds 453 of those phrasings, so
        * this reads the sentence, names the thing, and puts the right shelf
        * underneath it. */}
      <div className="finder">
        <label className="finder-label" htmlFor="problem">
          What are you actually dealing with?
        </label>
        <div className="finder-box">
          <svg className="finder-icon" viewBox="0 0 24 24" aria-hidden>
            <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="1.7" />
            <path d="M16.5 16.5 21 21" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
          <input
            id="problem"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Say it the way you would say it out loud…"
            autoComplete="off"
            spellCheck={false}
          />
          {searching && (
            <button type="button" className="finder-clear" onClick={() => setQ('')} aria-label="Clear">
              ✕
            </button>
          )}
        </div>
        {!searching && (
          <div className="finder-chips">
            {STARTER_PROBLEMS.map((p) => (
              <button key={p} type="button" className="say-chip" onClick={() => setQ(p)}>
                {p}
              </button>
            ))}
          </div>
        )}
      </div>

      {searching && found ? (
        /* ── the answer ──────────────────────────────────────────── */
        <div className="finder-out">
          {found.concept ? (
            <div className="concept">
              <p className="concept-kicker">
                {found.matchedPhrase ? `“${found.matchedPhrase}” — that has a name` : 'That has a name'}
              </p>
              <h2 className="concept-term">
                {found.concept.term}
                {found.concept.also && <em> · also called {found.concept.also}</em>}
              </h2>
              <p className="concept-def">{found.concept.definition}</p>
              <p className="concept-do">
                <span>Do this today</span>
                {found.concept.action}
              </p>
              {found.alsoSee.length > 0 && (
                <p className="concept-also">
                  Might also be:{' '}
                  {found.alsoSee.map((e, i) => (
                    <button key={e.term} type="button" onClick={() => setQ(e.term)}>
                      {e.term}
                      {i < found.alsoSee.length - 1 ? ', ' : ''}
                    </button>
                  ))}
                </p>
              )}
              <a className="concept-link" href="/encyclopedia">
                All {TERM_COUNT} terms in the encyclopedia →
              </a>
            </div>
          ) : null}

          {found.books.length > 0 ? (
            <section className="shelf" style={{ ['--series' as string]: found.books[0].series_color ?? '#C98B3E' }}>
              <header className="shelf-head">
                <span className="shelf-no">→</span>
                <h2 className="shelf-name">
                  {found.books.length} book{found.books.length === 1 ? '' : 's'} for that
                </h2>
                <span className="shelf-count">Best match first</span>
              </header>
              <div className="shelf-grid">
                {found.books.map((b) => (
                  <BookTile key={b.slug} book={b} />
                ))}
              </div>
            </section>
          ) : (
            <p className="finder-none">
              Nothing matched those words yet. Try saying it plainer — “I can’t sleep”, “I keep
              quitting”, “I let people walk on me” — or clear the box and browse the shelves.
            </p>
          )}
        </div>
      ) : (
        <>
      {/* ── the controls, on one quiet line ─────────────────────────── */}
      <div className="cat-bar">
        <Select label="Series" value={series} onChange={setSeries}>
          <option value="all">All {seriesOptions.length} series</option>
          {[...seriesOptions]
            .sort((a, b) => a[1].localeCompare(b[1]))
            .map(([slug, name]) => (
              <option key={slug} value={slug}>
                {name}
              </option>
            ))}
        </Select>

        <Select label="Wave" value={wave} onChange={(v) => setWave(v as WaveFilter)}>
          <option value="all">All waves</option>
          <option value="1">I — Foundation</option>
          <option value="2">II — Pressure</option>
          <option value="3">III — Edge</option>
          <option value="4">IV — Apex</option>
        </Select>

        <Select label="Format" value={format} onChange={(v) => setFormat(v as FormatFilter)}>
          <option value="all">All formats</option>
          <option value="ebook">eBook</option>
          <option value="paperback">Paperback</option>
          <option value="hardcover">Hardcover</option>
          <option value="audiobook">Audiobook</option>
        </Select>

        <Select label="Intensity" value={voice} onChange={(v) => setVoice(v as VoiceFilter)}>
          <option value="all">Any intensity</option>
          <option value="low">Low</option>
          <option value="medium">Mid</option>
          <option value="high">High</option>
        </Select>

        <div className="cat-count">
          <span>
            {filtered.length.toLocaleString()} book{filtered.length === 1 ? '' : 's'}
          </span>
          {touched && (
            <button type="button" onClick={reset} className="cat-reset">
              Clear
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="border border-line bg-bg-subtle p-8 text-sm text-ink-dim">
          {empty.catalogNoMatch}
        </p>
      ) : (
        shelves.map((s) => {
          const open = forceOpen || opened[s.slug];
          const shown = open ? s.books : s.books.slice(0, PEEK);
          const rest = s.books.length - shown.length;

          return (
            <section
              key={s.slug}
              className="shelf"
              style={{ ['--series' as string]: s.color }}
              aria-label={s.name}
            >
              <header className="shelf-head">
                <span className="shelf-no">{String(s.no).padStart(2, '0')}</span>
                <h2 className="shelf-name">{s.name}</h2>
                <span className="shelf-count">
                  {s.books.length} book{s.books.length === 1 ? '' : 's'}
                </span>
              </header>

              <div className="shelf-grid">
                {shown.map((b) => (
                  <BookTile key={b.slug} book={b} />
                ))}
              </div>

              {rest > 0 && (
                <button
                  type="button"
                  className="shelf-more"
                  onClick={() => setOpened((o) => ({ ...o, [s.slug]: true }))}
                >
                  Show all {s.books.length} <span aria-hidden>↓</span>
                </button>
              )}
            </section>
          );
        })
      )}
        </>
      )}
    </div>
  );
}

function Select<T extends string>({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="cat-field">
      <span>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value as T)}>
        {children}
      </select>
    </label>
  );
}
