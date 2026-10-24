import Link from 'next/link';
import { ContactLine, LegalPage } from '@/components/legal/LegalPage';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Refunds and Delivery | Apex Flow Publishing House',
  description:
    'How ebooks, audiobooks and printed books are delivered, what happens if a file or print is wrong, and how bundles that include unreleased titles work.',
  path: '/refunds',
});

export default function RefundsPage() {
  return (
    <LegalPage title="Refunds and Delivery">
      <p>
        This is the policy for books bought directly on this site. It is shown here and next to the buy buttons so you can read it before you
        pay. It does not take away rights you have under the law where you live.
      </p>

      <h2>Ebooks and audiobooks (digital files)</h2>
      <p>
        Digital files are delivered by email or download link right after payment. Nothing ships. Because a downloaded file cannot be taken
        back, <strong>once you download or open a digital file the sale is final</strong>, except in the cases below.
      </p>
      <p>Within 14 days of purchase, tell us if any of these is true and we will make it right (fix it or replace it first; if we cannot, refund you):</p>
      <ol>
        <li>The file did not arrive (check spam first).</li>
        <li>You received the wrong title or format.</li>
        <li>The file is corrupted, will not open, or the audio is missing or unusable.</li>
        <li>The title was described as available and is not.</li>
      </ol>
      <p>
        If you have not downloaded or opened the file, you may also cancel for any reason within 14 days of purchase for a full refund.
        Customers in the EU, UK, Canada or anywhere with a statutory cooling-off period keep those statutory rights.
      </p>

      <h2>Audiobooks use synthetic narration</h2>
      <p>
        Audiobook narration is generated with AI voices (Amazon Polly neural voices) and supervised by the author. It is not a human
        narrator. Listen to the sample on a title&rsquo;s page before you buy. Narration style is not a defect.
      </p>

      <h2>Paperbacks and hardcovers (printed on demand)</h2>
      <p>
        Each copy is printed and shipped after you order, by our printer (Lulu). Because it is made to order, we cannot cancel or refund a
        print once printing has started, unless it is wrong. If your copy arrives damaged, misprinted, or not as ordered, or is lost in
        shipping, email us within 30 days of delivery (or of the date it should have arrived) with a photo and your order email, and we
        will reprint it or refund you. Tell us if the shipping address was entered wrongly as soon as you notice; we will try to correct it
        before it prints, but cannot promise to.
      </p>

      <h2>Bundles that include unreleased titles</h2>
      <p>
        The library is a program of titles released over time. Some bundles (for example &ldquo;The Twelve&rdquo; and &ldquo;The Full
        Arsenal&rdquo;) cover the whole planned program, including titles that are not published yet. You receive the titles that exist when
        you buy, and each remaining title is delivered by email when it releases. No release date is promised for any title that is not yet
        published. If you paid for titles you have not received and you no longer want to wait, email us and we will refund the portion
        that has not been delivered.
      </p>

      <h2>Free chapters and discount codes</h2>
      <p>
        Free chapters are free. A discount code reduces the price at checkout; it has no cash value and cannot be applied after an order is
        placed. We may stop accepting a code that is being misused.
      </p>

      <h2>Founder Edition</h2>
      <p>
        Submitting a Founder Edition application does not charge you and is not a purchase. Before you pay anything, you will be sent the
        written terms for that offer (what is included, what ships and when, and your refund rights) to accept. If you do not accept them,
        you owe nothing.
      </p>

      <h2>How to ask</h2>
      <p>
        Email us with your order email and what went wrong. We reply within a few business days. Approved refunds go back to the original payment method through Stripe and usually
        show up in 5 to 10 business days. See also <Link href="/terms">Terms of Use</Link>.
      </p>
      <ContactLine />
    </LegalPage>
  );
}
