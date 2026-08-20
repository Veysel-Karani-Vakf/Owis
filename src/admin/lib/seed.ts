/* eslint-disable @typescript-eslint/no-explicit-any */
// Seeds Supabase from the site's existing static content modules.
// Runs client-side (authenticated admin) so Vite-resolved asset URLs are used as-is.
import { supabase } from '@/lib/supabase';
import type { Locale } from '@/lib/types';

import { newsArticles } from '@/data/news';
import { getProjectsContent } from '@/data/projects';
import { getProgramsContent } from '@/data/programs';
import { getDonateContent } from '@/data/donate';
import {
  getForumArticles,
  getSuccessStories,
  getDocuments,
  getGalleryImages,
} from '@/data/library';
import { getAboutContent } from '@/data/about';
import { localizedContent } from '@/i18n/content';

const L3: Locale[] = ['ar', 'tr', 'en'];
type Report = (line: string) => void;

/** Build { ar, tr, en } by picking a string from each locale's array item at index i. */
function loc3<T>(byLoc: Record<Locale, T[]>, i: number, pick: (t: T) => string | undefined) {
  const out: Record<string, string> = {};
  for (const l of L3) out[l] = pick(byLoc[l]?.[i]) ?? '';
  return out;
}

async function clearTable(table: string) {
  // delete everything (id is never all-zero uuid)
  await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000');
}

// --- NEWS -------------------------------------------------------------------
async function seedNews(report: Report) {
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
    gallery: a.gallery ?? [],
    source_images: a.sourceImages ?? [],
    sort_order: i,
    is_published: true,
  }));
  const { error } = await supabase.from('news').upsert(rows, { onConflict: 'slug' });
  if (error) throw new Error('news: ' + error.message);
  report(`✔ news (${rows.length})`);
}

// --- PROJECTS ---------------------------------------------------------------
async function seedProjects(report: Report) {
  const byLoc = {
    ar: getProjectsContent('ar').projects,
    tr: getProjectsContent('tr').projects,
    en: getProjectsContent('en').projects,
  } as Record<Locale, any[]>;

  const rows = byLoc.ar.map((base: any, i: number) => ({
    slug: base.slug,
    route: base.route ?? null,
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
    facts: (base.facts ?? []).map((_: any, fi: number) => ({
      label: { ar: byLoc.ar[i].facts?.[fi]?.label, tr: byLoc.tr[i].facts?.[fi]?.label, en: byLoc.en[i].facts?.[fi]?.label },
      value: { ar: byLoc.ar[i].facts?.[fi]?.value, tr: byLoc.tr[i].facts?.[fi]?.value, en: byLoc.en[i].facts?.[fi]?.value },
    })),
    official_contribution_url: base.officialContributionUrl ?? null,
    official_source_url: base.officialSourceUrl ?? null,
    returns_title: loc3(byLoc, i, (p) => p.returnsTitle),
    returns_intro: loc3(byLoc, i, (p) => p.returnsIntro),
    return_uses: {
      ar: byLoc.ar[i].returnUses ?? [],
      tr: byLoc.tr[i].returnUses ?? [],
      en: byLoc.en[i].returnUses ?? [],
    },
    allocations: (base.allocations ?? []).map((al: any, ai: number) => ({
      percent: al.percent,
      title: { ar: byLoc.ar[i].allocations?.[ai]?.title, tr: byLoc.tr[i].allocations?.[ai]?.title, en: byLoc.en[i].allocations?.[ai]?.title },
      description: { ar: byLoc.ar[i].allocations?.[ai]?.description, tr: byLoc.tr[i].allocations?.[ai]?.description, en: byLoc.en[i].allocations?.[ai]?.description },
    })),
    video: base.video
      ? {
          videoId: base.video.videoId,
          sourceUrl: base.video.sourceUrl,
          title: loc3(byLoc, i, (p) => p.video?.title),
          buttonLabel: loc3(byLoc, i, (p) => p.video?.buttonLabel),
        }
      : null,
    cta_title: loc3(byLoc, i, (p) => p.ctaTitle),
    cta_description: loc3(byLoc, i, (p) => p.ctaDescription),
    sort_order: i,
    is_published: true,
  }));

  const { error } = await supabase.from('projects').upsert(rows, { onConflict: 'slug' });
  if (error) throw new Error('projects: ' + error.message);
  report(`✔ projects (${rows.length})`);
}

