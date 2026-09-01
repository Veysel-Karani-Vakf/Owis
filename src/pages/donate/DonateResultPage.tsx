import { CheckCircle2, FlaskConical, Loader2, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import PageSeo from '@/components/internal/PageSeo';
import { contributeContactRoute, donateCheckoutRoute, donateRoute } from '@/data/donate';
import { getDonateResultContent } from '@/data/donateCheckout';
import { useI18n } from '@/i18n/useI18n';
import { fetchPaymentStatus, type PaymentStatus } from '@/services/donationPayments';

const localeTags: Record<string, string> = { ar: 'ar', tr: 'tr-TR', en: 'en-US' };

function formatAmount(amount: number, locale: string, currency: string): string {
  return new Intl.NumberFormat(localeTags[locale] ?? 'en-US', {
    style: 'currency',
    currency: currency || 'USD',
  }).format(amount);
}

type ViewState = 'loading' | 'success' | 'failure' | 'not-found';

const primaryButtonClass =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary-600 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600';
const secondaryButtonClass =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-primary-200 bg-white px-6 py-2.5 text-sm font-bold text-primary-700 transition-colors hover:border-primary-400 hover:bg-primary-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600';

export default function DonateResultPage() {
  const { locale } = useI18n();
  const content = getDonateResultContent(locale);
  const [searchParams] = useSearchParams();
  const oid = searchParams.get('oid') ?? '';
  const flowError = searchParams.get('error');

  const [view, setView] = useState<ViewState>(flowError || !oid ? 'failure' : 'loading');
  const [payment, setPayment] = useState<PaymentStatus | null>(null);

  useEffect(() => {
    if (!oid || flowError) {
      setView(flowError === 'unknown' || !oid ? 'not-found' : 'failure');
      return;
    }
    let cancelled = false;

    const load = async (attempt: number) => {
      const loaded = await fetchPaymentStatus(oid);
      if (cancelled) return;
      if (!loaded) {
        setView('not-found');
        return;
      }
      // A pending row means the callback update is still settling; retry a
      // couple of times, then admit we could not verify it.
      if (loaded.status === 'pending') {
        if (attempt < 2) {
          setTimeout(() => {
            if (!cancelled) void load(attempt + 1);
          }, 1200);
        } else {
          setView('not-found');
        }
        return;
      }
      setPayment(loaded);
      setView(loaded.status === 'paid' ? 'success' : 'failure');
    };

    void load(0);
    return () => {
      cancelled = true;
    };
  }, [oid, flowError]);

  const retryRoute = payment?.opportunitySlug ? donateCheckoutRoute(payment.opportunitySlug) : donateRoute;

  return (
    <>
      <PageSeo title={content.seo.title} description={content.seo.description} />
      <main className="bg-[#faf8f8]">
        <section className="flex min-h-[70vh] items-center py-20 md:py-28">
          <div className="mx-auto w-full max-w-2xl px-4 md:px-8">
            <div className="rounded-[22px] border border-primary-100 bg-white p-8 text-center shadow-[0_18px_48px_rgba(40,12,18,0.07)] md:p-10">
              {view === 'loading' && (
                <div role="status" className="py-10">
                  <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary-600" aria-hidden="true" />
                  <p className="mt-5 text-base font-semibold text-dark-700">{content.loading}</p>
                </div>
              )}

              {view === 'success' && payment && (
                <div>
                  <CheckCircle2 className="mx-auto h-14 w-14 text-green-600" aria-hidden="true" />
                  <h1 className="mt-5 text-2xl font-bold text-dark-950 md:text-3xl">{content.success.title}</h1>
                  <p className="mt-3 text-base leading-relaxed text-dark-600">{content.success.description}</p>

                  {payment.mode !== 'production' && (
                    <p className="mx-auto mt-5 flex w-fit items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-bold text-amber-800">
                      <FlaskConical className="h-4 w-4" aria-hidden="true" />
                      {content.success.testNote}
                    </p>
                  )}

                  <dl className="mt-7 grid gap-3 rounded-2xl border border-primary-100 bg-primary-50/40 p-5 text-start text-sm">
                    <div className="flex items-center justify-between gap-4">
                      <dt className="font-bold text-dark-600">{content.success.amountLabel}</dt>
                      <dd className="text-lg font-black text-dark-950">{formatAmount(payment.amount, locale, payment.currency)}</dd>
                    </div>
                    {payment.opportunityTitle && (
                      <div className="flex items-center justify-between gap-4">
                        <dt className="font-bold text-dark-600">{content.success.opportunityLabel}</dt>
                        <dd className="font-bold text-dark-900">{payment.opportunityTitle}</dd>
                      </div>
                    )}
                    <div className="flex items-center justify-between gap-4">
                      <dt className="font-bold text-dark-600">{content.success.donorLabel}</dt>
                      <dd className="font-bold text-dark-900">{payment.donorName}</dd>
                    </div>
                    {payment.authCode && (
                      <div className="flex items-center justify-between gap-4">
                        <dt className="font-bold text-dark-600">{content.success.referenceLabel}</dt>
                        <dd dir="ltr" className="font-mono font-bold text-dark-900">
                          {payment.authCode}
                        </dd>
                      </div>
                    )}
                  </dl>

                  <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                    <Link to={donateRoute} className={primaryButtonClass}>
                      {content.backToDonate}
                    </Link>
                    <Link to="/" className={secondaryButtonClass}>
                      {content.home}
                    </Link>
                  </div>
                </div>
              )}

              {view === 'failure' && (
                <div>
                  <XCircle className="mx-auto h-14 w-14 text-primary-600" aria-hidden="true" />
                  <h1 className="mt-5 text-2xl font-bold text-dark-950 md:text-3xl">{content.failure.title}</h1>
                  <p className="mt-3 text-base leading-relaxed text-dark-600">{content.failure.description}</p>
                  {payment?.errorMessage && (
                    <p className="mx-auto mt-5 w-fit rounded-full border border-primary-100 bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-800">
                      {content.failure.reasonLabel}: <span dir="ltr">{payment.errorMessage}</span>
                    </p>
                  )}
                  <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                    <Link to={retryRoute} className={primaryButtonClass}>
                      {content.failure.retry}
                    </Link>
                    <Link to={contributeContactRoute} className={secondaryButtonClass}>
                      {content.failure.contact}
                    </Link>
                  </div>
                </div>
              )}

              {view === 'not-found' && (
                <div>
                  <XCircle className="mx-auto h-14 w-14 text-primary-600" aria-hidden="true" />
                  <h1 className="mt-5 text-2xl font-bold text-dark-950 md:text-3xl">{content.notFound.title}</h1>
                  <p className="mt-3 text-base leading-relaxed text-dark-600">{content.notFound.description}</p>
                  <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                    <Link to={donateRoute} className={primaryButtonClass}>
                      {content.backToDonate}
                    </Link>
                    <Link to={contributeContactRoute} className={secondaryButtonClass}>
                      {content.failure.contact}
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
