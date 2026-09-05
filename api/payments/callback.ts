import { finalizePayment, getPaymentByOid } from '../_lib/db';
import { paymentClientId, paymentStoreKey, siteOrigin } from '../_lib/env';
import { readFormBody, readFormBodyBinary, redirect303, type ApiRequest, type ApiResponse } from '../_lib/http';
import { decodeGateParams, isPaidCallback, matchVer3Hash, VER3_BINARY_VARIANTS } from '../_lib/nestpay';

/** Gateway params worth keeping on the row; never card data. */
const RAW_RESPONSE_KEYS = [
  'oid',
  'clientid',
  'amount',
  'currency',
  'rnd',
  'mdStatus',
  'ProcReturnCode',
  'Response',
  'AuthCode',
  'TransId',
  'ErrMsg',
  'mdErrorMsg',
  'HostRefNum',
  'maskedCreditCard',
  'MaskedPan',
  'storetype',
  'eci',
  'txstatus',
  'EXTRA.TRXDATE',
  'EXTRA.CARDBRAND',
  'EXTRA.CARDISSUER',
  'EXTRA.HOSTMSG',
  'hashAlgorithm',
];

/**
 * okUrl AND failUrl of the gateway (the outcome is decided from the signed
 * fields, not from which URL was hit). Ends every branch in a 303 redirect so
 * the visitor always lands on the SPA result page.
 */
export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  const origin = siteOrigin(req);
  const resultUrl = (query: string) => `${origin}/donate/result?${query}`;
  // Error redirects carry the order id so the donor can quote a reference:
  // the bank may already have charged when verification or persistence fails.
  let oid = '';
  const withOid = (query: string) => (/^[0-9a-f]{32}$/i.test(oid) ? `${query}&oid=${oid}` : query);

  // Banks POST the 3-D result; anything else goes back to the donate page.
  if (req.method !== 'POST') {
    redirect303(res, `${origin}/donate`);
    return;
  }

  try {
    // Verify over the exact bytes the bank posted (its charset is ISO-8859-9
    // unless told otherwise); the platform-parsed body is the fallback.
    const binary = await readFormBodyBinary(req);
    const params = binary ? decodeGateParams(binary) : await readFormBody(req);

    oid = params.oid ?? '';
    const storeKey = paymentStoreKey();
    const hashMatch =
      (binary && matchVer3Hash(binary, storeKey, VER3_BINARY_VARIANTS)) || matchVer3Hash(params, storeKey);
    if (!hashMatch) {
      // Diagnostics for a go-live mismatch: field NAMES only, never values.
      console.error('payments/callback: hash mismatch', {
        oid,
        hashAlgorithm: params.hashAlgorithm ?? null,
        encoding: params.encoding ?? null,
        rawBytes: binary !== null,
        fields: Object.keys(params).sort(),
      });
      redirect303(res, resultUrl(withOid('error=verify')));
      return;
    }
    if (hashMatch.ordering !== 'natural' || hashMatch.encoding === 'latin5') {
      console.warn('payments/callback: hash matched a fallback variant', hashMatch);
    }

    const payment = oid ? await getPaymentByOid(oid) : null;
    if (!payment) {
      redirect303(res, resultUrl('error=unknown'));
      return;
    }

    // Replay safety: a finished payment is never rewritten, just shown.
    if (payment.status !== 'pending') {
      redirect303(res, resultUrl(`oid=${encodeURIComponent(oid)}`));
      return;
    }

    // The hash proves the gate signed it; these prove it matches OUR order.
    const clientMatches = (params.clientid ?? '') === paymentClientId();
    // Real gates may echo the amount as "250", "250.0" or "250.00": compare
    // numerically (to the cent) rather than by exact string.
    const returnedAmount = Number((params.amount ?? '').replace(',', '.'));
    const amountMatches =
      Number.isFinite(returnedAmount) &&
      Math.round(returnedAmount * 100) === Math.round(Number(payment.amount) * 100);
    if (!clientMatches || !amountMatches) {
      console.error('payments/callback: order mismatch', { oid, clientMatches, amountMatches });
      redirect303(res, resultUrl(withOid('error=verify')));
      return;
    }

    const rawResponse: Record<string, string> = {};
    for (const key of RAW_RESPONSE_KEYS) {
      if (params[key] !== undefined) rawResponse[key] = params[key];
    }

    await finalizePayment(oid, {
      status: isPaidCallback(params) ? 'paid' : 'failed',
      mdStatus: params.mdStatus ?? null,
      procReturnCode: params.ProcReturnCode ?? null,
      authCode: params.AuthCode || null,
      transId: params.TransId || null,
      // A 3-D Secure failure often leaves ErrMsg empty and explains itself in mdErrorMsg.
      errorMessage: params.ErrMsg || params.mdErrorMsg || null,
      maskedPan: params.maskedCreditCard || params.MaskedPan || null,
      rawResponse,
    });

    redirect303(res, resultUrl(`oid=${encodeURIComponent(oid)}`));
  } catch (error) {
    console.error('payments/callback failed:', { oid, error: error instanceof Error ? error.message : 'unknown' });
    redirect303(res, resultUrl(withOid('error=server')));
  }
}
