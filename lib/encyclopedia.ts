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
