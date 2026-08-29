import { useCallback, useEffect, useMemo, useState, type DragEvent } from 'react';
import { Link } from 'react-router-dom';
import { Check, Copy, ExternalLink, FileText, Film, Search, Trash2, Upload, X } from 'lucide-react';
import { useI18n } from '@/i18n/useI18n';
import { useAdminStrings } from '../hooks/useAdmin';
import { useTopmostEscape } from '../hooks/useTopmostEscape';
import { useToast } from '../components/Toast';
import { useConfirm } from '../components/ConfirmDialog';
import { uploadToMedia } from '../lib/storage';
import {
  MEDIA_FOLDERS,
  MEDIA_FOLDER_LABELS,
  findMediaUsage,
  formatSize,
  listMediaItems,
  removeMediaItem,
  type MediaFolder,
  type MediaItem,
  type MediaUsage,
} from '../lib/media';
import { RESOURCES } from '../lib/resources';
import { SITE_PAGES } from '../lib/pageSchema';

type SortKey = 'newest' | 'name' | 'size';

/** Cards shown before the "load more" button; keeps the first paint light. */
const PAGE_SIZE = 60;

const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.mov', '.m4v', '.ogv'];

const isVideo = (name: string) => VIDEO_EXTENSIONS.some((ext) => name.toLowerCase().endsWith(ext));

/** Picks the storage folder for an upload from the file's MIME type. */
function folderFor(file: File): MediaFolder {
  if (file.type.startsWith('image/')) return 'images';
  if (file.type.startsWith('video/') || isVideo(file.name)) return 'videos';
  if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) return 'docs';
  return 'uploads';
}

