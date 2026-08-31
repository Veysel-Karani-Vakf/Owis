import { AlertTriangle, FlaskConical, HandHeart, Loader2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import FadeContent from '@/components/effects/FadeContent';
import CardFields, { type CardFieldValues } from '@/components/donate/CardFields';
import PageHero from '@/components/internal/PageHero';
import PageSeo from '@/components/internal/PageSeo';
import { donateRoute } from '@/data/donate';
import { getDonateCheckoutContent } from '@/data/donateCheckout';
import { useDonateContent } from '@/hooks/useCmsContent';
import { useI18n } from '@/i18n/useI18n';
import {
  createPayment,
  DEFAULT_PAYMENT_CONFIG,
  DonationPaymentError,
  expiryInFuture,
  fetchPaymentConfig,
  luhnValid,
  submitToGate,
  type PaymentConfig,
  type PaymentErrorCode,
} from '@/services/donationPayments';

const inputClass =
  'min-h-12 w-full rounded-2xl border border-primary-100 bg-white px-4 py-3 text-start text-sm font-medium text-dark-900 shadow-sm outline-none transition-colors placeholder:text-dark-400 focus:border-primary-400 focus:ring-4 focus:ring-primary-100';

const localeTags: Record<string, string> = { ar: 'ar', tr: 'tr-TR', en: 'en-US' };

function formatTry(amount: number, locale: string): string {
  return new Intl.NumberFormat(localeTags[locale] ?? 'en-US', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
  }).format(amount);
}

type FieldErrors = {
  amount?: string;
  name?: string;
  email?: string;
  number?: string;
  expiry?: string;
  cvv?: string;
  consent?: string;
};

