import { useEffect, useRef, useState } from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown, Upload, Link2, ExternalLink, FileText, FolderOpen } from 'lucide-react';
import { LOCALES, type Locale } from '@/lib/types';
import { useI18n } from '@/i18n/useI18n';
import { useAdminStrings } from '../hooks/useAdmin';
import { uploadToMedia } from '../lib/storage';
import { filledLocales } from '../lib/validate';
import type { SelectOption } from '../lib/fields';
import { LocaleSwitch, localeDir, localeName, useEditingLocale } from './EditingLocale';
import { useConfirm } from './ConfirmDialog';
import { MediaPicker, type MediaAccept } from './MediaPicker';

const inputBase =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 ' +
  'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100';

/**
 * The language a localized control shows: the form-wide editing language,
 * unless the editor clicked a tab on this one field. The override clears as
 * soon as the shared language changes so the form flips together again.
 */
export function useFieldLocale(): [Locale, (locale: Locale) => void] {
  const { locale: shared } = useEditingLocale();
  const [override, setOverride] = useState<Locale | null>(null);
  useEffect(() => {
    setOverride(null);
  }, [shared]);
  return [override ?? shared, setOverride];
}

/** "Copy from <language>" buttons, offered only while the current language is empty. */
export function CopyFromButtons({
  current,
  hasContent,
  onCopy,
}: {
  current: Locale;
  hasContent: (locale: Locale) => boolean;
  onCopy: (source: Locale) => void;
}) {
  const strings = useAdminStrings();
  if (hasContent(current)) return null;
  const sources = LOCALES.filter((option) => option !== current && hasContent(option));
  if (sources.length === 0) return null;
  return (
    <>
      {sources.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onCopy(option)}
          className="rounded-md border border-dashed border-slate-300 px-2 py-1 text-xs text-slate-500 transition hover:border-primary-400 hover:text-primary-600"
        >
          {strings.copyFrom} {localeName[option]}
        </button>
      ))}
    </>
  );
}

type LocalizedValue = Partial<Record<Locale, string>>;

export function LocalizedInput({
  value,
  onChange,
  multiline,
}: {
  value: LocalizedValue;
  onChange: (v: LocalizedValue) => void;
  multiline?: boolean;
}) {
  const [tab, setTab] = useFieldLocale();
  const v = value || {};
  const set = (text: string) => onChange({ ...v, [tab]: text });
  const filled = filledLocales(v);
  const counts = Object.fromEntries(LOCALES.map((l) => [l, filled.includes(l)])) as Record<Locale, boolean>;

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center gap-1">
        <LocaleSwitch value={tab} onChange={setTab} counts={counts} />
        <span className="flex-1" />
        <CopyFromButtons
          current={tab}
          hasContent={(l) => filled.includes(l)}
          onCopy={(source) => onChange({ ...v, [tab]: v[source] ?? '' })}
        />
      </div>
      {multiline ? (
        <textarea
          className={inputBase + ' min-h-[90px] resize-y'}
          dir={localeDir[tab]}
          value={v[tab] ?? ''}
          onChange={(e) => set(e.target.value)}
        />
      ) : (
        <input
          className={inputBase}
          dir={localeDir[tab]}
          value={v[tab] ?? ''}
          onChange={(e) => set(e.target.value)}
        />
      )}
    </div>
  );
}

type LocalizedListValue = Partial<Record<Locale, string[]>>;

