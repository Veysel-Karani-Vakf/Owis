import { useState } from 'react';
import { ChevronDown, ChevronRight, Settings2 } from 'lucide-react';
import { useI18n } from '@/i18n/useI18n';
import type { FieldDef } from '../lib/fields';
import {
  ImageInput,
  JsonInput,
  LocalizedInput,
  LocalizedParagraphsInput,
  StringListInput,
  scalarInputClass,
} from './FieldControls';
import { LocalizedRepeaterInput } from './LocalizedRepeater';
import { VideoInput } from './VideoInput';
import { LocalizedGroupInput } from './LocalizedGroup';
import { SlugInput } from './SlugInput';

type Values = Record<string, unknown>;

export function FormEngine({
  fields,
  values,
  onChange,
}: {
  fields: FieldDef[];
  values: Values;
  onChange: (key: string, value: unknown) => void;
}) {
  const { locale } = useI18n();
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const main = fields.filter((field) => !field.advanced);
  const advanced = fields.filter((field) => field.advanced);

  const label = (ar: string, tr: string, en: string) =>
    locale === 'ar' ? ar : locale === 'tr' ? tr : en;

  return (
    <div className="space-y-6">
      <FieldGrid fields={main} values={values} onChange={onChange} />

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
              <FieldGrid fields={advanced} values={values} onChange={onChange} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function FieldGrid({
  fields,
  values,
  onChange,
}: {
  fields: FieldDef[];
  values: Values;
  onChange: (key: string, value: unknown) => void;
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
            'video',
            'slug',
            'json',
            'stringList',
            'image',
            'file',
          ].includes(
            field.type,
          );
        const value = values[field.key];
        return (
          <div key={field.key} className={full ? 'md:col-span-2' : ''}>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              {field.label[locale]}
              {field.required && <span className="ms-1 text-red-500">*</span>}
            </label>
            <FieldControl field={field} value={value} onChange={(v) => onChange(field.key, v)} />
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
}: {
  field: FieldDef;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const { locale } = useI18n();

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
    case 'stringList':
      return <StringListInput value={(value as string[]) || []} onChange={onChange} />;
    case 'image':
      return <ImageInput value={(value as string) || ''} onChange={onChange} />;
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
    case 'number':
      return (
        <input
          type="number"
          className={scalarInputClass}
          dir="ltr"
          value={value === null || value === undefined ? '' : String(value)}
          onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
        />
      );
    case 'select':
      return (
        <select
          className={scalarInputClass}
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">—</option>
          {field.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label[locale]}
            </option>
          ))}
        </select>
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
    case 'datetime':
      return (
        <input
          type={field.type === 'date' ? 'date' : 'datetime-local'}
          className={scalarInputClass}
          dir="ltr"
          value={toInputDate(value, field.type)}
          onChange={(e) => onChange(e.target.value || null)}
        />
      );
    default:
      return (
        <input
          type={field.type === 'url' ? 'url' : 'text'}
          className={scalarInputClass}
          dir={field.type === 'url' ? 'ltr' : undefined}
          placeholder={field.placeholder}
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
        />
      );
  }
}

function toInputDate(value: unknown, type: 'date' | 'datetime'): string {
  if (!value || typeof value !== 'string') return '';
  if (type === 'date') return value.slice(0, 10);
  // datetime-local expects yyyy-MM-ddThh:mm
  return value.slice(0, 16);
}
