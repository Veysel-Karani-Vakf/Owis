import { supabase } from '@/lib/supabase';

export type ParticipateSubmissionField = {
  id: string;
  sourceName: string;
  label: string;
  value: string | { name: string; size: number; type: string }[];
};

export type ParticipateSubmissionPayload = {
  formId: string;
  sourceUrl: string;
  fields: ParticipateSubmissionField[];
  files: Record<string, File[]>;
};

/** Where visitor attachments live: a private bucket only admins can read. */
export const SUBMISSIONS_BUCKET = 'submissions';

/** One uploaded attachment as stored on the submission row. */
export type SubmissionFile = {
  fieldId: string;
  name: string;
  size: number;
  type: string;
  /** Object path inside SUBMISSIONS_BUCKET; the dashboard signs a URL for it. */
  path?: string;
  bucket?: string;
  /** Older rows stored a public URL in the media bucket. */
  url?: string;
};

export class ParticipateFormError extends Error {
  code: 'network';

  constructor(code: 'network') {
    super(code);
    this.name = 'ParticipateFormError';
    this.code = code;
  }
}

const slugify = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

/**
 * Persists a participate/contact form submission to Supabase. Attachments
 * (CVs, documents) are personal, so they go to the private submissions bucket
 * and the row keeps only their path; the dashboard fetches them with a signed
 * URL.
 */
export async function submitParticipateForm(payload: ParticipateSubmissionPayload) {
  const uploaded: SubmissionFile[] = [];

  try {
    for (const [fieldId, files] of Object.entries(payload.files)) {
      for (const file of files) {
        const rand = Math.abs(hashString(file.name + file.size + file.lastModified)).toString(36);
        const path = `${payload.formId}/${rand}-${slugify(file.name) || 'file'}`;
        const { error } = await supabase.storage
          .from(SUBMISSIONS_BUCKET)
          .upload(path, file, { cacheControl: '3600', upsert: true });
        if (error) throw error;
        uploaded.push({ fieldId, name: file.name, size: file.size, type: file.type, path, bucket: SUBMISSIONS_BUCKET });
      }
    }

    const { error } = await supabase.from('participate_submissions').insert({
      form_id: payload.formId,
      source_url: payload.sourceUrl,
      payload: { fields: payload.fields },
      files: uploaded,
    });
    if (error) throw error;
  } catch {
    throw new ParticipateFormError('network');
  }
}

function hashString(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i += 1) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return h;
}