export function splitParagraphs(raw: string): string[] {
  return raw
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/**
 * Textarea whose text is only turned into paragraphs when the editor leaves
 * it (or it unmounts). Splitting on every keystroke used to swallow the blank
 * line the editor was in the middle of typing.
 */
export function ParagraphTextarea({
  paragraphs,
  onCommit,
  dir,
  className,
}: {
  paragraphs: string[];
  onCommit: (paragraphs: string[]) => void;
  dir: 'rtl' | 'ltr';
  className?: string;
}) {
  const joined = paragraphs.join('\n\n');
  const [raw, setRaw] = useState(joined);
  const rawRef = useRef(raw);
  const committedRef = useRef(joined);
  const commitRef = useRef(onCommit);
  commitRef.current = onCommit;
  rawRef.current = raw;

  // Adopt outside changes (copy-from, undo) but never while the editor's own
  // uncommitted text is what differs.
  useEffect(() => {
    if (joined !== committedRef.current) {
      committedRef.current = joined;
      setRaw(joined);
    }
  }, [joined]);

  const commit = () => {
    const next = splitParagraphs(rawRef.current);
    const nextJoined = next.join('\n\n');
    if (nextJoined === committedRef.current) return;
    committedRef.current = nextJoined;
    commitRef.current(next);
  };
  const commitOnUnmount = useRef(commit);
  commitOnUnmount.current = commit;
  useEffect(() => () => commitOnUnmount.current(), []);

  return (
    <textarea
      className={className ?? inputBase + ' min-h-[160px] resize-y leading-relaxed'}
      dir={dir}
      value={raw}
      onChange={(e) => setRaw(e.target.value)}
      onBlur={commit}
    />
  );
}

export function paragraphsHint(locale: Locale, count: number): string {
  const noun =
    locale === 'ar' ? 'فقرة' : locale === 'tr' ? 'paragraf' : count === 1 ? 'paragraph' : 'paragraphs';
  const hint =
    locale === 'ar'
      ? 'افصل بين الفقرات بسطر فارغ'
      : locale === 'tr'
        ? 'Paragrafları boş satırla ayırın'
        : 'separate paragraphs with a blank line';
  return `${count} ${noun} — ${hint}`;
}

/** Paragraph editor: one textarea per locale, blank lines split paragraphs. */
export function LocalizedParagraphsInput({
  value,
  onChange,
}: {
  value: LocalizedListValue;
  onChange: (v: LocalizedListValue) => void;
}) {
  const { locale } = useI18n();
  const [tab, setTab] = useFieldLocale();
  const v = value || {};
  const has = (l: Locale) => (v[l]?.length ?? 0) > 0;
  const counts = Object.fromEntries(LOCALES.map((l) => [l, has(l)])) as Record<Locale, boolean>;

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center gap-1">
        <LocaleSwitch value={tab} onChange={setTab} counts={counts} />
        <span className="flex-1" />
        <CopyFromButtons
          current={tab}
          hasContent={has}
          onCopy={(source) => onChange({ ...v, [tab]: [...(v[source] ?? [])] })}
        />
      </div>
      <ParagraphTextarea
        key={tab}
        paragraphs={v[tab] ?? []}
        dir={localeDir[tab]}
        onCommit={(paras) => onChange({ ...v, [tab]: paras })}
      />
      <p className="mt-1 text-xs text-slate-400">
        {paragraphsHint(locale, v[tab]?.length ?? 0)} — {localeName[tab]}
      </p>
    </div>
  );
}

export function StringListInput({
  value,
  onChange,
}: {
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const s = useAdminStrings();
  const confirm = useConfirm();
  const items = Array.isArray(value) ? value : [];
  const update = (i: number, text: string) => {
    const next = [...items];
    next[i] = text;
    onChange(next);
  };
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  const remove = async (i: number) => {
    const text = (items[i] ?? '').trim();
    if (text) {
      const name = text.length > 40 ? `${text.slice(0, 40)}…` : text;
      const ok = await confirm({ title: s.deleteTitle.replace('{name}', name), destructive: true });
      if (!ok) return;
    }
    onChange(items.filter((_, k) => k !== i));
  };
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-1">
          <input className={inputBase} value={item} onChange={(e) => update(i, e.target.value)} />
          <button type="button" title={s.moveUp} onClick={() => move(i, -1)} className="icon-btn">
            <ArrowUp size={15} />
          </button>
          <button type="button" title={s.moveDown} onClick={() => move(i, 1)} className="icon-btn">
            <ArrowDown size={15} />
          </button>
          <span className="mx-1 h-5 w-px bg-slate-200" aria-hidden="true" />
          <button type="button" title={s.removeItem} onClick={() => remove(i)} className="icon-btn text-red-500">
            <Trash2 size={15} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, ''])}
        className="inline-flex items-center gap-1 rounded-lg border border-dashed border-slate-300 px-3 py-1.5 text-sm text-slate-600 hover:border-primary-400 hover:text-primary-600"
      >
        <Plus size={15} /> {s.addItem}
      </button>
    </div>
  );
}

/** Shared select used by both the record forms and the page editor. */
export function SelectControl({
  value,
  onChange,
  options,
  required,
}: {
  value: unknown;
  onChange: (v: string) => void;
  options: SelectOption[];
  required?: boolean;
}) {
  const { locale } = useI18n();
  const label = (ar: string, tr: string, en: string) =>
    locale === 'ar' ? ar : locale === 'tr' ? tr : en;
  const hasEmptyOption = options.some((o) => o.value === '');
  const current = typeof value === 'string' ? value : '';

  // A required select must never offer "nothing" — the database would reject it.
  useEffect(() => {
    if (required && current === '' && options.length > 0 && !hasEmptyOption) onChange(options[0].value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [required, current, options]);

  return (
    <select className={inputBase} value={current} onChange={(e) => onChange(e.target.value)}>
      {!required && !hasEmptyOption && <option value="">{label('بدون', 'Yok', 'None')}</option>}
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label[locale]}
        </option>
      ))}
    </select>
  );
}

