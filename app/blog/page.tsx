import Link from 'next/link';
import { PageShell } from '@/components/PageShell';
import { JsonLdSchema } from '@/components/JsonLdSchema';
import { GuideSearch } from '@/components/GuideSearch';
import { buildMetadata, collectionPageSchema } from '@/lib/seo';
import { getCatalog } from '@/lib/api';
import { BLOG_POSTS } from '@/lib/blog';

export const metadata = buildMetadata({
  title: 'The Apex Flow Blog — Apex Flow Publishing House',
  description:
    'Long-form pieces on the real patterns behind the books — why they happen, and what actually breaks them.',
  path: '/blog',
});

export const revalidate = 3600;

/**
 * Deliberately short, same law as /problems: a post exists because a real
 * encyclopedia entry (built from actual book content) had enough underneath
 * it to carry a full article, not because a content calendar needed filling.
 */
export default async function BlogIndex() {
  const catalog = await getCatalog();
  const books = catalog?.books ?? [];
  const collection = collectionPageSchema({
    path: '/blog',
    name: 'The Apex Flow Blog',
    description: 'Long-form pieces on the real patterns the catalog is written to break.',
    items: BLOG_POSTS.map((p) => ({ url: `/blog/${p.slug}`, name: p.title })),
  });

  return (
    <PageShell>
      <JsonLdSchema bundle={null} fallback={collection} />

      <section className="container-x pb-4 pt-16 sm:pt-20">
        <p className="font-mono text-[10px] uppercase tracking-[0.36em] text-accent/75">The Blog</p>
        <h1 className="mt-5 font-display text-[clamp(34px,5.4vw,64px)] font-light leading-[1.02] tracking-[-0.03em] text-ink">
          The pattern, walked through properly.
        </h1>
        <p className="mt-5 max-w-[58ch] text-[15px] leading-relaxed text-ink-dim">
          Each piece starts from a real entry in the encyclopedia and takes the room a full article
          gives to actually explain why the pattern happens, not just name it.
        </p>
      </section>

      <section className="container-x pb-12 pt-8">
        <GuideSearch books={books} />
      </section>

      <section className="container-x pb-24 pt-4">
        <ul className="grid gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-2">
          {BLOG_POSTS.map((p) => (
            <li key={p.slug} className="bg-bg">
              <Link href={`/blog/${p.slug}`} className="block p-7 transition-colors hover:bg-bg-subtle">
                <span className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-accent">
                  {p.term}
                </span>
                <span className="mt-3 block font-display text-[16px] italic font-light leading-snug text-ink-dim">
                  &ldquo;{p.shockOpen}&rdquo;
                </span>
                <span className="mt-4 block font-display text-[21px] font-light leading-snug text-ink">
                  {p.title}
                </span>
                <span className="mt-3 block text-[13px] leading-relaxed text-ink-dim">{p.dek}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </PageShell>
  );
}
