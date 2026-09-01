import {
  answer,
  resolveAiLinks,
  retrieveAiContext,
  type AssistantContext,
  type AssistantReply,
} from '@/assistant/engine';

/**
 * Talks to the AI endpoint (/api/assistant/chat). The browser retrieves the
 * most relevant site-content snippets from its own index and sends them along
 * with the question; the server holds the model API key. When the endpoint is
 * unavailable the offline intent/search engine answers instead, so the
 * assistant always replies.
 */

export type ChatHistoryItem = { role: 'user' | 'assistant'; text: string };

const HISTORY_WINDOW = 6;
const REQUEST_TIMEOUT_MS = 30_000;

type AiResponse = { answer?: unknown; links?: unknown; suggestions?: unknown };

/**
 * When the endpoint says it is off (no key configured), pause asking it —
 * time-boxed, not permanent: the provider can be switched back on from the
 * dashboard at any moment, and open sessions should recover on their own.
 */
const AI_DISABLED_RETRY_MS = 5 * 60_000;
let aiDisabledUntil = 0;

export async function askAssistant(
  question: string,
  history: ChatHistoryItem[],
  context: AssistantContext,
): Promise<AssistantReply> {
  if (Date.now() >= aiDisabledUntil) {
    const reply = await askAi(question, history, context);
    if (reply) return reply;
  }
  return answer(question, context);
}

async function askAi(
  question: string,
  history: ChatHistoryItem[],
  context: AssistantContext,
): Promise<AssistantReply | null> {
  const previousQuestion = [...history].reverse().find((item) => item.role === 'user')?.text;
  const aiContext = retrieveAiContext(context.index, question, previousQuestion);

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch('/api/assistant/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        locale: context.locale,
        message: question,
        history: history.slice(-HISTORY_WINDOW),
        context: aiContext,
      }),
      signal: controller.signal,
    });

    if (response.status === 503) {
      aiDisabledUntil = Date.now() + AI_DISABLED_RETRY_MS;
      return null;
    }
    if (!response.ok) return null;

    const payload = (await response.json()) as AiResponse;
    const text = typeof payload.answer === 'string' ? payload.answer.trim() : '';
    if (!text) return null;

    const linkIds = Array.isArray(payload.links)
      ? payload.links.filter((id): id is string => typeof id === 'string')
      : [];
    const suggestions = Array.isArray(payload.suggestions)
      ? payload.suggestions.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
      : [];

    const links = resolveAiLinks(context.index, linkIds);
    return {
      text,
      links: links.length ? links : undefined,
      suggestions: suggestions.length ? suggestions : undefined,
    };
  } catch {
    return null;
  } finally {
    window.clearTimeout(timeout);
  }
}
