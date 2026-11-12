import { createHash } from 'node:crypto';
import { awardWindow, toAwardRow, validateAwardApplication } from '../_lib/awardRules';
import { countRecentApplications, insertAwardApplication, readAwardSettings } from '../_lib/awardStore';
import { supabaseUrl } from '../_lib/env';
import { methodNotAllowed, readJsonBody, sendJson, type ApiRequest, type ApiResponse } from '../_lib/http';

type ApplyErrorCode = 'closed' | 'invalid' | 'rate-limited' | 'server-error';

/**
 * Flood guards. They are deliberately loose: mobile networks in Yemen put many
 * people behind one address, and a team may legitimately send a corrected
 * nomination. Repeats are accepted and flagged as duplicates in the dashboard.
 */
const MAX_PER_ADDRESS_PER_HOUR = 20;
const MAX_PER_EMAIL_PER_DAY = 5;

function senderAddress(req: ApiRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  const first = (Array.isArray(forwarded) ? forwarded[0] : forwarded)?.split(',')[0]?.trim();
  return first || req.socket?.remoteAddress || '';
}

/** The address is never stored; only this project-salted hash is. */
function hashAddress(address: string): string | null {
  if (!address) return null;
  return createHash('sha256').update(`${supabaseUrl()}|award|${address}`).digest('hex').slice(0, 40);
}

/**
 * POST /api/award/apply — receives a nomination for the Owais Volunteer Award.
 *
 * The body is the form's payload plus the paths of the photos the browser has
 * already uploaded to the private bucket. Nothing is trusted: the award's
 * conditions are checked again here, the dashboard's switches (award hidden,
 * form closed, deadline) are enforced, and the row is written with the service role.
 * Answers: 200 { ok, reference } · 400 invalid · 403 closed · 429 rate-limited.
 */
export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  if (req.method !== 'POST') {
    methodNotAllowed(res, 'POST');
    return;
  }

  const fail = (status: number, error: ApplyErrorCode, extra: Record<string, unknown> = {}) =>
    sendJson(res, status, { ok: false, error, ...extra });

  try {
    const body = await readJsonBody(req);

    const settings = await readAwardSettings();
    const state = awardWindow(settings);
    if (!state.open) {
      fail(403, 'closed', { reason: state.reason });
      return;
    }

    const result = validateAwardApplication(body);
    if (!result.ok) {
      fail(400, 'invalid', { fields: result.fields });
      return;
    }

    const ipHash = hashAddress(senderAddress(req));
    const now = Date.now();
    const [fromAddress, fromEmail] = await Promise.all([
      ipHash
        ? countRecentApplications({ column: 'ip_hash', value: ipHash }, new Date(now - 3_600_000).toISOString())
        : Promise.resolve(0),
      countRecentApplications({ column: 'email', value: result.value.email }, new Date(now - 86_400_000).toISOString()),
    ]);
    if (fromAddress >= MAX_PER_ADDRESS_PER_HOUR || fromEmail >= MAX_PER_EMAIL_PER_DAY) {
      fail(429, 'rate-limited');
      return;
    }

    const reference = await insertAwardApplication(toAwardRow(result.value, ipHash));
    sendJson(res, 200, { ok: true, reference });
  } catch (error) {
    // Message only: the request carries personal data that must not reach the logs.
    console.error('award/apply failed:', error instanceof Error ? error.message : 'unknown');
    fail(500, 'server-error');
  }
}
