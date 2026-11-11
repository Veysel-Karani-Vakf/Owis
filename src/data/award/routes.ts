import type { Locale, SiteContent } from '@/i18n/content';

/** Public routes of the Owais Volunteer Award 2026 section. */
export const awardRoutes = {
  landing: '/volunteer-award',
  eligibility: '/volunteer-award/eligibility',
  apply: '/volunteer-award/apply',
  success: '/volunteer-award/success',
} as const;

/** True for the award landing page and every page under it. */
export function isAwardRoute(pathname: string) {
  return pathname === awardRoutes.landing || pathname.startsWith(`${awardRoutes.landing}/`);
}

/** Label of the award tab in the site header and mobile menu. */
export const awardNavLabel: Record<Locale, string> = {
  ar: 'جائزة أويس',
  en: 'Owais Award',
  tr: 'Owais Ödülü',
};

type NavLinks = SiteContent['navLinks'];

/**
 * Adds the award tab to the header / mobile navigation, right before the
 * "Participate" tab (after "News" when that is missing).
 *
 * The live `settings` row stores the whole nav list per language, so the tab
 * is added here, at render time, rather than in the content the dashboard
 * edits: it ships with the award pages and is never written to the database
 * by a settings save. If an editor later adds a /volunteer-award entry from
 * the dashboard, that entry is used as is.
 */
export function withAwardNavLink(links: NavLinks | undefined, locale: Locale): NavLinks {
  const list = links ?? [];
  if (list.some((link) => isAwardRoute(link.href ?? ''))) return list;

  const tab = { label: awardNavLabel[locale], href: awardRoutes.landing };
  const participate = list.findIndex((link) => (link.href ?? '').startsWith('/participate'));
  const news = list.findIndex((link) => link.href === '/news');
  const at = participate >= 0 ? participate : news >= 0 ? news + 1 : list.length;

  return [...list.slice(0, at), tab, ...list.slice(at)];
}
