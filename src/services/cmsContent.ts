import type {
  DonationRow,
  GalleryImageRow,
  LibraryArticleRow,
  LibraryDocumentRow,
  Locale,
  Localized,
  LocalizedList,
  NewsRow,
  PartnerRow,
  ProgramRow,
  ProjectRow,
  SitePageRow,
  StatRow,
} from '@/lib/types';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { newsRoutes, type LocalizedNewsArticle } from '@/data/news';
import { contributeContactRoute, type DonationOpportunity } from '@/data/donate';
import type { LocalizedWaqfProject } from '@/data/projects';
import type { Program as ProgramDetail } from '@/data/programs';
import {
  documentCollectionSlugs,
  libraryRoutes,
  type LibraryContent,
  type LibraryCounts,
  type LibraryDocumentCollectionSlug,
  type LibraryDocumentItem,
  type LibraryGalleryImage,
  type LibrarySearchGroup,
  type LibrarySearchHit,
  type LibraryTextCollectionSlug,
  type LibraryTextItem,
} from '@/data/library';
import type { Partner, Program, Project, SiteContent } from '@/i18n/content';

type SupabaseQuery = {
  eq: (column: string, value: unknown) => SupabaseQuery;
  in: (column: string, values: unknown[]) => SupabaseQuery;
  order: (column: string, options?: { ascending?: boolean }) => SupabaseQuery;
  then: PromiseLike<{ data: unknown[] | null; error: { message: string } | null }>['then'];
};

const fallbackLocaleOrder: Locale[] = ['ar', 'en', 'tr'];

function hasLocaleKeys(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  return fallbackLocaleOrder.some((locale) => locale in value);
}

function firstNonEmptyString(values: unknown[]) {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) return value;
  }
  return '';
}

export function localizedText(value: Localized | null | undefined, locale: Locale, fallback = '') {
  if (!value || typeof value !== 'object') return fallback;
  return firstNonEmptyString([value[locale], value.ar, value.en, value.tr, fallback]);
}

export function localizedList(value: LocalizedList | unknown, locale: Locale, fallback: string[] = []) {
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === 'string');
  if (!value || typeof value !== 'object') return fallback;
  const byLocale = value as Partial<Record<Locale, unknown>>;
  const picked = byLocale[locale] ?? byLocale.ar ?? byLocale.en ?? byLocale.tr;
  return Array.isArray(picked) ? picked.filter((item): item is string => typeof item === 'string') : fallback;
}

export function localizedJson<T>(value: unknown, locale: Locale, fallback: T): T {
  if (hasLocaleKeys(value)) {
    const byLocale = value as Partial<Record<Locale, unknown>>;
    const picked = byLocale[locale] ?? byLocale.ar ?? byLocale.en ?? byLocale.tr;
    return picked === undefined || picked === null ? fallback : (picked as T);
  }
  return value === undefined || value === null ? fallback : (value as T);
}

function asArray<T = unknown>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function warnCms(table: string, error: { message: string } | null) {
  if (import.meta.env.DEV && error) {
    console.warn(`[cms] ${table}: ${error.message}`);
  }
}

async function fetchRows<T>(
  table: string,
  configure?: (query: SupabaseQuery) => SupabaseQuery
): Promise<T[] | null> {
  if (!isSupabaseConfigured) return null;

  try {
    const baseQuery = supabase.from(table).select('*') as unknown as SupabaseQuery;
    const query = configure ? configure(baseQuery) : baseQuery;
    const { data, error } = await query;
    if (error) {
      warnCms(table, error);
      return null;
    }
    return (data ?? []) as T[];
  } catch (error) {
    warnCms(table, { message: error instanceof Error ? error.message : String(error) });
    return null;
  }
}

function published(query: SupabaseQuery) {
  return query.eq('is_published', true);
}

function localizedNestedText(value: unknown, locale: Locale) {
  return localizedText(value as Localized, locale);
}

