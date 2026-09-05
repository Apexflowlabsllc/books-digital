import { ENCYCLOPEDIA, type EncyclopediaEntry } from './encyclopedia';

/**
 * PROBLEM PAGES — few, real, and built from data that already exists.
 *
 * The SOP is explicit that this must not become mass-generated SEO filler:
 * "Do NOT mass-generate hundreds or thousands of empty SEO pages. Each page
 * must contain real useful information."
 *
 * So these are not generated from a keyword list. Each one is an encyclopedia
 * entry that already carries a written definition, a concrete action, and the
 * real phrasings people use for it — content that existed before any thought
 * of a landing page. A term with thin coverage does not get a page.
 *
 * The gate below is deliberate and mechanical: an entry must carry a
 * definition of real length, an action, and at least six recorded phrasings.
 * That keeps the set small and every page substantive. At time of writing it
 * yields a dozen or so pages, not hundreds — which is the point.
 *
 * Each page then connects problem -> answer -> books -> series -> author, so
 * it is a genuine entry point rather than a doorway.
 */

export type ProblemPage = {
  slug: string;
  entry: EncyclopediaEntry;
  /** The plain-language question a person would actually type. */
  question: string;
};

/** Terms worth a page, in the order they should appear. */
const LEAD = [
  'Procrastination',
  'Rumination',
  'Discipline',
  'Emotional regulation',
  'Imposter syndrome',
  'Boundary',
  'Burnout',
  'Self-worth',
  'Trauma bonding',
  'Gaslighting',
  'Purpose',
  'Comfort zone',
  'Willpower depletion',
  'Perfectionism',
];

export function problemSlug(term: string): string {
  return term
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Substantive enough to deserve its own indexable page. */
function isSubstantive(e: EncyclopediaEntry): boolean {
  return e.definition.trim().length >= 140 && e.action.trim().length >= 30 && e.saidAs.length >= 6;
}

export const PROBLEM_PAGES: ProblemPage[] = LEAD.map((term) => {
  const entry = ENCYCLOPEDIA.find((e) => e.term === term);
  if (!entry || !isSubstantive(entry)) return null;
  /* The headline question is a real recorded phrasing where one reads as a
   * question, otherwise a plain "how do I deal with X". Never invented copy
   * dressed as a search query. */
  const asQuestion =
    entry.saidAs.find((s) => /^(how|why|what|am i|is it)/i.test(s.trim())) ?? null;
  return {
    slug: problemSlug(term),
    entry,
    question: asQuestion ?? `How do I deal with ${term.toLowerCase()}?`,
  };
}).filter((p): p is ProblemPage => p !== null);

export function findProblem(slug: string): ProblemPage | undefined {
  return PROBLEM_PAGES.find((p) => p.slug === slug);
}
