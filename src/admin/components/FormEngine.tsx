import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, Link2, Settings2 } from 'lucide-react';
import { useI18n } from '@/i18n/useI18n';
import type { FieldDef } from '../lib/fields';
import type { PageFieldDef } from '../lib/pageSchema';
import {
  ImageInput,
  JsonInput,
  LocalizedInput,
  LocalizedParagraphsInput,
  SelectControl,
  StringListInput,
  scalarInputClass,
} from './FieldControls';
import { LocalizedRepeaterInput } from './LocalizedRepeater';
import { VideoInput } from './VideoInput';
import { LocalizedGroupInput } from './LocalizedGroup';
import { SlugInput } from './SlugInput';
import {
  FieldNatureChip,
  PageFieldControl,
  RepeaterInput,
  contentDir,
  isIntegerKey,
  normalizePlainRepeater,
  type FieldNature,
} from './PageFields';
import { IconPicker } from './IconPicker';
import { useEditingLocale } from './EditingLocale';
import { getAtPath, setAtPath } from '../lib/paths';
import { isLocaleMap } from '../lib/localizedShapes';

type Values = Record<string, unknown>;
type Errors = Record<string, string>;

const RECORD_LINK_KEY = /(url|href|link)/i;

/**
 * What a record field holds, mirroring the page editor's classification:
 * writable content reads prominent, links and settings read quiet and tagged.
 * The slug stays "content" — it is required when creating and has its own UI.
 */
function recordFieldNature(field: FieldDef): FieldNature {
  if (field.type === 'image' || field.type === 'file' || field.type === 'video') return 'media';
  if (field.type === 'url') return 'link';
  if (['select', 'number', 'boolean', 'icon', 'date', 'datetime', 'json'].includes(field.type)) {
    return 'setting';
  }
  if (field.type === 'text' && RECORD_LINK_KEY.test(field.key)) return 'link';
  return 'content';
}

