// Maps CMS rows onto the shapes the site's components already consume.
//
// Every adapter falls back to the matching static record (by slug/index) field
// by field, so a half-translated or partially filled row never blanks the page.

import type { Locale } from '@/lib/types';
import type { LocalizedWaqfProject, ProjectSlug } from '@/data/projects';
import type { Program, ProgramSlug } from '@/data/programs';
import type { LocalizedNewsArticle } from '@/data/news';
import type { DonationOpportunity } from '@/data/donate';
import type {
  LibraryDocumentItem,
  LibraryGalleryImage,
  LibraryTextItem,
} from '@/data/library';

import { cmsPage, cmsRows } from './store';
import { deepMerge, loc, locList } from './merge';
import { deepLocalize, localizedArray, localizedObject } from './localize';

/** Site-page content merged over the static default for `locale`. */
export function cmsPageContent<T>(key: string, locale: Locale, fallback: T): T {
  const page = cmsPage(key);
  if (!page) return fallback;
  return deepMerge(fallback, deepLocalize(page, locale));
}

function bySlug<T extends { slug?: string; id?: string }>(items: T[]): Map<string, T> {
  return new Map(items.map((item) => [item.slug ?? item.id ?? '', item]));
}

// PROJECTS -------------------------------------------------------------------
export function cmsProjects(
  locale: Locale,
  fallback: LocalizedWaqfProject[],
): LocalizedWaqfProject[] {
  const rows = cmsRows('projects');
  if (!rows) return fallback;
  const defaults = bySlug(fallback);

  return rows.map((row) => {
    const base = defaults.get(row.slug);
    return {
      // Slugs are open-ended once editors can add projects; the literal union
      // only describes the three that ship statically.
      id: row.slug as ProjectSlug,
      slug: row.slug as ProjectSlug,
      route: row.route || base?.route || `/projects/${row.slug}`,
      title: loc(row.title, locale, base?.title ?? ''),
      category: loc(row.category, locale, base?.category ?? ''),
      shortDescription: loc(row.short_description, locale, base?.shortDescription ?? ''),
      fullDescription: locList(row.full_description, locale, base?.fullDescription ?? []),
      image: row.image || base?.image || '',
      imageAlt: loc(row.image_alt, locale, base?.imageAlt ?? ''),
      imageScale: row.image_scale ?? base?.imageScale,
      contributionValue: loc(row.contribution_value, locale, base?.contributionValue ?? ''),
      unitAmount: row.unit_amount ?? base?.unitAmount ?? 0,
      facts: localizedArray(row.facts, locale, base?.facts ?? []),
      officialContributionUrl:
        row.official_contribution_url || base?.officialContributionUrl || '',
      officialSourceUrl: row.official_source_url || base?.officialSourceUrl || '',
      returnsTitle: loc(row.returns_title, locale, base?.returnsTitle ?? ''),
      returnsIntro: loc(row.returns_intro, locale, base?.returnsIntro ?? ''),
      returnUses: locList(row.return_uses, locale, base?.returnUses ?? []),
      allocations: localizedArray(row.allocations, locale, base?.allocations ?? []),
      video: localizedObject(row.video, locale, base?.video),
      ctaTitle: loc(row.cta_title, locale, base?.ctaTitle ?? ''),
      ctaDescription: loc(row.cta_description, locale, base?.ctaDescription ?? ''),
    } as LocalizedWaqfProject;
  });
}

