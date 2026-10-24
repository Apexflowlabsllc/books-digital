import Link from 'next/link';
import { ContactLine, LegalPage } from '@/components/legal/LegalPage';
import { CookieSettingsButton } from '@/components/legal/ConsentBanner';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Cookie Policy | Apex Flow Publishing House',
  description:
    'Which cookies and browser storage Apex Flow Publishing House uses, which outside addresses it contacts, and how to change your choice.',
  path: '/cookies',
});

export default function CookiesPage() {
  return (
    <LegalPage title="Cookie Policy">
      <p>
        This site sets no advertising or tracking cookies and runs no analytics. This page lists everything it stores in your browser and
        every outside address your browser may contact.
      </p>
      <p>
        <CookieSettingsButton className="min-h-[44px] rounded-full border-2 border-ink px-6 py-3 font-semibold text-ink hover:bg-ink hover:text-bg" />
      </p>

      <h2>Inventory</h2>
      <table>
        <thead>
          <tr>
            <th scope="col">Item</th>
            <th scope="col">What it does</th>
            <th scope="col">When</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Supabase sign-in cookies (sb-…)</th>
            <td>Keep you signed in. Scoped to apexflowlabs.com so one sign-in works on every Apex Flow Labs site. Essential.</td>
            <td>Only if you create an account or sign in</td>
          </tr>
          <tr>
            <th scope="row">Local storage: apex-books-consent</th>
            <td>Remembers your choice about the optional script.</td>
            <td>After you press a button in the cookie box</td>
          </tr>
          <tr>
            <th scope="row">Local storage: banner and pop-up flags</th>
            <td>Remember that you closed a banner or pop-up so it does not return. Stay on your device.</td>
            <td>After you close one</td>
          </tr>
          <tr>
            <th scope="row">Stripe (checkout.stripe.com)</th>
            <td>Handles payment on its own page, which sets its own cookies under Stripe&rsquo;s policy.</td>
            <td>Only when you pay</td>
          </tr>
          <tr>
            <th scope="row">Vercel server logs</th>
            <td>IP address, browser, pages and time, for security and reliability. Not a cookie.</td>
            <td>Every visit</td>
          </tr>
          <tr>
            <th scope="row">Cover images and media from Supabase and Apex Flow Labs servers</th>
            <td>Load pictures, audio previews and video previews from those addresses.</td>
            <td>On pages that show them</td>
          </tr>
          <tr>
            <th scope="row">Arcade button script (www.apexflowlabs.com)</th>
            <td>Optional. Adds the Play button. Contacts another Apex Flow Labs address and may keep browser storage for your scores.</td>
            <td>
              <strong>Only after you choose &ldquo;Accept optional&rdquo;</strong>
            </td>
          </tr>
        </tbody>
      </table>

      <h2>Your choice</h2>
      <p>
        The optional script is off until you accept. &ldquo;Decline optional&rdquo; and &ldquo;Accept optional&rdquo; are equal choices. If your
        browser sends the Global Privacy Control signal, we treat that as a decline and do not load it. You can change your mind any time with
        &ldquo;Cookie settings&rdquo; in the footer; declining after accepting reloads the page so the script stops. You can also clear this
        site&rsquo;s storage in your browser settings, which signs you out.
      </p>

      <h2>What we do not use</h2>
      <p>
        No Google Analytics, no advertising or retargeting pixels, no social-media embeds, no session replay, no third-party font requests. If
        that ever changes, the new tool will stay off until you accept it here.
      </p>
      <p>
        See also the <Link href="/privacy">Privacy Policy</Link>.
      </p>
      <ContactLine />
    </LegalPage>
  );
}
