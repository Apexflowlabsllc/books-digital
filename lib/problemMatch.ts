import { ENCYCLOPEDIA, type EncyclopediaEntry } from './encyclopedia';
import type { BookSummary } from './types';

/**
 * SAY THE PROBLEM, GET THE BOOK.
 *
 * A catalog of 636 books is useless to someone who does not already know what
 * they are looking for — and the person who needs these books least knows what
 * to call their problem. They do not type "rumination". They type "I keep
 * replaying that argument".
 *
 * The encyclopedia already holds that translation: every term, and hundreds of
 * real phrasings of them, written specifically as the way people say it out
 * loud. Counts are derived there (TERM_COUNT / PHRASE_COUNT) and deliberately
 * not repeated here, because a number in a comment goes stale on the first
 * edit.
 * It was built for answer engines. This wires it to the store, so the same
 * translation works for the human standing in front of the shelf.
 *
 * HOW THE MATCH WORKS, AND WHY IT IS WEIGHTED
 * -------------------------------------------
 * The naive version — count shared words, require two of them — fails on the
 * exact sentences this is for. "I keep replaying that argument" shares exactly
 * one word with "replaying conversations in my head", and that one word is the
 * whole diagnosis. Meanwhile "I hate my work" also shares one word with twenty
 * different entries and means nothing.
 *
 * So every word is weighted by how rare it is across the encyclopedia (IDF).
 * "replaying" appears in one entry and is worth ~3.6; "work" appears in twenty
 * and is worth ~0.9. One rare word beats four common ones, which is exactly
 * how a person reading the sentence would weigh it.
 *
 * Words are also lightly stemmed, so "overthinking" finds "overthink" and
 * "panic attacks" finds "panic attack" without a stemmer dependency.
 *
 * Everything runs over data already loaded on the page. No request, no index,
 * no embedding — it answers as fast as they can type.
 */

/* ── which series answers which kind of problem ────────────────────────
 * Signals are matched against an encyclopedia entry's whole text, so a term
 * lands on a shelf without anyone hand-assigning 52 of them. Order does not
 * matter; every signal that hits adds weight, and the strongest shelf wins.
 */
const SERIES_SIGNALS: { slug: string; words: string[] }[] = [
  {
    slug: 'discipline-blueprint',
    words: ['disciplin', 'willpower', 'consisten', 'habit', 'routine', 'procrastinat', 'follow through', 'accountab', 'delayed gratification', 'urge', 'snooze', 'lazy', 'motivat', 'put it off', 'self control', 'temptation'],
  },
  {
    slug: 'mind-reset-blueprint',
    words: ['ruminat', 'overthink', 'thought', 'reframe', 'mindset', 'belief', 'replay', 'intrusive', 'worry', 'catastroph', 'inner critic', 'brain', 'shut off', 'loop', 'obsess'],
  },
  {
    slug: 'nervous-system-blueprint',
    words: ['anxiet', 'panic', 'nervous system', 'breath', 'freeze', 'fight or flight', 'regulat', 'stress', 'burnout', 'cortisol', 'sleep', 'tension', 'shutdown', 'overwhelm', 'on edge', 'calm down', 'overreact', 'explode'],
  },
  {
    slug: 'connection-blueprint',
    words: ['boundar', 'relationship', 'trauma bond', 'gaslight', 'codepend', 'people pleas', 'attachment', 'lonel', 'conflict', 'communicat', 'partner', 'family', 'friend', 'say no', 'eggshell', 'apolog'],
  },
  {
    slug: 'comeback-blueprint',
    words: ['relapse', 'failure', 'failed', 'rock bottom', 'start over', 'setback', 'resilien', 'grief', 'loss', 'divorce', 'fired', 'addict', 'recover', 'rebuild', 'back on track', 'starting over'],
  },
  {
    slug: 'power-blueprint',
    words: ['confiden', 'self-worth', 'self worth', 'self-efficacy', 'assert', 'respect', 'stand up', 'voice', 'power', 'insecure', 'not good enough', 'deserve'],
  },
  {
    slug: 'purpose-blueprint',
    words: ['purpose', 'meaning', 'direction', 'values', 'calling', 'drift', 'identity', 'intrinsic', 'what am i for', 'with my life', 'passion'],
  },
  {
    slug: 'success-blueprint',
    words: ['goal', 'money', 'career', 'business', 'achieve', 'productiv', 'focus', 'decision fatigue', 'plan', 'execute', 'deadline'],
  },
  {
    slug: 'warrior-blueprint',
    words: ['fear', 'courage', 'pain', 'suffer', 'endure', 'adversit', 'fight', 'pressure', 'comfort zone', 'scared', 'hard thing', 'uncomfortable'],
  },
  {
    slug: 'elite-blueprint',
    words: ['standard', 'excellence', 'elite', 'master', 'skill', 'deliberate practice', 'performance', 'compet', 'imposter', 'fraud', 'good enough'],
  },
  {
    slug: 'unstoppable-blueprint',
    words: ['momentum', 'quit', 'give up', 'persist', 'stuck', 'plateau', 'keep going', 'gets hard'],
  },
  {
    slug: 'legend-blueprint',
    words: ['legacy', 'long term', 'decade', 'who i become', 'character', 'reputation', 'legend', 'remembered'],
  },
];

