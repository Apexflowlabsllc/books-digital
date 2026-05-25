import Link from 'next/link';
import { PageShell } from '@/components/PageShell';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Forgot password — Apex Publishing House',
  description: 'Reset your Apex account password.',
  path: '/forgot-password',
});

export default function ForgotPasswordPage() {
  return (
    <PageShell>
      <section className="container-x grid gap-12 py-16 md:grid-cols-[2fr_3fr] md:py-24">
        <div className="md:max-w-md">
          <p className="eyebrow mb-3 text-accent">Reset password</p>
          <h1 className="font-display text-4xl text-ink md:text-5xl">
            Forgot it. Happens.
          </h1>
          <p className="mt-5 text-sm leading-[1.65] text-ink-dim md:text-base">
            Drop your email. We&rsquo;ll send a link. Click it. Pick a new password. Move
            on with your day.
          </p>
          <p className="mt-6 text-sm text-ink-dim">
            Remembered it?{' '}
            <Link href="/sign-in" className="text-accent hover:text-ink">
              Sign in →
            </Link>
          </p>
        </div>

        <div className="border border-line bg-bg-subtle p-6 md:p-8">
          <ForgotPasswordForm />
        </div>
      </section>
    </PageShell>
  );
}
