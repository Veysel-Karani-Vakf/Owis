import Anthropic from '@anthropic-ai/sdk';
import {
  AI_PROVIDERS,
  aiProviderKey,
  assistantAiConfig,
  type AiProviderId,
} from '../_lib/aiConfig';
import { methodNotAllowed, readJsonBody, sendJson, type ApiRequest, type ApiResponse } from '../_lib/http';

/**
 * AI endpoint behind the site assistant. The browser sends the visitor's
 * question together with the most relevant site-content snippets it retrieved
 * from its own index (static data merged with the CMS snapshot); this function
 * asks the provider chosen in the dashboard (DeepSeek, OpenAI, Claude or
 * Gemini) to answer strictly from those snippets and to point at the matching
 * links. The API keys never leave the server.
 */

const MAX_MESSAGE_CHARS = 1000;
const MAX_HISTORY_ITEMS = 8;
const MAX_HISTORY_CHARS = 600;
const MAX_CONTEXT_ITEMS = 10;
const MAX_CONTEXT_CHARS = 2000;
const REQUEST_TIMEOUT_MS = 25_000;

type ContextEntry = { id: string; kind: string; title: string; href: string; text: string };
type HistoryItem = { role: 'user' | 'assistant'; text: string };
type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string };

const LOCALE_NAMES: Record<string, string> = { ar: 'Arabic', tr: 'Turkish', en: 'English' };

function systemPrompt(locale: string): string {
  const language = LOCALE_NAMES[locale] ?? 'Arabic';
  return [
    'You are the on-site assistant of the official website of "وقف أويس القرني تُرك" (Veysel Karani Waqf / Owais Al-Qarni Waqf), a Turkish-registered waqf serving Yemen.',
    '',
    'You receive SITE CONTENT entries (id, kind, title, url, text). They are the only source of truth.',
    '',
    'Rules:',
    `- Answer in the language the user wrote in; default to ${language} when unclear.`,
    '- Answer the question DIRECTLY with the facts found in the site content. Never reply with "I found this page" style deflections — explain the substance first.',
    '- When the user wants to act (donate/contribute, volunteer, contact, open a specific program, project, article, episode or document), give a one- or two-sentence explanation of how, and include the matching entry ids in "links".',
    '- Include in "links" only entries that genuinely answer the question (0–3 ids). Never list unrelated results.',
    '- If the site content does not contain the answer, say clearly that the site does not have enough information about it — never invent facts, names, numbers or dates.',
    '- Questions unrelated to the waqf or its website: politely say you only answer about this website\'s content.',
    '- Keep answers concise: usually 1–4 sentences, plain text (no markdown headings, no URLs inside the answer text — links go in "links").',
    '',
    'Respond with STRICT JSON only, in this shape:',
    '{"answer": "...", "links": ["entry-id", ...], "suggestions": ["short follow-up question", ...]}',
    '"links": ids copied exactly from the provided entries. "suggestions": up to 3 short follow-up questions in the user\'s language, or [].',
  ].join('\n');
}

function clampString(value: unknown, max: number): string {
  return typeof value === 'string' ? value.slice(0, max) : '';
}

function sanitizeHistory(raw: unknown): HistoryItem[] {
  if (!Array.isArray(raw)) return [];
  const items: HistoryItem[] = [];
  for (const item of raw.slice(-MAX_HISTORY_ITEMS)) {
    if (!item || typeof item !== 'object') continue;
    const role = (item as HistoryItem).role;
    const text = clampString((item as HistoryItem).text, MAX_HISTORY_CHARS).trim();
    if ((role === 'user' || role === 'assistant') && text) items.push({ role, text });
  }
  return items;
}

function sanitizeContext(raw: unknown): ContextEntry[] {
  if (!Array.isArray(raw)) return [];
  const entries: ContextEntry[] = [];
  for (const item of raw.slice(0, MAX_CONTEXT_ITEMS)) {
    if (!item || typeof item !== 'object') continue;
    const entry = item as ContextEntry;
    const id = clampString(entry.id, 120).trim();
    const title = clampString(entry.title, 300).trim();
    if (!id || !title) continue;
    entries.push({
      id,
      kind: clampString(entry.kind, 40),
      title,
      href: clampString(entry.href, 500),
      text: clampString(entry.text, MAX_CONTEXT_CHARS),
    });
  }
  return entries;
}

function contextBlock(entries: ContextEntry[]): string {
  if (!entries.length) return 'SITE CONTENT: (no matching entries were found on the site for this question)';
  const blocks = entries.map(
    (entry) => `[id: ${entry.id}] [kind: ${entry.kind}] [url: ${entry.href}]\ntitle: ${entry.title}\n${entry.text}`,
  );
  return `SITE CONTENT:\n\n${blocks.join('\n\n---\n\n')}`;
}

type ModelReply = { answer: string; links: string[]; suggestions: string[] };

function parseModelReply(raw: string, validIds: Set<string>): ModelReply | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    // Some replies wrap the JSON in a code fence despite json_object mode.
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      parsed = JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
  if (!parsed || typeof parsed !== 'object') return null;
  const answer = clampString((parsed as ModelReply).answer, 4000).trim();
  if (!answer) return null;
  const links = Array.isArray((parsed as ModelReply).links)
    ? (parsed as ModelReply).links.filter((id): id is string => typeof id === 'string' && validIds.has(id)).slice(0, 3)
    : [];
  const suggestions = Array.isArray((parsed as ModelReply).suggestions)
    ? (parsed as ModelReply).suggestions
        .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
        .map((item) => item.trim().slice(0, 120))
        .slice(0, 3)
    : [];
  return { answer, links, suggestions };
}

