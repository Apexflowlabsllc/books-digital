/**
 * The Apex Flow Self-Help Encyclopedia.
 *
 * WHY THIS EXISTS
 * ---------------
 * No bookstore explains its own subject. They publish a cover, a blurb and a
 * price. So when someone asks an answer engine "why can't I stop replaying
 * that argument in my head", there is no page built to answer it — and the
 * person who needed the book never finds the book.
 *
 * Every entry carries three things:
 *
 *   term        the clinical word, for the people who already know it
 *   definition  40-60 words, written to be lifted WHOLE into an AI answer
 *   action      what to actually do, which is what converts a reader
 *   saidAs[]    how a real person phrases it out loud
 *
 * `saidAs` is the whole play. Nobody searches "rumination". They search "brain
 * won't shut off at night". Those phrasings are emitted as `alternateName` on
 * each DefinedTerm AND as their own FAQPage questions, giving an engine two
 * independent routes from plain speech to this catalog.
 *
 * Counts are derived, never hardcoded — see TERM_COUNT / PHRASE_COUNT below.
 * A hardcoded count is a claim that goes stale the first time someone edits
 * this file.
 */

export type EncyclopediaEntry = {
  term: string;
  also?: string;
  definition: string;
  action: string;
  saidAs: string[];
};

export const ENCYCLOPEDIA: EncyclopediaEntry[] = [
  {
    term: 'Accountability',
    also: 'external commitment',
    definition:
      'Accountability is any structure that makes not doing the thing more costly than doing it. It works because it moves the decision out of your own head, where it can be renegotiated, and into a place where someone or something else is holding the other end.',
    action: 'Name one person who will notice if you stop. That is the whole mechanism.',
    saidAs: [
      'I only do it if someone is watching',
      'I need someone to check on me',
      'I keep letting myself off the hook',
      'how do I stop breaking promises to myself',
      'why do I show up for others but not me',
      'do accountability partners actually work',
      'I do it for my boss but not for me',
      'nobody notices if I quit',
      'I need a deadline or nothing happens',
    ],
  },
  {
    term: 'Boundary',
    also: 'limit',
    definition:
      'A boundary is a rule about your own behaviour, not a demand on someone else. "I leave at six" is a boundary. "Stop scheduling meetings at six" is a request. The distinction matters because only one of the two is enforceable by you alone.',
    action: 'Rewrite each of your boundaries as something you will do, not something they must stop.',
    saidAs: [
      'people walk all over me',
      'I cannot say no',
      'I feel guilty saying no',
      'how to stop being a doormat',
      'I let people take advantage of me',
      'saying no without being rude',
      'I always put everyone else first',
      'how do I stop over-committing',
      'I resent people for things I agreed to',
      'protecting my time from family',
      'why do I apologise for having limits',
    ],
  },
  {
    term: 'Cognitive reframing',
    also: 'reappraisal',
    definition:
      'Reframing is changing the meaning you assign to an event without changing the event. The situation stays identical; the story about what it says regarding you does not. It is the single most studied technique in cognitive behavioural therapy.',
    action: 'Write the sentence you are telling yourself, then write one other sentence that fits the same facts.',
    saidAs: [
      'change how I look at things',
      'stop making everything mean something bad',
      'my brain jumps to the worst',
      'how to think about it differently',
      'same situation different story',
      'I take everything personally',
      'how to stop catastrophising',
      'my inner voice is brutal',
      'how do I argue with my own thoughts',
    ],
  },
  {
    term: 'Comfort zone',
    definition:
      'The comfort zone is the range of action where your predicted outcome and your actual outcome match closely enough that you feel no threat. It expands only by being exceeded, which is why it shrinks in people who stop testing its edge.',
    action: 'Do one thing weekly whose outcome you genuinely cannot predict.',
    saidAs: [
      'I feel stuck doing the same things',
      'scared to try new stuff',
      'life feels small',
      'how to push myself out of my routine',
      'I avoid anything I might be bad at',
      'nothing changes and it is my fault',
      'why does new stuff terrify me',
      'I need to shake things up',
    ],
  },
  {
    term: 'Consistency over intensity',
    definition:
      'A small action repeated reliably outperforms a large action performed rarely, because adaptation responds to frequency of signal rather than size of it. Ten minutes daily changes a body and a mind more than three hours once a fortnight.',
    action: 'Halve the size of the habit until you can do it on your worst day.',
    saidAs: [
      'I go all in then quit',
      'why do I burn out every January',
      'all or nothing thinking with habits',
      'better to do a little every day',
      'I overdo it then stop for months',
      'small steps vs big changes',
      'I cannot sustain the routine I set',
      'why does my streak always break',
    ],
  },
  {
    term: 'Decision fatigue',
    also: 'ego depletion',
    definition:
      'Decision fatigue is the decline in decision quality after a long sequence of choices. Later decisions become more impulsive or more avoidant, not because willpower is a fuel that empties, but because the cost of deliberating starts to outweigh its perceived value.',
    action: 'Decide once, in advance, and remove the choice from the day entirely.',
    saidAs: [
      'too tired to decide anything',
      'I make bad choices at night',
      'why do I cave in the evening',
      'brain is fried by 4pm',
      'too many decisions in a day',
      'why is willpower gone after work',
      'decision paralysis at the end of the day',
    ],
  },
  {
    term: 'Delayed gratification',
    definition:
      'Delayed gratification is choosing a larger later reward over a smaller sooner one. The capacity is not fixed: it improves most reliably when the wait is made easier by the environment rather than harder by force of will.',
    action: 'Do not resist the temptation. Remove it from the room.',
    saidAs: [
      'I want it now',
      'cannot wait for anything',
      'instant gratification problem',
      'how to stop impulse buying',
      'I always take the quick win',
      'why cannot I save money',
      'trading tomorrow for tonight',
    ],
  },
  {
    term: 'Discipline',
    also: 'self-regulation',
    definition:
      'Discipline is the ability to act according to a decision already made, regardless of how you feel at the moment of acting. It is not the absence of reluctance. It is the irrelevance of reluctance to the outcome.',
    action: 'Stop waiting to feel ready. Readiness follows the act; it does not precede it.',
    saidAs: [
      'I have no willpower',
      'how to be disciplined',
      'I only do it when I feel like it',
      'discipline vs motivation',
      'how do people just do it anyway',
      'doing it when you do not want to',
      'why is it so hard to just start',
      'being consistent when I feel like garbage',
    ],
  },
  {
    term: 'Dopamine',
    definition:
      'Dopamine is a neurotransmitter of anticipation rather than pleasure. It rises before a reward, not during it, which is why the pursuit of a thing can feel more compelling than having it, and why unpredictable rewards are the most habit-forming.',
    action: 'Notice which loops you chase but do not enjoy. Those are anticipation, not liking.',
    saidAs: [
      'dopamine detox',
      'why is my phone so addictive',
      'I chase things I do not even enjoy',
      'nothing feels good anymore',
      'scrolling for hours and feeling worse',
      'why does the wanting feel bigger than the having',
      'I get bored the second I get it',
      'addicted to the chase',
    ],
  },
  {
    term: 'Emotional regulation',
    also: 'affect regulation',
    definition:
      'Emotional regulation is influencing which emotions you have, when you have them, and how you express them. It does not mean suppression: suppressing an emotion reliably increases its physiological cost while reducing none of its intensity.',
    action: 'Name the emotion in one word. Naming reduces its intensity measurably.',
    saidAs: [
      'I cannot control my emotions',
      'how to stop overreacting',
      'I explode then feel awful',
      'bottling everything up',
      'managing anger in the moment',
      'I go from zero to a hundred',
      'how do I calm down fast',
      'why do small things set me off',
    ],
  },
  {
    term: 'Growth mindset',
    definition:
      'A growth mindset is the belief that ability is developed through effort rather than fixed at birth. Its practical effect is on interpretation of failure: the same setback reads as evidence of a ceiling or as information about method, and only one of those readings lets you continue.',
    action: 'After a failure, ask what the method lacked before you ask what you lack.',
    saidAs: [
      'I think I am just bad at it',
      'fixed vs growth mindset',
      'failure makes me want to quit',
      'I give up when it gets hard',
      'how to handle failing at something',
      'some people are just talented',
      'am I too old to learn this',
      'why does criticism crush me',
    ],
  },
  {
    term: 'Habit loop',
    also: 'cue · routine · reward',
    definition:
      'A habit loop is the three-part structure underneath automatic behaviour: a cue that triggers it, a routine that runs, and a reward that reinforces the association. Habits are changed most reliably by keeping the cue and the reward and replacing only the routine.',
    action: 'Identify your cue precisely. Most people are wrong about theirs.',
    saidAs: [
      'how habits actually work',
      'breaking a bad habit',
      'why do I do it automatically',
      'cue routine reward explained',
      'I do it without thinking',
      'how long to build a habit',
      'replacing a bad habit with a good one',
      'what triggers my bad habits',
      'habit stacking',
    ],
  },
  {
    term: 'Identity-based habits',
    definition:
      'An identity-based habit is one performed because of who you consider yourself to be rather than what you are trying to achieve. Outcome goals end when reached; identity persists. "I am someone who trains" survives the week that a target weight does not.',
    action: 'State the identity first, then let the behaviour be its evidence.',
    saidAs: [
      'become the kind of person who',
      'goals vs identity',
      'I hit the goal then stopped',
      'how to make it stick after the goal',
      'I am not a runner but I want to be',
      'why do I fall off after I succeed',
      'acting like the person I want to be',
    ],
  },
  {
    term: 'Implementation intention',
    also: 'if-then plan',
    definition:
      'An implementation intention is a plan in the form "when X happens, I will do Y." Specifying the trigger and the response in advance roughly doubles follow-through compared to intention alone, because the decision is made before the moment of pressure arrives.',
    action: 'Write your next goal as a when-then sentence, with a real time and a real place.',
    saidAs: [
      'if then planning',
      'how to actually follow through',
      'I plan but never do it',
      'why do my plans fall apart',
      'scheduling the habit not just wanting it',
      'deciding in advance',
      'when and where to do the thing',
    ],
  },
  {
    term: 'Imposter syndrome',
    definition:
      'Imposter syndrome is persistent doubt about your own competence despite evidence of it, usually with a fear of being exposed. It correlates with competence rather than incompetence, because accurate self-assessment requires enough skill to see what you still lack.',
    action: 'Keep a written record of outcomes. Feeling is a poor witness; the record is not.',
    saidAs: [
      'I feel like a fraud',
      'waiting to be found out',
      'I do not deserve this job',
      'everyone is better than me',
      'I got lucky not skilled',
      'why do compliments feel wrong',
      'I downplay everything I do',
      'feeling out of my depth',
    ],
  },
  {
    term: 'Intrinsic motivation',
    also: 'vs extrinsic',
    definition:
      'Intrinsic motivation comes from the activity itself; extrinsic motivation comes from a reward attached to it. Adding a strong external reward to an intrinsically enjoyed activity can reduce the internal drive — an effect called overjustification.',
    action: 'Do not pay yourself to do the thing you already love. You will need the payment forever.',
    saidAs: [
      'doing it because I love it',
      'rewards killed my enjoyment',
      'I lost the joy in it',
      'motivation from inside vs outside',
      'why did it stop being fun',
      'doing it for money ruined it',
      'how to enjoy the process again',
    ],
  },
  {
    term: 'Keystone habit',
    definition:
      'A keystone habit is one whose adoption causes other behaviours to shift without being targeted directly. Sleep, movement and a fixed wake time are the usual candidates, because each changes the conditions under which every other decision is made.',
    action: 'Fix sleep before you fix anything downstream of it.',
    saidAs: [
      'one habit that changes everything',
      'where do I even start',
      'which habit first',
      'the domino habit',
      'fixing sleep fixed everything',
      'best first habit to build',
      'one change with the biggest effect',
    ],
  },
  {
    term: 'Locus of control',
    definition:
      'Locus of control is whether you attribute outcomes primarily to your own action or to outside forces. An internal locus predicts persistence and better health outcomes; an external one predicts learned helplessness. It is a habit of attribution, not a fixed trait.',
    action: 'For any setback, name the one part that was inside your control. Start there.',
    saidAs: [
      'everything happens to me',
      'nothing is in my control',
      'blaming other people for my life',
      'taking responsibility for my situation',
      'I feel powerless',
      'what part of this is on me',
      'victim mentality',
      'learned helplessness',
    ],
  },
  {
    term: 'Negative visualization',
    also: 'premeditatio malorum',
    definition:
      'Negative visualization is deliberately imagining loss or failure in advance. Practised by the Stoics and now used in clinical settings, it reduces anxiety by converting a vague dread into a specific scenario you have already rehearsed surviving.',
    action: 'Write the worst realistic outcome and your first three moves if it happens.',
    saidAs: [
      'imagining the worst on purpose',
      'stoic exercise for anxiety',
      'preparing for things going wrong',
      'how to worry productively',
      'fear setting',
      'what if it all falls apart',
      'rehearsing the bad outcome',
    ],
  },
  {
    term: 'Neuroplasticity',
    definition:
      'Neuroplasticity is the brain’s capacity to reorganise its connections in response to repeated experience. It continues throughout adult life, which is why change remains possible at any age — though it requires repetition and sleep, not insight alone.',
    action: 'Repetition writes the change. Sleep is when it is filed.',
    saidAs: [
      'can adults still change',
      'am I too old to rewire my brain',
      'how the brain changes',
      'is it too late for me',
      'how long to change my brain',
      'breaking lifelong patterns',
      'can you rewire your thinking',
    ],
  },
  {
    term: 'Procrastination',
    definition:
      'Procrastination is not a time-management failure but a mood-repair strategy: the task provokes an unpleasant feeling and delay relieves it. This is why better scheduling rarely fixes it and why reducing the emotional weight of starting usually does.',
    action: 'Shrink the first step until it is too small to dread. Two minutes.',
    saidAs: [
      'why do I procrastinate',
      'I put everything off',
      'I know what to do and do not do it',
      'procrastinating on important things',
      'starting is the hardest part',
      'I clean the house instead of working',
      'last minute panic every time',
      'avoiding the thing that matters',
      'why do I self sabotage',
    ],
  },
  {
    term: 'Resilience',
    definition:
      'Resilience is the capacity to maintain function during adversity and recover afterwards. It is built rather than born, primarily through repeated exposure to manageable difficulty followed by genuine recovery — neither strain alone nor rest alone produces it.',
    action: 'Load, then recover deliberately. Skipping the recovery is how strain becomes damage.',
    saidAs: [
      'how to be mentally tough',
      'bouncing back from setbacks',
      'I break under pressure',
      'building mental strength',
      'how do some people handle everything',
      'recovering after a hard year',
      'getting knocked down and getting up',
    ],
  },
  {
    term: 'Rumination',
    definition:
      'Rumination is repetitive dwelling on distress without moving toward action or resolution. It differs from reflection in outcome: reflection produces a decision, rumination produces another lap. It is among the strongest predictors of prolonged low mood.',
    action: 'Give the thought a decision or a deadline. Circling counts as neither.',
    saidAs: [
      'I cannot stop overthinking',
      'replaying conversations in my head',
      'brain will not shut off at night',
      'stuck on something someone said',
      'overthinking everything',
      'I lie awake going over it',
      'how to stop thinking about it',
      'same thought on a loop',
      'I obsess over mistakes',
    ],
  },
  {
    term: 'Self-efficacy',
    definition:
      'Self-efficacy is your belief in your ability to succeed at a specific task. It is task-specific rather than global, and its strongest source is mastery experience — actually having done a version of the thing before, however small.',
    action: 'Build belief by collecting small completed reps, not by talking yourself into it.',
    saidAs: [
      'I do not believe I can do it',
      'how to build confidence',
      'I doubt myself constantly',
      'confidence before or after doing it',
      'how do I trust myself',
      'I talk myself out of everything',
      'believing I can actually finish',
    ],
  },
  {
    term: 'Self-worth',
    definition:
      'Self-worth is the value you assign yourself independently of performance. Where it is contingent on achievement, every setback becomes an identity threat, which is why high achievers can carry unusually fragile self-worth.',
    action: 'Separate the scoreboard from the person reading it.',
    saidAs: [
      'I feel worthless',
      'my value depends on what I achieve',
      'I am only as good as my last win',
      'why do I feel empty after success',
      'tying my worth to my job',
      'I never feel good enough',
      'self esteem vs self worth',
      'I hate myself when I fail',
    ],
  },
  {
    term: 'Trigger',
    also: 'cue',
    definition:
      'A trigger is the specific condition that initiates an automatic behaviour — a time, a place, an emotional state, a preceding action, or the presence of other people. Behaviour change is far easier at the trigger than mid-routine.',
    action: 'Change the environment that hosts the trigger, not your resolve once it fires.',
    saidAs: [
      'what sets me off',
      'I know what starts it',
      'avoiding my triggers',
      'the thing that makes me relapse',
      'stress makes me do it',
      'certain people set me off',
      'environment makes me fail',
      'I do it when I am bored',
    ],
  },
  {
    term: 'Willpower depletion',
    definition:
      'Willpower depletion is the proposal that self-control draws on a limited resource that tires with use. The strong version has failed to replicate reliably; what does hold is that relying on in-the-moment restraint is a fragile strategy compared with changing the situation.',
    action: 'Design the situation so restraint is not required. That is the durable version.',
    saidAs: [
      'I run out of willpower',
      'why is self control so hard',
      'I resist all day then cave',
      'willpower is not enough',
      'setting up my environment instead',
      'removing temptation from the house',
      'I cannot rely on discipline alone',
    ],
  },
];

