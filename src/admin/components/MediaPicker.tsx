import { useEffect, useMemo, useState } from 'react';
import { FileText, File as FileIcon, Film, Search, Upload, X } from 'lucide-react';
import { useI18n } from '@/i18n/useI18n';
import { useAdminStrings } from '../hooks/useAdmin';
import {
  MEDIA_FOLDERS,
  MEDIA_FOLDER_LABELS,
  formatSize,
  listMediaItems,
  type MediaFolder,
  type MediaItem,
} from '../lib/media';
import { uploadToMedia } from '../lib/storage';

export type MediaAccept = 'image' | 'pdf' | 'any';

/**
 * Lets an editor pick an already-uploaded file instead of copying URLs from
 * the media library page by hand. Uploading here drops the file straight into
 * the field, so "upload" and "choose" are one flow.
 */
export function MediaPicker({
  accept,
  onSelect,
  onClose,
}: {
  accept: MediaAccept;
  onSelect: (url: string) => void;
  onClose: () => void;
}) {
  const { locale } = useI18n();
  const strings = useAdminStrings();
  const [items, setItems] = useState<MediaItem[] | null>(null);
  const [query, setQuery] = useState('');
  const [folder, setFolder] = useState<MediaFolder | 'all'>('all');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const label = (ar: string, tr: string, en: string) =>
    locale === 'ar' ? ar : locale === 'tr' ? tr : en;

  useEffect(() => {
    let cancelled = false;
    listMediaItems()
      .then((list) => {
        if (!cancelled) setItems(list);
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setItems([]);
          setError(e instanceof Error ? e.message : 'failed to load');
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const accepted = (item: MediaItem) =>
    accept === 'image' ? item.isImage : accept === 'pdf' ? item.isPdf : true;

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return (items ?? []).filter(
      (item) =>
        accepted(item) &&
        (folder === 'all' || item.folder === folder) &&
        (!needle || item.name.toLowerCase().includes(needle)),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, query, folder, accept]);

  // Only offer folders that actually hold something the field can take.
  const folders = MEDIA_FOLDERS.filter((entry) => (items ?? []).some((item) => item.folder === entry && accepted(item)));

  const uploadFolder: MediaFolder = accept === 'image' ? 'images' : accept === 'pdf' ? 'docs' : 'uploads';
  const inputAccept = accept === 'image' ? 'image/*' : accept === 'pdf' ? 'application/pdf' : undefined;

  const handleUpload = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const url = await uploadToMedia(file, uploadFolder);
      onSelect(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'upload failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-900/50 p-3 sm:items-center"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={strings.mediaLibrary}
        className="flex max-h-[85vh] w-full max-w-3xl flex-col rounded-2xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3">
          <h2 className="text-base font-bold text-slate-900">{strings.chooseFromLibrary}</h2>
          <span className="flex-1" />
          <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-slate-800">
            <Upload size={14} />
            {busy ? strings.uploading : label('رفع ملف جديد', 'Yeni dosya yükle', 'Upload new')}
            <input
              type="file"
              accept={inputAccept}
              className="hidden"
              disabled={busy}
              onChange={(event) => handleUpload(event.target.files?.[0])}
            />
          </label>
          <button
            type="button"
            onClick={onClose}
            aria-label={strings.cancel}
            className="rounded-md p-1 text-slate-400 transition hover:text-slate-700"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 px-4 py-3">
          <div className="relative min-w-[200px] flex-1">
            <Search size={14} className="pointer-events-none absolute inset-y-0 my-auto ms-2.5 text-slate-400" />
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={strings.search}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pe-2 ps-8 text-sm focus:border-primary-400 focus:outline-none"
            />
          </div>
          <div className="flex flex-wrap gap-1">
            <FolderChip active={folder === 'all'} onClick={() => setFolder('all')}>
              {strings.all}
            </FolderChip>
            {folders.map((entry) => (
              <FolderChip key={entry} active={folder === entry} onClick={() => setFolder(entry)}>
                {MEDIA_FOLDER_LABELS[entry][locale]}
              </FolderChip>
            ))}
          </div>
        </div>

        {error && <p className="px-4 pb-2 text-xs text-red-500">{error}</p>}

        <div className="min-h-[200px] flex-1 overflow-y-auto px-4 pb-4">
          {items === null ? (
            <p className="py-10 text-center text-sm text-slate-400">{strings.loading}</p>
          ) : visible.length === 0 ? (
            <p className="py-10 text-center text-sm text-slate-400">
              {label('لا توجد ملفات مطابقة', 'Eşleşen dosya yok', 'No matching files')}
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {visible.map((item) => (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => onSelect(item.url)}
                  title={item.name}
                  className="group overflow-hidden rounded-lg border border-slate-200 text-start transition hover:border-primary-400 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-200"
                >
                  <div className="flex h-28 items-center justify-center bg-slate-50">
                    {item.isImage ? (
                      <img src={item.url} alt="" loading="lazy" className="h-full w-full object-cover" />
                    ) : item.isPdf ? (
                      <FileText size={30} className="text-red-500" />
                    ) : item.folder === 'videos' ? (
                      <Film size={30} className="text-slate-500" />
                    ) : (
                      <FileIcon size={30} className="text-slate-400" />
                    )}
                  </div>
                  <div className="px-2 py-1.5">
                    <p className="truncate text-xs font-medium text-slate-700" dir="ltr">
                      {item.name}
                    </p>
                    <p className="text-[11px] text-slate-400">{formatSize(item.size)}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FolderChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        'rounded-full px-2.5 py-1 text-xs font-medium transition ' +
        (active ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200')
      }
    >
      {children}
    </button>
  );
}
