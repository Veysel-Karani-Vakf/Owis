/* eslint-disable @typescript-eslint/no-explicit-any */
// Copies the site's built-in content (src/data, src/i18n) into Supabase.
//
// Two modes:
//  * 'fill'  — adds only what is missing. Existing rows and edited pages are
//              never touched. Safe to run any time; this is the default.
//  * 'reset' — replaces everything with the built-in copy. Destroys edits;
//              the dashboard asks for a typed confirmation before running it.
//
// Runs client-side (authenticated admin) so Vite-resolved asset URLs are used as-is.
import { supabase } from '@/lib/supabase';
import type { Locale } from '@/lib/types';

import { newsArticles } from '@/data/news';
import { staticProjectsContent } from '@/data/projects';
import { localizedPrograms } from '@/data/programs';
import { localizedDonateContent } from '@/data/donate';
import {
  staticForumArticles,
  staticSuccessStories,
  staticYemeniFigures,
  staticDocuments,
  staticGalleryImages,
} from '@/data/library';
import { LOCALES } from '@/lib/types';
import { buildAllPageRows } from './pageDefaults';
import { localizedContent } from '@/i18n/content';

export type SeedMode = 'fill' | 'reset';

const L3: Locale[] = ['ar', 'tr', 'en'];
type Report = (line: string) => void;

/** Build { ar, tr, en } from the same array field of each locale's variant. */
function locArrays(byLoc: Record<Locale, any[]>, i: number, key: string) {
  const out: Record<string, unknown[]> = {};
  for (const l of L3) out[l] = byLoc[l]?.[i]?.[key] ?? [];
  return out;
}

/** Build { ar, tr, en } from the same object field of each locale's variant; null when absent. */
function locObjects(byLoc: Record<Locale, any[]>, i: number, key: string) {
  if (!byLoc.ar?.[i]?.[key]) return null;
  const out: Record<string, unknown> = {};
  for (const l of L3) out[l] = byLoc[l]?.[i]?.[key] ?? null;
  return out;
}

/** Build { ar, tr, en } by picking a string from each locale's array item at index i. */
function loc3<T>(byLoc: Record<Locale, T[]>, i: number, pick: (t: T) => string | undefined) {
  const out: Record<string, string> = {};
  for (const l of L3) out[l] = pick(byLoc[l]?.[i]) ?? '';
  return out;
}

/**
 * One shared list whose text leaves are translation maps — the shape the
 * dashboard's plain repeaters write ([{ label: { ar, tr, en }, value: {…} }]).
 * `textKeys` are localized; every other key is copied from the first language.
 */
function sharedList(byLoc: Record<Locale, any[]>, i: number, key: string, textKeys: string[]) {
  const first: any[] = byLoc.ar?.[i]?.[key] ?? [];
  return first.map((item: any, j: number) => {
    const out: Record<string, unknown> = { ...item };
    for (const textKey of textKeys) {
      out[textKey] = Object.fromEntries(L3.map((l) => [l, byLoc[l]?.[i]?.[key]?.[j]?.[textKey] ?? '']));
    }
    return out;
  });
}

/** One shared object whose text leaves are translation maps. */
function sharedObject(byLoc: Record<Locale, any[]>, i: number, key: string, textKeys: string[]) {
  const first = byLoc.ar?.[i]?.[key];
  if (!first) return null;
  const out: Record<string, unknown> = { ...first };
  for (const textKey of textKeys) {
    out[textKey] = Object.fromEntries(L3.map((l) => [l, byLoc[l]?.[i]?.[key]?.[textKey] ?? '']));
  }
  return out;
}

/**
 * This repo is the official site now: links to the retired domain must never
 * reach the database, where they would look like something to keep.
 */
function stripOldDomain(url: string | null | undefined): string | null {
  if (!url) return null;
  return /veysvakfi\.org/i.test(url) ? null : url;
}

