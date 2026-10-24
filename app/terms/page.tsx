import Link from 'next/link';
import { ContactLine, LegalPage } from '@/components/legal/LegalPage';
import { BUSINESS } from '@/lib/legal';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Terms of Use | Apex Flow Publishing House',
  description:
    'Terms for using Apex Flow Publishing House: what the books are and are not, purchases, accounts, reviews, the AI concierge, intellectual property and limits of liability.',
  path: '/terms',
});

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Use">
      <p>
        By using books.apexflowlabs.com you agree to these terms. If you do not agree, please do not use the site. The site is operated by{' '}
        {BUSINESS.legalName}, {BUSINESS.location}. You must be 18 or older to create an account, post a review or buy.
      </p>

      <h2>What the books are</h2>
      <p>
        The books, audiobooks, blog posts, encyclopedia entries and tools here are self-help education and entertainment from the author&rsquo;s
        experience. They are not therapy, medical care, legal advice, financial advice or professional advice of any kind, and nothing here
        guarantees a result. Read <Link href="/disclaimer">Not therapy or advice</Link> before relying on anything. If you are in crisis, call or
        text 988 (US) or your local emergency number.
      </p>

      <h2>Buying</h2>
      <ul>
        <li>
          Prices are in US dollars. The price and any shipping or tax shown on the Stripe checkout page before you pay is what you are charged.
        </li>
        <li>
          Ebooks and audiobooks are digital files delivered by email or download. Paperbacks and hardcovers are printed on demand and shipped by
          our printer. See <Link href="/refunds">Refunds and delivery</Link> for what happens if something goes wrong.
        </li>
        <li>
          Some bundles include titles that are not published yet. Those titles are delivered as they release. The bundle page and the Refunds
          page say so before you pay.
        </li>
        <li>
          The Founder Edition is application-only. Applying does not charge you and is not a purchase. See the Founder Edition page for details.
        </li>
      </ul>

      <h2>Your licence to the books</h2>
      <p>
        When you buy a title you get a personal, non-transferable licence to read or listen to your copy. Do not copy, resell, share, upload,
        scrape, or use the content to train AI models. Short quotations with credit and a link are fine.
      </p>

      <h2>Accounts and reviews</h2>
      <p>
        Keep your password private; you are responsible for activity on your account. Reviews must be honest, from your own experience, and
        lawful. We moderate reviews and may decline or remove any that are abusive, unlawful, off-topic, or posted by someone who has a financial
        connection to the author without saying so. We do not pay for or require positive reviews. See the{' '}
        <Link href="/editorial-policy">Editorial policy</Link>. By submitting a review you give us a non-exclusive licence to display it on this
        site and in our marketing.
      </p>

      <h2>The Books Concierge (AI)</h2>
      <p>
        The Books Concierge is an automated AI assistant, not Brian and not a person. It can be wrong. It recommends books and answers
        questions about this site; it is not a counselor or advisor. Do not rely on it for medical, mental-health, legal or financial decisions.
      </p>

      <h2>Intellectual property</h2>
      <p>
        Text, design, graphics, audio, video and code on this site belong to {BUSINESS.legalName} or its licensors. Audiobook narration is
        synthetic (AI-generated, supervised by the author). Third-party names and marks belong to their owners. To report infringement see{' '}
        <Link href="/report-content">Copyright and takedown</Link>.
      </p>

      <h2>Acceptable use</h2>
      <p>
        Do not interfere with the site, attempt unauthorized access, overload it with automated requests, use it unlawfully, or abuse the free
        chapter, discount or review offers.
      </p>

      <h2>Links and third parties</h2>
      <p>We are not responsible for the content or practices of other sites we link to, or for the services of Stripe, Lulu, OpenAI or other providers.</p>

      <h2>Disclaimer and limits of liability</h2>
      <p>
        The site is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without warranties of any kind, to the extent allowed by law. To
        the extent allowed by law, {BUSINESS.legalName} is not liable for indirect, incidental, special or consequential damages, or for lost
        profits or data, and our total liability for any claim relating to the site or a purchase is limited to the amount you paid us for that
        purchase in the 12 months before the claim. Some places do not allow these limits, so they may not apply to you. Nothing here limits
        liability that cannot be limited by law, or your statutory consumer rights.
      </p>

      <h2>Governing law</h2>
      <p>
        These terms are governed by the laws of California, without regard to conflict-of-law rules. Courts in California have jurisdiction,
        except where your local consumer law says otherwise.
      </p>

      <h2>Changes and contact</h2>
      <p>We may update these terms; the date above shows the latest version. Continued use means you accept the update.</p>
      <ContactLine />
    </LegalPage>
  );
}
