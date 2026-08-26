import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { useI18n } from '@/i18n/useI18n';
import { LOCALES, type Locale } from '@/lib/types';

type EditingLocaleValue = {
  /** Language every localized control on the form currently shows. */
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

const EditingLocaleContext = createContext<EditingLocaleValue | null>(null);

/**
 * One "editing language" for a whole record form, so switching to Turkish
 * flips every localized field at once instead of one tab per field. Controls
 * outside a provider fall back to the dashboard's own language.
 */
export function EditingLocaleProvider({ children, initial }: { children: ReactNode; initial?: Locale }) {
  const { locale: uiLocale } = useI18n();
  const [locale, setLocale] = useState<Locale>(initial ?? uiLocale);
  const value = useMemo(() => ({ locale, setLocale }), [locale]);
  return <EditingLocaleContext.Provider value={value}>{children}</EditingLocaleContext.Provider>;
}

export function useEditingLocale(): EditingLocaleValue {
  const ctx = useContext(EditingLocaleContext);
  const { locale: uiLocale } = useI18n();
  const [local, setLocal] = useState<Locale>(uiLocale);
  return ctx ?? { locale: local, setLocale: setLocal };
}

export const localeName: Record<Locale, string> = { ar: 'العربية', tr: 'Türkçe', en: 'English' };
export const localeDir: Record<Locale, 'rtl' | 'ltr'> = { ar: 'rtl', tr: 'ltr', en: 'ltr' };

/** Small segmented control used wherever a language is chosen. */
export function LocaleSwitch({
  value,
  onChange,
  counts,
  size = 'sm',
}: {
  value: Locale;
  onChange: (locale: Locale) => void;
  /** Optional per-language completeness dots (true = has content). */
  counts?: Partial<Record<Locale, boolean>>;
  size?: 'sm' | 'md';
}) {
  return (
    <div className="inline-flex gap-1 rounded-lg bg-slate-100 p-0.5">
      {LOCALES.map((option) => {
        const active = option === value;
        const filled = counts?.[option];
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={
              (size === 'md' ? 'px-3 py-1.5 text-sm ' : 'px-2.5 py-1 text-xs ') +
              'inline-flex items-center gap-1.5 rounded-md font-medium transition ' +
              (active ? 'bg-white text-primary-700 shadow-sm' : 'text-slate-500 hover:text-slate-800')
            }
          >
            {localeName[option]}
            {counts && (
              <span
                className={'h-1.5 w-1.5 rounded-full ' + (filled ? 'bg-emerald-500' : 'bg-slate-300')}
                aria-hidden="true"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
