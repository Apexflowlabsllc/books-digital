import type { BookDetail } from '@/lib/types';

/**
 * THE BACK COVER, ON THE PAGE.
 *
 * The catalog carries each book's real back-cover copy — headline, subhead,
 * body, bullets, callout — and nothing on the book page rendered it. The page
 * was a short description and a sample, which is why Google crawled it and
 * declined to index it. Every word here comes from the book's own record;
 * nothing is written per book by hand and a field that is missing is simply
 * not shown.
 */
export function BookBackCover({ book }: { book: BookDetail }) {
  const bc = book.back_cover;
  if (!bc) return null;

  const headline = typeof bc.headline === 'string' ? bc.headline.trim() : '';
  const subhead = typeof bc.subhead === 'string' ? bc.subhead.trim() : '';
  const body = typeof bc.body === 'string' ? bc.body.trim() : '';
  const bullets = (Array.isArray(bc.bullets) ? bc.bullets : []).filter(
    (b) => b && typeof b.title === 'string' && b.title.trim(),
  );
  const callout = (Array.isArray(bc.callout) ? bc.callout : []).filter(
    (c) => typeof c === 'string' && c.trim(),
  );

  if (!headline && !subhead && !body && bullets.length === 0 && callout.length === 0) return null;

  const paragraphs = body.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

  return (
    <section className="container-x py-12" aria-labelledby="book-back-cover">
      <div className="border-t border-line pt-10">
        <h2 id="book-back-cover" className="eyebrow mb-6">
          From the back cover
        </h2>

        {headline && (
          <p className="max-w-[28ch] font-display text-3xl font-light leading-tight text-ink sm:text-4xl">
            {headline}
          </p>
        )}
        {subhead && (
          <p className="mt-4 max-w-[62ch] text-[17px] leading-relaxed text-ink-dim">{subhead}</p>
        )}

        {paragraphs.length > 0 && (
          <div className="mt-6 max-w-[62ch] space-y-4 text-[15px] leading-relaxed text-ink-dim">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        )}

        {bullets.length > 0 && (
          <ul className="mt-8 grid gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-2">
            {bullets.map((b, i) => (
              <li key={`${b.title}-${i}`} className="bg-bg p-6">
                <h3 className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
                  {b.title}
                </h3>
                {b.body && (
                  <p className="mt-3 text-[14px] leading-relaxed text-ink-dim">{b.body}</p>
                )}
              </li>
            ))}
          </ul>
        )}

        {callout.length > 0 && (
          <blockquote className="mt-8 max-w-[62ch] border-l-2 border-accent pl-5 text-[15px] italic leading-relaxed text-ink">
            {callout.map((c, i) => (
              <p key={i} className={i > 0 ? 'mt-2' : undefined}>
                {c}
              </p>
            ))}
          </blockquote>
        )}
      </div>
    </section>
  );
}
