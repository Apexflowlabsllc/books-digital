'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Play, Pause, Volume2, Lock } from 'lucide-react';
import { cn, formatDurationFromSeconds } from '@/lib/utils';

interface AudioPlayerProps {
  src: string;
  title: string;
  description?: string;
  variant?: 'sample' | 'full';
  className?: string;
  // When set, the player auto-pauses at this position and refuses to
  // seek past it. Used to gate the paid audiobook to a free 30-sec
  // preview while still streaming the real MP3 (the backend will
  // eventually serve a true preview-only endpoint; this is the
  // browser-side cap until then).
  previewMaxSeconds?: number;
  // Required when previewMaxSeconds is set. Renders after the preview
  // ends; this is the "now go pay" path.
  previewCta?: { href: string; label: string };
}

export function AudioPlayer({
  src,
  title,
  description,
  variant = 'sample',
  className,
  previewMaxSeconds,
  previewCta,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [sampleEnded, setSampleEnded] = useState(false);

  // The effective ceiling for scrubbing/progress. Falls back to the
  // file's natural duration when no preview cap is set.
  const ceiling =
    previewMaxSeconds !== undefined
      ? Math.min(previewMaxSeconds, duration || previewMaxSeconds)
      : duration;

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onTime = () => {
      const t = el.currentTime;
      if (previewMaxSeconds !== undefined && t >= previewMaxSeconds) {
        // Cap. Pause + lock the position at the cap exactly.
        el.pause();
        el.currentTime = previewMaxSeconds;
        setPlaying(false);
        setPosition(previewMaxSeconds);
        setSampleEnded(true);
        return;
      }
      setPosition(t);
    };
    const onMeta = () => setDuration(el.duration || 0);
    const onEnd = () => setPlaying(false);
    el.addEventListener('timeupdate', onTime);
    el.addEventListener('loadedmetadata', onMeta);
    el.addEventListener('ended', onEnd);
    return () => {
      el.removeEventListener('timeupdate', onTime);
      el.removeEventListener('loadedmetadata', onMeta);
      el.removeEventListener('ended', onEnd);
    };
  }, [previewMaxSeconds]);

  function toggle() {
    const el = audioRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
      setPlaying(false);
      return;
    }
    // If the sample ended, rewind to 0 so the user can replay the 30s.
    if (sampleEnded) {
      el.currentTime = 0;
      setPosition(0);
      setSampleEnded(false);
    }
    void el.play();
    setPlaying(true);
  }

  function seek(e: React.ChangeEvent<HTMLInputElement>) {
    const el = audioRef.current;
    if (!el || ceiling <= 0) return;
    const next = (Number(e.target.value) / 100) * ceiling;
    el.currentTime = next;
    setPosition(next);
    if (previewMaxSeconds !== undefined && next < previewMaxSeconds) {
      setSampleEnded(false);
    }
  }

  const progress = ceiling > 0 ? (position / ceiling) * 100 : 0;

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div
        className={cn(
          'flex items-center gap-4 border border-line bg-bg-subtle p-4',
          variant === 'full' && 'bg-bg-raised',
        )}
        role="region"
        aria-label={title}
      >
        <audio ref={audioRef} src={src} preload="metadata" />

        <button
          type="button"
          onClick={toggle}
          className="flex h-12 w-12 shrink-0 items-center justify-center border border-accent text-accent transition-colors hover:bg-accent hover:text-bg"
          aria-label={playing ? 'Pause' : 'Play'}
        >
          {playing ? <Pause className="h-5 w-5" aria-hidden /> : <Play className="h-5 w-5" aria-hidden />}
        </button>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm text-ink">{title}</p>
          {description ? <p className="truncate text-xs text-ink-dim">{description}</p> : null}

          <div className="mt-2 flex items-center gap-3">
            <input
              type="range"
              min={0}
              max={100}
              step={0.1}
              value={progress}
              onChange={seek}
              aria-label="Seek"
              className="h-1 w-full appearance-none bg-line accent-accent"
            />
            <span className="font-mono text-[11px] text-ink-mute">
              {formatDurationFromSeconds(position)} / {formatDurationFromSeconds(ceiling)}
            </span>
          </div>
        </div>

        <Volume2 className="hidden h-4 w-4 shrink-0 text-ink-mute md:block" aria-hidden />
      </div>

      {sampleEnded && previewCta ? (
        <div className="flex items-start gap-3 border border-accent/40 bg-bg-subtle p-4 text-sm">
          <Lock className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
          <div className="flex-1">
            <p className="text-ink">
              Sample ends here. The full audiobook is roughly four hours — narrated, paced,
              one chapter per track.
            </p>
            <Link href={previewCta.href} className="cta-primary mt-3 inline-flex">
              <span>{previewCta.label}</span>
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
