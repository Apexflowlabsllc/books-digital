import { redirect } from 'next/navigation';
import Link from 'next/link';
import { PageShell } from '@/components/PageShell';
import { SignOutButton } from '@/components/auth/SignOutButton';
import { createClient } from '@/lib/supabase/server';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Your account — Apex Flow Publishing House',
  description: 'Your Apex account — library, orders, audio, settings.',
  path: '/account',
});

export const dynamic = 'force-dynamic';

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // middleware.ts also gates this, but keep the redirect as a defense in
  // depth in case the matcher ever drifts.
  if (!user) {
    redirect('/sign-in?next=/account');
  }

  const joinedAt = user.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <PageShell>
      <section className="container-x py-16 md:py-20">
        <p className="eyebrow mb-3 text-accent">Your account</p>
        <h1 className="font-display text-4xl text-ink md:text-5xl">
          <span className="metallic-text">Hey,</span> {user.email}.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-[1.65] text-ink-dim md:text-base">
          This is your Apex account home. Your library, your orders, your audio. Right
          now it&rsquo;s mostly empty — the Pass + paywall ship next, after which your
          purchased books and audiobooks will show up here.
        </p>
      </section>

      <section className="container-x pb-20">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="border border-line bg-bg-subtle p-6">
            <p className="eyebrow mb-2">Library</p>
            <p className="font-display text-2xl text-ink">Coming with the Pass</p>
            <p className="mt-2 text-sm text-ink-dim">
              All 636 books + all audio once you have an active Insider Pass.
            </p>
            <Link href="/membership" className="cta-secondary mt-5 inline-flex">
              <span>See the Pass</span>
            </Link>
          </div>

          <div className="border border-line bg-bg-subtle p-6">
            <p className="eyebrow mb-2">Orders</p>
            <p className="font-display text-2xl text-ink">No orders yet</p>
            <p className="mt-2 text-sm text-ink-dim">
              Paperback, hardcover, and bundle orders will appear here once Stripe goes
              live.
            </p>
            <Link href="/books" className="cta-secondary mt-5 inline-flex">
              <span>Browse the catalog</span>
            </Link>
          </div>

          <div className="border border-line bg-bg-subtle p-6">
            <p className="eyebrow mb-2">Account</p>
            <p className="font-display text-2xl text-ink">{user.email}</p>
            {joinedAt ? (
              <p className="mt-2 text-sm text-ink-dim">Joined {joinedAt}</p>
            ) : null}
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/forgot-password" className="cta-secondary">
                <span>Change password</span>
              </Link>
              <SignOutButton />
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
