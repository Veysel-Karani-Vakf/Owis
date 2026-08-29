import { useEffect, useRef, useState } from 'react';
import { Ban, ChevronDown, Search } from 'lucide-react';
import { useI18n } from '@/i18n/useI18n';
import { ICON_NAMES, iconByName } from '@/lib/icons';
import { useAdminStrings } from '../hooks/useAdmin';
import { useTopmostEscape } from '../hooks/useTopmostEscape';

/**
 * Picks one of the site's named icons. Editors see the drawing, not the name,
 * so the button shows the current icon and the popover is a searchable grid.
 * The empty choice writes '' so the component falls back to its own default.
 */
export function IconPicker({
  value,
  onChange,
}: {
  value: unknown;
  onChange: (name: string) => void;
}) {
  const { locale } = useI18n();
  const strings = useAdminStrings();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const label = (ar: string, tr: string, en: string) =>
    locale === 'ar' ? ar : locale === 'tr' ? tr : en;

  const name = typeof value === 'string' ? value : '';
  const Current = iconByName(name);

  // Close on Escape (only while topmost) or a click anywhere outside the control.
  useTopmostEscape(() => setOpen(false), open);
  useEffect(() => {
    if (!open) return;
    const onClick = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    searchRef.current?.focus();
    return () => {
      document.removeEventListener('mousedown', onClick);
    };
  }, [open]);

  const needle = query.trim().toLowerCase();
  const matches = needle ? ICON_NAMES.filter((entry) => entry.includes(needle)) : ICON_NAMES;

  const pick = (next: string) => {
    onChange(next);
    setOpen(false);
    setQuery('');
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="flex w-full items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 transition hover:border-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-700">
          {Current ? <Current size={16} /> : <Ban size={14} className="text-slate-400" />}
        </span>
        <span className="min-w-0 flex-1 truncate text-start" dir="ltr">
          {Current ? name : <span className="text-slate-400">{label('بدون أيقونة', 'Simge yok', 'No icon')}</span>}
        </span>
        <ChevronDown size={15} className="shrink-0 text-slate-400" />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label={label('اختيار أيقونة', 'Simge seç', 'Choose an icon')}
          className="absolute start-0 z-30 mt-1 w-full min-w-[260px] max-w-sm rounded-xl border border-slate-200 bg-white p-2 shadow-xl"
        >
          <div className="relative mb-2">
            <Search size={14} className="pointer-events-none absolute inset-y-0 my-auto ms-2.5 text-slate-400" />
            <input
              ref={searchRef}
              dir="ltr"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={strings.search}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pe-2 ps-8 text-xs focus:border-primary-400 focus:outline-none"
            />
          </div>

          <div className="max-h-56 overflow-y-auto">
            <button
              type="button"
              onClick={() => pick('')}
              className={
                'mb-1 flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs transition hover:bg-slate-100 ' +
                (!name ? 'bg-primary-50 text-primary-700' : 'text-slate-600')
              }
            >
              <Ban size={14} />
              {label('بدون أيقونة', 'Simge yok', 'No icon')}
            </button>

            {matches.length === 0 ? (
              <p className="px-2 py-3 text-center text-xs text-slate-400">
                {label('لا توجد نتائج', 'Sonuç yok', 'No matches')}
              </p>
            ) : (
              <div className="grid grid-cols-6 gap-1">
                {matches.map((entry) => {
                  const Icon = iconByName(entry);
                  if (!Icon) return null;
                  const active = entry === name;
                  return (
                    <button
                      key={entry}
                      type="button"
                      title={entry}
                      aria-label={entry}
                      aria-pressed={active}
                      onClick={() => pick(entry)}
                      className={
                        'flex h-9 items-center justify-center rounded-md transition hover:bg-slate-100 ' +
                        (active ? 'bg-primary-100 text-primary-700 ring-1 ring-primary-400' : 'text-slate-700')
                      }
                    >
                      <Icon size={18} />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