// --- PROGRAMS ---------------------------------------------------------------
async function seedPrograms(report: Report) {
  const byLoc = {
    ar: getProgramsContent('ar').programs,
    tr: getProgramsContent('tr').programs,
    en: getProgramsContent('en').programs,
  } as Record<Locale, any[]>;

  const paraLoc = (i: number, key: string) => ({
    ar: byLoc.ar[i][key] ?? [],
    tr: byLoc.tr[i][key] ?? [],
    en: byLoc.en[i][key] ?? [],
  });

  const rows = byLoc.ar.map((base: any, i: number) => ({
    slug: base.slug,
    route: base.route ?? null,
    title: loc3(byLoc, i, (p) => p.title),
    summary: loc3(byLoc, i, (p) => p.summary),
    hero_image: base.heroImage ?? null,
    hero_image_alt: loc3(byLoc, i, (p) => p.heroImageAlt),
    images: base.images ?? [],
    image_gallery: base.imageGallery ?? [],
    sections: base.sections ?? [],
    goals: paraLoc(i, 'goals'),
    components: paraLoc(i, 'components'),
    statistics: base.statistics ?? [],
    videos: base.videos ?? [],
    contact_email: base.contactEmail ?? null,
    initiatives: base.initiatives ?? [],
    cities: base.cities ?? [],
    journey: base.journey ?? [],
    pillars: base.pillars ?? [],
    highlights: paraLoc(i, 'highlights'),
    phase: base.phase ?? null,
    audiences: base.audiences ?? [],
    themes: base.themes ?? [],
    overview_image: base.overviewImage ?? null,
    overview_image_alt: loc3(byLoc, i, (p) => p.overviewImageAlt),
    official_source_url: base.officialSourceUrl ?? null,
    seo: base.seo ?? {},
    cta: base.cta ?? {},
    media_note: loc3(byLoc, i, (p) => p.mediaNote),
    sort_order: i,
    is_published: true,
  }));

  const { error } = await supabase.from('programs').upsert(rows, { onConflict: 'slug' });
  if (error) throw new Error('programs: ' + error.message);
  report(`✔ programs (${rows.length})`);
}

