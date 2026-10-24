import Link from 'next/link';
import { ContactLine, LegalPage, MailButton } from '@/components/legal/LegalPage';
import { BUSINESS } from '@/lib/legal';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Copyright and Takedown | Apex Flow Publishing House',
  description: 'Copyright notice, how to send a DMCA takedown notice, and how to report a review or other content on Apex Flow Publishing House.',
  path: '/report-content',
});

export default function ReportContentPage() {
  return (
    <LegalPage title="Copyright and Takedown">
      <h2>Copyright notice</h2>
      <p>
        &copy; {BUSINESS.legalName}. All rights reserved except as stated on this site. The books, audiobooks, blog posts, encyclopedia entries,
        design and code are protected by copyright. Apex Flow Publishing House, Apex Flow Labs and related names and marks belong to{' '}
        {BUSINESS.legalName}. You may quote short excerpts with credit and a link back.
      </p>

      <h2>Reporting infringement (DMCA)</h2>
      <p>If you believe something on this site infringes your copyright, send a notice to the address below that includes:</p>
      <ol>
        <li>Your physical or electronic signature.</li>
        <li>Identification of the copyrighted work you claim is infringed.</li>
        <li>The address (URL) of the material on this site you want removed or disabled.</li>
        <li>Your name, email address and, if you have one, phone number or mailing address.</li>
        <li>A statement that you have a good-faith belief that the use is not authorized by the copyright owner, its agent or the law.</li>
        <li>A statement, under penalty of perjury, that the information in the notice is accurate and that you are the copyright owner or authorized to act for the owner.</li>
      </ol>
      <MailButton subject="DMCA notice">Send a copyright notice</MailButton>
      <p>
        We review notices promptly and remove or disable access to material that is shown to infringe. If you believe material was removed by
        mistake, you may send a counter-notice with your signature, the address of the removed material, a statement under penalty of perjury
        that you believe it was removed by mistake, your consent to the jurisdiction of the federal court for your address, and your contact
        details. Knowingly sending a false notice can make you liable for damages. We may end the accounts of repeat infringers.
      </p>

      <h2>Reporting a review or other content</h2>
      <p>
        Reviews are written by readers and moderated. If a review is false, abusive, posted by someone with an undisclosed connection to the
        author, or exposes your private information, tell us the page address and why and we will review it and remove it where it breaks our{' '}
        <Link href="/terms">Terms</Link> or the law. We also take reports of anything on the site that is inaccurate or unlawful.
      </p>
      <MailButton subject="Content report">Report content</MailButton>
      <ContactLine />
    </LegalPage>
  );
}
