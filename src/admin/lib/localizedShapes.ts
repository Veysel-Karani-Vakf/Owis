// Helpers for the two ways localized structures are stored in jsonb.
//
// The dashboard writes "locale-first" containers ({ ar: [...], tr: [...] } or
// { ar: {...}, tr: {...} }). Older seeds and importers wrote one structure whose
// leaf strings were localized ([{ label: { ar, tr, en } }] or
// { title: { ar, tr, en }, videoId }). The site's localizer reads both; these
// helpers let the editor open both without showing "[object Object]".

import { LOCALES, type Locale } from '@/lib/types';

type Rec = Record<string, unknown>;

function isPlainObject(value: unknown): value is Rec {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** `{ ar: "…", tr: "…" }` — a translation map (all keys are locale codes). */
export function isLocaleMap(value: unknown): value is Partial<Record<Locale, unknown>> {
  if (!isPlainObject(value)) return false;
  const keys = Object.keys(value);
  return keys.length > 0 && keys.every((key) => (LOCALES as string[]).includes(key));
}

/** True when at least one property of `item` is a translation map. */
export function hasLocalizedLeaves(item: unknown): boolean {
  return isPlainObject(item) && Object.values(item).some((value) => isLocaleMap(value));
}

/** One language's view of an item whose leaves are translation maps. */
export function pickLeaves(item: Rec, locale: Locale): Rec {
  const out: Rec = {};
  for (const [key, value] of Object.entries(item)) {
    if (isLocaleMap(value)) {
      const map = value as Partial<Record<Locale, unknown>>;
      out[key] = map[locale] ?? '';
    } else {
      out[key] = value;
    }
  }
  return out;
}

/** `[{ label: {ar,tr} }]` → `{ ar: [{ label }], tr: [{ label }], en: [{ label }] }`. */
export function splitItemsByLocale(items: unknown[]): Partial<Record<Locale, Rec[]>> {
  const out: Partial<Record<Locale, Rec[]>> = {};
  for (const locale of LOCALES) {
    out[locale] = items.map((item) => (isPlainObject(item) ? pickLeaves(item, locale) : { value: item }));
  }
  return out;
}

/** `{ title: {ar,tr}, videoId }` → `{ ar: { title, videoId }, tr: …, en: … }`. */
export function splitObjectByLocale(item: Rec): Partial<Record<Locale, Rec>> {
  const out: Partial<Record<Locale, Rec>> = {};
  for (const locale of LOCALES) out[locale] = pickLeaves(item, locale);
  return out;
}
