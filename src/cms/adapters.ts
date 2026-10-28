// Maps CMS rows onto the shapes the site's components already consume.
//
// Two rules apply everywhere here:
//  * A column that is `null`/`undefined` was never set, so the matching static
//    record (found by slug) fills it in. A column the editor stored — even as
//    '' or an emptied list — is shown as stored, so the dashboard and the site
//    never disagree.
//  * Rows are matched to static defaults by slug only. Nothing is paired by
//    array position, because editors reorder and delete rows.

import type { Locale, NewsRow, ProgramLayout } from '@/lib/types';
import type { LocalizedWaqfProject, ProjectSlug } from '@/data/projects';
import type { Program, ProgramSlug } from '@/data/programs';
import type { LocalizedNewsArticle } from '@/data/news';
import type { DonationOpportunity } from '@/data/donate';
import type {
  LibraryDocumentItem,
  LibraryGalleryImage,
  LibraryTextCollectionSlug,
  LibraryTextItem,
} from '@/data/library';
import type { Pioneer, Cohort } from '@/data/pioneers';

import { cmsPage, cmsRows } from './store';
import { deepMerge, locList, locText, scalar } from './merge';
import { deepLocalize, localizedArray, localizedObject, pageForLocale } from './localize';

/** Site-page content merged over the static default for `locale`. */
export function cmsPageContent<T>(key: string, locale: Locale, fallback: T): T {
  const page = cmsPage(key);
  if (!page) return fallback;
  const own = pageForLocale(page, locale);
  if (own === null || own === undefined) return fallback;
  return deepMerge(fallback, own);
}

function bySlug<T extends { slug?: string; id?: string }>(items: T[]): Map<string, T> {
  return new Map(items.map((item) => [item.slug ?? item.id ?? '', item]));
}

/** Programs the site renders with a bespoke layout when the record does not say. */
function defaultProgramLayout(slug: string, hasVolunteerCopy: boolean): ProgramLayout {
  if (slug === 'yemen-pioneers') return 'pioneers';
  if (slug === 'community-awareness') return 'awareness';
  if (slug === 'institutional-development') return 'institutional';
  if (hasVolunteerCopy) return 'volunteer';
  return 'generic';
}

// PROJECTS -------------------------------------------------------------------
export function cmsProjects(
  locale: Locale,
  fallback: LocalizedWaqfProject[],
): LocalizedWaqfProject[] {
  const rows = cmsRows('projects');
  if (!rows) return [];
  const defaults = bySlug(fallback);

  return rows.map((row) => {
    const base = defaults.get(row.slug);
    const video = localizedObject<LocalizedWaqfProject['video']>(row.video, locale, base?.video);
    const rawImage =
      typeof row.image === 'string' && !row.image.startsWith('/src/assets/') ? row.image : null;
    return {
      // Slugs are open-ended once editors can add projects; the literal union
      // only describes the three that ship statically.
      id: row.slug as ProjectSlug,
      slug: row.slug as ProjectSlug,
      // The address always follows the slug, so renaming one in the dashboard
      // moves the page and every card that links to it together.
      route: `/projects/${row.slug}`,
      title: locText(row.title, locale, base?.title ?? ''),
      category: locText(row.category, locale, base?.category ?? ''),
      shortDescription: locText(row.short_description, locale, base?.shortDescription ?? ''),
      fullDescription: locList(row.full_description, locale, base?.fullDescription ?? []),
      image: scalar(rawImage, base?.image ?? ''),
      imageAlt: locText(row.image_alt, locale, base?.imageAlt ?? ''),
      imageScale: row.image_scale ?? base?.imageScale,
      contributionValue: locText(row.contribution_value, locale, base?.contributionValue ?? ''),
      unitAmount: row.unit_amount ?? base?.unitAmount ?? 0,
      facts: localizedArray(row.facts, locale, base?.facts ?? []),
      officialContributionUrl: scalar(row.official_contribution_url, base?.officialContributionUrl ?? ''),
      returnsTitle: locText(row.returns_title, locale, base?.returnsTitle ?? ''),
      returnsIntro: locText(row.returns_intro, locale, base?.returnsIntro ?? ''),
      returnUses: locList(row.return_uses, locale, base?.returnUses ?? []),
      allocations: localizedArray(row.allocations, locale, base?.allocations ?? []),
      // A video block with nothing to play is "no video", not the static one.
      video: video && (video.videoId || video.videoFile) ? video : undefined,
      ctaTitle: locText(row.cta_title, locale, base?.ctaTitle ?? ''),
      ctaDescription: locText(row.cta_description, locale, base?.ctaDescription ?? ''),
      seo: localizedObject<LocalizedWaqfProject['seo']>(row.seo, locale, base?.seo),
    } as LocalizedWaqfProject;
  });
}

