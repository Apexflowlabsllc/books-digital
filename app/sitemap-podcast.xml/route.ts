// The dedicated podcast surface was retired — podcast playback now
// lives on each book detail page. This route stays around so any
// crawler still polling the old index file gets a clean empty urlset
// instead of a 404 / 500. It's removed from the sitemap index, so no
// new crawl traffic should arrive after the next index refresh.
import { urlsetXml } from '@/lib/xml';

export const revalidate = 3600;

export async function GET() {
  return new Response(urlsetXml([]), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