async function clearTable(table: string) {
  // delete everything (id is never all-zero uuid)
  const { error } = await supabase
    .from(table)
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');
  if (error) throw new Error(`${table}: ${error.message}`);
}

async function countRows(table: string): Promise<number> {
  const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
  if (error) throw new Error(`${table}: ${error.message}`);
  return count ?? 0;
}

/**
 * Writes rows that have a natural key (slug). In 'fill' mode existing rows are
 * left exactly as they are; in 'reset' mode every column is overwritten.
 */
async function upsertKeyed(table: string, rows: any[], onConflict: string, mode: SeedMode, report: Report) {
  const { error } = await supabase
    .from(table)
    .upsert(rows, { onConflict, ignoreDuplicates: mode === 'fill' });
  if (error) throw new Error(`${table}: ${error.message}`);
  report(`✔ ${table} (${rows.length})`);
}

/**
 * Writes rows that have no natural key (partners, stats, documents, gallery).
 * 'fill' only populates an empty table; 'reset' replaces the whole table.
 */
async function insertKeyless(table: string, rows: any[], mode: SeedMode, report: Report) {
  if (mode === 'reset') {
    await clearTable(table);
  } else if ((await countRows(table)) > 0) {
    report(`• ${table}: kept existing rows`);
    return;
  }
  const { error } = await supabase.from(table).insert(rows);
  if (error) throw new Error(`${table}: ${error.message}`);
  report(`✔ ${table} (${rows.length})`);
}

// --- NEWS -------------------------------------------------------------------
async function seedNews(report: Report, mode: SeedMode) {
  const rows = (newsArticles as unknown as any[]).map((a, i) => ({
    slug: a.slug,
    source_slug: a.sourceSlug ?? null,
    source_url: a.sourceUrl ?? null,
    published_at: a.publishedAt ?? null,
    year: a.year ?? null,
    source_language: a.sourceLanguage ?? 'ar',
    featured: i === 0,
    category: a.category ?? {},
    title: a.title ?? {},
    excerpt: a.excerpt ?? {},
    content: a.content ?? {},
    image: a.image ?? null,
    image_alt: a.imageAlt ?? {},
    // One shared list; only the texts carry a language.
    gallery: (a.gallery ?? []).map((g: any) => ({
      id: g.id,
      image: g.image,
      thumbnail: g.thumbnail,
      sourceUrl: g.sourceUrl,
      width: g.width,
      height: g.height,
      title: g.title ?? {},
      imageAlt: g.imageAlt ?? {},
    })),
    source_images: a.sourceImages ?? [],
    sort_order: i,
    is_published: true,
  }));
  await upsertKeyed('news', rows, 'slug', mode, report);
}

// --- PROJECTS ---------------------------------------------------------------
async function seedProjects(report: Report, mode: SeedMode) {
  const byLoc = {
    ar: staticProjectsContent('ar').projects,
    tr: staticProjectsContent('tr').projects,
    en: staticProjectsContent('en').projects,
  } as Record<Locale, any[]>;

  const rows = byLoc.ar.map((base: any, i: number) => ({
    slug: base.slug,
    route: null,
    title: loc3(byLoc, i, (p) => p.title),
    category: loc3(byLoc, i, (p) => p.category),
    short_description: loc3(byLoc, i, (p) => p.shortDescription),
    full_description: {
      ar: byLoc.ar[i].fullDescription ?? [],
      tr: byLoc.tr[i].fullDescription ?? [],
      en: byLoc.en[i].fullDescription ?? [],
    },
    image: base.image ?? null,
    image_alt: loc3(byLoc, i, (p) => p.imageAlt),
    image_scale: base.imageScale ?? null,
    contribution_value: loc3(byLoc, i, (p) => p.contributionValue),
    unit_amount: base.unitAmount ?? null,
    facts: sharedList(byLoc, i, 'facts', ['label', 'value']),
    official_contribution_url: base.officialContributionUrl ?? null,
    official_source_url: base.officialSourceUrl ?? null,
    returns_title: loc3(byLoc, i, (p) => p.returnsTitle),
    returns_intro: loc3(byLoc, i, (p) => p.returnsIntro),
    return_uses: {
      ar: byLoc.ar[i].returnUses ?? [],
      tr: byLoc.tr[i].returnUses ?? [],
      en: byLoc.en[i].returnUses ?? [],
    },
    allocations: sharedList(byLoc, i, 'allocations', ['title', 'description']),
    video: sharedObject(byLoc, i, 'video', ['title', 'buttonLabel']),
    cta_title: loc3(byLoc, i, (p) => p.ctaTitle),
    cta_description: loc3(byLoc, i, (p) => p.ctaDescription),
    seo: locObjects(byLoc, i, 'seo') ?? {},
    sort_order: i,
    is_published: true,
  }));

  await upsertKeyed('projects', rows, 'slug', mode, report);
}

