import { MEDIA_BUCKET, supabase } from '@/lib/supabase';
import type { Locale } from '@/lib/types';

export type MediaItem = {
  name: string;
  path: string;
  url: string;
  size: number | null;
  createdAt: string | null;
  isImage: boolean;
  isPdf: boolean;
  folder: MediaFolder;
};

/** Folders the dashboard writes into, in the order they are listed. */
export const MEDIA_FOLDERS = ['images', 'docs', 'videos', 'uploads', 'submissions'] as const;
export type MediaFolder = (typeof MEDIA_FOLDERS)[number];

export const MEDIA_FOLDER_LABELS: Record<MediaFolder, Record<Locale, string>> = {
  images: { ar: 'الصور', tr: 'Görseller', en: 'Images' },
  docs: { ar: 'المستندات', tr: 'Belgeler', en: 'Documents' },
  videos: { ar: 'الفيديوهات', tr: 'Videolar', en: 'Videos' },
  uploads: { ar: 'ملفات أخرى', tr: 'Diğer dosyalar', en: 'Other files' },
  submissions: { ar: 'مرفقات النماذج', tr: 'Form ekleri', en: 'Form attachments' },
};

const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.avif'];

export function formatSize(bytes: number | null): string {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Lists every file in the media bucket. Storage pages at 1000 per folder;
 * loops until a page comes back short so nothing older is silently hidden.
 */
export async function listMediaItems(folders: readonly MediaFolder[] = MEDIA_FOLDERS): Promise<MediaItem[]> {
  const collected: MediaItem[] = [];
  const pageSize = 1000;

  for (const folder of folders) {
    let offset = 0;
    for (;;) {
      const { data, error } = await supabase.storage
        .from(MEDIA_BUCKET)
        .list(folder, { limit: pageSize, offset, sortBy: { column: 'created_at', order: 'desc' } });
      if (error || !data) break;

      for (const entry of data) {
        // Storage returns a placeholder row for empty folders.
        if (!entry.id) continue;
        const path = `${folder}/${entry.name}`;
        const { data: urlData } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);
        const lower = entry.name.toLowerCase();
        collected.push({
          name: entry.name,
          path,
          url: urlData.publicUrl,
          size: (entry.metadata as { size?: number } | null)?.size ?? null,
          createdAt: entry.created_at ?? null,
          isImage: IMAGE_EXTENSIONS.some((extension) => lower.endsWith(extension)),
          isPdf: lower.endsWith('.pdf'),
          folder,
        });
      }
      if (data.length < pageSize) break;
      offset += pageSize;
    }
  }
  return collected;
}

export async function removeMediaItem(path: string): Promise<void> {
  const { error } = await supabase.storage.from(MEDIA_BUCKET).remove([path]);
  if (error) throw new Error(error.message);
}

/** Columns that may reference a media URL, per table, for "used by" checks. */
const URL_COLUMNS: Record<string, string[]> = {
  news: ['image', 'gallery'],
  projects: ['image', 'video'],
  programs: ['hero_image', 'overview_image', 'image_gallery', 'videos', 'initiatives', 'spotlight', 'images'],
  library_articles: ['image', 'pdf_url'],
  library_documents: ['image', 'pdf_url'],
  gallery_images: ['image', 'thumbnail'],
  donation_opportunities: ['image'],
  partners: ['logo'],
  site_pages: ['data'],
};

export type MediaUsage = { table: string; id: string; title: string };

/**
 * Finds records that reference a file. The tables are small (a few hundred
 * rows in all), so the URL-bearing columns are fetched and matched here:
 * PostgREST's filter grammar cannot search inside jsonb text, and a failed
 * query must never read as "not used anywhere".
 */
export async function findMediaUsage(path: string): Promise<MediaUsage[]> {
  const hits: MediaUsage[] = [];
  await Promise.all(
    Object.entries(URL_COLUMNS).map(async ([table, columns]) => {
      const { data, error } = await supabase.from(table).select('*');
      if (error) throw new Error(`${table}: ${error.message}`);
      for (const row of data ?? []) {
        const record = row as Record<string, unknown>;
        const used = columns.some((column) => JSON.stringify(record[column] ?? '').includes(path));
        if (!used) continue;
        const raw = record.title ?? record.name ?? record.label ?? record.key ?? record.slug ?? '';
        const title =
          typeof raw === 'string'
            ? raw
            : raw && typeof raw === 'object'
              ? String((raw as Record<string, unknown>).ar ?? (raw as Record<string, unknown>).en ?? '')
              : '';
        hits.push({ table, id: String(record.id ?? record.key ?? ''), title });
      }
    }),
  );
  return hits;
}
