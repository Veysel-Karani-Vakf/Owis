import { createPayment, getOpportunityBySlug, type PaymentLocale } from '../_lib/db';
import { PAYMENT_LIMITS, paymentClientId, paymentGateUrl, paymentStoreKey, siteOrigin } from '../_lib/env';
import { methodNotAllowed, readJsonBody, sendJson, type ApiRequest, type ApiResponse } from '../_lib/http';
import { buildGateRequestFields, expiryInFuture, luhnValid, newOrderId } from '../_lib/nestpay';

type CreateErrorCode =
  | 'invalid-amount'
  | 'invalid-name'
  | 'invalid-email'
  | 'invalid-card'
  | 'invalid-expiry'
  | 'invalid-cvv'
  | 'unavailable'
  | 'server-error';

function fail(res: ApiResponse, status: number, error: CreateErrorCode): void {
  sendJson(res, status, { ok: false, error });
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

const LOCALES: PaymentLocale[] = ['ar', 'tr', 'en'];

/**
 * Validates the checkout submission, records a pending payment and returns
 * the signed field set the browser must form-POST to the 3D gate.
 * Card data passes through in memory only: it is neither persisted nor logged.
 */
export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  if (req.method !== 'POST') {
    methodNotAllowed(res, 'POST');
    return;
  }

  const body = await readJsonBody(req);
  const donor = asRecord(body.donor);
  const card = asRecord(body.card);

  const slug = asString(body.slug).trim().slice(0, 120);
  const titleSnapshot = asString(body.titleSnapshot).trim().slice(0, 200);
  const rawLocale = asString(body.locale);
  const locale: PaymentLocale = (LOCALES as string[]).includes(rawLocale)
    ? (rawLocale as PaymentLocale)
    : 'en';

  const amount = typeof body.amount === 'number' ? body.amount : Number(asString(body.amount));
  if (
    !Number.isFinite(amount) ||
    amount < PAYMENT_LIMITS.minAmount ||
    amount > PAYMENT_LIMITS.maxAmount ||
    Math.round(amount * 100) !== amount * 100
  ) {
    fail(res, 400, 'invalid-amount');
    return;
  }

  const donorName = asString(donor.name).trim();
  if (donorName.length < 2 || donorName.length > 120) {
    fail(res, 400, 'invalid-name');
    return;
  }
  const donorEmail = asString(donor.email).trim().slice(0, 200);
  if (donorEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(donorEmail)) {
    fail(res, 400, 'invalid-email');
    return;
  }
  const donorPhone = asString(donor.phone).trim().slice(0, 40);

  const pan = asString(card.pan).replace(/\D/g, '');
  if (!luhnValid(pan)) {
    fail(res, 400, 'invalid-card');
    return;
  }
  const expMonth = asString(card.expMonth).padStart(2, '0');
  const expYear = asString(card.expYear);
  if (!expiryInFuture(expMonth, expYear)) {
    fail(res, 400, 'invalid-expiry');
    return;
  }
  const cv2 = asString(card.cv2);
  if (!/^\d{3,4}$/.test(cv2)) {
    fail(res, 400, 'invalid-cvv');
    return;
  }

  try {
    // Prefer the live catalogue row (title in the donor's locale, current
    // availability); fall back to the client snapshot for static-only entries.
    let opportunityTitle = titleSnapshot || null;
    let opportunitySlug: string | null = slug || null;
    if (slug) {
      const opportunity = await getOpportunityBySlug(slug, locale);
      if (opportunity) {
        if (!opportunity.available) {
          fail(res, 400, 'unavailable');
          return;
        }
        opportunityTitle = opportunity.title || opportunityTitle;
        opportunitySlug = opportunity.slug;
      }
    }

    const oid = newOrderId();
    await createPayment({
      oid,
      opportunitySlug,
      opportunityTitle,
      donorName,
      donorEmail: donorEmail || null,
      donorPhone: donorPhone || null,
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
      card: { pan, expMonth, expYear, cv2 },
    });

    sendJson(res, 200, { ok: true, oid, gateUrl: paymentGateUrl(origin), fields });
  } catch (error) {
    // Never log the request body here: it contains card data.
    console.error('payments/create failed:', error instanceof Error ? error.message : 'unknown');
    fail(res, 500, 'server-error');
  }
}
