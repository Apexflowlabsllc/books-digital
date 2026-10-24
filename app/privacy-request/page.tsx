import Link from 'next/link';
import { ContactLine, LegalPage, MailButton } from '@/components/legal/LegalPage';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Privacy and Deletion Requests | Apex Flow Publishing House',
  description: 'Ask Apex Flow Publishing House to show, export, correct or delete your information, close your account, or opt out. No account needed.',
  path: '/privacy-request',
});

export default function PrivacyRequestPage() {
  return (
    <LegalPage title="Privacy and Deletion Requests">
      <p>
        You can ask us to show you, export, correct or delete the personal information we hold about you (including your email on a mailing
        list, reviews you wrote, Founder Edition applications and order records), to close your account, or to opt out of any sale or sharing
        (we do neither). You do not need to give a reason and it costs nothing.
      </p>
      <h2>How</h2>
      <MailButton
        subject="Privacy request"
        body={'Request type (access / delete / correct / export / opt-out / close account / unsubscribe):\nEmail address used:\nDetails:\n'}
      >
        Send a privacy request
      </MailButton>
      <p>
        Or email us from the address you used and say which you want. We may ask a question to confirm it is you, and we respond within 45
        days. Deletion removes your account and list data, except what the law requires us to keep (for example order and tax records). You can
        also use an authorized agent. To stop marketing emails right away, use the unsubscribe link in any email.
      </p>
      <h2>Opt-out signals</h2>
      <p>
        If your browser sends the Global Privacy Control signal, we treat it as an opt-out request and keep the optional script off. You can
        also use &ldquo;Cookie settings&rdquo; in the footer. See the <Link href="/privacy">Privacy Policy</Link> and{' '}
        <Link href="/cookies">Cookie Policy</Link>.
      </p>
      <ContactLine />
    </LegalPage>
  );
}
