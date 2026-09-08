// Read-only: inspect the site_pages assistant-ai row without printing secrets.
import { readFileSync } from 'node:fs';
import pg from 'pg';

const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8')
    .split(/\r?\n/)
    .filter((line) => line.includes('=') && !line.trim().startsWith('#'))
    .map((line) => [line.slice(0, line.indexOf('=')).trim(), line.slice(line.indexOf('=') + 1).trim()]),
);

const client = new pg.Client({ connectionString: env.SUPABASE_DB_URL, ssl: { rejectUnauthorized: false } });
await client.connect();
const { rows } = await client.query("select data from public.site_pages where key = 'assistant-ai'");
await client.end();

if (!rows.length) {
  console.log('row: MISSING');
} else {
  const data = rows[0].data ?? {};
  const provider = typeof data.provider === 'string' ? data.provider : '(none)';
  const model = typeof data.model === 'string' ? data.model : '';
  const keyShaped =
    /^(sk-|AIza|gsk_|xai-)/i.test(model) ||
    (model.length >= 32 && /^[A-Za-z0-9_-]+$/.test(model) && /[A-Z]/.test(model) && /[a-z]/.test(model));
  console.log('row: EXISTS');
  console.log('provider:', provider);
  // Never print the stored model verbatim in case it is a pasted key.
  console.log('model length:', model.length, '| key-shaped:', keyShaped);
  if (!keyShaped) console.log('model value (safe):', model);
}
