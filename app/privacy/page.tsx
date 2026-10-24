import Link from 'next/link';
import { ContactLine, LegalPage } from '@/components/legal/LegalPage';
import { SERVICE_PROVIDERS } from '@/lib/legal';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Privacy Policy | Apex Flow Publishing House',
  description:
    'What Apex Flow Publishing House collects (email for free chapters, accounts, reviews, orders, the AI concierge), why, who handles it, and your choices.',
  path: '/privacy',
});

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <p>
        This policy explains what Apex Flow Publishing House (books.apexflowlabs.com) collects, why, who handles it and the choices you have.
        We collect what we need to run a book store and nothing for advertising: there are no advertising cookies, no tracking pixels and no
        analytics on this site, and we do not sell personal information.
      </p>

      <h2>What we collect, and when</h2>
      <ul>
        <li>
          <strong>Free chapter and discount requests.</strong> Your email address, the book you asked for, which page you were on, and (for the
          pop-up) the discount code shown to you. We send it to the Apex Flow Labs backend, which emails you the chapter.
        </li>
        <li>
          <strong>Notify-me requests.</strong> Your email address, so we can tell you the day a book ships.
        </li>
        <li>
          <strong>Accounts.</strong> Email address and password (stored hashed by Supabase) and a sign-in session cookie. The cookie is scoped
          to apexflowlabs.com so one sign-in works across the Apex Flow Labs sites.
        </li>
        <li>
          <strong>Reviews.</strong> Your email address (not shown in full), rating, optional headline and the text you write. Approved review
          text is shown publicly with a masked name.
        </li>
        <li>
          <strong>Orders.</strong> Payment is handled on Stripe&rsquo;s own checkout pages; we never see your full card number. For paperbacks
          and hardcovers Stripe collects your shipping address and we pass it to our printer, Lulu, to print and ship. We keep order records
          (what, when, amount, email) for accounting and support.
        </li>
        <li>
          <strong>Founder Edition applications.</strong> Name, email, company, optional phone, your answer to &ldquo;why&rdquo; and the shipping
          address you enter. Used only to review the application and, if you are accepted, to fulfil it.
        </li>
        <li>
          <strong>Books Concierge chat.</strong> What you type, and the earlier messages in that chat, are sent from our server to OpenAI to write
          a reply; OpenAI handles it under its own terms and privacy policy. We do not store chat transcripts. Our server holds your IP address
          in memory only to limit how fast messages can be sent; it is not sent to OpenAI. Please do not type sensitive personal information
          (health, finances, passwords) into the chat.
        </li>
        <li>
          <strong>Emails you send us.</strong> Whatever you write, and your address.
        </li>
        <li>
          <strong>Basic technical data.</strong> Our host, Vercel, logs the IP address, browser type, pages requested and time of each visit
          for security and reliability.
        </li>
        <li>
          <strong>Your choices in your browser.</strong> Small settings saved in local storage on your device (for example that you closed a
          banner or pop-up, and your cookie choice). They never leave your device.
        </li>
      </ul>
      <p>
        The &ldquo;Tell us what&rsquo;s going on&rdquo; search on the Problems page runs in your browser; what you type there is not sent to us.
      </p>

      <h2>Optional script, only with your OK</h2>
      <p>
        One script from www.apexflowlabs.com (the Apex Flow Arcade play button) is <strong>not</strong> loaded unless you choose &ldquo;Accept
        optional&rdquo; in the cookie box. Loading it tells Apex Flow Labs that your browser visited this page (your IP address and browser
        details, as with any web request), and the Arcade may keep its own browser storage for your scores. If you decline, or your browser sends
        the Global Privacy Control signal, it does not load. See the <Link href="/cookies">Cookie Policy</Link>.
      </p>

      <h2>Images, audio and video</h2>
      <p>
        Some covers, audio previews and video previews are served from our storage provider (Supabase) or from the Apex Flow Labs servers, so
        your browser contacts those addresses when you view a page that uses them. Fonts are bundled with this site; no request goes to Google
        Fonts.
      </p>

      <h2>How we use information</h2>
      <ul>
        <li>To send you the chapter, code, order emails or reply you asked for.</li>
        <li>To process and deliver orders and give support.</li>
        <li>To moderate and publish reviews.</li>
        <li>To review Founder Edition applications.</li>
        <li>To keep the site secure, prevent abuse and meet legal obligations.</li>
      </ul>
      <p>
        We email you what you asked for (a chapter, a code, a notice that a book shipped, order updates). Every email has an unsubscribe link,
        and you can also email us to be removed. We do not sell personal information, do not share it for cross-context behavioral advertising,
        and do not use it to profile you.
      </p>

      <h2>Who handles data for us</h2>
      <ul>
        {SERVICE_PROVIDERS.map((p) => (
          <li key={p}>{p}</li>
        ))}
        <li>Apex Flow Labs (our parent company): runs the shared backend for orders, reviews and email lists.</li>
      </ul>
      <p>We may disclose information if the law requires it or to protect rights and safety.</p>

      <h2>Links to other sites</h2>
      <p>
        We link to our sister sites and sometimes to other sites. They have their own privacy practices. We do not currently use affiliate
        links; see the <Link href="/editorial-policy">Editorial policy</Link>.
      </p>

      <h2>Your rights</h2>
      <p>
        You can ask to see, correct, export or delete your personal information, or opt out of any sale or sharing (we do neither). California
        residents have these rights under the CCPA/CPRA, and we extend the same requests to everyone. We will not penalize you for asking. Use
        the <Link href="/privacy-request">privacy request page</Link> or email us. We may need to confirm it is you, we respond within 45 days,
        and you can use an authorized agent. We treat the Global Privacy Control signal as an opt-out preference.
      </p>

      <h2>Children</h2>
      <p>
        The books are written for adults and many are R-rated. This site is not directed to children under 13 and we do not knowingly collect
        personal information from them. Accounts, reviews and orders are for people 18 and over. If you think a child gave us information, tell us
        and we will delete it.
      </p>

      <h2>Retention and security</h2>
      <p>
        We keep an email on a mailing list until you unsubscribe or ask us to delete it. Order records are kept as long as accounting and tax
        law require. Account data is kept until you delete your account. Founder Edition applications that are declined are deleted on request.
        No system is perfectly secure.
      </p>

      <h2>Changes and contact</h2>
      <p>If we make material changes we will update the date at the top of this page.</p>
      <ContactLine />
    </LegalPage>
  );
}