function mapNewsGallery(gallery: unknown[], locale: Locale) {
  return gallery.map((image, index) => {
    const item = (image ?? {}) as Record<string, unknown>;
    const src = typeof item.image === 'string' ? item.image : '';
    const thumbnail = typeof item.thumbnail === 'string' ? item.thumbnail : src;
    const title = localizedNestedText(item.title, locale);
    const imageAlt = localizedNestedText(item.imageAlt ?? item.image_alt, locale) || title;

    return {
      id: typeof item.id === 'string' ? item.id : `${src}-${index}`,
      image: src,
      thumbnail,
      sourceUrl: typeof item.sourceUrl === 'string' ? item.sourceUrl : typeof item.source_url === 'string' ? item.source_url : '',
      title,
      imageAlt,
      width: typeof item.width === 'number' ? item.width : 1200,
      height: typeof item.height === 'number' ? item.height : 800,
    };
  });
}

export function mapNewsRow(row: NewsRow, locale: Locale): LocalizedNewsArticle {
  const publishedAt = row.published_at ?? '';
  const title = localizedText(row.title, locale);

  return {
    id: row.id,
    slug: row.slug,
    route: newsRoutes.detail(row.slug),
    sourceSlug: row.source_slug ?? row.slug,
    sourceUrl: row.source_url ?? '',
    publishedAt,
    year: row.year ?? (publishedAt ? new Date(publishedAt).getFullYear() : 0),
    sourceLanguage: 'ar',
    category: localizedText(row.category, locale),
    title,
    excerpt: localizedText(row.excerpt, locale),
    content: localizedList(row.content, locale),
    image: row.image ?? '',
    imageAlt: localizedText(row.image_alt, locale, title),
    gallery: mapNewsGallery(asArray(row.gallery), locale),
    sourceImages: asArray<string>(row.source_images),
  };
}

export async function loadNewsArticles(locale: Locale) {
  const rows = await fetchRows<NewsRow>('news', (query) =>
    published(query).order('published_at', { ascending: false }).order('sort_order', { ascending: true })
  );
  return rows?.map((row) => mapNewsRow(row, locale)) ?? null;
}

export function getRelatedNewsFromList(articles: LocalizedNewsArticle[], slug: string, limit = 3) {
  const article = articles.find((item) => item.slug === slug);
  const others = articles.filter((item) => item.slug !== slug);
  if (!article) return others.slice(0, limit);

  const sameCategory = others.filter((item) => item.category === article.category);
  const byDateDistance = others
    .filter((item) => item.category !== article.category)
    .sort(
      (a, b) =>
        Math.abs(new Date(a.publishedAt).getTime() - new Date(article.publishedAt).getTime()) -
        Math.abs(new Date(b.publishedAt).getTime() - new Date(article.publishedAt).getTime())
    );

  return [...sameCategory, ...byDateDistance].slice(0, limit);
}

function mapFacts(items: unknown[], locale: Locale) {
  return items.map((item) => {
    const fact = (item ?? {}) as Record<string, unknown>;
    return {
      label: localizedNestedText(fact.label, locale),
      value: localizedNestedText(fact.value, locale),
    };
  });
}

function mapAllocations(items: unknown[], locale: Locale) {
  return items.map((item) => {
    const allocation = (item ?? {}) as Record<string, unknown>;
    return {
      percent: typeof allocation.percent === 'string' ? allocation.percent : '',
      title: localizedNestedText(allocation.title, locale),
      description: localizedNestedText(allocation.description, locale),
    };
  });
}

function mapProjectVideo(video: unknown, locale: Locale) {
  if (!video || typeof video !== 'object') return undefined;
  const item = video as Record<string, unknown>;
  const videoId = typeof item.videoId === 'string' ? item.videoId : typeof item.video_id === 'string' ? item.video_id : '';
  if (!videoId) return undefined;

  return {
    title: localizedNestedText(item.title, locale),
    buttonLabel: localizedNestedText(item.buttonLabel ?? item.button_label, locale),
    videoId,
    sourceUrl: typeof item.sourceUrl === 'string' ? item.sourceUrl : typeof item.source_url === 'string' ? item.source_url : '',
  };
}