// --- PROGRAMS ---------------------------------------------------------------
async function seedPrograms(report: Report, mode: SeedMode) {
  const byLoc = {
    ar: localizedPrograms.ar.programs,
    tr: localizedPrograms.tr.programs,
    en: localizedPrograms.en.programs,
  } as Record<Locale, any[]>;

  const paraLoc = (i: number, key: string) => ({
    ar: byLoc.ar[i][key] ?? [],
    tr: byLoc.tr[i][key] ?? [],
    en: byLoc.en[i][key] ?? [],
  });

  const rows = byLoc.ar.map((base: any, i: number) => ({
    slug: base.slug,
    route: null,
    title: loc3(byLoc, i, (p) => p.title),
    summary: loc3(byLoc, i, (p) => p.summary),
    hero_image: base.heroImage ?? null,
    hero_image_alt: loc3(byLoc, i, (p) => p.heroImageAlt),
    images: base.images ?? [],
    image_gallery: locArrays(byLoc, i, 'imageGallery'),
    sections: locArrays(byLoc, i, 'sections'),
    goals: paraLoc(i, 'goals'),
    components: paraLoc(i, 'components'),
    statistics: locArrays(byLoc, i, 'statistics'),
    videos: locArrays(byLoc, i, 'videos'),
    contact_email: base.contactEmail ?? null,
    contact_phone: base.contactPhone ?? null,
    initiatives: locArrays(byLoc, i, 'initiatives'),
    cities: locArrays(byLoc, i, 'cities'),
    journey: locArrays(byLoc, i, 'journey'),
    pillars: locArrays(byLoc, i, 'pillars'),
    highlights: paraLoc(i, 'highlights'),
    phase: locObjects(byLoc, i, 'phase'),
    audiences: locArrays(byLoc, i, 'audiences'),
    themes: locArrays(byLoc, i, 'themes'),
    overview_image: base.overviewImage ?? null,
    overview_image_alt: loc3(byLoc, i, (p) => p.overviewImageAlt),
    official_source_url: base.officialSourceUrl ?? null,
    volunteer: locObjects(byLoc, i, 'volunteer'),
    media_products: locArrays(byLoc, i, 'mediaProducts'),
    spotlight: locObjects(byLoc, i, 'spotlight'),
    layout: base.layout ?? null,
    seo: locObjects(byLoc, i, 'seo') ?? {},
    cta: locObjects(byLoc, i, 'cta') ?? {},
    media_note: loc3(byLoc, i, (p) => p.mediaNote),
    sort_order: i,
    is_published: true,
  }));

  await upsertKeyed('programs', rows, 'slug', mode, report);
}