// PROGRAMS -------------------------------------------------------------------
export function cmsPrograms(locale: Locale, fallback: Program[]): Program[] {
  const rows = cmsRows('programs');
  if (!rows) return [];
  const defaults = bySlug(fallback);

  return rows.map((row) => {
    const base = defaults.get(row.slug);
    // Production carried the pre-redesign capacity-building row after this
    // route became the volunteer unit. Until an editor saves/materializes the
    // new row, never mix those institutional sections into the volunteer page.
    if (row.slug === 'capacity-building' && !row.layout && !row.volunteer && base) {
      return { ...base, layout: 'volunteer' } as Program;
    }
    const volunteer = localizedObject<Program['volunteer']>(row.volunteer, locale, base?.volunteer);
    return {
      id: row.slug,
      slug: row.slug as ProgramSlug,
      route: `/programs/${row.slug}`,
      title: locText(row.title, locale, base?.title ?? ''),
      summary: locText(row.summary, locale, base?.summary ?? ''),
      heroImage: scalar(row.hero_image, base?.heroImage ?? ''),
      heroImageAlt: locText(row.hero_image_alt, locale, base?.heroImageAlt ?? ''),
      images: localizedArray(row.images, locale, base?.images ?? []),
      imageGallery: localizedArray(row.image_gallery, locale, base?.imageGallery ?? []),
      sections: localizedArray(row.sections, locale, base?.sections ?? []),
      goals: locList(row.goals, locale, base?.goals ?? []),
      components: locList(row.components, locale, base?.components ?? []),
      statistics: localizedArray(row.statistics, locale, base?.statistics ?? []),
      videos: localizedArray(row.videos, locale, base?.videos ?? []),
      contactEmail: scalar(row.contact_email, base?.contactEmail),
      contactPhone: scalar(row.contact_phone, base?.contactPhone),
      initiatives: localizedArray(row.initiatives, locale, base?.initiatives ?? []),
      cities: localizedArray(row.cities, locale, base?.cities ?? []),
      journey: localizedArray(row.journey, locale, base?.journey ?? []),
      pillars: localizedArray(row.pillars, locale, base?.pillars ?? []),
      highlights: locList(row.highlights, locale, base?.highlights ?? []),
      phase: localizedObject(row.phase, locale, base?.phase),
      audiences: localizedArray(row.audiences, locale, base?.audiences ?? []),
      themes: localizedArray(row.themes, locale, base?.themes ?? []),
      overviewImage: scalar(row.overview_image, base?.overviewImage),
      overviewImageAlt: locText(row.overview_image_alt, locale, base?.overviewImageAlt ?? ''),
      volunteer,
      mediaProducts: localizedArray(row.media_products, locale, base?.mediaProducts ?? []),
      spotlight: localizedObject(row.spotlight, locale, base?.spotlight),
      layout: row.layout ?? base?.layout ?? defaultProgramLayout(row.slug, Boolean(volunteer)),
      seo: localizedObject(row.seo, locale, base?.seo),
      cta: localizedObject(row.cta, locale, base?.cta),
      mediaNote: locText(row.media_note, locale, base?.mediaNote ?? ''),
    } as Program;
  });
}

// NEWS -----------------------------------------------------------------------
type GalleryItem = LocalizedNewsArticle['gallery'][number];

export function cmsNewsRow(
  row: NewsRow,
  locale: Locale,
  base?: LocalizedNewsArticle,
): LocalizedNewsArticle {
  const publishedAt = scalar(row.published_at, base?.publishedAt ?? '');
  const publishedYear = publishedAt ? new Date(publishedAt).getFullYear() : NaN;
  const gallery = localizedArray<GalleryItem>(row.gallery, locale, base?.gallery ?? []).map(
    (image, index) => ({
      ...image,
      // Rows created in the dashboard carry no id; keys still have to be stable.
      id: image.id || `${row.slug}-${index + 1}`,
      thumbnail: image.thumbnail || image.image,
    }),
  );
  return {
    id: row.slug,
    slug: row.slug,
    route: `/news/${row.slug}`,
    sourceSlug: scalar(row.source_slug, base?.sourceSlug ?? row.slug),
    sourceUrl: scalar(row.source_url, base?.sourceUrl ?? ''),
    publishedAt,
    // The year filter follows the publish date; a separate typed year only
    // ever drifted from it.
    year: Number.isFinite(publishedYear) ? publishedYear : (row.year ?? base?.year ?? 0),
    sourceLanguage: scalar(row.source_language, base?.sourceLanguage) || 'ar',
    featured: Boolean(row.featured),
    category: locText(row.category, locale, base?.category ?? ''),
    title: locText(row.title, locale, base?.title ?? ''),
    excerpt: locText(row.excerpt, locale, base?.excerpt ?? ''),
    content: locList(row.content, locale, base?.content ?? []),
    image: scalar(row.image, base?.image ?? ''),
    imageAlt: locText(row.image_alt, locale, base?.imageAlt ?? ''),
    gallery,
    sourceImages: localizedArray(row.source_images, locale, base?.sourceImages ?? []),
  } as LocalizedNewsArticle;
}

