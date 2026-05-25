'use client';

import { useMemo, useState } from 'react';
import { Headphones } from 'lucide-react';
import { AudioPlayer } from './AudioPlayer';
import { pickPeer } from '@/lib/preview-session';
import { audioPreviewUrl, podcastPreviewUrl, type PreviewPoolItem } from '@/lib/preview-pool';

interface PreviewAudioProps {
  // Where to point the "Buy" CTA if the preview ends. Anchors to the
  // book's own #buy block — buyer pays for THIS book's audiobook, not
  // the borrowed peer's.
  buyHref: string;
  buyLabel: string; // e.g. "Buy the audiobook — $12.99"
  // The book's own slug — used to exclude itself from peer rotation.
  ownSlug: string;
  // True when this book has its own real audio in R2. Drives whether
  // we play THIS book's file or borrow a peer's.
  isAuthentic: boolean;
  // Own audio URL — used when isAuthentic (regardless of alwaysCap).
  ownAudioUrl?: string;
  // The pool to draw from when not authentic. Empty pool = no preview.
  pool: PreviewPoolItem[];
  // 'audiobook' → /audiobook.mp3 URL; 'podcast' → /podcast/episode.mp3.
  // Tells the peer-URL builder which path to use.
  kind: 'audiobook' | 'podcast';
  // Force the 30-sec preview cap + badge + Buy CTA even when the book
  // is authentic. Used for the audiobook section (paid product —
  // never give the full file away). Default false → authentic books
  // play full audio (used for the podcast section, which is the free
  // marketing companion).
  alwaysCap?: boolean;
  title: string;
  description?: string;
}

export function PreviewAudio({
  buyHref,
  buyLabel,
  ownSlug,
  isAuthentic,
  ownAudioUrl,
  pool,
  kind,
  alwaysCap = false,
  title,
  description,
}: PreviewAudioProps) {
  // Pick a peer ONCE per mount. Only needed when we don't have own
  // audio (i.e. non-authentic books).
  const [peer] = useState<PreviewPoolItem | null>(() =>
    isAuthentic ? null : pickPeer(pool, kind === 'audiobook' ? 'audio' : 'podcast', ownSlug),
  );

  const src = useMemo(() => {
    if (isAuthentic) return ownAudioUrl ?? '';
    if (!peer) return '';
    return kind === 'audiobook' ? audioPreviewUrl(peer.bookId) : podcastPreviewUrl(peer.bookId);
  }, [isAuthentic, ownAudioUrl, peer, kind]);

  if (!src) {
    // Authentic but no URL OR non-authentic but pool empty. Render a
    // small placeholder so the section header doesn't dangle.
    return (
      <div className="border border-line bg-bg-subtle p-4 text-sm text-ink-mute">
        <Headphones className="mr-2 inline h-4 w-4" aria-hidden />
        {isAuthentic
          ? 'Audio is queueing — back online shortly.'
          : 'Preview not available right now.'}
      </div>
    );
  }

  // Free + uncapped path: authentic book AND caller didn't force a cap.
  // The podcast section uses this since the podcast is the free promo.
  if (isAuthentic && !alwaysCap) {
    return <AudioPlayer src={src} title={title} description={description} variant="full" />;
  }

  // Capped path: 30-sec preview with badge + Buy CTA. Source is
  // either the book's own file (authentic + alwaysCap) or a peer's
  // (non-authentic).
  const usingPeer = !isAuthentic && peer;
  return (
    <div className="space-y-2">
      <div className="inline-flex items-center gap-2 border border-accent/40 bg-bg-subtle px-3 py-1 text-[11px] uppercase tracking-widest text-accent">
        <Headphones className="h-3 w-3" aria-hidden />
        <span>30-second preview</span>
      </div>
      <AudioPlayer
        src={src}
        title={title}
        description={description}
        variant="full"
        previewMaxSeconds={30}
        previewCta={{ href: buyHref, label: buyLabel }}
      />
      {usingPeer ? (
        <p className="text-[11px] text-ink-mute">
          Sampling from <span className="text-ink-dim">{peer?.title}</span>. Buy this
          book&rsquo;s audiobook to hear it in full.
        </p>
      ) : (
        <p className="text-[11px] text-ink-mute">
          First 30 seconds. Buy the audiobook to hear it in full.
        </p>
      )}
    </div>
  );
}
