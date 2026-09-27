import { localizedPrograms, type Program, type ProgramSlug } from '@/data/programs';
import { LOCALES, type Locale, type ProgramLayout } from '@/lib/types';

type Values = Record<string, unknown>;

const layoutBySlug: Record<ProgramSlug, ProgramLayout> = {
  'yemen-pioneers': 'pioneers',
  'capacity-building': 'volunteer',
  'institutional-development': 'institutional',
  'community-awareness': 'awareness',
};

const programByLocale = Object.fromEntries(
  LOCALES.map((locale) => [
    locale,
    new Map(localizedPrograms[locale].programs.map((program) => [program.slug, program])),
  ]),
) as Record<Locale, Map<ProgramSlug, Program>>;

function clone<T>(value: T): T {
  return value === undefined ? value : JSON.parse(JSON.stringify(value));
}

function program(locale: Locale, slug: ProgramSlug): Program {
  const value = programByLocale[locale].get(slug);
  if (!value) throw new Error(`Missing static program content for ${slug}/${locale}`);
  return value;
}

function localizedText(slug: ProgramSlug, pick: (value: Program) => string | undefined) {
  return Object.fromEntries(LOCALES.map((locale) => [locale, pick(program(locale, slug)) ?? '']));
}

function localizedList(slug: ProgramSlug, pick: (value: Program) => unknown[] | undefined) {
  return Object.fromEntries(LOCALES.map((locale) => [locale, clone(pick(program(locale, slug)) ?? [])]));
}

function localizedGroup(slug: ProgramSlug, pick: (value: Program) => unknown) {
  const values = Object.fromEntries(LOCALES.map((locale) => [locale, clone(pick(program(locale, slug)) ?? null)]));
  return Object.values(values).some((value) => value !== null) ? values : null;
}

/**
 * The complete database-shaped copy of one program as it currently ships.
 * Media URLs in `src/data/programs.ts` point at `/public/programs`, so these
 * rows are safe to persist and never contain Vite-only `/src/assets/...` URLs.
 */
export function buildStaticProgramRow(slug: ProgramSlug): Values {
  const base = program('ar', slug);
  return {
    slug,
    title: localizedText(slug, (value) => value.title),
    summary: localizedText(slug, (value) => value.summary),
    hero_image: base.heroImage || null,
    hero_image_alt: localizedText(slug, (value) => value.heroImageAlt),
    images: clone(base.images ?? []),
    image_gallery: localizedList(slug, (value) => value.imageGallery),
    sections: localizedList(slug, (value) => value.sections),
    goals: localizedList(slug, (value) => value.goals),
    components: localizedList(slug, (value) => value.components),
    statistics: localizedList(slug, (value) => value.statistics),
    videos: localizedList(slug, (value) => value.videos),
    contact_email: base.contactEmail ?? null,
    contact_phone: base.contactPhone ?? null,
    initiatives: localizedList(slug, (value) => value.initiatives),
    cities: localizedList(slug, (value) => value.cities),
    journey: localizedList(slug, (value) => value.journey),
    pillars: localizedList(slug, (value) => value.pillars),
    highlights: localizedList(slug, (value) => value.highlights),
    phase: localizedGroup(slug, (value) => value.phase),
    audiences: localizedList(slug, (value) => value.audiences),
    themes: localizedList(slug, (value) => value.themes),
    overview_image: base.overviewImage ?? null,
    overview_image_alt: localizedText(slug, (value) => value.overviewImageAlt),
    volunteer: localizedGroup(slug, (value) => value.volunteer),
    media_products: localizedList(slug, (value) => value.mediaProducts),
    spotlight: localizedGroup(slug, (value) => value.spotlight),
    layout: layoutBySlug[slug],
    seo: localizedGroup(slug, (value) => value.seo) ?? {},
    cta: localizedGroup(slug, (value) => value.cta) ?? {},
    media_note: localizedText(slug, (value) => value.mediaNote),
  };
}

export function buildStaticProgramRows(slugs?: readonly ProgramSlug[]): Values[] {
  const selected = slugs ?? (Object.keys(layoutBySlug) as ProgramSlug[]);
  return selected.map(buildStaticProgramRow);
}

function isPlainObject(value: unknown): value is Values {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Fill only values that were never stored; explicit empty strings/lists win. */
function fillUnset(current: unknown, fallback: unknown): unknown {
  if (current === null || current === undefined) return clone(fallback);
  if (Array.isArray(current) || Array.isArray(fallback)) return current;
  if (isPlainObject(current) && isPlainObject(fallback)) {
    if (Object.keys(current).length === 0) return clone(fallback);
    const out: Values = { ...current };
    for (const [key, value] of Object.entries(fallback)) {
      out[key] = fillUnset(current[key], value);
    }
    return out;
  }
  return current;
}

/**
 * Old rows were created before the bespoke layouts existed, so database
 * defaults such as [] and {} mean "not imported yet" there. This variant is
 * used only while layout is null; once migrated, ordinary fillUnset semantics
 * preserve lists an editor intentionally clears.
 */
function fillLegacyUnset(current: unknown, fallback: unknown): unknown {
  if (current === null || current === undefined) return clone(fallback);
  if (Array.isArray(current)) return current.length === 0 ? clone(fallback) : current;
  if (isPlainObject(current) && isPlainObject(fallback)) {
    if (Object.keys(current).length === 0) return clone(fallback);
    const out: Values = { ...current };
    for (const [key, value] of Object.entries(fallback)) {
      out[key] = fillLegacyUnset(current[key], value);
    }
    return out;
  }
  return current;
}

export function isLegacyCapacityRow(row: Values): boolean {
  return row.slug === 'capacity-building' && !row.layout && !row.volunteer;
}

export function isLegacyProgramRow(row: Values): boolean {
  return typeof row.slug === 'string' && row.slug in layoutBySlug && !row.layout;
}

/**
 * Records open with exactly what the public page renders. The one known legacy
 * capacity row predates the volunteer-unit redesign, so its old content is
 * replaced by the current page copy; every other record keeps stored edits and
 * receives defaults only for columns/locales that were never set.
 */
export function programRecordForEditor(row: Values): Values {
  const slug = row.slug as ProgramSlug | undefined;
  if (!slug || !(slug in layoutBySlug)) return row;
  const defaults = buildStaticProgramRow(slug);
  if (isLegacyCapacityRow(row)) return { ...row, ...defaults };
  if (isLegacyProgramRow(row)) return fillLegacyUnset(row, defaults) as Values;
  return fillUnset(row, defaults) as Values;
}

export const PROGRAM_SYNC_SLUGS = [
  'capacity-building',
  'institutional-development',
  'community-awareness',
] as const satisfies readonly ProgramSlug[];
