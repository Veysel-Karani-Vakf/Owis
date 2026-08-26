// Resolves the shared site content (header, hero, home sections, footer, UI
// strings) by layering CMS entries over the static translations.

import { localizedContent, type Locale, type SiteContent } from '@/i18n/content';
import { cmsPageContent, cmsPartners, cmsStats } from './adapters';

export function resolveSiteContent(locale: Locale): SiteContent {
  const base = localizedContent[locale];

  // `home` carries the landing sections; `settings` carries chrome shared by
  // every page (meta, logo, nav, footer, UI labels).
  const withHome = cmsPageContent<SiteContent>('home', locale, base);
  const merged = cmsPageContent<SiteContent>('settings', locale, withHome);

  // Indicators live in the `stat_indicators` table only (the dashboard's
  // "Statistics" list): it gives editors ordering and publish flags. The static
  // copies here are the offline fallback.
  return {
    ...merged,
    partners: {
      ...merged.partners,
      items: cmsPartners(locale, merged.partners.items),
    },
    statistics: {
      ...merged.statistics,
      indicators: cmsStats('statistics', locale, merged.statistics.indicators),
    },
    yemenPioneers: {
      ...merged.yemenPioneers,
      indicators: cmsStats('yemen-pioneers', locale, merged.yemenPioneers.indicators),
    },
  };
}
