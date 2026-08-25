import { useCallback, useEffect, useState } from 'react';
import { Check, Copy, FileText, Trash2, Upload } from 'lucide-react';
import { MEDIA_BUCKET, supabase } from '@/lib/supabase';
import { useI18n } from '@/i18n/useI18n';
import { useAdminStrings } from '../hooks/useAdmin';
import { uploadToMedia } from '../lib/storage';

type MediaItem = {
  name: string;
  path: string;
  url: string;
  size: number | null;
  isImage: boolean;
};

/** Folders the dashboard writes into, in the order they are listed. */
const FOLDERS = ['images', 'docs', 'uploads', 'submissions'] as const;

const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.avif'];

function formatSize(bytes: number | null): string {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MediaLibraryPage() {
  const strings = useAdminStrings();
  const { locale } = useI18n();
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const label = (ar: string, tr: string, en: string) =>
    locale === 'ar' ? ar : locale === 'tr' ? tr : en;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const collected: MediaItem[] = [];

    for (const folder of FOLDERS) {
      const { data, error: listError } = await supabase.storage
        .from(MEDIA_BUCKET)
        .list(folder, { limit: 200, sortBy: { column: 'name', order: 'asc' } });
      if (listError) continue;

      for (const entry of data ?? []) {
        // Storage returns a placeholder row for empty folders.
        if (!entry.id) continue;
        const path = `${folder}/${entry.name}`;
        const { data: urlData } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);
        collected.push({
          name: entry.name,
          path,
          url: urlData.publicUrl,
          size: (entry.metadata as { size?: number } | null)?.size ?? null,
          isImage: IMAGE_EXTENSIONS.some((extension) => entry.name.toLowerCase().endsWith(extension)),
        });
      }
    }

    setItems(collected);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleUpload = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    setError(null);
    try {
      for (const file of Array.from(files)) {
        await uploadToMedia(file, file.type.startsWith('image/') ? 'images' : 'docs');
      }
      await load();
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'upload failed');
    } finally {
      setBusy(false);
    }
  };

  const remove = async (item: MediaItem) => {
    if (!window.confirm(strings.confirmDelete)) return;
    const { error: removeError } = await supabase.storage.from(MEDIA_BUCKET).remove([item.path]);
    if (removeError) {
      setError(removeError.message);
      return;
    }
    setItems((current) => current.filter((entry) => entry.path !== item.path));
  };

  const copy = async (item: MediaItem) => {
    await navigator.clipboard.writeText(item.url);
    setCopied(item.path);
    window.setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-900">
            {label('مكتبة الوسائط', 'Medya kütüphanesi', 'Media library')}
          </h1>
          <p className="text-sm text-slate-500">
            {label(
              'الصور والملفات المرفوعة، وروابطها الجاهزة للاستخدام',
              'Yüklenen görseller ve dosyalar, hazır bağlantılarıyla',
              'Uploaded images and files, with ready-to-use links',
            )}
          </p>
        </div>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800">
          <Upload size={16} />
          {busy ? strings.uploading : label('رفع ملفات', 'Dosya yükle', 'Upload files')}
          <input
            type="file"
            multiple
            className="hidden"
            onChange={(event) => handleUpload(event.target.files)}
          />
        </label>
      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600" dir="ltr">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-sm text-slate-400">{strings.loading}</p>
      ) : items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-200 p-10 text-center text-sm text-slate-400">
          {strings.empty}
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {items.map((item) => (
            <figure
              key={item.path}
              className="group overflow-hidden rounded-xl border border-slate-200 bg-white"
            >
              <div className="flex aspect-[4/3] items-center justify-center bg-slate-50">
                {item.isImage ? (
                  <img src={item.url} alt={item.name} loading="lazy" className="h-full w-full object-cover" />
                ) : (
                  <FileText size={28} className="text-slate-300" />
                )}
              </div>
              <figcaption className="p-2.5">
                <p className="truncate text-xs font-medium text-slate-700" dir="ltr" title={item.name}>
                  {item.name}
                </p>
                <div className="mt-1.5 flex items-center gap-1">
                  <span className="flex-1 text-[11px] text-slate-400">{formatSize(item.size)}</span>
                  <button
                    type="button"
                    onClick={() => copy(item)}
                    title={label('نسخ الرابط', 'Bağlantıyı kopyala', 'Copy link')}
                    className="rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  >
                    {copied === item.path ? (
                      <Check size={14} className="text-emerald-500" />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(item)}
                    title={strings.delete}
                    className="rounded-md p-1 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </div>
  );
}
