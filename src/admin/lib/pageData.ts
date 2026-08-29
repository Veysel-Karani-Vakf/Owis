// Normalises stored `site_pages.data` to the locale-first shape the editor writes.
//
// An earlier seed stored some pages section-first — `{ hero: { ar, tr, en } }`
// rather than `{ ar: { hero } }`. The site reads both, but the editor saves one
// locale at a time and would otherwise append an `ar` key beside the sections,
// producing a row neither shape can read. Transposing on load keeps existing
// translations intact.

import { deepLocalize, looksLocaleKeyed } from '@/cms/localize';
import { LOCALES, type Locale } from '@/lib/types';

type PageData = Record<string, unknown>;

function isPlainObject(value: unknown): value is PageData {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isLocaleKeyed(value: unknown): value is PageData {
  if (!isPlainObject(value)) return false;
  const keys = Object.keys(value);
  return keys.length > 0 && keys.every((key) => (LOCALES as string[]).includes(key));
}

/** True when a translation map sits anywhere inside `value`. */
function hasLocaleMap(value: unknown): boolean {
  if (Array.isArray(value)) return value.some(hasLocaleMap);
  if (!isPlainObject(value)) return false;
  if (looksLocaleKeyed(value)) return true;
  return Object.values(value).some(hasLocaleMap);
}

export function normalizePageData(data: unknown): PageData {
  if (!isPlainObject(data)) return {};
  if (isLocaleKeyed(data)) return data;

  const out: PageData = {};
  for (const locale of LOCALES) {
    const scoped: PageData = {};
    for (const [section, value] of Object.entries(data)) {
      if (isLocaleKeyed(value)) {
        // A section already split by language contributes only its own copy.
        if (value[locale as Locale] !== undefined) scoped[section] = value[locale as Locale];
      } else if (hasLocaleMap(value)) {
        // A shared section whose leaves are translation maps: every language
        // gets its own collapsed copy, exactly what the site shows for it.
        scoped[section] = deepLocalize(value, locale);
      } else if (locale === 'ar') {
        // Plain text that was never split was written in the site's first
        // language; the other languages keep their own static copy.
        scoped[section] = value;
      }
    }
    out[locale] = scoped;
  }
  return out;
}
