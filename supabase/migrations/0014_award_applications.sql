-- =============================================================================
-- Owais Volunteer Award: nominations sent through /volunteer-award/apply.
--
-- The public form never writes here directly. /api/award/apply re-validates the
-- submission against the award's conditions and inserts with the service-role
-- key, so there is no anon policy at all; admins read, triage (status + notes)
-- and delete from the dashboard. Supporting photos live in the private
-- `submissions` bucket (0005) under award/<upload id>/.
-- Re-runnable. Run after 0013.
-- =============================================================================

create sequence if not exists public.award_application_seq;

create table if not exists public.award_applications (
  id uuid primary key default gen_random_uuid(),
  -- Shown to the applicant after sending, e.g. OWA-2026-0007 (set by trigger).
  reference_no text unique,
  edition int not null default 2026,
  -- Language the form was filled in.
  locale text,
  initiative_name text not null,
  representative text not null,
  -- E.164, e.g. +967777123456.
  whatsapp text not null,
  email text not null,
  all_members_yemeni boolean not null default true,
  team_size int not null check (team_size > 0),
  -- ISO 3166-2:YE code (YE-SA, YE-AD, …); the dashboard shows the name.
  governorate text not null,
  district text not null,
  -- YYYY-MM. period_end is null while the activity is still running.
  period_start text not null,
  period_end text,
  ongoing boolean not null default false,
  category text not null,
  category_other text,
  -- [{ platform, name, url }]
  social_links jsonb not null default '[]'::jsonb,
  answer_idea text not null,
  answer_results text not null,
  answer_team text not null,
  answer_sustainability text not null,
  -- [{ path, name, type, size }] — object paths inside the submissions bucket.
  images jsonb not null default '[]'::jsonb,
  declaration_accepted boolean not null default false,
  status text not null default 'new'
    check (status in ('new', 'reviewing', 'shortlisted', 'rejected', 'archived')),
  -- Internal notes of the award team; never shown to the applicant.
  admin_notes text not null default '',
  source_url text,
  -- Salted hash of the sender's address, used only to throttle floods.
  ip_hash text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists award_applications_created_at_idx
  on public.award_applications (created_at desc);
create index if not exists award_applications_status_idx
  on public.award_applications (status);
create index if not exists award_applications_email_idx
  on public.award_applications (lower(email));
create index if not exists award_applications_ip_hash_idx
  on public.award_applications (ip_hash, created_at desc);

-- The reference number is always assigned here, whatever the insert carried.
create or replace function public.award_application_reference()
returns trigger language plpgsql as $$
begin
  new.reference_no := 'OWA-' || new.edition || '-'
    || lpad(nextval('public.award_application_seq')::text, 4, '0');
  return new;
end;
$$;

drop trigger if exists award_application_reference on public.award_applications;
create trigger award_application_reference before insert on public.award_applications
  for each row execute function public.award_application_reference();

drop trigger if exists set_updated_at on public.award_applications;
create trigger set_updated_at before update on public.award_applications
  for each row execute function public.set_updated_at();

grant usage, select on sequence public.award_application_seq to service_role;

alter table public.award_applications enable row level security;

-- No public policies on purpose: anon can neither read nor write. The Vercel
-- function uses the service-role key (bypasses RLS); the dashboard works with
-- the signed-in admin session.
drop policy if exists "admin read" on public.award_applications;
create policy "admin read" on public.award_applications
  for select using (public.is_admin());

drop policy if exists "admin update" on public.award_applications;
create policy "admin update" on public.award_applications
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin delete" on public.award_applications;
create policy "admin delete" on public.award_applications
  for delete using (public.is_admin());

notify pgrst, 'reload schema';