export function cmsNews(
  locale: Locale,
  fallback: LocalizedNewsArticle[],
): LocalizedNewsArticle[] {
  const rows = cmsRows('news');
  if (!rows) return [];
  const defaults = bySlug(fallback);

  return rows.map((row) => cmsNewsRow(row, locale, defaults.get(row.slug)));
}

// DONATIONS ------------------------------------------------------------------
export function cmsDonations(
  locale: Locale,
  fallback: DonationOpportunity[],
): DonationOpportunity[] {
  const rows = cmsRows('donation_opportunities');
  if (!rows) return [];
  const defaults = new Map(fallback.map((item) => [item.id, item]));

  return rows.map((row) => {
    const base = defaults.get(row.slug);
    return {
      id: row.slug,
      title: locText(row.title, locale, base?.title ?? ''),
      description: locText(row.description, locale, base?.description ?? ''),
      price: locText(row.price, locale, base?.price ?? ''),
      image: scalar(row.image, base?.image ?? ''),
      imageAlt: locText(row.image_alt, locale, base?.imageAlt ?? ''),
      url: scalar(row.url, base?.url ?? ''),
      available: row.available,
    } as DonationOpportunity;
  });
}

// PARTNERS -------------------------------------------------------------------
export type PartnerItem = { name: string; logo: string; url?: string };

export function cmsPartners(locale: Locale, _fallback: PartnerItem[]): PartnerItem[] {
  const rows = cmsRows('partners');
  if (!rows) return [];
  return rows.map((row) => ({
    name: locText(row.name, locale, ''),
    logo: row.logo ?? '',
    url: row.url ?? undefined,
  }));
}

// BANK ACCOUNTS --------------------------------------------------------------
type BankLike = {
  id: string;
  name: string;
  monogram: string;
  logo: string;
  brandColor: string;
  branch: string;
  swift?: string;
  accountNumber?: string;
  accounts: { currency: string; iban: string; accountNumber?: string }[];
};

export function cmsBankAccounts<T extends BankLike = BankLike>(): T[] {
  const rows = cmsRows('bank_accounts');
  if (!rows) return [];

  return rows.map((row) => {
    const accounts = Array.isArray(row.accounts) ? row.accounts : [];
    return {
      id: row.slug,
      name: row.name ?? '',
      monogram: row.monogram ?? '',
      logo: row.logo ?? '',
      brandColor: row.brand_color ?? '',
      branch: row.branch ?? '',
      swift: row.swift || undefined,
      accountNumber: row.account_number || undefined,
      accounts: accounts
        .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === 'object')
        .map((item) => ({
          currency: typeof item.currency === 'string' ? item.currency : 'TRY',
          iban: typeof item.iban === 'string' ? item.iban.replace(/\s+/g, '') : '',
          accountNumber: typeof item.accountNumber === 'string' && item.accountNumber ? item.accountNumber : undefined,
        }))
        .filter((item) => item.iban),
    } as T;
  });
}

// STATISTICS -----------------------------------------------------------------
type Indicator = {
  label: string;
  value: number | null;
  suffix?: string;
  detail?: string;
  icon?: string;
};

export function cmsStats<T extends Indicator>(
  group: 'yemen-pioneers' | 'statistics',
  locale: Locale,
  _fallback: T[],
): T[] {
  const rows = cmsRows('stat_indicators');
  if (!rows) return [];
  const scoped = rows.filter((row) => row.stat_group === group);

  // Rows have no slug to pair with a static indicator, and pairing by position
  // would move sentences and icons onto the wrong card the moment an editor
  // reorders the list. A row without an icon falls back to the component's own
  // position-based default (resolveIcon).
  return scoped.map(
    (row) =>
      ({
        label: locText(row.label, locale, ''),
        value: row.value,
        suffix: locText(row.suffix, locale, ''),
        detail: locText(row.detail, locale, ''),
        icon: row.icon || undefined,
      }) as T,
  );
}

