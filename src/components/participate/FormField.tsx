import { Upload } from 'lucide-react';
import { normalizeFieldType, type ParticipateFormField } from '@/data/participate';

type FormFieldProps = {
  field: ParticipateFormField;
  value: string;
  files: File[];
  error?: string;
  selectedFilesLabel: string;
  onChange: (fieldId: string, value: string) => void;
  onFileChange: (fieldId: string, files: File[]) => void;
};

const inputClass =
  'min-h-12 w-full rounded-2xl border border-primary-100 bg-white px-4 py-3 text-start text-sm font-medium text-dark-900 shadow-sm outline-none transition-colors placeholder:text-dark-400 focus:border-primary-400 focus:ring-4 focus:ring-primary-100';

export default function FormField({
  field,
  value,
  files,
  error,
  selectedFilesLabel,
  onChange,
  onFileChange,
}: FormFieldProps) {
  const errorId = `${field.id}-error`;
  const describedBy = error ? errorId : undefined;
  const type = normalizeFieldType(field.type);
  // Only the values <input inputmode> understands; anything else falls back to the browser default.
  const inputMode =
    field.inputMode === 'text' || field.inputMode === 'email' || field.inputMode === 'tel' || field.inputMode === 'numeric'
      ? field.inputMode
      : undefined;

  return (
    <div className="text-start">
      {type !== 'file' && (
        <label htmlFor={field.id} className="mb-2 block text-sm font-bold text-dark-800">
          {field.label}
        </label>
      )}

      {type === 'textarea' ? (
        <textarea
          id={field.id}
          name={field.id}
          value={value}
          rows={field.rows ?? 5}
          required={field.required}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          placeholder={field.placeholder}
          onChange={(event) => onChange(field.id, event.target.value)}
          className={`${inputClass} resize-y leading-relaxed`}
        />
      ) : type === 'select' ? (
        <select
          id={field.id}
          name={field.id}
          value={value}
          required={field.required}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          onChange={(event) => onChange(field.id, event.target.value)}
          className={`${inputClass} appearance-none`}
        >
          {(field.options ?? []).map((option, index) => (
            <option key={`${field.id}-${index}-${option}`} value={index === 0 ? '' : option}>
              {option}
            </option>
          ))}
        </select>
      ) : type === 'file' ? (
        <div>
          <label
            htmlFor={field.id}
            className="flex min-h-12 cursor-pointer items-center justify-between gap-3 rounded-2xl border border-dashed border-primary-200 bg-primary-50/55 px-4 py-3 text-sm font-bold text-primary-700 transition-colors hover:border-primary-400 hover:bg-primary-50"
          >
            <span>{field.label}</span>
            <Upload className="h-5 w-5 shrink-0" aria-hidden="true" />
          </label>
          <input
            id={field.id}
            name={field.id}
            type="file"
            accept={field.accept || undefined}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
            onChange={(event) => onFileChange(field.id, Array.from(event.target.files ?? []))}
            className="sr-only"
          />
          {files.length > 0 && (
            <div className="mt-2 rounded-2xl bg-white px-4 py-3 text-xs font-semibold text-dark-600">
              <span className="text-primary-700">{selectedFilesLabel}: </span>
              {files.map((file) => file.name).join(', ')}
            </div>
          )}
        </div>
      ) : (
        <input
          id={field.id}
          name={field.id}
          type={type}
          value={value}
          required={field.required}
          inputMode={inputMode}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          placeholder={field.placeholder}
          onChange={(event) => onChange(field.id, event.target.value)}
          className={inputClass}
        />
      )}

      {error && (
        <p id={errorId} className="mt-2 text-xs font-semibold text-primary-700">
          {error}
        </p>
      )}
    </div>
  );
}
