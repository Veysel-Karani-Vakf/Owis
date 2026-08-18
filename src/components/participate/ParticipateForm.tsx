import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, Send } from 'lucide-react';
import type { FormEvent } from 'react';
import { useMemo, useState } from 'react';
import FormField from '@/components/participate/FormField';
import type { ParticipateFormContent, ParticipateLabels } from '@/data/participate';
import {
  ParticipateFormError,
  submitParticipateForm,
  type ParticipateSubmissionField,
} from '@/services/participateForms';

type ParticipateFormProps = {
  form: ParticipateFormContent;
  sourceUrl: string;
  labels: ParticipateLabels;
  isRtl: boolean;
};

type FormStatus = {
  type: 'idle' | 'success' | 'error';
  message: string;
};

function cleanLabel(label: string) {
  return label.replace(/\*$/, '').trim();
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function ParticipateForm({ form, sourceUrl, labels, isRtl }: ParticipateFormProps) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(form.fields.map((field) => [field.id, '']))
  );
  const [files, setFiles] = useState<Record<string, File[]>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<FormStatus>({ type: 'idle', message: '' });
  const [stepIndex, setStepIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const NextIcon = isRtl ? ArrowLeft : ArrowRight;
  const PreviousIcon = isRtl ? ArrowRight : ArrowLeft;
  const currentGroup = form.groups[stepIndex] ?? form.groups[0];
  const isLastStep = stepIndex === form.groups.length - 1;

  const fieldsById = useMemo(() => {
    return new Map(form.fields.map((field) => [field.id, field]));
  }, [form.fields]);

  const currentFields = useMemo(() => {
    return currentGroup.fieldIds.map((fieldId) => fieldsById.get(fieldId)).filter(Boolean);
  }, [currentGroup.fieldIds, fieldsById]);

  const validateField = (fieldId: string) => {
    const field = fieldsById.get(fieldId);
    if (!field) return '';

    if (field.type === 'file') {
      if (field.required && (files[field.id]?.length ?? 0) === 0) return labels.requiredMessage;
      return '';
    }

    const value = values[field.id]?.trim() ?? '';
    if (field.required && !value) return labels.requiredMessage;
    if (field.type === 'email' && value && !isValidEmail(value)) return labels.emailMessage;
    return '';
  };

  const validateFields = (fieldIds: string[]) => {
    const nextErrors = { ...errors };
    let valid = true;

    fieldIds.forEach((fieldId) => {
      const message = validateField(fieldId);
      if (message) {
        valid = false;
        nextErrors[fieldId] = message;
      } else {
        delete nextErrors[fieldId];
      }
    });

    setErrors(nextErrors);
    return valid;
  };

  const validateAll = () => {
    return validateFields(form.fields.map((field) => field.id));
  };

  const updateValue = (fieldId: string, value: string) => {
    setValues((current) => ({ ...current, [fieldId]: value }));
    setErrors((current) => {
      if (!current[fieldId]) return current;
      const next = { ...current };
      delete next[fieldId];
      return next;
    });
  };

  const updateFiles = (fieldId: string, nextFiles: File[]) => {
    setFiles((current) => ({ ...current, [fieldId]: nextFiles }));
    setErrors((current) => {
      if (!current[fieldId]) return current;
      const next = { ...current };
      delete next[fieldId];
      return next;
    });
  };

  const buildSubmissionFields = (): ParticipateSubmissionField[] => {
    return form.fields.map((field) => {
      if (field.type === 'file') {
        return {
          id: field.id,
          sourceName: field.sourceName,
          label: cleanLabel(field.label),
          value: (files[field.id] ?? []).map((file) => ({
            name: file.name,
            size: file.size,
            type: file.type,
          })),
        };
      }

      return {
        id: field.id,
        sourceName: field.sourceName,
        label: cleanLabel(field.label),
        value: values[field.id] ?? '',
      };
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus({ type: 'idle', message: '' });

    if (!isLastStep) {
      if (validateFields(currentGroup.fieldIds)) {
        setStepIndex((current) => Math.min(current + 1, form.groups.length - 1));
      }
      return;
    }

    if (!validateAll()) return;

    setSubmitting(true);
    try {
      await submitParticipateForm({
        formId: form.id,
        sourceUrl,
        fields: buildSubmissionFields(),
        files,
      });
      setStatus({ type: 'success', message: labels.submitSuccess });
      setValues(Object.fromEntries(form.fields.map((field) => [field.id, ''])));
      setFiles({});
      setStepIndex(0);
    } catch (error) {
      if (error instanceof ParticipateFormError && error.code === 'missing-endpoint') {
        setStatus({ type: 'error', message: labels.integrationMissing });
      } else {
        setStatus({ type: 'error', message: labels.submitError });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[22px] border border-primary-100 bg-white p-5 text-start shadow-[0_18px_48px_rgba(40,12,18,0.08)] md:p-7"
      noValidate
    >
      <div className="mb-7">
        <h2 className="text-2xl font-bold leading-tight text-dark-950">{form.title}</h2>
        <p className="mt-3 text-sm leading-relaxed text-dark-600">{form.description}</p>
      </div>

      {form.groups.length > 1 && (
        <div className="mb-7">
          <div className="mb-3 flex items-center justify-between gap-3 text-xs font-bold text-dark-500">
            <span>
              {labels.step} {stepIndex + 1} / {form.groups.length}
            </span>
            <span className="text-primary-700">{currentGroup.title}</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {form.groups.map((group, index) => (
              <span
                key={group.id}
                className={`h-2 rounded-full transition-colors ${
                  index <= stepIndex ? 'bg-primary-600' : 'bg-primary-100'
                }`}
                aria-hidden="true"
              />
            ))}
          </div>
        </div>
      )}

      <div className="mb-6 rounded-2xl border border-primary-100 bg-primary-50/55 p-4">
        <h3 className="text-base font-bold text-dark-950">{currentGroup.title}</h3>
        {currentGroup.description && (
          <p className="mt-2 text-sm leading-relaxed text-dark-600">{currentGroup.description}</p>
        )}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {currentFields.map((field) => {
          if (!field) return null;

          return (
            <div
              key={field.id}
              className={field.type === 'textarea' || field.type === 'file' ? 'md:col-span-2' : undefined}
            >
              <FormField
                field={field}
                value={values[field.id] ?? ''}
                files={files[field.id] ?? []}
                error={errors[field.id]}
                selectedFilesLabel={labels.selectedFiles}
                onChange={updateValue}
                onFileChange={updateFiles}
              />
            </div>
          );
        })}
      </div>

      <div className="mt-7 rounded-2xl border border-dark-100 bg-[#faf8f8] p-4 text-sm leading-relaxed text-dark-600">
        {labels.formNotice}
      </div>

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          {stepIndex > 0 && (
            <button
              type="button"
              onClick={() => setStepIndex((current) => Math.max(current - 1, 0))}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-primary-100 bg-white px-5 py-2.5 text-sm font-bold text-dark-700 transition-colors hover:border-primary-300 hover:text-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600"
            >
              <PreviousIcon className="h-4 w-4" aria-hidden="true" />
              {labels.previous}
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary-600 px-6 py-2.5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(156,16,6,0.24)] transition-all hover:-translate-y-0.5 hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600 disabled:cursor-not-allowed disabled:bg-dark-300 disabled:shadow-none disabled:hover:translate-y-0 motion-reduce:hover:translate-y-0"
        >
          {isLastStep ? (submitting ? labels.submitting : labels.submit) : labels.next}
          {isLastStep ? <Send className="h-4 w-4" aria-hidden="true" /> : <NextIcon className="h-4 w-4" aria-hidden="true" />}
        </button>
      </div>

      {status.type !== 'idle' && (
        <div
          className={`mt-5 flex items-start gap-3 rounded-2xl border p-4 text-sm font-semibold leading-relaxed ${
            status.type === 'success'
              ? 'border-emerald-100 bg-emerald-50 text-emerald-800'
              : 'border-primary-100 bg-primary-50 text-primary-800'
          }`}
          role="status"
          aria-live="polite"
        >
          {status.type === 'success' ? (
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          ) : (
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          )}
          <span>{status.message}</span>
        </div>
      )}
    </form>
  );
}
