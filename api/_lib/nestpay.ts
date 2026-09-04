// NestPay (Payten/Asseco EST) protocol helpers — the İş Bankası virtual POS
// (est3Dgate) speaks this protocol. Everything gateway-specific lives in this
// one file. Field names and hashing follow the bank's ver3 "3D_PAY" model as
// implemented by the official Payten PHP sample: parameters sorted with
// PHP's natcasesort, values escaped and joined with '|', the store key
// appended last, SHA-512, base64.
import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';

/** ver3 hashing ignores these parameter names (case-insensitive). */
const HASH_EXCLUDED = new Set(['hash', 'encoding', 'countdown']);

export function escapeNestpayValue(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/\|/g, '\\|');
}

// ---------------------------------------------------------------------------
// Parameter ordering
// ---------------------------------------------------------------------------

const isDigit = (code: number) => code >= 48 && code <= 57;
const isSpace = (code: number) => code === 32 || (code >= 9 && code <= 13);
/** PHP's C-locale toupper: only ASCII a-z change. */
const foldUpper = (code: number) => (code >= 97 && code <= 122 ? code - 32 : code);

/**
 * PHP `strnatcasecmp`, which `natcasesort` uses in the bank's reference
 * sample: characters folded to UPPER case, runs of digits compared as
 * numbers. Folding upwards matters — '_' (0x5F) sorts after 'Z' (0x5A), so
 * the gate's `_charset_` field lands at the END of the list, not the start.
 */
export function natCaseCompare(a: string, b: string): number {
  let i = 0;
  let j = 0;
  for (;;) {
    while (i < a.length && isSpace(a.charCodeAt(i))) i += 1;
    while (j < b.length && isSpace(b.charCodeAt(j))) j += 1;
    if (i >= a.length || j >= b.length) {
      if (i >= a.length && j >= b.length) return 0;
      return i >= a.length ? -1 : 1;
    }
    const ca = a.charCodeAt(i);
    const cb = b.charCodeAt(j);
    if (isDigit(ca) && isDigit(cb)) {
      let endA = i;
      while (endA < a.length && isDigit(a.charCodeAt(endA))) endA += 1;
      let endB = j;
      while (endB < b.length && isDigit(b.charCodeAt(endB))) endB += 1;
      const runA = a.slice(i, endA).replace(/^0+(?=\d)/, '');
      const runB = b.slice(j, endB).replace(/^0+(?=\d)/, '');
      if (runA.length !== runB.length) return runA.length < runB.length ? -1 : 1;
      if (runA !== runB) return runA < runB ? -1 : 1;
      i = endA;
      j = endB;
      continue;
    }
    const ua = foldUpper(ca);
    const ub = foldUpper(cb);
    if (ua !== ub) return ua < ub ? -1 : 1;
    i += 1;
    j += 1;
  }
}

/** Plain lower-case comparison (Java `String.CASE_INSENSITIVE_ORDER` style). */
export function lowerCaseCompare(a: string, b: string): number {
  const left = a.toLowerCase();
  const right = b.toLowerCase();
  return left < right ? -1 : left > right ? 1 : 0;
}

export type Ver3Ordering = 'natural' | 'lowercase';
export type Ver3Encoding = 'utf8' | 'latin5';
export type Ver3Options = { ordering?: Ver3Ordering; encoding?: Ver3Encoding };

// ---------------------------------------------------------------------------
// Encoding
// ---------------------------------------------------------------------------

/** Latin-1 slots that ISO-8859-9 reassigns to Turkish letters. */
const LATIN5_REPLACED = new Set([0xd0, 0xdd, 0xde, 0xf0, 0xfd, 0xfe]);

/**
 * ISO-8859-9 (Latin-5) bytes of a string; unmappable characters become '?'.
 * The gate's own default encoding is ISO-8859-9, so a hash computed by the
 * bank over Turkish text (ErrMsg, card issuer) may be over these bytes even
 * though the browser delivers the form to us as UTF-8.
 */
export function latin5Bytes(value: string): Buffer {
  const out = Buffer.alloc(value.length);
  for (let i = 0; i < value.length; i += 1) {
    const code = value.charCodeAt(i);
    let byte: number;
    switch (code) {
      case 0x011e: byte = 0xd0; break; // Ğ
      case 0x0130: byte = 0xdd; break; // İ
      case 0x015e: byte = 0xde; break; // Ş
      case 0x011f: byte = 0xf0; break; // ğ
      case 0x0131: byte = 0xfd; break; // ı
      case 0x015f: byte = 0xfe; break; // ş
      default:
        byte = code < 0x100 && !LATIN5_REPLACED.has(code) ? code : 0x3f;
    }
    out[i] = byte;
  }
  return out;
}

function plaintextBytes(plaintext: string, encoding: Ver3Encoding): Buffer {
  return encoding === 'latin5' ? latin5Bytes(plaintext) : Buffer.from(plaintext, 'utf8');
}

// ---------------------------------------------------------------------------
// Hashing
// ---------------------------------------------------------------------------

/**
 * NestPay "ver3" plaintext: every posted parameter except hash/encoding/
 * countdown, sorted by name (natural, case-insensitive by default), values
 * escaped and joined with |, with the escaped store key appended last.
 */
export function ver3Plaintext(
  params: Record<string, string>,
  storeKey: string,
  options: Ver3Options = {},
): string {
  const compare = options.ordering === 'lowercase' ? lowerCaseCompare : natCaseCompare;
  const keys = Object.keys(params)
    .filter((key) => !HASH_EXCLUDED.has(key.toLowerCase()))
    .sort(compare);
  const values = keys.map((key) => escapeNestpayValue(params[key] ?? ''));
  return `${values.join('|')}|${escapeNestpayValue(storeKey)}`;
}

