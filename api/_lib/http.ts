import type { IncomingMessage, ServerResponse } from 'node:http';

/** Vercel's Node runtime pre-parses bodies onto req.body; plain Node does not. */
export type ApiRequest = IncomingMessage & { body?: unknown };
export type ApiResponse = ServerResponse;

/** Every byte of the request stream (empty when it is not readable or already consumed). */
async function readRawBytes(req: ApiRequest): Promise<Buffer> {
  if (typeof req[Symbol.asyncIterator] !== 'function') return Buffer.alloc(0);
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

async function readRawBody(req: ApiRequest): Promise<string> {
  return (await readRawBytes(req)).toString('utf8');
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

/** Percent-decoding into raw bytes: `%XX` → byte, `+` → space, other chars → their own byte. */
function percentDecodeBytes(token: string): Buffer {
  const out: number[] = [];
  for (let i = 0; i < token.length; i += 1) {
    const char = token[i];
    if (char === '%' && /^[0-9a-fA-F]{2}$/.test(token.slice(i + 1, i + 3))) {
      out.push(Number.parseInt(token.slice(i + 1, i + 3), 16));
      i += 2;
    } else if (char === '+') {
      out.push(0x20);
    } else {
      out.push(token.charCodeAt(i) & 0xff);
    }
  }
  return Buffer.from(out);
}

/**
 * The gateway's urlencoded POST decoded byte-for-byte: every key and value is
 * a "binary" string (one char per byte, latin1), so the ver3 hash can be
 * recomputed over exactly the bytes the bank hashed, whatever charset it ran
 * in (NestPay's default is ISO-8859-9, which a UTF-8 parse would mangle).
 * Returns null when only a platform-parsed body exists; use readFormBody then.
 */
export async function readFormBodyBinary(req: ApiRequest): Promise<Record<string, string> | null> {
  // The stream first: touching req.body may cost the raw bytes on some hosts.
  let bytes = await readRawBytes(req);
  if (bytes.length === 0) {
    const body = req.body;
    if (Buffer.isBuffer(body)) bytes = body;
    else if (typeof body === 'string') bytes = Buffer.from(body, 'utf8');
    else return null;
  }
  const params: Record<string, string> = {};
  for (const pair of bytes.toString('latin1').split('&')) {
    if (!pair) continue;
    const separator = pair.indexOf('=');
    const key = percentDecodeBytes(separator === -1 ? pair : pair.slice(0, separator)).toString('latin1');
    const value = separator === -1 ? '' : percentDecodeBytes(pair.slice(separator + 1)).toString('latin1');
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
