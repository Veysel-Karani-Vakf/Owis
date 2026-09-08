import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
function env(key) {
  const text = readFileSync(join(root, '.env.local'), 'utf8');
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(new RegExp(`^\\s*${key}\\s*=\\s*(.+)\\s*$`));
    if (m) return m[1].replace(/^["']|["']$/g, '');
  }
  return null;
}
const client = new pg.Client({ connectionString: env('SUPABASE_DB_URL'), ssl: { rejectUnauthorized: false } });
await client.connect();

const videos = {
  en: 'STmMVySqqtg',
  tr: 'DPY--Zs7Ero',
};

for (const [loc, id] of Object.entries(videos)) {
  await client.query(
    `update public.site_pages
       set data = jsonb_set(
                    jsonb_set(data, $1::text[], to_jsonb($2::text), true),
                    $3::text[], to_jsonb($4::text), true)
     where key = 'about-waqf'`,
    [
      `{${loc},video,videoId}`, id,
      `{${loc},video,sourceUrl}`, `https://www.youtube.com/watch?v=${id}`,
    ]
  );
}

const { rows } = await client.query(`select data from public.site_pages where key = 'about-waqf'`);
for (const loc of ['ar', 'en', 'tr']) {
  const v = rows[0].data[loc]?.video;
  console.log(`${loc}: videoId=${v?.videoId} sourceUrl=${v?.sourceUrl}`);
}
await client.end();
