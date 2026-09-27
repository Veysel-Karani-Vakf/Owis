import { supabase } from '@/lib/supabase';
import type { ProgramSlug } from '@/data/programs';
import {
  buildStaticProgramRow,
  isLegacyProgramRow,
  programRecordForEditor,
} from './programDefaults';

type Values = Record<string, unknown>;

/** Every built-in program that must remain editable from the dashboard. */
export const REQUIRED_PROGRAM_SLUGS = [
  'yemen-pioneers',
  'capacity-building',
  'institutional-development',
  'community-awareness',
] as const satisfies readonly ProgramSlug[];

/**
 * Produces insert-only seed rows. Existing slugs are deliberately excluded so
 * merely opening the dashboard can never overwrite an editor's saved copy.
 */
export function missingProgramRows(existing: readonly Values[]): Values[] {
  const existingSlugs = new Set(existing.map((row) => row.slug));
  return REQUIRED_PROGRAM_SLUGS.flatMap((slug, sortOrder) =>
    existingSlugs.has(slug)
      ? []
      : [{ ...buildStaticProgramRow(slug), sort_order: sortOrder, is_published: true }],
  );
}

/** Complete legacy rows while keeping every non-empty value already stored. */
export function legacyProgramRows(existing: readonly Values[]): Values[] {
  return existing.filter(isLegacyProgramRow).map((row) => {
    const resolved = programRecordForEditor(row);
    const columns = Object.keys(buildStaticProgramRow(row.slug as ProgramSlug));
    return Object.fromEntries(columns.map((column) => [column, resolved[column]]));
  });
}

/**
 * Makes built-in program pages self-healing for authenticated admins. If a
 * required row was deleted or never imported, opening the program list creates
 * it from the same complete defaults the public page uses and returns its real
 * database id so the Edit button works immediately.
 */
export async function ensureProgramRows(existing: readonly Values[]): Promise<Values[]> {
  const missing = missingProgramRows(existing);
  const legacy = legacyProgramRows(existing);
  if (missing.length === 0 && legacy.length === 0) return [...existing];

  if (missing.length > 0) {
    const { error: insertError } = await supabase
      .from('programs')
      .upsert(missing, { onConflict: 'slug', ignoreDuplicates: true });
    if (insertError) throw new Error(insertError.message);
  }

  if (legacy.length > 0) {
    const { error: migrationError } = await supabase
      .from('programs')
      .upsert(legacy, { onConflict: 'slug' });
    if (migrationError) throw new Error(migrationError.message);
  }

  const { data, error: loadError } = await supabase
    .from('programs')
    .select('*')
    .order('sort_order', { ascending: true, nullsFirst: false });
  if (loadError) throw new Error(loadError.message);
  return data ?? [];
}
