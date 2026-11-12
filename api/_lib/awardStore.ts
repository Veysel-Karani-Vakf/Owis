import { AWARD_SETTINGS_KEY, parseAwardSettings, type AwardSettings } from './awardRules';
import { serviceClient } from './db';

/**
 * Database access of the award nomination endpoint. Everything goes through the
 * service-role client: `award_applications` has no anon policy.
 */

const TABLE = 'award_applications';

/** Dashboard switches + deadline; a missing row means "visible, open, no deadline". */
export async function readAwardSettings(): Promise<AwardSettings> {
  const { data, error } = await serviceClient()
    .from('site_pages')
    .select('data')
    .eq('key', AWARD_SETTINGS_KEY)
    .maybeSingle();
  if (error) throw new Error(`award settings read failed: ${error.message}`);
  return parseAwardSettings(data?.data);
}

/** Applications received since `sinceIso` from one sender address or one email. */
export async function countRecentApplications(
  by: { column: 'ip_hash' | 'email'; value: string },
  sinceIso: string,
): Promise<number> {
  let query = serviceClient().from(TABLE).select('id', { count: 'exact', head: true }).gte('created_at', sinceIso);
  // Emails are compared case-insensitively; the value is escaped for ILIKE.
  query =
    by.column === 'email'
      ? query.ilike('email', by.value.replace(/[\\%_]/g, (char) => `\\${char}`))
      : query.eq('ip_hash', by.value);
  const { count, error } = await query;
  if (error) throw new Error(`${TABLE} count failed: ${error.message}`);
  return count ?? 0;
}

/** Stores the nomination and returns the reference number the database assigned. */
export async function insertAwardApplication(row: Record<string, unknown>): Promise<string> {
  const { data, error } = await serviceClient().from(TABLE).insert(row).select('reference_no').single();
  if (error) throw new Error(`${TABLE} insert failed: ${error.message}`);
  const reference = (data as { reference_no?: unknown } | null)?.reference_no;
  if (typeof reference !== 'string' || !reference) throw new Error(`${TABLE} insert returned no reference`);
  return reference;
}
