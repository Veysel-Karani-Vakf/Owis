-- =============================================================================
-- Veysel Karani Waqf — CMS schema
-- Localized text is stored as jsonb: { "ar": "...", "tr": "...", "en": "..." }
-- Re-runnable: uses IF NOT EXISTS / OR REPLACE throughout.
-- =============================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Shared helpers
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Admin allow-list. A user in this table may write content.
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email   text,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admin_users a where a.user_id = auth.uid());
$$;

-- ---------------------------------------------------------------------------
-- Macro-free table bodies. Each content table repeats the same policy shape:
--   public SELECT, admin-only INSERT/UPDATE/DELETE.
-- ---------------------------------------------------------------------------

-- NEWS -----------------------------------------------------------------------
create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  source_slug text,
  source_url text,
  published_at timestamptz,
  year int,
  source_language text default 'ar',
  featured boolean not null default false,
  category jsonb not null default '{}'::jsonb,
  title jsonb not null default '{}'::jsonb,
  excerpt jsonb not null default '{}'::jsonb,
  content jsonb not null default '{}'::jsonb,          -- { ar: string[], tr: string[], en: string[] }
  image text,
  image_alt jsonb not null default '{}'::jsonb,
  gallery jsonb not null default '[]'::jsonb,
  source_images jsonb not null default '[]'::jsonb,
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- PROJECTS -------------------------------------------------------------------
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  route text,
  title jsonb not null default '{}'::jsonb,
  category jsonb not null default '{}'::jsonb,
  short_description jsonb not null default '{}'::jsonb,
  full_description jsonb not null default '{}'::jsonb,  -- { locale: string[] }
  image text,
  image_alt jsonb not null default '{}'::jsonb,
  image_scale numeric,
  contribution_value jsonb not null default '{}'::jsonb,
  unit_amount numeric,
  facts jsonb not null default '[]'::jsonb,             -- [{ label:{loc}, value:{loc} }]
  official_contribution_url text,
  official_source_url text,
  returns_title jsonb not null default '{}'::jsonb,
  returns_intro jsonb not null default '{}'::jsonb,
  return_uses jsonb not null default '{}'::jsonb,       -- { locale: string[] }
  allocations jsonb not null default '[]'::jsonb,
  video jsonb,
  cta_title jsonb not null default '{}'::jsonb,
  cta_description jsonb not null default '{}'::jsonb,
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- PROGRAMS -------------------------------------------------------------------
create table if not exists public.programs (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  route text,
  title jsonb not null default '{}'::jsonb,
  summary jsonb not null default '{}'::jsonb,
  hero_image text,
  hero_image_alt jsonb not null default '{}'::jsonb,
  images jsonb not null default '[]'::jsonb,
  image_gallery jsonb not null default '[]'::jsonb,
  sections jsonb not null default '[]'::jsonb,
  goals jsonb not null default '{}'::jsonb,
  components jsonb not null default '{}'::jsonb,
  statistics jsonb not null default '[]'::jsonb,
  videos jsonb not null default '[]'::jsonb,
  contact_email text,
  initiatives jsonb not null default '[]'::jsonb,
  cities jsonb not null default '[]'::jsonb,
  journey jsonb not null default '[]'::jsonb,
  pillars jsonb not null default '[]'::jsonb,
  highlights jsonb not null default '{}'::jsonb,
  phase jsonb,
  audiences jsonb not null default '[]'::jsonb,
  themes jsonb not null default '[]'::jsonb,
  overview_image text,
  overview_image_alt jsonb not null default '{}'::jsonb,
  official_source_url text,
  seo jsonb not null default '{}'::jsonb,
  cta jsonb not null default '{}'::jsonb,
  media_note jsonb not null default '{}'::jsonb,
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- LIBRARY: ARTICLES (forum + success-stories) -------------------------------
create table if not exists public.library_articles (
  id uuid primary key default gen_random_uuid(),
  collection text not null check (collection in ('forum','success-stories')),
  slug text not null,
  route text,
  title jsonb not null default '{}'::jsonb,
  original_title text,
  source_url text,
  source_language text default 'ar',
  date text,
  year int,
  excerpt jsonb not null default '{}'::jsonb,
  image text,
  image_alt jsonb not null default '{}'::jsonb,
  content jsonb not null default '{}'::jsonb,           -- { locale: string[] }
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (collection, slug)
);

-- LIBRARY: DOCUMENTS (pdf collections) --------------------------------------
create table if not exists public.library_documents (
  id uuid primary key default gen_random_uuid(),
  collection text not null check (collection in ('periodic-reports','waqf-books','waqf-literature','yemeni-figures')),
  title jsonb not null default '{}'::jsonb,
  source_url text,
  pdf_url text,
  date text,
  year int,
  excerpt jsonb not null default '{}'::jsonb,
  image text,
  image_alt jsonb not null default '{}'::jsonb,
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- LIBRARY: GALLERY -----------------------------------------------------------
create table if not exists public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  title jsonb not null default '{}'::jsonb,
  image text,
  thumbnail text,
  source_url text,
  image_alt jsonb not null default '{}'::jsonb,
  width int,
  height int,
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- DONATION OPPORTUNITIES -----------------------------------------------------
create table if not exists public.donation_opportunities (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title jsonb not null default '{}'::jsonb,
  description jsonb not null default '{}'::jsonb,
  price jsonb not null default '{}'::jsonb,
  image text,
  image_alt jsonb not null default '{}'::jsonb,
  url text,
  available boolean not null default true,
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- PARTNERS -------------------------------------------------------------------
create table if not exists public.partners (
  id uuid primary key default gen_random_uuid(),
  name jsonb not null default '{}'::jsonb,
  logo text,
  url text,
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- STATISTICS -----------------------------------------------------------------
create table if not exists public.stat_indicators (
  id uuid primary key default gen_random_uuid(),
  stat_group text not null check (stat_group in ('yemen-pioneers','statistics')),
  label jsonb not null default '{}'::jsonb,
  value numeric,
  suffix jsonb not null default '{}'::jsonb,
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- SITE PAGES (singleton/flexible content: home, about, governance, settings) -
create table if not exists public.site_pages (
  key text primary key,
  label jsonb not null default '{}'::jsonb,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- PARTICIPATE SUBMISSIONS (public inbox) ------------------------------------
create table if not exists public.participate_submissions (
  id uuid primary key default gen_random_uuid(),
  form_id text,
  source_url text,
  payload jsonb not null default '{}'::jsonb,
  files jsonb not null default '[]'::jsonb,
  status text not null default 'new' check (status in ('new','read','archived')),
  created_at timestamptz not null default now()
);

-- NEWSLETTER SUBSCRIBERS -----------------------------------------------------
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  locale text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array[
    'news','projects','programs','library_articles','library_documents',
    'gallery_images','donation_opportunities','partners','stat_indicators','site_pages'
  ] loop
    execute format('drop trigger if exists set_updated_at on public.%I;', t);
    execute format('create trigger set_updated_at before update on public.%I
                    for each row execute function public.set_updated_at();', t);
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
do $$
declare t text;
begin
  -- Content tables: public read, admin write.
  foreach t in array array[
    'news','projects','programs','library_articles','library_documents',
    'gallery_images','donation_opportunities','partners','stat_indicators','site_pages'
  ] loop
    execute format('alter table public.%I enable row level security;', t);
    execute format('drop policy if exists "public read" on public.%I;', t);
    execute format('create policy "public read" on public.%I for select using (true);', t);
    execute format('drop policy if exists "admin write" on public.%I;', t);
    execute format('create policy "admin write" on public.%I for all
                    using (public.is_admin()) with check (public.is_admin());', t);
  end loop;
end $$;

-- admin_users: only admins can read the list; managed via SQL/service role.
alter table public.admin_users enable row level security;
drop policy if exists "admin read" on public.admin_users;
create policy "admin read" on public.admin_users for select using (public.is_admin());

-- Submissions: anyone may insert (public forms); only admins read/update/delete.
alter table public.participate_submissions enable row level security;
drop policy if exists "public insert" on public.participate_submissions;
create policy "public insert" on public.participate_submissions for insert with check (true);
drop policy if exists "admin manage" on public.participate_submissions;
create policy "admin manage" on public.participate_submissions for select using (public.is_admin());
drop policy if exists "admin update" on public.participate_submissions;
create policy "admin update" on public.participate_submissions for update using (public.is_admin());
drop policy if exists "admin delete" on public.participate_submissions;
create policy "admin delete" on public.participate_submissions for delete using (public.is_admin());

alter table public.newsletter_subscribers enable row level security;
drop policy if exists "public insert" on public.newsletter_subscribers;
create policy "public insert" on public.newsletter_subscribers for insert with check (true);
drop policy if exists "admin read" on public.newsletter_subscribers;
create policy "admin read" on public.newsletter_subscribers for select using (public.is_admin());
drop policy if exists "admin delete" on public.newsletter_subscribers;
create policy "admin delete" on public.newsletter_subscribers for delete using (public.is_admin());

-- ---------------------------------------------------------------------------
-- Helpful indexes
-- ---------------------------------------------------------------------------
create index if not exists news_pub_idx on public.news (is_published, published_at desc);
create index if not exists projects_sort_idx on public.projects (sort_order);
create index if not exists programs_sort_idx on public.programs (sort_order);
create index if not exists lib_articles_coll_idx on public.library_articles (collection, sort_order);
create index if not exists lib_docs_coll_idx on public.library_documents (collection, sort_order);
create index if not exists submissions_status_idx on public.participate_submissions (status, created_at desc);
