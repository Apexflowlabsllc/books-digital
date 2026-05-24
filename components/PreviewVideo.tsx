'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Film, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { pickPeer } from '@/lib/preview-session';
import { podcastVideoPreviewUrl, type PreviewPoolItem } from '@/lib/preview-pool';

interface PreviewVideoProps {
  ownSlug: string;
  isAuthentic: boolean;
  ownVideoUrl?: string;
  pool: PreviewPoolItem[];
  poster?: string;
  title: string;
  buyHref: string;
  buyLabel: string;
  className?: string;
}

export function PreviewVideo({
  ownSlug,
  isAuthentic,
  ownVideoUrl,
  pool,
  poster,
  title,
  buyHref,
  buyLabel,
  className,
}: PreviewVideoProps) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const [errored, setErrored] = useState(false);
  const [sampleEnded, setSampleEnded] = useState(false);

  const [peer] = useState<PreviewPoolItem | null>(() =>
    isAuthentic ? null : pickPeer(pool, 'video', ownSlug),
  );

  const src = useMemo(() => {
    if (isAuthentic) return ownVideoUrl ?? '';
    if (!peer) return '';
    return podcastVideoPreviewUrl(peer.bookId);
  }, [isAuthentic, ownVideoUrl, peer]);

  useEffect(() => {
    const el = ref.current;
    if (!el || isAuthentic) return;
    const onTime = () => {
      if (el.currentTime > 30) {
        el.pause();
        el.currentTime = 30;
        setSampleEnded(true);
      }
    };
    el.addEventListener('timeupdate', onTime);
    return () => el.removeEventListener('timeupdate', onTime);
  }, [isAuthentic]);

  if (errored || !src) return null;

  return (
    <div className={cn('space-y-3', className)}>
      {!isAuthentic ? (
        <div className="inline-flex items-center gap-2 border border-accent/40 bg-bg-subtle px-3 py-1 text-[11px] uppercase tracking-widest text-accent">
          <Film className="h-3 w-3" aria-hidden />
          <span>30-second preview</span>
        </div>
      ) : null}

      <div className="overflow-hidden border border-line bg-black">
        <video
          ref={ref}
          src={src}
          poster={poster}
          title={title}
          controls
          preload="metadata"
          playsInline
          onError={() => setErrored(true)}
          className="aspect-video w-full"
        />
      </div>

      {sampleEnded && !isAuthentic ? (
        <div className="flex items-start gap-3 border border-accent/40 bg-bg-subtle p-4 text-sm">
          <Lock className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
          <div className="flex-1">
            <p className="text-ink">
              Sample ends here. Buy this book&rsquo;s audiobook for the full episode +
              every chapter narrated.
            </p>
            <Link href={buyHref} className="cta-primary mt-3 inline-flex">
              <span>{buyLabel}</span>
            </Link>
          </div>
        </div>
      ) : null}

      {!isAuthentic && peer ? (
        <p className="text-[11px] text-ink-mute">
          Sampling from <span className="text-ink-dim">{peer.title}</span>.
        </p>
      ) : null}
    </div>
  );
}
