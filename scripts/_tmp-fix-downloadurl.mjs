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

const links = {
  ar: 'https://drive.google.com/file/d/191M9qTsUhtp9Shstf4xJbEYC-iSzXpmD/view?usp=sharing',
  en: 'https://drive.google.com/file/d/19VislWASMpd284pQYi4yffnn4AZeMepS/view?usp=sharing',
  tr: 'https://drive.google.com/file/d/1nRlkSmZHcVKgCucV9UHoCEPYdgJYd-Z6/view?usp=sharing',
};

for (const [loc, url] of Object.entries(links)) {
  await client.query(
    `update public.site_pages
       set data = jsonb_set(data, $1::text[], to_jsonb($2::text), true)
     where key = 'about-waqf'`,
    [`{${loc},intro,downloadUrl}`, url]
  );
}

const { rows } = await client.query(`select data from public.site_pages where key = 'about-waqf'`);
for (const loc of ['ar', 'en', 'tr']) {
  console.log(`${loc}: ${rows[0].data[loc]?.intro?.downloadUrl}`);
}
await client.end();
