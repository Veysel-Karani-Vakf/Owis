import { createPayment, getOpportunityBySlug, type PaymentLocale } from '../_lib/db';
import {
  PAYMENT_GATEWAY_CURRENCY,
  PAYMENT_LIMITS,
  paymentClientId,
  paymentGateUrl,
  paymentStoreKey,
  siteOrigin,
} from '../_lib/env';
import { convertUsdToTry, getIsbankUsdBuyingRate } from '../_lib/isbankFx';
import {
  methodNotAllowed,
  readJsonBody,
  sendJson,
  type ApiRequest,
  type ApiResponse,
} from '../_lib/http';
import { buildGateRequestFields, newOrderId } from '../_lib/nestpay';

type DirectErrorCode = 'invalid-amount' | 'unavailable' | 'server-error';

function fail(res: ApiResponse, status: number, error: DirectErrorCode): void {
  sendJson(res, status, { ok: false, error });
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

const LOCALES: PaymentLocale[] = ['ar', 'tr', 'en'];

function anonymousDonorName(locale: PaymentLocale): string {
  if (locale === 'ar') return 'متبرع';
  if (locale === 'tr') return 'Bağışçı';
  return 'Donor';
}

/**
 * Direct payment endpoint used by the /donate store.
 *
 * SECURITY:
 * The browser NEVER sends the contribution amount here.
 * The official USD amount is loaded from Supabase by slug, then converted on
 * the server to TRY using İş Bankası USD Banka Alış.
 */
export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  if (req.method !== 'POST') {
    methodNotAllowed(res, 'POST');
    return;
  }

  const body = await readJsonBody(req);
  const slug = asString(body.slug).trim().slice(0, 120);
  const rawLocale = asString(body.locale);
  const locale: PaymentLocale = (LOCALES as string[]).includes(rawLocale)
    ? (rawLocale as PaymentLocale)
    : 'en';

  if (!slug) {
    fail(res, 400, 'unavailable');
    return;
  }

  try {
    const opportunity = await getOpportunityBySlug(slug, locale);

    if (!opportunity || !opportunity.available) {
      fail(res, 400, 'unavailable');
      return;
    }

    const originalAmount = opportunity.amount;
    if (
      originalAmount === null ||
      !Number.isFinite(originalAmount) ||
      originalAmount < PAYMENT_LIMITS.minAmount ||
      originalAmount > PAYMENT_LIMITS.maxAmount
    ) {
      console.error('payments/direct: invalid official opportunity amount', {
        slug,
        amount: originalAmount,
      });
      fail(res, 400, 'invalid-amount');
      return;
    }

    const quote = await getIsbankUsdBuyingRate();
    const chargedAmount = convertUsdToTry(originalAmount, quote.rate);
    const oid = newOrderId();

    await createPayment({
      oid,
      opportunitySlug: opportunity.slug,
      opportunityTitle: opportunity.title,
      donorName: anonymousDonorName(locale),
      donorEmail: null,
      donorPhone: null,
      locale,
      amount: chargedAmount,
      currency: PAYMENT_GATEWAY_CURRENCY.currency,
      originalAmount,
      originalCurrency: PAYMENT_LIMITS.currency,
      fxRate: quote.rate,
      fxSource: quote.source,
      fxQuotedAt: quote.fetchedAt,
    });

    const origin = siteOrigin(req);
    const callbackUrl = `${origin}/api/payments/callback`;

    const fields = buildGateRequestFields({
      clientId: paymentClientId(),
      storeKey: paymentStoreKey(),
      oid,
      amount: chargedAmount,
      currencyCode: PAYMENT_GATEWAY_CURRENCY.currencyCode,
      okUrl: callbackUrl,
      failUrl: callbackUrl,
      lang: locale === 'tr' ? 'tr' : 'en',
    });

    sendJson(res, 200, {
      ok: true,
      oid,
      gateUrl: paymentGateUrl(origin),
      fields,
    });
  } catch (error) {
    console.error(
      'payments/direct failed:',
      error instanceof Error ? error.message : 'unknown',
    );
    fail(res, 500, 'server-error');
  }
}