// --- LIBRARY ARTICLES -------------------------------------------------------
async function seedLibraryArticles(report: Report, mode: SeedMode) {
  const build = (
    collection: 'forum' | 'success-stories' | 'yemeni-figures',
    getter: (l: Locale) => any[],
  ) => {
    const byLoc = { ar: getter('ar'), tr: getter('tr'), en: getter('en') } as Record<Locale, any[]>;
    return byLoc.ar.map((base: any, i: number) => ({
      collection,
      slug: base.slug,
      route: null,
      title: loc3(byLoc, i, (a) => a.title),
      original_title: base.originalTitle ?? null,
      source_url: stripOldDomain(base.sourceUrl),
      pdf_url: base.pdfUrl ?? null,
      source_language: base.sourceLanguage ?? 'ar',
      date: base.date || null,
      year: base.year ?? null,
      excerpt: loc3(byLoc, i, (a) => a.excerpt),
      image: base.image ?? null,
      image_alt: loc3(byLoc, i, (a) => a.imageAlt),
      content: { [base.sourceLanguage ?? 'ar']: [...(base.content ?? [])] },
      sort_order: i,
      is_published: true,
    }));
  };

  const rows = [
    ...build('forum', staticForumArticles),
    ...build('success-stories', staticSuccessStories),
    ...build('yemeni-figures', staticYemeniFigures),
  ];
  await upsertKeyed('library_articles', rows, 'collection,slug', mode, report);
}

// --- LIBRARY DOCUMENTS ------------------------------------------------------
async function seedLibraryDocuments(report: Report, mode: SeedMode) {
  const map: Array<[string, any]> = [
    ['periodic-reports', 'periodicReports'],
    ['waqf-books', 'waqfBooks'],
    ['waqf-literature', 'waqfLiterature'],
  ];
  const rows: any[] = [];
  for (const [dbSlug, runtimeKey] of map) {
    const items = staticDocuments(runtimeKey) as any[];
    items.forEach((d, i) => {
      rows.push({
        collection: dbSlug,
        title: { ar: d.title ?? '' },
        source_url: stripOldDomain(d.sourceUrl),
        pdf_url: d.pdfUrl ?? null,
        date: d.date || null,
        year: d.year ?? null,
        excerpt: { ar: d.excerpt ?? '' },
        image: d.image ?? null,
        image_alt: { ar: d.imageAlt ?? '' },
        series: {},
        sort_order: i,
        is_published: true,
      });
    });
  }
  await insertKeyless('library_documents', rows, mode, report);
}

// --- GALLERY ----------------------------------------------------------------
async function seedGallery(report: Report, mode: SeedMode) {
  const items = staticGalleryImages() as any[];
  const rows = items.map((g, i) => ({
    title: { ar: g.title ?? '' },
    image: g.image ?? null,
    thumbnail: g.thumbnail ?? null,
    source_url: stripOldDomain(g.sourceUrl),
    image_alt: { ar: g.imageAlt ?? '' },
    width: g.width ?? null,
    height: g.height ?? null,
    sort_order: i,
    is_published: true,
  }));
  await insertKeyless('gallery_images', rows, mode, report);
}

// --- DONATIONS --------------------------------------------------------------
async function seedDonations(report: Report, mode: SeedMode) {
  const byLoc = {
    ar: localizedDonateContent.ar.opportunities,
    tr: localizedDonateContent.tr.opportunities,
    en: localizedDonateContent.en.opportunities,
  } as Record<Locale, any[]>;
  const rows = byLoc.ar.map((base: any, i: number) => ({
    slug: base.id,
    title: loc3(byLoc, i, (o) => o.title),
    description: loc3(byLoc, i, (o) => o.description),
    price: loc3(byLoc, i, (o) => o.price),
    image: base.image ?? null,
    image_alt: loc3(byLoc, i, (o) => o.imageAlt),
    url: base.url ?? null,
    available: base.available ?? true,
    sort_order: i,
    is_published: true,
  }));
  await upsertKeyed('donation_opportunities', rows, 'slug', mode, report);
}

