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
 * That keeps every page substantive — the count grew because the encyclopedia
 * itself grew (156 entries, each mined from real chapter content and checked
 * for originality and duplication before being added), not because the bar
 * was lowered. Every one of the terms below still has to clear the same gate.
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
  'Undefined standard',
  'Productive procrastination',
  'Emotional inventory management',
  'Pre-finish relapse urge',
  'Complacency plateau',
  'Accountability',
  'Analysis Paralysis',
  'Anger as signal',
  'Anticipatory Surrender',
  'Arrival Fantasy',
  'Aspirational consumption',
  'Attachment style',
  'Best-day reverse engineering',
  'Betrayal Forensics',
  'Blood Obligation',
  'Borrowed Authority',
  'Borrowed Ceiling',
  'Breadcrumbing',
  'Capacity Hoarding',
  'Capacity Overflow Snapping',
  'Codependency',
  'Cognitive reframing',
  'Collapse Mistaken For Rest',
  'Command Freeze',
  'Consistency over intensity',
  'Consumption Drought',
  'Cost-Blind Ledger',
  'Cyberchondria',
  'DARVO',
  'Dead Time Default',
  'Decision fatigue',
  'Delayed gratification',
  'Deliberate practice',
  'Depth Avoidance',
  'Device Proximity Trap',
  'Diagnosis as alibi',
  'Dissociation',
  'Distracted Presence',
  'Dopamine',
  'Draft Purgatory',
  'Emotional flashback',
  'Emotional sovereignty',
  'Enmeshment',
  'Escape Hatch',
  'Fair-Weather Discipline',
  'Family Scapegoat Role',
  'Fantasy Bond',
  'Financial shame',
  'First-task momentum',
  'Flow state',
  'Flying Monkeys',
  'Follow-Through Debt',
  'Former-Self Contempt',
  'Golden Child Standard',
  'Grief',
  'Growth mindset',
  'Guilt Ledger',
  'Habit loop',
  'Hypervigilance',
  'Identity reconstruction',
  'Identity-based habits',
  'Implementation intention',
  'Intention-Action Gap',
  'Intrinsic motivation',
  'Invisible Expertise',
  'Invisible Labor Ache',
  'Isolated Leverage',
  'JADE',
  'Keystone habit',
  'Locus of control',
  'Love bombing',
  'Make-It-Up-Tomorrow Bargain',
  'Manufactured Incompleteness',
  'Manufactured urgency',
  'Mentor Cloning',
  'Momentum Cliff',
  'Negative visualization',
  'Nervous system regulation',
  'Neuroplasticity',
  'No contact',
  'Noise Dependency',
  'Novelty Cliff',
  'Open Loop Drain',
  'Optimization Theater',
  'Outsourced Competence',
  'Over-Explaining',
  'Parentification',
  'Parked Project',
  'Peak-Day Benchmark',
  'People-pleasing',
  'Performance Charm',
  'Performed Discipline',
  'Phantom-Data Catastrophizing',
  'Pity-Text Sympathy Loop',
  'Potential-as-alibi',
  'Protocol Hopping',
  'Public Mask',
  'Radical acceptance',
  'Reactive Abuse',
  'Reactive Morning',
  'Readiness Fallacy',
  'Reasonable-sounding avoidance',
  'Recovery Theater',
  'Reloading Instead Of Listening',
  'Resilience',
  'Scarcity mindset',
  'Screenshot Wisdom',
  'Self-efficacy',
  'Self-sabotage',
  'Self-trust ledger',
  'Shame versus guilt',
  'Silent Treatment',
  'Smear Campaign',
  'Standard drift',
  'Standing Audience Trap',
  'Successor’s Shadow',
  'Symbolic self-completion',
  'Task Monument',
  'Teaching Lock',
  'The Almost-Finished Habit',
  'The Designated Strong One',
  'The Gap Ambush',
  'The Joke That Wasn’t a Joke',
  'The Narrow Specialist',
  'The Peacekeeping Lie',
  'The Reciprocity Ledger',
  'The Regret Ledger',
  'The Self-Care Alibi',
  'The Trying Loop',
  'The Unbearable Pause',
  'Tracking-without-doing',
  'Trigger',
  'Vanity Effort',
  'Vanity Metric Fixation',
  'Variance Misread',
  'Velocity Debt',
  'Vicarious Ambition',
  'Visibility Gap',
  'Voice Freeze',
  'Windfall Impulse Spending',
  'Zero-exception restart',
  'Zombie Subscription',
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
