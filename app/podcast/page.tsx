import { redirect } from 'next/navigation';

// /podcast as a dedicated page was retired — podcast audio + video
// now lives inline on each book detail page (the ones with real
// episodes). Old links + sitemap entries 308 to /books so inbound
// traffic still lands somewhere useful.
export default function PodcastPage(): never {
  redirect('/books');
}
