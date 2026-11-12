// Reading helpers for Owais Volunteer Award nominations: the labels, lookups
// and derived values shared by the dashboard page and the Excel export.
//
// Rows are written by the server after validation, but everything here still
// treats stored JSON defensively — a row edited by hand must not break the list.

import {
  awardFormRules,
  formLocaleTag,
  getAwardFormContent,
  impactIds,
  yemenGovernorates,
  type CategoryValue,
  type ImpactId,
  type PlatformId,
} from '@/data/award/form';
import type { AwardApplicationRow, AwardApplicationStatus, Locale } from '@/lib/types';

const L = (ar: string, tr: string, en: string): Record<Locale, string> => ({ ar, tr, en });

/** Columns the dashboard reads (everything except the sender-address hash). */
export const AWARD_APPLICATION_COLUMNS =
  'id,reference_no,edition,locale,initiative_name,representative,whatsapp,email,all_members_yemeni,team_size,' +
  'governorate,district,period_start,period_end,ongoing,category,category_other,social_links,answer_idea,' +
  'answer_results,answer_team,answer_sustainability,images,declaration_accepted,status,admin_notes,source_url,' +
  'created_at,updated_at';

export const AWARD_STATUSES: AwardApplicationStatus[] = ['new', 'reviewing', 'shortlisted', 'rejected', 'archived'];

export const awardStatusLabel: Record<AwardApplicationStatus, Record<Locale, string>> = {
  new: L('جديد', 'Yeni', 'New'),
  reviewing: L('قيد المراجعة', 'İnceleniyor', 'Under review'),
  shortlisted: L('مقبول مبدئياً', 'Ön kabul', 'Shortlisted'),
  rejected: L('مرفوض', 'Reddedildi', 'Rejected'),
  archived: L('مؤرشف', 'Arşivlendi', 'Archived'),
};

export const formLanguageName: Record<string, string> = { ar: 'العربية', tr: 'Türkçe', en: 'English' };

/** The award runs on Yemen time (UTC+3, no daylight saving). */
export const AWARD_TIME_ZONE = 'Asia/Aden';

const governorateByCode = new Map(yemenGovernorates.map((entry) => [entry.code, entry.name]));

export function governorateName(code: string, locale: Locale): string {
  return governorateByCode.get(code)?.[locale] ?? code;
}

/** The field of the initiative; "other" shows what the applicant typed. */
export function categoryName(row: Pick<AwardApplicationRow, 'category' | 'category_other'>, locale: Locale): string {
  const options = getAwardFormContent(locale).fields.category.options;
  if (row.category === 'other') return row.category_other?.trim() || options.other;
  return options[row.category as CategoryValue] ?? row.category;
}

/** "2026-03" → "مارس 2026" in the dashboard's language. */
export function monthLabel(value: string | null, locale: Locale): string {
  const match = /^(\d{4})-(\d{2})$/.exec(value ?? '');
  if (!match) return value ?? '';
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, 1));
  return new Intl.DateTimeFormat(formLocaleTag[locale], { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(date);
}

export function periodLabel(
  row: Pick<AwardApplicationRow, 'period_start' | 'period_end' | 'ongoing'>,
  locale: Locale,
): string {
  const end = row.ongoing || !row.period_end ? getAwardFormContent(locale).review.ongoing : monthLabel(row.period_end, locale);
  return `${monthLabel(row.period_start, locale)} – ${end}`;
}

export function submittedAt(iso: string, locale: Locale): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat(formLocaleTag[locale], {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: AWARD_TIME_ZONE,
  }).format(date);
}

export type AwardSocialLink = { platform: string; label: string; url: string };

/** A stored link is only ever opened when it is a real http(s) address. */
export function safeHttpUrl(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : null;
  } catch {
    return null;
  }
}

