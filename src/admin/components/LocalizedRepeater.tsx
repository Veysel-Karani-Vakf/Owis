import { LOCALES, type Locale } from '@/lib/types';
import type { PageFieldDef } from '../lib/pageSchema';
import { hasLocalizedLeaves, splitItemsByLocale } from '../lib/localizedShapes';
import { RepeaterInput, contentDir } from './PageFields';
import { CopyFromButtons, useFieldLocale } from './FieldControls';
import { LocaleSwitch } from './EditingLocale';

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
  const [tab, setTab] = useFieldLocale();

  const container = normalize(value);
  const rows = container[tab] ?? [];
  const has = (option: Locale) => (container[option] ?? []).length > 0;
  const counts = Object.fromEntries(LOCALES.map((l) => [l, has(l)])) as Record<Locale, boolean>;

  const copyFrom = (source: Locale) => {
    const items = container[source] ?? [];
    onChange({ ...container, [tab]: JSON.parse(JSON.stringify(items)) });
  };

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center gap-1">
        <LocaleSwitch value={tab} onChange={setTab} counts={counts} />
        <span className="text-xs text-slate-400">{rows.length}</span>
        <span className="flex-1" />
        {/* Translating is easier starting from a filled language than from nothing. */}
        <CopyFromButtons current={tab} hasContent={has} onCopy={copyFrom} />
      </div>

      <RepeaterInput
        key={tab}
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
    // Older rows stored one array whose leaf strings were localized
    // ([{ label: { ar, tr, en } }]): split it into one list per language so
    // every language can be edited; the first save writes the split shape.
    if (value.some(hasLocalizedLeaves)) return splitItemsByLocale(value);
    // A bare array of plain values belongs to the site's first language.
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
