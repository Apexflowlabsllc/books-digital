import Link from 'next/link';
import { ContactLine, LegalPage } from '@/components/legal/LegalPage';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Editorial Policy and Disclosures | Apex Flow Publishing House',
  description:
    'How reviews are handled (including the review discount), what we claim and what we do not, AI narration and AI tools, affiliate links, and how to ask for a correction.',
  path: '/editorial-policy',
});

export default function EditorialPolicyPage() {
  return (
    <LegalPage title="Editorial Policy and Disclosures">
      <h2>Who publishes this</h2>
      <p>
        Apex Flow Publishing House is the book store of Brian Spiker and Apex Flow Labs LLC. We sell the books on this site and profit from
        those sales. Pages on this site are our own marketing and information, not independent reviews.
      </p>

      <h2>Reviews</h2>
      <ul>
        <li>
          <strong>Review discount, disclosed.</strong> When you submit a review you may receive a discount code (currently 20% off a later
          order). The code is given for submitting a review, whether it is positive or negative, and is not conditioned on what you write.
        </li>
        <li>We do not write, buy or edit reviews to change their meaning, and we do not hide a review only because it is critical. We may decline reviews that are abusive, unlawful, off-topic, or from people with an undisclosed connection to the author.</li>
        <li>
          A review is labelled &ldquo;Verified reader&rdquo; only when our order system reports a verified purchase. Otherwise it is labelled as a
          reader review.
        </li>
        <li>
          Statements from customers of Brian&rsquo;s carpet and tile cleaning business are about that business, not about these books. They
          are labelled as such and are never counted in a book&rsquo;s rating.
        </li>
      </ul>

      <h2>What we claim</h2>
      <p>
        We try to state only what is true today. The library is a long program, and many titles are not published yet; we say which are
        available and which are coming. We do not claim bestseller status, awards, rankings or guaranteed results. Prices shown come from our
        catalog. If you find a claim you think is wrong, tell us and we will fix it.
      </p>

      <h2>AI and synthetic media</h2>
      <ul>
        <li>Audiobook narration and audio previews use AI voices (Amazon Polly neural voices), supervised by the author. They are not human narrators.</li>
        <li>The Books Concierge chat is an AI assistant, not a person. Its answers can be wrong.</li>
        <li>
          Apex Flow Labs uses AI tools in parts of its production workflow, such as drafting support, editing, artwork and video.
        </li>
      </ul>

      <h2>Affiliate links and sponsorship</h2>
      <p>
        This site does not currently contain affiliate links, sponsored content or paid placements. If we add a link that earns us a
        commission, or accept payment or free product for a mention, we will say so in plain words next to that link and mark it{' '}
        <code>rel=&quot;sponsored&quot;</code>. Links to other Apex Flow Labs businesses are links to our own companies.
      </p>

      <h2>Corrections</h2>
      <p>
        Email us the page address and what is wrong. We correct factual errors promptly. See also <Link href="/report-content">Copyright and
        takedown</Link> and <Link href="/disclaimer">Not therapy or advice</Link>.
      </p>
      <ContactLine />
    </LegalPage>
  );
}
