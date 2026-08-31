import { finalizePayment, getPaymentByOid } from '../_lib/db';
import { paymentClientId, paymentStoreKey, siteOrigin } from '../_lib/env';
import { readFormBody, redirect303, type ApiRequest, type ApiResponse } from '../_lib/http';
import { formatGateAmount, isPaidCallback, verifyVer3Hash } from '../_lib/nestpay';

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
  'maskedCreditCard',
  'MaskedPan',
  'EXTRA.TRXDATE',
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

  // Banks POST the 3-D result; anything else goes back to the donate page.
  if (req.method !== 'POST') {
    redirect303(res, `${origin}/donate`);
    return;
  }

  try {
    const params = await readFormBody(req);

    if (!verifyVer3Hash(params, paymentStoreKey())) {
      redirect303(res, resultUrl('error=verify'));
      return;
    }

    const oid = params.oid ?? '';
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
    const amountMatches = (params.amount ?? '') === formatGateAmount(Number(payment.amount));
    if (!clientMatches || !amountMatches) {
      redirect303(res, resultUrl('error=verify'));
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
      errorMessage: params.ErrMsg || null,
      maskedPan: params.maskedCreditCard || params.MaskedPan || null,
      rawResponse,
    });

    redirect303(res, resultUrl(`oid=${encodeURIComponent(oid)}`));
  } catch (error) {
    console.error('payments/callback failed:', error instanceof Error ? error.message : 'unknown');
    redirect303(res, resultUrl('error=server'));
  }
}
