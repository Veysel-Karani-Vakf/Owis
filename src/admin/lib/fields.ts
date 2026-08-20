import type { Locale } from '@/lib/types';

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
};

export type ResourceDef = {
  key: string;
  table: string;
  section: 'content' | 'library' | 'engagement' | 'site';
  labelKey: string;
  titleField: string;
  fields: FieldDef[];
  defaultSort?: { column: string; ascending: boolean };
  /** optional column to filter the list by (e.g. library collection) */
  filter?: { column: string; options: SelectOption[] };
  /** default values for a freshly created record */
  newDefaults?: Record<string, unknown>;
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
      return [];
    case 'boolean':
      return false;
    case 'number':
      return null;
    case 'json':
      return null;
    default:
      return '';
  }
}
