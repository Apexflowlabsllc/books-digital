/* Compile-time feature flags. Flip a const, redeploy. No env-var
 * dependency — these are decisions, not configuration.
 */

// Per-surface podcast-video flags. Brian wants video off on the book
// detail page (cleaner buy flow) but on for the dedicated /podcast
// page where the whole grid is visible. Books without a real MP4
// self-hide via VideoPlayer's onError handler — the 403/404 trips
// the listener and the player unmounts.
export const SHOW_PODCAST_VIDEO_ON_BOOK = false;
export const SHOW_PODCAST_VIDEO_ON_PODCAST_PAGE = true;

// Legacy export kept for safety in case any imports remain — points
// at the more permissive flag so behavior matches /podcast page.
export const SHOW_PODCAST_VIDEO = SHOW_PODCAST_VIDEO_ON_PODCAST_PAGE;
