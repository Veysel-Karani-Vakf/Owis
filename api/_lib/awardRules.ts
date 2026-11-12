/**
 * Owais Volunteer Award — server-side rules for a nomination.
 *
 * The browser form (src/components/award/form/applyState.ts) checks the same
 * conditions before sending; they are repeated here because a request can be
 * crafted without the form. Pure functions, no I/O. The constants mirror
 * src/data/award/form.ts — `npm run test:award` fails when the two drift.
 */

export const AWARD_EDITION = 2026;

export const AWARD_LOCALES = ['ar', 'tr', 'en'] as const;
export type AwardLocale = (typeof AWARD_LOCALES)[number];

export const AWARD_IMPACT_IDS = ['idea', 'results', 'team', 'sustainability'] as const;
export type AwardImpactId = (typeof AWARD_IMPACT_IDS)[number];

/** Official word limits of the four impact answers. */
export const AWARD_WORD_LIMITS: Record<AwardImpactId, number> = {
  idea: 50,
  results: 50,
  team: 75,
  sustainability: 50,
};

export const AWARD_CATEGORIES = ['education', 'health', 'environment', 'empowerment', 'other'] as const;

/** ISO 3166-2:YE codes of the 22 governorates. */
export const AWARD_GOVERNORATES = [
  'YE-SA',
  'YE-AB',
  'YE-AD',
  'YE-BA',
  'YE-DA',
  'YE-HU',
  'YE-JA',
  'YE-MR',
  'YE-MW',
  'YE-AM',
  'YE-DH',
  'YE-HD',
  'YE-HJ',
  'YE-IB',
  'YE-LA',
  'YE-MA',
  'YE-RA',
  'YE-SD',
  'YE-SN',
  'YE-SH',
  'YE-SU',
  'YE-TA',
] as const;

/** Hosts each platform's links live on (subdomains are accepted). */
export const AWARD_PLATFORM_DOMAINS: Record<string, string[]> = {
  facebook: ['facebook.com', 'fb.com', 'fb.me'],
  instagram: ['instagram.com', 'instagr.am'],
  x: ['x.com', 'twitter.com'],
  tiktok: ['tiktok.com'],
  youtube: ['youtube.com', 'youtu.be'],
  linkedin: ['linkedin.com'],
  telegram: ['t.me', 'telegram.me', 'telegram.org'],
  whatsapp: ['whatsapp.com', 'wa.me'],
  snapchat: ['snapchat.com'],
};

export const AWARD_PLATFORMS = [...Object.keys(AWARD_PLATFORM_DOMAINS), 'other'];

export const AWARD_LIMITS = {
  /** Official condition: implemented within the previous 12 months. */
  windowMonths: 12,
  minSocialPlatforms: 2,
  maxSocialRows: 8,
  maxTeamSize: 10000,
  maxTextLength: 120,
  /** Storage guard only; the real limit of an answer is its word count. */
  maxAnswerChars: 2000,
  maxUrlLength: 500,
  maxImages: 5,
  maxImageBytes: 3 * 1024 * 1024,
  imageTypes: ['image/jpeg', 'image/png', 'image/webp'],
} as const;

/* ------------------------------------------------------------------------- */
/* Application window (dashboard switch + deadline)                          */
/* ------------------------------------------------------------------------- */

/** Stored in the `site_pages` row `award-settings` (not localized). */
export type AwardSettings = {
  /** Master switch: false closes the form whatever the deadline says. */
  accepting: boolean;
  /** Last day applications are accepted (YYYY-MM-DD), or null for no deadline. */
  deadline: string | null;
};

export const AWARD_SETTINGS_KEY = 'award-settings';

/** The award runs on Yemen time (UTC+3, no daylight saving). */
export const AWARD_UTC_OFFSET = '+03:00';

const DATE_ONLY = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

