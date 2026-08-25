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
