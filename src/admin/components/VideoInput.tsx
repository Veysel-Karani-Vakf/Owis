import { useState } from 'react';
import { Film, Link2, Trash2, Upload, Youtube } from 'lucide-react';
import { useI18n } from '@/i18n/useI18n';
import {
  extractYouTubeId,
  resolveVideo,
  youTubePoster,
  youTubeWatchUrl,
} from '@/lib/video';
import { uploadToMedia } from '../lib/storage';
import { ImageInput } from './FieldControls';

/** Supabase rejects larger uploads, so catch it before the long wait. */
const MAX_VIDEO_BYTES = 50 * 1024 * 1024;

type VideoValue = Record<string, unknown>;

/**
 * Edits a video as one thing — "upload a file" or "paste a YouTube link" —
 * instead of exposing the video ID, embed URL and thumbnail URL separately.
 *
 * It receives the object that holds the video keys (a program video, the hero
 * section, …) and returns a copy, so unrelated keys on that object survive.
 */
export function VideoInput({
  value,
  onChange,
}: {
  value: unknown;
  onChange: (next: VideoValue) => void;
}) {
  const { locale } = useI18n();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const label = (ar: string, tr: string, en: string) =>
    locale === 'ar' ? ar : locale === 'tr' ? tr : en;

  const current: VideoValue = value && typeof value === 'object' ? (value as VideoValue) : {};
  const videoFile = typeof current.videoFile === 'string' ? current.videoFile : '';
  const videoId = typeof current.videoId === 'string' ? current.videoId : '';
  const sourceUrl = typeof current.sourceUrl === 'string' ? current.sourceUrl : '';
  const poster = typeof current.posterImage === 'string' ? current.posterImage : '';

  const source = resolveVideo({ videoFile, videoId, sourceUrl });

  const patch = (changes: VideoValue) => onChange({ ...current, ...changes });

  const handleUpload = async (file: File | undefined) => {
    if (!file) return;
    if (file.size > MAX_VIDEO_BYTES) {
      setError(
        label(
          'حجم الملف كبير جداً. الحد الأقصى ٥٠ ميغابايت — استخدم رابط يوتيوب للفيديوهات الطويلة.',
          'Dosya çok büyük. En fazla 50 MB — uzun videolar için YouTube bağlantısı kullanın.',
          'File is too large. The limit is 50 MB — use a YouTube link for longer videos.',
        ),
      );
      return;
    }

    setBusy(true);
    setError(null);
    try {
      const url = await uploadToMedia(file, 'videos');
      // An uploaded file replaces any YouTube link that was set before.
      patch({ videoFile: url, videoId: '', sourceUrl: url });
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'upload failed');
    } finally {
      setBusy(false);
    }
  };

  const handleLink = (raw: string) => {
    const id = extractYouTubeId(raw);
    if (!id) {
      // Keep what was typed so a half-pasted link is not thrown away.
      patch({ sourceUrl: raw, videoId: '', videoFile: '' });
      return;
    }
    patch({
      videoFile: '',
      videoId: id,
      sourceUrl: youTubeWatchUrl(id),
      // Give the section a cover straight away; the editor can replace it.
      posterImage: poster || youTubePoster(id),
    });
  };

  const clear = () => patch({ videoFile: '', videoId: '', sourceUrl: '' });

  return (
    <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/60 p-3">
      {/* Upload ----------------------------------------------------------- */}
      <div className="flex flex-wrap items-center gap-2">
        <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800">
          <Upload size={15} />
          {busy
            ? label('جارٍ الرفع…', 'Yükleniyor…', 'Uploading…')
            : label('رفع فيديو من جهازك', 'Cihazınızdan video yükleyin', 'Upload a video')}
          <input
            type="file"
            accept="video/*"
            className="hidden"
            disabled={busy}
            onChange={(event) => handleUpload(event.target.files?.[0])}
          />
        </label>

        <span className="text-xs text-slate-400">
          {label('حتى ٥٠ ميغابايت', 'En fazla 50 MB', 'Up to 50 MB')}
        </span>
      </div>

      {/* YouTube link ------------------------------------------------------ */}
      <div>
        <p className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-500">
          <Youtube size={14} />
          {label('أو الصق رابط يوتيوب', 'Veya bir YouTube bağlantısı yapıştırın', 'Or paste a YouTube link')}
        </p>
        <div className="relative">
          <Link2
            size={15}
            className="pointer-events-none absolute inset-y-0 my-auto ms-2 text-slate-400"
          />
          <input
            dir="ltr"
            placeholder="https://www.youtube.com/watch?v=…"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 ps-8 text-sm text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
            // Older content stored only the ID; show the link it stands for so
            // the field is never blank while a video is clearly set.
            value={videoFile ? '' : sourceUrl || (videoId ? youTubeWatchUrl(videoId) : '')}
            onChange={(event) => handleLink(event.target.value)}
          />
        </div>
      </div>

      {/* What will play ---------------------------------------------------- */}
      {source && (
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
          {poster && (
            <img
              src={poster}
              alt=""
              className="h-10 w-16 shrink-0 rounded-md border border-slate-200 object-cover"
            />
          )}
          {source.kind === 'file' ? (
            <Film size={15} className="shrink-0 text-emerald-600" />
          ) : (
            <Youtube size={15} className="shrink-0 text-red-600" />
          )}
          <span className="min-w-0 flex-1 truncate text-xs text-slate-600">
            {source.kind === 'file'
              ? label('فيديو مرفوع — سيُشغَّل من الموقع', 'Yüklenen video', 'Uploaded video')
              : label('فيديو يوتيوب', 'YouTube videosu', 'YouTube video')}
          </span>
          <button
            type="button"
            onClick={clear}
            title={label('إزالة الفيديو', 'Videoyu kaldır', 'Remove video')}
            className="shrink-0 rounded-md p-1 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}

      {/* Cover image ------------------------------------------------------- */}
      <div>
        <p className="mb-1.5 text-xs font-medium text-slate-500">
          {label(
            'صورة الغلاف — تظهر قبل تشغيل الفيديو',
            'Kapak görseli — video oynatılmadan önce görünür',
            'Cover image — shown before the video plays',
          )}
        </p>
        <ImageInput value={poster} onChange={(next) => patch({ posterImage: next })} />
      </div>
    </div>
  );
}