export function FormEngine({
  fields,
  values,
  onChange,
  errors,
}: {
  fields: FieldDef[];
  values: Values;
  onChange: (key: string, value: unknown) => void;
  /** Validation messages keyed by field key; the field is outlined in red. */
  errors?: Errors;
}) {
  const { locale } = useI18n();
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const main = fields.filter((field) => !field.advanced);
  const advanced = fields.filter((field) => field.advanced);

  // An error hidden inside the collapsed block would be invisible.
  const advancedHasError = advanced.some((field) => errors?.[field.key]);
  useEffect(() => {
    if (advancedHasError) setAdvancedOpen(true);
  }, [advancedHasError]);

  const label = (ar: string, tr: string, en: string) =>
    locale === 'ar' ? ar : locale === 'tr' ? tr : en;

  return (
    <div className="space-y-6">
      <FieldGrid fields={main} values={values} onChange={onChange} errors={errors} />

      {/* Source links, ordering and image dimensions are real data but not
          something an editor needs in front of them to write a record. */}
      {advanced.length > 0 && (
        <div className="rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => setAdvancedOpen((current) => !current)}
            className="flex w-full items-center gap-2 px-4 py-3 text-start text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            <Settings2 size={16} />
            {label('إعدادات متقدمة', 'Gelişmiş ayarlar', 'Advanced settings')}
            <span className="text-xs text-slate-400">({advanced.length})</span>
            {advancedOpen ? (
              <ChevronDown size={16} className="ms-auto" />
            ) : (
              <ChevronRight size={16} className="ms-auto rtl:rotate-180" />
            )}
          </button>
          {advancedOpen && (
            <div className="border-t border-slate-100 p-4">
              <FieldGrid fields={advanced} values={values} onChange={onChange} errors={errors} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function FieldGrid({
  fields,
  values,
  onChange,
  errors,
}: {
  fields: FieldDef[];
  values: Values;
  onChange: (key: string, value: unknown) => void;
  errors?: Errors;
}) {
  const { locale } = useI18n();

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      {fields.map((field) => {
        const full =
          field.full ||
          [
            'textarea',
            'localizedTextarea',
            'localizedParagraphs',
            'localizedRepeater',
            'localizedGroup',
            'repeater',
            'group',
            'video',
            'slug',
            'json',
            'stringList',
            'image',
            'file',
          ].includes(field.type);
        const value = values[field.key];
        const error = errors?.[field.key];
        const nature = recordFieldNature(field);
        const quiet = nature === 'link' || nature === 'setting';
        return (
          <div key={field.key} data-field-key={field.key} className={full ? 'md:col-span-2' : ''}>
            <label className="mb-1.5 block">
              <span
                className={
                  'flex items-center gap-1.5 ' +
                  (quiet
                    ? 'text-[13px] font-medium text-slate-500'
                    : 'text-sm font-semibold text-slate-800')
                }
              >
                <span className="min-w-0 truncate">{field.label[locale]}</span>
                {field.required && <span className="text-red-500">*</span>}
                <FieldNatureChip nature={nature} />
              </span>
            </label>
            <div className={error ? 'rounded-lg ring-2 ring-red-300 ring-offset-1' : ''}>
              <FieldControl
                field={field}
                value={value}
                onChange={(v) => onChange(field.key, v)}
                onSibling={onChange}
              />
            </div>
            {error && (
              <p role="alert" className="mt-1 text-xs font-medium text-red-600">
                {error}
              </p>
            )}
            {field.help && <p className="mt-1 text-xs text-slate-400">{field.help[locale]}</p>}
          </div>
        );
      })}
    </div>
  );
}

function FieldControl({
  field,
  value,
  onChange,
  onSibling,
}: {
  field: FieldDef;
  value: unknown;
  onChange: (v: unknown) => void;
  /** Lets one control fill other columns (image → width/height). */
  onSibling: (key: string, value: unknown) => void;
}) {
  const onDimensions = field.dimensionsFor
    ? (width: number, height: number) => {
        onSibling(field.dimensionsFor!.width, width);
        onSibling(field.dimensionsFor!.height, height);
      }
    : undefined;

  switch (field.type) {
    case 'localized':
      return <LocalizedInput value={(value as never) || {}} onChange={onChange} />;
    case 'localizedTextarea':
      return <LocalizedInput value={(value as never) || {}} onChange={onChange} multiline />;
    case 'localizedParagraphs':
      return <LocalizedParagraphsInput value={(value as never) || {}} onChange={onChange} />;
    case 'video':
      return <VideoInput value={value} onChange={onChange} />;
    case 'slug':
      return (
        <SlugInput
          value={(value as string) ?? ''}
          onChange={onChange}
          prefix={field.slugPrefix}
        />
      );
    case 'localizedGroup':
      return <LocalizedGroupInput value={value} onChange={onChange} fields={field.itemFields ?? []} />;
    case 'localizedRepeater':
      return (
        <LocalizedRepeaterInput
          value={value}
          onChange={onChange}
          itemFields={field.itemFields ?? []}
          itemTitleField={field.itemTitleField}
        />
      );
    case 'repeater':
      return <PlainRepeater field={field} value={value} onChange={onChange} />;
    case 'group':
      return <PlainGroup field={field} value={value} onChange={onChange} />;
    case 'icon':
      return <IconPicker value={value} onChange={onChange} />;
    case 'stringList':
      return <StringListInput value={(value as string[]) || []} onChange={onChange} />;
    case 'image':
      return <ImageInput value={(value as string) || ''} onChange={onChange} onDimensions={onDimensions} />;
    case 'file':
      return (
        <ImageInput value={(value as string) || ''} onChange={onChange} accept={field.accept || 'application/pdf'} />
      );
    case 'json':
      return <JsonInput value={value} onChange={onChange} />;
    case 'boolean':
      return (
        <label className="inline-flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-400"
            checked={Boolean(value)}
            onChange={(e) => onChange(e.target.checked)}
          />
          <span className="text-sm text-slate-600">{field.placeholder ?? ''}</span>
        </label>
      );
    case 'number': {
      const integer = isIntegerKey(field.key);
      return (
        <input
          type="number"
          className={scalarInputClass}
          dir="ltr"
          inputMode={integer ? 'numeric' : 'decimal'}
          step={integer ? 1 : undefined}
          value={value === null || value === undefined ? '' : String(value)}
          onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
        />
      );
    }
    case 'select':
      return (
        <SelectControl
          value={value}
          onChange={onChange}
          options={field.options ?? []}
          required={field.required}
        />
      );
    case 'textarea':
      return (
        <textarea
          className={scalarInputClass + ' min-h-[90px] resize-y'}
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case 'date':
    case 'datetime': {
      const kind = field.type;
      return (
        <input
          type={kind === 'date' ? 'date' : 'datetime-local'}
          className={scalarInputClass}
          dir="ltr"
          value={toInputDate(value, kind)}
          onChange={(e) => onChange(fromInputDate(e.target.value, kind))}
        />
      );
    }
    default: {
      // Addresses render Latin, monospaced and tinted — "an exact value",
      // visibly different from prose the editor is meant to rewrite.
      if (recordFieldNature(field) === 'link') {
        return (
          <div className="relative">
            <Link2 size={14} className="pointer-events-none absolute inset-y-0 my-auto ms-2.5 text-slate-400" />
            <input
              type={field.type === 'url' ? 'url' : 'text'}
              dir="ltr"
              placeholder={field.placeholder ?? 'https://…'}
              className={scalarInputClass + ' bg-slate-50 ps-8 text-left font-mono text-[13px] text-slate-700 focus:bg-white'}
              value={(value as string) ?? ''}
              onChange={(e) => onChange(e.target.value)}
            />
          </div>
        );
      }
      return (
        <input
          type="text"
          className={scalarInputClass}
          placeholder={field.placeholder}
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    }
  }
}

/** One list shared by all languages (e.g. a news gallery). */
function PlainRepeater({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const { locale } = useEditingLocale();
  const itemFields = useMemo(() => field.itemFields ?? [], [field.itemFields]);
  // Legacy locale-keyed rows are folded once; the first edit writes back a plain array.
  const items = useMemo(() => normalizePlainRepeater(value, itemFields), [value, itemFields]);
  return (
    <RepeaterInput
      field={{
        path: '',
        label: field.label,
        type: 'repeater',
        itemFields,
        itemTitleField: field.itemTitleField,
      }}
      dir={contentDir[locale]}
      value={items}
      onChange={onChange}
    />
  );
}

/**
 * One object shared by all languages (a project's video: one YouTube link,
 * per-language title and button). Sub-fields typed 'localized' get their own
 * language tabs; everything else is stored once.
 */
function PlainGroup({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const { locale: uiLocale } = useI18n();
  const { locale } = useEditingLocale();
  const fields = useMemo(() => field.itemFields ?? [], [field.itemFields]);
  const object = useMemo(() => normalizePlainGroup(value, fields), [value, fields]);

  return (
    <div className="grid grid-cols-1 gap-4 rounded-xl border border-slate-200 bg-slate-50/60 p-3 md:grid-cols-2">
      {fields.map((sub) => {
        const wide =
          sub.full ||
          ['textarea', 'paragraphs', 'list', 'repeater', 'image', 'video', 'localizedTextarea'].includes(sub.type);
        return (
          <div key={sub.path || sub.type} className={wide ? 'md:col-span-2' : ''}>
            <label className="mb-1 block text-xs font-medium text-slate-600">{sub.label[uiLocale]}</label>
            <PageFieldControl
              field={sub}
              dir={contentDir[locale]}
              value={getAtPath(object, sub.path)}
              onChange={(next) => onChange(setAtPath(object, sub.path, next))}
            />
            {sub.help && <p className="mt-1 text-xs text-slate-400">{sub.help[uiLocale]}</p>}
          </div>
        );
      })}
    </div>
  );
}

/**
 * A group may have been stored locale-first ({ ar: { title, videoId } }) by an
 * earlier version of the form. Fold it back into one object: the sub-fields
 * declared as localized become translation maps, everything else is taken
 * from the first language that has a value.
 */
function normalizePlainGroup(value: unknown, fields: PageFieldDef[]): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const source = value as Record<string, unknown>;
  if (!isLocaleMap(source)) return source;

  const localizedKeys = new Set(
    fields.filter((f) => f.type === 'localized' || f.type === 'localizedTextarea').map((f) => f.path),
  );
  const out: Record<string, unknown> = {};
  for (const [locale, entry] of Object.entries(source)) {
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) continue;
    for (const [key, leaf] of Object.entries(entry as Record<string, unknown>)) {
      if (localizedKeys.has(key)) {
        const map = (out[key] && typeof out[key] === 'object' ? out[key] : {}) as Record<string, unknown>;
        map[locale] = leaf ?? '';
        out[key] = map;
      } else if (out[key] === undefined || out[key] === '' || out[key] === null) {
        out[key] = leaf;
      }
    }
  }
  return out;
}

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Timestamps are stored in UTC; the picker shows and takes local wall-clock
 * time so 23:30 in Istanbul does not become "yesterday".
 */
function toInputDate(value: unknown, type: 'date' | 'datetime'): string {
  if (!value || typeof value !== 'string') return '';
  // Plain dates have no zone; slicing keeps the calendar day intact.
  if (type === 'date') return value.slice(0, 10);
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value.slice(0, 16);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function fromInputDate(raw: string, type: 'date' | 'datetime'): string | null {
  if (!raw) return null;
  if (type === 'date') return raw;
  const date = new Date(raw); // no zone suffix → parsed as local time
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}
