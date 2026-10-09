-- =============================================================================
-- Veysel Karani Waqf — Pioneers Schema & Policies
-- Stores individual pioneers / fellows of the Yemen Pioneers program.
-- =============================================================================

create table if not exists public.pioneers (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  cohort_id text not null default 'cohort-1',
  name jsonb not null default '{}'::jsonb,
  short_name jsonb not null default '{}'::jsonb,
  role jsonb not null default '{}'::jsonb,
  image text,
  image_position text default 'center 20%',
  origin jsonb not null default '{}'::jsonb,
  city jsonb not null default '{}'::jsonb,
  university jsonb not null default '{}'::jsonb,
  degree jsonb not null default '{}'::jsonb,
  major jsonb not null default '{}'::jsonb,
  short_intro jsonb not null default '{}'::jsonb,
  full_bio jsonb not null default '{}'::jsonb,
  education jsonb not null default '{}'::jsonb,
  career jsonb not null default '{}'::jsonb,
  achievements jsonb not null default '{}'::jsonb,
  program_contribution jsonb not null default '{}'::jsonb,
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_pioneers_updated_at on public.pioneers;
create trigger set_pioneers_updated_at before update on public.pioneers
  for each row execute function public.set_updated_at();

alter table public.pioneers enable row level security;

drop policy if exists "public read" on public.pioneers;
create policy "public read" on public.pioneers for select using (true);

drop policy if exists "admin write" on public.pioneers;
create policy "admin write" on public.pioneers for all
  using (public.is_admin()) with check (public.is_admin());

notify pgrst, 'reload schema';