export function mapProjectRow(row: ProjectRow, locale: Locale): LocalizedWaqfProject {
  const slug = row.slug as LocalizedWaqfProject['slug'];
  const title = localizedText(row.title, locale);
  const route = row.route ?? `/projects/${row.slug}`;

  return {
    id: slug,
    slug,
    route,
    title,
    category: localizedText(row.category, locale),
    shortDescription: localizedText(row.short_description, locale),
    fullDescription: localizedList(row.full_description, locale),
    image: row.image ?? '',
    imageAlt: localizedText(row.image_alt, locale, title),
    imageScale: row.image_scale ?? undefined,
    contributionValue: localizedText(row.contribution_value, locale),
    unitAmount: row.unit_amount ?? 0,
    facts: mapFacts(asArray(row.facts), locale),
    officialContributionUrl: row.official_contribution_url ?? '/donate',
    returnsTitle: localizedText(row.returns_title, locale),
    returnsIntro: localizedText(row.returns_intro, locale) || undefined,
    returnUses: localizedList(row.return_uses, locale),
    allocations: mapAllocations(asArray(row.allocations), locale),
    video: mapProjectVideo(row.video, locale),
    ctaTitle: localizedText(row.cta_title, locale),
    ctaDescription: localizedText(row.cta_description, locale),
  };
}

export function mapProjectRowToHome(row: ProjectRow, locale: Locale): Project {
  const slug = row.slug === 'gold-wallet' ? 'gold-portfolio' : row.slug;
  return {
    id: slug,
    name: localizedText(row.title, locale),
    description: localizedText(row.short_description, locale),
    contribution: localizedText(row.contribution_value, locale),
    image: row.image ?? '',
    detailsUrl: row.route ?? `/projects/${row.slug}`,
    contributionUrl: row.official_contribution_url ?? undefined,
  };
}

export async function loadProjectRows() {
  return fetchRows<ProjectRow>('projects', (query) => published(query).order('sort_order', { ascending: true }));
}

export function mapProgramRow(row: ProgramRow, locale: Locale): ProgramDetail {
  const title = localizedText(row.title, locale);
  const summary = localizedText(row.summary, locale);
  const route = row.route ?? `/programs/${row.slug}`;
  const seo = localizedJson<ProgramDetail['seo']>(row.seo, locale, {
    title,
    description: summary,
    canonical: route,
  });
  const cta = localizedJson<ProgramDetail['cta']>(row.cta, locale, {
    title,
    description: summary,
    button: '',
  });

  return {
    id: row.slug,
    slug: row.slug as ProgramDetail['slug'],
    route,
    title,
    summary,
    heroImage: row.hero_image ?? '',
    heroImageAlt: localizedText(row.hero_image_alt, locale, title),
    images: localizedJson<string[]>(row.images, locale, asArray<string>(row.images)),
    imageGallery: localizedJson<ProgramDetail['imageGallery']>(row.image_gallery, locale, []),
    sections: localizedJson<ProgramDetail['sections']>(row.sections, locale, []),
    goals: localizedList(row.goals, locale),
    components: localizedList(row.components, locale),
    statistics: localizedJson<ProgramDetail['statistics']>(row.statistics, locale, []),
    videos: localizedJson<ProgramDetail['videos']>(row.videos, locale, []),
    contactEmail: row.contact_email ?? undefined,
    initiatives: localizedJson<ProgramDetail['initiatives']>(row.initiatives, locale, []),
    cities: localizedJson<ProgramDetail['cities']>(row.cities, locale, []),
    journey: localizedJson<ProgramDetail['journey']>(row.journey, locale, []),
    pillars: localizedJson<ProgramDetail['pillars']>(row.pillars, locale, []),
    highlights: localizedList(row.highlights, locale),
    phase: localizedJson<ProgramDetail['phase']>(row.phase, locale, undefined),
    audiences: localizedJson<ProgramDetail['audiences']>(row.audiences, locale, []),
    themes: localizedJson<ProgramDetail['themes']>(row.themes, locale, []),
    overviewImage: row.overview_image ?? undefined,
    overviewImageAlt: localizedText(row.overview_image_alt, locale) || undefined,
    seo,
    cta,
    mediaNote: localizedText(row.media_note, locale) || undefined,
  };
}

export function mapProgramRowToHome(row: ProgramRow, locale: Locale): Program {
  return {
    id: row.slug === 'yemen-pioneers' ? 'future-leaders' : row.slug,
    title: localizedText(row.title, locale),
    description: localizedText(row.summary, locale),
    image: row.hero_image ?? '',
    url: row.route ?? `/programs/${row.slug}`,
  };
}

export async function loadProgramRows() {
  return fetchRows<ProgramRow>('programs', (query) => published(query).order('sort_order', { ascending: true }));
}

