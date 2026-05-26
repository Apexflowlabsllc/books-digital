import { redirect } from 'next/navigation';

// /podcast/[slug] retired with the rest of the podcast surface —
// individual episodes never shipped a backend endpoint, and podcast
// playback now lives on each book detail page. Stale inbound links
// land on the catalog.
export default function PodcastEpisodePage(): never {
  redirect('/books');
}
