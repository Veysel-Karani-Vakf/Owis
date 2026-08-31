import { CreditCard, Lock } from 'lucide-react';
import type { DonateCheckoutContent } from '@/data/donateCheckout';

export type CardFieldValues = {
  /** Digits grouped by 4 for display, e.g. '4508 0345 0803 4509'. */
  number: string;
  /** 'MM/YY'. */
  expiry: string;
  cvv: string;
};

type CardFieldsProps = {
  values: CardFieldValues;
  errors: Partial<Record<keyof CardFieldValues, string>>;
  labels: DonateCheckoutContent['card'];
  disabled: boolean;
  onChange: (field: keyof CardFieldValues, value: string) => void;
};

const inputClass =
  'min-h-12 w-full rounded-2xl border border-primary-100 bg-white px-4 py-3 text-start text-sm font-medium text-dark-900 shadow-sm outline-none transition-colors placeholder:text-dark-400 focus:border-primary-400 focus:ring-4 focus:ring-primary-100';

function formatCardNumber(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 19);
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
}

function formatExpiry(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export default function CardFields({ values, errors, labels, disabled, onChange }: CardFieldsProps) {
  return (
    <div className="text-start">
      <div className="grid gap-4">
        <div>
          <label htmlFor="card-number" className="mb-2 block text-sm font-bold text-dark-800">
            {labels.numberLabel}
          </label>
          <div className="relative">
            <input
              id="card-number"
              name="card-number"
              type="text"
              inputMode="numeric"
              autoComplete="cc-number"
              dir="ltr"
              placeholder="0000 0000 0000 0000"
              value={values.number}
              disabled={disabled}
              required
              aria-invalid={Boolean(errors.number)}
              aria-describedby={errors.number ? 'card-number-error' : undefined}
              onChange={(event) => onChange('number', formatCardNumber(event.target.value))}
              className={`${inputClass} pe-11 font-mono tracking-wide`}
            />
            <CreditCard
              className="pointer-events-none absolute end-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary-300"
              aria-hidden="true"
            />
          </div>
          {errors.number && (
            <p id="card-number-error" className="mt-2 text-xs font-semibold text-primary-700">
              {errors.number}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="card-expiry" className="mb-2 block text-sm font-bold text-dark-800">
              {labels.expiryLabel}
            </label>
            <input
              id="card-expiry"
              name="card-expiry"
              type="text"
              inputMode="numeric"
              autoComplete="cc-exp"
              dir="ltr"
              placeholder="MM/YY"
              value={values.expiry}
              disabled={disabled}
              required
              aria-invalid={Boolean(errors.expiry)}
              aria-describedby={errors.expiry ? 'card-expiry-error' : undefined}
              onChange={(event) => onChange('expiry', formatExpiry(event.target.value))}
              className={`${inputClass} font-mono`}
            />
            {errors.expiry && (
              <p id="card-expiry-error" className="mt-2 text-xs font-semibold text-primary-700">
                {errors.expiry}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="card-cvv" className="mb-2 block text-sm font-bold text-dark-800">
              {labels.cvvLabel}
            </label>
            <input
              id="card-cvv"
              name="card-cvv"
              type="password"
              inputMode="numeric"
              autoComplete="cc-csc"
              dir="ltr"
              placeholder="•••"
              maxLength={4}
              value={values.cvv}
              disabled={disabled}
              required
              aria-invalid={Boolean(errors.cvv)}
              aria-describedby={errors.cvv ? 'card-cvv-error' : undefined}
              onChange={(event) => onChange('cvv', event.target.value.replace(/\D/g, '').slice(0, 4))}
              className={`${inputClass} font-mono`}
            />
            {errors.cvv && (
              <p id="card-cvv-error" className="mt-2 text-xs font-semibold text-primary-700">
                {errors.cvv}
              </p>
            )}
          </div>
        </div>
      </div>

      <p className="mt-4 flex items-start gap-2 text-xs font-semibold leading-relaxed text-dark-500">
        <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary-600" aria-hidden="true" />
        {labels.secureNote}
      </p>
    </div>
  );
}
