import { AI_PROVIDERS, aiProviderKey, assistantAiConfig } from '../_lib/aiConfig';
import { methodNotAllowed, sendJson, type ApiRequest, type ApiResponse } from '../_lib/http';

/**
 * Read-only view for the dashboard's AI settings page: which provider+model
 * is active, and which providers have an API key configured in the server
 * env. Booleans only — key values never leave the server.
 */
export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  if (req.method !== 'GET') {
    methodNotAllowed(res, 'GET');
    return;
  }
  const active = await assistantAiConfig();
  const providers = Object.values(AI_PROVIDERS).map((def) => ({
    id: def.id,
    defaultModel: def.defaultModel,
    hasKey: Boolean(aiProviderKey(def.id)),
  }));
  sendJson(res, 200, { active, providers });
}
