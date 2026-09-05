import { PageShell } from '@/components/PageShell';
import { Hero } from '@/components/Hero';
import { JsonLdSchema } from '@/components/JsonLdSchema';
import { getPageSeo } from '@/lib/api';
import { buildMetadata, fallbackPageSchema } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Contact — Apex Flow Publishing House',
  description:
    'Reach Brian. Press, speaking, bulk orders, interview requests. Real inbox, real reply within 7 days.',
  path: '/contact',
});

export const revalidate = 3600;

export default async function ContactPage() {
  const seo = await getPageSeo('/contact');

  return (
    <PageShell>
      <JsonLdSchema bundle={seo} fallback={fallbackPageSchema('/contact', 'Contact')} />

      <Hero
        eyebrow="Contact"
        title={
          <>
            Real inbox.
            <br />
            <span className="metallic-text">Real reply within 7 days.</span>
          </>
        }
        body="Press, speaking, bulk orders, interview requests, partnership inbounds. Choose the right inbox below — picking the wrong one just slows the reply."
      />

      <section className="container-x py-16">
        <div className="grid gap-5 md:grid-cols-2">
          <Card
            label="Press + interviews"
            email="press@apexflowlabs.com"
            body="Podcasts, magazines, podcasts-of-podcasts. Brian replies personally — usually within 72 hours. Please include the angle and the audience size."
          />
          <Card
            label="Bulk orders / corporate gifts"
            email="orders@apexflowlabs.com"
            body="50+ copies. Custom hardcover wraps via Printful. Tell us the quantity, the deadline, and the shipping country."
          />
          <Card
            label="Founder Edition follow-ups"
            email="founder@apexflowlabs.com"
            body="Already applied at /founder-edition and need to amend or follow up? This inbox routes straight to Brian."
          />
          <Card
            label="Support / fulfillment"
            email="support@apexflowlabs.com"
            body="Missing audiobook download, broken Pass access, refund? Backend support team — usually replies within 24 hours."
          />
        </div>
      </section>
    </PageShell>
  );
}

function Card({ label, email, body }: { label: string; email: string; body: string }) {
  return (
    <div className="border border-line bg-bg-subtle p-6">
      <p className="eyebrow mb-2">{label}</p>
      <a
        href={`mailto:${email}`}
        className="font-display text-2xl text-ink underline decoration-line underline-offset-4 hover:text-accent"
      >
        {email}
      </a>
      <p className="mt-3 text-sm text-ink-dim">{body}</p>
    </div>
  );
}
