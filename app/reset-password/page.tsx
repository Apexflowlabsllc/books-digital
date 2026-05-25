import { PageShell } from '@/components/PageShell';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Set new password — Apex Publishing House',
  description: 'Pick a new password for your Apex account.',
  path: '/reset-password',
});

export default function ResetPasswordPage() {
  return (
    <PageShell>
      <section className="container-x grid gap-12 py-16 md:grid-cols-[2fr_3fr] md:py-24">
        <div className="md:max-w-md">
          <p className="eyebrow mb-3 text-accent">Set new password</p>
          <h1 className="font-display text-4xl text-ink md:text-5xl">
            <span className="metallic-text">Fresh password.</span> Same account.
          </h1>
          <p className="mt-5 text-sm leading-[1.65] text-ink-dim md:text-base">
            Eight characters or more. Pick something you&rsquo;ll remember this time.
          </p>
        </div>

        <div className="border border-line bg-bg-subtle p-6 md:p-8">
          <ResetPasswordForm />
        </div>
      </section>
    </PageShell>
  );
}
