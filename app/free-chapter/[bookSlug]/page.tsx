import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PageShell } from '@/components/PageShell';
import { Cover } from '@/components/Cover';
import { EmailGate } from '@/components/EmailGate';
import { JsonLdSchema } from '@/components/JsonLdSchema';
import { getBook, getPageSeo } from '@/lib/api';
import { buildMetadata, fallbackPageSchema } from '@/lib/seo';

interface FreeChapterProps {
  params: Promise<{ bookSlug: string }>;
  searchParams: Promise<{ utm_source?: string; utm_campaign?: string }>;
}

export async function generateMetadata({ params }: FreeChapterProps) {
  const { bookSlug } = await params;
  const book = await getBook(bookSlug);
  if (!book) return buildMetadata({ title: 'Free chapter', path: `/free-chapter/${bookSlug}` });
  return buildMetadata({
    title: `Free chapter — ${book.title}`,
    description: `Send me chapter one of ${book.title}. No upsell. No subscription. Just the file.`,
    path: `/free-chapter/${book.slug}`,
  });
}

export const revalidate = 3600;

// Per operating rule #5 — cold ads route HERE, never to "/".
export default async function FreeChapterPage({ params, searchParams }: FreeChapterProps) {
  const { bookSlug } = await params;
  const sp = await searchParams;
  const [book, seo] = await Promise.all([
    getBook(bookSlug),
    getPageSeo(`/free-chapter/${bookSlug}`),
  ]);

  if (!book) notFound();

  const utmSource = sp.utm_source ?? sp.utm_campaign ?? 'free-chapter-landing';

  return (
    <PageShell seriesColor={book.series_color}>
      <JsonLdSchema
        bundle={seo}
        fallback={fallbackPageSchema(`/free-chapter/${book.slug}`, `Free chapter — ${book.title}`)}
      />

      <section className="container-x grid gap-12 py-16 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:py-24">
        <div className="md:max-w-sm">
          <Cover
            r2Key={book.cover_r2_key}
            alt={book.cover_alt ?? `${book.title} — cover`}
            priority
            className="border border-line"
            sizes="(min-width: 768px) 24rem, 100vw"
          />
        </div>

        <div>
          <p className="eyebrow mb-4 text-series">{book.series_name}</p>
          <h1 className="font-display text-4xl leading-[1.05] text-ink md:text-6xl">
            Send me chapter one of {book.title}.
          </h1>
          <p className="mt-6 max-w-xl text-ink-dim md:text-lg">
            The first chapter is the whole pitch. About 400 words. Decide for yourself if it
            lands. We email the file and leave you alone — no drip, no upsell, no funnel
            roulette.
          </p>

          <div className="mt-8">
            <EmailGate
              bookId={book.book_id}
              bookSlug={book.slug}
              bookTitle={book.title}
              utmSource={utmSource}
            />
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            <Link
              href={`/books/${book.slug}`}
              className="border border-line bg-bg-subtle p-4 text-sm hover:border-accent transition-colors"
            >
              <p className="eyebrow">Or just buy</p>
              <p className="mt-1 text-ink">See pricing & formats →</p>
            </Link>
            <Link
              href={`/series/${book.series_slug}`}
              className="border border-line bg-bg-subtle p-4 text-sm hover:border-accent transition-colors"
            >
              <p className="eyebrow">Same series</p>
              <p className="mt-1 text-ink">52 more books in {book.series_name} →</p>
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
