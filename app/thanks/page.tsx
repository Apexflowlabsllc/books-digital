import Link from 'next/link';
import { PageShell } from '@/components/PageShell';
import { Confetti } from '@/components/Confetti';
import { buildMetadata } from '@/lib/seo';
import { backendSafe } from '@/lib/api';

export const metadata = {
  ...buildMetadata({
    title: 'Thanks — you ordered.',
    description: 'Your order is in. Files land in your inbox within 2 minutes.',
    path: '/thanks',
  }),
  robots: { index: false, follow: false },
};

// Stripe redirects with ?session_id={CHECKOUT_SESSION_ID}. Keep the
// legacy ?session= param around in case anything still emits it.
interface ThanksProps {
  searchParams: Promise<{ session_id?: string; session?: string; product?: string }>;
}

// Shape the backend will return on GET /api/v1/orders/<sessionId>.
// Cosmetic only — webhook + Resend already handle delivery before the
// user lands here. Tolerated as null if the backend route 404s.
// Physical orders also include shipping data so we can render
// "ships to <name> in <city>".
interface OrderResponse {
  bookTitle?: string;
  bookSlug?: string;
  formats?: Array<'ebook' | 'audiobook' | 'bundle' | 'paperback' | 'hardcover' | string>;
  shipping?: {
    name?: string;
    city?: string;
    country?: string;
    tracking_status?: string;
  };
}

function formatList(formats?: string[]): string {
  if (!formats || formats.length === 0) return 'order';
  const cleaned = formats.flatMap((f) => (f === 'bundle' ? ['ebook', 'audiobook'] : [f]));
  if (cleaned.length === 1) return cleaned[0]!;
  if (cleaned.length === 2) return `${cleaned[0]} + ${cleaned[1]}`;
  return cleaned.join(', ');
}

function isPhysical(formats?: string[]): boolean {
  return !!formats?.some((f) => f === 'paperback' || f === 'hardcover');
}

export default async function ThanksPage({ searchParams }: ThanksProps) {
  const sp = await searchParams;
  const sessionId = sp.session_id ?? sp.session;

  const order = sessionId
    ? await backendSafe<OrderResponse>(`/api/v1/orders/${sessionId}`, { revalidate: 0 })
    : null;

  const title = order?.bookTitle;
  const formats = formatList(order?.formats);
  const physical = isPhysical(order?.formats);
  const ship = order?.shipping;

  return (
    <PageShell>
      <Confetti />
      <section className="container-x flex min-h-[60vh] flex-col items-start justify-center py-24">
        <p className="eyebrow mb-3">Order confirmed</p>
        <h1 className="font-display text-5xl text-ink md:text-7xl">
          <span className="metallic-text">Shipped.</span>
        </h1>

        <p className="mt-6 max-w-2xl text-ink-dim md:text-lg">
          {title ? (
            <>
              Thanks — your <span className="text-ink">{title}</span>{' '}
              <span className="text-ink">{formats}</span> is on its way to your inbox right
              now.
            </>
          ) : (
            <>
              Thanks — your order is on its way to your inbox right now.
            </>
          )}{' '}
          If it&rsquo;s not there in 2 minutes, check spam or hit reply.
        </p>

        {physical ? (
          <div className="mt-6 border border-line bg-bg-subtle p-5 text-sm md:text-base">
            <p className="eyebrow mb-2 text-accent">Shipping</p>
            <p className="text-ink">
              {ship?.name && ship?.city ? (
                <>
                  Ships to <span className="text-ink">{ship.name}</span> in{' '}
                  <span className="text-ink">{ship.city}</span>
                  {ship.country ? `, ${ship.country}` : ''}.
                </>
              ) : (
                <>Your signed copy is going to print.</>
              )}{' '}
              Brian signs each one before it goes out — printed and shipped by Lulu xPress.
              Tracking lands in your inbox once it ships (usually 5-7 days).
            </p>
            {ship?.tracking_status ? (
              <p className="mt-2 text-ink-dim">Status: {ship.tracking_status}</p>
            ) : null}
          </div>
        ) : null}

        {sessionId ? (
          <p className="mt-4 font-mono text-[11px] text-ink-mute">Order ref: {sessionId}</p>
        ) : null}

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          {order?.bookSlug ? (
            <Link href={`/books/${order.bookSlug}`} className="cta-secondary">
              Back to {title ?? 'the book'}
            </Link>
          ) : null}
          <Link href="/books" className="cta-primary">
            Browse more books
          </Link>
          <Link href="/contact" className="cta-secondary">
            Order question? Email support
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
