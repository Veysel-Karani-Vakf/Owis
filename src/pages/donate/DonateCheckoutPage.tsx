import { AlertTriangle, FlaskConical, HandHeart, Loader2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Navigate, useParams, useSearchParams } from 'react-router-dom';
import FadeContent from '@/components/effects/FadeContent';
import PageSeo from '@/components/internal/PageSeo';
import { donateRoute } from '@/data/donate';
import { getDonateCheckoutContent } from '@/data/donateCheckout';
import { useDonateContent } from '@/hooks/useCmsContent';
import { useI18n } from '@/i18n/useI18n';
import {
  createPayment,
  DEFAULT_PAYMENT_CONFIG,
  DonationPaymentError,
  fetchPaymentConfig,
  submitToGate,
  type PaymentConfig,
  type PaymentErrorCode,
} from '@/services/donationPayments';

const inputClass =
  'min-h-10 w-full rounded-xl border border-primary-100 bg-white px-3.5 py-2.5 text-start text-sm font-medium text-dark-900 shadow-sm outline-none transition-colors placeholder:text-dark-400 focus:border-primary-400 focus:ring-4 focus:ring-primary-100';

const localeTags: Record<string, string> = { ar: 'ar', tr: 'tr-TR', en: 'en-US' };

function formatAmount(amount: number, locale: string, currency: string): string {
  // Presets stay "$250"; a custom 19.99 must read "$19.99", never "$20".
  const digits = Number.isInteger(amount) ? 0 : 2;
  return new Intl.NumberFormat(localeTags[locale] ?? 'en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

function normalizeIncomingAmount(value: string | null): string {
  if (!value) return '';

  const normalized = value.trim().replace(',', '.');
  const amount = Number(normalized);
  if (!Number.isFinite(amount) || amount <= 0) return '';

  const cents = Math.round(amount * 100);
  if (Math.abs(amount * 100 - cents) > 1e-6) return '';

  return String(cents / 100);
}

type FieldErrors = {
  amount?: string;
  name?: string;
  email?: string;
  consent?: string;
};

export default function DonateCheckoutPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const { locale } = useI18n();
  const donatePage = useDonateContent(locale);
  const content = getDonateCheckoutContent(locale);

  const opportunity = useMemo(
    () => donatePage.opportunities.find((candidate) => candidate.id === slug),
    [donatePage.opportunities, slug],
  );

  // null until /api/payments/config answers: limits fall back to the defaults
  // meanwhile, and the test-mode notice stays hidden (production-safe).
  const [config, setConfig] = useState<PaymentConfig | null>(null);
  const [customAmount, setCustomAmount] = useState(() =>
    normalizeIncomingAmount(searchParams.get('amount')),
  );
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchPaymentConfig().then((loaded) => {
      if (!cancelled && loaded) setConfig(loaded);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const limits = config ?? DEFAULT_PAYMENT_CONFIG;

  if (!opportunity || !opportunity.available) {
    return <Navigate to={donateRoute} replace />;
  }

  // The field is now the single source of truth for the amount. This keeps
  // transferred amounts, preset buttons, manual edits and the bank request in sync.
  const amountValue = customAmount.trim() !== '' ? Number(customAmount) : null;

  const errorMessage = (code: PaymentErrorCode): string => {
    switch (code) {
      case 'invalid-amount':
        return content.errors.amount;
      case 'invalid-name':
        return content.errors.name;
      case 'invalid-email':
        return content.errors.email;
      case 'unavailable':
        return content.errors.unavailable;
      case 'network':
        return content.errors.network;
      default:
        return content.errors.server;
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (submitting) return;

    const nextErrors: FieldErrors = {};
    const amount = amountValue ?? NaN;
    // Whole cents only, with a tolerance: 19.99 * 100 is not exactly 1999 in floating point.
    const cents = Math.round(amount * 100);
    if (
      !Number.isFinite(amount) ||
      Math.abs(amount * 100 - cents) > 1e-6 ||
      cents < limits.minAmount * 100 ||
      cents > limits.maxAmount * 100
    ) {
      nextErrors.amount = content.errors.amount;
    }
    const name = donorName.trim();
    if (name.length < 2 || name.length > 120) nextErrors.name = content.errors.name;
    const email = donorEmail.trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = content.errors.email;

    if (!consent) nextErrors.consent = content.errors.consent;

    setErrors(nextErrors);
    setSubmitError(null);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      const result = await createPayment({
        slug: opportunity.id,
        titleSnapshot: opportunity.title,
        amount: cents / 100,
        locale,
        donor: { name, email, phone: donorPhone.trim() },
      });
      // Full-page handover to the bank's hosted card page; no state survives.
      submitToGate(result.gateUrl, result.fields);
    } catch (error) {
      const code = error instanceof DonationPaymentError ? error.code : 'server-error';
      setSubmitError(errorMessage(code));
      setSubmitting(false);
    }
  };

  // Only once the server has answered: a live deployment must never flash
  // "no real charge is made" at a donor who is about to be charged.
  const showTestBanner = config !== null && config.mode !== 'production';

  return (
    <>
      <PageSeo title={content.seo.title} description={content.seo.description} />
      <main className="min-h-screen bg-[#faf8f8]">
        {/* Compact hero: enough dark background for the floating header, without
            consuming almost half of the viewport like the regular PageHero. */}
        <section
          id="cms-checkout-hero"
          className="relative isolate overflow-hidden bg-dark-950 pt-24 md:pt-28"
        >
          <img
            src={opportunity.image}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 -z-20 h-full w-full object-cover opacity-45"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary-950/90 via-dark-950/78 to-dark-950/68" />
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_22%_45%,rgba(218,8,18,0.24),transparent_34%)]" />

          <div className="mx-auto flex min-h-[148px] max-w-7xl items-end px-4 pb-5 md:min-h-[164px] md:px-8 md:pb-6">
            <div className="max-w-3xl text-start">
              <p className="text-xs font-bold text-white/70">{content.breadcrumbs.donate}</p>
              <h1 className="mt-1 text-2xl font-black leading-tight text-white md:text-3xl">
                {content.hero.title}
              </h1>
            </div>
          </div>
        </section>

        <section className="bg-[#faf8f8] py-4 md:py-5 lg:py-6">
          <div className="mx-auto grid max-w-7xl gap-4 px-4 md:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
            <FadeContent
              blur={false}
              duration={520}
              initialOpacity={0}
              yOffset={10}
              threshold={0.1}
              once
            >
              <div className="text-start">
                <div className="overflow-hidden rounded-[20px] border border-primary-100 bg-white shadow-[0_14px_38px_rgba(40,12,18,0.07)]">
                  <div className="relative h-40 overflow-hidden bg-primary-50 sm:h-44 lg:h-[205px]">
                    <img
                      src={opportunity.image}
                      alt={opportunity.imageAlt}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-4 md:p-5">
                    <p className="text-[11px] font-bold text-primary-700">{content.summary.heading}</p>
                    <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
                      <div className="min-w-0">
                        <h2 className="text-xl font-bold leading-tight text-dark-950 md:text-2xl">
                          {opportunity.title}
                        </h2>
                        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-dark-600">
                          {opportunity.description}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-primary-100 bg-primary-50/55 px-4 py-2.5">
                      <p className="text-xs font-bold text-primary-700">{content.summary.publishedValue}</p>
                      <p className="text-xl font-black text-dark-950">{opportunity.price}</p>
                    </div>
                  </div>
                </div>

                {config?.mode === 'mock' && (
                  <details
                    id="cms-checkout-test-cards"
                    className="mt-3 rounded-xl border border-primary-100 bg-white px-4 py-3 text-start shadow-[0_10px_28px_rgba(40,12,18,0.05)]"
                  >
                    <summary className="cursor-pointer text-sm font-black text-dark-900">
                      {content.testCards.heading}
                    </summary>
                    <div className="mt-3">
                      <p className="text-xs leading-relaxed text-dark-600">
                        {content.testCards.description}
                      </p>
                      <ul className="mt-3 grid gap-2 text-xs text-dark-600 sm:grid-cols-3 lg:grid-cols-1">
                        <li className="flex flex-wrap items-center gap-2">
                          <code dir="ltr" className="rounded bg-primary-50 px-2 py-1 font-mono text-[11px] text-primary-800">
                            4508 0345 0803 4509
                          </code>
                          {content.testCards.approveLabel}
                        </li>
                        <li className="flex flex-wrap items-center gap-2">
                          <code dir="ltr" className="rounded bg-primary-50 px-2 py-1 font-mono text-[11px] text-primary-800">
                            4000 0000 0000 0002
                          </code>
                          {content.testCards.fail3dsLabel}
                        </li>
                        <li className="flex flex-wrap items-center gap-2">
                          <code dir="ltr" className="rounded bg-primary-50 px-2 py-1 font-mono text-[11px] text-primary-800">
                            4242 4242 4208 0069
                          </code>
                          {content.testCards.declineLabel}
                        </li>
                      </ul>
                    </div>
                  </details>
                )}
              </div>
            </FadeContent>

            <FadeContent
              blur={false}
              duration={520}
              initialOpacity={0}
              yOffset={10}
              threshold={0.1}
              once
            >
              <form
                id="cms-checkout-form"
                onSubmit={handleSubmit}
                noValidate
                className="rounded-[20px] border border-primary-100 bg-white p-4 text-start shadow-[0_16px_42px_rgba(40,12,18,0.06)] md:p-5"
              >
                <fieldset disabled={submitting} className="grid gap-4">
                  {showTestBanner && (
                    <div
                      id="cms-checkout-banner"
                      role="status"
                      className="flex items-start gap-2.5 rounded-xl border border-amber-300 bg-amber-50 px-3 py-2.5 text-start"
                    >
                      <FlaskConical className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden="true" />
                      <p className="text-xs leading-relaxed text-amber-800">
                        <span className="font-black">{content.testBanner.title}</span>{' '}
                        {content.testBanner.description}
                      </p>
                    </div>
                  )}

                  <div>
                    <h2 className="text-lg font-bold text-dark-950">{content.amount.heading}</h2>
                    <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
                      {limits.presets.map((preset) => {
                        const active =
                          customAmount.trim() !== '' && Number(customAmount) === preset;
                        return (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => {
                              setCustomAmount(String(preset));
                              setErrors((current) => ({
                                ...current,
                                amount: undefined,
                              }));
                            }}
                            aria-pressed={active}
                            className={`btn-border-run min-h-9 rounded-full border px-3 py-1.5 text-xs font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 ${
                              active
                                ? 'border-primary-600 bg-primary-600 text-white'
                                : 'border-primary-100 bg-white text-dark-800 hover:border-primary-300 hover:text-primary-700'
                            }`}
                          >
                            {formatAmount(preset, locale, limits.currency)}
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-3">
                      <label htmlFor="custom-amount" className="mb-1.5 block text-xs font-bold text-dark-800">
                        {content.amount.customLabel}
                      </label>
                      <input
                        id="custom-amount"
                        name="custom-amount"
                        type="number"
                        inputMode="decimal"
                        min={limits.minAmount}
                        max={limits.maxAmount}
                        step="0.01"
                        placeholder={content.amount.customPlaceholder}
                        value={customAmount}
                        aria-invalid={Boolean(errors.amount)}
                        aria-describedby={errors.amount ? 'amount-error' : undefined}
                        onChange={(event) => {
                          setCustomAmount(event.target.value);
                          if (errors.amount) {
                            setErrors((current) => ({
                              ...current,
                              amount: undefined,
                            }));
                          }
                        }}
                        className={inputClass}
                      />
                      {errors.amount && (
                        <p id="amount-error" className="mt-1.5 text-xs font-semibold text-primary-700">
                          {errors.amount}
                        </p>
                      )}
                      <p className="mt-1.5 text-[11px] font-semibold text-dark-500">
                        {content.amount.currencyNote}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-primary-100 pt-4">
                    <h2 className="text-lg font-bold text-dark-950">{content.donor.heading}</h2>
                    <div className="mt-3 grid gap-3 md:grid-cols-3">
                      <div>
                        <label htmlFor="donor-name" className="mb-1.5 block text-xs font-bold text-dark-800">
                          {content.donor.nameLabel}
                        </label>
                        <input
                          id="donor-name"
                          name="donor-name"
                          type="text"
                          autoComplete="name"
                          required
                          value={donorName}
                          aria-invalid={Boolean(errors.name)}
                          aria-describedby={errors.name ? 'donor-name-error' : undefined}
                          onChange={(event) => setDonorName(event.target.value)}
                          className={inputClass}
                        />
                        {errors.name && (
                          <p id="donor-name-error" className="mt-1.5 text-xs font-semibold text-primary-700">
                            {errors.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="donor-email" className="mb-1.5 block text-xs font-bold text-dark-800">
                          {content.donor.emailLabel}{' '}
                          <span className="font-semibold text-dark-400">{content.donor.optionalSuffix}</span>
                        </label>
                        <input
                          id="donor-email"
                          name="donor-email"
                          type="email"
                          autoComplete="email"
                          dir="ltr"
                          value={donorEmail}
                          aria-invalid={Boolean(errors.email)}
                          aria-describedby={errors.email ? 'donor-email-error' : undefined}
                          onChange={(event) => setDonorEmail(event.target.value)}
                          className={inputClass}
                        />
                        {errors.email && (
                          <p id="donor-email-error" className="mt-1.5 text-xs font-semibold text-primary-700">
                            {errors.email}
                          </p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="donor-phone" className="mb-1.5 block text-xs font-bold text-dark-800">
                          {content.donor.phoneLabel}{' '}
                          <span className="font-semibold text-dark-400">{content.donor.optionalSuffix}</span>
                        </label>
                        <input
                          id="donor-phone"
                          name="donor-phone"
                          type="tel"
                          autoComplete="tel"
                          dir="ltr"
                          value={donorPhone}
                          onChange={(event) => setDonorPhone(event.target.value)}
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </div>

                  {/* The long bank handover warning was intentionally removed.
                      The card number is still entered only on the bank's hosted page. */}
                  <div className="border-t border-primary-100 pt-4">
                    <label className="flex cursor-pointer items-start gap-2.5 rounded-xl bg-primary-50/45 px-3 py-2.5 text-xs leading-relaxed text-dark-700">
                      <input
                        type="checkbox"
                        checked={consent}
                        aria-invalid={Boolean(errors.consent)}
                        onChange={(event) => setConsent(event.target.checked)}
                        className="mt-0.5 h-4 w-4 shrink-0 accent-primary-600"
                      />
                      {content.consentLabel}
                    </label>
                    {errors.consent && (
                      <p className="mt-1.5 text-xs font-semibold text-primary-700">{errors.consent}</p>
                    )}
                  </div>

                  {submitError && (
                    <div
                      role="alert"
                      className="flex items-start gap-2.5 rounded-xl border border-primary-200 bg-primary-50 px-3 py-2.5"
                    >
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-primary-700" aria-hidden="true" />
                      <p className="text-xs font-semibold leading-relaxed text-primary-800">{submitError}</p>
                    </div>
                  )}

                  <div>
                    <button
                      type="submit"
                      className="btn-border-run inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-primary-600 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {submitting ? (
                        <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                      ) : (
                        <HandHeart className="h-5 w-5" aria-hidden="true" />
                      )}
                      {submitting ? content.submitProcessing : content.submitIdle}
                      {amountValue && Number.isFinite(amountValue) && amountValue > 0
                        ? ` — ${formatAmount(amountValue, locale, limits.currency)}`
                        : ''}
                    </button>
                    <p className="mt-1.5 text-center text-[11px] font-semibold leading-relaxed text-dark-500">
                      {content.redirectNote}
                    </p>
                  </div>
                </fieldset>
              </form>
            </FadeContent>
          </div>
        </section>
      </main>
    </>
  );
}
