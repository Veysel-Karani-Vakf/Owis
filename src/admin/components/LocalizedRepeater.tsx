import { useState } from 'react';
import { LOCALES, type Locale } from '@/lib/types';
import { useI18n } from '@/i18n/useI18n';
import type { PageFieldDef } from '../lib/pageSchema';
import { RepeaterInput, contentDir } from './PageFields';

const localeName: Record<Locale, string> = { ar: 'العربية', tr: 'Türkçe', en: 'English' };

/**
 * A repeating group stored once per language:
 *   { ar: [...], tr: [...], en: [...] }
 *
 * Content tables hold these as jsonb. The site's localizer collapses whichever
 * shape it finds, so older rows that stored a single array still render.
 */
export function LocalizedRepeaterInput({
  value,
  onChange,
  itemFields,
  itemTitleField,
}: {
  value: unknown;
  onChange: (value: unknown) => void;
  itemFields: PageFieldDef[];
  itemTitleField?: string;
}) {
  const { locale } = useI18n();
  const [tab, setTab] = useState<Locale>(locale);

  const container = normalize(value);
  const rows = container[tab] ?? [];

  const copyFrom = (source: Locale) => {
    const items = container[source] ?? [];
    onChange({ ...container, [tab]: JSON.parse(JSON.stringify(items)) });
  };

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center gap-1">
        {LOCALES.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setTab(option)}
            className={
              'rounded-md px-2.5 py-1 text-xs font-medium transition ' +
              (tab === option ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200')
            }
          >
            {localeName[option]}
            <span className="ms-1.5 opacity-60">{(container[option] ?? []).length}</span>
          </button>
        ))}

        <span className="flex-1" />

        {/* Translating is easier starting from a filled language than from nothing. */}
        {rows.length === 0 &&
          LOCALES.filter((option) => option !== tab && (container[option] ?? []).length > 0).map(
            (option) => (
              <button
                key={option}
                type="button"
                onClick={() => copyFrom(option)}
                className="rounded-md border border-dashed border-slate-300 px-2 py-1 text-xs text-slate-500 transition hover:border-primary-400 hover:text-primary-600"
              >
                {locale === 'ar'
                  ? `نسخ من ${localeName[option]}`
                  : locale === 'tr'
                    ? `${localeName[option]} kopyala`
                    : `Copy from ${localeName[option]}`}
              </button>
            ),
          )}
      </div>

      <RepeaterInput
        field={{
          path: '',
          label: { ar: '', tr: '', en: '' },
          type: 'repeater',
          itemFields,
          itemTitleField,
        }}
        dir={contentDir[tab]}
        value={rows}
        onChange={(next) => onChange({ ...container, [tab]: next })}
      />
    </div>
  );
}

/** Accepts a locale-keyed container, a bare array, or nothing. */
function normalize(value: unknown): Partial<Record<Locale, unknown[]>> {
  if (Array.isArray(value)) {
    // Legacy rows stored one array whose leaf strings were localized; surface it
    // under Arabic so it can be edited rather than silently replaced.
    return { ar: value };
  }
  if (value && typeof value === 'object') {
    const source = value as Record<string, unknown>;
    const out: Partial<Record<Locale, unknown[]>> = {};
    for (const option of LOCALES) {
      if (Array.isArray(source[option])) out[option] = source[option] as unknown[];
    }
    return out;
  }
  return {};
}
