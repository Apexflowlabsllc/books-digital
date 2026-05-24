import Image from 'next/image';
import { imageProxy, cn } from '@/lib/utils';

interface CoverProps {
  r2Key: string | undefined;
  alt: string;
  priority?: boolean;
  className?: string;
  sizes?: string;
  tilt?: boolean;
}

// Renders a book cover via the backend image proxy. Designer-produced PSDs
// only — frontend never code-generates covers (Master §1.10).
export function Cover({ r2Key, alt, priority, className, sizes, tilt }: CoverProps) {
  const src = imageProxy(r2Key);

  if (!src) {
    return (
      <div
        className={cn(
          'relative aspect-[2/3] w-full overflow-hidden border border-line bg-bg-raised',
          tilt && 'tilt-card',
          className,
        )}
        role="img"
        aria-label={`${alt} cover pending`}
      >
        <div
          aria-hidden
          className="flex h-full w-full items-center justify-center"
          style={{
            background:
              'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 50%, #1a1a1a 100%)',
          }}
        >
          <span className="font-display text-5xl text-accent/70" aria-hidden>
            ▲
          </span>
        </div>
        <span className="absolute bottom-3 left-3 text-[10px] uppercase tracking-widest text-ink-mute">
          Cover pending
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative aspect-[2/3] w-full overflow-hidden rounded-md',
        tilt && 'tilt-card',
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes ?? '(min-width: 1024px) 22rem, (min-width: 640px) 33vw, 50vw'}
        priority={priority}
        className="object-cover"
      />
    </div>
  );
}
