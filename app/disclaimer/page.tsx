import Link from 'next/link';
import { ContactLine, LegalPage } from '@/components/legal/LegalPage';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Not Therapy or Advice | Apex Flow Publishing House',
  description:
    'These books are self-help education and entertainment, not therapy, medical, legal or financial advice. What that means, and where to get urgent help.',
  path: '/disclaimer',
});

export default function DisclaimerPage() {
  return (
    <LegalPage title="Not Therapy or Advice">
      <p>
        The books, audiobooks, blog posts, problem and encyclopedia pages, the free-text &ldquo;Tell us what&rsquo;s going on&rdquo; search and
        the Books Concierge are self-help education and entertainment drawn from the author&rsquo;s own experience and reading. They are
        written in a blunt, R-rated voice on purpose.
      </p>

      <h2>What they are not</h2>
      <ul>
        <li>They are not therapy, counselling, or medical or psychiatric care, and they do not diagnose, treat or cure anything.</li>
        <li>They are not legal, financial, tax or investment advice.</li>
        <li>The author is a business owner and writer, not a licensed clinician, lawyer or financial adviser.</li>
        <li>Nothing here guarantees a result. Stories and examples are not typical results. Your outcome depends on you and your situation.</li>
      </ul>

      <h2>Topics that need a professional</h2>
      <p>
        Several books and pages touch on trauma, abusive relationships, addiction, grief, anxiety and the nervous system. If you are dealing
        with any of these, please use this material alongside, not instead of, a qualified professional. Do not stop or change any medication or
        treatment because of something you read or hear here.
      </p>

      <h2>If you are in crisis</h2>
      <p>
        If you may harm yourself or someone else, or you are in danger, call or text <strong>988</strong> (the US Suicide &amp; Crisis Lifeline),
        call <strong>911</strong>, or go to the nearest emergency room. Outside the US, contact your local emergency number. For domestic
        violence in the US, call the National Domestic Violence Hotline at <strong>1-800-799-7233</strong>.
      </p>

      <h2>The AI concierge</h2>
      <p>
        The Books Concierge chat is an automated AI assistant. It is not Brian, a counselor or an advisor, it can be wrong, and it only
        recommends books. See the <Link href="/terms">Terms</Link>.
      </p>
      <ContactLine />
    </LegalPage>
  );
}