// --- PARTNERS ---------------------------------------------------------------
async function seedPartners(report: Report, mode: SeedMode) {
  const byLoc = {
    ar: (localizedContent.ar as any).partners.items as any[],
    tr: (localizedContent.tr as any).partners.items as any[],
    en: (localizedContent.en as any).partners.items as any[],
  } as Record<Locale, any[]>;
  const rows = byLoc.ar.map((base: any, i: number) => ({
    name: loc3(byLoc, i, (p) => p.name),
    logo: base.logo ?? null,
    url: base.url ?? null,
    sort_order: i,
    is_published: true,
  }));
  await insertKeyless('partners', rows, mode, report);
}

// --- STATISTICS -------------------------------------------------------------
async function seedStats(report: Report, mode: SeedMode) {
  const groups: Array<['yemen-pioneers' | 'statistics', string]> = [
    ['yemen-pioneers', 'yemenPioneers'],
    ['statistics', 'statistics'],
  ];
  const rows: any[] = [];
  for (const [group, key] of groups) {
    const byLoc = {
      ar: (localizedContent.ar as any)[key].indicators as any[],
      tr: (localizedContent.tr as any)[key].indicators as any[],
      en: (localizedContent.en as any)[key].indicators as any[],
    } as Record<Locale, any[]>;
    byLoc.ar.forEach((base: any, i: number) => {
      rows.push({
        stat_group: group,
        label: loc3(byLoc, i, (s) => s.label),
        value: base.value ?? null,
        suffix: loc3(byLoc, i, (s) => s.suffix ?? ''),
        detail: loc3(byLoc, i, (s) => s.detail ?? ''),
        icon: base.icon ?? null,
        sort_order: i,
        is_published: true,
      });
    });
  }
  await insertKeyless('stat_indicators', rows, mode, report);
}

// --- SITE PAGES -------------------------------------------------------------
// Every page in the dashboard schema, written locale-first so the editor and
// the site's accessors read the same shape.
async function seedSitePages(report: Report, mode: SeedMode) {
  let pages = buildAllPageRows(LOCALES);
  if (mode === 'fill') {
    const { data, error } = await supabase.from('site_pages').select('key');
    if (error) throw new Error('site_pages: ' + error.message);
    const existing = new Set((data ?? []).map((row) => (row as { key: string }).key));
    const skipped = pages.filter((page) => existing.has(page.key)).length;
    pages = pages.filter((page) => !existing.has(page.key));
    if (skipped) report(`• site_pages: kept ${skipped} edited page(s)`);
    if (pages.length === 0) return;
  }
  const { error } = await supabase.from('site_pages').upsert(pages, { onConflict: 'key' });
  if (error) throw new Error('site_pages: ' + error.message);
  report(`✔ site_pages (${pages.length})`);
}

/** Tables the seed writes, with their current row counts — for the confirmation dialog. */
export async function seedTargets(): Promise<{ table: string; rows: number }[]> {
  const tables = [
    'news',
    'projects',
    'programs',
    'library_articles',
    'library_documents',
    'gallery_images',
    'donation_opportunities',
    'partners',
    'stat_indicators',
    'site_pages',
  ];
  return Promise.all(tables.map(async (table) => ({ table, rows: await countRows(table).catch(() => 0) })));
}

export async function runSeed(report: Report, mode: SeedMode = 'fill') {
  const steps: Array<[string, (r: Report, m: SeedMode) => Promise<void>]> = [
    ['news', seedNews],
    ['projects', seedProjects],
    ['programs', seedPrograms],
    ['library_articles', seedLibraryArticles],
    ['library_documents', seedLibraryDocuments],
    ['gallery', seedGallery],
    ['donations', seedDonations],
    ['partners', seedPartners],
    ['statistics', seedStats],
    ['site_pages', seedSitePages],
  ];
  for (const [name, fn] of steps) {
    try {
      await fn(report, mode);
    } catch (e) {
      report(`✖ ${name}: ${e instanceof Error ? e.message : String(e)}`);
      throw e;
    }
  }
  report('— done —');
}
