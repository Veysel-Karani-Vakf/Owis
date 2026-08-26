import { useState } from 'react';
import { Pencil, Check, Info } from 'lucide-react';
import { useI18n } from '@/i18n/useI18n';
import { slugify } from '../lib/slug';

const ARABIC_LETTERS = /[؀-ۿ]/;

/**
 * Shows the page's address as a sentence rather than a "slug" text box.
 *
 * It is generated from the title while a record is new, so editors normally
 * never touch it; editing stays available because changing it after publishing
 * breaks existing links, which is a decision only a person can make.
 */
export function SlugInput({
  value,
  onChange,
  prefix,
}: {
  value: string;
  onChange: (value: string) => void;
  prefix?: string;
}) {
  const { locale } = useI18n();
  const [editing, setEditing] = useState(false);

  const label = (ar: string, tr: string, en: string) =>
    locale === 'ar' ? ar : locale === 'tr' ? tr : en;

  const slug = value ?? '';
  // Arabic links work, but browsers copy them percent-encoded; say so once so
  // the editor is not surprised when pasting the link into a message.
  const arabicNote = ARABIC_LETTERS.test(slug) && (
    <p className="mt-1 flex items-start gap-1 text-xs text-slate-500">
      <Info size={13} className="mt-0.5 shrink-0" />
      {label(
        'الرابط بالعربية يعمل، لكنه يظهر بصيغة مثل %D8… عند نسخه ومشاركته.',
        'Arapça bağlantı çalışır, ancak kopyalandığında %D8… biçiminde görünür.',
        'Arabic links work, but look like %D8… when copied and shared.',
      )}
    </p>
  );

  if (!editing) {
    return (
      <div>
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
          <span className="min-w-0 flex-1 truncate text-sm text-slate-600" dir="ltr">
            {prefix ?? ''}
            <span className="font-medium text-slate-800">{slug || '—'}</span>
          </span>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-xs text-slate-500 transition hover:bg-slate-200 hover:text-slate-800"
          >
            <Pencil size={13} />
            {label('تعديل', 'Düzenle', 'Edit')}
          </button>
        </div>
        {arabicNote}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2">
        <input
          dir="ltr"
          autoFocus
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
          value={slug}
          onChange={(event) => onChange(slugify(event.target.value))}
        />
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="inline-flex shrink-0 items-center gap-1 rounded-md bg-slate-900 px-2.5 py-2 text-xs text-white transition hover:bg-slate-800"
        >
          <Check size={13} />
          {label('تم', 'Tamam', 'Done')}
        </button>
      </div>
      <p className="mt-1 text-xs text-amber-600">
        {label(
          'تغييره بعد النشر يُعطّل الروابط المنشورة لهذه الصفحة.',
          'Yayından sonra değiştirmek mevcut bağlantıları bozar.',
          'Changing this after publishing breaks existing links to the page.',
        )}
      </p>
    </div>
  );
}
