import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageShell } from '@/components/PageShell';
import { JsonLdSchema } from '@/components/JsonLdSchema';
import { BookTile } from '@/components/BookTile';
import { buildMetadata } from '@/lib/seo';
import { env } from '@/lib/env';
import { getCatalog } from '@/lib/api';
import { BLOG_POSTS, findPost, postSource } from '@/lib/blog';
import { matchProblem } from '@/lib/problemMatch';

export const revalidate = 3600;

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = findPost(slug);
  if (!p) return buildMetadata({ title: 'Not found', description: '', path: `/blog/${slug}` });
  return buildMetadata({ title: `${p.title} — Apex Flow Blog`, description: p.dek, path: `/blog/${slug}` });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = findPost(slug);
  if (!post) notFound();

  const entry = postSource(post);
  const catalog = await getCatalog();
  const books = catalog?.books ?? [];
  const match = matchProblem(`${entry.term} ${entry.saidAs.slice(0, 3).join(' ')}`, books);
  const picks = match.books.slice(0, 6);
  const url = `${env.siteUrl}/blog/${post.slug}`;

  const article = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${url}#article`,
    headline: post.title,
    description: post.dek,
    datePublished: post.publishedAt,
    author: { '@type': 'Person', name: 'Brian Spiker' },
    publisher: { '@type': 'Organization', name: 'Apex Publishing House' },
    mainEntityOfPage: url,
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: env.siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${env.siteUrl}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: url },
    ],
  };

  return (
    <PageShell>
      <JsonLdSchema bundle={null} fallback={[article, breadcrumb]} />

      <nav aria-label="Breadcrumb" className="container-x pt-8">
        <ol className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-ink-mute">
          <li>
            <Link href="/blog" className="hover:text-ink">
              Blog
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-ink">{post.term}</li>
        </ol>
      </nav>

      <article className="container-x pb-4 pt-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.36em] text-accent/75">{post.term}</p>

        {/* The raw, first-person line — read before the title, the way it's
         *  actually said out loud before anyone's explained anything. */}
        <p className="mt-5 max-w-[52ch] font-display text-[22px] italic font-light leading-snug text-ink-dim sm:text-[26px]">
          &ldquo;{post.shockOpen}&rdquo;
        </p>

        <h1 className="mt-6 max-w-[26ch] font-display text-[clamp(30px,4.6vw,52px)] font-light leading-[1.06] tracking-[-0.03em] text-ink">
          {post.title}
        </h1>
        <p className="mt-5 max-w-[58ch] text-[15px] leading-relaxed text-ink-dim">{post.dek}</p>

        <div className="mt-10 max-w-[62ch] space-y-6">
          {post.body.map((para, i) => (
            <p
              key={i}
              className={
                i === 0
                  ? 'font-display text-[19px] font-light leading-snug text-accent sm:text-[22px]'
                  : 'text-[16px] leading-relaxed text-ink'
              }
            >
              {para}
            </p>
          ))}
        </div>

        <div className="mt-10 max-w-[62ch] border-l-2 border-accent/60 pl-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
            What to do about it
          </p>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-dim">{entry.action}</p>
        </div>
      </article>

      {picks.length > 0 && (
        <section className="container-x py-12">
          <div className="border-t border-line pt-10">
            <h2 className="font-display text-2xl font-light text-ink sm:text-3xl">
              Books that work on this
            </h2>
            <div className="shelf-grid mt-8">
              {picks.map((b) => (
                <BookTile key={b.slug} book={b} />
              ))}
            </div>
          </div>
        </section>
      )}
    </PageShell>
  );
}
