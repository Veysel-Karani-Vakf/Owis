import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { paymentMode, supabaseServiceRoleKey, supabaseUrl, type PaymentMode } from './env';

export type PaymentLocale = 'ar' | 'tr' | 'en';

export type PaymentRow = {
  id: string;
  oid: string;
  opportunity_slug: string | null;
  opportunity_title: string | null;
  donor_name: string;
  donor_email: string | null;
  donor_phone: string | null;
  locale: string | null;
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'failed';
  gateway_mode: PaymentMode;
  md_status: string | null;
  proc_return_code: string | null;
  auth_code: string | null;
  trans_id: string | null;
  error_message: string | null;
  masked_pan: string | null;
  created_at: string;
};

let client: SupabaseClient | null = null;

export function serviceClient(): SupabaseClient {
  if (!client) {
    client = createClient(supabaseUrl(), supabaseServiceRoleKey(), {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return client;
}

type LocalizedText = Partial<Record<PaymentLocale, string>> | null;

function localizedText(value: LocalizedText, locale: PaymentLocale): string {
  if (!value) return '';
  return value[locale] || value.ar || value.en || value.tr || '';
}

function parseOpportunityAmount(displayPrice: string): number | null {
  const raw = displayPrice.trim().replace(/[^\d.,-]/g, '');
  if (!raw) return null;

  const lastDot = raw.lastIndexOf('.');
  const lastComma = raw.lastIndexOf(',');
  let normalized = raw;

  if (lastDot >= 0 && lastComma >= 0) {
    if (lastDot > lastComma) {
      normalized = raw.replace(/,/g, '');
    } else {
      normalized = raw.replace(/\./g, '').replace(',', '.');
    }
  } else if (lastComma >= 0) {
    const decimals = raw.length - lastComma - 1;
    normalized = decimals === 2 ? raw.replace(',', '.') : raw.replace(/,/g, '');
  } else if (lastDot >= 0) {
    const decimals = raw.length - lastDot - 1;
    normalized = decimals === 2 ? raw : raw.replace(/\./g, '');
  }

  const amount = Number(normalized);
  if (!Number.isFinite(amount) || amount <= 0) return null;

  const cents = Math.round(amount * 100);
  if (Math.abs(amount * 100 - cents) > 1e-6) return null;

  return cents / 100;
}

export type OpportunityLookup = {
  slug: string;
  title: string;
  available: boolean;
  amount: number | null;
};

export async function getOpportunityBySlug(
  slug: string,
  locale: PaymentLocale,
): Promise<OpportunityLookup | null> {
  const { data, error } = await serviceClient()
    .from('donation_opportunities')
    .select('slug,title,price,available,is_published')
    .eq('slug', slug)
    .maybeSingle();

  if (error || !data) return null;

  const displayPrice = localizedText(data.price as LocalizedText, locale);

  return {
    slug: data.slug,
    title: localizedText(data.title as LocalizedText, locale),
    available: Boolean(data.available) && data.is_published !== false,
    amount: parseOpportunityAmount(displayPrice),
  };
}

export type NewPayment = {
  oid: string;
  opportunitySlug: string | null;
  opportunityTitle: string | null;
  donorName: string;
  donorEmail: string | null;
  donorPhone: string | null;
  locale: string;
  amount: number;
  currency: string;
};

export async function createPayment(payment: NewPayment): Promise<void> {
  const { error } = await serviceClient().from('donation_payments').insert({
    oid: payment.oid,
    opportunity_slug: payment.opportunitySlug,
    opportunity_title: payment.opportunityTitle,
    donor_name: payment.donorName,
    donor_email: payment.donorEmail,
    donor_phone: payment.donorPhone,
    locale: payment.locale,
    amount: payment.amount,
    currency: payment.currency,
    status: 'pending',
    gateway_mode: paymentMode(),
  });
  if (error) throw new Error(`donation_payments insert failed: ${error.message}`);
}

export async function getPaymentByOid(oid: string): Promise<PaymentRow | null> {
  const { data, error } = await serviceClient()
    .from('donation_payments')
    .select('*')
    .eq('oid', oid)
    .maybeSingle();
  if (error) throw new Error(`donation_payments select failed: ${error.message}`);
  return (data as PaymentRow | null) ?? null;
}

export type PaymentFinalization = {
  status: 'paid' | 'failed';
  mdStatus: string | null;
  procReturnCode: string | null;
  authCode: string | null;
  transId: string | null;
  errorMessage: string | null;
  maskedPan: string | null;
  rawResponse: Record<string, string>;
};

export async function finalizePayment(oid: string, outcome: PaymentFinalization): Promise<void> {
  const { error } = await serviceClient()
    .from('donation_payments')
    .update({
      status: outcome.status,
      md_status: outcome.mdStatus,
      proc_return_code: outcome.procReturnCode,
      auth_code: outcome.authCode,
      trans_id: outcome.transId,
      error_message: outcome.errorMessage,
      masked_pan: outcome.maskedPan,
      raw_response: outcome.rawResponse,
    })
    .eq('oid', oid)
    .eq('status', 'pending');
  if (error) throw new Error(`donation_payments update failed: ${error.message}`);
}
