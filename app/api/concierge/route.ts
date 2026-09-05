import { NextResponse } from 'next/server';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { rateLimit, clientKey } from '@/lib/rateLimit';
import { env } from '@/lib/env';
import { getCatalog } from '@/lib/api';
import { catalogPrices } from '@/lib/pricing';
import {
  safeHistory,
  safeMessage,
  isAllowedOrigin,
} from '@/lib/conciergeGuards';

export const runtime = 'nodejs';
export const maxDuration = 30;

/* Books Concierge — short, voice-correct GPT call with the whole Apex
 * library, links, and tone baked into the system prompt. Returns a
 * single JSON { reply } — the chat component just appends it to the
 * thread. If OPENAI_API_KEY is missing or the model errors out, we
 * return a voice-correct fallback so the chat never silently dies.
 */
const SYSTEM_PROMPT = `You are the Books Concierge for Apex Flow Publishing House at books.apexflowlabs.com.
You help readers find which of Brian Spiker's books fits their life right now. The library is a 636-title programme across 12 series that releases book by book — NOT all 636 are published. Never tell a reader all 636 are available. If asked how many are out, say the catalog page has the current count rather than guessing a number.

WHO BRIAN IS
- Brian Spiker. Founder of Spiker Carpet and Tile Care (Pittsburgh, since 2013 — 13 years on the job).
- Author of every book. Operator first, writer second. No ghostwriter.
- His voice: plain, direct, R-rated when it fits but never performative. Avoid "operator" overuse. Avoid "authentic."

THE LIBRARY — 12 series, 4 waves, 90 chapters each, 35-40k words each
Wave I (Foundation):
  S01 The Discipline Blueprint — /series/discipline-blueprint
  S02 The Comeback Blueprint — /series/comeback-blueprint
  S03 The Mind Reset Blueprint — /series/mind-reset-blueprint
Wave II (Pressure):
  S04 The Success Blueprint — /series/success-blueprint
  S05 The Elite Blueprint — /series/elite-blueprint
  S06 The Unstoppable Blueprint — /series/unstoppable-blueprint
Wave III (Edge):
  S07 The Nervous System Blueprint — /series/nervous-system-blueprint
  S08 The Connection Blueprint — /series/connection-blueprint
  S09 The Power Blueprint — /series/power-blueprint
Wave IV (Apex):
  S10 The Purpose Blueprint — /series/purpose-blueprint
  S11 The Warrior Blueprint — /series/warrior-blueprint
  S12 The Legend Blueprint — /series/legend-blueprint

CADENCE: one chapter per day for 90 days.

PRICES: see the CURRENT PRICES block appended below. Use ONLY those numbers.
Never quote a price that is not in that block. If a format is not listed there,
say it is not available yet rather than guessing.

LAUNCH WEEK PROMO: code APEX30 for 30% off every direct purchase. Auto-applies at checkout.

KEY LINKS (use these inline, NEVER invent paths):
  /books — all 636
  /series — the 12 series overview
  /books/<book-slug> — a single book detail page
  /free-chapter/<book-slug> — get chapter one via email
  /membership — the Insider Pass: $99/year, the whole library as it releases plus every audiobook as it is narrated, 20% off every other Apex brand
  /bundles — series bundles
  /brian-spiker-real-world-proof — Brian's 13-year Spiker timeline (proof he's a real operator)
  /about-brian — author page

TOPIC SHORTCUTS (SEO landing pages):
  /books/discipline · /books/comeback · /books/mindset · /books/parenting
  /books/faith · /books/business · /books/relationships · /books/money
  /books/productivity · /books/marriage

HOW YOU TALK
- Short paragraphs. Plain English. Match Brian's voice.
- If you can commit to a specific recommendation, do it. One book or one series.
- Ask at most ONE clarifying question, and only if it would change your recommendation.
- When you mention a book or series, include its link inline.
- Don't pitch the Insider Pass unless the user asks about saving money or buying multiple books.
- Don't say "I'm just an AI" or "I can't browse the web." Answer from what you know above.
- Default recommendation when someone has no idea where to start: The Discipline Blueprint.
- If they run anything with payroll or a team: Discipline → Success → Connection.
- If they got knocked down (job loss, divorce, addiction, anything): Comeback Blueprint.
- If their head won't shut up: Mind Reset Blueprint.

DON'T
- Invent books, series, prices, links, or services.
- Send users to Amazon. We sell direct.
- Use emojis.
- Use "operator" more than once per reply.
- Write disclaimers about being an AI.`;

interface ConciergeBody {
  message?: string;
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;
}

const VOICE_FALLBACK = [
  "Concierge is briefly offline. Try again in a minute, or pick a starting line:",
  '- Run anything with payroll: start at /series/discipline-blueprint',
  '- Want it cheap: /free-chapter/the-discipline-blueprint',
  '- Curious about the whole library: /books',
].join('\n');

/** Reject cross-site callers. This endpoint exists for our own widget. */
function sameOrigin(req: Request): boolean {
  const hosts: string[] = [];
  try {
    if (env.siteUrl) hosts.push(new URL(env.siteUrl).host);
  } catch {
    /* a malformed siteUrl should not open the door */
  }
  const host = req.headers.get('host');
  if (host) hosts.push(host);
  return isAllowedOrigin(req.headers.get('origin'), hosts);
}

/** Real prices, read from the catalog, injected per request. */
async function currentPricesBlock(): Promise<string> {
  try {
    const catalog = await getCatalog();
    const rows = catalogPrices(catalog?.books ?? []).filter((p) => p.price);
    const NONE = '\n\nCURRENT PRICES: unavailable right now — do not quote any price.';
    if (!rows.length) return NONE;
    const lines = rows.map((r) => `  ${r.label}: ${r.price}`).join('\n');
    return `\n\nCURRENT PRICES (authoritative, read from the live catalog):\n${lines}`;
  } catch {
    return '\n\nCURRENT PRICES: unavailable right now — do not quote any price.';
  }
}

export async function POST(req: Request) {
  if (!sameOrigin(req)) {
    return NextResponse.json({ reply: VOICE_FALLBACK }, { status: 403 });
  }

  /* 8 messages then roughly one every 12s. Enough for a real conversation,
   * nowhere near enough to be worth abusing. */
  const limit = rateLimit(`concierge:${clientKey(req)}`, { capacity: 8, refillPerSecond: 1 / 12 });
  if (!limit.ok) {
    return NextResponse.json(
      { reply: 'Give me a second — too many messages at once. Try again shortly.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } },
    );
  }

  let body: ConciergeBody;
  try {
    body = (await req.json()) as ConciergeBody;
  } catch {
    return NextResponse.json({ reply: VOICE_FALLBACK }, { status: 200 });
  }

  const userMessage = safeMessage(body.message);
  if (!userMessage) {
    return NextResponse.json({ reply: VOICE_FALLBACK }, { status: 200 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ reply: VOICE_FALLBACK }, { status: 200 });
  }

  const messages = [...safeHistory(body.history), { role: 'user' as const, content: userMessage }];

  try {
    const result = await generateText({
      model: openai('gpt-4o-mini'),
      system: SYSTEM_PROMPT + (await currentPricesBlock()),
      messages,
      temperature: 0.4,
      maxOutputTokens: 700,
    });
    return NextResponse.json({ reply: result.text.trim() }, { status: 200 });
  } catch (err) {
    console.error('[concierge] OpenAI call failed:', err);
    return NextResponse.json({ reply: VOICE_FALLBACK }, { status: 200 });
  }
}