function fileNameOf(url: string): string {
  try {
    const path = decodeURIComponent(new URL(url, window.location.origin).pathname);
    return path.split('/').pop() || url;
  } catch {
    return url.split('/').pop() || url;
  }
}

export function ImageInput({
  value,
  onChange,
  accept = 'image/*',
  onDimensions,
}: {
  value: string;
  onChange: (v: string) => void;
  accept?: string;
  /** Called with the natural size whenever an image is uploaded or a URL set. */
  onDimensions?: (width: number, height: number) => void;
}) {
  const s = useAdminStrings();
  const { locale } = useI18n();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [picker, setPicker] = useState(false);
  const isImage = accept.includes('image');
  const isPdf = accept.includes('pdf');
  const pickerAccept: MediaAccept = isImage ? 'image' : isPdf ? 'pdf' : 'any';

  const label = (ar: string, tr: string, en: string) =>
    locale === 'ar' ? ar : locale === 'tr' ? tr : en;

  // Measure only values set during this session: the stored size of a record
  // that merely opened must not be overwritten (and dirty the form).
  const measuredRef = useRef<string>(value ?? '');
  const dimensionsRef = useRef(onDimensions);
  dimensionsRef.current = onDimensions;
  useEffect(() => {
    if (!isImage || !value || value === measuredRef.current || !dimensionsRef.current) return;
    measuredRef.current = value;
    const probe = new Image();
    probe.onload = () => {
      if (measuredRef.current === value && probe.naturalWidth && probe.naturalHeight) {
        dimensionsRef.current?.(probe.naturalWidth, probe.naturalHeight);
      }
    };
    probe.src = value;
  }, [value, isImage]);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    setErr(null);
    try {
      const url = await uploadToMedia(file, isPdf ? 'docs' : isImage ? 'images' : 'uploads');
      onChange(url);
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'upload failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700">
          <Upload size={15} />
          {busy ? s.uploading : isImage ? s.uploadImage : label('رفع ملف', 'Dosya yükle', 'Upload file')}
          <input
            type="file"
            accept={accept}
            className="hidden"
            disabled={busy}
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </label>
        <button
          type="button"
          onClick={() => setPicker(true)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-primary-400 hover:text-primary-700"
        >
          <FolderOpen size={15} />
          {s.chooseFromLibrary}
        </button>
      </div>

      <div>
        <p className="mb-1 text-xs text-slate-500">{s.orPasteUrl}</p>
        <div className="relative">
          <Link2 size={15} className="pointer-events-none absolute inset-y-0 my-auto ms-2 text-slate-400" />
          <input
            className={inputBase + ' ps-8'}
            dir="ltr"
            placeholder="https://…"
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      </div>

      {err && <p className="text-xs text-red-500">{err}</p>}

      {value && isImage && (
        <a
          href={value}
          target="_blank"
          rel="noreferrer"
          title={label('فتح الصورة بالحجم الكامل', 'Görseli tam boyutta aç', 'Open full-size image')}
          className="inline-block overflow-hidden rounded-lg border border-slate-200 bg-slate-50"
        >
          <img src={value} alt="" className="max-h-40 w-auto max-w-full object-contain" />
        </a>
      )}
      {value && !isImage && (
        <a
          href={value}
          target="_blank"
          rel="noreferrer"
          className="inline-flex max-w-full items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 hover:text-primary-700"
        >
          <FileText size={15} className="shrink-0 text-red-500" />
          <span className="truncate" dir="ltr">
            {fileNameOf(value)}
          </span>
          <ExternalLink size={12} className="shrink-0 text-slate-400" />
        </a>
      )}

      {picker && (
        <MediaPicker
          accept={pickerAccept}
          onSelect={(url) => {
            onChange(url);
            setPicker(false);
          }}
          onClose={() => setPicker(false)}
        />
      )}
    </div>
  );
}

export function JsonInput({
  value,
  onChange,
}: {
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const s = useAdminStrings();
  const [text, setText] = useState(() => JSON.stringify(value ?? null, null, 2));
  const [err, setErr] = useState<string | null>(null);

  const handle = (raw: string) => {
    setText(raw);
    if (raw.trim() === '') {
      setErr(null);
      onChange(null);
      return;
    }
    try {
      onChange(JSON.parse(raw));
      setErr(null);
    } catch {
      setErr(s.jsonInvalid);
    }
  };

  return (
    <div>
      <textarea
        className={
          inputBase +
          ' min-h-[180px] resize-y font-mono text-xs ' +
          (err ? 'border-red-400 focus:ring-red-100' : '')
        }
        dir="ltr"
        spellCheck={false}
        value={text}
        onChange={(e) => handle(e.target.value)}
      />
      {err && <p className="mt-1 text-xs text-red-500">{err}</p>}
    </div>
  );
}

export const scalarInputClass = inputBase;