/* Words that carry no signal. Deliberately short: over-stripping is what makes
 * a search feel stupid, and IDF already neutralises anything common. */
const STOP = new Set([
  'i', 'im', 'me', 'my', 'we', 'you', 'your', 'a', 'an', 'the', 'is', 'am', 'are', 'was', 'were',
  'be', 'been', 'to', 'of', 'in', 'on', 'at', 'it', 'its', 'and', 'or', 'but', 'so', 'if', 'do',
  'does', 'did', 'dont', 'cant', 'wont', 'not', 'no', 'have', 'has', 'had', 'for', 'with',
  'that', 'this', 'what', 'why', 'how', 'when', 'about', 'just', 'really', 'very', 'too', 'all',
  'any', 'like', 'always', 'never', 'more', 'up', 'out', 'off', 'as', 'from', 'book', 'books',
  'get', 'got', 'them', 'they', 'he', 'she', 'him', 'her', 'then', 'than', 'there', 'here',
  // Zero-signal filler that otherwise hijacks short queries: "I go back to him
  // every time" was landing on Procrastination purely because that entry says
  // "last minute panic every time".
  'every', 'time', 'times', 'thing', 'things', 'way', 'ways', 'lot', 'bit', 'kind',
  'someone', 'something', 'anything', 'everything', 'nothing', 'people', 'person',
  'day', 'days', 'want', 'wants', 'need', 'needs', 'make', 'makes', 'made', 'even',
  'much', 'many', 'well', 'over', 'into', 'because', 'been', 'being', 'still', 'ever',
]);

