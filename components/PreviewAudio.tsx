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
  // When the book IS authentic, we play its own audio at full length.
  // When false, we pick a random peer from the pool and cap at 30s.
  isAuthentic: boolean;
  // Own audio URL — used only when isAuthentic. Authentic books skip
  // the pool entirely.
  ownAudioUrl?: string;
  // The pool to draw from when not authentic. Empty pool = no preview.
  pool: PreviewPoolItem[];
  // 'audiobook' → /audiobook.mp3 URL; 'podcast' → /podcast/episode.mp3.
  // Tells the peer-URL builder which path to use.
  kind: 'audiobook' | 'podcast';
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
  title,
  description,
}: PreviewAudioProps) {
  // Pick a peer ONCE per mount. useMemo with [] deps would do it; but
  // we want it stable across renders, so cache in state.
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

  if (isAuthentic) {
    // Authentic: full audio, no cap, no badge.
    return <AudioPlayer src={src} title={title} description={description} variant="full" />;
  }

  // Non-authentic: 30-sec cap, preview badge, Buy CTA on cap.
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
      <p className="text-[11px] text-ink-mute">
        Sampling from <span className="text-ink-dim">{peer?.title}</span>. Buy this
        book&rsquo;s audiobook to hear it in full.
      </p>
    </div>
  );
}
