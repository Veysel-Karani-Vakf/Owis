// Materializes the three redesigned program pages in Supabase.
//
//   npm run cms:sync-programs             # report differences only
//   npm run cms:sync-programs -- --apply  # backup, then update in one transaction
//
// The public site can fall back to src/data/programs.ts, but the dashboard edits
// database rows. This command makes both sides start from the same complete copy.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';
import { createServer } from 'vite';

const { Client } = pg;
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const apply = process.argv.includes('--apply');

function readEnv(name) {
  if (process.env[name]) return process.env[name];
  const path = join(root, '.env.local');
  if (!existsSync(path)) return null;
  const match = readFileSync(path, 'utf8').match(new RegExp(`^\\s*${name}\\s*=\\s*(.+)\\s*$`, 'm'));
  return match?.[1]?.replace(/^["']|["']$/g, '') ?? null;
}

const connectionString = readEnv('SUPABASE_DB_URL');
if (!connectionString) throw new Error('Missing SUPABASE_DB_URL in .env.local or the environment.');

const JSON_COLUMNS = new Set([
  'title', 'summary', 'hero_image_alt', 'images', 'image_gallery', 'sections', 'goals', 'components',
  'statistics', 'videos', 'initiatives', 'cities', 'journey', 'pillars', 'highlights', 'phase',
  'audiences', 'themes', 'overview_image_alt', 'volunteer', 'media_products', 'spotlight', 'seo', 'cta',
  'media_note',
]);

const server = await createServer({
  root,
  logLevel: 'error',
  server: { middlewareMode: true },
  appType: 'custom',
});

let desiredRows;
let programsPage;
try {
  const defaults = await server.ssrLoadModule('/src/admin/lib/programDefaults.ts');
  const pageDefaults = await server.ssrLoadModule('/src/admin/lib/pageDefaults.ts');
  desiredRows = defaults.buildStaticProgramRows(defaults.PROGRAM_SYNC_SLUGS);
  programsPage = Object.fromEntries(
    ['ar', 'tr', 'en'].map((locale) => [locale, pageDefaults.buildPageValue('programs-page', locale, 'static')]),
  );
} finally {
  await server.close();
}

const slugs = desiredRows.map((row) => row.slug);
const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
await client.connect();

function comparable(value) {
  if (value === undefined) return null;
  if (Array.isArray(value)) return JSON.stringify(value.map(canonical));
  if (value && typeof value === 'object') return JSON.stringify(canonical(value));
  return String(value);
}

function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonical(value[key])]));
}

try {
  const current = await client.query('select * from public.programs where slug = any($1) order by slug', [slugs]);
  const bySlug = new Map(current.rows.map((row) => [row.slug, row]));

  for (const desired of desiredRows) {
    const row = bySlug.get(desired.slug);
    if (!row) {
      console.log(`${desired.slug}: missing row (will be created with --apply)`);
      continue;
    }
    const differences = Object.keys(desired).filter((key) => comparable(row[key]) !== comparable(desired[key]));
    console.log(`${desired.slug}: ${differences.length ? differences.join(', ') : 'already synchronized'}`);
  }

  const pageResult = await client.query("select * from public.site_pages where key = 'programs-page'");
  const currentPage = pageResult.rows[0] ?? null;
  console.log(`programs-page: ${comparable(currentPage?.data) === comparable(programsPage) ? 'already synchronized' : 'data'}`);

  if (!apply) {
    console.log('Check only. Re-run with --apply to create a backup and synchronize these rows.');
    process.exitCode = 0;
  } else {
    const backupDir = join(root, 'scripts', 'backups');
    mkdirSync(backupDir, { recursive: true });
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = join(backupDir, `program-content-${stamp}.json`);
    writeFileSync(
      backupPath,
      JSON.stringify({ createdAt: new Date().toISOString(), programs: current.rows, programsPage: currentPage }, null, 2),
      'utf8',
    );

    await client.query('begin');
    try {
      for (const desired of desiredRows) {
        const columns = Object.keys(desired);
        const values = columns.map((column) =>
          JSON_COLUMNS.has(column) && desired[column] !== null ? JSON.stringify(desired[column]) : desired[column],
        );
        const placeholders = columns
          .map((column, index) => `$${index + 1}${JSON_COLUMNS.has(column) ? '::jsonb' : ''}`)
          .join(', ');
        const assignments = columns
          .filter((column) => column !== 'slug')
          .map((column) => `"${column}" = excluded."${column}"`)
          .join(', ');
        const sortOrder = ['yemen-pioneers', 'capacity-building', 'institutional-development', 'community-awareness']
          .indexOf(desired.slug);
        values.push(sortOrder);
        await client.query(
          `insert into public.programs (${columns.map((column) => `"${column}"`).join(', ')}, sort_order, is_published)
           values (${placeholders}, $${values.length}, true)
           on conflict (slug) do update set ${assignments}, updated_at = now()`,
          values,
        );
      }

      const label = currentPage?.label ?? { ar: 'نصوص صفحات البرامج', tr: 'Program sayfası metinleri', en: 'Program page texts' };
      await client.query(
        `insert into public.site_pages (key, label, data)
         values ('programs-page', $1::jsonb, $2::jsonb)
         on conflict (key) do update set data = excluded.data, updated_at = now()`,
        [JSON.stringify(label), JSON.stringify(programsPage)],
      );
      await client.query('commit');
    } catch (error) {
      await client.query('rollback');
      throw error;
    }

    console.log(`Synchronized ${slugs.length} program rows and programs-page.`);
    console.log(`Backup: ${backupPath}`);
  }
} finally {
  await client.end();
}
