import { cmsPage } from '@/cms/store';
import type { Locale } from '@/i18n/content';

/*
 * When the award accepts nominations. The award team sets this in the dashboard
 * (طلبات جائزة أويس → استقبال الطلبات); it is stored once for every language in
 * the `site_pages` row `award-settings`. The same rules run on the server
 * (api/_lib/awardRules.ts), which has the final say on every submission.
 */

export type AwardSettings = {
  /** Master switch: false closes the form whatever the deadline says. */
  accepting: boolean;
  /** Last day applications are accepted (YYYY-MM-DD), or null for no deadline. */
  deadline: string | null;
};

export const AWARD_SETTINGS_KEY = 'award-settings';

/** The award runs on Yemen time (UTC+3, no daylight saving). */
export const AWARD_UTC_OFFSET = '+03:00';
const AWARD_TIME_ZONE = 'Asia/Aden';

const DATE_ONLY = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

/** A missing or malformed row means "open, no deadline". */
export function parseAwardSettings(raw: unknown): AwardSettings {
  const data = raw && typeof raw === 'object' && !Array.isArray(raw) ? (raw as Record<string, unknown>) : {};
  const deadline = typeof data.deadline === 'string' && DATE_ONLY.test(data.deadline.trim()) ? data.deadline.trim() : null;
  return { accepting: data.accepting !== false, deadline };
}

/** The settings visitors are served (defaults until the dashboard saves a row). */
export function getAwardSettings(): AwardSettings {
  return parseAwardSettings(cmsPage(AWARD_SETTINGS_KEY));
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

const dateLocale: Record<Locale, string> = { ar: 'ar-EG-u-nu-latn', en: 'en-GB', tr: 'tr-TR' };

/** "30 نوفمبر 2026" — the deadline day as people in Yemen read it. */
export function formatAwardDeadline(deadline: string, locale: Locale): string {
  const instant = awardDeadlineInstant(deadline);
  if (Number.isNaN(instant)) return deadline;
  return new Intl.DateTimeFormat(dateLocale[locale] ?? dateLocale.ar, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: AWARD_TIME_ZONE,
  }).format(new Date(instant));
}
