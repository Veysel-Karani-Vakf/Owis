import type { AwardApplicationPayload } from '@/components/award/form/applyState';
import type { Locale } from '@/i18n/content';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { SUBMISSIONS_BUCKET } from './participateForms';

/*
 * Sends an award nomination.
 *
 *  1. The supporting photos go straight from the browser to the private
 *     `submissions` bucket (a serverless function cannot carry 15 MB), under a
 *     folder that belongs to this application only.
 *  2. The answers, with the paths of those photos, are posted to
 *     /api/award/apply, which checks the award's conditions again, stores the
 *     application and answers with its reference number.
 *
 * Nothing is written to the database from here: the table accepts rows from
 * the server only.
 */

export type AwardSubmitErrorCode = 'network' | 'closed' | 'invalid' | 'rate-limited';

export class AwardSubmitError extends Error {
  code: AwardSubmitErrorCode;

  constructor(code: AwardSubmitErrorCode) {
    super(code);
    this.name = 'AwardSubmitError';
    this.code = code;
  }
}

/** A photo as stored on the application row. */
export type UploadedAwardImage = { path: string; name: string; type: string; size: number };

/**
 * What one visit to the form has already sent, so pressing "send" again after
 * a failure does not upload the same photos twice.
 */
export type AwardUploadSession = { id: string; uploaded: WeakMap<File, UploadedAwardImage> };

function randomId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  // Older browsers on plain http: same shape, from getRandomValues.
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = [...bytes].map((byte) => byte.toString(16).padStart(2, '0'));
  return `${hex.slice(0, 4).join('')}-${hex.slice(4, 6).join('')}-${hex.slice(6, 8).join('')}-${hex
    .slice(8, 10)
    .join('')}-${hex.slice(10).join('')}`;
}

export function newAwardUploadSession(): AwardUploadSession {
  return { id: randomId(), uploaded: new WeakMap() };
}

const extensionOf: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };

function imageExtension(file: File): string {
  const fromType = extensionOf[file.type];
  if (fromType) return fromType;
  const fromName = file.name.split('.').pop()?.toLowerCase() ?? '';
  return fromName === 'jpeg' ? 'jpg' : ['jpg', 'png', 'webp'].includes(fromName) ? fromName : 'jpg';
}

const mimeOf: Record<string, string> = { jpg: 'image/jpeg', png: 'image/png', webp: 'image/webp' };

/** Where a submission currently is, for the button's progress label. */
export type AwardSubmitStage = { step: 'uploading'; current: number; total: number } | { step: 'sending' };

async function uploadImages(
  session: AwardUploadSession,
  files: File[],
  onStage?: (stage: AwardSubmitStage) => void
): Promise<UploadedAwardImage[]> {
  const stored: UploadedAwardImage[] = [];
  for (const [index, file] of files.entries()) {
    onStage?.({ step: 'uploading', current: index + 1, total: files.length });
    let image = session.uploaded.get(file);
    if (!image) {
      const extension = imageExtension(file);
      const type = file.type || mimeOf[extension];
      // The bucket only allows new objects, so every upload gets its own name.
      const path = `award/${session.id}/${index + 1}-${randomId().slice(0, 8)}.${extension}`;
      const { error } = await supabase.storage
        .from(SUBMISSIONS_BUCKET)
        .upload(path, file, { cacheControl: '3600', contentType: type, upsert: false });
      if (error) throw new AwardSubmitError('network');
      image = { path, name: file.name.slice(0, 200), type, size: file.size };
      session.uploaded.set(file, image);
    }
    stored.push(image);
  }
  return stored;
}

export type AwardSubmitOptions = {
  locale: Locale;
  session: AwardUploadSession;
  /** The attached photos, in the order shown in the form. */
  files: File[];
  /** Hidden field real visitors never fill. */
  trap?: string;
  onStage?: (stage: AwardSubmitStage) => void;
};

/** Sends the nomination; resolves with the reference number assigned to it. */
export async function submitAwardApplication(
  payload: AwardApplicationPayload,
  options: AwardSubmitOptions
): Promise<{ reference: string }> {
  if (options.files.length > 0 && !isSupabaseConfigured) throw new AwardSubmitError('network');
  const images = await uploadImages(options.session, options.files, options.onStage);
  options.onStage?.({ step: 'sending' });

  let response: Response;
  try {
    response = await fetch('/api/award/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...payload,
        images,
        locale: options.locale,
        sourceUrl: `${window.location.origin}${window.location.pathname}`,
        website: options.trap ?? '',
      }),
    });
  } catch {
    throw new AwardSubmitError('network');
  }

  // Anything that is not the function's JSON (a proxy error page, say) reads as {}.
  const body = ((await response.json().catch(() => null)) ?? {}) as {
    ok?: unknown;
    reference?: unknown;
    error?: unknown;
  };

  if (response.ok && body.ok === true && typeof body.reference === 'string' && body.reference) {
    return { reference: body.reference };
  }
  if (body.error === 'closed') throw new AwardSubmitError('closed');
  if (body.error === 'invalid') throw new AwardSubmitError('invalid');
  if (body.error === 'rate-limited') throw new AwardSubmitError('rate-limited');
  throw new AwardSubmitError('network');
}
