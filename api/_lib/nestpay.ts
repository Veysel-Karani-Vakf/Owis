// NestPay (Payten/Asseco EST) protocol helpers — the İş Bankası virtual POS
// speaks this protocol. Everything gateway-specific lives in this one file so
// the field names and hash quirks can be corrected against the bank's own
// integration guide when the real credentials arrive.
import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';

/** ver3 hashing ignores these parameter names (case-insensitive). */
const HASH_EXCLUDED = new Set(['hash', 'encoding', 'countdown']);

export function escapeNestpayValue(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/\|/g, '\\|');
}

/**
 * NestPay "ver3" plaintext: every posted parameter except hash/encoding/
 * countdown, sorted by name (case-insensitive), values escaped and joined
 * with |, with the escaped store key appended last.
 */
export function ver3Plaintext(params: Record<string, string>, storeKey: string): string {
  const keys = Object.keys(params)
    .filter((key) => !HASH_EXCLUDED.has(key.toLowerCase()))
    .sort((a, b) => {
      const left = a.toLowerCase();
      const right = b.toLowerCase();
      return left < right ? -1 : left > right ? 1 : 0;
    });
  const values = keys.map((key) => escapeNestpayValue(params[key] ?? ''));
  return `${values.join('|')}|${escapeNestpayValue(storeKey)}`;
}

export function computeVer3Hash(params: Record<string, string>, storeKey: string): string {
  return createHash('sha512').update(ver3Plaintext(params, storeKey), 'utf8').digest('base64');
}

/** Verifies the hash/HASH field of a gateway request or callback. */
export function verifyVer3Hash(params: Record<string, string>, storeKey: string): boolean {
  const hashKey = Object.keys(params).find((key) => key.toLowerCase() === 'hash');
  const provided = hashKey ? params[hashKey] : '';
  if (!provided) return false;
  const expected = computeVer3Hash(params, storeKey);
  const providedBuffer = Buffer.from(provided, 'utf8');
  const expectedBuffer = Buffer.from(expected, 'utf8');
  if (providedBuffer.length !== expectedBuffer.length) return false;
  return timingSafeEqual(providedBuffer, expectedBuffer);
}

/** '250.00' — the decimal string format the gateway expects. */
export function formatGateAmount(amount: number): string {
  return amount.toFixed(2);
}

/** Random order id: 32 hex chars, doubles as the status-lookup token. */
export function newOrderId(): string {
  return randomBytes(16).toString('hex');
}

export type GateRequestInput = {
  clientId: string;
  storeKey: string;
  oid: string;
  /** Major units, e.g. 250 → '250.00'. */
  amount: number;
  /** ISO 4217 numeric code; TRY = '949'. */
  currencyCode: string;
  okUrl: string;
  failUrl: string;
  /** Gateway UI language; NestPay understands 'tr' and 'en'. */
  lang: 'tr' | 'en';
  card: { pan: string; expMonth: string; expYear: string; cv2: string };
};

/**
 * The signed field set the browser form-POSTs to the 3D gate (3d_pay model:
 * card on our page, 3-D Secure challenge at the bank).
 * NOTE for go-live review: TranType casing, 2-digit expiry year and the
 * Ecom_* field names follow the common NestPay integration guide — verify
 * against İş Bankası's document when real credentials arrive.
 */
export function buildGateRequestFields(input: GateRequestInput): Record<string, string> {
  const fields: Record<string, string> = {
    clientid: input.clientId,
    storetype: '3d_pay',
    TranType: 'Auth',
    amount: formatGateAmount(input.amount),
    currency: input.currencyCode,
    oid: input.oid,
    okUrl: input.okUrl,
    failUrl: input.failUrl,
    lang: input.lang,
    rnd: randomBytes(12).toString('hex'),
    taksit: '',
    refreshtime: '5',
    hashAlgorithm: 'ver3',
    pan: input.card.pan,
    Ecom_Payment_Card_ExpDate_Month: input.card.expMonth,
    Ecom_Payment_Card_ExpDate_Year: input.card.expYear,
    cv2: input.card.cv2,
  };
  fields.hash = computeVer3Hash(fields, input.storeKey);
  return fields;
}

export type GateCallbackInput = {
  clientId: string;
  storeKey: string;
  oid: string;
  amount: string;
  currencyCode: string;
  /** '1'..'4' = 3-D Secure verified; '0' etc. = failed. */
  mdStatus: string;
  /** '00' = approved. */
  procReturnCode: string;
  response: 'Approved' | 'Declined' | 'Error';
  authCode?: string;
  transId?: string;
  errMsg?: string;
  maskedPan: string;
};

/** The signed field set the (mock) bank posts back to okUrl/failUrl. */
export function buildGateCallbackFields(input: GateCallbackInput): Record<string, string> {
  const fields: Record<string, string> = {
    oid: input.oid,
    clientid: input.clientId,
    amount: input.amount,
    currency: input.currencyCode,
    rnd: randomBytes(12).toString('hex'),
    mdStatus: input.mdStatus,
    ProcReturnCode: input.procReturnCode,
    Response: input.response,
    AuthCode: input.authCode ?? '',
    TransId: input.transId ?? '',
    ErrMsg: input.errMsg ?? '',
    maskedCreditCard: input.maskedPan,
    'EXTRA.TRXDATE': new Date().toISOString(),
    hashAlgorithm: 'ver3',
  };
  fields.HASH = computeVer3Hash(fields, input.storeKey);
  return fields;
}

/** A callback means "paid" only when 3-D Secure AND the authorization passed. */
export function isPaidCallback(params: Record<string, string>): boolean {
  const mdStatus = params.mdStatus ?? '';
  const procReturnCode = params.ProcReturnCode ?? '';
  return ['1', '2', '3', '4'].includes(mdStatus) && procReturnCode === '00';
}

export function luhnValid(pan: string): boolean {
  if (!/^\d{13,19}$/.test(pan)) return false;
  let sum = 0;
  let double = false;
  for (let i = pan.length - 1; i >= 0; i -= 1) {
    let digit = pan.charCodeAt(i) - 48;
    if (double) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    double = !double;
  }
  return sum % 10 === 0;
}

export function maskPan(pan: string): string {
  if (pan.length < 10) return '*'.repeat(pan.length);
  return `${pan.slice(0, 6)}${'*'.repeat(pan.length - 10)}${pan.slice(-4)}`;
}

/** True when MM/YY is this month or later. */
export function expiryInFuture(expMonth: string, expYear: string): boolean {
  const month = Number(expMonth);
  const year = Number(expYear);
  if (!Number.isInteger(month) || month < 1 || month > 12) return false;
  if (!Number.isInteger(year) || year < 0 || year > 99) return false;
  const now = new Date();
  const fullYear = 2000 + year;
  return fullYear > now.getFullYear() || (fullYear === now.getFullYear() && month >= now.getMonth() + 1);
}
