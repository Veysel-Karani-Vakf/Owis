import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { CheckCircle2, Plus, Trash2 } from 'lucide-react';
import { useMemo } from 'react';
import {
  PHONE_OTHER,
  YEMEN_ISO,
  awardFormRules,
  fillTemplate,
  formLocaleTag,
  phoneCountries,
  platformIds,
  type PlatformId,
} from '@/data/award/form';
import { useI18n } from '@/i18n/useI18n';
import { countValidSocialRows, fieldDomId, newRowId, type SocialRow, type StepProps } from './applyState';
import { Checkbox, FieldError, FieldShell, SelectInput, TextInput } from './controls';
import { controlClass, describedBy, formButton } from './formStyles';

/* ------------------------------------------------------------------------- */
/* Phone (WhatsApp) with country code                                        */
/* ------------------------------------------------------------------------- */

export function PhoneField({ values, update, errorOf, content }: StepProps) {
  const { locale } = useI18n();
  const field = content.fields.phone;
  const numberId = fieldDomId('phoneNumber');
  const codeError = errorOf('phoneCustomCode');
  const numberError = errorOf('phoneNumber');

  const countryOptions = useMemo(() => {
    let names: Intl.DisplayNames | null = null;
    try {
      names = new Intl.DisplayNames([formLocaleTag[locale]], { type: 'region' });
    } catch {
      names = null;
    }
    const label = (iso: string) => names?.of(iso) ?? iso;
    const collator = new Intl.Collator(formLocaleTag[locale]);
    const yemen = phoneCountries.filter((country) => country.iso === YEMEN_ISO);
    const others = phoneCountries
      .filter((country) => country.iso !== YEMEN_ISO)
      .sort((a, b) => collator.compare(label(a.iso), label(b.iso)));
    return [
      ...[...yemen, ...others].map((country) => ({
        value: country.iso,
        label: `+${country.dial}  ${label(country.iso)}`,
      })),
      { value: PHONE_OTHER, label: field.otherCode },
    ];
  }, [locale, field.otherCode]);

  return (
    <FieldShell
      id={numberId}
      label={field.label}
      required
      requiredLabel={content.common.requiredMark}
      hint={field.hint}
      error={numberError}
    >
      {/* Phone numbers read left to right in every language. */}
      <div dir="ltr" className="flex flex-wrap gap-2 sm:flex-nowrap">
        <div className="w-full sm:w-52 sm:shrink-0">
          <SelectInput
            id={fieldDomId('phoneCountry')}
            aria-label={field.countryLabel}
            value={values.phoneCountry}
            onValue={(value) => update('phoneCountry', value)}
            options={countryOptions}
            className="text-left"
          />
        </div>
        {values.phoneCountry === PHONE_OTHER && (
          <div className="relative w-28 shrink-0">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[15px] font-bold text-dark-500">
              +
            </span>
            <TextInput
              id={fieldDomId('phoneCustomCode')}
              aria-label={field.customCodeLabel}
              value={values.phoneCustomCode}
              onValue={(value) => update('phoneCustomCode', value)}
              inputMode="numeric"
              maxLength={4}
              placeholder={field.customCodePlaceholder}
              error={codeError}
              className="pl-8 text-left"
            />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <input
            id={numberId}
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            dir="ltr"
            aria-label={field.numberLabel}
            value={values.phoneNumber}
            onChange={(event) => update('phoneNumber', event.target.value)}
            placeholder={values.phoneCountry === YEMEN_ISO ? field.numberPlaceholder : ''}
            aria-invalid={Boolean(numberError) || undefined}
            aria-required="true"
            aria-describedby={describedBy(numberId, field.hint, numberError)}
            className={controlClass(numberError, 'text-left tracking-wide')}
          />
        </div>
      </div>
      {codeError && <FieldError id={`${fieldDomId('phoneCustomCode')}-error`} message={codeError} />}
    </FieldShell>
  );
}

/* ------------------------------------------------------------------------- */
/* Implementation period                                                     */
/* ------------------------------------------------------------------------- */

export function PeriodField({ values, update, errorOf, content }: StepProps) {
  const { locale } = useI18n();
  const field = content.fields.period;
  const groupId = fieldDomId('period');
  const startError = errorOf('periodStart');
  const endError = errorOf('periodEnd');

  const months = useMemo(() => {
    const format = new Intl.DateTimeFormat(formLocaleTag[locale], { month: 'long' });
    return Array.from({ length: 12 }, (_, index) => ({
      value: String(index + 1),
      label: format.format(new Date(2026, index, 1)),
    }));
  }, [locale]);
  const years = useMemo(() => {
    const now = new Date().getFullYear();
    return Array.from({ length: awardFormRules.yearsBack + 1 }, (_, index) => ({
      value: String(now - index),
      label: String(now - index),
    }));
  }, []);

  const pair = (which: 'start' | 'end', error?: string) => {
    const monthKey = which === 'start' ? 'startMonth' : 'endMonth';
    const yearKey = which === 'start' ? 'startYear' : 'endYear';
    const disabled = which === 'end' && values.ongoing;
    return (
      <div className={`min-w-0 transition-opacity ${disabled ? 'opacity-50' : ''}`}>
        <p className="mb-2 text-[13px] font-bold text-dark-600">{which === 'start' ? field.start : field.end}</p>
        <div className="grid grid-cols-[1.4fr_1fr] gap-2">
          <SelectInput
            id={fieldDomId(monthKey)}
            aria-label={`${which === 'start' ? field.start : field.end} — ${field.month}`}
            value={values[monthKey]}
            onValue={(value) => update(monthKey, value)}
            placeholder={field.month}
            options={months}
            error={error}
            disabled={disabled}
          />
          <SelectInput
            id={fieldDomId(yearKey)}
            aria-label={`${which === 'start' ? field.start : field.end} — ${field.year}`}
            value={values[yearKey]}
            onValue={(value) => update(yearKey, value)}
            placeholder={field.year}
            options={years}
            error={error}
            disabled={disabled}
          />
        </div>
        <FieldError id={`${fieldDomId(which === 'start' ? 'periodStart' : 'periodEnd')}-error`} message={error} />
      </div>
    );
  };

  return (
    <FieldShell
      id={groupId}
      group
      label={field.label}
      required
      requiredLabel={content.common.requiredMark}
      hint={field.hint}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {pair('start', startError)}
        {pair('end', values.ongoing ? undefined : endError)}
      </div>
      <div className="mt-3">
        <Checkbox
          id={fieldDomId('ongoing')}
          checked={values.ongoing}
          onChecked={(checked) => update('ongoing', checked)}
          label={field.ongoing}
        />
      </div>
    </FieldShell>
  );
}

/* ------------------------------------------------------------------------- */
/* Social media links (at least two distinct platforms)                      */
/* ------------------------------------------------------------------------- */

export function SocialLinksField({ values, update, errorOf, content }: StepProps) {
  const reduceMotion = useReducedMotion();
  const field = content.fields.social;
  const rows = values.social;
  const validCount = countValidSocialRows(rows);
  const min = awardFormRules.minSocialPlatforms;
  const groupError = errorOf('social');

  const setRow = (id: string, patch: Partial<SocialRow>) =>
    update(
      'social',
      rows.map((row) => (row.id === id ? { ...row, ...patch } : row))
    );
  const removeRow = (id: string) =>
    update(
      'social',
      rows.filter((row) => row.id !== id)
    );
  const addRow = () => update('social', [...rows, { id: newRowId(), platform: '', name: '', url: '' }]);

  const platformOptions = platformIds.map((id) => ({ value: id, label: field.platforms[id] }));

  return (
    <FieldShell
      id={fieldDomId('social')}
      group
      label={field.label}
      required
      requiredLabel={content.common.requiredMark}
      hint={field.hint}
    >
      <ul className="space-y-3">
        <AnimatePresence initial={false}>
          {rows.map((row, index) => {
            const platformKey = `social.${row.id}.platform`;
            const nameKey = `social.${row.id}.name`;
            const urlKey = `social.${row.id}.url`;
            const platformError = errorOf(platformKey);
            const nameError = errorOf(nameKey);
            const urlError = errorOf(urlKey);
            return (
              <motion.li
                key={row.id}
                layout={!reduceMotion}
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6, transition: { duration: 0.15 } }}
                className="rounded-2xl border border-dark-100 bg-warm/60 p-3 sm:p-4"
              >
                <div className="grid gap-3 sm:grid-cols-[minmax(0,11rem)_minmax(0,1fr)_auto] sm:items-start">
                  <div className="min-w-0">
                    <SelectInput
                      id={fieldDomId(platformKey)}
                      aria-label={`${field.platform} ${index + 1}`}
                      value={row.platform}
                      onValue={(value) => setRow(row.id, { platform: value as PlatformId | '' })}
                      placeholder={field.platform}
                      options={platformOptions}
                      error={platformError}
                    />
                    <FieldError id={`${fieldDomId(platformKey)}-error`} message={platformError} />
                    {row.platform === 'other' && (
                      <div className="mt-2">
                        <TextInput
                          id={fieldDomId(nameKey)}
                          aria-label={field.otherName}
                          value={row.name}
                          onValue={(value) => setRow(row.id, { name: value })}
                          placeholder={field.otherNamePlaceholder}
                          maxLength={60}
                          error={nameError}
                        />
                        <FieldError id={`${fieldDomId(nameKey)}-error`} message={nameError} />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <TextInput
                      id={fieldDomId(urlKey)}
                      type="url"
                      inputMode="url"
                      dir="ltr"
                      autoComplete="url"
                      aria-label={`${field.url} ${index + 1}`}
                      value={row.url}
                      onValue={(value) => setRow(row.id, { url: value })}
                      placeholder={field.urlPlaceholder}
                      error={urlError}
                      className="text-left"
                    />
                    <FieldError id={`${fieldDomId(urlKey)}-error`} message={urlError} />
                  </div>
                  {rows.length > min && (
                    <button
                      type="button"
                      onClick={() => removeRow(row.id)}
                      aria-label={`${field.remove} ${index + 1}`}
                      className="btn-border-run btn-border-run--sheen-tint flex h-12 w-12 items-center justify-center justify-self-end rounded-2xl border border-dark-200 bg-white text-dark-500 transition-colors hover:border-primary-300 hover:text-primary-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                    >
                      <Trash2 className="h-[18px] w-[18px]" aria-hidden="true" />
                    </button>
                  )}
                </div>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <p
          className={`inline-flex items-center gap-1.5 text-[13px] font-bold ${
            validCount >= min ? 'text-emerald-700' : 'text-dark-500'
          }`}
        >
          {validCount >= min && <CheckCircle2 className="h-4 w-4" aria-hidden="true" />}
          {fillTemplate(field.counter, { count: Math.min(validCount, min), min })}
        </p>
        {rows.length < awardFormRules.maxSocialRows && (
          <button id={fieldDomId('social-add')} type="button" onClick={addRow} className={formButton.ghost}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            {field.add}
          </button>
        )}
      </div>
      <FieldError id={`${fieldDomId('social')}-error`} message={groupError} />
    </FieldShell>
  );
}