// PROGRAMS -------------------------------------------------------------------
export function cmsPrograms(locale: Locale, fallback: Program[]): Program[] {
  const rows = cmsRows('programs');
  if (!rows) return fallback;
  const defaults = bySlug(fallback);

  return rows.map((row) => {
    const base = defaults.get(row.slug);
    return {
      id: row.slug,
      slug: row.slug as ProgramSlug,
      route: row.route || base?.route || `/programs/${row.slug}`,
      title: loc(row.title, locale, base?.title ?? ''),
      summary: loc(row.summary, locale, base?.summary ?? ''),
      heroImage: row.hero_image || base?.heroImage || '',
      heroImageAlt: loc(row.hero_image_alt, locale, base?.heroImageAlt ?? ''),
      images: localizedArray(row.images, locale, base?.images ?? []),
      imageGallery: localizedArray(row.image_gallery, locale, base?.imageGallery ?? []),
      sections: localizedArray(row.sections, locale, base?.sections ?? []),
      goals: locList(row.goals, locale, base?.goals ?? []),
      components: locList(row.components, locale, base?.components ?? []),
      statistics: localizedArray(row.statistics, locale, base?.statistics ?? []),
      videos: localizedArray(row.videos, locale, base?.videos ?? []),
      contactEmail: row.contact_email || base?.contactEmail,
      initiatives: localizedArray(row.initiatives, locale, base?.initiatives ?? []),
      cities: localizedArray(row.cities, locale, base?.cities ?? []),
      journey: localizedArray(row.journey, locale, base?.journey ?? []),
      pillars: localizedArray(row.pillars, locale, base?.pillars ?? []),
      highlights: locList(row.highlights, locale, base?.highlights ?? []),
      phase: localizedObject(row.phase, locale, base?.phase),
      audiences: localizedArray(row.audiences, locale, base?.audiences ?? []),
      themes: localizedArray(row.themes, locale, base?.themes ?? []),
      overviewImage: row.overview_image || base?.overviewImage,
      overviewImageAlt: loc(row.overview_image_alt, locale, base?.overviewImageAlt ?? ''),
      officialSourceUrl: row.official_source_url || base?.officialSourceUrl || '',
      // No dashboard columns yet: these stay with the static definition.
      contactPhone: base?.contactPhone,
      volunteer: base?.volunteer,
      mediaProducts: base?.mediaProducts,
      spotlight: base?.spotlight,
      seo: localizedObject(row.seo, locale, base?.seo),
      cta: localizedObject(row.cta, locale, base?.cta),
      mediaNote: loc(row.media_note, locale, base?.mediaNote ?? ''),
    } as Program;
  });
}

// NEWS -----------------------------------------------------------------------
export function cmsNews(
  locale: Locale,
  fallback: LocalizedNewsArticle[],
): LocalizedNewsArticle[] {
  const rows = cmsRows('news');
  if (!rows) return fallback;
  const defaults = bySlug(fallback);

  return rows.map((row) => {
    const base = defaults.get(row.slug);
    return {
      id: row.slug,
      slug: row.slug,
      route: `/news/${row.slug}`,
      sourceSlug: row.source_slug || base?.sourceSlug || row.slug,
      sourceUrl: row.source_url || base?.sourceUrl || '',
      publishedAt: row.published_at || base?.publishedAt || '',
      year: row.year ?? base?.year ?? 0,
      sourceLanguage: (row.source_language || base?.sourceLanguage || 'ar') as 'ar',
      category: loc(row.category, locale, base?.category ?? ''),
      title: loc(row.title, locale, base?.title ?? ''),
      excerpt: loc(row.excerpt, locale, base?.excerpt ?? ''),
      content: locList(row.content, locale, base?.content ?? []),
      image: row.image || base?.image || '',
      imageAlt: loc(row.image_alt, locale, base?.imageAlt ?? ''),
      gallery: localizedArray(row.gallery, locale, base?.gallery ?? []),
      sourceImages: localizedArray(row.source_images, locale, base?.sourceImages ?? []),
    } as LocalizedNewsArticle;
  });
}

// DONATIONS ------------------------------------------------------------------
export function cmsDonations(
  locale: Locale,
  fallback: DonationOpportunity[],
): DonationOpportunity[] {
  const rows = cmsRows('donation_opportunities');
  if (!rows) return fallback;
  const defaults = new Map(fallback.map((item) => [item.id, item]));

  return rows.map((row) => {
    const base = defaults.get(row.slug);
    return {
      id: row.slug,
      title: loc(row.title, locale, base?.title ?? ''),
      description: loc(row.description, locale, base?.description ?? ''),
      price: loc(row.price, locale, base?.price ?? ''),
      image: row.image || base?.image || '',
      imageAlt: loc(row.image_alt, locale, base?.imageAlt ?? ''),
      url: row.url || base?.url || '',
      available: row.available,
    } as DonationOpportunity;
  });
}

