import type { IncomingMessage } from 'node:http';

export type PaymentMode = 'mock' | 'test' | 'production';

/**
 * Payment limits and presets served to the checkout page. Amounts are US
 * Dollars; the virtual POS charges in USD (ISO 4217 code 840). The minimum
 * stays at 1 so the $1 opportunities (waqf gift, Mother Yemen) are payable.
 */
export const PAYMENT_LIMITS = {
  currency: 'USD',
  currencyCode: '840',
  minAmount: 1,
  maxAmount: 500_000,
  presets: [100, 250, 500, 1000, 2500],
} as const;

export function paymentMode(): PaymentMode {
  const raw = (process.env.PAYMENT_MODE ?? 'mock').trim().toLowerCase();
  if (raw === 'test' || raw === 'production') return raw;
  return 'mock';
}

/**
 * Merchant id at the bank. The mock gateway ships with a placeholder so the
 * flow works out of the box; test/production require the real value.
 */
export function paymentClientId(): string {
  const value = process.env.PAYMENT_CLIENT_ID?.trim();
  if (value) return value;
  if (paymentMode() === 'mock') return 'VKV-MOCK-CLIENT';
  throw new Error('PAYMENT_CLIENT_ID is required outside mock mode.');
}

/**
 * NestPay store key used to sign/verify gateway hashes. Server-side only —
 * never expose it through a VITE_-prefixed variable.
 */
export function paymentStoreKey(): string {
  const value = process.env.PAYMENT_STORE_KEY?.trim();
  if (value) return value;
  if (paymentMode() === 'mock') return 'VKV_MOCK_STORE_KEY_2026';
  throw new Error('PAYMENT_STORE_KEY is required outside mock mode.');
}

/**
 * Where the card form posts to. Mock mode points back at our own simulated
 * gateway; test/production point at the bank (e.g. the Asseco/Payten test
 * gate, then https://sanalpos.isbank.com.tr/fim/est3Dgate).
 */
export function paymentGateUrl(origin: string): string {
  if (paymentMode() === 'mock') return `${origin}/api/payments/mock-gate`;
  const value = process.env.PAYMENT_GATE_URL?.trim();
  if (value) return value;
  throw new Error('PAYMENT_GATE_URL is required outside mock mode.');
}

/**
 * Public origin of the site (for okUrl/failUrl and redirects). Prefers
 * PUBLIC_SITE_URL, otherwise derived from the proxy headers so Vercel preview
 * deployments work without configuration.
 */
export function siteOrigin(req: IncomingMessage): string {
  const configured = process.env.PUBLIC_SITE_URL?.trim();
  if (configured) return configured.replace(/\/+$/, '');
  const proto = firstHeader(req, 'x-forwarded-proto') ?? 'https';
  const host = firstHeader(req, 'x-forwarded-host') ?? firstHeader(req, 'host') ?? 'localhost:3000';
  return `${proto}://${host}`;
}

function firstHeader(req: IncomingMessage, name: string): string | undefined {
  const value = req.headers[name];
  const raw = Array.isArray(value) ? value[0] : value;
  return raw?.split(',')[0]?.trim() || undefined;
}

// Public Supabase project URL; same fallback the browser bundle uses.
const FALLBACK_SUPABASE_URL = 'https://goyqlyrtclpywvolayzu.supabase.co';

export function supabaseUrl(): string {
  return (
    process.env.SUPABASE_URL?.trim() ||
    process.env.VITE_SUPABASE_URL?.trim() ||
    FALLBACK_SUPABASE_URL
  );
}

/** Secret service-role key: bypasses RLS, so it must never reach the bundle. */
export function supabaseServiceRoleKey(): string {
  const value = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (value) return value;
  throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for the payment functions.');
}

// Assistant AI provider keys moved to api/_lib/aiConfig.ts (one env var per
// provider; the active provider is chosen in the dashboard).