// LIBRARY --------------------------------------------------------------------
// Kept local (instead of importing from @/data/library) to avoid a value-level import cycle.
const textRoutePrefix: Record<LibraryTextCollectionSlug, string> = {
  forum: '/library/forum',
  'success-stories': '/library/success-stories',
  'yemeni-figures': '/library/yemeni-figures',
};

export function cmsLibraryArticles(
  collection: LibraryTextCollectionSlug,
  locale: Locale,
  fallback: LibraryTextItem[],
): LibraryTextItem[] {
  const rows = cmsRows('library_articles');
  if (!rows) return [];
  const scoped = rows.filter((row) => row.collection === collection);
  const defaults = bySlug(fallback);
  const prefix = textRoutePrefix[collection];

  return scoped.map((row) => {
    const base = defaults.get(row.slug);
    return {
      id: row.slug,
      slug: row.slug,
      route: `${prefix}/${row.slug}`,
      title: locText(row.title, locale, base?.title ?? ''),
      originalTitle: scalar(row.original_title, base?.originalTitle ?? ''),
      sourceUrl: scalar(row.source_url, base?.sourceUrl ?? ''),
      sourceLanguage: scalar(row.source_language, base?.sourceLanguage) || 'ar',
      date: scalar(row.date, base?.date ?? ''),
      year: row.year ?? base?.year ?? null,
      excerpt: locText(row.excerpt, locale, base?.excerpt ?? ''),
      image: scalar(row.image, base?.image ?? ''),
      imageAlt: locText(row.image_alt, locale, base?.imageAlt ?? ''),
      content: locList(row.content, locale, [...(base?.content ?? [])]),
      pdfUrl: scalar(row.pdf_url, base?.pdfUrl ?? null) || null,
    } as LibraryTextItem;
  });
}

export function cmsLibraryDocuments(
  collection: string,
  locale: Locale,
  _fallback: LibraryDocumentItem[],
): LibraryDocumentItem[] {
  const rows = cmsRows('library_documents');
  if (!rows) return [];
  const scoped = rows.filter((row) => row.collection === collection);

  // Documents carry no slug, so there is no static record to borrow from; the
  // seed copies every field into the row, and rows are shown as stored.
  return scoped.map((row) => ({
    id: row.id,
    title: locText(row.title, locale, ''),
    sourceUrl: row.source_url ?? '',
    pdfUrl: row.pdf_url || null,
    date: row.date ?? '',
    year: row.year ?? null,
    excerpt: locText(row.excerpt, locale, ''),
    image: row.image ?? '',
    imageAlt: locText(row.image_alt, locale, ''),
    series: locText(row.series, locale, ''),
  }));
}

export function cmsGallery(
  locale: Locale,
  _fallback: LibraryGalleryImage[],
): LibraryGalleryImage[] {
  const rows = cmsRows('gallery_images');
  if (!rows) return [];

  return rows.map((row) => ({
    id: row.id,
    title: locText(row.title, locale, ''),
    image: row.image ?? '',
    thumbnail: row.thumbnail || row.image || '',
    sourceUrl: row.source_url ?? '',
    imageAlt: locText(row.image_alt, locale, ''),
    width: row.width ?? 0,
    height: row.height ?? 0,
  }));
}