/** A missing or malformed row means "open, no deadline". */
export function parseAwardSettings(raw: unknown): AwardSettings {
  const data = raw && typeof raw === 'object' && !Array.isArray(raw) ? (raw as Record<string, unknown>) : {};
  const deadline = typeof data.deadline === 'string' && DATE_ONLY.test(data.deadline.trim()) ? data.deadline.trim() : null;
  return { accepting: data.accepting !== false, deadline };
}

/** The instant the form closes: the end of the deadline day, Yemen time. */
export function awardDeadlineInstant(deadline: string): number {
  return Date.parse(`${deadline}T23:59:59.999${AWARD_UTC_OFFSET}`);
}

export type AwardWindow = { open: boolean; reason: 'open' | 'paused' | 'deadline' };

export function awardWindow(settings: AwardSettings, now: Date = new Date()): AwardWindow {
  if (!settings.accepting) return { open: false, reason: 'paused' };
  if (settings.deadline && now.getTime() > awardDeadlineInstant(settings.deadline)) {
    return { open: false, reason: 'deadline' };
  }
  return { open: true, reason: 'open' };
}

/* ------------------------------------------------------------------------- */
/* Text helpers (same behaviour as the browser form)                         */
/* ------------------------------------------------------------------------- */

/** Arabic-Indic and Persian digits to ASCII, so "١٢" counts as 12. */
export function normalizeDigits(value: string): string {
  return value
    .replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/g, (digit) => String(digit.charCodeAt(0) - 0x06f0));
}

