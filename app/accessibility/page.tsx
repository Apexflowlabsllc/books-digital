import { ContactLine, LegalPage } from '@/components/legal/LegalPage';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Accessibility Statement | Apex Flow Publishing House',
  description: 'Apex Flow Publishing House aims for WCAG 2.1 level AA. What we do, known limits, and how to ask for help or another format.',
  path: '/accessibility',
});

export default function AccessibilityPage() {
  return (
    <LegalPage title="Accessibility Statement">
      <p>We want everyone to be able to read and buy from this site. We aim to meet the Web Content Accessibility Guidelines (WCAG) 2.1 level AA.</p>

      <h2>What we do</h2>
      <ul>
        <li>A &ldquo;skip to main content&rdquo; link on every page, labelled landmarks, and a visible keyboard focus outline.</li>
        <li>Forms have visible or screen-reader labels and text error messages. Menus, pop-ups and the chat can be used with a keyboard, and Escape closes them.</li>
        <li>Animated backgrounds, smooth scrolling, the custom cursor and page transitions switch off or simplify when your device is set to &ldquo;reduce motion&rdquo;.</li>
        <li>Audio and video only play when you press play. Nothing autoplays with sound.</li>
        <li>Text colors are chosen for strong contrast on the dark background.</li>
        <li>Every title is available as text (ebook) as well as audio. Audio previews are samples of the written book.</li>
      </ul>

      <h2>Known limits</h2>
      <ul>
        <li>Video previews do not yet all have captions or a transcript. Tell us the title and we will send a transcript.</li>
        <li>The decorative liquid-metal background and cover art are visual effects; the information on the page is always also available as text.</li>
        <li>We have not had a formal third-party accessibility audit.</li>
      </ul>

      <h2>Tell us about a problem, or ask for another format</h2>
      <p>
        If something is hard to use, email us with the page address, what happened, and the assistive technology you use if you like. We will
        reply and work on a fix, or give you the information another way. If you need an ebook in a different file format, ask.
      </p>
      <ContactLine />
    </LegalPage>
  );
}
