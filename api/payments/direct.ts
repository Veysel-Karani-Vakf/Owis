import { createPayment, getOpportunityBySlug, type PaymentLocale } from '../_lib/db';
import {
  PAYMENT_LIMITS,
  paymentClientId,
  paymentGateUrl,
  paymentStoreKey,
  siteOrigin,
} from '../_lib/env';
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
 * The official amount is loaded from Supabase by slug.
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

    const amount = opportunity.amount;
    if (
      amount === null ||
      !Number.isFinite(amount) ||
      amount < PAYMENT_LIMITS.minAmount ||
      amount > PAYMENT_LIMITS.maxAmount
    ) {
      console.error('payments/direct: invalid official opportunity amount', {
        slug,
        amount,
      });
      fail(res, 400, 'invalid-amount');
      return;
    }

    const oid = newOrderId();

    await createPayment({
      oid,
      opportunitySlug: opportunity.slug,
      opportunityTitle: opportunity.title,
      donorName: anonymousDonorName(locale),
      donorEmail: null,
      donorPhone: null,
      locale,
      amount,
      currency: PAYMENT_LIMITS.currency,
    });

    const origin = siteOrigin(req);
    const callbackUrl = `${origin}/api/payments/callback`;

    const fields = buildGateRequestFields({
      clientId: paymentClientId(),
      storeKey: paymentStoreKey(),
      oid,
      amount,
      currencyCode: PAYMENT_LIMITS.currencyCode,
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
