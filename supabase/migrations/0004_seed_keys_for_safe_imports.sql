-- =============================================================================
-- Stable import keys so admin seeding can upsert without deleting real data.
-- =============================================================================

alter table public.library_documents
  add column if not exists seed_key text unique;

alter table public.gallery_images
  add column if not exists seed_key text unique;

alter table public.partners
  add column if not exists seed_key text unique;

alter table public.stat_indicators
  add column if not exists seed_key text unique;

notify pgrst, 'reload schema';
