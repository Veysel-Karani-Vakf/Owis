// Read-only integration check for the bank account schema and stored rows.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const { Client } = pg;
const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function readEnvLocal(key) {
  try {
    const text = readFileSync(join(root, '.env.local'), 'utf8');
    for (const line of text.split(/\r?\n/)) {
      const match = line.match(new RegExp(`^\\s*${key}\\s*=\\s*(.+)\\s*$`));
      if (match) return match[1].replace(/^["']|["']$/g, '');
    }
  } catch {
    // The explicit environment variable below may still be available.
  }
  return '';
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const connectionString = process.env.SUPABASE_DB_URL || readEnvLocal('SUPABASE_DB_URL');
if (!connectionString) throw new Error('Missing SUPABASE_DB_URL.');

const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
await client.connect();

try {
  await client.query('begin transaction read only');

  const columns = await client.query(`
    select column_name
      from information_schema.columns
     where table_schema = 'public' and table_name = 'bank_accounts'
  `);
  const actualColumns = new Set(columns.rows.map((row) => row.column_name));
  const requiredColumns = [
    'id', 'slug', 'name', 'monogram', 'logo', 'brand_color', 'branch', 'swift',
    'account_number', 'accounts', 'sort_order', 'is_published', 'created_at', 'updated_at',
  ];
  assert(requiredColumns.every((column) => actualColumns.has(column)), 'bank_accounts is missing one or more required columns.');

  const catalogue = await client.query(`
    select
      count(*)::int as total,
      count(*) filter (where is_published)::int as published,
      bool_and(btrim(name) <> '' and btrim(slug) <> '' and public.valid_bank_account_list(accounts)) as valid
    from public.bank_accounts
  `);
  const summary = catalogue.rows[0];
  assert(summary.total > 0, 'bank_accounts has no rows.');
  assert(summary.valid === true, 'One or more bank account rows are invalid.');

  const validation = await client.query(
    `select
       public.valid_bank_account_list($1::jsonb) as accepts_valid,
       public.valid_bank_account_list($2::jsonb) as rejects_invalid`,
    [
      JSON.stringify([{ currency: 'TRY', iban: 'TR140001500158007305877312' }]),
      JSON.stringify([{ currency: 'TRY', iban: 'bad' }]),
    ],
  );
  assert(validation.rows[0].accepts_valid === true, 'Database validation rejected a valid account list.');
  assert(validation.rows[0].rejects_invalid === false, 'Database validation accepted an invalid IBAN.');

  const policies = await client.query(`
    select cmd, qual, with_check
      from pg_policies
     where schemaname = 'public' and tablename = 'bank_accounts'
  `);
  assert(
    policies.rows.some((row) => row.cmd === 'SELECT' && row.qual?.includes('is_published')),
    'Published-row public read policy is missing.',
  );
  assert(
    policies.rows.some((row) => row.cmd === 'ALL' && row.qual?.includes('is_admin')),
    'Admin CRUD policy is missing.',
  );

  await client.query('commit');
  console.log(`Bank accounts integration check passed: ${summary.total} total, ${summary.published} published.`);
} catch (error) {
  await client.query('rollback').catch(() => undefined);
  throw error;
} finally {
  await client.end();
}
