import { getPaymentByOid } from '../_lib/db';
import { methodNotAllowed, readQuery, sendJson, type ApiRequest, type ApiResponse } from '../_lib/http';

/**
 * Result-page lookup. The 128-bit random oid is the bearer token: only
 * someone who completed (or was redirected from) the payment knows it.
 */
export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  if (req.method !== 'GET') {
    methodNotAllowed(res, 'GET');
    return;
  }

  const oid = readQuery(req).get('oid')?.trim() ?? '';
  if (!/^[0-9a-f]{32}$/i.test(oid)) {
    sendJson(res, 404, { ok: false, error: 'not-found' });
    return;
  }

  try {
    const payment = await getPaymentByOid(oid);
    if (!payment) {
      sendJson(res, 404, { ok: false, error: 'not-found' });
      return;
    }
    sendJson(res, 200, {
      ok: true,
      payment: {
        oid: payment.oid,
        status: payment.status,
        amount: Number(payment.amount),
        currency: payment.currency,
        opportunitySlug: payment.opportunity_slug,
        opportunityTitle: payment.opportunity_title,
        donorName: payment.donor_name,
        authCode: payment.auth_code,
        errorMessage: payment.error_message,
        mode: payment.gateway_mode,
        createdAt: payment.created_at,
      },
    });
  } catch (error) {
    console.error('payments/status failed:', error instanceof Error ? error.message : 'unknown');
    sendJson(res, 500, { ok: false, error: 'server-error' });
  }
}
