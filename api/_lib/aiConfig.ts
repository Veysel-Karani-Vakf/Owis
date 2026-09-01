import { serviceClient } from './db';

/**
 * Which AI answers the site assistant. The dashboard stores the active
 * provider+model in the `site_pages` row `assistant-ai`; the API keys
 * themselves live only in Vercel env vars (one per provider) and never
 * reach the database or the browser.
 */

export type AiProviderId = 'deepseek' | 'openai' | 'anthropic' | 'gemini';

export type AiProviderDef = {
  id: AiProviderId;
  /** OpenAI-compatible chat/completions endpoint; Anthropic uses its own SDK. */
  url?: string;
  envVar: string;
  defaultModel: string;
  kind: 'openai-compatible' | 'anthropic';
};

export const AI_PROVIDERS: Record<AiProviderId, AiProviderDef> = {
  deepseek: {
    id: 'deepseek',
    url: 'https://api.deepseek.com/chat/completions',
    envVar: 'DEEPSEEK_API_KEY',
    defaultModel: 'deepseek-chat',
    kind: 'openai-compatible',
  },
  openai: {
    id: 'openai',
    url: 'https://api.openai.com/v1/chat/completions',
    envVar: 'OPENAI_API_KEY',
    defaultModel: 'gpt-5-mini',
    kind: 'openai-compatible',
  },
  anthropic: {
    id: 'anthropic',
    envVar: 'ANTHROPIC_API_KEY',
    defaultModel: 'claude-opus-5',
    kind: 'anthropic',
  },
  gemini: {
    id: 'gemini',
    url: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
    envVar: 'GEMINI_API_KEY',
    defaultModel: 'gemini-2.5-flash',
    kind: 'openai-compatible',
  },
};

export function aiProviderKey(id: AiProviderId): string {
  return process.env[AI_PROVIDERS[id].envVar]?.trim() ?? '';
}

export type AssistantAiConfig = { provider: AiProviderId; model: string };

const CONFIG_ROW_KEY = 'assistant-ai';
const CACHE_TTL_MS = 30_000;

let cached: { value: AssistantAiConfig; at: number } | null = null;

function isProviderId(value: unknown): value is AiProviderId {
  // Object.hasOwn, not `in`: a row hand-edited to {provider: 'toString'}
  // must not pass validation via the prototype chain.
  return typeof value === 'string' && Object.hasOwn(AI_PROVIDERS, value);
}

/**
 * Admins sometimes paste an API key into the dashboard's model field. Never
 * send a key-shaped value as a model name to a provider (it would land in
 * request logs) — fall back to the provider default instead.
 */
const KEY_SHAPED = /^(sk-|AIza|gsk_|xai-)/i;
function looksLikeApiKey(value: string): boolean {
  return (
    KEY_SHAPED.test(value) ||
    (value.length >= 32 && /^[A-Za-z0-9_-]+$/.test(value) && /[A-Z]/.test(value) && /[a-z]/.test(value))
  );
}

/**
 * Active provider+model chosen in the dashboard. A missing/invalid row means
 * DeepSeek defaults; a FAILED read keeps serving the last-known config rather
 * than silently flipping providers. `fresh` skips the cache (the dashboard's
 * test button uses it so a warm instance doesn't validate stale config).
 */
export async function assistantAiConfig(options?: { fresh?: boolean }): Promise<AssistantAiConfig> {
  if (!options?.fresh && cached && Date.now() - cached.at < CACHE_TTL_MS) return cached.value;

  const fallback: AssistantAiConfig = {
    provider: 'deepseek',
    model: AI_PROVIDERS.deepseek.defaultModel,
  };
  try {
    const { data, error } = await serviceClient()
      .from('site_pages')
      .select('data')
      .eq('key', CONFIG_ROW_KEY)
      .maybeSingle();
    if (error) throw new Error(error.message);
    const raw = (data?.data ?? null) as { provider?: unknown; model?: unknown } | null;
    let value = fallback; // row absent or invalid = deliberate default state
    if (raw && isProviderId(raw.provider)) {
      const provider = raw.provider;
      const stored = typeof raw.model === 'string' ? raw.model.trim() : '';
      const model = stored && !looksLikeApiKey(stored) ? stored : AI_PROVIDERS[provider].defaultModel;
      value = { provider, model };
    }
    cached = { value, at: Date.now() };
    return value;
  } catch (error) {
    console.error('assistant config read failed', error);
    // No service key (local dev) or a DB blip: last-known-good beats a
    // silent provider flip; defaults only when nothing was ever read.
    cached = { value: cached?.value ?? fallback, at: Date.now() };
    return cached.value;
  }
}
