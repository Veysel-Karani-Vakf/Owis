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

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      {fields.map((field) => {
        const full =
          field.full ||
          ['textarea', 'localizedTextarea', 'localizedParagraphs', 'json', 'stringList', 'image', 'file'].includes(
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