export function computeVer3Hash(
  params: Record<string, string>,
  storeKey: string,
  options: Ver3Options = {},
): string {
  const plaintext = ver3Plaintext(params, storeKey, options);
  return createHash('sha512')
    .update(plaintextBytes(plaintext, options.encoding ?? 'utf8'))
    .digest('base64');
}

export type Ver3Match = { ordering: Ver3Ordering; encoding: Ver3Encoding };

/**
 * The field-proven combination first (what the bank's PHP sample computes),
 * then tolerant fallbacks. Accepting any of them is safe: each is a full
 * SHA-512 over every field plus the secret store key, so none can be forged
 * without the key — the variants only differ in sort order and byte encoding.
 */
export const VER3_VERIFY_VARIANTS: readonly Ver3Match[] = [
  { ordering: 'natural', encoding: 'utf8' },
  { ordering: 'lowercase', encoding: 'utf8' },
  { ordering: 'natural', encoding: 'latin5' },
  { ordering: 'lowercase', encoding: 'latin5' },
];

/** Which variant (if any) reproduces the hash/HASH field of a gateway request or callback. */
export function matchVer3Hash(params: Record<string, string>, storeKey: string): Ver3Match | null {
  const hashKey = Object.keys(params).find((key) => key.toLowerCase() === 'hash');
  const provided = (hashKey ? params[hashKey] : '').trim();
  if (!provided) return null;
  const providedBuffer = Buffer.from(provided, 'utf8');
  for (const variant of VER3_VERIFY_VARIANTS) {
    const expected = Buffer.from(computeVer3Hash(params, storeKey, variant), 'utf8');
    if (expected.length === providedBuffer.length && timingSafeEqual(expected, providedBuffer)) {
      return variant;
    }
  }
  return null;
}

/** Verifies the hash/HASH field of a gateway request or callback. */
export function verifyVer3Hash(params: Record<string, string>, storeKey: string): boolean {
  return matchVer3Hash(params, storeKey) !== null;
}

// ---------------------------------------------------------------------------
// Request / callback field sets
// ---------------------------------------------------------------------------

/** '250.00' — the decimal string format the gateway expects. */
export function formatGateAmount(amount: number): string {
  return amount.toFixed(2);
}

/** Random order id: 32 hex chars, doubles as the status-lookup token. */
export function newOrderId(): string {
  return randomBytes(16).toString('hex');
}

/**
 * NestPay `cardType`: 1 = Visa, 2 = MasterCard. Omitted for other brands
 * (Troy, Amex): the gate resolves those from the BIN itself.
 */
export function nestpayCardType(pan: string): string | null {
  if (/^4/.test(pan)) return '1';
  if (/^5[1-5]/.test(pan)) return '2';
  const prefix4 = Number(pan.slice(0, 4));
  if (prefix4 >= 2221 && prefix4 <= 2720) return '2';
  return null;
}

export type GateRequestInput = {
  clientId: string;
  storeKey: string;
  oid: string;
  /** Major units, e.g. 250 → '250.00'. */
  amount: number;
  /** ISO 4217 numeric code; USD = '840', TRY = '949'. */
  currencyCode: string;
  okUrl: string;
  failUrl: string;
  /** Gateway UI language; NestPay understands 'tr' and 'en'. */
  lang: 'tr' | 'en';
  card: { pan: string; expMonth: string; expYear: string; cv2: string };
};

/**
 * The signed field set the browser form-POSTs to the 3D gate (3d_pay model:
 * card on our page, 3-D Secure challenge at the bank, authorization by the
 * bank, signed outcome posted to okUrl/failUrl). Field names are the Turkish
 * EST set: `islemtipi` (transaction type), `taksit` (instalments, empty =
 * none), 2-digit expiry year.
 */
export function buildGateRequestFields(input: GateRequestInput): Record<string, string> {
  const fields: Record<string, string> = {
    clientid: input.clientId,
    storetype: '3d_pay',
    islemtipi: 'Auth',
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
  const cardType = nestpayCardType(input.card.pan);
  if (cardType) fields.cardType = cardType;
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

/**
 * The signed field set the (mock) bank posts back to okUrl/failUrl. Mirrors
 * the real gate's shape, including the hash-excluded `encoding` and the
 * browser-filled `_charset_`, so the verifier's ordering is exercised.
 */
export function buildGateCallbackFields(input: GateCallbackInput): Record<string, string> {
  const fields: Record<string, string> = {
    oid: input.oid,
    clientid: input.clientId,
    amount: input.amount,
    currency: input.currencyCode,
    rnd: randomBytes(12).toString('hex'),
    storetype: '3d_pay',
    mdStatus: input.mdStatus,
    mdErrorMsg: input.mdStatus === '0' ? input.errMsg ?? '' : '',
    ProcReturnCode: input.procReturnCode,
    Response: input.response,
    AuthCode: input.authCode ?? '',
    TransId: input.transId ?? '',
    HostRefNum: input.transId ? `${Date.now()}`.slice(-12) : '',
    ErrMsg: input.errMsg ?? '',
    maskedCreditCard: input.maskedPan,
    'EXTRA.TRXDATE': new Date().toISOString(),
    hashAlgorithm: 'ver3',
    encoding: 'ISO-8859-9',
    _charset_: 'UTF-8',
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
