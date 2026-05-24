'use client';

import { useMemo, useState } from 'react';
import type { BookSummary, Format } from '@/lib/types';
import { BookCard } from './BookCard';
import { cn, sortFormats } from '@/lib/utils';
import { empty } from '@/lib/voice';

interface CatalogFiltersProps {
  books: BookSummary[];
}

type WaveFilter = 'all' | '1' | '2' | '3' | '4';
type FormatFilter = 'all' | Format;
type VoiceFilter = 'all' | 'low' | 'medium' | 'high';

export function CatalogFilters({ books }: CatalogFiltersProps) {
  const [series, setSeries] = useState<string>('all');
  const [wave, setWave] = useState<WaveFilter>('all');
  const [format, setFormat] = useState<FormatFilter>('all');
  const [voice, setVoice] = useState<VoiceFilter>('all');

  const seriesOptions = useMemo(() => {
    const m = new Map<string, string>();
    for (const b of books) m.set(b.series_slug, b.series_name);
    return [...m.entries()].sort((a, b) => a[1].localeCompare(b[1]));
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

  return (
    <div>
      <div className="hairline mb-6 grid gap-3 pt-6 sm:grid-cols-2 lg:grid-cols-4">
        <Select label="Series" value={series} onChange={setSeries}>
          <option value="all">All 12 series</option>
          {seriesOptions.map(([slug, name]) => (
            <option key={slug} value={slug}>
              {name}
            </option>
          ))}
        </Select>

        <Select label="Wave" value={wave} onChange={(v) => setWave(v as WaveFilter)}>
          <option value="all">All waves</option>
          <option value="1">Wave I — Foundation</option>
          <option value="2">Wave II — Pressure</option>
          <option value="3">Wave III — Edge</option>
          <option value="4">Wave IV — Apex</option>
        </Select>

        <Select label="Format" value={format} onChange={(v) => setFormat(v as FormatFilter)}>
          <option value="all">All formats</option>
          <option value="ebook">eBook</option>
          <option value="paperback">Paperback</option>
          <option value="hardcover">Hardcover</option>
          <option value="audiobook">Audiobook</option>
        </Select>

        <Select label="Voice intensity" value={voice} onChange={(v) => setVoice(v as VoiceFilter)}>
          <option value="all">All intensities</option>
          <option value="low">Low (⚔ 1-3)</option>
          <option value="medium">Mid (⚔ 4-6)</option>
          <option value="high">High (⚔ 7-9)</option>
        </Select>
      </div>

      <p className="mb-6 text-xs uppercase tracking-widest text-ink-mute">
        {filtered.length} of {books.length} books
      </p>

      {filtered.length === 0 ? (
        <p className="border border-line bg-bg-subtle p-8 text-sm text-ink-dim">
          {empty.catalogNoMatch}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((b) => (
            <BookCard key={b.slug} book={b} />
          ))}
        </div>
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
    <label className="block">
      <span className="eyebrow mb-1.5 block">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className={cn(
          'w-full border border-line bg-bg px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none',
        )}
      >
        {children}
      </select>
    </label>
  );
}