// PARTNERS -------------------------------------------------------------------
export function cmsPartners(
  locale: Locale,
  fallback: { name: string; logo: string }[],
): { name: string; logo: string }[] {
  const rows = cmsRows('partners');
  if (!rows) return fallback;
  return rows.map((row, index) => ({
    name: loc(row.name, locale, fallback[index]?.name ?? ''),
    logo: row.logo || fallback[index]?.logo || '',
  }));
}

// STATISTICS -----------------------------------------------------------------
type Indicator = { label: string; value: number | null; suffix?: string; detail?: string };

export function cmsStats<T extends Indicator>(
  group: 'yemen-pioneers' | 'statistics',
  locale: Locale,
  fallback: T[],
): T[] {
  const rows = cmsRows('stat_indicators');
  if (!rows) return fallback;
  const scoped = rows.filter((row) => row.stat_group === group);
  if (!scoped.length) return fallback;

  return scoped.map((row, index) => {
    const base = fallback[index];
    return {
      ...base,
      label: loc(row.label, locale, base?.label ?? ''),
      value: row.value ?? base?.value ?? null,
      suffix: loc(row.suffix, locale, base?.suffix ?? ''),
    } as T;
  });
}

// LIBRARY --------------------------------------------------------------------
export function cmsLibraryArticles(
  collection: 'forum' | 'success-stories',
  locale: Locale,
  fallback: LibraryTextItem[],
): LibraryTextItem[] {
  const rows = cmsRows('library_articles');
  if (!rows) return fallback;
  const scoped = rows.filter((row) => row.collection === collection);
  if (!scoped.length) return fallback;
  const defaults = bySlug(fallback);
  const prefix = collection === 'forum' ? '/library/forum' : '/library/success-stories';

  return scoped.map((row) => {
    const base = defaults.get(row.slug);
    return {
      id: row.slug,
      slug: row.slug,
      route: row.route || base?.route || `${prefix}/${row.slug}`,
      title: loc(row.title, locale, base?.title ?? ''),
      originalTitle: row.original_title || base?.originalTitle || '',
      sourceUrl: row.source_url || base?.sourceUrl || '',
      sourceLanguage: row.source_language || base?.sourceLanguage || 'ar',
      date: row.date || base?.date || '',
      year: row.year ?? base?.year ?? null,
      excerpt: loc(row.excerpt, locale, base?.excerpt ?? ''),
      image: row.image || base?.image || '',
      imageAlt: loc(row.image_alt, locale, base?.imageAlt ?? ''),
      content: locList(row.content, locale, [...(base?.content ?? [])]),
    } as LibraryTextItem;
  });
}

export function cmsLibraryDocuments(
  collection: string,
  locale: Locale,
  fallback: LibraryDocumentItem[],
): LibraryDocumentItem[] {
  const rows = cmsRows('library_documents');
  if (!rows) return fallback;
  const scoped = rows.filter((row) => row.collection === collection);
  if (!scoped.length) return fallback;

  return scoped.map((row, index) => {
    const base = fallback[index];
    return {
      id: row.id,
      title: loc(row.title, locale, base?.title ?? ''),
      sourceUrl: row.source_url || base?.sourceUrl || '',
      pdfUrl: row.pdf_url || base?.pdfUrl || null,
      date: row.date || base?.date || '',
      year: row.year ?? base?.year ?? null,
      excerpt: loc(row.excerpt, locale, base?.excerpt ?? ''),
      image: row.image || base?.image || '',
      imageAlt: loc(row.image_alt, locale, base?.imageAlt ?? ''),
    } as LibraryDocumentItem;
  });
}

export function cmsGallery(
  locale: Locale,
  fallback: LibraryGalleryImage[],
): LibraryGalleryImage[] {
  const rows = cmsRows('gallery_images');
  if (!rows) return fallback;

  return rows.map((row, index) => {
    const base = fallback[index];
    return {
      id: row.id,
      title: loc(row.title, locale, base?.title ?? ''),
      image: row.image || base?.image || '',
      thumbnail: row.thumbnail || row.image || base?.thumbnail || '',
      sourceUrl: row.source_url || base?.sourceUrl || '',
      imageAlt: loc(row.image_alt, locale, base?.imageAlt ?? ''),
      width: row.width ?? base?.width ?? 0,
      height: row.height ?? base?.height ?? 0,
    } as LibraryGalleryImage;
  });
}
