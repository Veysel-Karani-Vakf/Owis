import { useState } from 'react';
import { LOCALES, type Locale } from '@/lib/types';
import { useI18n } from '@/i18n/useI18n';
import type { PageFieldDef } from '../lib/pageSchema';
import { getAtPath, setAtPath } from '../lib/paths';
import { PageFieldControl, contentDir } from './PageFields';

const localeName: Record<Locale, string> = { ar: 'العربية', tr: 'Türkçe', en: 'English' };

/**
 * A single object stored once per language:
 *   { ar: { title, description }, tr: { … }, en: { … } }
 *
 * Used for the small grouped values — a programme's SEO block, its call to
 * action, its phase — that were previously edited as raw JSON.
 */
export function LocalizedGroupInput({
  value,
  onChange,
  fields,
}: {
  value: unknown;
  onChange: (value: unknown) => void;
  fields: PageFieldDef[];
}) {
  const { locale } = useI18n();
  const [tab, setTab] = useState<Locale>(locale);

  const container = normalize(value);
  const scoped = (container[tab] ?? {}) as Record<string, unknown>;

  const filled = (option: Locale) =>
    Object.values((container[option] ?? {}) as Record<string, unknown>).some(
      (entry) => typeof entry === 'string' && entry.trim() !== '',
    );

  const copyFrom = (source: Locale) =>
    onChange({ ...container, [tab]: JSON.parse(JSON.stringify(container[source] ?? {})) });

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
          </button>
        ))}

        <span className="flex-1" />

        {!filled(tab) &&
          LOCALES.filter((option) => option !== tab && filled(option)).map((option) => (
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
          ))}
      </div>

      <div className="grid grid-cols-1 gap-4 rounded-xl border border-slate-200 bg-slate-50/60 p-3 md:grid-cols-2">
        {fields.map((field) => {
          const wide =
            field.full || ['textarea', 'paragraphs', 'list', 'repeater', 'image', 'video'].includes(field.type);
          return (
            <div key={field.path} className={wide ? 'md:col-span-2' : ''}>
              <label className="mb-1 block text-xs font-medium text-slate-600">{field.label[locale]}</label>
              <PageFieldControl
                field={field}
                dir={contentDir[tab]}
                value={getAtPath(scoped, field.path)}
                onChange={(next) =>
                  onChange({ ...container, [tab]: setAtPath(scoped, field.path, next) })
                }
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Accepts a locale-keyed container, a single shared object, or nothing. */
function normalize(value: unknown): Partial<Record<Locale, unknown>> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};

  const source = value as Record<string, unknown>;
  const keys = Object.keys(source);
  const localeKeyed = keys.length > 0 && keys.every((key) => (LOCALES as string[]).includes(key));
  if (localeKeyed) return source as Partial<Record<Locale, unknown>>;

  // Content seeded as one shared object: surface it under Arabic. The site's
  // localizer falls back across languages, so nothing is lost for tr/en.
  return { ar: source };
}
