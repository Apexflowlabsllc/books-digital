import assert from 'node:assert/strict';
import test from 'node:test';
import { getBook } from '../api';

const raw = {
  bookId: 's01_b03', slug: 'the-iron-routine', title: 'The Iron Routine',
  bookNumber: 3, description: 'A sales description, not a chapter.',
  series: { number: 1, slug: 'discipline', name: 'Discipline', color: '#000', wave: 1, promise: '' },
};

test('book detail separates manuscript excerpts and total length from marketing text', async (t) => {
  let payload: Record<string, unknown> = raw;
  t.mock.method(globalThis, 'fetch', async () => new Response(JSON.stringify(payload), {
    status: 200, headers: { 'Content-Type': 'application/json' },
  }));
  const noSample = await getBook(raw.slug);
  assert.equal(noSample?.sample_chapter, undefined);
  assert.equal(noSample?.word_count, undefined);
  assert.equal(noSample?.description, raw.description);

  payload = { ...raw, freeChapterTitle: 'A real opening', freeChapterText: 'One real paragraph.\n\nAnother real paragraph.', wordCount: 23803 };
  const withSample = await getBook(raw.slug);
  assert.deepEqual(withSample?.sample_chapter, {
    title: 'A real opening', body: payload.freeChapterText, word_count: 6,
  });
  assert.equal(withSample?.word_count, 23803);

  for (const invalidCount of [0, -1, 1.5, '38000', null]) {
    payload = { ...raw, freeChapterText: '  \n ', wordCount: invalidCount };
    const book = await getBook(raw.slug);
    assert.equal(book?.sample_chapter, undefined);
    assert.equal(book?.word_count, undefined);
  }
});

test('only the book-specific fulfillment audio is available for purchase or preview', async (t) => {
  const url = (id: string) => `https://www.apexflowlabs.com/api/v1/books/audio/${id}/audiobook.mp3`;
  let input: Record<string, unknown> = {};
  t.mock.method(globalThis, 'fetch', async () => new Response(JSON.stringify({ ...raw, ...input })));
  for (const [id, flag, authentic, expected] of [
    [raw.bookId, true, true, true],
    [raw.bookId, undefined, true, true],
    ['s01_b01', true, true, false],
    [raw.bookId, false, true, false],
    [raw.bookId, true, false, false],
  ] as const) {
    input = { audiobook: { mp3Url: url(id) }, audioAvailable: flag, isAuthentic: authentic };
    const book = await getBook(raw.slug);
    assert.equal(book?.audiobook?.full_url, expected ? url(raw.bookId) : undefined);
    assert.equal(book?.audio_status, expected ? 'live' : 'queued');
    assert.equal(book?.formats.find((f) => f.format === 'audiobook')?.available, expected);
  }
});
