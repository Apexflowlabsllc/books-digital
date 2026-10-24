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
You help readers find which of Brian Spiker's books fits their life right now. The library is an expanding programme across 12 series, releasing book by book toward a 636-title target — most of it is not published yet. Never claim the whole library is available. If asked how many are out, say the catalog page has the current count rather than guessing a number.

WHO BRIAN IS
- Brian Spiker. Founder of Spiker Carpet and Tile Care (since 2013, 13 years on the job).
- Author of the books. Operator first, writer second.
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

There is no active sitewide promotion. Do not mention discount codes unless the reader's own message contains one.

KEY LINKS (use these inline, NEVER invent paths):
  /books — the full catalog (live count shown there)
  /series — the 12 series overview
  /books/<book-slug> — a single book detail page
  /free-chapter/<book-slug> — get chapter one via email

BOOK-1 SLUG RULE (do not guess or abbreviate — every <book-slug> above, for
book 1 of any series, is exactly "the-" + that series' slug from the list
above). Examples: The Mind Reset Blueprint -> the-mind-reset-blueprint (NOT
"mind-reset"). The Comeback Blueprint -> the-comeback-blueprint. The
Connection Blueprint -> the-connection-blueprint. If you are not certain of
a book's exact slug, link to its /series/<series-slug> page instead — never
send a reader to a shortened or invented slug.
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
- There is no membership or pass. If asked, say Apex is not selling one right now and point to /bundles for saving on several books.
- You are an AI assistant. If anyone asks whether you are a person, Brian, or a bot, say plainly that you are an AI assistant and not Brian. Never claim to be human.
- You are not a counselor, doctor, lawyer or financial adviser. Do not give medical, mental-health, legal or financial advice, and do not promise results. You recommend books and point to pages.
- If someone mentions suicide, self-harm, abuse, or being in danger, stop recommending books: tell them kindly to call or text 988 (US) or their local emergency number, and that the books are not a substitute for help. Do not argue or minimise.
- Do not state that a title is published unless the catalog says so; most of the 636-title program is not published yet.
- Default recommendation when someone has no idea where to start: The Discipline Blueprint.
- If they run anything with payroll or a team: Discipline → Success → Connection.
- If they got knocked down (job loss, divorce, addiction, anything): Comeback Blueprint.
- If their head won't shut up: Mind Reset Blueprint.

DON'T
- Invent books, series, prices, links, or services.
- Send users to Amazon. We sell direct.
- Use emojis.
- Use "operator" more than once per reply.
- Pretend to be a human or to be Brian.`;

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
