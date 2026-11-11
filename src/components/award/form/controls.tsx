import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { AlertCircle, Check, ChevronDown } from 'lucide-react';
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react';
import { controlClass, describedBy } from './formStyles';

type ShellProps = {
  /** id of the control the label points at (or of the group). */
  id: string;
  label: ReactNode;
  required?: boolean;
  requiredLabel?: string;
  optionalLabel?: string;
  hint?: ReactNode;
  error?: string;
  /** Render as a fieldset with a legend (radio groups, multi-control fields). */
  group?: boolean;
  className?: string;
  children: ReactNode;
};

/** Label + hint + control + error message, wired with matching ids. */
export function FieldShell({
  id,
  label,
  required,
  requiredLabel,
  optionalLabel,
  hint,
  error,
  group,
  className = '',
  children,
}: ShellProps) {
  const Wrapper = group ? 'fieldset' : 'div';
  const caption = (
    <>
      {label}
      {required ? (
        <span className="ms-1 text-primary-500" aria-hidden="true">
          *
        </span>
      ) : optionalLabel ? (
        <span className="ms-2 rounded-full bg-warm px-2 py-0.5 text-[11px] font-semibold text-dark-500">
          {optionalLabel}
        </span>
      ) : null}
      {required && requiredLabel && <span className="sr-only"> ({requiredLabel})</span>}
    </>
  );

  return (
    <Wrapper
      className={`min-w-0 text-start ${className}`}
      {...(group ? { 'aria-describedby': describedBy(id, hint ? 'h' : '', error) } : {})}
    >
      {group ? (
        <legend className="mb-2 text-sm font-bold text-dark-800">{caption}</legend>
      ) : (
        <label htmlFor={id} className="mb-2 block text-sm font-bold text-dark-800">
          {caption}
        </label>
      )}
      {/* A group (full width) explains itself before its controls; a single field
          keeps its hint under the box, so boxes side by side always line up. */}
      {hint && group && (
        <p id={`${id}-hint`} className="-mt-1 mb-2 text-xs leading-relaxed text-dark-500">
          {hint}
        </p>
      )}
      {children}
      {hint && !group && (
        <p id={`${id}-hint`} className="mt-1.5 text-xs leading-relaxed text-dark-500">
          {hint}
        </p>
      )}
      <FieldError id={`${id}-error`} message={error} />
    </Wrapper>
  );
}

export function FieldError({ id, message }: { id: string; message?: string }) {
  const reduceMotion = useReducedMotion();
  return (
    <AnimatePresence initial={false}>
      {message && (
        // One stable element per field: a changed message updates in place, so the
        // id that aria-describedby points at is never duplicated during an exit.
        <motion.p
          key="error"
          id={id}
          initial={reduceMotion ? false : { opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="mt-2 flex items-start gap-1.5 text-[13px] font-semibold leading-relaxed text-primary-700"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{message}</span>
        </motion.p>
      )}
    </AnimatePresence>
  );
}

type TextInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
  id: string;
  value: string;
  onValue: (value: string) => void;
  hint?: ReactNode;
  error?: string;
};

export function TextInput({ id, value, onValue, hint, error, className = '', ...props }: TextInputProps) {
  return (
    <input
      id={id}
      value={value}
      onChange={(event) => onValue(event.target.value)}
      aria-invalid={Boolean(error) || undefined}
      aria-describedby={describedBy(id, hint ? 'h' : '', error)}
      className={controlClass(error, className)}
      {...props}
    />
  );
}

type SelectInputProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> & {
  id: string;
  value: string;
  onValue: (value: string) => void;
  placeholder?: string;
  options: { value: string; label: string }[];
  hint?: ReactNode;
  error?: string;
};

export function SelectInput({
  id,
  value,
  onValue,
  placeholder,
  options,
  hint,
  error,
  className = '',
  ...props
}: SelectInputProps) {
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={(event) => onValue(event.target.value)}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={describedBy(id, hint ? 'h' : '', error)}
        className={controlClass(error, `appearance-none pe-10 ${value ? '' : 'text-dark-400'} ${className}`)}
        {...props}
      >
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value} className="text-dark-900">
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute end-4 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-400"
        aria-hidden="true"
      />
    </div>
  );
}

type ChoiceProps = {
  /** Field key; each option gets id `${id}-${value}`. */
  id: string;
  name: string;
  value: string;
  options: { value: string; label: ReactNode; icon?: ReactNode }[];
  onValue: (value: string) => void;
  error?: string;
  columns?: string;
};

/** Radio options shown as selectable cards (native radios, so arrow keys work). */
export function ChoiceGroup({ id, name, value, options, onValue, error, columns = 'grid-cols-2' }: ChoiceProps) {
  return (
    <div className={`grid gap-2.5 ${columns}`}>
      {options.map((option) => {
        const checked = value === option.value;
        const optionId = `${id}-${option.value}`;
        return (
          <label
            key={option.value}
            htmlFor={optionId}
            className={`group relative flex min-h-12 cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-[15px] font-bold transition-[border-color,background-color,color,box-shadow] duration-200 has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-primary-100 motion-reduce:transition-none ${
              checked
                ? 'border-primary-500 bg-primary-50 text-primary-800 shadow-[0_8px_20px_rgba(156,16,6,0.1)]'
                : error
                  ? 'border-primary-700 bg-primary-50/40 text-dark-800'
                  : 'border-dark-200 bg-white text-dark-800 hover:border-dark-300'
            }`}
          >
            <input
              id={optionId}
              type="radio"
              name={name}
              value={option.value}
              checked={checked}
              onChange={() => onValue(option.value)}
              className="sr-only"
            />
            <span
              aria-hidden="true"
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                checked ? 'border-primary-500 bg-primary-500 text-white' : 'border-dark-300 bg-white'
              }`}
            >
              {checked && <Check className="h-3 w-3" strokeWidth={3.5} />}
            </span>
            {option.icon && <span className={checked ? 'text-primary-600' : 'text-dark-500'}>{option.icon}</span>}
            <span className="min-w-0">{option.label}</span>
          </label>
        );
      })}
    </div>
  );
}

type CheckboxProps = {
  id: string;
  checked: boolean;
  onChecked: (checked: boolean) => void;
  label: ReactNode;
  error?: string;
  describedById?: string;
};

export function Checkbox({ id, checked, onChecked, label, error, describedById }: CheckboxProps) {
  return (
    <label
      htmlFor={id}
      className={`flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3.5 text-[15px] font-semibold leading-relaxed transition-colors has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-primary-100 ${
        checked
          ? 'border-primary-300 bg-primary-50/60 text-dark-900'
          : error
            ? 'border-primary-700 bg-primary-50/40'
            : 'border-dark-200 bg-white text-dark-800'
      }`}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChecked(event.target.checked)}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={[describedById, error ? `${id}-error` : ''].filter(Boolean).join(' ') || undefined}
        className="sr-only"
      />
      <span
        aria-hidden="true"
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
          checked ? 'border-primary-500 bg-primary-500 text-white' : 'border-dark-300 bg-white'
        }`}
      >
        {checked && <Check className="h-3.5 w-3.5" strokeWidth={3.5} />}
      </span>
      <span>{label}</span>
    </label>
  );
}
