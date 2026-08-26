import { LOCALES, type Locale } from '@/lib/types';
import { useI18n } from '@/i18n/useI18n';
import type { PageFieldDef } from '../lib/pageSchema';
import { getAtPath, setAtPath } from '../lib/paths';
import { hasLocalizedLeaves, splitObjectByLocale } from '../lib/localizedShapes';
import { PageFieldControl, contentDir } from './PageFields';
import { CopyFromButtons, useFieldLocale } from './FieldControls';
import { LocaleSwitch } from './EditingLocale';

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
  const [tab, setTab] = useFieldLocale();

  const container = normalize(value);
  const scoped = (container[tab] ?? {}) as Record<string, unknown>;

  const filled = (option: Locale) =>
    Object.values((container[option] ?? {}) as Record<string, unknown>).some(
      (entry) => typeof entry === 'string' && entry.trim() !== '',
    );
  const counts = Object.fromEntries(LOCALES.map((l) => [l, filled(l)])) as Record<Locale, boolean>;

  const copyFrom = (source: Locale) =>
    onChange({ ...container, [tab]: JSON.parse(JSON.stringify(container[source] ?? {})) });

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center gap-1">
        <LocaleSwitch value={tab} onChange={setTab} counts={counts} />
        <span className="flex-1" />
        <CopyFromButtons current={tab} hasContent={filled} onCopy={copyFrom} />
      </div>

      <div className="grid grid-cols-1 gap-4 rounded-xl border border-slate-200 bg-slate-50/60 p-3 md:grid-cols-2">
        {fields.map((field) => {
          const wide =
            field.full ||
            ['textarea', 'paragraphs', 'list', 'repeater', 'image', 'video', 'localizedTextarea'].includes(field.type);
          return (
            <div key={field.path || field.type} className={wide ? 'md:col-span-2' : ''}>
              <label className="mb-1 block text-xs font-medium text-slate-600">{field.label[locale]}</label>
              <PageFieldControl
                field={field}
                dir={contentDir[tab]}
                value={getAtPath(scoped, field.path)}
                onChange={(next) =>
                  onChange({ ...container, [tab]: setAtPath(scoped, field.path, next) })
                }
              />
              {field.help && <p className="mt-1 text-xs text-slate-400">{field.help[locale]}</p>}
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

  // One object whose leaves are translation maps ({ title: { ar, tr } }):
  // give each language its own copy so all of them can be edited.
  if (hasLocalizedLeaves(source)) return splitObjectByLocale(source);

  // Content seeded as one shared object: surface it under Arabic. The site's
  // localizer falls back across languages, so nothing is lost for tr/en.
  return { ar: source };
}