/** Apostrophes collapse so "can't", "can’t" and "cant" are one word. */
const norm = (s: string) =>
  s.toLowerCase().replace(/['’]/g, '').replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();

/**
 * Light stemming. Not a real stemmer — just enough that "overthinking" and
 * "overthink", "attacks" and "attack", "replaying" and "replay" collapse
 * together. Guarded on length so short words are never mangled.
 */
function stem(w: string): string {
  if (w.length > 6 && w.endsWith('ing')) return w.slice(0, -3);
  if (w.length > 5 && w.endsWith('ed')) return w.slice(0, -2);
  if (w.length > 4 && w.endsWith('es')) return w.slice(0, -2);
  if (w.length > 3 && w.endsWith('s') && !w.endsWith('ss')) return w.slice(0, -1);
  return w;
}

function tokens(s: string): string[] {
  const out: string[] = [];
  for (const w of norm(s).split(' ')) {
    if (w.length < 3 || STOP.has(w)) continue;
    out.push(stem(w));
  }
  return out;
}

/* ── the index, built once at module load ─────────────────────────── */

type Indexed = {
  e: EncyclopediaEntry;
  /** every token in the entry, for cheap membership tests */
  all: Set<string>;
  /** term + also tokens — the strongest signal an entry has */
  head: Set<string>;
  /** tokens per saidAs line, so a line can be scored for coverage */
  lines: { text: string; toks: string[]; set: Set<string> }[];
  /** definition + action tokens */
  body: Set<string>;
  series: string | null;
};

const INDEX: Indexed[] = ENCYCLOPEDIA.map((e) => {
  const head = new Set(tokens(`${e.term} ${e.also ?? ''}`));
  const lines = e.saidAs.map((text) => {
    const toks = tokens(text);
    return { text, toks, set: new Set(toks) };
  });
  const body = new Set(tokens(`${e.definition} ${e.action}`));
  const all = new Set<string>([...head, ...body]);
  for (const l of lines) for (const t of l.toks) all.add(t);

  const hay = norm([e.term, e.also ?? '', e.definition, e.action, ...e.saidAs].join(' '));
  let series: string | null = null;
  let best = 0;
  for (const s of SERIES_SIGNALS) {
    let n = 0;
    for (const w of s.words) if (hay.includes(w)) n++;
    if (n > best) {
      best = n;
      series = s.slug;
    }
  }
  return { e, all, head, lines, body, series };
});

/**
 * Inverse document frequency across the 52 entries.
 *
 * This is the piece that makes one-word matches work. A token in a single
 * entry scores ~3.6; a token in twenty scores ~0.9; a token in all of them
 * scores ~0. So "replaying" decides a match and "work" barely nudges it.
 */
const DF = new Map<string, number>();
for (const ix of INDEX) for (const t of ix.all) DF.set(t, (DF.get(t) ?? 0) + 1);
const N = INDEX.length;
const idf = (t: string) => Math.log((N + 1) / ((DF.get(t) ?? 0) + 0.5));

export type ProblemMatch = {
  /** The concept the query is really about, when one is confident enough. */
  concept: EncyclopediaEntry | null;
  /** The exact phrasing that matched, so the page can echo it back. */
  matchedPhrase: string | null;
  /** Other concepts worth offering. */
  alsoSee: EncyclopediaEntry[];
  /** Books, best first. */
  books: BookSummary[];
};

/** Score every entry against the query, best first. */
function rank(q: string): { ix: Indexed; score: number; phrase: string | null }[] {
  const nq = norm(q);
  const qt = tokens(q);
  if (!nq || !qt.length) return [];

  const out: { ix: Indexed; score: number; phrase: string | null }[] = [];

  for (const ix of INDEX) {
    let score = 0;
    let phrase: string | null = null;
    let bestCover = 0;

    /* Whole-string hits. Someone who typed the term, or typed a sentence that
     * contains a phrasing verbatim, is not guessing. */
    const term = norm(ix.e.term);
    const also = ix.e.also ? norm(ix.e.also) : '';
    if (nq === term || (also && nq === also)) score += 40;
    else if (nq.length > 3 && (term.includes(nq) || (also && also.includes(nq)))) score += 22;

    for (const l of ix.lines) {
      const nl = norm(l.text);
      if (nl === nq) {
        score += 40;
        phrase = l.text;
        bestCover = 1;
        continue;
      }
      if (nq.length > 8 && (nl.includes(nq) || nq.includes(nl))) {
        score += 26;
        if (!phrase) phrase = l.text;
        continue;
      }
      /* Coverage: what share of this line's meaning did they type? Measured in
       * IDF, so hitting the line's one distinctive word counts for most of it. */
      if (!l.toks.length) continue;
      let hit = 0;
      let total = 0;
      for (const t of l.toks) {
        const w = idf(t);
        total += w;
        if (qt.includes(t)) hit += w;
      }
      if (total <= 0) continue;
      const cover = hit / total;
      if (cover > 0.2) {
        score += 20 * cover;
        if (cover > bestCover) {
          bestCover = cover;
          if (cover >= 0.34) phrase = l.text;
        }
      }
    }

    /* Field weights: the term itself, then the phrasings, then the prose. */
    for (const t of new Set(qt)) {
      const w = idf(t);
      if (ix.head.has(t)) score += 9 * w;
      else if (ix.lines.some((l) => l.set.has(t))) score += 4.5 * w;
      else if (ix.body.has(t)) score += 1.4 * w;
    }

    if (score > 0) out.push({ ix, score, phrase });
  }

  return out.sort((a, b) => b.score - a.score);
}

/**
 * A sentence in, a concept and a shelf of books out.
 */
export function matchProblem(query: string, books: BookSummary[]): ProblemMatch {
  const q = query.trim();
  if (q.length < 2) return { concept: null, matchedPhrase: null, alsoSee: [], books: [] };

  const ranked = rank(q);
  /* 11 is where a hit stops being one incidental common word and starts being
   * a real reading of the sentence. Below it we still search books — we just
   * do not claim to know what they meant. */
  const top = ranked[0] && ranked[0].score >= 11 ? ranked[0] : null;
  const concept = top?.ix.e ?? null;
  const alsoSee = ranked
    .slice(1, 4)
    .filter((r) => r.score >= Math.max(8, (top?.score ?? 0) * 0.35))
    .map((r) => r.ix.e);

  const qt = tokens(q);
  const conceptSeries = top?.ix.series ?? null;
  const conceptWords = concept ? tokens(`${concept.term} ${concept.also ?? ''}`) : [];
  const allWords = [...new Set([...qt, ...conceptWords])];

  const scored = books.map((b) => {
    const title = new Set(tokens(`${b.title} ${b.subtitle ?? ''}`));
    const key = new Set(tokens(b.primary_keyword ?? ''));
    const ser = new Set(tokens(b.series_name ?? ''));
    let s = 0;

    for (const w of allWords) {
      if (title.has(w)) s += 5;
      if (key.has(w)) s += 4;
      if (ser.has(w)) s += 2;
    }
    if (conceptSeries && b.series_slug === conceptSeries) s += 9;
    /* Inside the right shelf the early books come first — they are the
     * foundation the later ones assume. */
    if (s > 0) s += Math.max(0, 3 - (b.book_number ?? 99) * 0.05);

    return { b, s };
  });

  const hits = scored
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, 24)
    .map((x) => x.b);

  return { concept, matchedPhrase: top?.phrase ?? null, alsoSee, books: hits };
}

/**
 * Starter phrasings for people who cannot name it yet — which is most of them.
 *
 * Taken from the encyclopedia's own `saidAs` lines rather than written here,
 * so "clicking one always resolves to a concept" is true by construction
 * instead of by hope. The preferred terms below are the ones worth leading
 * with; any that is missing or has no first-person phrasing is simply skipped.
 */
const LEAD_TERMS = [
  'Rumination',
  'Procrastination',
  'Trauma bonding',
  'Boundary',
  'Imposter syndrome',
  'Emotional regulation',
  'Willpower depletion',
  'Purpose',
  'Gaslighting',
  'Self-worth',
  'Comfort zone',
  'Consistency over intensity',
];

export const STARTER_PROBLEMS: string[] = LEAD_TERMS.map((t) => {
  const e = ENCYCLOPEDIA.find((x) => x.term === t);
  if (!e) return null;
  // Prefer a line that sounds like a person talking about themselves over one
  // that sounds like a search query ("how to stop overreacting").
  const first =
    e.saidAs.find((s) => /^(i |my |why do i|why is|am i)/i.test(s) && s.length <= 46) ??
    e.saidAs.find((s) => s.length <= 46);
  return first ?? null;
})
  .filter((s): s is string => Boolean(s))
  .slice(0, 10);
