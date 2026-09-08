import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import pg from 'pg';

const root = 'd:/work/GitHub Pro/Veysel-Karani-Vakf';
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

const { rows } = await client.query(`select key, data from public.site_pages where key = 'about-waqf'`);
if (!rows.length) console.log('no about-waqf row');
for (const { data } of rows) {
  for (const loc of ['ar', 'en', 'tr']) {
    const d = data[loc];
    console.log(`${loc}: branch=${d ? 'yes' : 'no'} intro.downloadUrl=${JSON.stringify(d?.intro?.downloadUrl ?? null)} intro.downloadLabel=${JSON.stringify(d?.intro?.downloadLabel ?? null)}`);
  }
}
await client.end();
