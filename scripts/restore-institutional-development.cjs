// Restores the institutional-development program row:
//  - sections/highlights/seo: full content extracted from src/data/programs.ts
//    (stored in full so the currently deployed bundle shows it immediately).
//  - hero_image/images/image_gallery/media_note: NULL so the site falls back to
//    the bundled static assets (the stored "/src/assets/..." dev paths 404 in
//    production builds).
// Also NULLs the broken dev asset paths on yemen-pioneers and capacity-building.
const fs = require('fs');
const path = require('path');

const repo = 'D:/work/GitHub Pro/Veysel-Karani-Vakf';
const { Client } = require(path.join(repo, 'node_modules', 'pg'));
const envText = fs.readFileSync(path.join(repo, '.env.local'), 'utf8');
const env = Object.fromEntries(
  envText
    .split(/\r?\n/)
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => {
      const i = l.indexOf('=');
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    }),
);

const content = require('./restore-institutional-content.json');
const byLocale = (field) => ({
  ar: content.ar[field],
  en: content.en[field],
  tr: content.tr[field],
});

(async () => {
  const client = new Client({ connectionString: env.SUPABASE_DB_URL, ssl: { rejectUnauthorized: false } });
  await client.connect();
  try {
    await client.query('BEGIN');

    // images is NOT NULL: [] is inert (only the pioneers home-hero merge reads it).
    // image_gallery/media_note are NOT NULL: an all-null / all-blank locale map is
    // the adapter's "not set" shape, so the static defaults apply.
    const unsetGallery = JSON.stringify({ ar: null, en: null, tr: null });
    const blankNote = JSON.stringify({ ar: '', en: '', tr: '' });

    const inst = await client.query(
      `UPDATE programs SET
         sections = $1::jsonb,
         highlights = $2::jsonb,
         seo = $3::jsonb,
         hero_image = NULL,
         images = '[]'::jsonb,
         image_gallery = $4::jsonb,
         media_note = $5::jsonb,
         updated_at = now()
       WHERE slug = 'institutional-development'
       RETURNING slug`,
      [
        JSON.stringify(byLocale('sections')),
        JSON.stringify(byLocale('highlights')),
        JSON.stringify(byLocale('seo')),
        unsetGallery,
        blankNote,
      ],
    );
    if (inst.rowCount !== 1) throw new Error(`institutional-development update touched ${inst.rowCount} rows`);

    const assets = await client.query(
      `UPDATE programs SET
         hero_image = NULL,
         images = '[]'::jsonb,
         image_gallery = $1::jsonb,
         updated_at = now()
       WHERE slug IN ('yemen-pioneers', 'capacity-building')
         AND hero_image LIKE '/src/assets/%'
       RETURNING slug`,
      [unsetGallery],
    );

    await client.query('COMMIT');
    console.log('updated:', inst.rows.map((r) => r.slug).concat(assets.rows.map((r) => r.slug)).join(', '));

    const check = await client.query(
      `SELECT slug,
              hero_image,
              (SELECT string_agg(s->>'id', ',') FROM jsonb_array_elements(sections->'ar') s) AS ar_section_ids,
              jsonb_array_length(highlights->'ar') AS ar_highlights,
              seo->'ar'->>'description' AS ar_seo_desc
       FROM programs WHERE slug = 'institutional-development'`,
    );
    console.log(JSON.stringify(check.rows[0], null, 1));
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    throw err;
  } finally {
    await client.end();
  }
})().catch((e) => {
  console.error('ERR:', e.message);
  process.exit(1);
});
