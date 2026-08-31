import type { IncomingMessage, ServerResponse } from 'node:http';

/** Vercel's Node runtime pre-parses bodies onto req.body; plain Node does not. */
export type ApiRequest = IncomingMessage & { body?: unknown };
export type ApiResponse = ServerResponse;

async function readRawBody(req: ApiRequest): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString('utf8');
}

/** JSON request body as an object ({} for anything unparsable). */
export async function readJsonBody(req: ApiRequest): Promise<Record<string, unknown>> {
  let parsed: unknown = req.body;
  if (parsed === undefined) {
    try {
      parsed = JSON.parse(await readRawBody(req));
    } catch {
      parsed = undefined;
    }
  } else if (typeof parsed === 'string') {
    try {
      parsed = JSON.parse(parsed);
    } catch {
      parsed = undefined;
    }
  } else if (Buffer.isBuffer(parsed)) {
    try {
      parsed = JSON.parse(parsed.toString('utf8'));
    } catch {
      parsed = undefined;
    }
  }
  return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
    ? (parsed as Record<string, unknown>)
    : {};
}

/** urlencoded form body as flat string params (what the gateway posts). */
export async function readFormBody(req: ApiRequest): Promise<Record<string, string>> {
  const body = req.body;
  if (body && typeof body === 'object' && !Buffer.isBuffer(body)) {
    const params: Record<string, string> = {};
    for (const [key, value] of Object.entries(body as Record<string, unknown>)) {
      params[key] = Array.isArray(value) ? String(value[0] ?? '') : String(value ?? '');
    }
    return params;
  }
  const raw =
    typeof body === 'string' ? body : Buffer.isBuffer(body) ? body.toString('utf8') : await readRawBody(req);
  const params: Record<string, string> = {};
  for (const [key, value] of new URLSearchParams(raw)) {
    if (!(key in params)) params[key] = value;
  }
  return params;
}

/** Query params of the request URL. */
export function readQuery(req: ApiRequest): URLSearchParams {
  const url = req.url ?? '';
  const index = url.indexOf('?');
  return new URLSearchParams(index === -1 ? '' : url.slice(index + 1));
}

export function sendJson(res: ApiResponse, status: number, payload: unknown): void {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(payload));
}

export function sendHtml(res: ApiResponse, status: number, html: string): void {
  res.statusCode = status;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(html);
}

/** 303 turns the gateway's POST into a GET of the SPA result page. */
export function redirect303(res: ApiResponse, location: string): void {
  res.statusCode = 303;
  res.setHeader('Location', location);
  res.setHeader('Cache-Control', 'no-store');
  res.end();
}

export function methodNotAllowed(res: ApiResponse, allow: string): void {
  res.statusCode = 405;
  res.setHeader('Allow', allow);
  res.setHeader('Cache-Control', 'no-store');
  res.end('Method Not Allowed');
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
