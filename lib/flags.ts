/* Compile-time feature flags. Flip a const, redeploy. No env-var
 * dependency — these are decisions, not configuration.
 */

// Brian's 2026-05-25 directive: skip podcast video generation for new
// books. We have video for the first 20 (S1 + S2), but it won't grow
// until he reverses the call. Hide the video player site-wide until
// then. Flip to true to turn the players back on in one line.
export const SHOW_PODCAST_VIDEO = false;