export function mapDonationRow(row: DonationRow, locale: Locale): DonationOpportunity {
  return {
    id: row.slug,
    title: localizedText(row.title, locale),
    description: localizedText(row.description, locale),
    price: localizedText(row.price, locale),
    image: row.image ?? '',
    imageAlt: localizedText(row.image_alt, locale),
    url: row.url ?? contributeContactRoute,
    available: row.available,
  };
}

export async function loadDonationOpportunities(locale: Locale) {
  const rows = await fetchRows<DonationRow>('donation_opportunities', (query) =>
    published(query).order('sort_order', { ascending: true })
  );
  return rows?.map((row) => mapDonationRow(row, locale)) ?? null;
}

export function mapPartnerRow(row: PartnerRow, locale: Locale): Partner {
  return {
    name: localizedText(row.name, locale),
    logo: row.logo ?? '',
  };
}

export async function loadPartners(locale: Locale) {
  const rows = await fetchRows<PartnerRow>('partners', (query) => published(query).order('sort_order', { ascending: true }));
  return rows?.map((row) => mapPartnerRow(row, locale)) ?? null;
}

export function mapStatRow(row: StatRow, locale: Locale) {
  return {
    label: localizedText(row.label, locale),
    value: row.value,
    suffix: localizedText(row.suffix, locale),
    detail: localizedText(row.detail, locale),
  };
}

export async function loadStatIndicators(locale: Locale, group: StatRow['stat_group']) {
  const rows = await fetchRows<StatRow>('stat_indicators', (query) =>
    published(query).eq('stat_group', group).order('sort_order', { ascending: true })
  );
  return rows?.map((row) => mapStatRow(row, locale)) ?? null;
}

export function mapLibraryArticleRow(row: LibraryArticleRow, locale: Locale): LibraryTextItem {
  const title = localizedText(row.title, locale);
  return {
    id: row.id,
    slug: row.slug,
    route: row.route ?? `${row.collection === 'forum' ? libraryRoutes.forum : libraryRoutes.successStories}/${row.slug}`,
    title,
    originalTitle: row.original_title ?? title,
    sourceUrl: row.source_url ?? '',
    sourceLanguage: row.source_language ?? 'ar',
    date: row.date ?? '',
    year: row.year,
    excerpt: localizedText(row.excerpt, locale),
    image: row.image ?? '',
    imageAlt: localizedText(row.image_alt, locale, title),
    content: localizedList(row.content, locale, localizedList(row.content, (row.source_language as Locale) || 'ar')),
    pdfUrl: row.pdf_url ?? null,
  };
}

export async function loadLibraryTextItems(locale: Locale, collection: LibraryTextCollectionSlug) {
  const rows = await fetchRows<LibraryArticleRow>('library_articles', (query) =>
    published(query).eq('collection', collection).order('sort_order', { ascending: true })
  );
  return rows?.map((row) => mapLibraryArticleRow(row, locale)) ?? null;
}

export function mapLibraryDocumentRow(row: LibraryDocumentRow, locale: Locale): LibraryDocumentItem {
  const title = localizedText(row.title, locale);
  return {
    id: row.id,
    title,
    sourceUrl: row.source_url ?? '',
    pdfUrl: row.pdf_url,
    date: row.date ?? '',
    year: row.year,
    excerpt: localizedText(row.excerpt, locale),
    image: row.image ?? '',
    imageAlt: localizedText(row.image_alt, locale, title),
  };
}

export async function loadLibraryDocuments(locale: Locale, collection: LibraryDocumentCollectionSlug) {
  const rows = await fetchRows<LibraryDocumentRow>('library_documents', (query) =>
    published(query).eq('collection', collection).order('sort_order', { ascending: true })
  );
  return rows?.map((row) => mapLibraryDocumentRow(row, locale)) ?? null;
}

export function mapGalleryImageRow(row: GalleryImageRow, locale: Locale): LibraryGalleryImage {
  const title = localizedText(row.title, locale);
  const image = row.image ?? '';
  return {
    id: row.id,
    title,
    image,
    thumbnail: row.thumbnail ?? image,
    sourceUrl: row.source_url ?? '',
    imageAlt: localizedText(row.image_alt, locale, title),
    width: row.width ?? 1200,
    height: row.height ?? 800,
  };
}

