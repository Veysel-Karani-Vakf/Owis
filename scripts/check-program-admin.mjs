import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { createServer } from 'vite';

const root = resolve(process.cwd());
const server = await createServer({
  root,
  logLevel: 'error',
  server: { middlewareMode: true },
  appType: 'custom',
});

try {
  const defaults = await server.ssrLoadModule('/src/admin/lib/programDefaults.ts');
  const provisioning = await server.ssrLoadModule('/src/admin/lib/programProvisioning.ts');
  const programsModule = await server.ssrLoadModule('/src/data/programs.ts');
  const store = await server.ssrLoadModule('/src/cms/store.ts');
  const pageData = await server.ssrLoadModule('/src/admin/lib/pageData.ts');

  const rows = defaults.buildStaticProgramRows(defaults.PROGRAM_SYNC_SLUGS);
  const bySlug = new Map(rows.map((row) => [row.slug, row]));

  const capacity = bySlug.get('capacity-building');
  const institutional = bySlug.get('institutional-development');
  const awareness = bySlug.get('community-awareness');
  assert.equal(capacity.layout, 'volunteer');
  assert.equal(institutional.layout, 'institutional');
  assert.equal(awareness.layout, 'awareness');
  assert.ok(capacity.volunteer.ar.statement.title);
  assert.equal(institutional.statistics.ar.length, 4);
  assert.equal(institutional.cities.ar.length, 4);
  assert.ok(institutional.phase.ar.period);
  assert.equal(awareness.media_products.ar.length, 4);
  assert.ok(awareness.spotlight.ar.title);
  assert.doesNotMatch(JSON.stringify(rows), /\/src\/assets\//);

  const missingRows = provisioning.missingProgramRows([
    { slug: 'yemen-pioneers' },
    { slug: 'capacity-building' },
  ]);
  assert.deepEqual(
    missingRows.map((row) => row.slug),
    ['institutional-development', 'community-awareness'],
  );
  assert.ok(missingRows.every((row) => row.is_published === true));
  assert.deepEqual(missingRows.map((row) => row.sort_order), [2, 3]);

  const legacyRows = provisioning.legacyProgramRows([
    { ...institutional, layout: null, statistics: { ar: [], tr: [], en: [] } },
    { ...awareness, layout: 'awareness', media_products: { ar: [], tr: [], en: [] } },
  ]);
  assert.equal(legacyRows.length, 1);
  assert.equal(legacyRows[0].layout, 'institutional');
  assert.equal(legacyRows[0].statistics.ar.length, 4);

  assert.deepEqual(
    pageData.fillMissingPageData(
      { hero: { title: 'Edited' }, cards: [] },
      { hero: { title: 'Default', description: 'Added' }, cards: ['default'] },
    ),
    { hero: { title: 'Edited', description: 'Added' }, cards: [] },
  );

  const incompleteInstitutional = {
    ...institutional,
    statistics: { ar: null, tr: null, en: null },
    cities: { ar: null, tr: null, en: null },
    phase: { ar: null, tr: null, en: null },
  };
  const editorInstitutional = defaults.programRecordForEditor(incompleteInstitutional);
  assert.equal(editorInstitutional.statistics.ar.length, 4);
  assert.equal(editorInstitutional.cities.ar.length, 4);
  assert.ok(editorInstitutional.phase.ar.period);

  const legacyCapacity = {
    ...capacity,
    layout: null,
    volunteer: null,
    summary: { ar: 'OLD', tr: 'OLD', en: 'OLD' },
    sections: { ar: [{ id: 'forum', title: 'OLD' }] },
  };
  const editorCapacity = defaults.programRecordForEditor(legacyCapacity);
  assert.notEqual(editorCapacity.summary.ar, 'OLD');
  assert.ok(editorCapacity.volunteer.ar.statement.title);

  const partialCapacity = {
    ...capacity,
    volunteer: { ar: { eyebrow: 'نص معدل' }, tr: null, en: null },
  };
  store.setPublished({ tables: { programs: [partialCapacity] }, pages: {} });
  let rendered = programsModule.getProgramsContent('ar').programs[0];
  assert.equal(rendered.volunteer.eyebrow, 'نص معدل');
  assert.ok(rendered.volunteer.statement.title, 'partial groups retain untouched nested defaults');

  store.setPublished({
    tables: { programs: [{ ...capacity, highlights: { ar: [], tr: [], en: [] } }] },
    pages: {},
  });
  rendered = programsModule.getProgramsContent('ar').programs[0];
  assert.deepEqual(rendered.highlights, [], 'an editor-cleared list stays empty');

  store.setPublished({ tables: { programs: [legacyCapacity] }, pages: {} });
  rendered = programsModule.getProgramsContent('ar').programs[0];
  assert.notEqual(rendered.summary, 'OLD');
  assert.equal(rendered.layout, 'volunteer');

  console.log('Program admin coverage checks passed.');
} finally {
  await server.close();
}
