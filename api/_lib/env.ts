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

/**
 * İş Bankası est3Dgate endpoints, for reference only — the live value always
 * comes from PAYMENT_GATE_URL so an env change is the whole go-live switch.
 *   test:       https://entegrasyon.asseco-see.com.tr/fim/est3Dgate
 *   production: https://sanalpos.isbank.com.tr/fim/est3Dgate
 */

/**
 * Placeholder values kept in .env files while the bank credentials are still
 * pending. Mock mode ignores them (its built-in defaults apply); test and
 * production refuse to start with them so a half-configured deployment fails
 * loudly instead of posting a donor's card to a bogus gate.
 */
const PLACEHOLDER_VALUES = new Set(['TEST_CLIENT_ID', 'TEST_STORE_KEY', 'TEST_GATEWAY_URL']);

function isPlaceholder(value: string): boolean {
  return PLACEHOLDER_VALUES.has(value.toUpperCase()) || /^<.*>$/.test(value);
}

/** Env value, or undefined when unset, blank or still a placeholder. */
function configuredValue(name: string): string | undefined {
  const value = process.env[name]?.trim();
  if (!value || isPlaceholder(value)) return undefined;
  return value;
}

export function paymentMode(): PaymentMode {
  const raw = (process.env.PAYMENT_MODE ?? 'mock').trim().toLowerCase();
  if (raw === 'test' || raw === 'production') return raw;
  return 'mock';
}

/**
 * Merchant id (clientid) at the bank. Mock mode ships with a built-in value
 * so the flow works out of the box; test/production require the real one.
 */
export function paymentClientId(): string {
  const value = configuredValue('PAYMENT_CLIENT_ID');
  if (paymentMode() === 'mock') return value ?? 'VKV-MOCK-CLIENT';
  if (value) return value;
  throw new Error('PAYMENT_CLIENT_ID must hold the merchant id from İş Bank outside mock mode.');
}

/**
 * NestPay store key (the "3D Secure key" set in the bank's merchant panel),
 * used to sign/verify gateway hashes. Server-side only — never expose it
 * through a VITE_-prefixed variable.
 */
export function paymentStoreKey(): string {
  const value = configuredValue('PAYMENT_STORE_KEY');
  if (paymentMode() === 'mock') return value ?? 'VKV_MOCK_STORE_KEY_2026';
  if (value) return value;
  throw new Error('PAYMENT_STORE_KEY must hold the store key from İş Bank outside mock mode.');
}

/**
 * Where the card form posts to. Mock mode points back at our own simulated
 * gateway; test/production post to the bank's est3Dgate (absolute https).
 */
export function paymentGateUrl(origin: string): string {
  if (paymentMode() === 'mock') return `${origin}/api/payments/mock-gate`;
  const value = configuredValue('PAYMENT_GATE_URL');
  if (!value) {
    throw new Error('PAYMENT_GATE_URL must hold the bank\'s est3Dgate URL outside mock mode.');
  }
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error('PAYMENT_GATE_URL is not an absolute URL.');
  }
  if (parsed.protocol !== 'https:') {
    throw new Error('PAYMENT_GATE_URL must use https.');
  }
  return value;
}

/**
 * True when every bank credential is present and non-placeholder — i.e. the
 * deployment could run in test/production. Exposes readiness only, never the
 * values.
 */
export function bankCredentialsConfigured(): boolean {
  const gate = configuredValue('PAYMENT_GATE_URL');
  let gateOk = false;
  if (gate) {
    try {
      gateOk = new URL(gate).protocol === 'https:';
    } catch {
      gateOk = false;
    }
  }
  return Boolean(configuredValue('PAYMENT_CLIENT_ID') && configuredValue('PAYMENT_STORE_KEY') && gateOk);
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