export async function loadGalleryImages(locale: Locale) {
  const rows = await fetchRows<GalleryImageRow>('gallery_images', (query) =>
    published(query).order('sort_order', { ascending: true })
  );
  return rows?.map((row) => mapGalleryImageRow(row, locale)) ?? null;
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u064b-\u0652\u0640]/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي')
    .replace(/[\u0300-\u036f]/g, '');
}

function matches(haystack: string, needle: string) {
  if (!needle) return true;
  const normalizedHaystack = normalize(haystack);
  return needle
    .split(/\s+/)
    .filter(Boolean)
    .every((token) => normalizedHaystack.includes(token));
}

function textHit(item: LibraryTextItem, kind: 'article' | 'story' | 'figure', collection: LibraryTextCollectionSlug): LibrarySearchHit {
  return {
    id: item.id,
    kind,
    collection,
    title: item.title,
    subtitle: item.excerpt,
    image: item.image,
    href: item.route,
    external: false,
    hasPdf: false,
    date: item.date,
  };
}

function documentHit(item: LibraryDocumentItem, collection: LibraryDocumentCollectionSlug): LibrarySearchHit {
  return {
    id: item.id,
    kind: 'document',
    collection,
    title: item.title,
    subtitle: item.excerpt,
    image: item.image,
    href: item.pdfUrl ?? item.sourceUrl,
    external: true,
    hasPdf: Boolean(item.pdfUrl),
    date: item.date,
  };
}

export type LibraryRuntimeData = {
  forum: LibraryTextItem[];
  stories: LibraryTextItem[];
  figures: LibraryTextItem[];
  documents: Record<LibraryDocumentCollectionSlug, LibraryDocumentItem[]>;
  gallery: LibraryGalleryImage[];
};

export function buildLibraryCounts(data: LibraryRuntimeData): LibraryCounts {
  return {
    forum: data.forum.length,
    'periodic-reports': data.documents['periodic-reports'].length,
    'waqf-books': data.documents['waqf-books'].length,
    'waqf-literature': data.documents['waqf-literature'].length,
    'yemeni-figures': data.figures.length,
    'success-stories': data.stories.length,
    gallery: data.gallery.length,
  };
}

export function getLatestLibraryItemsFromData(data: LibraryRuntimeData, limit = 6): LibrarySearchHit[] {
  const hits: LibrarySearchHit[] = [
    ...data.forum.map((item) => textHit(item, 'article', 'forum')),
    ...data.stories.map((item) => textHit(item, 'story', 'success-stories')),
    ...data.figures.map((item) => textHit(item, 'figure', 'yemeni-figures')),
  ];

  for (const slug of documentCollectionSlugs) {
    hits.push(...data.documents[slug].filter((item) => item.date).map((item) => documentHit(item, slug)));
  }

  return hits
    .filter((hit) => hit.date)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit);
}

export function searchLibraryData(page: LibraryContent, data: LibraryRuntimeData, query: string, perGroup = 4): LibrarySearchGroup[] {
  const needle = normalize(query.trim());
  if (!needle) return [];

  const groups: LibrarySearchGroup[] = [];
  const pushGroup = (collection: LibrarySearchGroup['collection'], hits: LibrarySearchHit[]) => {
    if (!hits.length) return;
    const info = page.collections[collection];
    groups.push({ collection, title: info.shortTitle, route: info.route, total: hits.length, hits: hits.slice(0, perGroup) });
  };

  pushGroup(
    'forum',
    data.forum
      .filter((item) => matches(`${item.title} ${item.originalTitle} ${item.excerpt} ${item.year ?? ''}`, needle))
      .map((item) => textHit(item, 'article', 'forum'))
  );

  for (const slug of documentCollectionSlugs) {
    pushGroup(
      slug,
      data.documents[slug]
        .filter((item) => matches(`${item.title} ${item.excerpt} ${item.year ?? ''}`, needle))
        .map((item) => documentHit(item, slug))
    );
  }

  pushGroup(
    'yemeni-figures',
    data.figures
      .filter((item) => matches(`${item.title} ${item.originalTitle} ${item.excerpt} ${item.year ?? ''}`, needle))
      .map((item) => textHit(item, 'figure', 'yemeni-figures'))
  );

  pushGroup(
    'success-stories',
    data.stories
      .filter((item) => matches(`${item.title} ${item.originalTitle} ${item.excerpt}`, needle))
      .map((item) => textHit(item, 'story', 'success-stories'))
  );

  pushGroup(
    'gallery',
    data.gallery
      .filter((item) => matches(`${item.title} ${item.imageAlt}`, needle))
      .map((item) => ({
        id: item.id,
        kind: 'image' as const,
        collection: 'gallery' as const,
        title: item.title,
        subtitle: '',
        image: item.thumbnail,
        href: libraryRoutes.gallery,
        external: false,
        hasPdf: false,
        date: '',
      }))
  );

  return groups;
}

