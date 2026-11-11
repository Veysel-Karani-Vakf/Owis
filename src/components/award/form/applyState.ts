import {
  PHONE_OTHER,
  YEMEN_ISO,
  awardFormRules,
  fillTemplate,
  impactIds,
  phoneCountries,
  platformDomains,
  type ApplyStepId,
  type AwardFormContent,
  type CategoryValue,
  type ImpactId,
  type PlatformId,
} from '@/data/award/form';

/*
 * Form state and validation for the award nomination wizard. Pure functions,
 * independent of React and of any backend, so the eventual API integration
 * only has to consume `buildApplicationPayload`.
 */

export type SocialRow = { id: string; platform: PlatformId | ''; name: string; url: string };

export type ApplyValues = {
  initiativeName: string;
  representative: string;
  phoneCountry: string;
  phoneCustomCode: string;
  phoneNumber: string;
  email: string;
  allYemeni: '' | 'yes' | 'no';
  teamSize: string;
  governorate: string;
  district: string;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  ongoing: boolean;
  category: '' | CategoryValue;
  categoryOther: string;
  social: SocialRow[];
  answers: Record<ImpactId, string>;
  declaration: boolean;
};

/** An image kept in browser memory only (never uploaded in this phase). */
export type AttachedImage = { id: string; file: File; url: string };

let rowSeed = 0;
export const newRowId = () => `row-${Date.now().toString(36)}-${(rowSeed += 1)}`;

export function initialApplyValues(): ApplyValues {
  return {
    initiativeName: '',
    representative: '',
    phoneCountry: YEMEN_ISO,
    phoneCustomCode: '',
    phoneNumber: '',
    email: '',
    allYemeni: '',
    teamSize: '',
    governorate: '',
    district: '',
    startMonth: '',
    startYear: '',
    endMonth: '',
    endYear: '',
    ongoing: false,
    category: '',
    categoryOther: '',
    social: [
      { id: newRowId(), platform: '', name: '', url: '' },
      { id: newRowId(), platform: '', name: '', url: '' },
    ],
    answers: { idea: '', results: '', team: '', sustainability: '' },
    declaration: false,
  };
}

/** DOM id of a field, used for labels, error links and focusing the first invalid field. */
export const fieldDomId = (key: string) => `award-f-${key.replace(/[^a-zA-Z0-9-]/g, '-')}`;

/* ------------------------------------------------------------------------- */
/* Text helpers                                                              */
/* ------------------------------------------------------------------------- */

/** Arabic-Indic and Persian digits to ASCII, so "١٢" counts as 12. */
export function normalizeDigits(value: string) {
  return value
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0));
}

