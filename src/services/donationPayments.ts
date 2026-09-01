import type { Locale } from '@/i18n/content';

export type PaymentMode = 'mock' | 'test' | 'production';

export type PaymentConfig = {
  mode: PaymentMode;
  currency: string;
  minAmount: number;
  maxAmount: number;
  presets: number[];
};

/** Used until /api/payments/config answers (and when it is unreachable). */
export const DEFAULT_PAYMENT_CONFIG: PaymentConfig = {
  mode: 'mock',
  currency: 'USD',
  minAmount: 1,
  maxAmount: 500_000,
  presets: [100, 250, 500, 1000, 2500],
};

export type PaymentErrorCode =
  | 'invalid-amount'
  | 'invalid-name'
  | 'invalid-email'
  | 'invalid-card'
  | 'invalid-expiry'
  | 'invalid-cvv'
  | 'unavailable'
  | 'server-error'
  | 'network';

export class DonationPaymentError extends Error {
  code: PaymentErrorCode;

  constructor(code: PaymentErrorCode) {
    super(code);
    this.name = 'DonationPaymentError';
    this.code = code;
  }
}

export type CreatePaymentInput = {
  slug: string;
  titleSnapshot: string;
  amount: number;
  locale: Locale;
  donor: { name: string; email: string; phone: string };
  card: { pan: string; expMonth: string; expYear: string; cv2: string };
};

export type CreatePaymentResult = {
  oid: string;
  gateUrl: string;
  fields: Record<string, string>;
};

export type PaymentStatus = {
  oid: string;
  status: 'pending' | 'paid' | 'failed';
  amount: number;
  currency: string;
  opportunitySlug: string | null;
  opportunityTitle: string | null;
  donorName: string;
  authCode: string | null;
  errorMessage: string | null;
  mode: PaymentMode;
  createdAt: string;
};

export async function fetchPaymentConfig(): Promise<PaymentConfig | null> {
  try {
    const response = await fetch('/api/payments/config');
    if (!response.ok) return null;
    const data = await response.json();
    return data?.ok ? (data as PaymentConfig) : null;
  } catch {
    return null;
  }
}

export async function createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult> {
  let response: Response;
  try {
    response = await fetch('/api/payments/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
  } catch {
    throw new DonationPaymentError('network');
  }

  let data: { ok?: boolean; error?: PaymentErrorCode } & Partial<CreatePaymentResult> = {};
  try {
    data = await response.json();
  } catch {
    throw new DonationPaymentError('network');
  }

  if (!response.ok || !data.ok || !data.gateUrl || !data.fields || !data.oid) {
    throw new DonationPaymentError(data.error ?? 'server-error');
  }
  return { oid: data.oid, gateUrl: data.gateUrl, fields: data.fields };
}

/**
 * Hands the browser over to the 3-D gate: builds a hidden form with the
 * signed fields and posts it (full page navigation, like the real bank flow).
 */
export function submitToGate(gateUrl: string, fields: Record<string, string>): void {
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = gateUrl;
  form.style.display = 'none';
  for (const [name, value] of Object.entries(fields)) {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = name;
    input.value = value;
    form.appendChild(input);
  }
  document.body.appendChild(form);
  form.submit();
}

export async function fetchPaymentStatus(oid: string): Promise<PaymentStatus | null> {
  try {
    const response = await fetch(`/api/payments/status?oid=${encodeURIComponent(oid)}`);
    if (!response.ok) return null;
    const data = await response.json();
    return data?.ok && data.payment ? (data.payment as PaymentStatus) : null;
  } catch {
    return null;
  }
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
