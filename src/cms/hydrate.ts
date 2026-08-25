// Loads the whole published content set in one round of parallel queries.
// The payload is small (a few hundred rows of jsonb) and the site needs most of
// it on any given page, so a single hydrate beats per-page fetching.

import { supabase } from '@/lib/supabase';
import type { CmsSnapshot, CmsTables } from './store';

type TableName = keyof CmsTables;

const CONTENT_TABLES: TableName[] = [
  'news',
  'projects',
  'programs',
  'library_articles',
  'library_documents',
  'gallery_images',
  'donation_opportunities',
  'partners',
  'stat_indicators',
];

const SORT: Partial<Record<TableName, { column: string; ascending: boolean }>> = {
  news: { column: 'published_at', ascending: false },
};

async function fetchTable(table: TableName) {
  const sort = SORT[table] ?? { column: 'sort_order', ascending: true };
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq('is_published', true)
    .order(sort.column, { ascending: sort.ascending, nullsFirst: false });
  if (error) throw new Error(`${table}: ${error.message}`);
  return data ?? [];
}

async function fetchPages() {
  const { data, error } = await supabase.from('site_pages').select('key, data');
  if (error) throw new Error(`site_pages: ${error.message}`);
  const pages: CmsSnapshot['pages'] = {};
  for (const row of data ?? []) {
    const record = row as { key: string; data: Record<string, unknown> | null };
    if (record.data) pages[record.key] = record.data;
  }
  return pages;
}

/**
 * Fetches published content. Individual failures degrade to "no CMS data for
 * that table", which the accessors read as "use the static default".
 */
export async function hydrateCms(): Promise<CmsSnapshot> {
  const [pagesResult, ...tableResults] = await Promise.allSettled([
    fetchPages(),
    ...CONTENT_TABLES.map((table) => fetchTable(table)),
  ]);

  const tables: Partial<CmsTables> = {};
  CONTENT_TABLES.forEach((table, index) => {
    const result = tableResults[index];
    if (result?.status === 'fulfilled') {
      tables[table] = result.value as never;
    }
  });

  return {
    tables,
    pages: pagesResult.status === 'fulfilled' ? pagesResult.value : {},
  };
}