export function cmsPioneers(
  locale: Locale,
  fallback: Pioneer[],
  cohorts: Cohort[],
): Pioneer[] {
  const rows = cmsRows('pioneers');
  // Only the CMS can authorize a pioneer for public display, including while
  // loading or offline. Static profiles only fill fields of published rows.
  if (!rows) return [];
  const defaults = bySlug(fallback);
  const cohortNameMap = new Map(cohorts.map((c) => [c.id, c.title]));

  const fromCms = rows
    .filter((row) => row.is_published)
    .map((row) => {
      const base = defaults.get(row.slug);
      const name = locText(row.name, locale, base?.name ?? '');
      const shortName = locText(row.short_name, locale, base?.shortName ?? name);
      const role = locText(row.role, locale, base?.role ?? '');
      const origin = locText(row.origin, locale, base?.origin ?? '');
      const city = locText(row.city, locale, base?.city ?? '');
      const university = locText(row.university, locale, base?.university ?? '');
      const degree = locText(row.degree, locale, base?.degree ?? '');
      const major = locText(row.major, locale, base?.major ?? '');
      const shortIntro = locText(row.short_intro, locale, base?.shortIntro ?? '');
      const fullBio = locList(row.full_bio, locale, base?.fullBio ?? (shortIntro ? [shortIntro] : []));
      const education = locList(row.education, locale, base?.education ?? []);
      const career = locList(row.career, locale, base?.career ?? []);
      const achievements = locList(row.achievements, locale, base?.achievements ?? []);
      const programContribution = locList(row.program_contribution, locale, base?.programContribution ?? []);

      const rowImage = typeof row.image === 'string' ? row.image.trim() : '';
      const isPlaceholder = !rowImage || rowImage.includes('yemen-pioneers-hero');
      const baseImage = base?.image && !base.image.includes('yemen-pioneers-hero') ? base.image : '';
      const realPortrait = !isPlaceholder ? rowImage : baseImage;
      const hasPortrait = Boolean(realPortrait);

      return {
        id: `pioneer-${row.slug}`,
        slug: row.slug,
        cohortId: row.cohort_id || base?.cohortId || 'cohort-1',
        cohortName: cohortNameMap.get(row.cohort_id) || base?.cohortName || row.cohort_id,
        name,
        shortName,
        displayName: base?.displayName,
        role,
        image: realPortrait || '/programs/yemen-pioneers-hero.jpeg',
        hasPortrait,
        imagePosition: scalar(row.image_position, base?.imagePosition ?? 'center 20%'),
        origin,
        city,
        university,
        degree,
        major,
        shortIntro: shortIntro || (fullBio[0] ?? ''),
        fullBio: fullBio.length ? fullBio : shortIntro ? [shortIntro] : [],
        education,
        career,
        achievements,
        programContribution,
        order: row.sort_order ?? base?.order ?? 0,
        isPublished: row.is_published,
      };
    });

  return fromCms;
}

// ORGANIZATIONAL STRUCTURE --------------------------------------------------
export function cmsStructure(
  locale: Locale,
  fallback: import('@/data/about').AdministrativeStructurePageContent,
): import('@/data/about').AdministrativeStructurePageContent {
  const page = cmsPageContent('administrative-structure', locale, fallback);
  const rawPage = cmsPage('administrative-structure');
  const rawData = rawPage?.data as Record<string, any> | undefined;
  const isPagePublished =
    (page as any)?.is_published ??
    (page as any)?.published ??
    rawData?.is_published ??
    rawData?.published ??
    (rawData?.[locale] as any)?.is_published ??
    (rawData?.[locale] as any)?.published ??
    true;

  const sectionRows = cmsRows('org_sections');
  const peopleRows = cmsRows('org_people');
  const membershipRows = cmsRows('org_memberships');

  if (!sectionRows || !membershipRows || !peopleRows) {
    return {
      ...page,
      published: isPagePublished !== false,
      sections: [],
      members: [],
    };
  }

  const peopleMap = new Map(peopleRows.map((p) => [p.id, p]));
  const peopleBySlug = new Map(peopleRows.map((p) => [p.slug, p]));

  const sections: import('@/data/about').OrganizationalSection[] = sectionRows
    .map((secRow) => {
      const secMemberships = membershipRows
        .filter((m) => m.section_id === secRow.id)
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

      const members: import('@/data/about').AdministrativeMember[] = secMemberships.map((m) => {
        const person = peopleMap.get(m.person_id) ?? peopleBySlug.get(m.person_id);
        const name = locText(person?.name, locale, '');
        const shortName = locText(person?.short_name, locale, '');
        const position = locText(m.role_title, locale, '');
        const shortBio = locText(person?.short_bio, locale, '');
        const fullBio = locText(person?.full_bio, locale, '');

        return {
          id: m.id,
          name,
          shortName: shortName || undefined,
          position,
          level: (m.level >= 1 && m.level <= 3 ? m.level : 3) as 1 | 2 | 3,
          order: m.sort_order ?? 0,
          image: person?.image || undefined,
          imagePosition: person?.image_position || undefined,
          shortDescription: shortBio,
          biography: fullBio,
          published: m.is_published,
        };
      });

      return {
        id: secRow.id,
        slug: secRow.slug,
        title: locText(secRow.title, locale, ''),
        description: locText(secRow.description, locale, ''),
        layoutType: (secRow.layout_type === 'chart' ? 'chart' : 'cards') as 'chart' | 'cards',
        order: secRow.sort_order ?? 0,
        published: secRow.is_published,
        members,
      };
    })
    .sort((a, b) => a.order - b.order);

  const adminSection = sections.find((s) => s.slug === 'administrative-body') ?? sections[0];
  const members = adminSection?.members ?? [];

  return {
    ...page,
    published: isPagePublished !== false,
    sections,
    members,
  };
}

/** Re-exported for callers that localize ad-hoc jsonb (e.g. the preview). */
export { deepLocalize };
