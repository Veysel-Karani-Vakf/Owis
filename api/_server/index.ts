/**
 * Standalone Node host for the functions in api/ (used on the Hostinger VPS).
 *
 * On Vercel every file in api/ is its own serverless function. This server maps
 * the same URL paths onto the same handlers, unchanged, so behaviour stays
 * identical. Two things it deliberately does not do:
 *  - parse bodies: the handlers read the raw stream themselves, which the bank
 *    callback needs to verify the gateway hash byte-for-byte;
 *  - fall back to production: the process refuses to start unless its Supabase
 *    target is configured, and a staging process refuses the production project.
 *
 * Vercel ignores files and folders in api/ whose name starts with an
 * underscore, so this file is never deployed there.
 */
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';

import assistantChat from '../assistant/chat';
import assistantConfig from '../assistant/config';
import awardApply from '../award/apply';
import paymentsCallback from '../payments/callback';
import paymentsConfig from '../payments/config';
import paymentsCreate from '../payments/create';
import paymentsDirect from '../payments/direct';
import paymentsMockGate from '../payments/mock-gate';
import paymentsStatus from '../payments/status';
import { paymentMode, supabaseServiceRoleKey, supabaseUrl } from '../_lib/env';
import { sendJson, type ApiRequest, type ApiResponse } from '../_lib/http';

type Handler = (req: ApiRequest, res: ApiResponse) => void | Promise<void>;
type DeployEnv = 'staging' | 'production';

/** Same paths Vercel derives from the file names in api/. */
const ROUTES = new Map<string, Handler>([
  ['/api/assistant/chat', assistantChat],
  ['/api/assistant/config', assistantConfig],
  ['/api/award/apply', awardApply],
  ['/api/payments/callback', paymentsCallback],
  ['/api/payments/config', paymentsConfig],
  ['/api/payments/create', paymentsCreate],
  ['/api/payments/direct', paymentsDirect],
  ['/api/payments/mock-gate', paymentsMockGate],
  ['/api/payments/status', paymentsStatus],
]);

/** Vercel caps function payloads at 4.5 MB; stay in the same range. */
const MAX_BODY_BYTES = 5 * 1024 * 1024;

function requireDeployEnv(): DeployEnv {
  const raw = (process.env.DEPLOY_ENV ?? '').trim().toLowerCase();
  if (raw === 'staging' || raw === 'production') return raw;
  throw new Error('DEPLOY_ENV must be "staging" or "production".');
}

/** Fails loudly before the port opens instead of serving a half-configured API. */
function validateConfiguration(): DeployEnv {
  const deployEnv = requireDeployEnv();
  supabaseUrl(); // throws when missing, and when staging points at production
  supabaseServiceRoleKey(); // throws when missing
  if (deployEnv === 'staging' && paymentMode() !== 'mock') {
    throw new Error('A staging deployment only runs with PAYMENT_MODE=mock.');
  }
  return deployEnv;
}

function routePath(req: IncomingMessage): string {
  const raw = req.url ?? '/';
  const end = raw.search(/[?#]/);
  const path = end === -1 ? raw : raw.slice(0, end);
  return path.length > 1 ? path.replace(/\/+$/, '') : path;
}

async function dispatch(req: IncomingMessage, res: ServerResponse, deployEnv: DeployEnv): Promise<void> {
  const path = routePath(req);

  if (path === '/api/healthz') {
    sendJson(res, 200, { ok: true, env: deployEnv });
    return;
  }

  const handler = ROUTES.get(path);
  if (!handler) {
    sendJson(res, 404, { ok: false, error: 'not-found' });
    return;
  }

  const declaredLength = Number(req.headers['content-length'] ?? 0);
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
    sendJson(res, 413, { ok: false, error: 'payload-too-large' });
    return;
  }

  await handler(req, res);
}

function main(): void {
  let deployEnv: DeployEnv;
  try {
    deployEnv = validateConfiguration();
  } catch (error) {
    console.error(`Refusing to start: ${error instanceof Error ? error.message : 'invalid configuration'}`);
    process.exit(1);
  }

  const server = createServer((req, res) => {
    dispatch(req, res, deployEnv).catch((error: unknown) => {
      console.error('request failed:', error instanceof Error ? error.message : 'unknown');
      if (res.headersSent) {
        res.end();
        return;
      }
      sendJson(res, 500, { ok: false, error: 'server-error' });
    });
  });

  // The assistant endpoint waits on an AI provider; everything else is fast.
  server.requestTimeout = 120_000;
  server.headersTimeout = 20_000;
  server.keepAliveTimeout = 65_000;

  const port = Number(process.env.PORT ?? 3000);
  server.listen(port, '0.0.0.0', () => {
    console.log(`api listening on :${port} (${deployEnv}, payments: ${paymentMode()})`);
  });

  const shutdown = (): void => {
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(0), 10_000).unref();
  };
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

main();
