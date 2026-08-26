// Merge helpers shared by the CMS runtime layer.
//
// The site keeps its full static content in `src/data/*` as the source of
// truth-of-last-resort. CMS rows are layered *over* those defaults so the site
// still renders correctly when Supabase is empty, unreachable, or only
// partially translated.

import { LOCALES, type Locale, type Localized, type LocalizedList } from '@/lib/types';

export function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Deep-merges `override` onto `base`.
 *
 * `null`/`undefined` means "not set — keep the default". Everything else the
 * dashboard stores is deliberate, including an empty string or an emptied list,
 * so those replace the default rather than falling back to it. A list is edited
 * as a single unit, so arrays replace wholesale instead of merging item by item.
 */
export function deepMerge<T>(base: T, override: unknown): T {
  if (override === undefined || override === null) return base;

  if (Array.isArray(override)) return override as unknown as T;

  if (isPlainObject(override)) {
    // A page whose content *is* a list (the About menu, say) stores `{}` for a
    // locale that was never filled in; that must not replace the real list.
    if (Array.isArray(base)) return base;
    if (!isPlainObject(base)) return override as unknown as T;

    const out: Record<string, unknown> = { ...base };
    for (const [key, value] of Object.entries(override)) {
      out[key] = deepMerge((base as Record<string, unknown>)[key], value);
    }
    return out as unknown as T;
  }

  return override as T;
}

/** Picks a localized string, falling back across locales before giving up. */
export function loc(value: Localized | undefined | null, locale: Locale, fallback = ''): string {
  if (!value || typeof value !== 'object') {
    return typeof value === 'string' && value ? value : fallback;
  }
  const direct = value[locale];
  if (direct && direct.trim()) return direct;
  for (const alt of LOCALES) {
    const candidate = value[alt];
    if (candidate && candidate.trim()) return candidate;
  }
  return fallback;
}

/** Picks a localized paragraph list, falling back across locales. */
export function locList(
  value: LocalizedList | undefined | null,
  locale: Locale,
  fallback: string[] = [],
): string[] {
  if (!value || typeof value !== 'object') return fallback;
  const direct = value[locale];
  if (Array.isArray(direct) && direct.length) return direct;
  for (const alt of LOCALES) {
    const candidate = value[alt];
    if (Array.isArray(candidate) && candidate.length) return candidate;
  }
  return fallback;
}

/** True when a localized value carries no usable text in any locale. */
export function isBlankLocalized(value: Localized | undefined | null): boolean {
  return loc(value, 'ar', '') === '';
}

/**
 * Localized text for a record column, honouring an editor's decision to blank
 * a field.
 *
 * - No stored map, or a map with no keys → the column was never touched: use
 *   the static default.
 * - A map with text in this locale → that text; else text from another locale.
 * - A map whose languages were all emptied → '' (the editor cleared it), never
 *   the static default, so what the dashboard shows is what the site shows.
 */
export function locText(value: unknown, locale: Locale, fallback = ''): string {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'string') return value;
  if (!isPlainObject(value) || Object.keys(value).length === 0) return fallback;
  const map = value as Localized;
  const direct = map[locale];
  if (typeof direct === 'string' && direct.trim()) return direct;
  for (const alt of LOCALES) {
    const candidate = map[alt];
    if (typeof candidate === 'string' && candidate.trim()) return candidate;
  }
  return '';
}

/**
 * Scalar column with the same rule: `null`/`undefined` = not set (default),
 * anything else — including '' — is what the editor stored.
 */
export function scalar<T>(value: T | null | undefined, fallback: T): T {
  return value === null || value === undefined ? fallback : value;
}