// A word: letters / digits / combining marks (harakat), optionally joined by an
// apostrophe, hyphen or tatweel. Punctuation, emoji and whitespace never count.
const WORD = /[\p{L}\p{N}\p{M}]+(?:['’\-ـ][\p{L}\p{N}\p{M}]+)*/gu;

/** Counts words in Arabic or Latin text; "1,200" and "٣٫٥" count as one word. */
export function countWords(text: string) {
  const normalized = normalizeDigits(text).replace(/(\d)[.,٫٬](?=\d)/g, '$1');
  return normalized.match(WORD)?.length ?? 0;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** National number digits without separators or a leading trunk zero. */
export function phoneDigits(value: string) {
  return normalizeDigits(value).replace(/\D/g, '').replace(/^0+/, '');
}

export function phoneDialCode(values: Pick<ApplyValues, 'phoneCountry' | 'phoneCustomCode'>) {
  if (values.phoneCountry === PHONE_OTHER) return normalizeDigits(values.phoneCustomCode).replace(/\D/g, '');
  return phoneCountries.find((country) => country.iso === values.phoneCountry)?.dial ?? '';
}

/** "+967 777 123 456"-style display string (E.164 digits, grouped by threes). */
export function formatPhone(values: Pick<ApplyValues, 'phoneCountry' | 'phoneCustomCode' | 'phoneNumber'>) {
  const digits = phoneDigits(values.phoneNumber);
  if (!digits) return '';
  return `+${phoneDialCode(values)} ${digits.replace(/(\d{3})(?=\d)/g, '$1 ')}`;
}

/** Parses a profile link; a missing scheme defaults to https. */
export function parseLink(value: string): URL | null {
  const trimmed = value.trim();
  if (!trimmed || /\s/.test(trimmed)) return null;
  try {
    const url = new URL(/^[a-z][a-z\d+.-]*:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
    if (!url.hostname.includes('.') || url.hostname.startsWith('.') || url.hostname.endsWith('.')) return null;
    return url;
  } catch {
    return null;
  }
}

function linkMatchesPlatform(url: URL, platform: PlatformId) {
  if (platform === 'other') return true;
  const host = url.hostname.toLowerCase();
  return platformDomains[platform].some((domain) => host === domain || host.endsWith(`.${domain}`));
}

const filledRow = (row: SocialRow) => Boolean(row.platform || row.url.trim() || row.name.trim());

/* ------------------------------------------------------------------------- */
/* Period helpers                                                            */
/* ------------------------------------------------------------------------- */

const monthIndex = (year: string, month: string) => Number(year) * 12 + (Number(month) - 1);
export const currentMonthIndex = (now: Date) => now.getFullYear() * 12 + now.getMonth();

/* ------------------------------------------------------------------------- */
/* Validation                                                                */
/* ------------------------------------------------------------------------- */

export type FieldError = {
  /** Field key (also the error's display slot). */
  key: string;
  message: string;
  /** Field to focus when this is the first error; defaults to `key`. */
  focus?: string;
};

type Ctx = { content: AwardFormContent; now: Date };

function requiredText(errors: FieldError[], key: string, value: string, msg: AwardFormContent['messages']) {
  const trimmed = value.trim();
  if (!trimmed) errors.push({ key, message: msg.required });
  else if (trimmed.length < 2) errors.push({ key, message: msg.tooShort });
  else if (trimmed.length > awardFormRules.maxTextLength)
    errors.push({ key, message: fillTemplate(msg.tooLong, { max: awardFormRules.maxTextLength }) });
}

function validateBasic(values: ApplyValues, { content }: Ctx) {
  const msg = content.messages;
  const errors: FieldError[] = [];
  requiredText(errors, 'initiativeName', values.initiativeName, msg);
  requiredText(errors, 'representative', values.representative, msg);

  // WhatsApp number: any country; Yemeni mobiles are 9 digits starting with 7.
  if (values.phoneCountry === PHONE_OTHER && !/^\d{1,4}$/.test(phoneDialCode(values))) {
    errors.push({ key: 'phoneCustomCode', message: msg.customCode });
  }
  const digits = phoneDigits(values.phoneNumber);
  if (!values.phoneNumber.trim()) errors.push({ key: 'phoneNumber', message: msg.required });
  else if (values.phoneCountry === YEMEN_ISO && !/^7\d{8}$/.test(digits))
    errors.push({ key: 'phoneNumber', message: msg.phoneYemen });
  else if (digits.length < 6 || digits.length > 12 || digits.length + phoneDialCode(values).length > 15)
    errors.push({ key: 'phoneNumber', message: msg.phone });

  if (!values.email.trim()) errors.push({ key: 'email', message: msg.required });
  else if (!EMAIL.test(values.email.trim())) errors.push({ key: 'email', message: msg.email });

  // Official condition: every member must be Yemeni.
  if (!values.allYemeni) errors.push({ key: 'allYemeni', message: msg.required, focus: 'allYemeni-yes' });
  else if (values.allYemeni === 'no')
    errors.push({ key: 'allYemeni', message: msg.nationality, focus: 'allYemeni-no' });

  const team = normalizeDigits(values.teamSize.trim());
  if (!team) errors.push({ key: 'teamSize', message: msg.required });
  else if (!/^\d+$/.test(team) || Number(team) < 1 || Number(team) > awardFormRules.maxTeamSize)
    errors.push({ key: 'teamSize', message: msg.teamSize });
  return errors;
}

function validateDetails(values: ApplyValues, { content, now }: Ctx) {
  const msg = content.messages;
  const errors: FieldError[] = [];
  if (!values.governorate) errors.push({ key: 'governorate', message: msg.required });
  requiredText(errors, 'district', values.district, msg);

  // Period: chronological, not in the future, and (official condition) inside the last 12 months.
  const nowIndex = currentMonthIndex(now);
  const hasStart = Boolean(values.startMonth && values.startYear);
  const hasEnd = Boolean(values.endMonth && values.endYear);
  if (!hasStart) {
    errors.push({
      key: 'periodStart',
      message: msg.periodStart,
      focus: values.startMonth ? 'startYear' : 'startMonth',
    });
  } else if (monthIndex(values.startYear, values.startMonth) > nowIndex) {
    errors.push({ key: 'periodStart', message: msg.periodFuture, focus: 'startMonth' });
  }
  if (!values.ongoing) {
    if (!hasEnd) {
      errors.push({ key: 'periodEnd', message: msg.periodEnd, focus: values.endMonth ? 'endYear' : 'endMonth' });
    } else {
      const end = monthIndex(values.endYear, values.endMonth);
      if (end > nowIndex) errors.push({ key: 'periodEnd', message: msg.periodFuture, focus: 'endMonth' });
      else if (hasStart && end < monthIndex(values.startYear, values.startMonth))
        errors.push({ key: 'periodEnd', message: msg.periodOrder, focus: 'endMonth' });
      else if (end < nowIndex - awardFormRules.windowMonths)
        errors.push({ key: 'periodEnd', message: msg.periodWindow, focus: 'endMonth' });
    }
  }

  if (!values.category) errors.push({ key: 'category', message: msg.required, focus: 'category-education' });
  else if (values.category === 'other' && !values.categoryOther.trim())
    errors.push({ key: 'categoryOther', message: msg.categoryOther });

  // Social links: every filled row must be valid; at least two distinct platforms overall.
  const seen = new Set<string>();
  let valid = 0;
  for (const row of values.social) {
    if (!filledRow(row)) continue;
    const before = errors.length;
    const platformName =
      row.platform === 'other'
        ? row.name.trim().toLowerCase()
        : row.platform
          ? content.fields.social.platforms[row.platform]
          : '';
    if (!row.platform) errors.push({ key: `social.${row.id}.platform`, message: msg.socialPlatform });
    else if (row.platform === 'other' && !row.name.trim())
      errors.push({ key: `social.${row.id}.name`, message: msg.socialOtherName });
    else if (seen.has(`${row.platform}:${platformName}`))
      errors.push({ key: `social.${row.id}.platform`, message: msg.socialDuplicate });

    const url = parseLink(row.url);
    if (!row.url.trim()) errors.push({ key: `social.${row.id}.url`, message: msg.required });
    else if (!url) errors.push({ key: `social.${row.id}.url`, message: msg.socialUrl });
    else if (row.platform && !linkMatchesPlatform(url, row.platform))
      errors.push({
        key: `social.${row.id}.url`,
        message: fillTemplate(msg.socialDomain, { platform: content.fields.social.platforms[row.platform] }),
      });

    if (row.platform) seen.add(`${row.platform}:${platformName}`);
    if (errors.length === before) valid += 1;
  }
  if (valid < awardFormRules.minSocialPlatforms) {
    const target = values.social.find((row) => !filledRow(row)) ?? values.social[0];
    errors.push({
      key: 'social',
      message: msg.socialMin,
      focus: target ? `social.${target.id}.platform` : 'social-add',
    });
  }
  return errors;
}

function validateImpact(values: ApplyValues, { content }: Ctx) {
  const msg = content.messages;
  const errors: FieldError[] = [];
  for (const id of impactIds) {
    const words = countWords(values.answers[id]);
    const limit = awardFormRules.wordLimits[id];
    if (words === 0) errors.push({ key: `answers.${id}`, message: msg.required });
    else if (words > limit)
      errors.push({ key: `answers.${id}`, message: fillTemplate(msg.wordsOver, { limit, over: words - limit }) });
  }
  return errors;
}

function validateReview(values: ApplyValues, { content }: Ctx) {
  return values.declaration ? [] : [{ key: 'declaration', message: content.messages.declaration }];
}

const validators: Record<ApplyStepId, (values: ApplyValues, ctx: Ctx) => FieldError[]> = {
  basic: validateBasic,
  details: validateDetails,
  impact: validateImpact,
  review: validateReview,
};

export function validateStep(step: ApplyStepId, values: ApplyValues, content: AwardFormContent, now = new Date()) {
  return validators[step](values, { content, now });
}

/** Distinct platforms with a valid link, for the live "x of 2" counter. */
export function countValidSocialRows(rows: SocialRow[]) {
  const seen = new Set<string>();
  for (const row of rows) {
    if (!row.platform || (row.platform === 'other' && !row.name.trim())) continue;
    const url = parseLink(row.url);
    if (!url || !linkMatchesPlatform(url, row.platform)) continue;
    seen.add(row.platform === 'other' ? `other:${row.name.trim().toLowerCase()}` : row.platform);
  }
  return seen.size;
}

const toMb = (bytes: number) => (bytes / (1024 * 1024)).toFixed(1);

/**
 * Screens picked / dropped files: JPG, PNG or WebP only, at most 3 MB each and
 * 5 in total (proposed limits). Returns the accepted files and a message per rejection.
 */
export function screenImages(files: File[], alreadyAttached: number, content: AwardFormContent) {
  const { images } = awardFormRules;
  const errors = content.attachments.errors;
  const accepted: File[] = [];
  const rejected: string[] = [];
  for (const file of files) {
    const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
    const typeOk = images.types.includes(file.type) || (!file.type && images.extensions.includes(extension));
    if (!typeOk) rejected.push(fillTemplate(errors.type, { name: file.name }));
    else if (file.size > images.maxBytes)
      rejected.push(
        fillTemplate(errors.size, { name: file.name, size: toMb(file.size), max: images.maxBytes / (1024 * 1024) })
      );
    else if (alreadyAttached + accepted.length >= images.max)
      rejected.push(fillTemplate(errors.count, { name: file.name, max: images.max }));
    else accepted.push(file);
  }
  return { accepted, rejected };
}

/** Props every wizard step receives. */
export type StepProps = {
  values: ApplyValues;
  update: <K extends keyof ApplyValues>(key: K, value: ApplyValues[K]) => void;
  errorOf: (key: string) => string | undefined;
  content: AwardFormContent;
};

/** Whether anything has been entered (used to warn before leaving the page). */
export function isDirty(values: ApplyValues, images: AttachedImage[]) {
  const blank = initialApplyValues();
  return (
    images.length > 0 ||
    (Object.keys(blank) as (keyof ApplyValues)[]).some((key) => {
      if (key === 'social') return values.social.some(filledRow);
      if (key === 'answers') return impactIds.some((id) => values.answers[id].trim());
      return values[key] !== blank[key];
    })
  );
}

/* ------------------------------------------------------------------------- */
/* Payload (for the future backend)                                          */
/* ------------------------------------------------------------------------- */

export type AwardApplicationPayload = {
  initiativeName: string;
  representative: string;
  whatsapp: string;
  email: string;
  allMembersYemeni: boolean;
  teamSize: number;
  governorate: string;
  district: string;
  period: { start: string; end: string | null; ongoing: boolean };
  category: CategoryValue;
  categoryOther: string | null;
  socialLinks: { platform: PlatformId; name: string | null; url: string }[];
  answers: Record<ImpactId, string>;
  images: { name: string; type: string; size: number }[];
  declarationAccepted: boolean;
};

const yyyymm = (year: string, month: string) => `${year}-${month.padStart(2, '0')}`;

/** The application as a backend would receive it (files are listed, not uploaded). */
export function buildApplicationPayload(values: ApplyValues, images: AttachedImage[]): AwardApplicationPayload {
  return {
    initiativeName: values.initiativeName.trim(),
    representative: values.representative.trim(),
    whatsapp: `+${phoneDialCode(values)}${phoneDigits(values.phoneNumber)}`,
    email: values.email.trim(),
    allMembersYemeni: values.allYemeni === 'yes',
    teamSize: Number(normalizeDigits(values.teamSize.trim())),
    governorate: values.governorate,
    district: values.district.trim(),
    period: {
      start: yyyymm(values.startYear, values.startMonth),
      end: values.ongoing ? null : yyyymm(values.endYear, values.endMonth),
      ongoing: values.ongoing,
    },
    category: values.category as CategoryValue,
    categoryOther: values.category === 'other' ? values.categoryOther.trim() : null,
    socialLinks: values.social.filter(filledRow).map((row) => ({
      platform: row.platform as PlatformId,
      name: row.platform === 'other' ? row.name.trim() : null,
      url: parseLink(row.url)?.toString() ?? row.url.trim(),
    })),
    answers: { ...values.answers },
    images: images.map(({ file }) => ({ name: file.name, type: file.type, size: file.size })),
    declarationAccepted: values.declaration,
  };
}
