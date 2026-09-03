// Builds the editable value for a site page by reading what the site renders,
// then narrowing it to the paths declared in the page schema.
//
// Narrowing to schema paths keeps unrelated data — a programs list, for
// instance — out of `site_pages`, where it would otherwise shadow the dedicated
// content tables.

import type { Locale } from '@/lib/types';
import { resolveSiteContent } from '@/cms/siteContent';
import { localizedContent } from '@/i18n/content';
import { aboutPages, getAboutContent } from '@/data/about';
import { getBankAccountsContent, localizedBankAccountsContent } from '@/data/bankAccounts';
import { getDonateContent, localizedDonateContent } from '@/data/donate';
import {
  getDonateCheckoutContent,
  getDonateResultContent,
  staticDonateCheckoutPage,
} from '@/data/donateCheckout';
import { getLibraryContent, staticLibraryContent } from '@/data/library';
import { getLibraryProfileContent, staticLibraryProfileContent } from '@/data/library/profile';
import { getNewsLabels, newsLabels } from '@/data/news';
import { getParticipateContent, staticParticipateContent } from '@/data/participate';
import { getProgramsContent, localizedPrograms } from '@/data/programs';
import { getProjectsContent, staticProjectsContent } from '@/data/projects';
import { SITE_PAGES, getPageDef } from './pageSchema';
import { getAtPath, setAtPath } from './paths';

/**
 * `live` reflects what visitors currently see (static defaults merged with
 * anything already saved), so an editor never opens a blank form. `static` is
 * the content as it ships in this repo, used by the import tool to restore the
 * original copy.
 */
export type PageSource = 'live' | 'static';

function pageSource(pageKey: string, locale: Locale, mode: PageSource): unknown {
  const live = mode === 'live';

  switch (pageKey) {
    case 'home':
    case 'settings':
      return live ? resolveSiteContent(locale) : localizedContent[locale];
    case 'projects-page':
      return live ? getProjectsContent(locale) : staticProjectsContent(locale);
    case 'programs-page':
      return live ? getProgramsContent(locale) : localizedPrograms[locale];
    case 'about-waqf':
      return live ? getAboutContent(locale).waqf : aboutPages[locale].waqf;
    case 'governance':
      return live ? getAboutContent(locale).governance : aboutPages[locale].governance;
    case 'about-nav':
      return live ? getAboutContent(locale).nav : aboutPages[locale].nav;
    case 'donate-page':
      return live ? getDonateContent(locale) : localizedDonateContent[locale];
    case 'donate-checkout':
      return live
        ? { checkout: getDonateCheckoutContent(locale), result: getDonateResultContent(locale) }
        : staticDonateCheckoutPage(locale);
    case 'bank-accounts-page':
      // The schema holds no `banks` paths, so the table-backed list never
      // leaks into `site_pages` where it would shadow the bank_accounts table.
      return live ? getBankAccountsContent(locale) : localizedBankAccountsContent[locale];
    case 'participate':
      return live ? getParticipateContent(locale) : staticParticipateContent(locale);
    case 'library-page':
      return live ? getLibraryContent(locale) : staticLibraryContent(locale);
    case 'library-profile':
      return live ? getLibraryProfileContent(locale) : staticLibraryProfileContent(locale);
    case 'news-page':
      return live ? getNewsLabels(locale) : newsLabels[locale];
    default:
      return {};
  }
}

/** Value of every schema field on `pageKey`, for one locale. */
export function buildPageValue(pageKey: string, locale: Locale, mode: PageSource = 'live'): unknown {
  const definition = getPageDef(pageKey);
  if (!definition) return {};
  const source = pageSource(pageKey, locale, mode);

  let value: unknown = {};
  for (const section of definition.sections) {
    for (const field of section.fields) {
      const current = getAtPath(source, field.path);
      if (current === undefined) continue;
      value = setAtPath(value, field.path, current);
    }
  }
  return value;
}

/** Every page's static content, shaped for a `site_pages` upsert. */
export function buildAllPageRows(locales: Locale[]) {
  return SITE_PAGES.map((page) => ({
    key: page.key,
    label: page.label,
    data: Object.fromEntries(
      locales.map((locale) => [locale, buildPageValue(page.key, locale, 'static')]),
    ),
  }));
}
