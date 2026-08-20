import { useState } from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown, Upload, Link2 } from 'lucide-react';
import { LOCALES, type Locale } from '@/lib/types';
import { useI18n } from '@/i18n/useI18n';
import { useAdminStrings } from '../hooks/useAdmin';
import { uploadToMedia } from '../lib/storage';

const localeName: Record<Locale, string> = { ar: 'العربية', tr: 'Türkçe', en: 'English' };
const localeDir: Record<Locale, 'rtl' | 'ltr'> = { ar: 'rtl', tr: 'ltr', en: 'ltr' };

const inputBase =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 ' +
  'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100';

function LocaleTabs({ active, onChange }: { active: Locale; onChange: (l: Locale) => void }) {
  return (
    <div className="mb-2 flex gap-1">
      {LOCALES.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => onChange(l)}
          className={
            'rounded-md px-2.5 py-1 text-xs font-medium transition ' +
            (active === l
              ? 'bg-primary-600 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200')
          }
        >
          {localeName[l]}
        </button>
      ))}
    </div>
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
  const { locale } = useI18n();
  const [tab, setTab] = useState<Locale>(locale);
  const v = value || {};
  const set = (text: string) => onChange({ ...v, [tab]: text });

  return (
    <div>
      <LocaleTabs active={tab} onChange={setTab} />
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

/** Paragraph editor: one textarea per locale, blank lines split paragraphs. */
export function LocalizedParagraphsInput({
  value,
  onChange,
}: {
  value: LocalizedListValue;
  onChange: (v: LocalizedListValue) => void;
}) {
  const { locale } = useI18n();
  const [tab, setTab] = useState<Locale>(locale);
  const v = value || {};
  const text = (v[tab] ?? []).join('\n\n');
  const set = (raw: string) => {
    const paras = raw
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean);
    onChange({ ...v, [tab]: paras });
  };
  return (
    <div>
      <LocaleTabs active={tab} onChange={setTab} />
      <textarea
        className={inputBase + ' min-h-[160px] resize-y leading-relaxed'}
        dir={localeDir[tab]}
        value={text}
        onChange={(e) => set(e.target.value)}
      />
      <p className="mt-1 text-xs text-slate-400">
        {v[tab]?.length ?? 0} — {localeName[tab]}
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
          <button
            type="button"
            title={s.removeItem}
            onClick={() => onChange(items.filter((_, k) => k !== i))}
            className="icon-btn text-red-500"
          >
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

export function ImageInput({
  value,
  onChange,
  accept = 'image/*',
}: {
  value: string;
  onChange: (v: string) => void;
  accept?: string;
}) {
  const s = useAdminStrings();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    setErr(null);
    try {
      const url = await uploadToMedia(file, accept.includes('pdf') ? 'docs' : 'images');
      onChange(url);
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'upload failed');
    } finally {
      setBusy(false);
    }
  };

  const isImage = accept.includes('image');
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700">
          <Upload size={15} />
          {busy ? s.uploading : s.uploadImage}
          <input
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </label>
        <div className="relative flex-1">
          <Link2 size={15} className="pointer-events-none absolute inset-y-0 my-auto ms-2 text-slate-400" />
          <input
            className={inputBase + ' ps-8'}
            dir="ltr"
            placeholder={s.orPasteUrl}
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      </div>
      {err && <p className="text-xs text-red-500">{err}</p>}
      {value && isImage && (
        <img
          src={value}
          alt=""
          className="h-24 w-auto rounded-lg border border-slate-200 object-cover"
        />
      )}
      {value && !isImage && (
        <a href={value} target="_blank" rel="noreferrer" className="text-xs text-primary-600 underline" dir="ltr">
          {value}
        </a>
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
