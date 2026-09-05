import { PageShell } from '@/components/PageShell';
import { SignUpForm } from '@/components/auth/SignUpForm';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Create an account — Apex Flow Publishing House',
  description:
    'Create your Apex account. One sign-in covers every brand — books, digital, apparel, the lot.',
  path: '/sign-up',
});

export default function SignUpPage() {
  return (
    <PageShell>
      <section className="container-x grid gap-12 py-16 md:grid-cols-[2fr_3fr] md:py-24">
        <div className="md:max-w-md">
          <p className="eyebrow mb-3 text-accent">Create account</p>
          <h1 className="font-display text-4xl text-ink md:text-5xl">
            <span className="metallic-text">Pick a password.</span> Get the empire.
          </h1>
          <p className="mt-5 text-sm leading-[1.65] text-ink-dim md:text-base">
            One account. Every Apex brand. Track your books, your orders, your audio. The
            session moves with you across every subdomain — sign in here, recognized at
            apexflowlabs.com, digital.apexflowlabs.com, all of them.
          </p>
        </div>

        <div className="border border-line bg-bg-subtle p-6 md:p-8">
          <SignUpForm />
        </div>
      </section>
    </PageShell>
  );
}