export default function DonateCheckoutPage() {
  const { slug } = useParams();
  const { locale } = useI18n();
  const donatePage = useDonateContent(locale);
  const content = getDonateCheckoutContent(locale);

  const opportunity = useMemo(
    () => donatePage.opportunities.find((candidate) => candidate.id === slug),
    [donatePage.opportunities, slug],
  );

  const [config, setConfig] = useState<PaymentConfig>(DEFAULT_PAYMENT_CONFIG);
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [card, setCard] = useState<CardFieldValues>({ number: '', expiry: '', cvv: '' });
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

  if (!opportunity || !opportunity.available) {
    return <Navigate to={donateRoute} replace />;
  }

  const amountValue = customAmount.trim() !== '' ? Number(customAmount) : selectedPreset;

  const errorMessage = (code: PaymentErrorCode): string => {
    switch (code) {
      case 'invalid-amount':
        return content.errors.amount;
      case 'invalid-name':
        return content.errors.name;
      case 'invalid-email':
        return content.errors.email;
      case 'invalid-card':
        return content.errors.card;
      case 'invalid-expiry':
        return content.errors.expiry;
      case 'invalid-cvv':
        return content.errors.cvv;
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
    if (
      !Number.isFinite(amount) ||
      amount < config.minAmount ||
      amount > config.maxAmount ||
      Math.round(amount * 100) !== amount * 100
    ) {
      nextErrors.amount = content.errors.amount;
    }
    const name = donorName.trim();
    if (name.length < 2 || name.length > 120) nextErrors.name = content.errors.name;
    const email = donorEmail.trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = content.errors.email;

    const pan = card.number.replace(/\D/g, '');
    if (!luhnValid(pan)) nextErrors.number = content.errors.card;
    const [expMonth = '', expYear = ''] = card.expiry.split('/');
    if (!expiryInFuture(expMonth, expYear)) nextErrors.expiry = content.errors.expiry;
    if (!/^\d{3,4}$/.test(card.cvv)) nextErrors.cvv = content.errors.cvv;
    if (!consent) nextErrors.consent = content.errors.consent;

    setErrors(nextErrors);
    setSubmitError(null);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      const result = await createPayment({
        slug: opportunity.id,
        titleSnapshot: opportunity.title,
        amount,
        locale,
        donor: { name, email, phone: donorPhone.trim() },
        card: { pan, expMonth, expYear, cv2: card.cvv },
      });
      // Full-page handover to the (mock) bank; no state survives on purpose.
      submitToGate(result.gateUrl, result.fields);
    } catch (error) {
      const code = error instanceof DonationPaymentError ? error.code : 'server-error';
      setSubmitError(errorMessage(code));
      setSubmitting(false);
    }
  };

  const showTestBanner = config.mode !== 'production';

  return (
    <>
      <PageSeo title={content.seo.title} description={content.seo.description} />
      <main className="bg-white">
        <PageHero
          id="cms-checkout-hero"
          title={content.hero.title}
          description={content.hero.description}
          image={opportunity.image}
          imageAlt={opportunity.imageAlt}
          breadcrumbs={[
            { label: content.breadcrumbs.home, href: '/' },
            { label: content.breadcrumbs.donate, href: donateRoute },
            { label: opportunity.title },
          ]}
        />

        <section className="bg-[#faf8f8] py-16 md:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 md:px-8 lg:grid-cols-[0.9fr_1.1fr]">
            <FadeContent blur={false} duration={650} initialOpacity={0} yOffset={16} threshold={0.18} once>
              <div className="text-start">
                {showTestBanner && (
                  <div
                    id="cms-checkout-banner"
                    role="status"
                    className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-start"
                  >
                    <FlaskConical className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" aria-hidden="true" />
                    <div>
                      <p className="text-sm font-black text-amber-800">{content.testBanner.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-amber-700">{content.testBanner.description}</p>
                    </div>
                  </div>
                )}

                <div className="overflow-hidden rounded-[22px] border border-primary-100 bg-white shadow-[0_16px_42px_rgba(40,12,18,0.07)]">
                  <div className="relative aspect-[16/9] overflow-hidden bg-primary-50">
                    <img
                      src={opportunity.image}
                      alt={opportunity.imageAlt}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <p className="text-xs font-bold text-primary-700">{content.summary.heading}</p>
                    <h2 className="mt-2 text-2xl font-bold leading-tight text-dark-950">{opportunity.title}</h2>
                    <p className="mt-3 text-sm leading-relaxed text-dark-600">{opportunity.description}</p>
                    <div className="mt-5 rounded-2xl border border-primary-100 bg-primary-50/55 p-4">
                      <p className="text-xs font-bold text-primary-700">{content.summary.publishedValue}</p>
                      <p className="mt-1 text-xl font-black text-dark-950">{opportunity.price}</p>
                    </div>
                  </div>
                </div>

                {config.mode === 'mock' && (
                  <div id="cms-checkout-test-cards" className="mt-6 rounded-[22px] border border-primary-100 bg-white p-5 text-start shadow-[0_14px_36px_rgba(40,12,18,0.06)]">
                    <p className="text-sm font-black text-dark-900">{content.testCards.heading}</p>
                    <p className="mt-2 text-sm leading-relaxed text-dark-600">{content.testCards.description}</p>
                    <ul className="mt-3 space-y-2 text-sm text-dark-600">
                      <li className="flex flex-wrap items-center gap-2">
                        <code dir="ltr" className="rounded bg-primary-50 px-2 py-1 font-mono text-xs text-primary-800">
                          4508 0345 0803 4509
                        </code>
                        {content.testCards.approveLabel}
                      </li>
                      <li className="flex flex-wrap items-center gap-2">
                        <code dir="ltr" className="rounded bg-primary-50 px-2 py-1 font-mono text-xs text-primary-800">
                          4000 0000 0000 0002
                        </code>
                        {content.testCards.fail3dsLabel}
                      </li>
                      <li className="flex flex-wrap items-center gap-2">
                        <code dir="ltr" className="rounded bg-primary-50 px-2 py-1 font-mono text-xs text-primary-800">
                          4242 4242 4208 0069
                        </code>
                        {content.testCards.declineLabel}
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </FadeContent>

            <FadeContent blur={false} duration={650} initialOpacity={0} yOffset={16} threshold={0.18} once>
              <form
                id="cms-checkout-form"
                onSubmit={handleSubmit}
                noValidate
                className="rounded-[22px] border border-primary-100 bg-white p-6 text-start shadow-[0_18px_48px_rgba(40,12,18,0.06)] md:p-8"
              >
                <fieldset disabled={submitting} className="grid gap-8">
                  <div>
                    <h2 className="text-xl font-bold text-dark-950">{content.amount.heading}</h2>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {config.presets.map((preset) => {
                        const active = customAmount.trim() === '' && selectedPreset === preset;
                        return (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => {
                              setSelectedPreset(preset);
                              setCustomAmount('');
                            }}
                            aria-pressed={active}
                            className={`min-h-11 rounded-full border px-5 py-2 text-sm font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600 ${
                              active
                                ? 'border-primary-600 bg-primary-600 text-white'
                                : 'border-primary-100 bg-white text-dark-800 hover:border-primary-300 hover:text-primary-700'
                            }`}
                          >
                            {formatTry(preset, locale)}
                          </button>
                        );
                      })}
                    </div>
                    <div className="mt-4">
                      <label htmlFor="custom-amount" className="mb-2 block text-sm font-bold text-dark-800">
                        {content.amount.customLabel}
                      </label>
                      <input
                        id="custom-amount"
                        name="custom-amount"
                        type="number"
                        inputMode="decimal"
                        min={config.minAmount}
                        max={config.maxAmount}
                        step="0.01"
                        placeholder={content.amount.customPlaceholder}
                        value={customAmount}
                        aria-invalid={Boolean(errors.amount)}
                        aria-describedby={errors.amount ? 'amount-error' : undefined}
                        onChange={(event) => setCustomAmount(event.target.value)}
                        className={inputClass}
                      />
                      {errors.amount && (
                        <p id="amount-error" className="mt-2 text-xs font-semibold text-primary-700">
                          {errors.amount}
                        </p>
                      )}
                      <p className="mt-2 text-xs font-semibold text-dark-500">{content.amount.currencyNote}</p>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-dark-950">{content.donor.heading}</h2>
                    <div className="mt-4 grid gap-4">
                      <div>
                        <label htmlFor="donor-name" className="mb-2 block text-sm font-bold text-dark-800">
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
                          <p id="donor-name-error" className="mt-2 text-xs font-semibold text-primary-700">
                            {errors.name}
                          </p>
                        )}
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label htmlFor="donor-email" className="mb-2 block text-sm font-bold text-dark-800">
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
                            <p id="donor-email-error" className="mt-2 text-xs font-semibold text-primary-700">
                              {errors.email}
                            </p>
                          )}
                        </div>
                        <div>
                          <label htmlFor="donor-phone" className="mb-2 block text-sm font-bold text-dark-800">
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
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-dark-950">{content.card.heading}</h2>
                    <div className="mt-4">
                      <CardFields
                        values={card}
                        errors={errors}
                        labels={content.card}
                        disabled={submitting}
                        onChange={(field, value) => setCard((previous) => ({ ...previous, [field]: value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-dark-700">
                      <input
                        type="checkbox"
                        checked={consent}
                        aria-invalid={Boolean(errors.consent)}
                        onChange={(event) => setConsent(event.target.checked)}
                        className="mt-1 h-4 w-4 shrink-0 accent-primary-600"
                      />
                      {content.consentLabel}
                    </label>
                    {errors.consent && (
                      <p className="mt-2 text-xs font-semibold text-primary-700">{errors.consent}</p>
                    )}
                  </div>

                  {submitError && (
                    <div
                      role="alert"
                      className="flex items-start gap-3 rounded-2xl border border-primary-200 bg-primary-50 p-4"
                    >
                      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" aria-hidden="true" />
                      <p className="text-sm font-semibold leading-relaxed text-primary-800">{submitError}</p>
                    </div>
                  )}

                  <div>
                    <button
                      type="submit"
                      className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary-600 px-6 py-3 text-base font-bold text-white transition-colors hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {submitting ? (
                        <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                      ) : (
                        <HandHeart className="h-5 w-5" aria-hidden="true" />
                      )}
                      {submitting ? content.submitProcessing : content.submitIdle}
                      {amountValue && Number.isFinite(amountValue) && amountValue > 0
                        ? ` — ${formatTry(amountValue, locale)}`
                        : ''}
                    </button>
                    <p className="mt-3 text-xs font-semibold leading-relaxed text-dark-500">{content.redirectNote}</p>
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
