import { Suspense } from 'react';
import { PageShell } from '@/components/PageShell';
import { SignInForm } from '@/components/auth/SignInForm';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Sign in — Apex Flow Publishing House',
  description:
    'Sign in once. Recognized on every Apex brand subdomain — books, digital, the parent site, all of them.',
  path: '/sign-in',
});

export default function SignInPage() {
  return (
    <PageShell>
      <section className="container-x grid gap-12 py-16 md:grid-cols-[2fr_3fr] md:py-24">
        <div className="md:max-w-md">
          <p className="eyebrow mb-3 text-accent">Sign in</p>
          <h1 className="font-display text-4xl text-ink md:text-5xl">
            <span className="metallic-text">One door.</span> Every Apex storefront.
          </h1>
          <p className="mt-5 text-sm leading-[1.65] text-ink-dim md:text-base">
            Sign in here once. The session works on every Apex brand subdomain — books,
            digital, apparel, the parent site, all of them. No second account to keep
            track of.
          </p>
        </div>

        <div className="border border-line bg-bg-subtle p-6 md:p-8">
          <Suspense fallback={null}>
            <SignInForm />
          </Suspense>
        </div>
      </section>
    </PageShell>
  );
}
