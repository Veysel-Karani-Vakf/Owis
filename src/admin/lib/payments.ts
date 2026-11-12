// Card payments taken through the site's gateway (table donation_payments):
// every donation and every store purchase is one row. Shared by the payments
// page and the dashboard's "latest successful donations & purchases" panel.

import type { Locale } from '@/lib/types';

export type PaymentRow = {
  id: string;
  oid: string;
  opportunity_slug: string | null;
  opportunity_title: string | null;
  donor_name: string;
  donor_email: string | null;
  donor_phone: string | null;
  amount: number | string;
  currency: string;
  status: 'pending' | 'paid' | 'failed';
  gateway_mode: 'mock' | 'test' | 'production';
  auth_code: string | null;
  error_message: string | null;
  masked_pan: string | null;
  created_at: string;
};

export type PaymentMode = PaymentRow['gateway_mode'];

/** The amount in the payment's own currency, written for the dashboard's language. */
export function formatPaymentAmount(row: Pick<PaymentRow, 'amount' | 'currency'>, locale: Locale): string {
  const tag = locale === 'ar' ? 'ar' : locale === 'tr' ? 'tr-TR' : 'en-US';
  const amount = Number(row.amount);
  try {
    return new Intl.NumberFormat(tag, { style: 'currency', currency: row.currency || 'USD' }).format(amount);
  } catch {
    return `${amount} ${row.currency}`;
  }
}

/** Which gateway handled the row: only "production" is real money. */
export const PAYMENT_MODE_LABEL: Record<PaymentMode, Record<Locale, string>> = {
  production: { ar: 'إنتاج', tr: 'Canlı', en: 'Live' },
  test: { ar: 'اختبار البنك', tr: 'Banka testi', en: 'Bank test' },
  mock: { ar: 'محاكاة', tr: 'Simülasyon', en: 'Mock' },
};

export const PAYMENT_MODE_STYLES: Record<PaymentMode, string> = {
  mock: 'bg-amber-100 text-amber-700',
  test: 'bg-sky-100 text-sky-700',
  production: 'bg-slate-100 text-slate-600',
};
