import { cmsPage } from '@/cms/store';
import type { Locale } from '@/i18n/content';

/*
 * The award's switches. The award team sets them in the dashboard
 * (طلبات جائزة أويس → إعدادات الجائزة); they are stored once for every language
 * in the `site_pages` row `award-settings`:
 *   - `visible`   — whether the award pages exist for visitors at all;
 *   - `accepting` — whether the nomination form takes applications;
 *   - `deadline`  — the last day it does.
 * The same rules run on the server (api/_lib/awardRules.ts), which has the
 * final say on every submission.
 */

export type AwardSettings = {
  /**
   * False hides the whole award section from visitors: no tab in the menu, the
   * award pages redirect home and no application is accepted.
   */
  visible: boolean;
  /** Master switch of the form: false closes it whatever the deadline says. */
  accepting: boolean;
  /** Last day applications are accepted (YYYY-MM-DD), or null for no deadline. */
  deadline: string | null;
};

export const AWARD_SETTINGS_KEY = 'award-settings';

/** The award runs on Yemen time (UTC+3, no daylight saving). */
export const AWARD_UTC_OFFSET = '+03:00';
const AWARD_TIME_ZONE = 'Asia/Aden';

const DATE_ONLY = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

/** A missing or malformed row means "visible, open, no deadline". */
export function parseAwardSettings(raw: unknown): AwardSettings {
  const data = raw && typeof raw === 'object' && !Array.isArray(raw) ? (raw as Record<string, unknown>) : {};
  const deadline = typeof data.deadline === 'string' && DATE_ONLY.test(data.deadline.trim()) ? data.deadline.trim() : null;
  return { visible: data.visible !== false, accepting: data.accepting !== false, deadline };
}

/** The settings visitors are served (defaults until the dashboard saves a row). */
export function getAwardSettings(): AwardSettings {
  return parseAwardSettings(cmsPage(AWARD_SETTINGS_KEY));
}

/** The instant the form closes: the end of the deadline day, Yemen time. */
export function awardDeadlineInstant(deadline: string): number {
  return Date.parse(`${deadline}T23:59:59.999${AWARD_UTC_OFFSET}`);
}

export type AwardWindow = { open: boolean; reason: 'open' | 'hidden' | 'paused' | 'deadline' };

/** Whether an application sent at `now` is accepted, and why not when it is not. */
export function awardWindow(settings: AwardSettings, now: Date = new Date()): AwardWindow {
  if (!settings.visible) return { open: false, reason: 'hidden' };
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
