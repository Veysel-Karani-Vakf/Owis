import { paymentMode, paymentStoreKey } from '../_lib/env';
import { methodNotAllowed, readFormBody, sendHtml, type ApiRequest, type ApiResponse } from '../_lib/http';
import {
  autoSubmitPage,
  challengePage,
  gateErrorPage,
  mockCardBehavior,
  mockLang,
} from '../_lib/mock';
import {
  buildGateCallbackFields,
  expiryInFuture,
  maskPan,
  verifyVer3Hash,
} from '../_lib/nestpay';

function randomAuthCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

/**
 * The simulated İş Bankası 3D gate. Enforces the same hash discipline the
 * real bank does, then either renders an approve/decline challenge page or
 * auto-posts a signed outcome for the special test cards. Only exists in
 * mock mode — any other PAYMENT_MODE gets a 404.
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
  if (!verifyVer3Hash(params, storeKey)) {
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

  const pan = (params.pan ?? '').replace(/\D/g, '');
  const masked = maskPan(pan);
  const common = {
    clientId,
    storeKey,
    oid,
    amount,
    currencyCode: params.currency ?? '840',
    maskedPan: masked,
  };

  if (!expiryInFuture(params.Ecom_Payment_Card_ExpDate_Month ?? '', params.Ecom_Payment_Card_ExpDate_Year ?? '')) {
    sendHtml(res, 400, gateErrorPage(lang, 'Card expired (mock gate).'));
    return;
  }

  const behavior = mockCardBehavior(pan);

  if (behavior === 'fail-3ds') {
    const fields = buildGateCallbackFields({
      ...common,
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
      ...common,
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
    ...common,
    mdStatus: '1',
    procReturnCode: '00',
    response: 'Approved',
    authCode: randomAuthCode(),
    transId: `MOCK-${oid.slice(0, 12).toUpperCase()}`,
  });
  const declineFields = buildGateCallbackFields({
    ...common,
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
      amountLabelValue: `${amount} ${params.currency === '949' ? 'TRY' : 'USD'}`,
      oid,
      maskedPan: masked,
      okUrl,
      failUrl,
      approveFields,
      declineFields,
    }),
  );
}
