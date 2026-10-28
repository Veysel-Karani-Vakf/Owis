// Loads the published content set.
//
// A first visit fetches every table in one round of parallel queries. Later
// visits first ask each table for its signature (row count + latest
// `updated_at`: a few bytes each, all in parallel) and re-fetch only the tables
// whose signature differs from the copy cached in IndexedDB. The check always
// precedes rendering, so a cached table is never shown stale: any dashboard
// edit changes the signature through the `set_updated_at` triggers.

import { supabase } from '@/lib/supabase';
import { readCache, writeCache, type CmsCache } from './cache';
import type { CmsPages, CmsSnapshot, CmsTables } from './store';

type TableName = keyof CmsTables;

const CONTENT_TABLES: TableName[] = [
  'news',
  'projects',
  'programs',
  'pioneers',
  'library_articles',
  'library_documents',
  'gallery_images',
  'donation_opportunities',
  'partners',
  'stat_indicators',
  'bank_accounts',
  'org_sections',
  'org_people',
  'org_memberships',
];

/** Bump whenever the columns or shape stored per table change. */
const CACHE_VERSION = '2026-10-28.1';

const SORT: Partial<Record<TableName, { column: string; ascending: boolean }>> = {
  news: { column: 'published_at', ascending: false },
  org_people: { column: 'created_at', ascending: true },
};

// Columns fetched at boot. Tables ship whole except news, whose bodies and
// galleries are two thirds of the table and only matter on the article page,
// which fetches the full row for the one story it shows (see `NewsBootRow`).
const BOOT_COLUMNS: Partial<Record<TableName, string>> = {
  news: [
    'id',
    'slug',
    'source_slug',
    'source_url',
    'published_at',
    'year',
    'source_language',
    'featured',
    'category',
    'title',
    'excerpt',
    'image',
    'image_alt',
    'sort_order',
    'is_published',
    'created_at',
    'updated_at',
  ].join(','),
};

// Org tables are fetched whole, unpublished rows included, so the adapter can
// tell "hidden on purpose" from "unknown" and not resurrect static members.
function publishedOnly(table: TableName): boolean {
  return table !== 'org_people' && table !== 'org_sections' && table !== 'org_memberships';
}

type Stamped = { updated_at?: string | null };

/**
 * `${count}:${latest updated_at}` over a set of rows. Timestamps are compared
 * as the strings PostgREST sends (ISO, UTC, trailing zeros trimmed), which
 * order correctly and keep the microseconds that `Date.parse` would drop.
 */
function signatureOf(rows: Stamped[]): string {
  let latest = '';
  for (const row of rows) {
    const stamp = typeof row.updated_at === 'string' ? row.updated_at : '';
    if (stamp > latest) latest = stamp;
  }
  return `${rows.length}:${latest}`;
}

type SignatureName = TableName | 'site_pages';

/** The server's view of a table's signature, under the same filter as the fetch. */
async function fetchSignature(name: SignatureName): Promise<string> {
  let query = supabase.from(name).select('updated_at', { count: 'exact' });
  if (name !== 'site_pages' && publishedOnly(name)) query = query.eq('is_published', true);
  const { data, count, error } = await query.order('updated_at', { ascending: false }).limit(1);
  if (error) throw new Error(`${name}: ${error.message}`);
  const latest = (data?.[0] as Stamped | undefined)?.updated_at ?? '';
  return `${count ?? 0}:${latest}`;
}

/** Signatures that could be read; a table missing here is fetched in full. */
async function fetchSignatures(): Promise<Map<SignatureName, string>> {
  const names: SignatureName[] = [...CONTENT_TABLES, 'site_pages'];
  const results = await Promise.allSettled(names.map((name) => fetchSignature(name)));
  const signatures = new Map<SignatureName, string>();
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') signatures.set(names[index], result.value);
  });
  return signatures;
}

async function fetchTable<K extends TableName>(table: K): Promise<CmsTables[K]> {
  const sort = SORT[table] ?? { column: 'sort_order', ascending: true };
  let query = supabase.from(table).select(BOOT_COLUMNS[table] ?? '*');
  if (publishedOnly(table)) query = query.eq('is_published', true);
  const { data, error } = await query.order(sort.column, {
    ascending: sort.ascending,
    nullsFirst: false,
  });
  if (error) throw new Error(`${table}: ${error.message}`);
  return (data ?? []) as unknown as CmsTables[K];
}

type PageRow = { key: string; data: Record<string, unknown> | null; updated_at: string };

async function fetchPages(): Promise<{ data: CmsPages; sig: string }> {
  const { data, error } = await supabase.from('site_pages').select('key, data, updated_at');
  if (error) throw new Error(`site_pages: ${error.message}`);
  const rows = (data ?? []) as PageRow[];
  const pages: CmsPages = {};
  for (const row of rows) {
    if (row.data) pages[row.key] = row.data;
  }
  return { data: pages, sig: signatureOf(rows) };
}

/**
 * Fetches published content. Individual failures degrade to "no CMS data for
 * that table", which the adapters read as an empty list; such a table is left
 * out of the cache so the next visit tries again.
 */
export async function hydrateCms(): Promise<CmsSnapshot> {
  const cache = await readCache(CACHE_VERSION);
  const signatures = cache ? await fetchSignatures() : null;

  const tables: Partial<CmsTables> = {};
  const next: CmsCache = { version: CACHE_VERSION, tables: {}, pages: null };
  const work: Promise<void>[] = [];

  for (const table of CONTENT_TABLES) {
    const cached = cache?.tables[table];
    const signature = signatures?.get(table);
    if (cached && signature && cached.sig === signature) {
      tables[table] = cached.rows as never;
      next.tables[table] = cached as never;
      continue;
    }
    work.push(
      fetchTable(table)
        .then((rows) => {
          tables[table] = rows as never;
          next.tables[table] = { sig: signatureOf(rows as Stamped[]), rows } as never;
        })
        .catch(() => {}),
    );
  }

  let pages: CmsPages = {};
  const cachedPages = cache?.pages;
  const pagesSignature = signatures?.get('site_pages');
  if (cachedPages && pagesSignature && cachedPages.sig === pagesSignature) {
    pages = cachedPages.data;
    next.pages = cachedPages;
  } else {
    work.push(
      fetchPages()
        .then((result) => {
          pages = result.data;
          next.pages = { sig: result.sig, data: result.data };
        })
        .catch(() => {}),
    );
  }

  await Promise.all(work);
  void writeCache(next);
  return { tables, pages };
}
