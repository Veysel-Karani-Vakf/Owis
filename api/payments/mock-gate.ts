import { paymentMode, paymentStoreKey } from '../_lib/env';
import { methodNotAllowed, readFormBody, sendHtml, type ApiRequest, type ApiResponse } from '../_lib/http';
import {
  autoSubmitPage,
  cardEntryPage,
  challengePage,
  gateErrorPage,
  mockCardBehavior,
  mockLang,
  type CardEntryError,
} from '../_lib/mock';
import {
  buildGateCallbackFields,
  expiryInFuture,
  luhnValid,
  maskPan,
  verifyVer3Hash,
} from '../_lib/nestpay';

/** The signed order fields we echo back through the hosted card form. */
const ORDER_FIELDS = [
  'clientid',
  'storetype',
  'islemtipi',
  'amount',
  'currency',
  'oid',
  'okUrl',
  'failUrl',
  'lang',
  'rnd',
  'taksit',
  'refreshtime',
  'encoding',
  'hashAlgorithm',
  'hash',
] as const;

function randomAuthCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function pickOrderFields(params: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const name of ORDER_FIELDS) {
    if (params[name] !== undefined) out[name] = params[name];
  }
  return out;
}

/**
 * The simulated İş Bankası 3D gate, hosting model (`3d_pay_hosting`).
 *
 * Step 1 — our checkout posts the signed order (no card). We verify the hash
 * and render the bank's own card form.
 * Step 2 — that form posts back here with the card plus the same signed order
 * fields. We verify the hash again, validate the card, then run the 3-D Secure
 * challenge and post the signed outcome to okUrl/failUrl.
 *
 * Only exists in mock mode — any other PAYMENT_MODE gets a 404.
 */
export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  if (paymentMode() !== 'mock') {
    res.statusCode = 404;
    res.end('Not Found');
    return;
  }
  if (req.method !== 'POST') {
    methodNotAllowed(res, 'POST');
    return;
  }

  const params = await readFormBody(req);
  const lang = mockLang(params.lang);
  const storeKey = paymentStoreKey();

  // A real gate rejects a tampered or unsigned request outright — no callback.
  // The card fields are added by the gate's own form and are excluded here, so
  // the same signature covers both steps.
  if (!verifyVer3Hash(pickOrderFields(params), storeKey)) {
    sendHtml(res, 400, gateErrorPage(lang, 'Hash verification failed (mock gate).'));
    return;
  }

  const oid = params.oid ?? '';
  const amount = params.amount ?? '';
  const clientId = params.clientid ?? '';
  const okUrl = params.okUrl ?? '';
  const failUrl = params.failUrl ?? '';
  if (!oid || !amount || !clientId || !okUrl || !failUrl) {
    sendHtml(res, 400, gateErrorPage(lang, 'Missing required gate parameters (mock gate).'));
    return;
  }

  const currencyCode = params.currency ?? '840';
  const common = { clientId, storeKey, oid, amount, currencyCode };
  const amountLabelValue = `${amount} ${currencyCode === '949' ? 'TRY' : 'USD'}`;
  const orderFields = pickOrderFields(params);

  // The signed "donor cancelled at the bank" outcome, available on both steps.
  const cancelFields = buildGateCallbackFields({
    ...common,
    maskedPan: '',
    mdStatus: '0',
    procReturnCode: '99',
    response: 'Declined',
    errMsg: '3-D Secure authentication cancelled',
  });

  const renderCardForm = (
    error?: CardEntryError,
    values?: { pan?: string; holder?: string; expiry?: string; cvv?: string },
  ) =>
    sendHtml(
      res,
      200,
      cardEntryPage({
        lang,
        amountLabelValue,
        oid,
        actionUrl: '/api/payments/mock-gate',
        cancelUrl: failUrl,
        orderFields,
        cancelFields,
        values,
        error,
      }),
    );

  // --- Step 1: no card yet — show the bank's hosted card form. -------------
  const rawPan = params.pan ?? '';
  if (!rawPan.trim()) {
    renderCardForm();
    return;
  }

  // --- Step 2: the card was entered on this page. --------------------------
  const pan = rawPan.replace(/\D/g, '');
  const holder = (params.cardHolderName ?? '').trim();
  const rawExpiry = (params.expiry ?? '').trim();
  const [expMonth = '', expYear = ''] = rawExpiry.split('/');
  const cv2 = (params.cv2 ?? '').replace(/\D/g, '');
  const echo = { pan: rawPan, holder, expiry: rawExpiry, cvv: cv2 };

  if (!luhnValid(pan)) {
    renderCardForm('cardInvalid', echo);
    return;
  }
  if (!expiryInFuture(expMonth.padStart(2, '0'), expYear)) {
    renderCardForm('expiryInvalid', echo);
    return;
  }
  if (!/^\d{3,4}$/.test(cv2)) {
    renderCardForm('cvvInvalid', echo);
    return;
  }

  const masked = maskPan(pan);
  const withCard = { ...common, maskedPan: masked };
  const behavior = mockCardBehavior(pan);

  if (behavior === 'fail-3ds') {
    const fields = buildGateCallbackFields({
      ...withCard,
      mdStatus: '0',
      procReturnCode: '99',
      response: 'Declined',
      errMsg: '3-D Secure authentication failed',
    });
    sendHtml(res, 200, autoSubmitPage({ lang, targetUrl: failUrl, fields }));
    return;
  }

  if (behavior === 'decline-51') {
    const fields = buildGateCallbackFields({
      ...withCard,
      mdStatus: '1',
      procReturnCode: '51',
      response: 'Declined',
      errMsg: 'Insufficient funds',
    });
    sendHtml(res, 200, autoSubmitPage({ lang, targetUrl: failUrl, fields }));
    return;
  }

  // Interactive challenge: both outcomes are signed now, the visitor picks one.
  const approveFields = buildGateCallbackFields({
    ...withCard,
    mdStatus: '1',
    procReturnCode: '00',
    response: 'Approved',
    authCode: randomAuthCode(),
    transId: `MOCK-${oid.slice(0, 12).toUpperCase()}`,
  });
  const declineFields = buildGateCallbackFields({
    ...withCard,
    mdStatus: '0',
    procReturnCode: '99',
    response: 'Declined',
    errMsg: '3-D Secure authentication cancelled',
  });

  sendHtml(
    res,
    200,
    challengePage({
      lang,
      amountLabelValue,
      oid,
      maskedPan: masked,
      okUrl,
      failUrl,
      approveFields,
      declineFields,
    }),
  );
}
