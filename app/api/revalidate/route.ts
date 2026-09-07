import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

// Manual cache-bust for the Next.js Data Cache fetches in lib/api.ts (getBook,
// getSeries, getCatalog etc all tag their fetch calls). Those fetches cache
// for up to an hour by default — fine for a stable catalog, wrong while the
// manuscript pipeline is completing books live and flipping is_authentic
// underneath. Hit this after a backend catalog sync instead of waiting.
//
// GET /api/revalidate?tag=book&secret=... (also: series, catalog, or
// book:<slug> for one title)
export async function GET(req: Request) {
  const url = new URL(req.url);
  const secret = url.searchParams.get('secret');
  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'invalid secret' }, { status: 401 });
  }

  const tag = url.searchParams.get('tag');
  if (!tag) return NextResponse.json({ error: 'tag query param required' }, { status: 400 });

  // { expire: 0 } — never serve stale here. This route is called right after
  // a backend catalog sync specifically to make the change visible now, not
  // eventually; the "max" stale-while-revalidate profile would defeat that.
  revalidateTag(tag, { expire: 0 });
  return NextResponse.json({ revalidated: tag, now: Date.now() });
}
