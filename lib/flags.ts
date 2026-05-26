/* Compile-time feature flags. Flip a const, redeploy. No env-var
 * dependency — these are decisions, not configuration.
 */

// The /podcast page was retired — podcast audio + video now live
// inline on each book detail page only. Books without a real MP4 /
// MP3 self-hide via the player's onError handler, so the visible
// section auto-matches what the backend has uploaded.
export const SHOW_PODCAST_VIDEO_ON_BOOK = true;

// Legacy exports kept so old imports compile during transition.
export const SHOW_PODCAST_VIDEO_ON_PODCAST_PAGE = false;
export const SHOW_PODCAST_VIDEO = SHOW_PODCAST_VIDEO_ON_BOOK;
