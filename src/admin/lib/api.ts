import { supabase } from '@/lib/supabase';
import type { Locale, Localized } from '@/lib/types';

/** Pick the best available localized string for display. */
export function pickLocalized(value: unknown, locale: Locale): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object') {
    const v = value as Localized;
    return v[locale] || v.ar || v.en || v.tr || '';
  }
  return '';
}

export async function listRows(
  table: string,
  opts: { sort?: { column: string; ascending: boolean }; filterColumn?: string; filterValue?: string } = {},
) {
  let query = supabase.from(table).select('*');
  if (opts.filterColumn && opts.filterValue) {
    query = query.eq(opts.filterColumn, opts.filterValue);
  }
  if (opts.sort) {
    query = query.order(opts.sort.column, { ascending: opts.sort.ascending, nullsFirst: false });
  }
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getRow(table: string, id: string) {
  const { data, error } = await supabase.from(table).select('*').eq('id', id).single();
  if (error) throw new Error(error.message);
  return data;
}

export async function insertRow(table: string, values: Record<string, unknown>) {
  const { data, error } = await supabase.from(table).insert(values).select().single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateRow(table: string, id: string, values: Record<string, unknown>) {
  const { data, error } = await supabase.from(table).update(values).eq('id', id).select().single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteRow(table: string, id: string) {
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function countRows(table: string): Promise<number> {
  const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
  if (error) return 0;
  return count ?? 0;
}
