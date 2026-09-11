const ISBANK_RATE_URLS = [
  'https://www.isbank.com.tr/doviz-kurlari',
  'https://www.isbank.com.tr/en/foreign-exchange-rates',
] as const;
const CACHE_TTL_MS = 60_000;
const FETCH_TIMEOUT_MS = 7_000;

export type IsbankFxQuote = {
  baseCurrency: 'USD';
  quoteCurrency: 'TRY';
  rate: number;
  source: 'ISBANK_BANK_BUYING';
  sourceUrl: string;
  fetchedAt: string;
};

let cachedQuote: { quote: IsbankFxQuote; expiresAt: number } | null = null;

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec: string) => String.fromCodePoint(Number.parseInt(dec, 10)))
    .replace(/&nbsp;|&ensp;|&emsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>');
}

function pageToText(html: string): string {
  return decodeHtmlEntities(
    html
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' '),
  )
    .replace(/\s+/g, ' ')
    .trim();
}

function parseRate(raw: string): number | null {
  const value = Number(raw.replace(',', '.'));
  if (!Number.isFinite(value) || value <= 0 || value > 10_000) return null;
  return value;
}

/**
 * Extracts USD "Banka Alış" from İş Bankası's public live-rates page.
 * The public page renders each row as:
 *   USD Amerikan Doları <buying> <selling>
 * so the first numeric value after the USD label is the bank buying rate.
 */
export function parseIsbankUsdBuyingRate(html: string): number {
  const text = pageToText(html);
  const patterns = [
    /\bUSD\b\s+Amerikan\s+Dolar[ıi]\s+([0-9]{1,4}(?:[.,][0-9]{2,8}))/iu,
    /\bUSD\b\s+American\s+Dollar\s+([0-9]{1,4}(?:[.,][0-9]{2,8}))/iu,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (!match?.[1]) continue;
    const rate = parseRate(match[1]);
    if (rate !== null) return rate;
  }

  // Defensive fallback for small layout/text changes: find a USD row and use
  // the first decimal number after the recognizable currency name.
  const usdRow = text.match(/\bUSD\b\s+(?:Amerikan\s+Dolar[ıi]|American\s+Dollar)(.{0,180})/iu)?.[1];
  if (usdRow) {
    const number = usdRow.match(/([0-9]{1,4}(?:[.,][0-9]{2,8}))/)?.[1];
    if (number) {
      const rate = parseRate(number);
      if (rate !== null) return rate;
    }
  }

  throw new Error('Could not read USD Banka Alış from İş Bankası rates page.');
}

async function fetchQuoteFromUrl(sourceUrl: string): Promise<IsbankFxQuote> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(sourceUrl, {
      method: 'GET',
      headers: {
        Accept: 'text/html,application/xhtml+xml',
        'Accept-Language': 'tr-TR,tr;q=0.9,en;q=0.7',
        'User-Agent': 'Veysel-Karani-Vakfi-Payment/1.0 (+https://veysvakfi.org)',
      },
      cache: 'no-store',
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`İş Bankası rates request failed with HTTP ${response.status}.`);
    }

    const html = await response.text();
    const rate = parseIsbankUsdBuyingRate(html);
    return {
      baseCurrency: 'USD',
      quoteCurrency: 'TRY',
      rate,
      source: 'ISBANK_BANK_BUYING',
      sourceUrl,
      fetchedAt: new Date().toISOString(),
    };
  } finally {
    clearTimeout(timeout);
  }
}

export async function getIsbankUsdBuyingRate(): Promise<IsbankFxQuote> {
  const now = Date.now();
  if (cachedQuote && cachedQuote.expiresAt > now) return cachedQuote.quote;

  let lastError: unknown = null;
  for (const sourceUrl of ISBANK_RATE_URLS) {
    try {
      const quote = await fetchQuoteFromUrl(sourceUrl);
      cachedQuote = { quote, expiresAt: Date.now() + CACHE_TTL_MS };
      return quote;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error('Could not load USD Banka Alış from İş Bankası.');
}

export function convertUsdToTry(usdAmount: number, usdTryRate: number): number {
  if (!Number.isFinite(usdAmount) || usdAmount <= 0) throw new Error('Invalid USD amount.');
  if (!Number.isFinite(usdTryRate) || usdTryRate <= 0) throw new Error('Invalid USD/TRY rate.');

  const usdCents = Math.round(usdAmount * 100);
  if (Math.abs(usdAmount * 100 - usdCents) > 1e-6) {
    throw new Error('USD amount must have at most two decimal places.');
  }

  return Math.round(usdCents * usdTryRate) / 100;
}