/** OpenAI reasoning models — reasoning tokens count against the output cap. */
const OPENAI_REASONING = /^(gpt-5|o\d)/;

/**
 * Per-provider request quirks: gpt-5-era OpenAI models reject `max_tokens`
 * and non-default `temperature` and burn reasoning tokens inside the
 * completion cap; Gemini 2.5 thinks by default and its `max_tokens` includes
 * the thinking tokens — a small cap truncates before the answer starts.
 */
function completionBody(provider: AiProviderId, model: string, messages: ChatMessage[]): Record<string, unknown> {
  const base = { model, messages, response_format: { type: 'json_object' } };
  if (provider === 'openai') {
    return {
      ...base,
      max_completion_tokens: 4000,
      ...(OPENAI_REASONING.test(model) ? { reasoning_effort: 'low' } : {}),
    };
  }
  if (provider === 'gemini') return { ...base, temperature: 0.3, max_tokens: 4000 };
  return { ...base, temperature: 0.3, max_tokens: 700 };
}

async function callOpenAiCompatible(
  provider: AiProviderId,
  model: string,
  apiKey: string,
  messages: ChatMessage[],
): Promise<string> {
  const url = AI_PROVIDERS[provider].url;
  if (!url) throw new Error(`provider ${provider} has no completions URL`);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(completionBody(provider, model, messages)),
      signal: controller.signal,
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      throw new Error(`${provider} ${response.status}: ${detail.slice(0, 500)}`);
    }
    const payload = (await response.json()) as { choices?: { message?: { content?: string } }[] };
    return payload.choices?.[0]?.message?.content ?? '';
  } finally {
    clearTimeout(timeout);
  }
}

/** Claude 5-family models that accept `output_config.effort`. */
const ANTHROPIC_EFFORT = /^claude-(fable-5|opus-5|sonnet-5)/;
/** Models where refusal fallbacks should be on by default. */
const ANTHROPIC_FALLBACK = /^claude-(fable-5|opus-5)/;

async function callAnthropic(
  model: string,
  apiKey: string,
  system: string,
  history: HistoryItem[],
  message: string,
): Promise<string> {
  // No retries: the browser gives up after 30s, so a timeout-then-retry
  // would bill a completion nobody receives.
  const client = new Anthropic({ apiKey, timeout: REQUEST_TIMEOUT_MS, maxRetries: 0 });

  // The Messages API requires the first message to be a user turn.
  const trimmed = [...history];
  while (trimmed[0]?.role === 'assistant') trimmed.shift();
  const messages: Anthropic.MessageParam[] = [
    ...trimmed.map((item): Anthropic.MessageParam => ({ role: item.role, content: item.text })),
    { role: 'user', content: message },
  ];

  // Low effort keeps adaptive thinking short on a simple grounded-Q&A task;
  // max_tokens leaves room for it (thinking counts toward the cap).
  const request = {
    model,
    max_tokens: 4000,
    system,
    messages,
    ...(ANTHROPIC_EFFORT.test(model) ? { output_config: { effort: 'low' as const } } : {}),
  };

  // Opus 5 / Fable 5: a policy decline re-runs the request server-side on a
  // fallback model instead of returning an empty refusal.
  const response = ANTHROPIC_FALLBACK.test(model)
    ? await client.beta.messages.create({
        ...request,
        betas: ['server-side-fallback-2026-06-01'],
        fallbacks: [{ model: 'claude-opus-4-8' }],
      })
    : await client.messages.create(request);

  if (response.stop_reason === 'refusal') return '';
  return response.content.map((block) => (block.type === 'text' ? block.text : '')).join('');
}

export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  if (req.method !== 'POST') {
    methodNotAllowed(res, 'POST');
    return;
  }

  const body = await readJsonBody(req);
  const message = clampString(body.message, MAX_MESSAGE_CHARS).trim();
  if (!message) {
    sendJson(res, 400, { error: 'message_required' });
    return;
  }

  // `fresh` comes from the dashboard's test button so the answer reflects the
  // just-saved provider instead of a warm instance's 30s-cached one.
  const config = await assistantAiConfig({ fresh: body.fresh === true });
  const apiKey = aiProviderKey(config.provider);
  if (!apiKey) {
    sendJson(res, 503, { error: 'assistant_disabled' });
    return;
  }
  const locale = clampString(body.locale, 8) || 'ar';
  const history = sanitizeHistory(body.history);
  const context = sanitizeContext(body.context);

  try {
    const raw =
      AI_PROVIDERS[config.provider].kind === 'anthropic'
        ? await callAnthropic(
            config.model,
            apiKey,
            `${systemPrompt(locale)}\n\n${contextBlock(context)}`,
            history,
            message,
          )
        : await callOpenAiCompatible(config.provider, config.model, apiKey, [
            { role: 'system', content: systemPrompt(locale) },
            { role: 'system', content: contextBlock(context) },
            ...history.map((item): ChatMessage => ({ role: item.role, content: item.text })),
            { role: 'user', content: message },
          ]);

    const reply = parseModelReply(raw, new Set(context.map((entry) => entry.id)));
    if (!reply) {
      console.error('assistant unparsable reply', config.provider, config.model, raw.slice(0, 500));
      sendJson(res, 502, { error: 'assistant_unparsable' });
      return;
    }

    sendJson(res, 200, { answer: reply.answer, links: reply.links, suggestions: reply.suggestions });
  } catch (error) {
    console.error('assistant chat failed', config.provider, config.model, error);
    sendJson(res, 502, { error: 'assistant_failed' });
  }
}
