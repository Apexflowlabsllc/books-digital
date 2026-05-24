'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  title: string;
  className?: string;
}

/* Self-hiding video player. Tries to load metadata on mount; if the
 * backend's MP4 isn't ready yet (403 / 404 / network error), the player
 * unmounts itself instead of rendering a broken UI. Once the file lands
 * in R2 a refresh will reveal the player automatically.
 */
export function VideoPlayer({ src, poster, title, className }: VideoPlayerProps) {
  const [errored, setErrored] = useState(false);

  if (errored) return null;

  return (
    <div
      className={cn(
        'overflow-hidden border border-line bg-black',
        className,
      )}
    >
      <video
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
  );
}
