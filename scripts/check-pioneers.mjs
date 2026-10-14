import assert from 'node:assert/strict';
import { createServer } from 'vite';

const server = await createServer({
  logLevel: 'error',
  server: { middlewareMode: true },
  appType: 'custom',
});

try {
  const store = await server.ssrLoadModule('/src/cms/store.ts');
  const { getPioneersContent, getPioneerBySlug, getStaticPioneersContent } =
    await server.ssrLoadModule('/src/data/pioneers.ts');
  const staticRoster = getStaticPioneersContent('ar').pioneers;
  assert.ok(staticRoster.length > 3, 'The explicit static import source remains available');
  const [visible, hidden] = staticRoster;
  const row = (pioneer, published) => ({
    slug: pioneer.slug,
    cohort_id: pioneer.cohortId,
    name: { ar: pioneer.name },
    is_published: published,
    sort_order: pioneer.order,
  });
  const setRows = (rows) => store.setPublished({ tables: { pioneers: rows }, pages: {} });

  for (const locale of ['ar', 'tr', 'en']) {
    store.setPublished({ tables: {}, pages: {} });
    assert.equal(getPioneersContent(locale).pioneers.length, 0, 'No initial static flash');
    assert.equal(getPioneerBySlug(locale, hidden.slug), undefined);

    setRows([]);
    assert.equal(getPioneersContent(locale).pioneers.length, 0, 'Empty CMS stays empty');

    setRows([row(hidden, false)]);
    assert.equal(getPioneersContent(locale).pioneers.length, 0, 'All hidden stays empty');

    setRows([row(visible, true), row(hidden, false)]);
    assert.deepEqual(
      getPioneersContent(locale).pioneers.map((pioneer) => pioneer.slug),
      [visible.slug],
      'Only published CMS rows appear; missing static profiles are never appended',
    );
    assert.equal(getPioneerBySlug(locale, hidden.slug), undefined, 'Hidden biography is unavailable');
    assert.ok(getPioneerBySlug(locale, visible.slug)?.fullBio.length, 'Published profiles retain static field defaults');

    store.setDraft({ tables: { pioneers: [row(visible, false)] }, pages: {} });
    assert.equal(getPioneersContent(locale).pioneers.length, 0, 'Preview respects unpublishing');
    store.setDraft(null);
  }

  store.setPublished({ tables: {}, pages: {} });
  store.markCmsSettled();
  assert.equal(getPioneersContent('ar').pioneers.length, 0, 'Failed fetch never restores static profiles');
  console.log('Pioneer visibility checks passed (loading, empty, hidden, mixed, preview, failure, biographies, all locales).');
} finally {
  await server.close();
}