// A word: letters / digits / combining marks, optionally joined by an
// apostrophe, hyphen or tatweel. Punctuation, emoji and whitespace never count.
const WORD = /[\p{L}\p{N}\p{M}]+(?:['’\-ـ][\p{L}\p{N}\p{M}]+)*/gu;

/** Counts words in Arabic or Latin text; "1,200" and "٣٫٥" count as one word. */
export function countWords(text: string): number {
  const normalized = normalizeDigits(text).replace(/(\d)[.,٫٬](?=\d)/g, '$1');
  return normalized.match(WORD)?.length ?? 0;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^\+\d{7,15}$/;
const YEAR_MONTH = /^(\d{4})-(0[1-9]|1[0-2])$/;
const IMAGE_PATH =
  /^award\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\/[a-z0-9][a-z0-9._-]{0,120}$/;

function monthIndex(value: string): number | null {
  const match = YEAR_MONTH.exec(value);
  return match ? Number(match[1]) * 12 + (Number(match[2]) - 1) : null;
}

function parseLink(value: string): URL | null {
  if (!value || /\s/.test(value) || value.length > AWARD_LIMITS.maxUrlLength) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
    if (!url.hostname.includes('.') || url.hostname.startsWith('.') || url.hostname.endsWith('.')) return null;
    return url;
  } catch {
    return null;
  }
}

function linkMatchesPlatform(url: URL, platform: string): boolean {
  if (platform === 'other') return true;
  const host = url.hostname.toLowerCase();
  return (AWARD_PLATFORM_DOMAINS[platform] ?? []).some((domain) => host === domain || host.endsWith(`.${domain}`));
}

/* ------------------------------------------------------------------------- */
/* Validation                                                                */
/* ------------------------------------------------------------------------- */

export type AwardSocialLink = { platform: string; name: string | null; url: string };
export type AwardImage = { path: string; name: string; type: string; size: number };

/** A nomination that passed every check, normalised for storage. */
export type AwardApplication = {
  locale: AwardLocale;
  initiativeName: string;
  representative: string;
  whatsapp: string;
  email: string;
  teamSize: number;
  governorate: string;
  district: string;
  periodStart: string;
  periodEnd: string | null;
  ongoing: boolean;
  category: string;
  categoryOther: string | null;
  socialLinks: AwardSocialLink[];
  answers: Record<AwardImpactId, string>;
  images: AwardImage[];
  sourceUrl: string | null;
};

export type AwardValidation = { ok: true; value: AwardApplication } | { ok: false; fields: string[] };

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

/**
 * Checks a submitted nomination against the award's conditions. Returns the
 * names of the offending payload fields, never a partial application.
 */
export function validateAwardApplication(body: Record<string, unknown>, now: Date = new Date()): AwardValidation {
  const bad = new Set<string>();
  const shortText = (key: string, value: string) => {
    if (value.length < 2 || value.length > AWARD_LIMITS.maxTextLength) bad.add(key);
  };

  // Bots fill every field they find; the form keeps this one hidden and empty.
  if (text(body.website)) bad.add('website');

  const rawLocale = text(body.locale);
  const locale: AwardLocale = (AWARD_LOCALES as readonly string[]).includes(rawLocale)
    ? (rawLocale as AwardLocale)
    : 'ar';

  const initiativeName = text(body.initiativeName);
  shortText('initiativeName', initiativeName);
  const representative = text(body.representative);
  shortText('representative', representative);

  const whatsapp = text(body.whatsapp);
  if (!PHONE.test(whatsapp)) bad.add('whatsapp');

  const email = text(body.email);
  if (email.length > 254 || !EMAIL.test(email)) bad.add('email');

  // Official condition: every member of the initiative is Yemeni.
  if (body.allMembersYemeni !== true) bad.add('allMembersYemeni');

  const teamSize = typeof body.teamSize === 'number' ? body.teamSize : Number.NaN;
  if (!Number.isInteger(teamSize) || teamSize < 1 || teamSize > AWARD_LIMITS.maxTeamSize) bad.add('teamSize');

  const governorate = text(body.governorate);
  if (!(AWARD_GOVERNORATES as readonly string[]).includes(governorate)) bad.add('governorate');
  const district = text(body.district);
  shortText('district', district);

  // Period: chronological, not in the future and inside the last 12 months.
  // One month of slack absorbs the gap between the applicant's clock (their
  // local month) and this server's UTC month around a month boundary.
  const period = record(body.period);
  const ongoing = period.ongoing === true;
  const periodStart = text(period.start);
  const rawEnd = period.end === null || period.end === undefined ? '' : text(period.end);
  const nowIndex = now.getUTCFullYear() * 12 + now.getUTCMonth();
  const startIndex = monthIndex(periodStart);
  if (startIndex === null || startIndex > nowIndex + 1 || startIndex < 1990 * 12) bad.add('period');
  let periodEnd: string | null = null;
  if (ongoing) {
    if (rawEnd) bad.add('period');
  } else {
    const endIndex = monthIndex(rawEnd);
    if (
      endIndex === null ||
      endIndex > nowIndex + 1 ||
      (startIndex !== null && endIndex < startIndex) ||
      endIndex < nowIndex - AWARD_LIMITS.windowMonths - 1
    ) {
      bad.add('period');
    }
    periodEnd = rawEnd;
  }

  const category = text(body.category);
  if (!(AWARD_CATEGORIES as readonly string[]).includes(category)) bad.add('category');
  let categoryOther: string | null = null;
  if (category === 'other') {
    categoryOther = text(body.categoryOther);
    if (!categoryOther || categoryOther.length > AWARD_LIMITS.maxTextLength) bad.add('categoryOther');
  }

  // Social links: every row valid, no platform twice, at least two platforms.
  const socialLinks: AwardSocialLink[] = [];
  const rawLinks = Array.isArray(body.socialLinks) ? body.socialLinks : [];
  if (rawLinks.length > AWARD_LIMITS.maxSocialRows) bad.add('socialLinks');
  const seen = new Set<string>();
  for (const item of rawLinks.slice(0, AWARD_LIMITS.maxSocialRows)) {
    const row = record(item);
    const platform = text(row.platform);
    const name = platform === 'other' ? text(row.name) : '';
    const url = parseLink(text(row.url));
    const key = platform === 'other' ? `other:${name.toLowerCase()}` : platform;
    if (
      !AWARD_PLATFORMS.includes(platform) ||
      (platform === 'other' && (!name || name.length > AWARD_LIMITS.maxTextLength)) ||
      !url ||
      !linkMatchesPlatform(url, platform) ||
      seen.has(key)
    ) {
      bad.add('socialLinks');
      continue;
    }
    seen.add(key);
    socialLinks.push({ platform, name: platform === 'other' ? name : null, url: url.toString() });
  }
  if (seen.size < AWARD_LIMITS.minSocialPlatforms) bad.add('socialLinks');

  const rawAnswers = record(body.answers);
  const answers = {} as Record<AwardImpactId, string>;
  for (const id of AWARD_IMPACT_IDS) {
    const answer = text(rawAnswers[id]);
    const words = countWords(answer);
    if (words === 0 || words > AWARD_WORD_LIMITS[id] || answer.length > AWARD_LIMITS.maxAnswerChars) {
      bad.add(`answers.${id}`);
    }
    answers[id] = answer;
  }

  // Photos are uploaded by the browser first; only their paths arrive here,
  // and all of them must sit in this application's own upload folder.
  const images: AwardImage[] = [];
  const rawImages = Array.isArray(body.images) ? body.images : [];
  if (rawImages.length > AWARD_LIMITS.maxImages) bad.add('images');
  let folder = '';
  for (const item of rawImages.slice(0, AWARD_LIMITS.maxImages)) {
    const row = record(item);
    const path = text(row.path);
    const match = IMAGE_PATH.exec(path);
    const type = text(row.type);
    const size = typeof row.size === 'number' ? row.size : Number.NaN;
    if (
      !match ||
      (folder && match[1] !== folder) ||
      images.some((image) => image.path === path) ||
      !(AWARD_LIMITS.imageTypes as readonly string[]).includes(type) ||
      !Number.isInteger(size) ||
      size < 1 ||
      size > AWARD_LIMITS.maxImageBytes
    ) {
      bad.add('images');
      continue;
    }
    folder = match[1];
    images.push({ path, name: text(row.name).slice(0, 200) || path.slice(path.lastIndexOf('/') + 1), type, size });
  }

  if (body.declarationAccepted !== true) bad.add('declarationAccepted');

  let sourceUrl: string | null = text(body.sourceUrl).slice(0, 300) || null;
  if (sourceUrl && !/^https?:\/\//i.test(sourceUrl)) sourceUrl = null;

  if (bad.size) return { ok: false, fields: [...bad] };
  return {
    ok: true,
    value: {
      locale,
      initiativeName,
      representative,
      whatsapp,
      email,
      teamSize,
      governorate,
      district,
      periodStart,
      periodEnd,
      ongoing,
      category,
      categoryOther,
      socialLinks,
      answers,
      images,
      sourceUrl,
    },
  };
}

/** Column values of one `award_applications` row (the reference is set by the database). */
export function toAwardRow(application: AwardApplication, ipHash: string | null): Record<string, unknown> {
  return {
    edition: AWARD_EDITION,
    locale: application.locale,
    initiative_name: application.initiativeName,
    representative: application.representative,
    whatsapp: application.whatsapp,
    email: application.email,
    all_members_yemeni: true,
    team_size: application.teamSize,
    governorate: application.governorate,
    district: application.district,
    period_start: application.periodStart,
    period_end: application.periodEnd,
    ongoing: application.ongoing,
    category: application.category,
    category_other: application.categoryOther,
    social_links: application.socialLinks,
    answer_idea: application.answers.idea,
    answer_results: application.answers.results,
    answer_team: application.answers.team,
    answer_sustainability: application.answers.sustainability,
    images: application.images,
    declaration_accepted: true,
    source_url: application.sourceUrl,
    ip_hash: ipHash,
  };
}
