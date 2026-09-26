// Author-side voice — Master SOP §5: R-rated, savage, war-manual. Used for
// placeholders, fallbacks, empty states. NOT therapist-speak, NOT coddling.
// Keep these short — pages full of war-manual copy fatigue; one or two lines
// of dry edge lands harder.

export const empty = {
  catalogNoMatch:
    'Nothing in this filter yet. We ship 12 a week. Loosen the filter or come back in 7 days.',
  catalogColdBackend:
    'Catalog is loading from the warehouse. Refresh in a moment — the books are real, the API is just slow.',
  seriesNone:
    'Series feed is down. The 12 series are still on the schedule. Try again.',
  podcastNone: 'No episodes published yet. Subscribe and we will not waste your time.',
  reviewsNone: 'Reviews land after readers do. Be the first.',
  audioPending:
    'Audiobook is in production. The narration is human-supervised neural, not a robot reading slop.',
  audioQueued:
    'Audiobook queued. Drops the same week the ebook does — never later than two weeks behind.',
  formatComingSoon: 'Coming soon',
};

export const cta = {
  buy: 'Buy now',
  read: 'Read sample',
  listen: 'Hear the first chapter',
  apply: 'Apply for Founder Edition',
  freeChapter: 'Send me chapter one',
  startSeries: 'Start with book one',
  browseSeries: 'Browse the 12 series',
};

export const tone = {
  buyHelper: 'One-time. No subscription. The book is yours.',
  founderHelper:
    'Application only. 100 per year. If you have to ask why $9,999, this is not for you.',
  freeChapterHelper:
    'Just chapter one. No upsell on the back of the email. We send the file and leave you alone.',
  reducedMotionNote: 'Motion respects your system preference.',
};
