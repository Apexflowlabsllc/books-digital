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
  /** The one-line gut-punch version of the definition — the same fact the
   *  books themselves land in one aggressive sentence. Optional: only entries
   *  mined directly from real chapter text carry one, so this never becomes
   *  a template filled in for its own sake. */
  hook?: string;
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
  {
    term: 'Trauma bonding',
    also: 'betrayal bond',
    definition:
      'A trauma bond is an attachment formed through cycles of harm followed by relief. The intermittent reward pattern is the same one that makes gambling compulsive, which is why leaving can feel physically unbearable even when you know the relationship is damaging you.',
    action: 'Track the cycle in writing for two weeks. Seeing the pattern on paper breaks its spell faster than willpower does.',
    saidAs: [
      'why do I keep going back to him',
      'I know he is bad for me but I cannot leave',
      'why does leaving feel like withdrawal',
      'addicted to someone who hurts me',
      'the good days keep me stuck',
      'I miss someone who treated me badly',
      'why is it so hard to leave a toxic relationship',
      'trauma bond or love',
      'hot and cold relationship why',
    ],
  },
  {
    term: 'Gaslighting',
    also: 'reality distortion',
    definition:
      'Gaslighting is a pattern where someone repeatedly denies your perception of events until you doubt your own memory and judgement. The tell is not one argument but a cumulative effect: you start recording conversations or asking other people whether you are being unreasonable.',
    action: 'Keep a dated written record of what was said. The record is the antidote, because the tactic depends on memory being contestable.',
    saidAs: [
      'am I crazy or is he lying',
      'I do not trust my own memory anymore',
      'they say it never happened',
      'why do I always end up apologising',
      'I feel like I am losing my mind',
      'he twists everything I say',
      'how do I know if I am being gaslit',
      'I second guess everything now',
    ],
  },
  {
    term: 'Self-sabotage',
    definition:
      'Self-sabotage is behaviour that undermines a goal you consciously hold. It is usually protective rather than irrational: the sabotage prevents an outcome some part of you finds threatening, such as visibility, responsibility, or having no excuse left.',
    action: 'Ask what success would cost you. The answer is almost always what the sabotage is protecting.',
    saidAs: [
      'why do I ruin things when they are going well',
      'I quit right before it works',
      'I always mess it up myself',
      'afraid of my own success',
      'why do I procrastinate on things I want',
      'I push away good things',
      'I get close then blow it up',
      'why do I self destruct',
    ],
  },
  {
    term: 'Nervous system regulation',
    also: 'window of tolerance',
    definition:
      'Regulation is keeping your physiological arousal inside the range where you can still think clearly — not so activated you cannot reason, not so shut down you cannot act. It is trained through the body first: breath, movement, sleep and safety, rather than through insight.',
    action: 'Lengthen your exhale beyond your inhale for two minutes. The body leads the mind, not the reverse.',
    saidAs: [
      'why am I always on edge',
      'I cannot calm down',
      'my body reacts before I can think',
      'constant fight or flight',
      'I go numb under stress',
      'how to calm my nervous system',
      'why do I panic over small things',
      'stuck in survival mode',
      'panic attacks out of nowhere',
      'I cannot relax even when nothing is wrong',
      'my chest goes tight for no reason',
    ],
  },
  {
    term: 'Hypervigilance',
    definition:
      'Hypervigilance is a permanently raised threat-detection setting, learned in an environment where danger was unpredictable. It reads neutral cues as warnings, which is exhausting and makes rest feel unsafe rather than restorative.',
    action: 'Name three things in the room that are actually safe, out loud. Orienting is how the system stands down.',
    saidAs: [
      'I am always waiting for something bad',
      'I read every tone of voice',
      'cannot relax even when things are fine',
      'always scanning for danger',
      'why am I so jumpy',
      'I brace for bad news constantly',
      'exhausted from being alert all the time',
    ],
  },
  {
    term: 'People-pleasing',
    also: 'fawn response',
    definition:
      'People-pleasing is a threat response, not a personality trait. Where conflict was historically dangerous, appeasing became the fastest route to safety, and the habit outlives the danger — showing up as agreement you do not mean and resentment you cannot explain.',
    action: 'Say one honest no this week and let the discomfort pass without repairing it.',
    saidAs: [
      'I cannot say no',
      'I agree to things I do not want to do',
      'why do I apologise so much',
      'I make myself smaller around people',
      'conflict terrifies me',
      'I go along to keep the peace',
      'why do I feel responsible for everyone\'s mood',
      'fawn response',
    ],
  },
  {
    term: 'Codependency',
    definition:
      'Codependency is organising your own wellbeing around managing someone else\'s. It often looks like devotion and functions like control, because your stability depends on regulating their behaviour or their mood.',
    action: 'Ask what you would do this week if their reaction were not a factor. Then do one of those things.',
    saidAs: [
      'I lose myself in relationships',
      'their mood runs my day',
      'I cannot be happy if they are upset',
      'why do I fix everyone',
      'I do not know what I want anymore',
      'enmeshed with my partner',
      'I feel responsible for their feelings',
    ],
  },
  {
    term: 'No contact',
    also: 'grey rock',
    definition:
      'No contact is a boundary of complete disengagement, used where a relationship cannot be made safe. Grey rock is its partial form for situations that cannot be fully exited — co-parenting, work — where you become deliberately unrewarding to engage with.',
    action: 'Decide in advance what you will do when they make contact, so the decision is not made under pressure.',
    saidAs: [
      'should I go no contact',
      'how to cut someone off completely',
      'he keeps contacting me',
      'grey rock method',
      'how to stop responding to my ex',
      'cutting off a family member',
      'I broke no contact again',
      'how long does no contact take',
    ],
  },
  {
    term: 'Love bombing',
    definition:
      'Love bombing is an intense, accelerated display of attention and affection early in a relationship. Its function is to create attachment faster than judgement can operate, which is why the contrast when it stops feels like withdrawal rather than a normal adjustment.',
    action: 'Slow the pace deliberately. Anything genuine survives being taken slowly.',
    saidAs: [
      'it moved so fast',
      'he was perfect at first then changed',
      'why did they lose interest suddenly',
      'too much too soon relationship',
      'intense beginning then cold',
      'was it love bombing',
      'he called me his soulmate in two weeks',
    ],
  },
  {
    term: 'Emotional flashback',
    definition:
      'An emotional flashback is the sudden return of the feeling-state of an old experience without a clear memory attached. It presents as a disproportionate reaction to a small trigger, which is why it is so often mistaken for simply overreacting.',
    action: 'Say today\'s date out loud. Anchoring to now is what ends it — the feeling is old, the moment is not.',
    saidAs: [
      'why do I overreact to small things',
      'I feel like a child again suddenly',
      'huge reaction out of nowhere',
      'old feelings come flooding back',
      'why does this tiny thing wreck me',
      'triggered but I do not know why',
    ],
  },
  {
    term: 'Shame versus guilt',
    definition:
      'Guilt says I did something bad; shame says I am something bad. Guilt is workable because it points at an action you can repair. Shame is paralysing because it indicts the whole person and offers nothing to fix.',
    action: 'Restate the shame sentence as a guilt sentence. Then repair the action it names.',
    saidAs: [
      'I feel worthless not just wrong',
      'why do I hate myself after mistakes',
      'difference between shame and guilt',
      'I feel like a bad person',
      'cannot forgive myself',
      'toxic shame',
      'I am the problem',
    ],
  },
  {
    term: 'Grief',
    also: 'ambiguous loss',
    definition:
      'Grief is the response to losing something that mattered, and it does not require a death. Ambiguous loss — a living person you cannot have, a future that will not happen — is harder precisely because nothing socially marks it as a loss worth grieving.',
    action: 'Name the loss precisely. Unnamed grief presents as depression and does not resolve.',
    saidAs: [
      'why am I so sad when nobody died',
      'grieving someone still alive',
      'mourning a relationship',
      'I lost the future I planned',
      'why does this hurt like a death',
      'grieving who they could have been',
      'how long does grief last',
    ],
  },
  {
    term: 'Burnout',
    definition:
      'Burnout is exhaustion, cynicism and reduced effectiveness caused by prolonged demand without adequate recovery. It is a systems problem rather than a character weakness, which is why rest alone does not resolve it if the conditions producing it are unchanged.',
    action: 'Change one condition, not just your recovery. Resting inside the same load refills a bucket with a hole in it.',
    saidAs: [
      'I have nothing left to give',
      'dread going to work',
      'exhausted no matter how much I sleep',
      'I used to care and now I do not',
      'burnt out but cannot stop',
      'why does rest not help anymore',
      'am I burnt out or depressed',
    ],
  },
  {
    term: 'Perfectionism',
    definition:
      'Perfectionism is using an unreachable standard as protection against judgement. It reliably reduces output, because unstarted work cannot be criticised and unfinished work is never final — which is the actual purpose it serves.',
    action: 'Ship one thing at eighty percent this week and let it be seen.',
    saidAs: [
      'nothing I do is good enough',
      'I cannot finish anything',
      'I redo it a hundred times',
      'afraid to show my work',
      'perfectionism is ruining my life',
      'I never start because it will not be perfect',
      'high standards or procrastination',
    ],
  },
  {
    term: 'Scarcity mindset',
    definition:
      'Scarcity is a mode of thinking produced by not having enough, which narrows attention onto the immediate shortfall and reduces the mental bandwidth available for long-range decisions. It is a consequence of conditions, not a personal failing.',
    action: 'Automate one long-range decision so it stops competing with today\'s shortage for attention.',
    saidAs: [
      'I cannot think past this month',
      'money stress makes me stupid',
      'always in survival mode financially',
      'why do I make bad money decisions when broke',
      'cannot plan ahead',
      'scarcity mindset money',
    ],
  },
  {
    term: 'Financial shame',
    definition:
      'Financial shame is treating your bank balance as a verdict on your worth. It causes avoidance — unopened statements, unchecked balances — which reliably makes the underlying situation worse and then deepens the shame.',
    action: 'Look at the real number today. Avoidance is the expensive part, not the number.',
    saidAs: [
      'I am ashamed of my debt',
      'cannot look at my bank account',
      'I avoid opening bills',
      'embarrassed about money',
      'feel like a failure financially',
      'everyone else has it together',
      'money makes me feel worthless',
    ],
  },
  {
    term: 'Purpose',
    definition:
      'Purpose is a direction that organises effort, not a single destination discovered once. It is built from what you repeatedly move toward rather than found by introspection, which is why waiting to feel it before acting reliably fails.',
    action: 'Follow the thing you keep returning to, before you have a story explaining why.',
    saidAs: [
      'I do not know what I am doing with my life',
      'how do I find my purpose',
      'feel like I am drifting',
      'what am I even for',
      'everyone else has a passion',
      'how to find meaning',
      'I have no direction',
      'is it too late to change direction',
      'I have no idea what I actually want',
      'I do not want anything anymore',
    ],
  },
  {
    term: 'Flow state',
    definition:
      'Flow is complete absorption in an activity where challenge and skill are closely matched. It requires clear goals, immediate feedback and no interruption — which is why it is nearly impossible in an environment designed to interrupt you.',
    action: 'Remove the interruptions before you try to concentrate harder. Attention is a condition, not an effort.',
    saidAs: [
      'how to get in the zone',
      'I cannot focus for more than ten minutes',
      'deep work',
      'why can I never concentrate',
      'best conditions for focus',
      'losing track of time working',
      'distracted every five minutes',
    ],
  },
  {
    term: 'Deliberate practice',
    definition:
      'Deliberate practice is repetition targeted specifically at what you cannot yet do, with immediate feedback. Ordinary repetition of what you already do well produces comfort and very little improvement, which is why long experience and high skill so often diverge.',
    action: 'Practise the part you are worst at, not the part that feels good.',
    saidAs: [
      'why am I not improving',
      'been doing this for years and stuck',
      'practice but no progress',
      'how to actually get better at something',
      'plateau in a skill',
      'experience but not skilled',
    ],
  },
  {
    term: 'Emotional sovereignty',
    definition:
      'Sovereignty is the state where your emotional condition is not controlled by another person\'s behaviour. It is not detachment — you still feel the impact — but their mood stops functioning as the input that determines yours.',
    action: 'Notice one moment today where you handed someone your state. Take it back without announcing it.',
    saidAs: [
      'they ruin my whole day',
      'why do I let people affect me so much',
      'how to stop caring what they think',
      'his mood controls the house',
      'I cannot be okay if they are not',
      'emotional independence',
      'taking my power back',
    ],
  },
  {
    term: 'Identity reconstruction',
    definition:
      'Identity reconstruction is deliberately rebuilding who you are after a period that dismantled the previous version — a divorce, an addiction, a collapse. It works forwards through behaviour rather than backwards through recovering the old self, which no longer fits.',
    action: 'Choose one behaviour the new version does daily, and do it before you feel like that person.',
    saidAs: [
      'I do not know who I am anymore',
      'rebuilding my life from scratch',
      'who am I without them',
      'starting over at 40',
      'lost myself completely',
      'how to reinvent yourself',
      'I want to become a different person',
    ],
  },
  {
    term: 'Dissociation',
    also: 'numbing',
    definition:
      'Dissociation is a protective disconnection from thoughts, feelings or surroundings under overwhelming stress. It is effective in the moment and costly over time, because a system that switches off under pressure also switches off during ordinary life.',
    action: 'Ground through the senses: five things you can see, four you can touch. Reconnection is physical.',
    saidAs: [
      'I feel numb all the time',
      'like I am watching myself',
      'spacing out constantly',
      'nothing feels real',
      'I go blank in arguments',
      'why can I not feel anything',
      'checked out emotionally',
      'autopilot all day',
    ],
  },
  {
    term: 'Anger as signal',
    definition:
      'Anger is information that a boundary has been crossed or a need is unmet. Treated as a fault it gets suppressed and re-emerges as resentment or collapse; treated as data it identifies precisely what needs addressing.',
    action: 'Ask what line was crossed. Anger is almost always pointing at a specific one.',
    saidAs: [
      'why am I so angry all the time',
      'I explode over nothing',
      'angry but I do not know why',
      'is my anger a problem',
      'I suppress my anger then blow up',
      'resentment building up',
      'how to use anger productively',
    ],
  },
  {
    term: 'Attachment style',
    also: 'anxious · avoidant · secure',
    definition:
      'Attachment style is the pattern you default to when closeness is at stake, learned early and revised through experience. Anxious pursues under threat, avoidant withdraws, and the pairing of the two produces the chase-and-retreat cycle most people mistake for chemistry.',
    action: 'Notice which direction you move when things get tense. That direction is the pattern, not the person.',
    saidAs: [
      'why do I get clingy',
      'I push people away when they get close',
      'anxious attachment',
      'avoidant partner',
      'why do I chase unavailable people',
      'he pulls away when I get closer',
      'what is my attachment style',
      'secure relationships feel boring',
    ],
  },
  {
    term: 'Radical acceptance',
    definition:
      'Radical acceptance is acknowledging reality as it is, without approving of it. It is not resignation: refusing to accept a situation keeps energy locked in protest, whereas accepting it frees that energy for whatever action is actually available.',
    action: 'Say what is true out loud without adding should. Then decide what to do about it.',
    saidAs: [
      'I cannot accept what happened',
      'it is not fair',
      'why me',
      'how to accept something terrible',
      'stuck fighting reality',
      'I keep wishing it were different',
      'letting go of what I cannot change',
    ],
  },

  /* ── Mined directly from the catalog's own chapter text, not written to
   * fill a template. Each of these is a real, recurring mechanism the 90-day
   * books name and work — the phrasing below is theirs, not invented for
   * this page. */

  {
    term: 'Undefined standard',
    also: 'vague goals',
    definition:
      'An undefined standard is a goal with no line you can point to and say "past this, I did it." "Get healthier" and "be more disciplined" are undefined — there is no day you clearly failed, so there is also no day you clearly won. A floor ends the negotiation; an undefined standard just lets the mood vote every morning.',
    action: 'Rewrite one goal as a number you either hit or missed today. No adjectives.',
    hook: 'The problem was never that you lack discipline. The problem is you never wrote down what discipline would even mean by five o’clock today.',
    saidAs: [
      'I never know if I actually did enough',
      'my goals are too vague to fail or succeed at',
      'how do I know if I am making progress',
      'why do I keep moving the goalposts on myself',
      'I say I want to be better but better than what',
      'how to set a goal I cannot talk my way out of',
      'I always find a way to tell myself today still counted',
    ],
  },
  {
    term: 'Productive procrastination',
    also: 'planning as avoidance',
    definition:
      'Productive procrastination is doing real, effortful work that is not the work that matters, because it produces the feeling of progress without the risk of failing at the thing you actually need to do. Reorganizing the plan, color-coding the spreadsheet, and researching the "best" way to start are the most common versions — they look like diligence and function as a hiding place.',
    action: 'Before you plan anything else today, do ten unplanned minutes of the actual task first.',
    hook: 'You spent two hours on the font. The font did not cut your debt.',
    saidAs: [
      'I spend all my time planning and never doing',
      'why do I organize instead of work',
      'I feel productive but nothing gets finished',
      'I have a graveyard of spreadsheets and no results',
      'researching how to start instead of starting',
      'I confuse being busy with making progress',
      'why does preparing to work feel like working',
    ],
  },
  {
    term: 'Emotional inventory management',
    also: 'over-functioning in shallow relationships',
    definition:
      'Emotional inventory management is spending real attention and energy managing the feelings of people who take up space in your life without actually being close to you — the acquaintance who guilt-trips, the group chat that never says anything, the relative who only calls with a request. It crowds out the small number of relationships that would actually catch you.',
    action: 'Name the three people who would bail you out of jail. Notice how long it has been since you called any of them, and call one today.',
    hook: 'You have a hundred and fifty people in your phone and three of them would bail you out of jail. You know which three. You have not called them in a month.',
    saidAs: [
      'I am close to nobody but exhausted by everyone',
      'why do I have so many acquaintances and no real friends',
      'I manage everyone else’s feelings and nobody manages mine',
      'I feel guilty for not calling people I do not even like',
      'how do I stop being everyone’s emotional support with nothing left for myself',
      'I keep the wrong people close and take the right ones for granted',
    ],
  },
  {
    term: 'Pre-finish relapse urge',
    also: 'backsliding before the finish line',
    definition:
      'The pre-finish relapse urge is the pull to abandon a commitment in its final stretch, right when the old pattern would be easiest to justify and hardest to notice. It rarely arrives as a dramatic collapse — it shows up as one small, reasonable-sounding exception a day or two before the finish line, precisely when momentum feels safest to spend.',
    action: 'In the last few days of anything you are finishing, expect one plausible-sounding exception to show up, and treat it as the test, not a reasonable request.',
    hook: 'This is the moment you were warned about. Not a dramatic collapse — a four-second flicker where the old reflex says it costs nothing. It cost you three years last time.',
    saidAs: [
      'why do I want to quit right before I finish something',
      'I sabotage myself right at the end',
      'the closer I get to done the more I want to stop',
      'why does the last mile feel like the hardest one',
      'I gave up right before it would have worked',
      'how do I stay disciplined in the final stretch',
    ],
  },
  {
    term: 'Complacency plateau',
    also: 'the comfortable stall',
    definition:
      'The complacency plateau is the stretch where standing still has gone on long enough that it starts to feel like peace instead of what it is — a stall. The body and the nervous system adapt to the new, lower baseline, which is exactly what makes it dangerous: it stops registering as a problem.',
    action: 'Name one metric that has not moved in 30 days. That is the plateau. Pick the smallest possible action that would move it this week.',
    hook: 'Nobody warns you that the plateau is not a gentle rest stop. It is a trap designed by your own biology.',
    saidAs: [
      'I have not made progress in months and I do not know why',
      'I got comfortable and stopped improving',
      'how do I tell the difference between resting and stalling',
      'why does standing still start to feel okay',
      'I plateaued and do not know how to get moving again',
      'how do I break out of a rut that does not feel like a rut',
    ],
  },
  {
    term: 'Zero-exception restart',
    also: 'the no-makeup-day rule',
    definition:
      'A zero-exception restart is a habit-recovery rule that treats every missed day the same way regardless of the excuse attached to it: the streak goes back to zero, with no doubling up and no picking back up where it left off. It works because the instant a system allows reasonable exceptions, every future lapse gets reclassified as reasonable, and the rule stops being a rule.',
    action: 'Write the restart rule down before you need it, and when you break it, go back to day one instead of negotiating a makeup day.',
    hook: 'The exception is never the last one. It is the sample size for every exception that comes after it.',
    saidAs: [
      'I always tell myself I will double up tomorrow',
      'one missed day turns into a week every time',
      'why does skipping once always turn into quitting',
      'I keep giving myself a pass and it never stops at one',
      'how do I actually keep a streak going',
      'I negotiate with myself and always win the wrong argument',
      'starting over feels worse than just not trying again',
    ],
  },
  {
    term: 'First-task momentum',
    also: 'morning mode-lock',
    definition:
      'First-task momentum is the tendency for whatever mode your first completed action of the day belongs to, reactive or self-directed, to carry forward for hours afterward. Opening the day by answering a message, a feed, or a notification that came from someone else locks in a reactive posture; opening it with something chosen in advance locks in a directed one, and the difference compounds by noon.',
    action: 'Before you open anything that came from someone else, finish one small piece of work that belongs only to you.',
    hook: 'The first thing you finish decides who is driving for the next four hours, you or your notifications.',
    saidAs: [
      'why does checking my phone first thing ruin my whole morning',
      'I lose the day before I even start it',
      'how I open my morning decides how the whole day goes',
      'messages from other people set my mood before I even start my day',
      'why am I reactive all day if I start on my phone',
      'starting my day with my own task instead of email',
      'the first hour sets the tone for everything after',
    ],
  },
  {
    term: 'Best-day reverse engineering',
    also: 'the ceiling audit',
    definition:
      'Best-day reverse engineering is treating your single best day of performance as a specification to copy rather than a stroke of luck to remember fondly. Most people credit a great day to mood or energy and never examine what time they woke, what they ate, or what order they worked in, so the conditions that produced it are never deliberately rebuilt.',
    action: 'Write down your best day hour by hour, then copy its structure on purpose instead of waiting to feel that way again.',
    hook: 'You keep waiting for that day to come back around. It was never luck. It was a recipe, and you never wrote it down.',
    saidAs: [
      'why cannot I have more days like my best day',
      'I do not know what I did differently on my good days',
      'some days everything just clicks and I do not know why',
      'chasing the feeling of a great day instead of the routine behind it',
      'how do I make my best day the normal day',
      'I treat my good days like luck instead of a pattern',
    ],
  },
  {
    term: 'Self-trust ledger',
    also: 'track record with yourself',
    definition:
      'A self-trust ledger is the running, largely unconscious tally your own mind keeps of promises you made to yourself versus promises you kept. When the ledger runs negative for long enough, your brain stops believing new commitments before you have even broken them, because the record, not the feeling, is what it trusts. The fix is not a bigger promise. It is a small one guaranteed to clear.',
    action: 'Pick a commitment so small you cannot fail it, keep it today, and let that be the only new entry on the ledger.',
    hook: 'The next promise you make to yourself will be judged by the last hundred, not by how much you mean it this time.',
    saidAs: [
      'why do I not trust myself to follow through anymore',
      'I have broken so many promises to myself I stopped believing them',
      'I know I will not do it even while I am saying I will',
      'how do I start believing my own commitments again',
      'I talk myself into things and then do not do them',
      'rebuilding trust with myself after years of not following through',
      'I feel like my own word means nothing anymore',
    ],
  },
  {
    term: 'Reasonable-sounding avoidance',
    also: 'the wisdom voice',
    definition:
      'Reasonable-sounding avoidance is delay or quitting that arrives dressed as good judgment rather than as an urge: I should research this more, I have earned a day off, I will be smarter about it tomorrow. It is most dangerous in the second or third week of a new behavior, after the initial novelty has worn off but before the behavior has become automatic, because a calm-sounding argument to stop is hardest to tell apart from an honest one right at that point.',
    action: 'When the voice offering you an exception sounds unusually reasonable, treat that as the signal to act, not the invitation to reconsider.',
    hook: 'The version of you that wants to quit never sounds desperate. It sounds like the most sensible person in the room.',
    saidAs: [
      'why does quitting always sound so reasonable in the moment',
      'I talk myself out of things using logic that sounds smart',
      'the second week is always when I convince myself to stop',
      'I gave myself a good reason to skip and now I regret it',
      'how do I tell the difference between rest and quitting',
      'my excuses always sound so rational when I am making them',
      'I negotiate myself out of things right when they get boring',
    ],
  },
  {
    term: 'Potential-as-alibi',
    also: 'the unrealized-capacity trap',
    definition:
      'Potential-as-alibi is treating what you are capable of as though it were the same as what you have done, so that being able to do something becomes a substitute for actually doing it. It feels like self-belief but functions as a permanent excuse, because a person who could do something at any time never has to face a day they clearly failed to.',
    action: 'Cross out the word could in your own self-description this week and replace it only with what you actually did.',
    hook: 'Potential is the only asset that grows while you do nothing and turns worthless the day you finally try to spend it.',
    saidAs: [
      'everyone says I have so much potential and it means nothing',
      'I know I could do it, I just have not',
      'being told I am talented never turns into results',
      'I live off what I could accomplish instead of what I have',
      'how do I stop coasting on being capable',
      'potential is not the same as doing the thing and I know it',
      'I am tired of being the person who could have',
    ],
  },
  {
    term: 'Aspirational consumption',
    also: 'the wanting economy',
    definition:
      'Aspirational consumption is watching, reading, or buying material about a change you want to make, in place of making it, because the consumption itself delivers a small, real hit of the same satisfaction the change would. It is a profitable trade for whoever is selling the material: a customer who feels they are already improving has less urgency to ever finish, so the product is quietly built to keep you wanting rather than to let you arrive.',
    action: 'Before you consume one more piece of advice on the subject, do ten unguided minutes of the thing itself.',
    hook: 'You are not behind because you do not know enough. You are behind because knowing became the thing you did instead.',
    saidAs: [
      'why do I watch videos about the change instead of making it',
      'I feel productive after research but nothing actually changes',
      'I know more about this topic than people who are already doing it',
      'buying the course felt like progress and then it was not',
      'I consume content about my goals instead of working on them',
      'the feeling of learning about it is not the same as doing it',
      'I am addicted to preparing and allergic to starting',
    ],
  },
  {
    term: 'Tracking-without-doing',
    also: 'logging as self-deception',
    definition:
      'Tracking-without-doing is the substitution of recording a behavior for performing it: logging a workout that was half done, checking a box for a habit you barely touched, extending a streak on the strength of the entry rather than the act. Habit apps reward the log because the log is what they can measure, which quietly teaches the brain to chase the entry instead of the outcome it was supposed to represent.',
    action: 'Before you log anything today, ask whether you would still check the box if no app were watching.',
    hook: 'The app cannot tell the difference between the rep and the record of the rep. After enough practice, neither can you.',
    saidAs: [
      'I check the habit off even when I barely did it',
      'my streak looks perfect and my actual results do not match it',
      'logging the workout feels like doing the workout',
      'I game my own tracking app without meaning to',
      'why do my numbers look good when nothing is changing',
      'the tracker made me focus on the log instead of the work',
      'I keep the streak alive by cutting corners nobody sees',
    ],
  },
  {
    term: 'Manufactured urgency',
    also: 'the artificial deadline',
    definition:
      'Manufactured urgency is deliberately creating a real cost for inaction when your circumstances do not naturally impose one: a public deadline, a financial penalty, a witness who will ask. People whose survival is already on the line rarely need this, because a missed rent payment or a required check-in supplies the urgency for free. Everyone else has to build the consequence by hand or coast indefinitely on a deadline that only whispers.',
    action: 'Attach one real, uncomfortable cost to your own deadline this week, tell someone, pay someone, or post it publicly, before you need the pressure.',
    hook: 'Nobody sends you a consequence for coasting. If your life will not hand you one, you have to build it yourself, before you need it, not after.',
    saidAs: [
      'I only get things done when there is real pressure',
      'nothing forces my hand so I never actually finish',
      'how do I create urgency when no one is making me',
      'I need consequences or I just let things slide',
      'why do I only follow through when someone else is checking',
      'I work best with a deadline but I never have real ones',
      'I need to raise the stakes on myself on purpose',
    ],
  },
  {
    term: 'Standard drift',
    also: 'baseline vs goal',
    definition:
      'Standard drift is what happens when the target you wrote down stays fixed while the daily minimum you actually accept from yourself keeps eroding underneath it, one small pass unnoticed at a time. Nobody decides all at once to lower the bar. It slips a fraction with every excused day, until the gap between the stated goal and an ordinary Tuesday has quietly become the whole problem.',
    action: 'Name the one daily minimum you have let slide the furthest, and hold it for one week before you touch the bigger goal again.',
    hook: 'Nobody fails a resolution by picking a bad goal. They fail because the ordinary Tuesday underneath it got smaller all year, and in December they only remember writing the goal down.',
    saidAs: [
      'I keep setting the same goal every year and never hitting it',
      'my standards for myself have quietly gotten so much lower',
      'how did good enough become barely acceptable',
      'the goal has not changed but I have, and not in a good way',
      'why do I keep resetting the same target every January',
      'my baseline effort keeps shrinking and I did not notice until now',
      'I lowered the bar so slowly I did not feel it happening',
    ],
  },
  {
    term: 'Symbolic self-completion',
    also: 'the announcement effect',
    definition:
      'Symbolic self-completion is the relief that comes from telling someone about a change you intend to make, which can feel enough like having made it that the actual motivation to follow through quietly drains away. Because the identity you are reaching for gets a small, real boost just from being spoken out loud, the mind treats the announcement as partial payment on a debt the work was supposed to settle.',
    action: 'Keep the plan private until you have something finished to show for it, and describe it to others only in the past tense.',
    hook: 'You told three people about the plan today and did none of it. You already got paid for that conversation, in a currency that does not buy the result.',
    saidAs: [
      'why do I feel done after just telling someone my plan',
      'announcing my goal killed my motivation to actually do it',
      'I got the congratulations before I did any of the work',
      'talking about the plan feels like progress and it is not',
      'I keep telling people what I am going to do instead of doing it',
      'the praise for my intentions took the pressure off finishing',
      'why does saying it out loud make me want to do it less',
    ],
  },
  {
    term: 'Diagnosis as alibi',
    also: 'the permanent exemption',
    definition:
      'Diagnosis as alibi is treating a real label — a condition, a personality type, a documented pattern — not as a starting point to build a system around but as a lifetime exemption from trying. The label is often accurate. The trouble is using its accuracy as proof that no workaround is worth attempting, which turns a description of where you start into a permanent excuse for staying there.',
    action: 'Ask, for the last thing you did not finish: would a workaround built around this actually fail, or did I stop before testing one?',
    hook: 'The diagnosis explains why the ground is icy. It was never a note excusing you from learning to walk on it.',
    saidAs: [
      'I use my diagnosis as a reason to never even try',
      'is this a real limitation or an excuse I have gotten comfortable with',
      'I have turned my condition into a reason to give up in advance',
      'everyone accepts my excuse because it has a clinical name',
      'how do I tell if I actually cannot or I have just decided I cannot',
      'my label explains a lot but it has stopped me from adapting',
      'I hide behind my diagnosis instead of working around it',
    ],
  },
  {
    term: 'Vanity Effort',
    also: 'unmeasured hustle',
    definition:
      'Vanity effort is judging your progress by how hard the day felt — hours in the chair, calls made, exhaustion at the end — instead of checking whether any of it produced a measurable result. It survives because a feeling cannot contradict you while a number can, so effort gets rewarded and the actual output never gets counted.',
    action: 'Pick one thing you did today purely on feel, and write down its actual result as a number before you repeat it tomorrow.',
    hook: 'You did not get worse. You just never once looked at the number that would have told you the truth.',
    saidAs: [
      'I work so hard and nothing changes',
      'why does my effort not match my results',
      'I feel busy all day but nothing actually moves',
      'how do I know if what I am doing is even working',
      'I track hours but never outcomes',
      'I am exhausted and still behind on everything',
      'why do I feel productive when nothing gets finished',
      'I never check my actual numbers, just how the day felt',
      'grinding hard with nothing to show for it',
    ],
  },
  {
    term: 'Velocity Debt',
    also: 'the speed tax',
    definition:
      'Velocity debt is the gap between what a shortcut appears to save and what it actually costs once the skipped step comes due. It compounds silently, since the bill never lands the same day the corner gets cut, so speed keeps looking free until the rework, the breakdown, or the apology arrives all at once.',
    action: 'Name the one corner you keep cutting to move faster, then calculate what it actually cost you the last time it caught up with you.',
    hook: 'The shortcut did not save you ten minutes. It borrowed them, at interest, from the version of you who has to fix it later.',
    saidAs: [
      'why does cutting corners always come back to bite me',
      'I rush everything and it keeps breaking',
      'moving fast and breaking things I actually care about',
      'redoing work I rushed the first time around',
      'I am always in a hurry and always paying for it later',
      'speed is costing me more than it is saving',
      'why do my shortcuts never actually save time in the end',
    ],
  },
  {
    term: 'Readiness Fallacy',
    also: 'waiting to feel like it',
    definition:
      'The readiness fallacy is the belief that motivation or confidence has to arrive before you act, when the sequence actually runs the other way — the feeling of being ready gets manufactured by having already started. Waiting for it guarantees you wait forever, because it only shows up after the first move, never before it.',
    action: 'Do the smallest physical version of the task in the next sixty seconds, before you check whether you feel ready to.',
    hook: 'The feeling was never coming first. It was waiting for you to move so it would finally have something to follow.',
    saidAs: [
      'I never feel ready to start',
      'waiting to feel motivated before I do anything',
      'why does the motivation never show up when I need it',
      'I need to feel in the right headspace before I begin',
      'how do I start something when I do not feel like it',
      'I keep waiting for the right moment to begin',
      'confidence never arrives before I actually need it to',
    ],
  },
  {
    term: 'Borrowed Ceiling',
    also: 'an inherited limit',
    definition:
      'A borrowed ceiling is a performance limit you did not set for yourself — a coach’s verdict, a market average, one bad year — that you quietly re-accept every year without ever revisiting it. It feels like a fact about your capacity, but it is really an old judgment you never scheduled a second opinion on.',
    action: 'Name the specific person or moment that installed your current ceiling, then ask whether that verdict is still true or just still unquestioned.',
    hook: 'Nobody installed a ceiling in your life. You just never scheduled the day you would go back and check if it was still load-bearing.',
    saidAs: [
      'why do I stop at the same level every single year',
      'someone once told me my limit and I still believe them',
      'I keep hitting the same invisible wall in my income or my fitness',
      'why can I not get past this plateau no matter what I try',
      'I accepted a limit years ago and never actually tested it',
      'how do I know if my ceiling is real or just old',
      'I have been the same for years and called it my max',
    ],
  },
  {
    term: 'Command Freeze',
    also: 'the competence-command gap',
    definition:
      'Command freeze is what happens when someone who has spent years being reliably good at following instructions suddenly has to give them, and seizes up, because knowing the job and owning the decision are different muscles. Competence tells you what is correct; command is saying it out loud while the room waits to see if you flinch.',
    action: 'The next time you are the most qualified person in the room and nobody is deciding, say the plan out loud before you feel entitled to.',
    hook: 'You did not forget the job. You just never once practiced being the one who says go.',
    saidAs: [
      'I know the job but freeze the second I am in charge',
      'why can I not make the call when it is actually on me',
      'I am great at following instructions and terrible at giving them',
      'I freeze up the moment I become the one responsible',
      'how do I stop hesitating when everyone is looking at me for the answer',
      'I second-guess myself the instant I am actually in charge',
      'I am competent but I am not a leader yet',
    ],
  },
  {
    term: 'Follow-Through Debt',
    also: 'the strong-start weak-finish pattern',
    definition:
      'Follow-through debt is what other people start charging you once a pattern of strong starts and weak finishes becomes visible — a shift in how they treat your word, not a feeling you carry. Each unreturned call or late delivery seems small alone, but everyone around you runs a private ledger on your reliability, and it closes before you notice you are overdrawn.',
    action: 'Pick the one open commitment you have let go stale the longest, and close it today with no new promise attached to it.',
    hook: 'Nobody decided you were unreliable in one conversation. They decided it the fifth time you said you would call back and did not.',
    saidAs: [
      'why do people stop taking my word seriously',
      'I start strong and never finish',
      'I make a great first impression and then disappear',
      'people stopped following up with me because I stopped following through',
      'why do I get passed over for someone less talented but more reliable',
      'I have a pattern of overpromising and underdelivering',
      'my word does not carry weight anymore and I do not know when that changed',
    ],
  },
  {
    term: 'Visibility Gap',
    also: 'quiet competence going unrewarded',
    definition:
      'The visibility gap is the distance between doing genuinely good, quiet work and assuming the results will speak for themselves. They rarely do — the room tends to reward whoever made sure the work got seen, not whoever did it best, which means silent excellence and being overlooked are usually the same decision wearing two different names.',
    action: 'The next time you finish something you are proud of, tell one person with influence over your future exactly what you did, in one sentence, before the week ends.',
    hook: 'Being right was never the same transaction as being seen. You have been paying for one and expecting a receipt for the other.',
    saidAs: [
      'why does the person who talks more get all the credit',
      'I do great work and nobody notices',
      'I got passed over for someone louder and less capable',
      'being good at my job is not getting me anywhere',
      'why do quiet people get overlooked for promotions',
      'I assumed my results would speak for themselves and they did not',
      'how do I get credit for my work without bragging about it',
    ],
  },
  {
    term: 'Zombie Subscription',
    also: 'the recurring charge you stopped using',
    definition:
      'A zombie subscription is any recurring payment or standing commitment that stopped delivering value months ago but keeps auto-renewing because canceling it means admitting the plan behind it is dead. It costs more than the monthly charge — it is a small, dormant reminder of an abandoned intention, still running quietly through your bank statement and your attention.',
    action: 'Open your bank statement right now and cancel one recurring charge for something you have not used in thirty days.',
    hook: 'The charge is not twelve dollars. It is a monthly invoice for a version of you that quit and never told your bank account.',
    saidAs: [
      'I keep paying for apps and memberships I never use',
      'why can I not cancel things I do not even want anymore',
      'I have subscriptions I forgot I was even paying for',
      'canceling a subscription feels like admitting I failed at something',
      'how much money am I wasting on things I do not use',
      'I keep a gym membership or an app I never actually touch',
      'I keep meaning to audit my subscriptions and never do it',
    ],
  },
  {
    term: 'Open Loop Drain',
    also: 'the Zeigarnik effect',
    definition:
      'Open loop drain is the background mental cost of every small, unfinished task — an unsent form, an unmade call, an unsigned document — sitting open in your head. Each is tiny alone, but the brain keeps a low simmer of attention on anything incomplete, so a dozen open loops can tax focus more than one finished project ever would.',
    action: 'List every unfinished task under ten minutes that has been open longer than a week, and close the oldest one today with no partial credit.',
    hook: 'You are not tired from the work. You are tired from carrying forty unfinished things that only take five minutes each.',
    saidAs: [
      'why am I so tired when I have not even done anything hard',
      'I have a hundred small things half-done and it is exhausting',
      'unfinished tasks weigh on me even when I am not thinking about them',
      'my mental energy is gone and I do not know why',
      'I cannot relax with open loops in my life',
      'small loose ends are draining me more than big projects ever did',
      'why does an unfinished to-do list feel so heavy to carry',
    ],
  },
  {
    term: 'Draft Purgatory',
    also: 'the unsent message',
    definition:
      'Draft purgatory is where a finished message, pitch, or ask goes to die — rewritten, polished, never sent — because sending it turns an imagined maybe into a real answer that might be no. A draft feels safe because it cannot fail yet; every day it sits unsent, it is already costing you the answer you feared.',
    action: 'Find the message you have rewritten the most times, stop editing it, and send the version that already exists right now.',
    hook: 'A draft cannot reject you. That is exactly why it has been sitting there for three weeks doing nothing for either of you.',
    saidAs: [
      'why can I not just hit send on this message',
      'I have a text or an email I have rewritten twenty times',
      'I keep a draft sitting unsent for weeks at a time',
      'I am afraid of the reply so I never send the message',
      'how do I stop overthinking messages before I send them',
      'I would rather not know than get told no',
      'unsent drafts piling up because I am scared of the answer',
    ],
  },
  {
    term: 'Capacity Hoarding',
    also: 'staying full on purpose',
    definition:
      'Capacity hoarding is holding onto low-value obligations — a client who barely pays, a project that is already dead, a commitment nobody would miss — because an empty calendar slot feels like proof you do not have enough going on. It keeps you busy and slow at once: every hour protecting a full schedule is an hour not spent building something that moves.',
    action: 'Name the one commitment on your plate that pays or matters the least, and end it this week without replacing it with anything new.',
    hook: 'A full calendar is not proof you are in demand. Sometimes it is just proof you are afraid of what an empty one would say about you.',
    saidAs: [
      'why do I keep clients or projects that are not worth it',
      'I am afraid of having free time show up on my calendar',
      'staying busy feels safer than being idle even when the busy is pointless',
      'I keep low-value work because quitting it feels like failing',
      'how do I let go of a commitment that is not worth my time',
      'an empty schedule makes me anxious for no reason',
      'I stay overcommitted with things that do not actually matter',
    ],
  },
  {
    term: 'Arrival Fantasy',
    also: 'expecting progress to feel like a finish line',
    definition:
      'The arrival fantasy is expecting progress to feel like a highlight reel — a visible win, a finish line, applause — instead of what it is: the same unglamorous repetition, done again, with nothing to show that day. When the payoff does not arrive on schedule, it convinces you the plateau is a verdict, not just the shape of the work.',
    action: 'The next time a stretch of effort feels flat and unrewarded, write down exactly what you did today, and file it as data instead of a verdict on whether this is working.',
    hook: 'Nobody films the ten thousandth rep. That does not mean it did not count — it means the payoff was never supposed to look like anything.',
    saidAs: [
      'why does progress not feel like progress',
      'I am doing the work and nothing feels like it is paying off',
      'I expected a bigger payoff by now and it never came',
      'how do I know if I hit a real wall or just a boring stretch',
      'I keep waiting for the moment it clicks and it never comes',
      'progress feels invisible and it is making me want to quit',
      'why does consistent effort feel so unrewarding day after day',
    ],
  },
  {
    term: 'Momentum Cliff',
    also: 'stopping at the session finish line',
    definition:
      'A momentum cliff is the moment you hit the end of the work session you had planned and stop completely, instead of pushing a few more minutes while you are still warm. The cost is not the minutes saved by stopping — it is the far larger cost of tomorrow’s restart, which always costs more than the extension would have.',
    action: 'When you hit today’s stopping point and the work is still going fine, add ten more minutes before you let yourself close it out.',
    hook: 'Ten more minutes today costs you ten minutes. The same ten minutes tomorrow costs you the whole restart.',
    saidAs: [
      'why is it so hard to start again once I completely stop',
      'I always quit right at a natural breaking point and regret it later',
      'restarting tomorrow is harder than just finishing a little more today',
      'I stop the second the timer goes off even when I am on a roll',
      'why does my momentum disappear the second I take a break',
      'I never push past the point where the session was supposed to end',
      'stopping cold in the middle of a project makes tomorrow so much harder',
    ],
  },
  {
    term: 'Reactive Morning',
    also: 'receive mode',
    definition:
      'A reactive morning is letting the first input of your day — email, a notification, someone else’s request — make your first decision for you before you’ve made one of your own. Whoever reaches you first sets the tone for the whole day, and by the time you notice, you’re already behind in a race you never agreed to enter.',
    action: 'Before you touch a screen, spend ten minutes on your own priority, not someone else’s. The inbox will still be there; you decide who gets your first attention.',
    saidAs: [
      'I check my phone before I even get out of bed',
      'by the time I’ve had coffee I’ve already lost the day',
      'everyone else gets my best hours',
      'I never get to decide what I think about first',
      'my inbox runs my whole morning',
      'why do I feel behind before I’ve even started',
      'I wake up and immediately start reacting to things',
      'the world gets to me before I get to me',
    ],
    hook: 'Somebody else picked what filled your head first today. You handed them the job without even noticing.',
  },
  {
    term: 'Optimization Theater',
    also: 'performative self-improvement',
    definition:
      'Optimization theater is buying or performing the props of self-improvement — the streak, the supplement, the course, the gadget — instead of doing the plain, boring work they’re supposed to stand in for. It feels like progress because your brain gets a small reward for the gesture, so the actual habit never has to form underneath it.',
    action: 'Drop the tool for a week and do the underlying action by hand — the walk, the page, the sentence — with nothing to show for it but the fact that you actually did it.',
    saidAs: [
      'I have a huge streak on an app I never actually use',
      'I bought the course and never got past module two',
      'why do I feel productive after watching a video instead of doing the thing',
      'I own all the gear but never do the workout',
      'buying the journal felt like progress by itself',
      'I keep paying for programs I don’t finish',
      'does a habit tracker count if I’m not doing the habit',
      'I feel like I’m working on myself but nothing changes',
    ],
    hook: 'You bought the whole kit so you wouldn’t have to do the one free thing that actually works.',
  },
  {
    term: 'Device Proximity Trap',
    also: 'phone within reach',
    definition:
      'The device proximity trap is keeping your phone within arm’s reach through sleep, showers, and meals, so your nervous system never gets an uninterrupted stretch to process anything on its own. The fix isn’t more willpower — it’s distance. A phone in another room can’t be checked on reflex.',
    action: 'Pick one recurring block — sleep, one shower, one meal — and physically put the phone in a different room for it. Not face-down. Not on silent. Gone.',
    saidAs: [
      'I sleep with my phone right next to my head',
      'I can’t shower without checking it',
      'I bring my phone to the dinner table',
      'I panic if my phone isn’t in reach',
      'why can’t I just leave it in another room',
      'I check it even when nothing happened',
      'the phone follows me everywhere in my own house',
      'I need it for the alarm so it has to stay by the bed',
    ],
    hook: 'It was never a willpower problem. It’s a distance problem, and the phone’s sitting six inches from your face all night.',
  },
  {
    term: 'Distracted Presence',
    also: 'half-listening',
    definition:
      'Distracted presence is looking away, checking your phone, or scanning the room while someone is actually talking to you — not from rudeness, but because your nervous system treats sustained attention on one person as a low-grade threat. You’re technically there. You’re not actually there.',
    action: 'Pick one conversation today and hold eye contact for the other person’s entire turn — no glancing at the door, the clock, or the screen.',
    saidAs: [
      'I zone out when people are talking to me',
      'I can’t hold eye contact in conversations',
      'why do I keep looking at my phone while someone’s talking',
      'people say I seem distracted even when I’m listening',
      'I nod along but I’m not really there',
      'I look away first every single time',
      'my mind wanders the second someone starts talking',
      'I feel like I’m never fully present with people anymore',
    ],
    hook: 'Standing in the room was never the same thing as being in the conversation, and they can always tell the difference.',
  },
  {
    term: 'Cyberchondria',
    also: 'symptom googling',
    definition:
      'Cyberchondria is spiraling through hours of search results, forums, and worst-case stories about a symptom instead of calling a doctor. It feels like due diligence, but every new tab adds fear, not information, and the research becomes a way to postpone the one action that would actually resolve anything.',
    action: 'Set a hard stop — one search, ten minutes — then book the appointment instead of reading a tenth article. The call is the action; the scrolling was never going to be.',
    saidAs: [
      'I googled my symptoms and now I think I’m dying',
      'I spent six hours on WebMD about one weird mole',
      'why do I self-diagnose every time something feels off',
      'I can’t stop reading worst-case stories about my symptom',
      'health anxiety spiral at 2am looking things up',
      'I know more about diseases I don’t have than the ones I do',
      'researching my symptoms makes it worse not better',
      'I’d rather read forums than just call the doctor',
    ],
    hook: 'Three imaginary diagnoses deep and you still haven’t called the one person who actually went to medical school.',
  },
  {
    term: 'Invisible Expertise',
    also: 'skill packaging problem',
    definition:
      'Invisible expertise is having real, hard-won skill that you never turn into anything visible — a post, a video, a guide — because you think of it as just the job, not something anyone would pay to learn. The knowledge that took you years to earn disappears the moment you walk away from the work, leaving nothing behind but a paycheck.',
    action: 'Write down one specific mistake you don’t make anymore and the exact fix that stopped it — one sentence. That sentence is the first thing you’ve ever published.',
    saidAs: [
      'I know how to do this but have no idea how to sell it',
      'nobody knows I’m actually good at this',
      'I could teach this but don’t know where to start',
      'why does the guy who knows less than me have the audience',
      'I have the skill but not the platform',
      'how do I turn my trade into content',
      'I’m paid by the hour for knowledge that’s worth more than that',
      'I don’t know how to package what I know',
    ],
    hook: 'What you call "just the job" is worth real money to somebody who hasn’t learned it yet.',
  },
  {
    term: 'Isolated Leverage',
    also: 'single-lever stagnation',
    definition:
      'Isolated leverage is owning several separate pieces of advantage — a skill, a bit of capital, a network, a tool — that never touch each other because you treat each one as a finished trophy instead of a gear in a machine. Nothing compounds because nothing is connected; you have parts, not a system.',
    action: 'Pick your two strongest existing assets and force them to interact this week — use the skill to earn the referral, use the referral to fund the tool.',
    saidAs: [
      'I have all these skills but nothing adds up to anything',
      'why doesn’t any of this compound for me',
      'I keep starting separate projects that never connect',
      'I have the tools but they’re not working together',
      'how do I turn one skill into multiple income streams',
      'everything I’ve built just sits there on its own',
      'I have resources but no system connecting them',
      'I feel like I’m collecting assets instead of building something',
    ],
    hook: 'Those aren’t trophies on the shelf. They’re gears you never bothered connecting to anything.',
  },
  {
    term: 'Dead Time Default',
    also: 'the gap',
    definition:
      'Dead time default is what happens to the small gaps in your day — the fifteen minutes between meetings, the wait in line — when you have no plan for them. Without a decision already made, the default is always the phone, and you look up to find the gap gone and nothing in it.',
    action: 'Before the next small gap arrives, decide in advance what goes in it — one specific task under five minutes — so the default has competition.',
    saidAs: [
      'where did my day go, I didn’t even do anything big',
      'I waste all my small pockets of free time scrolling',
      'fifteen minutes disappears and I have nothing to show for it',
      'I only value my time in big blocks',
      'the little gaps in my schedule always get wasted',
      'I default to my phone every time I have a free minute',
      'small chunks of time feel too short to use for anything',
      'how do I stop wasting the in-between moments of my day',
    ],
    hook: 'Nobody notices the big hours disappearing. It’s the fifteen-minute gaps that quietly eat the whole year.',
  },
  {
    term: 'Analysis Paralysis',
    also: 'research spiral',
    definition:
      'Analysis paralysis is treating more research as the path to a decision when you already have enough to choose — the real block is fear of being wrong, dressed up as being thorough. Every extra hour of comparing options doesn’t move you closer to certainty; it just delays the moment you have to own an answer.',
    action: 'Write three non-negotiable standards for the decision on paper, then take the first option that clears all three — no revisiting.',
    saidAs: [
      'I’ve made fifty pro and con lists and still can’t decide',
      'I keep researching instead of just choosing',
      'why can’t I just pick one and move on with it',
      'I need one more comparison video before I decide',
      'I’m afraid of picking the wrong one',
      'more information isn’t helping me decide anything',
      'I’ve watched every review and I’m still stuck',
      'analysis paralysis on a decision that shouldn’t be this hard',
    ],
    hook: 'At some point the next comparison chart isn’t research anymore. It’s just a nicer-looking place to hide.',
  },
  {
    term: 'Intention-Action Gap',
    also: 'planning as placebo',
    definition:
      'The intention-action gap is the space between deciding something and doing it, filled with more deciding. Writing the plan gives your brain a small reward that feels identical to progress, so you file it, feel prepared, and never open it again — mistaking the moment you named the goal for the moment you started it.',
    action: 'Skip the document. Do ten minutes of the actual thing before you write another word about the plan for it.',
    saidAs: [
      'I have a plan I wrote months ago and never opened again',
      'why do I feel productive just from making a plan',
      'I have a whole doc full of goals I never look at',
      'writing it down feels like I already did it',
      'I keep planning instead of actually starting',
      'my strategy document is just sitting there untouched',
      'I confuse making a decision with actually doing it',
      'I’ve had the same unfinished plan for over a year',
    ],
    hook: 'Naming the goal felt so much like reaching it that you never noticed you hadn’t started.',
  },
  {
    term: 'Windfall Impulse Spending',
    also: 'bonus blowout',
    definition:
      'Windfall impulse spending is what happens the moment unexpected money hits your account — a bonus, a refund, a big check — and instead of building on it, you spend it fast on something that signals status, before the feeling of having it can wear off. You’re not buying the thing. You’re buying proof, for a few days, that you’re not still the broke version of yourself.',
    action: 'The day a windfall lands, move it somewhere you can’t touch for 72 hours before you’re allowed to spend any of it on anything non-essential.',
    saidAs: [
      'I always blow bonus money right away',
      'why can’t I hold onto a windfall when it shows up',
      'I got a big check and spent it in one weekend',
      'unexpected money burns a hole in my pocket',
      'I buy something big every time I get a bonus',
      'I feel like I have to spend it before it disappears',
      'sudden money never turns into savings for me',
      'I bought something just to prove I have money now',
    ],
    hook: 'That splurge wasn’t a purchase. It was a costume, rented for the weekend, to feel like new money.',
  },
  {
    term: 'Performed Discipline',
    also: 'aesthetic discipline',
    definition:
      'Performed Discipline is treating the visible symbols of self-improvement — the saved quote, the tracked streak, the posted screenshot — as if collecting them were the same as doing the work. The habit changes what you consume and display, never what you actually do at the moment it counts.',
    action: 'Before you save or share anything that sounds wise, do the smallest real version of the thing it is telling you to do.',
    hook: 'A saved quote has never once answered your email for you.',
    saidAs: [
      'I collect quotes about discipline but never actually get disciplined',
      'why do I feel productive after reading motivational content',
      'I have a folder of inspiring screenshots and nothing has changed',
      'posting about self-improvement instead of doing it',
      'I know all the advice and still do none of it',
      'why does watching someone else be disciplined feel like doing it myself',
      'I curate my personality instead of building it',
      'saving wisdom I never apply',
    ],
  },
  {
    term: 'Voice Freeze',
    also: 'choking in the moment',
    definition:
      'Voice Freeze is the gap between what you meant to say and what actually came out of your mouth in the moment it mattered — the idea you had first, the correction you swallowed, the point someone else made worse and got credit for. It only resolves itself hours later, alone, when it is too late to use.',
    action: 'The next time you feel the freeze coming on, say one sentence out loud immediately, even a bad one — a real sentence beats a perfect one you never spoke.',
    hook: 'The room already moved on. You are still composing your reply.',
    saidAs: [
      'I always think of the right thing to say too late',
      'why do I go silent when someone talks over me',
      'I had the answer and let someone else say it worse',
      'I freeze up in meetings and say nothing',
      'my mouth stops working when I need it most',
      'I rehearse the comeback in the shower after it is already over',
      'why can I never speak up in the actual moment',
      'staying quiet and regretting it every time',
    ],
  },
  {
    term: 'Over-Explaining',
    also: 'justification reflex',
    definition:
      'Over-Explaining is answering a simple question, or holding a simple line, with three extra sentences of justification nobody asked for. Each added sentence is meant to make you sound more reasonable, but it reads as the opposite — the longer the explanation, the less certain you sound saying it.',
    action: 'Next time you say no, stop after one sentence. Do not add the paragraph of reasons — let the silence sit instead of filling it.',
    hook: 'Every sentence after the first one is an apology in disguise.',
    saidAs: [
      'why do I over-explain every decision I make',
      'I justify myself even when nobody asked',
      'I say no and then talk myself back into yes',
      'I give a whole speech to defend a simple boundary',
      'why does explaining myself make me sound weaker not stronger',
      'I cannot just say no and leave it there',
      'I fill every silence with more words',
      'I ramble when I feel challenged',
    ],
  },
  {
    term: 'Anticipatory Surrender',
    also: 'preemptive backing down',
    definition:
      'Anticipatory Surrender is the body giving up the argument before your mouth does — the broken eye contact, the nervous laugh, the half-step back, the softened voice — all fired off in the first second of confrontation, before you have decided anything. People read that signal faster than they read your words, and they respond to the signal.',
    action: 'Before you respond to a challenge, plant your feet, hold eye contact for one extra second, and let your first sound be silence instead of a laugh.',
    hook: 'You lost the negotiation before you opened your mouth. Your shoulders already told them the price.',
    saidAs: [
      'I break eye contact the second someone pushes back',
      'my body backs down before I decide to',
      'I laugh nervously when I am actually angry',
      'why do I flinch when someone raises their voice at me',
      'I shrink physically when confronted',
      'people can tell I am nervous before I say a word',
      'my posture gives away that I am about to fold',
      'I step back without meaning to when challenged',
    ],
  },
  {
    term: 'Novelty Cliff',
    also: 'the week-two wall',
    definition:
      'The novelty cliff is the specific point, roughly one to two weeks into a new commitment, where the initial thrill of starting has worn off but the results are not yet visible enough to carry you. Most people quit exactly here, then mistake the timing for proof the plan itself was wrong.',
    action: 'Mark day ten through day seventeen on your calendar before you start anything new, and treat any urge to quit in that window as the schedule working as expected, not a sign to stop.',
    hook: 'Day one is not the test. The test is the ordinary Tuesday nobody is watching, ten days later.',
    saidAs: [
      'why do I always quit around the second week',
      'the excitement of starting something new always wears off fast',
      'I lose interest right when it stops being new',
      'why does week two feel so much harder than day one',
      'I quit right before I would have seen results',
      'the honeymoon phase of a new habit always ends the same way',
      'why did I feel amazing on day three and awful on day twelve',
    ],
  },
  {
    term: 'Borrowed Authority',
    also: 'unearned mandate',
    definition:
      'Borrowed Authority is power that comes from a title, an inheritance, or someone else’s introduction rather than from anything you have personally demonstrated to the people in front of you. It functions right up until it is tested, at which point everyone in the room can feel that the source of it was never actually you.',
    action: 'Find the smallest decision this week where you can be visibly right or visibly wrong in front of the people you lead, and make it in the open.',
    hook: 'A title can get you the chair. It cannot get you the room.',
    saidAs: [
      'I got the title but I do not feel like I earned it',
      'nobody respects me even though I outrank them',
      'I run the team my predecessor built and it still feels like his',
      'how do I earn respect from people who knew me before the promotion',
      'I inherited this position and I am terrified someone will test me on it',
      'why does my authority feel borrowed instead of real',
      'people follow my title, not me',
      'I feel like I am wearing somebody else’s job',
    ],
  },
  {
    term: 'Vicarious Ambition',
    also: 'spectator motivation',
    definition:
      'Vicarious Ambition is getting your daily hit of drive and momentum from watching someone else’s visible progress instead of producing your own — the feed, the update, the "look what I built" post standing in for the work you have not started. It feels like motivation, but it spends the same energy motivation would have used.',
    action: 'Set a rule: no scrolling anyone else’s progress until you have logged twenty minutes of your own, in that order, every time.',
    hook: 'Watching someone else win has never once put money in your account.',
    saidAs: [
      'why do I feel inspired scrolling instead of actually starting',
      'I watch other people succeed instead of doing my own thing',
      'scrolling other people’s wins burns me out before I begin',
      'I feel like I am making progress just by watching someone else’s',
      'why does someone else’s win make me feel like I did something',
      'I compare my starting point to everyone else’s highlight reel',
      'I get my motivation from other people’s posts instead of my own results',
      'watching successful people online instead of building my own thing',
    ],
  },
  {
    term: 'Parked Project',
    also: 'the perpetual coming soon',
    definition:
      'A parked project is a goal that has been reduced to its paperwork — the domain, the logo, the business plan, the folder titled "new novel" — and kept technically alive through small renewals instead of the one thing that would actually start it. Maintaining the props feels like progress, which is exactly what lets it sit for years.',
    action: 'Do the one action the domain or plan was supposed to lead to this week — the actual first sale, page, or call — before you touch the folder again.',
    hook: 'A parked car still has a full tank. It has just never once left the driveway.',
    saidAs: [
      'I have owned this domain for years and never built the site',
      'why do I keep renewing something I never actually start',
      'I have the plan and the name and nothing else',
      'my side business has existed on paper for three years',
      'I keep the idea alive without ever doing the work',
      'why does having the logo feel like having the business',
      'I bought everything I needed to start and still have not started',
      'my project has been coming soon for years',
    ],
  },
  {
    term: 'The Trying Loop',
    also: 'perpetual attempt',
    definition:
      'The trying loop is staying indefinitely in "I’m trying to quit" or "I’m working on it," where the ongoing attempt becomes a comfortable identity that never has to resolve into either quitting or admitting you will not. It gets the sympathy of someone in progress without ever risking the verdict of a final result.',
    action: 'Pick a date within the next seven days and declare it the day the trying ends — either it is done, or you admit out loud that you have stopped trying.',
    hook: 'Trying does not have an end date. That is the whole appeal of it.',
    saidAs: [
      'I have been trying to quit this for over a year',
      'why does saying I am working on it feel safer than finishing',
      'I am always in the process and never at the result',
      'I have said I am quitting so many times it stopped meaning anything',
      'trying has become the whole habit',
      'I get credit for effort I never actually convert into a result',
      'why do I stay in the attempt forever instead of just deciding',
      'I have been about to stop for months',
    ],
  },
  {
    term: 'Invisible Labor Ache',
    also: 'unwitnessed effort',
    definition:
      'The invisible labor ache is the specific discomfort of doing careful, disciplined work that nobody sees or credits, while telling yourself you do not need the recognition. The work itself may be sustainable; the unacknowledged craving underneath it usually is not, and it surfaces as resentment if it is never named.',
    action: 'Tell one person, specifically, what you actually did and what it cost you — not to fish for praise, just to stop carrying it alone.',
    hook: 'Nobody claps for a job nobody saw. You still hear the silence where the applause should be.',
    saidAs: [
      'nobody notices how hard I work and it is starting to eat at me',
      'I do good work in silence and it is wearing on me',
      'why do I crave recognition I claim not to need',
      'I tell everyone I do not need credit but it still hurts when I get none',
      'my best work happens where nobody is watching and that is starting to feel bad',
      'I am tired of being reliable and unnoticed',
      'why does being the dependable one feel so lonely',
      'I resent being invisible even though I chose to be quiet about it',
    ],
  },
  {
    term: 'Mentor Cloning',
    also: 'borrowed blueprint',
    definition:
      'Mentor Cloning is copying a role model’s playbook so completely — their vocabulary, their opinions, their daily structure — that you stop checking whether any of it still fits your own situation. It looks like discipline from the outside, but it is actually outsourced judgment wearing someone else’s schedule.',
    action: 'Pick one rule you copied from someone you admire and ask, in writing, whether it actually fits your life — keep it only if the answer is yes for your reasons, not theirs.',
    hook: 'A photocopy of someone else’s discipline is still, in the end, just paper.',
    saidAs: [
      'I copied my mentor’s whole routine and it still is not working for me',
      'why do I sound like my mentor instead of myself',
      'I adopted someone else’s opinions as my own without noticing',
      'my life looks like a copy of someone I admire',
      'I followed the exact playbook and still feel lost',
      'why did copying someone successful not make me successful',
      'I lost my own voice trying to sound like theirs',
      'I picked a mentor and became a photocopy instead of a person',
    ],
  },
  {
    term: 'Flying Monkeys',
    also: 'family messengers',
    definition:
      'Flying monkeys are relatives or mutual friends recruited to pressure you on someone else’s behalf — relaying guilt trips, ultimatums, or "just talk to them" pleas so the person you’re avoiding never has to approach you directly, and can later deny ever asking anyone to intervene.',
    action: 'Give every messenger the same line — "that’s between me and them" — and stop responding to the content of whatever they relay.',
    saidAs: [
      'my aunt keeps texting me on his behalf',
      'why does everyone in my family suddenly need to talk to me about him',
      'they send someone else to guilt me instead of calling themselves',
      'my sister keeps relaying messages from my mom',
      'how do I get family to stop pressuring me for someone else',
      'everyone is suddenly checking in on my behalf',
      'why do they always send a messenger instead of calling themselves',
      'I keep getting guilt-tripped by people who aren’t even involved',
    ],
    hook: 'If they really wanted to talk to you, they wouldn’t need someone else to do it for them.',
  },
  {
    term: 'Family Scapegoat Role',
    also: 'identified problem child',
    definition:
      'The fixed role in a family system where one member absorbs the blame for whatever goes wrong, regardless of who actually caused it, because their complaints or their difference threatens a version of the family the rest have agreed to protect. The role stays assigned no matter how the person behaves.',
    action: 'Stop re-arguing the specific accusation and track the pattern instead — write down every unrelated problem pinned on you over one month.',
    saidAs: [
      'why am I always the problem in my family',
      'I get blamed for things I didn’t even do',
      'everyone in my family agrees I’m the difficult one',
      'why does my family need someone to blame',
      'I’m the one who gets called dramatic no matter what happens',
      'family always sides against me at every gathering',
      'why do I take the blame for everyone else’s issues',
      'I’m treated like the black sheep for pointing things out',
    ],
    hook: 'The day you stop accepting the blame is the day the family has to explain the mess without you.',
  },
  {
    term: 'Golden Child Standard',
    also: 'sibling scoreboard',
    definition:
      'A family dynamic in which one sibling is held up, accurately or not, as the standard of achievement, obedience, or good behaviour, and used as the yardstick you are measured against and always found short of — regardless of what you actually accomplish or how much you change.',
    action: 'Write down one thing you did well this month without comparing it to your sibling, and say it out loud before anyone else gets the chance to compare it for you.',
    saidAs: [
      'why does my mom always compare me to my sister',
      'I never measure up to my brother in my parents’ eyes',
      'my sibling can do no wrong and I can do nothing right',
      'why do I feel like the disappointing child',
      'my parents praise my sibling and criticise me for the same thing',
      'competing with my sibling for my parents’ approval my whole life',
      'why do family gatherings turn into a comparison contest',
      'I was raised to feel like the backup child',
    ],
    hook: 'You were never actually losing a competition. You were cast as the loser before it started.',
  },
  {
    term: 'Smear Campaign',
    also: 'preemptive character attack',
    definition:
      'Quietly giving other people a distorted version of events before you get a chance to speak, so that by the time you explain what actually happened, it plays as a defensive reaction to a reputation that was already damaged — leaving you sounding biased just for describing your own experience.',
    action: 'Stop trying to correct the story with everyone who heard it. Pick the few people whose opinion actually affects your life and tell them the facts once, plainly, and let it rest.',
    saidAs: [
      'someone’s been talking about me behind my back before I could explain',
      'why does everyone already have an opinion of me before I’ve said anything',
      'how do I stop a smear campaign against me',
      'family is turning people against me before I get a say',
      'people believe whichever version they heard first',
      'why do I sound guilty just by defending myself',
      'someone told everyone their side before I even knew there was a problem',
      'how to respond when someone lies about you to your own friends',
    ],
    hook: 'By the time you hear about the story, everyone else has already finished reading it.',
  },
  {
    term: 'Public Mask',
    also: 'Jekyll-and-Hyde persona',
    definition:
      'A person who is warm, funny, or generous in front of others while being cold, dismissive, or cruel behind closed doors — which makes the private version sound unbelievable to anyone who has only ever met the performance, and turns your accurate account of them into the thing that looks exaggerated.',
    action: 'Stop trying to get outsiders to see the private version. Judge the relationship by what happens when the door is closed, not by what happens at the table.',
    saidAs: [
      'everyone thinks she’s so sweet but she’s cruel at home',
      'nobody believes me because he’s so charming in public',
      'why does my family act completely different in front of guests',
      'how do I explain someone who’s nice to everyone but me',
      'people don’t believe what he’s like once the door closes',
      'she’s a completely different person when we’re alone',
      'why does no one believe how they actually treat me',
      'my family looks perfect from the outside',
    ],
    hook: 'The version of them that everyone loves has never once been alone in a room with you.',
  },
  {
    term: 'Parentification',
    also: 'the child who had to be the adult',
    definition:
      'A childhood role in which a child manages a parent’s emotions, finances, or household responsibilities that belong to an adult, because no functioning adult was doing that job. The child grows up fluent in caretaking and never gets taught how to rest, ask for help, or be looked after in return.',
    action: 'Name one responsibility you carried as a child that was never actually yours, and hand it back mentally — even if the person is gone, unchanged, or would deny it happened.',
    saidAs: [
      'I was the parent in my own house growing up',
      'why do I feel guilty resting as an adult',
      'I raised my siblings before I was old enough to',
      'I was my mom’s therapist as a kid',
      'why can’t I relax without feeling like I’m neglecting something',
      'I had to grow up fast because no one else was in charge',
      'I managed the household’s emotions as a child',
      'why do I still feel responsible for my parents’ happiness',
    ],
    hook: 'You weren’t mature for your age. You were unpaid, unqualified, and unprotected.',
  },
  {
    term: 'Enmeshment',
    also: 'boundaryless family',
    definition:
      'A family structure with no separate emotional identity between members — a parent’s mood becomes the child’s job to manage, a child’s private life becomes family property, and having a feeling, opinion, or decision of your own is treated as disloyalty rather than a normal part of being a separate person.',
    action: 'Pick one decision this week that is entirely yours to make, and make it without reporting it, explaining it, or checking whether it upsets anyone first.',
    saidAs: [
      'my family knows every detail of my life and thinks that’s normal',
      'why does my mom react like my choices are about her',
      'I can’t have a private thought without my family finding out',
      'my family treats my life like it belongs to everyone',
      'why do I feel guilty having an opinion different from my parents',
      'my family has no boundaries between our separate lives',
      'everything I do becomes a family-wide discussion',
      'why can’t I make a decision without checking with everyone first',
    ],
    hook: 'In a house with no walls between people, someone else’s mood is always technically your emergency.',
  },
  {
    term: 'DARVO',
    also: 'victim-blame reversal',
    definition:
      'A response to being confronted in which the person Denies it happened, Attacks you for bringing it up, and Reverses the roles so they become the victim and you become the aggressor — leaving your original complaint unaddressed while you end up managing their hurt feelings instead.',
    action: 'When the flip happens, repeat your original sentence in the same words instead of defending your character, and refuse to let the conversation move to their feelings until yours has been heard.',
    saidAs: [
      'every time I bring up something they did, they turn it around on me',
      'why do I end up apologising when I was the one who got hurt',
      'they cry and suddenly I’m the bad guy',
      'how do I stop getting turned into the villain for speaking up',
      'I confront them calmly and somehow I’m on trial',
      'why does setting a boundary make them the victim',
      'they flip the story so fast I lose track of what actually happened',
      'how to respond when someone plays the victim after I called them out',
    ],
    hook: 'You brought a complaint into the room. Somehow you left holding an apology.',
  },
  {
    term: 'Breadcrumbing',
    also: 'crumb tolerance',
    definition:
      'A pattern of minimal, inconsistent effort — an occasional kind word, a rare good day, a small gesture after a long silence — that is just enough to keep you hoping for more, without ever adding up to a real, sustained investment in the relationship.',
    action: 'Write down how often the good moments actually happened over the last month, not the ones you remember most vividly, and compare that number honestly to what you’d accept from anyone else.',
    saidAs: [
      'why do I get excited over the bare minimum from them',
      'they only show up right when I’m about to give up on them',
      'I keep waiting for the good version of them to come back',
      'why does one nice text undo months of nothing',
      'I settle for small moments instead of a real relationship',
      'they give just enough to keep me around and nothing more',
      'why do I forgive so fast after one good day',
      'how do I stop being grateful for crumbs',
    ],
    hook: 'A crumb isn’t a smaller meal. It’s proof there was never a meal coming.',
  },
  {
    term: 'Guilt Ledger',
    also: 'sacrifice scorekeeping',
    definition:
      'A running, unspoken tally of everything a person has done for you, kept specifically so it can be cashed in as leverage whenever you ask for something, set a limit, or disagree — turning past generosity into a debt you’re expected to keep repaying on demand.',
    action: 'Separate gratitude from obedience out loud: say "I’m grateful for that, and my answer is still no," and let both halves of the sentence stand without softening either one.',
    saidAs: [
      'they bring up everything they’ve done for me every time I say no',
      'why does asking for space turn into a list of their sacrifices',
      'I feel like I owe my family forever for raising me',
      '"after all I’ve done for you" is their favourite line',
      'why do gifts from my parents always come with conditions later',
      'I can’t set a boundary without hearing about everything they gave up',
      'they use old favours to control what I do now',
      'why do I feel like I’m permanently in debt to my own family',
    ],
    hook: 'Real generosity doesn’t keep a receipt to hand you back later.',
  },
  {
    term: 'Blood Obligation',
    also: 'family entitlement',
    definition:
      'The belief that sharing DNA or a family title automatically entitles someone to your time, forgiveness, and access, regardless of how they actually treat you — as if the biological relation, rather than the relationship itself, is what should earn the closeness.',
    action: 'Write the sentence that would have to finish "because they’re family" to actually justify your access, and notice how often the rest of that sentence is just the word itself.',
    saidAs: [
      '"you only get one mother" is what they keep telling me',
      'why am I expected to forgive just because we’re related',
      'family is supposed to mean unconditional but why does it only go one way',
      'do I owe my parents access just because they’re my parents',
      'why do people act like blood erases how someone treated you',
      'I’m told I’ll regret cutting off family no matter what they did',
      'being related isn’t the same as being close, but nobody agrees with me',
      'how much am I actually obligated to tolerate from family',
    ],
    hook: 'Sharing blood was never a substitute for earning trust.',
  },
  {
    term: 'Silent Treatment',
    also: 'weaponised withdrawal',
    definition:
      'The deliberate withholding of conversation, acknowledgment, or affection after a conflict, used not to create space to cool down but to punish and pressure the other person into apologising first — regardless of who actually caused the disagreement in the first place.',
    action: 'Stop treating the silence as an emergency to fix. State once that you’re available when they’re ready to talk normally, then return to your day without checking for a reply.',
    saidAs: [
      'why does my mom go silent for days after an argument',
      'how do I deal with someone who stops talking to me as punishment',
      'his silence lasts way longer than the actual disagreement',
      'why do I panic when someone stops responding to me',
      'I feel like I have to apologise just to end the silence',
      'being ignored is worse than being yelled at',
      'why does the silent treatment make me chase them',
      'how to stop reacting to being frozen out',
    ],
    hook: 'Silence isn’t them cooling down. It’s them making you pay rent on the argument.',
  },
  {
    term: 'Fantasy Bond',
    also: 'chasing someone’s potential',
    definition:
      'An attachment to who someone could become, or once appeared to be, rather than to the person actually in front of you — built from a handful of good moments replayed as proof, while the daily pattern of disappointment gets quietly filed away as the exception.',
    action: 'List what the person has actually done over the last month, not what you believe they’re capable of, and make your next decision from that list alone.',
    saidAs: [
      'I’m in love with who he could be, not who he actually is',
      'I keep hoping they’ll go back to how they were at the start',
      'why do I stay for the potential instead of the reality',
      'I remember the good version of them more than the real one',
      'I think I can bring back the person I first met',
      'why do I make excuses based on what they’re capable of',
      'I’m attached to an idea of them, not the actual person',
      'how do I stop waiting for someone to become who I thought they were',
    ],
    hook: 'You’re not in a relationship with them. You’re in a relationship with a memory wearing their face.',
  },
  {
    term: 'Reactive Abuse',
    also: 'provoked into looking like the problem',
    definition:
      'A cycle where subtle provocation continues until you finally react visibly — raising your voice, crying, or snapping — at which point that single reaction gets isolated from everything that led to it and used as proof that you are the unstable or aggressive one in the relationship.',
    action: 'When you notice the provocation building, name it out loud in the moment — "this is escalating on purpose" — before your reaction becomes the only part anyone remembers.',
    saidAs: [
      'I only look bad in the moment I finally snap',
      'why do they push until I react and then act shocked',
      'I get blamed for the one time I raised my voice, not the hundred times they provoked me',
      'everyone only remembers when I lost it, not what led there',
      'why does my reaction get treated as the whole story',
      'I feel crazy because my one bad moment gets used against me forever',
      'they poke and poke until I break, then call me the difficult one',
      'how do I stop getting baited into reacting',
    ],
    hook: 'They spent an hour loading the gun. Only the trigger got filmed.',
  },
  {
    term: 'JADE',
    also: 'over-explaining to someone who won’t be satisfied',
    definition:
      'The compulsive urge to Justify, Argue, Defend, and Explain yourself to someone who has already decided what they think of you, on the theory that the right combination of words will finally make them understand — when no explanation was ever actually going to be enough for them.',
    action: 'Say your position once, in one sentence, and then stop talking. A boundary that needs a paragraph to defend it isn’t a boundary yet.',
    saidAs: [
      'why do I keep over-explaining myself to people who don’t listen',
      'I write paragraphs defending a decision that was already final',
      'why can’t I just say no without justifying it',
      'I feel like I have to win the argument before I’m allowed to leave it',
      'why do I keep trying to make them understand when they never will',
      'I over-explain every single boundary I try to set',
      'I rehearse conversations trying to find the perfect explanation',
      'why does one sentence never feel like enough to say',
    ],
    hook: 'The paragraph was never going to convince them. The sentence was already the whole answer.',
  },
  {
    term: 'The Self-Care Alibi',
    also: 'avoidance rebrand',
    definition:
      'The self-care alibi is dressing avoidance in therapeutic language so it stops looking like cowardice. Ghosting a hard conversation becomes "protecting my peace." Quitting on a commitment becomes "listening to my body." The words change nothing about the outcome — the call still doesn’t happen — but they let you feel virtuous about not making it.',
    action:
      'Before you use a self-care phrase to explain a decision, say out loud what you actually did without the phrase — "I ghosted him" instead of "I set a boundary." If the plain sentence embarrasses you, the alibi was covering something.',
    hook: 'Say the plain sentence out loud — "I ghosted him" — and watch how fast the noble feeling disappears.',
    saidAs: [
      'am I setting a boundary or just avoiding the conversation',
      'why does calling it self-care make me feel better about quitting',
      'I ghosted someone and called it protecting my peace',
      'is this actually a boundary or am I just scared',
      'I keep using therapy words to excuse bailing on people',
      'how to tell if I am avoiding something instead of healing from it',
      'why do I feel proud of decisions I know are cowardly',
      'using self-care as an excuse to not show up',
    ],
  },
  {
    term: 'Screenshot Wisdom',
    also: 'quote hoarding',
    definition:
      'Screenshot wisdom is collecting insight — quotes, clips, threads — faster than you apply any of it. The saving feels like learning because it activates the same sense of forward motion, but a camera roll full of advice you haven’t used is a library, not a skill.',
    action:
      'Pick one saved piece of advice from the last month and do the actual thing it describes today, then delete it. Do not save anything new until you have.',
    hook: 'Your camera roll has more discipline in it than your day does.',
    saidAs: [
      'why do I save advice I never use',
      'I have hundreds of screenshots of quotes I never look at again',
      'collecting motivational content instead of doing the work',
      'why does saving a quote feel like I did something',
      'I consume self-improvement content all day and nothing changes',
      'camera roll full of wisdom, life full of the same problems',
      'how to stop hoarding advice and start using it',
    ],
  },
  {
    term: 'Outsourced Competence',
    also: 'convenience erosion',
    definition:
      'Outsourced competence is paying, again and again, to avoid small acts of self-sufficiency — cooking, fixing, cleaning — and calling it efficiency. Each outsourced task is small, but the pattern quietly teaches you that you’re not capable of your own basic maintenance, which is a more expensive loss than the delivery fee.',
    action:
      'This week, do the one small task you’d normally pay someone or something else to handle — cook instead of order, fix instead of replace — and notice what it costs you versus what it gives back.',
    hook: 'Every "I don’t have time to cook" is a small vote against your own competence, cast on a debit card.',
    saidAs: [
      'why do I order food every night instead of cooking',
      'I pay for convenience so often I forgot how to do things myself',
      'outsourcing everything and feeling less capable',
      'is convenience making me worse at basic life skills',
      'I don’t cook anymore and I don’t know when that happened',
      'paying to avoid small tasks I used to just do',
      'how outsourcing chores is quietly making me less self-sufficient',
    ],
  },
  {
    term: 'The Almost-Finished Habit',
    also: '80 percent stop',
    definition:
      'The almost-finished habit is stopping projects at the exact point they become hard, precise, or exposing — not before you start, but right before you’d have to show the result. It leaves behind a specific kind of wreckage: not empty rooms, but rooms full of things that are 90 percent done and permanently parked there.',
    action:
      'Pick the oldest almost-done thing you own and finish the last, most annoying ten percent of it this week — not a new one, that one.',
    hook: 'The room isn’t cluttered. It’s a timeline of every project you stopped one step before it counted.',
    saidAs: [
      'why do I stop right before a project is actually done',
      'my garage is full of half-finished projects',
      'I always quit at the boring last part',
      'why can’t I finish anything all the way',
      'surrounded by almost-done things I never complete',
      'I lose interest right when a project gets hard',
      'how to actually finish instead of settling for good enough',
      'why does the last 10 percent feel impossible',
    ],
  },
  {
    term: 'Successor’s Shadow',
    also: 'inherited mantle',
    definition:
      'Successor’s shadow is the specific paralysis of taking over a role, business, or reputation someone else built — and measuring every move against what they would have done instead of deciding what you would do. You keep the systems the same, the layout the same, waiting to feel like the owner instead of acting like one.',
    action:
      'Change one small, visible thing about the thing you inherited this week — a process, a price, a layout — that is yours, not theirs, and let it stand.',
    hook: 'You didn’t inherit a shrine. You inherited a shop with your name that isn’t on the door yet.',
    saidAs: [
      'took over the family business and feel like an impostor in it',
      'why do I compare every decision to what my father would have done',
      'inherited a company and it still doesn’t feel like mine',
      'how long until I stop feeling like a caretaker instead of the owner',
      'stepping into someone else’s role and afraid to change anything',
      'everyone still asks about the person who used to run this',
      'when does inherited responsibility start to feel like mine',
    ],
  },
  {
    term: 'Betrayal Forensics',
    also: 'the missed-sign hunt',
    definition:
      'Betrayal forensics is replaying a past betrayal in obsessive detail, hunting for the exact warning sign you missed — convinced that finding it will let you dodge the next one. It won’t. The signal you’re looking for doesn’t reliably predict anything; the search only keeps the wound open under the guise of learning from it.',
    action:
      'Set a hard stop on the replay — one honest pass to name what happened, then redirect the energy into a concrete boundary or habit for next time, not another lap of the tape.',
    hook: 'You’re not investigating the betrayal. You’re guarding a wound with a magnifying glass instead of a bandage.',
    saidAs: [
      'why do I keep replaying how I got betrayed',
      'trying to figure out exactly when I should have known',
      'obsessing over the warning signs I missed',
      'analyzing every text after being blindsided by someone',
      'how do I stop investigating a betrayal that already happened',
      'I keep looking for the moment I should have seen it coming',
      'replaying the relationship looking for clues I missed',
    ],
  },
  {
    term: 'The Designated Strong One',
    also: 'the load-bearing person',
    definition:
      'The designated strong one is the person everyone leans on because they never crack — the one who handles the news, carries the room, jokes through the hard parts. The role is real, but it means your own feeling has nowhere sanctioned to happen, so it only surfaces in stolen, private moments nobody sees.',
    action:
      'Tell one person you trust the specific thing you’re carrying, in plain words, before you’re forced to by a private collapse. Practice being seen struggling on purpose, on a day nothing is on fire.',
    hook: 'Nobody schedules a time for the strong one to fall apart, so it happens alone, in the ten minutes nobody is watching.',
    saidAs: [
      'everyone thinks I’m the strong one and I’m not okay',
      'I hold it together for everyone else and fall apart alone',
      'why can I only cry in private, never in front of anyone',
      'being the person everyone relies on with no one to lean on',
      'I’m known for handling everything and it’s exhausting',
      'how do I stop being everyone’s rock when I need one too',
      'I joke through hard things because I can’t afford to break',
    ],
  },
  {
    term: 'Vanity Metric Fixation',
    also: 'the wrong number',
    definition:
      'Vanity metric fixation is checking an easy, visible number — the scale, the follower count, the balance — for a hit of certainty, while the number that actually reflects your progress goes untracked because it’s harder to look at. The easy number feels like control. It usually isn’t connected to the outcome you actually want.',
    action:
      'Identify the one metric that would actually tell you the truth about your progress, however uncomfortable, and check that number instead of the easy one for a week.',
    hook: 'The number you check every morning is the one that’s easiest to look at, not the one that’s telling you anything.',
    saidAs: [
      'why do I check the scale every morning and it means nothing',
      'obsessing over a number that doesn’t actually measure my progress',
      'I track the wrong thing and ignore what actually matters',
      'checking my follower count for a hit of control',
      'what’s the difference between a useful metric and a comforting one',
      'I need a number to feel okay about the day',
      'tracking something easy instead of something true',
    ],
  },
  {
    term: 'The Regret Ledger',
    also: 'the lost-years tally',
    definition:
      'The regret ledger is a running mental tally of every wasted year, missed start, and abandoned attempt, added up each morning until the total feels too large to overcome. The ledger isn’t evidence you’re too late — it’s the only thing keeping you from starting today, since the math only works if you keep doing it.',
    action:
      'Stop running the total. Pick the smallest next action available to you today and do it without consulting the ledger first.',
    hook: 'The ledger only balances against you because you’re the only one still doing the math.',
    saidAs: [
      'I feel like I’ve wasted too many years to start now',
      'too old to start over',
      'I keep tallying up everything I should have done by now',
      'why do I compare my timeline to people younger than me',
      'it’s too late for me to become good at this',
      'I add up all my failed starts every morning',
      'how do I stop feeling behind in life',
      'starting late and feeling permanently behind',
    ],
  },
  {
    term: 'The Gap Ambush',
    also: 'idle-moment flashpoint',
    definition:
      'The gap ambush is the pattern where difficult feelings hit hardest not during activity but in unstructured transition moments — waiting in line, the pause between tasks, the seconds before sleep — because nothing is occupying the space they need to surface. Most people only prepare for the big obvious triggers and get blindsided by the small gaps instead.',
    action:
      'Name one gap in your day where the feeling reliably ambushes you, and decide in advance what you’ll do in it — not avoid it, occupy it on purpose.',
    hook: 'It never ambushes you during the crisis. It waits for the gap between two ordinary things.',
    saidAs: [
      'why does grief hit me at the weirdest random moments',
      'I’m fine until there’s a gap and then it hits me',
      'why do I fall apart in idle moments and not during the hard stuff',
      'the pause between things is when it gets bad',
      'I’m okay when I’m busy and wrecked the second I stop',
      'waiting rooms and empty moments are when the feeling ambushes me',
      'how to handle grief in the in-between moments of the day',
    ],
  },
  {
    term: 'The Narrow Specialist',
    also: 'category niching',
    definition:
      'The narrow specialist gets known, trusted, and paid not for being broadly skilled but for being narrower and stranger than everyone else in the category — the one who only restores one bike model, only handles one kind of case, only does one thing obsessively well. Breadth makes you replaceable; a specific obsession makes you the only call.',
    action:
      'Pick the one sliver of what you do that you could plausibly become the known name for, and spend this month making that sliver public and specific instead of advertising everything you can do.',
    hook: 'Nobody seeks out the guy who does a little bit of everything. They seek out the one who does one strange thing better than anyone.',
    saidAs: [
      'should I specialize in one thing or stay a generalist',
      'how do I stand out when everyone offers the same service',
      'why does the guy who only does one weird thing get more business than me',
      'becoming known for one specific niche instead of general skills',
      'how narrow should my specialty be to get noticed',
      'generalist vs specialist for building a reputation',
      'how do I become the only person people call for something',
    ],
  },
  {
    term: 'Recovery Theater',
    also: 'performing moved-on',
    definition:
      'Recovery theater is staging visible proof that you’ve healed — the confident dating profile, the upbeat update, the story you tell before it’s true — for an audience that stopped watching a while ago. The performance can be so convincing you believe it yourself, right up until the version of you alone at night tells a different story.',
    action:
      'Cancel one piece of the performance this week — the update, the post, the line at the barbecue — and spend that energy on the private thing you’re actually still working through.',
    hook: 'There’s exactly one person in the room the performance doesn’t fool, and you go home with him every night.',
    saidAs: [
      'why do I need everyone to see me handling it well',
      'performing that I’m okay when I’m not',
      'I tell everyone I’ve moved on but I haven’t',
      'am I actually healing or just proving I look fine',
      'acting like I’m fine at every dinner party',
      'why do I need an audience for my recovery',
      'convincing everyone I’ve bounced back when I haven’t slept in months',
    ],
  },
  {
    term: 'Cost-Blind Ledger',
    also: 'hidden energy cost',
    definition:
      'A cost-blind ledger is tracking every visible number about yourself — steps, sleep, calories, screen time — while never once recording what a specific task, meeting, or person actually costs you afterward. The instruments measure everything except the one variable that explains why some ordinary days leave you flattened and others do not.',
    action:
      'At the end of each day, mark a plus or minus next to every task and interaction — nothing more — and let a week of marks show you the real spend.',
    hook: 'Your sleep app has a column for everything except the phone call that took your whole afternoon down with it.',
    saidAs: [
      'why am I exhausted when nothing bad even happened today',
      'I track everything but still don’t know where my energy goes',
      'certain meetings wreck me for the rest of the day and I can’t explain why',
      'I have all this health data and none of it explains how I feel',
      'how do I figure out what is actually draining me',
      'why does one conversation cost me the whole afternoon',
      'I feel fine on paper but wrecked in real life',
      'how do I know what is actually worth my energy',
    ],
  },
  {
    term: 'Consumption Drought',
    also: 'creation drought',
    definition:
      'A consumption drought is a stretch of time, sometimes years, where a person absorbs constantly — feeds, shows, other people’s lives — but produces nothing of their own: no meal cooked from scratch, no repair, no sentence written unprompted. The exhaustion that follows is not from doing too much. It is from making nothing at all.',
    action:
      'Today, make one small thing with your hands that did not exist this morning, and notice how different that tiredness feels from scroll fatigue.',
    hook: 'Your thumb produced a longer scroll history today. Your hands have forgotten what making something feels like.',
    saidAs: [
      'why do I feel empty even though I rested all weekend',
      'I consume constantly and never make anything',
      'scrolling all day leaves me more drained than working does',
      'I haven’t made anything with my hands in months',
      'why does watching everyone else’s life make me feel worse',
      'I feel like an audience to my own life',
      'binge watching leaves me hollow instead of relaxed',
      'I need to build something, not just consume it',
    ],
  },
  {
    term: 'Capacity Overflow Snapping',
    also: 'the full-container snap',
    definition:
      'Capacity overflow snapping is losing your temper at something minor — a dropped spoon, a slow driver, a bad joke — not because it deserved anger, but because your tolerance was already at its limit with nowhere left to put the load. It reads as an anger problem when it is really a container that was already full.',
    action:
      'When you snap at something small, ask what you were already carrying beforehand instead of what you were reacting to.',
    hook: 'The spoon didn’t do that. Everything you swallowed before the spoon did.',
    saidAs: [
      'why do I explode over tiny things',
      'I snapped at my kid over nothing and feel awful',
      'small annoyances make me disproportionately angry',
      'is this an anger problem or something else',
      'I have a short fuse lately and don’t know why',
      'why do I overreact to things that don’t matter',
      'I lash out and regret it within minutes',
      'my patience runs out way before the day does',
    ],
  },
  {
    term: 'Collapse Mistaken For Rest',
    also: 'the couch collapse',
    definition:
      'Collapse mistaken for rest is falling onto a couch after a hard day, opening a screen, and calling that recovery. The body stopped moving, but the jaw stays clenched, the stomach stays unsettled, and the mind keeps running the same reel underneath — because collapsing is simply stopping, and stopping is not the same thing as actually recovering.',
    action:
      'Before you collapse tonight, do ninety seconds of slow, deliberate breathing with your eyes closed and no screen, then judge whether you still feel wired.',
    hook: 'You were on the couch for two hours. You are not rested. You are just horizontal.',
    saidAs: [
      'why do I still feel wired after collapsing on the couch',
      'scrolling doesn’t actually relax me but I keep doing it',
      'I rest all evening and still feel tense',
      'why doesn’t sitting down all night make me feel recovered',
      'my body stops moving but my mind doesn’t',
      'is scrolling on the couch actually rest or not',
      'I collapse instead of relaxing and can feel the difference',
      'why am I exhausted after a whole evening of doing nothing',
    ],
  },
  {
    term: 'Peak-Day Benchmark',
    also: 'the best-day standard',
    definition:
      'The peak-day benchmark is judging every ordinary day against the one exceptional day you once had — full sleep, clean eating, the whole list finished by noon — and treating anything less as failure. Most of life happens on the average day, not the best one, so measuring against your best day guarantees you feel like you are losing constantly.',
    action:
      'Write down what a realistic, sustainable Tuesday actually looks like, and use that as the standard instead of the one day everything happened to align.',
    hook: 'You are comparing today to the one day everything went right and calling every other day a failure.',
    saidAs: [
      'why do I feel like I’m failing even on decent days',
      'I keep comparing myself to my best day ever',
      'nothing feels good enough compared to my peak performance',
      'how do I stop measuring myself against my best week',
      'I had one great month and now everything else feels like failure',
      'why does average feel like losing',
      'I set my bar by the one time everything worked',
      'my standards come from a day I can’t repeat',
    ],
  },
  {
    term: 'Protocol Hopping',
    also: 'method shopping',
    definition:
      'Protocol hopping is abandoning a system that is quietly working for a new app, routine, or framework the moment it stops feeling exciting, then repeating the swap every few weeks under the belief the right method has simply not been found yet. The method was rarely the problem. Leaving each one right before it had time to compound was.',
    action:
      'Before you switch to a new system, tool, or routine, commit to running the current one for thirty more days unchanged.',
    hook: 'You have downloaded the fix six times. The fix was never the app. It was staying with one long enough to work.',
    saidAs: [
      'why do I keep switching systems instead of sticking with one',
      'I’ve tried every app and none of them stick',
      'I get bored of routines right when they start working',
      'I keep looking for a better method instead of using the one I have',
      'why does every new system feel exciting for two weeks then die',
      'I have a graveyard of abandoned trackers and planners',
      'switching tools has become its own procrastination',
      'I chase the next system instead of trusting this one',
    ],
  },
  {
    term: 'The Peacekeeping Lie',
    also: 'the reflexive "I’m fine"',
    definition:
      'The peacekeeping lie is saying "I’m fine" or "whatever you want" to end a moment of friction cheaply, instead of naming what is wrong. It buys a few hours of quiet, but the unspoken thing does not disappear — it sits and grows, resurfacing later as a fight about something small that is really about the thing you never said.',
    action:
      'The next time you feel the reflex to say "I’m fine," name the actual one-sentence complaint instead, even if it is small and even if the timing feels wrong.',
    hook: 'You bought two days of quiet with that lie. You are about to pay for it with a much longer fight.',
    saidAs: [
      'why do small lies to keep the peace blow up later',
      'I say I’m fine when I’m not and it always backfires',
      'we fight about small things that are really about something else',
      'why does avoiding conflict now cause a bigger fight later',
      'I keep the peace by lying and it never actually works',
      'how do I stop saying I’m fine when I’m not',
      'small dishonesty in relationships adds up to resentment',
      'I say yes to avoid an argument and regret it every time',
    ],
  },
  {
    term: 'The Joke That Wasn’t a Joke',
    also: 'humor as a delivery system',
    definition:
      'This is real criticism wrapped in a punchline so it can be delivered without the discomfort of saying it straight, then defended with "I was just joking" the moment it lands. The other person absorbs the hit like a real one, because it was one — the joke was never the message, it was the armor around it.',
    action:
      'The next time a joke of yours has a real complaint hiding inside it, say the complaint plainly instead, without the laugh line attached.',
    hook: 'Nobody laughed because it was funny. They laughed because it was true and laughing was the only defense available.',
    saidAs: [
      'why do I make jokes that are actually criticism',
      'I hide real complaints inside jokes and call it teasing',
      'they got upset at my joke and I said I was kidding',
      'is my humor actually passive aggression',
      'I use sarcasm instead of saying what I actually mean',
      'why does my family joke about things that actually hurt',
      'I say the mean thing and then say I’m joking',
      'my "jokes" always seem to land on a sore spot',
    ],
  },
  {
    term: 'Reloading Instead Of Listening',
    also: 'arguing to win, not to hear',
    definition:
      'Reloading instead of listening is spending the other person’s turn to speak building your next rebuttal instead of actually hearing what they are saying. The mouth stays quiet, but the mind is loading the next argument, which means a conversation run this way is really two monologues aimed at each other instead of one exchange.',
    action:
      'In your next disagreement, try repeating back what the other person just said, in their words, before you say anything of your own.',
    hook: 'You weren’t listening. You were reloading. Ask yourself what they actually said and you will not be able to answer.',
    saidAs: [
      'I’m already planning my response while someone is still talking',
      'why do I argue to win instead of to understand',
      'I can’t remember what my partner said because I was rebutting in my head',
      'I listen for the gap to jump in, not to actually hear them',
      'my arguments are about being right, not being understood',
      'why do fights feel like two people talking past each other',
      'I rehearse my comeback instead of hearing the other person out',
      'how do I actually listen during an argument instead of preparing to respond',
    ],
  },
  {
    term: 'Performance Charm',
    also: 'the rehearsed self',
    definition:
      'Performance charm is running your best, most rehearsed stories and jokes at a gathering — the ones that always land — instead of actually being present with the people in the room. It earns laughs and approval in the moment, but leaves you feeling strangely hollow afterward, because what people responded to was the show, not you.',
    action:
      'At your next gathering, ask one real question and actually listen to the answer before you reach for a story of your own.',
    hook: 'They laughed at your best material and you still left feeling like nobody in that room actually met you.',
    saidAs: [
      'why do I feel empty after a great social night',
      'I perform at parties instead of actually connecting',
      'people laugh at my stories but I still feel unseen',
      'I have a set of go-to stories I recycle at every gathering',
      'why does being the fun one leave me feeling hollow',
      'I entertain people instead of being real with them',
      'I feel like I’m always performing in social situations',
      'being charming isn’t the same as being known',
    ],
  },
  {
    term: 'The Unbearable Pause',
    also: 'silence intolerance in conversation',
    definition:
      'The unbearable pause is the compulsion to fill any silence in a conversation within a second of it starting, with a joke, a question, or a story, because the quiet itself feels like a verdict on how interesting you are. Most silences are neutral. Filling every one on reflex is what actually makes a conversation feel hollow.',
    action:
      'The next time a conversation goes quiet, count silently to five before you speak, and notice that the world does not end.',
    hook: 'The silence was not a problem until you decided it was and rushed to kill it.',
    saidAs: [
      'why can’t I handle silence in conversations',
      'I rush to fill every awkward pause',
      'I say something dumb just to break silence',
      'a quiet moment in conversation makes me panic',
      'why do I feel like silence means I’m boring',
      'I talk too much because I can’t sit in a pause',
      'how do I get comfortable with silence around other people',
      'every gap in conversation feels like it needs to be filled',
    ],
  },
  {
    term: 'Depth Avoidance',
    also: 'the untested closeness',
    definition:
      'Depth avoidance is deliberately keeping a relationship at a comfortable, surface level — sports, weather, safe jokes — because testing whether it would hold up under real weight feels riskier than never finding out. The relationship stays technically intact, but only because neither person has ever actually asked anything real of it.',
    action:
      'Ask one person you suspect is close to you for something slightly harder than usual, and pay attention to what you learn from their answer.',
    hook: 'You keep it shallow because shallow can’t fail the test you’re too afraid to give it.',
    saidAs: [
      'I have friends but I don’t know who would actually show up for me',
      'why do I keep my closest relationships surface level',
      'I’m scared to find out who would really be there in a crisis',
      'we talk all the time but never about anything real',
      'I avoid asking for real help because I’m afraid of the answer',
      'how do I know if a friendship is actually real or just comfortable',
      'I keep things light because deep down I don’t trust the relationship',
      'why am I afraid to test my closest friendships',
    ],
  },
  {
    term: 'The Reciprocity Ledger',
    also: 'keeping score in kindness',
    definition:
      'The reciprocity ledger is a quiet mental tally of favors given — the ride, the listening ear, the last-minute help — kept without ever saying so, and cashed in as resentment the moment it is not matched. The other person never agreed to the exchange rate, because they never even knew a ledger existed.',
    action:
      'The next time you feel resentment building toward someone you have helped, say what you actually need from them directly instead of waiting for them to guess.',
    hook: 'You have been keeping the books on this friendship for a year. They didn’t know they had an account.',
    saidAs: [
      'why do I keep track of what I do for people',
      'I resent people who don’t give back the way I gave',
      'I help everyone and feel like nobody gives back equally',
      'I keep score in relationships without meaning to',
      'why do I feel used even though I offered to help',
      'I give and give and quietly wait for it to be returned',
      'I get resentful when the favor isn’t reciprocated',
      'why does helping people leave me feeling bitter instead of good',
    ],
  },
  {
    term: 'Noise Dependency',
    also: 'silence intolerance',
    definition:
      'Noise dependency is needing a podcast, video or scroll running in nearly every quiet stretch of your day, because ordinary silence feels unbearable rather than neutral. It is not entertainment. It is avoidance of the one voice that only gets a chance to speak once the input finally stops.',
    action: 'Sit with no phone, no music and no screen for five straight minutes and let the discomfort run its course without reaching for anything.',
    saidAs: [
      'I can’t sit in silence for even a minute',
      'I always need something playing in the background',
      'silence makes me anxious',
      'I put on a podcast for everything, even walking to the mailbox',
      'being alone with my own thoughts feels unbearable',
      'why do I need noise just to fall asleep',
      'I fill every quiet moment with my phone',
      'I feel like I can’t just sit and do nothing',
    ],
    hook: 'It was never boredom you were running from. It was the quiet.',
  },
  {
    term: 'Task Monument',
    also: 'monument task',
    definition:
      'A task monument is a small, mechanically quick task — a phone call, a form, an overdue email — that has sat undone so long it has grown an emotional weight completely out of proportion to the ten minutes it would actually take. The dread was never about the task. It is about everything you have made the task mean.',
    action: 'Pick the oldest task on your list, the one you skip past with your eyes every day, and finish it completely, today, in one sitting.',
    saidAs: [
      'there’s one thing on my list I never touch',
      'why does this simple task feel impossible to start',
      'I’ve been avoiding the same phone call for months',
      'this task has been sitting there so long it feels huge now',
      'I feel sick every time I see it on my to-do list',
      'it would only take ten minutes and I still haven’t done it',
      'why do I keep scrolling past the same task every day',
    ],
    hook: 'Ten minutes of actual work versus six months of walking past it. The math was never close.',
  },
  {
    term: 'Fair-Weather Discipline',
    definition:
      'Fair-weather discipline is a routine you have only ever run on good days — enough sleep, a decent mood, nothing going wrong — so you have no real evidence it works, only evidence it works when nothing is asking anything of it. It has never once been tested against resistance.',
    action: 'Run the exact same version of the routine, with no shortened version and no excuse, on the day you least want to.',
    saidAs: [
      'my routine only works on good days',
      'I only stick to it when life is easy',
      'the second something goes wrong I skip it',
      'is my discipline real or just convenient',
      'I’ve never actually tested my habit on a bad day',
      'why does one hard day wreck my whole system',
      'I only show up when I feel like it',
    ],
    hook: 'A system that only survives good weather was never actually load-bearing.',
  },
  {
    term: 'Teaching Lock',
    also: 'the articulation effect',
    definition:
      'A teaching lock is the way explaining a rule or standard out loud to another person commits you to it harder than any private resolution does — not because they are checking on you, but because you cannot casually lower a standard you just heard yourself state plainly. The lock is in the saying, not in their attention.',
    action: 'Pick one standard you keep quietly softening and explain it out loud, in plain terms, to one real person today.',
    saidAs: [
      'I hold myself to something more once I’ve said it out loud',
      'explaining my rule to someone else makes it feel real',
      'I can’t fudge it once I’ve told someone what I actually do',
      'saying it to another person locks me in somehow',
      'why does it feel different once I’ve explained it to someone',
      'I never break my own rule once I’ve stated it out loud',
      'talking it through with someone makes me actually follow it',
    ],
    hook: 'You weren’t teaching them the rule. You were welding yourself to it.',
  },
  {
    term: 'Phantom-Data Catastrophizing',
    also: 'zero-sample certainty',
    definition:
      'Phantom-data catastrophizing is rehearsing a feared conversation or message so many times that the imagined worst-case reaction starts to feel like real evidence, even though your actual sample size of responses is zero. You are treating a fantasy as data and letting it outvote the real, untested outcome.',
    action: 'Send the message or start the conversation now, on a short timer, so a real response replaces the imagined one.',
    saidAs: [
      'I’ve imagined every way this conversation could go badly',
      'I keep picturing the worst possible reaction before I even try',
      'I’ve rehearsed this so many times it feels like it already happened',
      'why do I assume the worst before anything has actually happened',
      'I’m scared of a reaction I haven’t actually gotten yet',
      'I’ve built this conversation up into something huge in my head',
      'I treat my worst fear like it already came true',
    ],
    hook: 'Zero real responses in, and somehow you already know exactly how this goes.',
  },
  {
    term: 'Variance Misread',
    also: 'sample-size blindness',
    definition:
      'A variance misread is treating a losing streak that is statistically normal for your actual success rate as proof that you personally are failing, instead of checking whether the losses simply fall inside the range the math would predict anyway. Zero wins at a real two percent rate is not a verdict. It is the expected outcome.',
    action: 'Write down your real numbers — attempts and hits — and calculate what the math actually predicts before deciding the run means anything about you.',
    saidAs: [
      'I keep losing and I think it means I’m bad at this',
      'is this just bad luck or am I actually failing',
      'zero wins in a row makes me think I should quit',
      'how many tries before a losing streak actually means something',
      'am I unlucky or genuinely not cut out for this',
      'my results keep confirming I’m not good enough',
      'is a bad streak actually proof of anything',
    ],
    hook: 'A coin can land on heads ten times running. That’s not a rigged coin — that’s just what odds occasionally do.',
  },
  {
    term: 'Make-It-Up-Tomorrow Bargain',
    also: 'skip-and-double-up',
    definition:
      'The make-it-up-tomorrow bargain is the negotiation where skipping a commitment feels harmless because you promise yourself you will double up tomorrow — a promise you have never once actually kept. It keeps today’s felt cost at zero while the real cost quietly compounds into weeks you can no longer account for.',
    action: 'Refuse the trade: if you skip a day, you do not double up later — you restart the whole count from day one, no exceptions.',
    saidAs: [
      'I’ll just make it up tomorrow',
      'I always tell myself I’ll double up later and never do',
      'skipping one day feels harmless in the moment',
      'I keep pushing it to tomorrow and tomorrow never comes',
      'why do I let myself off the hook with a promise I never keep',
      'one skipped day always turns into a skipped week',
      'I never actually make up the days I miss',
    ],
    hook: 'Check the record. That promise has never once been collected on.',
  },
  {
    term: 'Former-Self Contempt',
    definition:
      'Former-self contempt is refusing to do the small, beginner-level version of something you used to be genuinely good at, because performing a lesser version feels like an insult to who you used to be. So instead of one modest rep, you do nothing at all, which only widens the gap between past and present.',
    action: 'Do the small, unimpressive version today — the one rep, the one page, the one call — without comparing it to what you used to manage.',
    saidAs: [
      'I used to be so much better at this and now I can’t even start',
      'doing the beginner version feels humiliating',
      'I refuse to do a watered-down version of what I used to do',
      'starting small feels like an insult to who I was',
      'I’d rather do nothing than do it badly',
      'I can’t go back to basics after being good at this once',
      'it feels pathetic to start over from the beginning',
    ],
    hook: 'Zero reps is the actual insult. The small version was never the problem.',
  },
  {
    term: 'Manufactured Incompleteness',
    definition:
      'Manufactured incompleteness is going looking for a new tool, upgrade or protocol right when your plain, boring routine starts actually working — not to improve it, but because a system that already works with no extras removes your excuse for never having really committed. You need it to feel unfinished so quitting still has an alibi.',
    action: 'Add ten more boring minutes to the exact thing you are already doing — no new gear, no new research, no purchases.',
    saidAs: [
      'right when something starts working I want to upgrade it',
      'I keep adding new tools instead of just doing the simple thing',
      'why do I sabotage a routine the moment it starts working',
      'I need it to feel more complicated than it actually is',
      'I can’t just stick with the boring version that already works',
      'I keep needing one more thing before I really commit',
      'I add new steps right when the simple version was working',
    ],
    hook: 'A plan with no missing pieces has no room left for an excuse. So you go find it a missing piece.',
  },
  {
    term: 'Standing Audience Trap',
    also: 'the announced-plan tax',
    definition:
      'The standing audience trap is what happens after you announce a goal or comeback out loud: the people you told become a permanent gallery of check-ins you now feel obliged to answer, so you end up performing progress for an audience instead of quietly making it. The announcement meant to motivate you becomes a tax on it.',
    action: 'Tell the people checking in that you are going quiet on this for a while, and stop giving progress reports — even the good ones.',
    saidAs: [
      'everyone keeps asking how it’s going and I dread answering',
      'I regret telling people about my goal before I started',
      'checking in with people about my progress is exhausting',
      'I feel like I have to perform for people I told',
      'why did I tell everyone before I even really began',
      'people keep asking for proof I don’t have yet',
      'I wish I’d never announced what I was trying to do',
    ],
    hook: 'You didn’t recruit a support system. You hired an audience you now have to perform for.',
  },
  {
    term: 'Pity-Text Sympathy Loop',
    also: 'the sympathy loop',
    definition:
      'The pity-text sympathy loop is answering "are you okay" check-ins with real, detailed updates on how badly you are struggling, because the sympathy itself feels like being cared for. It keeps the wound visible and useful, since a person who has actually healed stops getting the concerned messages.',
    action: 'Answer the next check-in with something short and closed — "doing fine" — and redirect the conversation instead of narrating the struggle.',
    saidAs: [
      'I overshare my struggles whenever someone checks on me',
      'do I secretly want people to feel sorry for me',
      'I give too much detail when someone asks how I’m doing',
      'why do I keep the wound visible instead of letting it heal',
      'I like the attention I get from being the one who’s struggling',
      'I keep telling people how bad things are because it feels like being cared for',
      'talking about how hard things are gets me the sympathy I want',
    ],
    hook: 'A healed wound stops getting check-in texts. Some part of you already knows that.',
  },
  {
    term: 'Escape Hatch',
    also: 'secret permission to quit',
    definition:
      'An escape hatch is a private, unspoken permission you give yourself to bail if things get hard — a bad night justifies a restart, a rough week justifies a pause. You never actually use it, but knowing it exists is enough to quietly weaken the whole commitment before anything has even gone wrong.',
    action: 'Name the exact excuse you have been keeping in reserve, and decide out loud, in advance, that it will not be accepted later.',
    saidAs: [
      'I always keep an out in case things get hard',
      'I tell myself I can quit if it gets bad enough',
      'having a backup plan to bail makes me not really try',
      'I never use my excuse but knowing it’s there weakens everything',
      'why do I sabotage myself by leaving an easy way out',
      'I forgive myself in advance before I’ve even failed',
      'knowing I can quit any time makes it easier to actually quit',
    ],
    hook: 'You never opened the hatch. Knowing it was unlocked was enough to soften your grip the whole way.',
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
