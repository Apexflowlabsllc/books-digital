import { ENCYCLOPEDIA, type EncyclopediaEntry } from './encyclopedia';

/**
 * THE APEX FLOW BLOG.
 *
 * Same law as the encyclopedia and the problem pages: real, few, and
 * substantive, or it doesn't exist. No post here is written to fill a slot —
 * each one exists because a real encyclopedia entry (built from actual book
 * content, not a keyword list) had enough underneath it to carry a full
 * article instead of a paragraph.
 *
 * A blog post is the long-form version of a problem page: the same real
 * definition and action, but with the room to actually walk through why the
 * pattern happens and what breaks it, in the same voice the books use.
 */

export type BlogPost = {
  slug: string;
  title: string;
  dek: string;
  /** Encyclopedia term this post is built from — the source of truth. */
  term: string;
  /** The raw, first-person line that opens the post — how a person actually
   *  says this out loud before anyone's explained it to them. Read before
   *  the title, not after. */
  shockOpen: string;
  /** Full article body, as paragraphs. Real prose, not bullet padding. */
  body: string[];
  publishedAt: string;
};

function entryFor(term: string): EncyclopediaEntry {
  const e = ENCYCLOPEDIA.find((x) => x.term === term);
  if (!e) throw new Error(`No encyclopedia entry for "${term}" — blog post has no source.`);
  return e;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'the-goal-you-cant-fail-because-you-never-defined-it',
    title: "The Goal You Can't Fail, Because You Never Defined It",
    dek: 'Why "get healthier" and "be more disciplined" are built to never resolve — and the one-line fix.',
    term: 'Undefined standard',
    shockOpen: "I don't even know if I'm doing enough. Some days I feel like I'm crushing it and some days I feel like a failure, and I genuinely could not tell you what the difference was.",
    publishedAt: '2026-06-02',
    body: [
      "Here's a question that will ruin your morning: what would it have taken for you to fail today, specifically? Not this month. Not this year. Today, by five o'clock. If you can't answer that in one sentence with a number in it, you haven't set a goal — you've set a mood, and moods vote however they want.",
      "The problem was never that you lack discipline. The problem is you never wrote down what discipline would even mean by five o'clock today.",
      "This is the whole mechanism behind \"get healthier,\" \"be more disciplined,\" \"work on myself.\" They sound like commitments. They function as escape hatches. There is no day you clearly failed at \"get healthier,\" which means there's also no day you clearly won — every single day gets to be graded on a curve your own mood writes in real time. Ate something decent? Counts. Skipped the gym but thought about going? Also counts. The goalposts don't move because someone's cheating; they move because there were never any posts, just a general vibe you're allowed to satisfy however's convenient.",
      "A floor ends the negotiation. \"Ten push-ups\" either happened or it didn't. There's no version of today where you get to feel good about ten push-ups you didn't do, because the number doesn't negotiate the way adjectives do. That's the entire value of a hard floor over a vague direction — not that it's more ambitious, but that it's not arguable.",
      "This shows up everywhere once you start looking for it. \"I want to be more present with my kids\" — present compared to what, measured how? \"I'm trying to save more\" — a specific number, or a feeling you get to grade yourself on? \"I should read more\" — is that one page or one book, and does scrolling a long article count today because you're tired? Every one of these is a goal engineered, probably by accident, to never produce a clear loss — which means it never produces a clear win either. You can chase it for a decade and never once know if you're closer.",
      "The fix costs nothing and takes about ninety seconds. Take one goal you've been carrying around in adjective form and rewrite it as a number you either hit or missed today. Not \"eat better\" — \"one vegetable at dinner.\" Not \"exercise more\" — \"walked for ten minutes.\" It will feel embarrassingly small. That's correct. The size isn't the point; the fact that it can fail is the point. A standard that can't fail can't mean anything, because meaning requires the possibility of missing it.",
      "Do this for one goal today. Don't overhaul your whole life's worth of vague intentions in one sitting — that's just another version of productive procrastination, dressed up as thoroughness, and it's a damn shame how convincing it looks from the inside. Pick the one that's been bothering you the most, write the number down, and let today be the first day it's possible to actually lose.",
    ],
  },
  {
    slug: 'the-two-hours-you-spent-on-the-font',
    title: 'The Two Hours You Spent on the Font',
    dek: "Productive procrastination doesn't feel like avoiding the work. It feels like doing it — that's what makes it dangerous.",
    term: 'Productive procrastination',
    shockOpen: "I was busy all day. I swear I was actually busy all day. So why, when I lay down tonight, does it feel like nothing that actually matters moved even an inch?",
    publishedAt: '2026-06-09',
    body: [
      'You spent two hours on the font. The font did not cut your debt.',
      "Nobody sits down planning to waste a day. That's not how this one works — the ordinary kind of procrastination is at least honest about itself. You know you're avoiding the thing; you feel a little guilty scrolling instead of working. Productive procrastination doesn't come with that warning light, because it isn't avoidance dressed as nothing — it's avoidance dressed as diligence, and diligence doesn't ping your conscience the way doom-scrolling does.",
      "Here's what it actually looks like: reorganizing the spreadsheet for the third time. Color-coding a plan that has zero entries in it. Reading four more articles on \"the best way to start\" a project you have, in fact, not started. Building the perfect system for tracking a habit you haven't performed once. Every single one of these involves real effort, real attention, sometimes real skill — which is exactly why it doesn't feel like hiding. Hiding feels like nothing. This feels like work.",
      "The tell is what the activity is actually protecting you from. Real work on the thing that matters carries a chance of finding out you're not as good at it as you hoped, or that it's harder than you thought, or that after all this effort it still might not work. Reorganizing the plan carries none of that risk. You can spend four hours perfecting a system and never once find out anything uncomfortable about yourself — the system doesn't have opinions about you. The actual task does.",
      "This is why the busywork always feels so justified in the moment. It's not laziness logic (\"I don't feel like it\") — it's diligence logic (\"I'm being thorough, I'm setting myself up right, I don't want to start until I've really thought this through\"). Diligence logic is much harder to argue with, including when you're the one arguing with yourself. That's the whole design flaw it exploits.",
      "The fix isn't a better system for catching yourself — more planning to fix a planning problem is just the disease with a new coat of paint. The fix is a rule about sequencing: before you plan, organize, research, or optimize anything else today, put in ten unplanned, imperfect minutes on the actual task first. Not the perfect version. Not the version preceded by research. Just ten minutes of the real thing, done badly if that's what it takes.",
      "Ten minutes doesn't feel like much, and that's exactly why it works — it's small enough that the part of you generating elaborate justifications for delay doesn't consider it worth a fight. But it does something the four hours of font selection never can: it produces actual contact with the actual problem, which is the only damn thing that was ever going to move it. You can color-code the spreadsheet after. See if you still feel like it.",
    ],
  },
  {
    slug: 'the-three-people-who-would-bail-you-out-of-jail',
    title: 'The Three People Who Would Bail You Out of Jail',
    dek: "You have a hundred and fifty contacts and know exactly which three actually matter. When did you last call them?",
    term: 'Emotional inventory management',
    shockOpen: "I have a phone full of people and I still feel completely alone half the time. I don't understand how both of those things can be true at once, but they are.",
    publishedAt: '2026-06-16',
    body: [
      'You have a hundred and fifty people in your phone and three of them would bail you out of jail. You know which three. You have not called them in a month.',
      "Run the math on your own week honestly. How much of your emotional energy — the actual attention, the bracing-yourself-before-you-answer, the replaying-the-conversation-after — went to people who are not, in any real sense, close to you? The acquaintance who guilt-trips over nothing. The group chat that generates fifty notifications and zero connection. The relative who calls exactly when something's needed and not once in between. None of these people are your enemies. That's not the problem. The problem is they're taking up the exact kind of attention that's supposed to be reserved for the handful of people who'd actually show up.",
      "This is what emotional inventory management costs you: not the individual interactions, which are each small enough to seem harmless, but the total allocation. Attention is not infinite. Every ounce spent managing a shallow relationship's feelings is an ounce that didn't go to a deep one. And the shallow ones are, perversely, often louder — they demand more real-time management precisely because they're not stable enough to coast on trust the way real closeness can.",
      "The result is a specific, disorienting kind of loneliness: you're not isolated, you're surrounded — genuinely busy, genuinely social, genuinely responding to people all day — and still exhausted, and still, if you're honest, not close to anyone in the room. That's not a contradiction. It's what happens when closeness and contact get treated as the same thing, when they've never been the same thing.",
      "Here's the exercise, and it takes less time to do than it took to read this far: name the three people who would actually bail you out of jail. Not the biggest group chat. Not the most frequent texter. The three who would answer at 2 a.m. and not ask many questions first. You already know who they are — that's not the hard part. The hard part is noticing how long it's actually been since you called one of them, on purpose, for no reason except that you wanted to talk to them.",
      "Call one today. Not a text, not a reaction to their story — an actual call, or at minimum a real conversation, initiated by you, for no transactional reason. It will feel oddly vulnerable, mostly because you're out of practice reaching toward the people who don't require constant management to keep the peace. That discomfort is the sign you found the right person. The ones who need managing rarely feel vulnerable to reach out to — they just feel necessary, which is a hell of a thing to realize about the wrong people. That's worth sitting with.",
    ],
  },
  {
    slug: 'the-four-second-flicker-that-costs-you-everything',
    title: "The Four-Second Flicker That Costs You Everything",
    dek: "It never shows up as a dramatic collapse. It shows up right before the finish line, dressed as one reasonable exception.",
    term: 'Pre-finish relapse urge',
    shockOpen: "I was so close. I don't even know why I did it — I was two days from done and something in me just needed to blow it up. I don't understand myself right now.",
    publishedAt: '2026-06-23',
    body: [
      "This is the moment you were warned about. Not a dramatic collapse — a four-second flicker where the old reflex says it costs nothing. It cost you three years last time.",
      "Everyone braces for the hard part in the middle. The middle is where it's supposed to be difficult — that's not a surprise, and most people who fail there at least saw it coming. The pre-finish relapse urge doesn't show up in the middle. It shows up in the last stretch, right when the thing is nearly done, right when momentum has built up enough that quitting seems like it shouldn't even be on the table anymore. That's exactly what makes it so effective: nobody's guarding the door at the finish line, because everyone assumed the danger was already behind them.",
      "It almost never arrives as a dramatic collapse. Nobody wakes up on day eighty-eight of ninety and decides to torch the whole project. What actually happens is smaller and much harder to catch: one exception that sounds completely reasonable. Just this one day off — you've earned it. Just this one old habit, just this once, as a treat, because you're so close it doesn't matter anymore. The framing is always \"this doesn't count because I'm basically already done,\" which is precisely backwards. You are not done. You are two days from done, which is not the same category as done, no matter how safe it feels.",
      "The nervous system doesn't experience the last mile as a victory lap — it experiences the accumulated effort as a debt that wants to be paid back, and it will manufacture a plausible-sounding reason to collect early. That's what makes this pattern so hard to see from inside it: the exception never feels like sabotage in the moment. It feels like a fair, minor, harmless request from a version of you who has clearly earned a break. It's not until later — sometimes much later — that the size of what that one exception actually cost becomes visible.",
      "The fix is to expect it before it shows up, not after. In the last few days of anything you're finishing — a habit, a project, a hard conversation you've been building toward — assume one plausible-sounding exception is coming, and decide in advance that when it arrives, it's not a reasonable request. It's the test. The whole ninety days was, in a sense, building toward this exact moment, and the version of the test that actually matters is the quiet one at the end, not the dramatic one you were already prepared for in the middle.",
      "You don't beat this by having more willpower reserve at the finish line. You beat it by recognizing the four-second flicker for what it is the moment it shows up, instead of three years later when you're doing the math on what that one dumbass exception actually cost.",
    ],
  },
  {
    slug: 'the-plateau-is-not-a-rest-stop',
    title: 'The Plateau Is Not a Rest Stop',
    dek: "Standing still long enough starts to feel like peace. That's the trap, not the reward.",
    term: 'Complacency plateau',
    shockOpen: "I stopped moving and I don't even know when it happened. It just started to feel like this was fine. I don't know how long I've actually been standing still.",
    publishedAt: '2026-06-30',
    body: [
      'Nobody warns you that the plateau is not a gentle rest stop. It is a trap designed by your own biology.',
      "There's a specific, seductive feeling that shows up after enough time spent not-improving: it starts to feel like calm. Not stagnation — peace. The edges have worn off whatever discomfort originally pushed you to change something, and what's left feels suspiciously like arrival. This is the complacency plateau, and the reason it's dangerous isn't that it's uncomfortable. It's dangerous precisely because it stops registering as a problem at all.",
      "Your body and nervous system are extremely good at adapting to a new baseline, whatever that baseline is. That's usually a strength — it's how you tolerate hard things long enough to get through them. But the same adaptation that lets you survive a genuinely difficult stretch will just as happily normalize a stretch where you've simply stopped moving. Give it thirty days of no real progress and your system will start treating \"no real progress\" as the default weather, not as a signal that something needs to change.",
      "This is why the plateau is so much harder to escape than a bad week. A bad week feels bad — the discomfort itself is the signal that gets you moving again. A plateau doesn't hurt. It's not restful in any way that actually recharges you, but it convincingly imitates rest well enough that the part of you responsible for noticing problems stops filing reports. You can be genuinely stalled for months while feeling, on a day-to-day basis, entirely fine about it.",
      "The tell isn't how you feel — feelings are exactly the sense that's been fooled here. The tell is a number. Name one metric in your life that has not moved in thirty days: weight, savings, a skill, a relationship, anything you'd normally expect to trend somewhere. If you can name one instantly, you've found the plateau, whether or not it currently feels like a problem.",
      "The way off is deliberately small, because the goal isn't a dramatic overhaul — it's proving to your own nervous system that this baseline is not, in fact, fixed weather. Pick the smallest possible action that would move that one stalled metric this week. Not a new program. Not a total life reset. One small, real move, sized so there's no excuse not to make it, and no way to mistake it for anything but genuine progress once it's done.",
      "The plateau will still feel peaceful while you do it. That's fine. You're not trying to make it feel uncomfortable — you're trying to make it move again. The feeling was lying to you the whole damn time. The number never does.",
    ],
  },
];

export function findPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

/** The blog post built from a given encyclopedia term, if one exists yet. */
export function findPostByTerm(term: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.term === term);
}

/** The encyclopedia entry a post is built from — for the "what to do" block and real book matching. */
export function postSource(post: BlogPost): EncyclopediaEntry {
  return entryFor(post.term);
}