// --- LIBRARY ARTICLES -------------------------------------------------------
async function seedLibraryArticles(report: Report) {
  const build = (
    collection: 'forum' | 'success-stories',
    getter: (l: Locale) => any[],
  ) => {
    const byLoc = { ar: getter('ar'), tr: getter('tr'), en: getter('en') } as Record<Locale, any[]>;
    return byLoc.ar.map((base: any, i: number) => ({
      collection,
      slug: base.slug,
      route: base.route ?? null,
      title: loc3(byLoc, i, (a) => a.title),
      original_title: base.originalTitle ?? null,
      source_url: base.sourceUrl ?? null,
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
    ...build('forum', getForumArticles),
    ...build('success-stories', getSuccessStories),
  ];
  const { error } = await supabase.from('library_articles').upsert(rows, { onConflict: 'collection,slug' });
  if (error) throw new Error('library_articles: ' + error.message);
  report(`✔ library_articles (${rows.length})`);
}

// --- LIBRARY DOCUMENTS ------------------------------------------------------
async function seedLibraryDocuments(report: Report) {
  const map: Array<[string, any]> = [
    ['periodic-reports', 'periodicReports'],
    ['waqf-books', 'waqfBooks'],
    ['waqf-literature', 'waqfLiterature'],
    ['yemeni-figures', 'yemeniFigures'],
  ];
  await clearTable('library_documents');
  const rows: any[] = [];
  for (const [dbSlug, runtimeKey] of map) {
    const items = getDocuments(runtimeKey) as any[];
    items.forEach((d, i) => {
      rows.push({
        collection: dbSlug,
        title: { ar: d.title ?? '' },
        source_url: d.sourceUrl ?? null,
        pdf_url: d.pdfUrl ?? null,
        date: d.date || null,
        year: d.year ?? null,
        excerpt: { ar: d.excerpt ?? '' },
        image: d.image ?? null,
        image_alt: { ar: d.imageAlt ?? '' },
        sort_order: i,
        is_published: true,
      });
    });
  }
  const { error } = await supabase.from('library_documents').insert(rows);
  if (error) throw new Error('library_documents: ' + error.message);
  report(`✔ library_documents (${rows.length})`);
}

// --- GALLERY ----------------------------------------------------------------
async function seedGallery(report: Report) {
  await clearTable('gallery_images');
  const items = getGalleryImages() as any[];
  const rows = items.map((g, i) => ({
    title: { ar: g.title ?? '' },
    image: g.image ?? null,
    thumbnail: g.thumbnail ?? null,
    source_url: g.sourceUrl ?? null,
    image_alt: { ar: g.imageAlt ?? '' },
    width: g.width ?? null,
    height: g.height ?? null,
    sort_order: i,
    is_published: true,
  }));
  const { error } = await supabase.from('gallery_images').insert(rows);
  if (error) throw new Error('gallery_images: ' + error.message);
  report(`✔ gallery_images (${rows.length})`);
}

// --- DONATIONS --------------------------------------------------------------
async function seedDonations(report: Report) {
  const byLoc = {
    ar: getDonateContent('ar').opportunities,
    tr: getDonateContent('tr').opportunities,
    en: getDonateContent('en').opportunities,
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
  const { error } = await supabase.from('donation_opportunities').upsert(rows, { onConflict: 'slug' });
  if (error) throw new Error('donations: ' + error.message);
  report(`✔ donation_opportunities (${rows.length})`);
}

// --- PARTNERS ---------------------------------------------------------------
async function seedPartners(report: Report) {
  await clearTable('partners');
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
  const { error } = await supabase.from('partners').insert(rows);
  if (error) throw new Error('partners: ' + error.message);
  report(`✔ partners (${rows.length})`);
}

// --- STATISTICS -------------------------------------------------------------
async function seedStats(report: Report) {
  await clearTable('stat_indicators');
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
        sort_order: i,
        is_published: true,
      });
    });
  }
  const { error } = await supabase.from('stat_indicators').insert(rows);
  if (error) throw new Error('stat_indicators: ' + error.message);
  report(`✔ stat_indicators (${rows.length})`);
}

// --- SITE PAGES -------------------------------------------------------------
async function seedSitePages(report: Report) {
  const perLocale = <T,>(pick: (c: any) => T) => ({
    ar: pick(localizedContent.ar),
    tr: pick(localizedContent.tr),
    en: pick(localizedContent.en),
  });

  const pages = [
    {
      key: 'home',
      label: { ar: 'الصفحة الرئيسية', tr: 'Ana sayfa', en: 'Home' },
      data: {
        hero: perLocale((c) => c.hero),
        about: perLocale((c) => c.about),
        statistics: perLocale((c) => c.statistics),
        yemenPioneers: perLocale((c) => c.yemenPioneers),
      },
    },
    {
      key: 'settings',
      label: { ar: 'إعدادات الموقع', tr: 'Site ayarları', en: 'Site settings' },
      data: {
        siteConfig: perLocale((c) => c.siteConfig),
        footer: perLocale((c) => c.footer),
      },
    },
    {
      key: 'about-waqf',
      label: { ar: 'عن الوقف', tr: 'Vakıf hakkında', en: 'About the Waqf' },
      data: {
        ar: getAboutContent('ar').waqf,
        tr: getAboutContent('tr').waqf,
        en: getAboutContent('en').waqf,
      },
    },
    {
      key: 'governance',
      label: { ar: 'الحوكمة', tr: 'Yönetişim', en: 'Governance' },
      data: {
        ar: getAboutContent('ar').governance,
        tr: getAboutContent('tr').governance,
        en: getAboutContent('en').governance,
      },
    },
  ];

  const { error } = await supabase.from('site_pages').upsert(pages, { onConflict: 'key' });
  if (error) throw new Error('site_pages: ' + error.message);
  report(`✔ site_pages (${pages.length})`);
}

export async function runSeed(report: Report) {
  const steps: Array<[string, (r: Report) => Promise<void>]> = [
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
      await fn(report);
    } catch (e) {
      report(`✖ ${name}: ${e instanceof Error ? e.message : String(e)}`);
      throw e;
    }
  }
  report('— done —');
}
