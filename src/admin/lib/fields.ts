import type { Locale } from '@/lib/types';
import type { PageFieldDef } from './pageSchema';

export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'boolean'
  | 'url'
  | 'date'
  | 'datetime'
  | 'select'
  | 'localized'
  | 'localizedTextarea'
  | 'localizedParagraphs'
  | 'image'
  | 'file'
  | 'stringList'
  | 'localizedRepeater'
  | 'localizedGroup'
  /** One list shared by all languages; item fields may themselves be localized. */
  | 'repeater'
  /** One object shared by all languages; sub-fields may themselves be localized. */
  | 'group'
  | 'video'
  | 'slug'
  | 'icon'
  | 'json';

export type SelectOption = { value: string; label: Record<Locale, string> };

export type FieldDef = {
  key: string;
  label: Record<Locale, string>;
  type: FieldType;
  required?: boolean;
  help?: Record<Locale, string>;
  options?: SelectOption[];
  accept?: string;
  /** grid width; defaults to 1 (half) except textareas/json which default to full */
  full?: boolean;
  /** placeholder for scalar inputs */
  placeholder?: string;
  /** item shape for 'localizedRepeater' fields */
  itemFields?: PageFieldDef[];
  /** item field whose value titles a collapsed repeater row */
  itemTitleField?: string;
  /** route prefix shown beside a 'slug' field, e.g. '/news/' */
  slugPrefix?: string;
  /** keys to fill with an uploaded image's natural size */
  dimensionsFor?: { width: string; height: string };
  /** tucked into the collapsed "advanced" block instead of the main form */
  advanced?: boolean;
};

export type ResourceDef = {
  key: string;
  table: string;
  section: 'content' | 'library' | 'engagement' | 'site';
  labelKey: string;
  /** One line for editors: where on the site these records appear. */
  description?: Record<Locale, string>;
  titleField: string;
  fields: FieldDef[];
  defaultSort?: { column: string; ascending: boolean };
  /** optional column to filter the list by (e.g. library collection) */
  filter?: { column: string; options: SelectOption[] };
  /** default values for a freshly created record */
  newDefaults?: Record<string, unknown>;
  /** Public route of one record, for "open on site" links; `:slug` is replaced. */
  publicRoute?: string;
};

/** Returns the empty/default value for a field type (used when creating records). */
export function emptyValue(type: FieldType): unknown {
  switch (type) {
    case 'localized':
    case 'localizedTextarea':
      return {};
    case 'localizedParagraphs':
      return {};
    case 'stringList':
    case 'repeater':
      return [];
    case 'localizedRepeater':
    case 'localizedGroup':
    case 'group':
      return {};
    case 'boolean':
      return false;
    case 'number':
      return null;
    case 'json':
      return null;
    // Postgres rejects '' for timestamp columns; "not set" is null.
    case 'date':
    case 'datetime':
    case 'video':
      return null;
    default:
      return '';
  }
}

/**
 * Coerces a form value into what the column accepts.
 *
 * Typed columns (dates, numbers, constrained selects) get null for "blank",
 * because Postgres rejects '' there. Text columns keep '' — the adapters read
 * '' as "the editor cleared this" and null as "never set, use the default",
 * so a removed image must reach the database as '' and not as null.
 */
export function toColumnValue(type: FieldType, value: unknown): unknown {
  if (value === undefined) return emptyValue(type);
  switch (type) {
    case 'date':
    case 'datetime':
    case 'number':
    case 'select':
      return value === '' ? null : value;
    case 'url':
    case 'file':
    case 'image':
    case 'icon':
      return value ?? '';
    default:
      return value;
  }
}
