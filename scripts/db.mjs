// Applies SQL migrations to Supabase using SUPABASE_DB_URL.
// Usage:
//   node scripts/db.mjs migrate        # run all files in supabase/migrations in order
//   node scripts/db.mjs check          # list tables + row counts
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import pg from 'pg';

const { Client } = pg;
const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const connectionString =
  process.env.SUPABASE_DB_URL || readEnvLocal('SUPABASE_DB_URL');

if (!connectionString) {
  console.error('Missing SUPABASE_DB_URL (set it in .env.local or the environment).');
  process.exit(1);
}

function readEnvLocal(key) {
  try {
    const text = readFileSync(join(root, '.env.local'), 'utf8');
    for (const line of text.split(/\r?\n/)) {
      const m = line.match(new RegExp(`^\\s*${key}\\s*=\\s*(.+)\\s*$`));
      if (m) return m[1].replace(/^["']|["']$/g, '');
    }
  } catch {
    /* ignore */
  }
  return null;
}

async function withClient(fn) {
  const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
  await client.connect();
  try {
    return await fn(client);
  } finally {
    await client.end();
  }
}

async function migrate() {
  const dir = join(root, 'supabase', 'migrations');
  const files = readdirSync(dir).filter((f) => f.endsWith('.sql')).sort();
  await withClient(async (client) => {
    for (const file of files) {
      const sql = readFileSync(join(dir, file), 'utf8');
      process.stdout.write(`→ ${file} … `);
      await client.query(sql);
      console.log('ok');
    }
  });
  console.log('All migrations applied.');
}

async function check() {
  await withClient(async (client) => {
    const { rows } = await client.query(`
      select table_name from information_schema.tables
      where table_schema = 'public' order by table_name;
    `);
    for (const { table_name } of rows) {
      const c = await client.query(`select count(*)::int as n from public.${table_name}`);
      console.log(`${table_name.padEnd(28)} ${c.rows[0].n}`);
    }
  });
}

const cmd = process.argv[2];
if (cmd === 'migrate') await migrate();
else if (cmd === 'check') await check();
else {
  console.log('Usage: node scripts/db.mjs <migrate|check>');
  process.exit(1);
}