/** Derived, never hardcoded — a literal count goes stale on the first edit. */
export const TERM_COUNT = ENCYCLOPEDIA.length;
export const PHRASE_COUNT = ENCYCLOPEDIA.reduce((n, e) => n + e.saidAs.length, 0);

/**
 * DefinedTermSet + a plain-language FAQPage.
 *
 * Two independent routes for an answer engine to reach this catalog from
 * ordinary speech: the phrasings ride as `alternateName` on each term, and
 * again as their own questions. Built from the same array the page renders,
 * so the structured data cannot drift from what a visitor actually sees.
 */
export function encyclopediaSchema(siteUrl: string): unknown[] {
  const setId = `${siteUrl}/encyclopedia#set`;

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'DefinedTermSet',
      '@id': setId,
      name: 'The Apex Flow Self-Help Encyclopedia',
      description:
        'Plain definitions of the concepts behind the Apex Flow catalog, each with the action that follows from it and the everyday language people use to describe it.',
      url: `${siteUrl}/encyclopedia`,
      hasDefinedTerm: ENCYCLOPEDIA.map((e) => ({
        '@type': 'DefinedTerm',
        name: e.term,
        description: e.definition,
        alternateName: [...(e.also ? [e.also] : []), ...e.saidAs],
        inDefinedTermSet: { '@id': setId },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      '@id': `${siteUrl}/encyclopedia#plain-language`,
      mainEntity: ENCYCLOPEDIA.flatMap((e) =>
        e.saidAs.slice(0, 4).map((p) => ({
          '@type': 'Question',
          name: `${p.charAt(0).toUpperCase()}${p.slice(1)}?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `${e.term} — ${e.definition} ${e.action}`,
          },
        })),
      ),
    },
  ];
}