export default function MediaLibraryPage() {
  const strings = useAdminStrings();
  const { locale } = useI18n();
  const toast = useToast();
  const confirm = useConfirm();

  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortKey>('newest');
  const [folderFilter, setFolderFilter] = useState<MediaFolder | ''>('');
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [copied, setCopied] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ done: number; total: number; name: string } | null>(null);
  const [selected, setSelected] = useState<MediaItem | null>(null);

  const label = (ar: string, tr: string, en: string) =>
    locale === 'ar' ? ar : locale === 'tr' ? tr : en;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setItems(await listMediaItems());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'load failed');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Reset pagination whenever the visible set changes shape.
  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [search, sort, folderFilter]);

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    const list = items.filter(
      (item) => (!folderFilter || item.folder === folderFilter) && (!needle || item.name.toLowerCase().includes(needle)),
    );
    const sorted = [...list];
    if (sort === 'name') sorted.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === 'size') sorted.sort((a, b) => (b.size ?? 0) - (a.size ?? 0));
    else sorted.sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''));
    return sorted;
  }, [items, search, sort, folderFilter]);

  const handleUpload = async (files: FileList | File[] | null) => {
    const list = files ? Array.from(files) : [];
    if (!list.length) return;
    setError(null);
    let failed = 0;
    for (let index = 0; index < list.length; index += 1) {
      const file = list[index];
      setUploadProgress({ done: index, total: list.length, name: file.name });
      try {
        await uploadToMedia(file, folderFor(file));
      } catch (uploadError) {
        failed += 1;
        toast.error(`${file.name}: ${uploadError instanceof Error ? uploadError.message : 'upload failed'}`);
      }
    }
    setUploadProgress(null);
    const uploaded = list.length - failed;
    if (uploaded > 0) {
      toast.success(
        label(`تم رفع ${uploaded} ملف`, `${uploaded} dosya yüklendi`, `${uploaded} file(s) uploaded`),
      );
    }
    await load();
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    handleUpload(event.dataTransfer.files);
  };

  /** Human label + admin link for a record that references a file. */
  const describeUsage = (usage: MediaUsage): { where: string; title: string; href: string } => {
    if (usage.table === 'site_pages') {
      const page = SITE_PAGES.find((entry) => entry.key === usage.id);
      return {
        where: strings.sections.pages ?? 'Pages',
        title: page ? page.label[locale] : usage.title || usage.id,
        href: `/admin/content/${usage.id}`,
      };
    }
    const resource = RESOURCES.find((entry) => entry.table === usage.table);
    return {
      where: resource ? strings.sections[resource.labelKey] ?? resource.labelKey : usage.table,
      title: usage.title || usage.id,
      href: resource ? `/admin/r/${resource.key}/${usage.id}` : '/admin',
    };
  };

  const remove = async (item: MediaItem) => {
    let usage: MediaUsage[] = [];
    try {
      usage = await findMediaUsage(item.path);
    } catch {
      // A failed usage check should not block deletion; fall back to the plain confirm.
    }

    const title = strings.deleteTitle.replace('{name}', item.name);
    const ok = usage.length
      ? await confirm({
          title,
          destructive: true,
          confirmLabel: strings.delete,
          body: (
            <div>
              <p className="font-semibold text-red-600">
                {label(
                  'هذا الملف مستخدم في المواضع التالية، وسيظهر مكسوراً هناك بعد الحذف:',
                  'Bu dosya aşağıdaki yerlerde kullanılıyor; silindikten sonra orada bozuk görünecek:',
                  'This file is used in the places below and will appear broken there after deletion:',
                )}
              </p>
              <ul className="mt-2 list-disc space-y-1 ps-5">
                {usage.map((entry) => {
                  const info = describeUsage(entry);
                  return (
                    <li key={`${entry.table}-${entry.id}`}>
                      <span className="text-slate-500">{info.where}: </span>
                      {info.title}
                    </li>
                  );
                })}
              </ul>
            </div>
          ),
        })
      : await confirm({ title, body: strings.deleteBody, destructive: true, confirmLabel: strings.delete });
    if (!ok) return;

    try {
      await removeMediaItem(item.path);
      setItems((current) => current.filter((entry) => entry.path !== item.path));
      if (selected?.path === item.path) setSelected(null);
      toast.success(strings.deletedToast);
    } catch (removeError) {
      toast.error(removeError instanceof Error ? removeError.message : 'delete failed');
    }
  };

  const copy = async (item: MediaItem) => {
    try {
      await navigator.clipboard.writeText(item.url);
      setCopied(item.path);
      window.setTimeout(() => setCopied(null), 1500);
      toast.success(label('تم نسخ الرابط', 'Bağlantı kopyalandı', 'Link copied'));
    } catch {
      toast.error(label('تعذّر النسخ', 'Kopyalanamadı', 'Could not copy'));
    }
  };

  const chipClass = (active: boolean) =>
    `whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition ${
      active ? 'bg-primary-600 text-white' : 'border border-slate-200 text-slate-600 hover:border-slate-300'
    }`;

  const formatDate = (iso: string | null) =>
    iso ? new Date(iso).toLocaleDateString(locale === 'ar' ? 'ar-EG' : locale === 'tr' ? 'tr-TR' : 'en-GB') : '—';

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-900">{strings.mediaLibrary}</h1>
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
          {uploadProgress ? strings.uploading : label('رفع ملفات', 'Dosya yükle', 'Upload files')}
          <input
            type="file"
            multiple
            className="hidden"
            disabled={!!uploadProgress}
            onChange={(event) => {
              handleUpload(event.target.files);
              event.target.value = '';
            }}
          />
        </label>
      </div>

      {/* Drop zone: the whole strip accepts files so the client never hunts for the button. */}
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`mb-5 rounded-xl border-2 border-dashed px-4 py-5 text-center text-sm transition ${
          dragging ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-slate-200 bg-slate-50 text-slate-500'
        }`}
      >
        {uploadProgress ? (
          <span dir="auto">
            {label(
              `جارٍ رفع ${uploadProgress.done + 1} من ${uploadProgress.total}: `,
              `${uploadProgress.total} dosyadan ${uploadProgress.done + 1}. yükleniyor: `,
              `Uploading ${uploadProgress.done + 1} of ${uploadProgress.total}: `,
            )}
            <span dir="ltr">{uploadProgress.name}</span>
          </span>
        ) : (
          label(
            'اسحب الملفات وأفلتها هنا لرفعها — الصور تذهب إلى «الصور» والـ PDF إلى «المستندات» تلقائياً',
            'Yüklemek için dosyaları buraya sürükleyin — görseller «Görseller», PDF’ler «Belgeler» klasörüne gider',
            'Drag and drop files here to upload — images go to “Images” and PDFs to “Documents” automatically',
          )
        )}
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
        <>
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <div className="relative min-w-[220px] flex-1">
              <Search size={16} className="pointer-events-none absolute top-1/2 -translate-y-1/2 text-slate-400 ltr:left-3 rtl:right-3" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={label('ابحث باسم الملف…', 'Dosya adına göre ara…', 'Search by file name…')}
                className="w-full rounded-lg border border-slate-200 py-2 ps-9 pe-3 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
            </div>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortKey)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
              aria-label={label('الترتيب', 'Sıralama', 'Sort')}
            >
              <option value="newest">{label('الأحدث أولاً', 'En yeni', 'Newest first')}</option>
              <option value="name">{label('حسب الاسم', 'Ada göre', 'By name')}</option>
              <option value="size">{label('الأكبر حجماً', 'Boyuta göre', 'Largest first')}</option>
            </select>
          </div>

          <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
            <button type="button" onClick={() => setFolderFilter('')} className={chipClass(folderFilter === '')}>
              {strings.all} ({items.length})
            </button>
            {MEDIA_FOLDERS.map((folder) => {
              const count = items.filter((item) => item.folder === folder).length;
              if (count === 0 && folderFilter !== folder) return null;
              return (
                <button
                  key={folder}
                  type="button"
                  onClick={() => setFolderFilter(folder)}
                  className={chipClass(folderFilter === folder)}
                >
                  {MEDIA_FOLDER_LABELS[folder][locale]} ({count})
                </button>
              );
            })}
          </div>

          {filtered.length === 0 ? (
            <p className="rounded-xl border border-dashed border-slate-200 p-10 text-center text-sm text-slate-400">
              {strings.empty}
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {filtered.slice(0, visible).map((item) => (
                <div
                  key={item.path}
                  className={`group relative overflow-hidden rounded-xl border bg-white transition hover:shadow-md ${
                    selected?.path === item.path ? 'border-primary-500 ring-2 ring-primary-100' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setSelected(item)}
                    className="flex aspect-[4/3] w-full items-center justify-center bg-slate-50"
                    title={item.name}
                  >
                    <Thumb item={item} />
                  </button>

                  <div className="pointer-events-none absolute inset-x-0 top-0 flex aspect-[4/3] items-end gap-1 bg-gradient-to-t from-black/40 to-transparent p-2 opacity-0 transition group-hover:pointer-events-auto group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => copy(item)}
                      title={label('نسخ الرابط', 'Bağlantıyı kopyala', 'Copy link')}
                      className="flex flex-1 items-center justify-center gap-1 rounded-md bg-white/90 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-white"
                    >
                      {copied === item.path ? (
                        <>
                          <Check size={13} className="text-emerald-500" />
                          {label('تم النسخ', 'Kopyalandı', 'Copied')}
                        </>
                      ) : (
                        <>
                          <Copy size={13} />
                          {label('نسخ', 'Kopyala', 'Copy')}
                        </>
                      )}
                    </button>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-md bg-white/90 p-1.5 text-slate-700 transition hover:bg-white"
                      title={label('فتح الرابط', 'Bağlantıyı aç', 'Open link')}
                    >
                      <ExternalLink size={13} />
                    </a>
                    <button
                      type="button"
                      onClick={() => remove(item)}
                      title={strings.delete}
                      className="rounded-md bg-white/90 p-1.5 text-red-500 transition hover:bg-white"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  <div className="border-t border-slate-200 bg-white p-2.5">
                    <p className="truncate text-xs font-medium text-slate-700" dir="ltr" title={item.name}>
                      {item.name}
                    </p>
                    <p className="mt-0.5 flex justify-between text-[10px] text-slate-400">
                      <span>{formatSize(item.size)}</span>
                      <span>{formatDate(item.createdAt)}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filtered.length > visible && (
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setVisible((current) => current + PAGE_SIZE)}
                className="rounded-lg border border-slate-200 px-5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                {label('عرض المزيد', 'Daha fazla göster', 'Load more')} ({filtered.length - visible})
              </button>
            </div>
          )}
        </>
      )}

      {selected && (
        <DetailPanel
          item={selected}
          onClose={() => setSelected(null)}
          onCopy={() => copy(selected)}
          onDelete={() => remove(selected)}
          describeUsage={describeUsage}
          label={label}
          formatDate={formatDate}
        />
      )}
    </div>
  );
}

function Thumb({ item, large = false }: { item: MediaItem; large?: boolean }) {
  if (item.isImage) {
    return (
      <img
        src={item.url}
        alt={item.name}
        loading="lazy"
        className={large ? 'max-h-72 w-full object-contain' : 'h-full w-full object-cover'}
      />
    );
  }
  const size = large ? 56 : 28;
  if (isVideo(item.name)) return <Film size={size} className="text-slate-300" />;
  return (
    <div className="flex flex-col items-center gap-1 text-slate-300">
      <FileText size={size} />
      {item.isPdf && <span className="text-[10px] font-bold tracking-wide">PDF</span>}
    </div>
  );
}

type DetailProps = {
  item: MediaItem;
  onClose: () => void;
  onCopy: () => void;
  onDelete: () => void;
  describeUsage: (usage: MediaUsage) => { where: string; title: string; href: string };
  label: (ar: string, tr: string, en: string) => string;
  formatDate: (iso: string | null) => string;
};

function DetailPanel({ item, onClose, onCopy, onDelete, describeUsage, label, formatDate }: DetailProps) {
  const strings = useAdminStrings();
  const { locale } = useI18n();
  const [dimensions, setDimensions] = useState<string | null>(null);
  const [usage, setUsage] = useState<MediaUsage[] | null>(null);
  const [usageLoading, setUsageLoading] = useState(false);

  // Usage lookups hit every table, so they run only when a file is opened.
  useEffect(() => {
    let cancelled = false;
    setUsage(null);
    setUsageLoading(true);
    findMediaUsage(item.path)
      .then((hits) => {
        if (!cancelled) setUsage(hits);
      })
      .catch(() => {
        if (!cancelled) setUsage([]);
      })
      .finally(() => {
        if (!cancelled) setUsageLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [item.path]);

  useEffect(() => {
    setDimensions(null);
    if (!item.isImage) return;
    const image = new Image();
    image.onload = () => setDimensions(`${image.naturalWidth} × ${image.naturalHeight}`);
    image.src = item.url;
    return () => {
      image.onload = null;
    };
  }, [item]);

  useTopmostEscape(onClose);

  const rows: [string, string][] = [
    [label('المجلد', 'Klasör', 'Folder'), MEDIA_FOLDER_LABELS[item.folder][locale]],
    [label('الحجم', 'Boyut', 'Size'), formatSize(item.size)],
    [label('تاريخ الرفع', 'Yükleme tarihi', 'Uploaded'), formatDate(item.createdAt)],
  ];
  if (dimensions) rows.push([label('الأبعاد', 'Boyutlar', 'Dimensions'), dimensions]);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40" onClick={onClose}>
      <aside
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
        className="flex h-full w-full max-w-md flex-col overflow-y-auto bg-white shadow-2xl"
      >
        <div className="flex items-center gap-2 border-b border-slate-200 px-5 py-4">
          <p className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-900" dir="ltr" title={item.name}>
            {item.name}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 transition hover:text-slate-700"
            aria-label={strings.cancel}
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex items-center justify-center bg-slate-50 p-4">
          <Thumb item={item} large />
        </div>

        <div className="space-y-4 px-5 py-4 text-sm">
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5">
            {rows.map(([key, value]) => (
              <div key={key} className="contents">
                <dt className="text-slate-500">{key}</dt>
                <dd className="text-slate-800" dir="ltr">
                  {value}
                </dd>
              </div>
            ))}
          </dl>

          <div>
            <p className="mb-1 text-xs font-medium text-slate-500">{label('الرابط', 'Bağlantı', 'URL')}</p>
            <div className="flex gap-2">
              <input
                readOnly
                value={item.url}
                dir="ltr"
                onFocus={(event) => event.target.select()}
                className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700"
              />
              <button
                type="button"
                onClick={onCopy}
                className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
              >
                <Copy size={13} />
                {label('نسخ', 'Kopyala', 'Copy')}
              </button>
            </div>
          </div>

          <div>
            <p className="mb-1 text-xs font-medium text-slate-500">
              {label('المستخدم في', 'Kullanıldığı yerler', 'Used in')}
            </p>
            {usageLoading ? (
              <p className="text-xs text-slate-400">{strings.loading}</p>
            ) : !usage || usage.length === 0 ? (
              <p className="text-xs text-slate-400">
                {label(
                  'غير مستخدم في أي مادة — يمكن حذفه بأمان',
                  'Hiçbir kayıtta kullanılmıyor — güvenle silinebilir',
                  'Not used by any record — safe to delete',
                )}
              </p>
            ) : (
              <ul className="space-y-1">
                {usage.map((entry) => {
                  const info = describeUsage(entry);
                  return (
                    <li key={`${entry.table}-${entry.id}`}>
                      <Link
                        to={info.href}
                        className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 transition hover:border-primary-300 hover:bg-primary-50"
                      >
                        <span className="shrink-0 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
                          {info.where}
                        </span>
                        <span className="min-w-0 flex-1 truncate text-slate-800">{info.title}</span>
                        <ExternalLink size={13} className="shrink-0 text-slate-400" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        <div className="mt-auto flex gap-2 border-t border-slate-200 px-5 py-4">
          <a
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
          >
            <ExternalLink size={14} />
            {label('فتح', 'Aç', 'Open')}
          </a>
          <button
            type="button"
            onClick={onDelete}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
          >
            <Trash2 size={14} />
            {strings.delete}
          </button>
        </div>
      </aside>
    </div>
  );
}
