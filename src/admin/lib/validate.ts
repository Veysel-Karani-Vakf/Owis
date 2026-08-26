import { LOCALES, type Locale } from '@/lib/types';
import type { FieldDef, ResourceDef } from './fields';

/** True when a localized map has text in at least one language. */
export function hasAnyLocale(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false;
  const map = value as Record<string, unknown>;
  return LOCALES.some((locale) => typeof map[locale] === 'string' && (map[locale] as string).trim() !== '');
}

/** Which languages of a localized map carry text — for the per-language dots. */
export function filledLocales(value: unknown): Locale[] {
  if (!value || typeof value !== 'object') return [];
  const map = value as Record<string, unknown>;
  return LOCALES.filter((locale) => typeof map[locale] === 'string' && (map[locale] as string).trim() !== '');
}

function isEmpty(field: FieldDef, value: unknown): boolean {
  switch (field.type) {
    case 'localized':
    case 'localizedTextarea':
      return !hasAnyLocale(value);
    case 'localizedParagraphs':
      return !value || typeof value !== 'object' || !LOCALES.some((l) => Array.isArray((value as Record<string, unknown>)[l]) && ((value as Record<string, unknown[]>)[l]).length > 0);
    case 'number':
      return value === null || value === undefined || value === '';
    case 'boolean':
      return false;
    case 'stringList':
    case 'repeater':
      return !Array.isArray(value) || value.length === 0;
    default:
      return value === null || value === undefined || String(value).trim() === '';
  }
}

const REQUIRED = { ar: 'هذا الحقل مطلوب', tr: 'Bu alan zorunludur', en: 'This field is required' };

/**
 * Required-field check run before a save. Returns a map of field key → message
 * so the form can highlight each empty field instead of letting the database
 * answer with a constraint error.
 */
export function validateRecord(
  resource: Pick<ResourceDef, 'fields'>,
  values: Record<string, unknown>,
  locale: Locale,
): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const field of resource.fields) {
    if (!field.required) continue;
    if (isEmpty(field, values[field.key])) errors[field.key] = REQUIRED[locale];
  }
  return errors;
}