export function socialLinks(row: Pick<AwardApplicationRow, 'social_links'>, locale: Locale): AwardSocialLink[] {
  if (!Array.isArray(row.social_links)) return [];
  const platforms = getAwardFormContent(locale).fields.social.platforms;
  return row.social_links.flatMap((item) => {
    const entry = (item && typeof item === 'object' ? item : {}) as Record<string, unknown>;
    const url = safeHttpUrl(entry.url);
    if (!url) return [];
    const platform = typeof entry.platform === 'string' ? entry.platform : 'other';
    const custom = typeof entry.name === 'string' ? entry.name.trim() : '';
    const label = platform === 'other' ? custom || platforms.other : (platforms[platform as PlatformId] ?? platform);
    return [{ platform, label, url }];
  });
}

export type AwardStoredImage = { path: string; name: string; type: string; size: number };

export function awardImages(row: Pick<AwardApplicationRow, 'images'>): AwardStoredImage[] {
  if (!Array.isArray(row.images)) return [];
  return row.images.flatMap((item) => {
    const entry = (item && typeof item === 'object' ? item : {}) as Record<string, unknown>;
    // Only objects inside the award folder of the submissions bucket are ever signed.
    if (typeof entry.path !== 'string' || !entry.path.startsWith('award/')) return [];
    return [
      {
        path: entry.path,
        name: typeof entry.name === 'string' && entry.name ? entry.name : entry.path.slice(entry.path.lastIndexOf('/') + 1),
        type: typeof entry.type === 'string' ? entry.type : '',
        size: typeof entry.size === 'number' ? entry.size : 0,
      },
    ];
  });
}

const answerColumn: Record<ImpactId, keyof AwardApplicationRow> = {
  idea: 'answer_idea',
  results: 'answer_results',
  team: 'answer_team',
  sustainability: 'answer_sustainability',
};

export type AwardAnswer = { id: ImpactId; title: string; question: string; answer: string; limit: number };

/** The four impact answers with the question each one replies to. */
export function awardAnswers(row: AwardApplicationRow, locale: Locale): AwardAnswer[] {
  const impact = getAwardFormContent(locale).fields.impact;
  return impactIds.map((id) => ({
    id,
    title: impact[id].title,
    question: impact[id].question,
    answer: String(row[answerColumn[id]] ?? ''),
    limit: awardFormRules.wordLimits[id],
  }));
}

/**
 * Applications that share an email address or a WhatsApp number with another
 * one. Repeats are accepted on purpose (a team may send a corrected form), so
 * the dashboard flags them instead: id → reference numbers of the others.
 */
export function findDuplicates(rows: AwardApplicationRow[]): Map<string, string[]> {
  const groups = new Map<string, AwardApplicationRow[]>();
  const add = (key: string, row: AwardApplicationRow) => {
    const group = groups.get(key);
    if (group) group.push(row);
    else groups.set(key, [row]);
  };
  for (const row of rows) {
    if (row.email) add(`email:${row.email.trim().toLowerCase()}`, row);
    if (row.whatsapp) add(`phone:${row.whatsapp.replace(/\D/g, '')}`, row);
  }

  const duplicates = new Map<string, string[]>();
  for (const group of groups.values()) {
    if (group.length < 2) continue;
    for (const row of group) {
      const others = duplicates.get(row.id) ?? [];
      for (const other of group) {
        const reference = other.reference_no ?? other.id;
        if (other.id !== row.id && !others.includes(reference)) others.push(reference);
      }
      duplicates.set(row.id, others);
    }
  }
  return duplicates;
}

/** Everything a search box should match on, lower-cased. */
export function searchText(row: AwardApplicationRow, locale: Locale): string {
  return [
    row.reference_no ?? '',
    row.initiative_name,
    row.representative,
    row.email,
    row.whatsapp,
    row.district,
    governorateName(row.governorate, locale),
    categoryName(row, locale),
  ]
    .join(' ')
    .toLowerCase();
}

/** wa.me link for a stored E.164 number. */
export function whatsappUrl(number: string): string | null {
  const digits = number.replace(/\D/g, '');
  return digits.length >= 7 ? `https://wa.me/${digits}` : null;
}
