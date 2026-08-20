import { MEDIA_BUCKET, supabase } from '@/lib/supabase';

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

export class ParticipateFormError extends Error {
  code: 'missing-endpoint' | 'network';

  constructor(code: 'missing-endpoint' | 'network') {
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
 * Persists a participate/contact form submission to Supabase. Any attached
 * files are uploaded to the public media bucket under `submissions/`.
 */
export async function submitParticipateForm(payload: ParticipateSubmissionPayload) {
  const uploaded: Array<{ fieldId: string; name: string; size: number; type: string; url: string }> = [];

  try {
    for (const [fieldId, files] of Object.entries(payload.files)) {
      for (const file of files) {
        const rand = Math.abs(hashString(file.name + file.size + file.lastModified)).toString(36);
        const path = `submissions/${payload.formId}/${rand}-${slugify(file.name)}`;
        const { error } = await supabase.storage
          .from(MEDIA_BUCKET)
          .upload(path, file, { cacheControl: '3600', upsert: true });
        if (error) throw error;
        const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);
        uploaded.push({ fieldId, name: file.name, size: file.size, type: file.type, url: data.publicUrl });
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
