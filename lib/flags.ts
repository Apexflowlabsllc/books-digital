/* Compile-time feature flags. Flip a const, redeploy. No env-var
 * dependency — these are decisions, not configuration.
 */

// Podcast video: ON for the 20 books that have it (S1 + S2). Books
// without a real MP4 self-hide via VideoPlayer's onError handler — the
// 403/404 they get from the backend trips the listener, which unmounts
// the player. No flicker, no broken UI on books without video.
// Brian paused video generation 2026-05-25 so the pool won't grow
// beyond 20 until he reverses; flip to false if we ever need to hide
// it site-wide again.
export const SHOW_PODCAST_VIDEO = true;