export function getRelatedLibraryTextItems(items: LibraryTextItem[], slug: string, limit = 4) {
  return items.filter((item) => item.slug !== slug).slice(0, limit);
}

export function getAdjacentLibraryTextItems(items: LibraryTextItem[], slug: string) {
  const index = items.findIndex((item) => item.slug === slug);
  if (index === -1) return { previous: undefined, next: undefined };
  return {
    next: index > 0 ? items[index - 1] : undefined,
    previous: index < items.length - 1 ? items[index + 1] : undefined,
  };
}

const partOrder: Record<string, number> = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
};

export function getArticleSeriesFromItems(items: LibraryTextItem[], slug: string, locale: Locale) {
  const match = slug.match(/^(.*)-part-([a-z]+)$/);
  if (!match) return null;
  const key = match[1];
  const parts = items
    .map((item) => {
      const itemMatch = item.slug.match(/^(.*)-part-([a-z]+)$/);
      if (!itemMatch || itemMatch[1] !== key) return null;
      return { slug: item.slug, title: item.title, route: item.route, order: partOrder[itemMatch[2]] ?? 99 };
    })
    .filter((part): part is NonNullable<typeof part> => part !== null)
    .sort((a, b) => a.order - b.order);

  if (parts.length < 2) return null;
  const seriesTitle: Record<Locale, string> = {
    ar: parts[0].title.replace(/\s*الجزء.*$/, ''),
    en: parts[0].title.replace(/,?\s*Part.*$/i, ''),
    tr: parts[0].title.replace(/,?\s*(Birinci|İkinci|Üçüncü|Dördüncü).*$/i, ''),
  };

  return {
    key,
    title: seriesTitle[locale] || parts[0].title,
    parts,
    currentIndex: parts.findIndex((part) => part.slug === slug),
  };
}

function deepMerge<T>(fallback: T, override: unknown): T {
  if (!override || typeof override !== 'object' || Array.isArray(override)) {
    return fallback;
  }

  const out: Record<string, unknown> = { ...(fallback as Record<string, unknown>) };
  for (const [key, value] of Object.entries(override)) {
    const current = out[key];
    if (
      current &&
      typeof current === 'object' &&
      !Array.isArray(current) &&
      value &&
      typeof value === 'object' &&
      !Array.isArray(value)
    ) {
      out[key] = deepMerge(current, value);
    } else if (value !== undefined && value !== null) {
      out[key] = value;
    }
  }

  return out as T;
}

export function mergeSitePages(fallback: SiteContent, rows: SitePageRow[] | null, locale: Locale): SiteContent {
  if (!rows) return fallback;

  const home = rows.find((row) => row.key === 'home')?.data ?? {};
  const settings = rows.find((row) => row.key === 'settings')?.data ?? {};

  return {
    ...fallback,
    siteConfig: deepMerge(fallback.siteConfig, localizedJson(settings.siteConfig, locale, fallback.siteConfig)),
    hero: deepMerge(fallback.hero, localizedJson(home.hero, locale, fallback.hero)),
    about: deepMerge(fallback.about, localizedJson(home.about, locale, fallback.about)),
    statistics: deepMerge(fallback.statistics, localizedJson(home.statistics, locale, fallback.statistics)),
    yemenPioneers: deepMerge(fallback.yemenPioneers, localizedJson(home.yemenPioneers, locale, fallback.yemenPioneers)),
    footer: deepMerge(fallback.footer, localizedJson(settings.footer, locale, fallback.footer)),
  };
}

export async function loadSitePages() {
  return fetchRows<SitePageRow>('site_pages', (query) => query.in('key', ['home', 'settings']));
}

export const emptyLibraryRuntimeData = (): LibraryRuntimeData => ({
  forum: [],
  stories: [],
  figures: [],
  documents: {
    'periodic-reports': [],
    'waqf-books': [],
    'waqf-literature': [],
  },
  gallery: [],
});
