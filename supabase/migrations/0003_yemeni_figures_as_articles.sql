-- =============================================================================
-- "Yemeni figures" moves from the PDF document collections to the readable
-- article collections (same shape as forum / success-stories), and articles
-- gain an optional attached PDF. Run after 0002_storage_and_admin.sql.
-- =============================================================================

-- 1. Articles may carry an attached PDF (e.g. a scanned book).
alter table public.library_articles
  add column if not exists pdf_url text;

-- 2. Allow the new collection on library_articles.
alter table public.library_articles
  drop constraint if exists library_articles_collection_check;
alter table public.library_articles
  add constraint library_articles_collection_check
  check (collection in ('forum','success-stories','yemeni-figures'));

-- 3. Move any existing yemeni-figures documents over as articles.
insert into public.library_articles (
  collection, slug, route, title, original_title, source_url, pdf_url,
  source_language, date, year, excerpt, image, image_alt, content,
  sort_order, is_published
)
select
  'yemeni-figures',
  'yemeni-figure-' || substr(replace(d.id::text, '-', ''), 1, 12),
  null,
  d.title,
  coalesce(d.title->>'ar', ''),
  d.source_url,
  d.pdf_url,
  'ar',
  d.date,
  d.year,
  d.excerpt,
  d.image,
  d.image_alt,
  jsonb_build_object('ar', case when coalesce(d.excerpt->>'ar', '') <> '' then jsonb_build_array(d.excerpt->>'ar') else '[]'::jsonb end),
  d.sort_order,
  d.is_published
from public.library_documents d
where d.collection = 'yemeni-figures'
on conflict (collection, slug) do nothing;

delete from public.library_documents where collection = 'yemeni-figures';

-- 4. Documents no longer accept the yemeni-figures collection.
alter table public.library_documents
  drop constraint if exists library_documents_collection_check;
alter table public.library_documents
  add constraint library_documents_collection_check
  check (collection in ('periodic-reports','waqf-books','waqf-literature'));
