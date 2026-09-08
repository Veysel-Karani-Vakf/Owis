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

const { rows } = await client.query(`select data from public.site_pages where key = 'about-waqf'`);
for (const loc of ['ar', 'en', 'tr']) {
  console.log(`${loc}: ${JSON.stringify(rows[0]?.data?.[loc]?.video ?? null)}`);
}
await client.end();
