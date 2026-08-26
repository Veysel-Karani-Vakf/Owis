-- =============================================================================
-- Admin coverage: columns for content that was visible on the site but had no
-- dashboard field. Purely additive and re-runnable; run after 0003.
-- =============================================================================

-- PROGRAMS: the parts of the bespoke program layouts that were static-only.
alter table public.programs
  add column if not exists contact_phone text,
  -- Volunteer unit copy block (eyebrow, CTAs, slogan, hashtags, section headings),
  -- stored per language: { ar: {...}, tr: {...}, en: {...} }
  add column if not exists volunteer jsonb,
  -- Community awareness: media formats (podcast, visuals, ...), per language
  -- arrays. NULL (not '[]') until an editor fills it: a stored list is shown
  -- as stored, and an empty one would hide the built-in cards.
  add column if not exists media_products jsonb,
  -- Community awareness: featured event block (eyebrow, title, text, photos, link).
  add column if not exists spotlight jsonb,
  -- Which page layout renders this program. NULL keeps today's slug-based choice.
  add column if not exists layout text;

-- Databases that ran an earlier draft of this file got '[]' as the default.
alter table public.programs
  alter column media_products drop not null,
  alter column media_products set default null;
update public.programs set media_products = null where media_products = '[]'::jsonb;

alter table public.programs
  drop constraint if exists programs_layout_check;
alter table public.programs
  add constraint programs_layout_check
  check (layout is null or layout in ('generic','pioneers','volunteer','institutional','awareness'));

-- PROJECTS: per-project search-engine title/description (per language).
alter table public.projects
  add column if not exists seo jsonb not null default '{}'::jsonb;

-- STATISTICS: the flip-card back text and a chosen icon, so the home page has a
-- single source of truth for its indicators.
alter table public.stat_indicators
  add column if not exists detail jsonb not null default '{}'::jsonb,
  add column if not exists icon text;

-- LIBRARY DOCUMENTS: explicit series name (e.g. "Owais in numbers") instead of
-- guessing it from the title.
alter table public.library_documents
  add column if not exists series jsonb not null default '{}'::jsonb;

-- NEWS: allow any source language code (the dashboard offers ar/tr/en).
alter table public.news
  alter column source_language set default 'ar';
