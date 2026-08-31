import { PAYMENT_LIMITS, paymentMode } from '../_lib/env';
import { methodNotAllowed, sendJson, type ApiRequest, type ApiResponse } from '../_lib/http';

/** Public checkout configuration; lets the page show the test-mode banner. */
export default function handler(req: ApiRequest, res: ApiResponse): void {
  if (req.method !== 'GET') {
    methodNotAllowed(res, 'GET');
    return;
  }
  sendJson(res, 200, {
    ok: true,
    mode: paymentMode(),
    currency: PAYMENT_LIMITS.currency,
    minAmount: PAYMENT_LIMITS.minAmount,
    maxAmount: PAYMENT_LIMITS.maxAmount,
    presets: PAYMENT_LIMITS.presets,
  });
}
