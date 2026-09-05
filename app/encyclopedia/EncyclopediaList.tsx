'use client';

/**
 * The searchable encyclopedia body.
 *
 * Client component only because of the filter — the entries themselves are
 * rendered from the server-imported array, so the full text is in the initial
 * HTML and a crawler sees every definition without running any JavaScript.
 * That matters more here than anywhere else on the site: this page exists to
 * be read by machines that do not execute scripts.
 */

import { useMemo, useState } from 'react';
import { ENCYCLOPEDIA, PHRASE_COUNT, TERM_COUNT } from '@/lib/encyclopedia';

export function EncyclopediaList() {
  const [q, setQ] = useState('');

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return ENCYCLOPEDIA;
    return ENCYCLOPEDIA.filter((e) =>
      // search the street language too, so "overthinking" finds Rumination
      // even though that word appears nowhere in its definition
      `${e.term} ${e.also ?? ''} ${e.definition} ${e.action} ${e.saidAs.join(' ')}`
        .toLowerCase()
        .includes(needle),
    );
  }, [q]);

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center gap-4">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search — try boundary, dopamine, overthinking"
          aria-label="Search the encyclopedia"
          className="w-full max-w-md rounded border border-line bg-black/30 px-4 py-3 font-mono text-sm text-fg placeholder:text-fg-muted focus:border-accent focus:outline-none"
        />
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-muted">
          {shown.length} of {TERM_COUNT} terms · {PHRASE_COUNT} ways people say them
        </span>
      </div>

      {shown.length === 0 ? (
        <p className="py-10 text-fg-muted">
          Nothing matches that yet. The encyclopedia grows with the catalog.
        </p>
      ) : (
        <dl className="border-t border-line">
          {shown.map((e) => (
            <div
              key={e.term}
              className="grid gap-3 border-b border-line py-7 md:grid-cols-[minmax(0,22ch)_minmax(0,1fr)] md:gap-10"
            >
              <dt>
                <span className="font-display text-xl text-fg">{e.term}</span>
                {e.also && (
                  <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.14em] text-accent/70">
                    also: {e.also}
                  </span>
                )}
              </dt>
              <dd className="m-0">
                <p className="max-w-[66ch] text-[15px] leading-relaxed text-fg-muted">
                  {e.definition}
                </p>
                <p className="mt-3 font-mono text-[13px] leading-relaxed text-accent">{e.action}</p>

                <div className="mt-4">
                  <span className="mb-2 block font-mono text-[9.5px] uppercase tracking-[0.2em] text-fg-muted">
                    People actually say
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {e.saidAs.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setQ(p)}
                        className="rounded-full border border-accent/25 bg-accent/5 px-3 py-1.5 text-[13px] text-fg-muted transition hover:-translate-y-0.5 hover:border-accent hover:bg-accent/15 hover:text-fg"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
