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
function looksLocaleKeyed(value: Record<string, unknown>): boolean {
  const keys = Object.keys(value);
  if (keys.length === 0 || keys.length > LOCALES.length) return false;
  if (!keys.every((key) => LOCALE_KEYS.has(key))) return false;
  return keys.some((key) => value[key] !== null && value[key] !== undefined);
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

/** `deepLocalize` for array fields, falling back when the CMS value is empty. */
export function localizedArray<T>(value: unknown, locale: Locale, fallback: T[]): T[] {
  if (value === null || value === undefined) return fallback;
  const result = deepLocalize<unknown>(value, locale);
  return Array.isArray(result) && result.length ? (result as T[]) : fallback;
}

/** `deepLocalize` for object fields, falling back when the CMS value is empty. */
export function localizedObject<T>(value: unknown, locale: Locale, fallback: T): T {
  if (value === null || value === undefined) return fallback;
  const result = deepLocalize<unknown>(value, locale);
  if (!isPlainObject(result) || Object.keys(result).length === 0) return fallback;
  return result as T;
}
