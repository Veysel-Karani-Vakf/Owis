import { MEDIA_BUCKET, supabase } from '@/lib/supabase';

const slugify = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

/** Uploads a file to the media bucket and returns its public URL. */
export async function uploadToMedia(file: File, folder = 'uploads'): Promise<string> {
  const ext = file.name.includes('.') ? file.name.split('.').pop() : '';
  const base = slugify(file.name.replace(/\.[^.]+$/, '')) || 'file';
  // Deterministic-ish unique name without Date.now (kept simple; collisions retried by suffix).
  const rand = Math.abs(hashString(file.name + file.size + file.lastModified)).toString(36);
  const path = `${folder}/${base}-${rand}${ext ? '.' + ext : ''}`;

  const { error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(path, file, { cacheControl: '3600', upsert: true });
  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

function hashString(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i += 1) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return h;
}
