// Collapses stored jsonb into a single locale's view.

import { LOCALES, type Locale } from '@/lib/types';
import { isPlainObject } from './merge';

const LOCALE_KEYS = new Set<string>(LOCALES);

/**
 * True for locale-keyed containers — `{ ar: … }`, `{ ar: …, en: … }`, … — no
 * matter whether the values are strings, arrays, or nested objects.
 *
 * Only translation maps have a key set drawn entirely from the locale codes, so
 * this is safe to apply anywhere in the tree.
 */
export function looksLocaleKeyed(value: Record<string, unknown>): boolean {
  const keys = Object.keys(value);
  if (keys.length === 0 || keys.length > LOCALES.length) return false;
  // A map whose every value is null ({ ar: null, tr: null }) is still a
  // translation map — one with nothing in it — and must collapse to null
  // rather than be handed to the site as an object.
  return keys.every((key) => LOCALE_KEYS.has(key));
}

function isEmptyValue(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

/** Reads a locale-keyed container, falling back across the other locales. */
function pickLocale(value: Record<string, unknown>, locale: Locale): unknown {
  const direct = value[locale];
  if (!isEmptyValue(direct)) return direct;
  for (const alt of LOCALES) {
    const candidate = value[alt];
    if (!isEmptyValue(candidate)) return candidate;
  }
  return direct ?? null;
}

/**
 * Walks arbitrary stored JSON and replaces every locale-keyed node with the
 * value for `locale`.
 *
 * The dashboard stores repeating groups either as one locale-keyed container
 * (`{ ar: [...], en: [...] }`) or as a single array whose leaf strings are
 * localized (`[{ label: { ar: "…" } }]`). Both shapes are in use, so both are
 * handled here rather than at each call site.
 */
export function deepLocalize<T = unknown>(value: unknown, locale: Locale): T {
  if (Array.isArray(value)) {
    return value.map((item) => deepLocalize(item, locale)) as unknown as T;
  }

  if (isPlainObject(value)) {
    if (looksLocaleKeyed(value)) {
      return deepLocalize(pickLocale(value, locale), locale);
    }
    const out: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value)) {
      out[key] = deepLocalize(item, locale);
    }
    return out as T;
  }

  return value as T;
}

/**
 * `deepLocalize` for array fields.
 *
 * `null`/`undefined` means the column was never set, so the static default
 * applies. A stored list — even an emptied one — is what the editor wants
 * shown; the per-locale fallback inside `pickLocale` already borrows another
 * language's list when this one has no entries.
 */
export function localizedArray<T>(value: unknown, locale: Locale, fallback: T[]): T[] {
  if (value === null || value === undefined) return fallback;
  const result = deepLocalize<unknown>(value, locale);
  if (Array.isArray(result)) return result as T[];
  return fallback;
}

/** `deepLocalize` for object fields, falling back when the CMS value is empty. */
export function localizedObject<T>(value: unknown, locale: Locale, fallback: T): T {
  if (value === null || value === undefined) return fallback;
  const result = deepLocalize<unknown>(value, locale);
  if (!isPlainObject(result) || Object.keys(result).length === 0) return fallback;
  return result as T;
}

/**
 * Selects one language of a locale-first page row without borrowing a whole
 * other language when this one was never saved: a page that only has Arabic
 * edits must still show the site's own Turkish and English copy.
 */
export function pageForLocale(page: Record<string, unknown>, locale: Locale): unknown {
  if (looksLocaleKeyed(page)) {
    const own = page[locale];
    return isPlainObject(own) || Array.isArray(own) ? deepLocalize(own, locale) : null;
  }
  // Older rows were stored section-first with localized leaves.
  return deepLocalize(page, locale);
}
