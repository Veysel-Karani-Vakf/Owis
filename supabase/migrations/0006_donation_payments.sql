-- =============================================================================
-- Donation payments: one row per attempted card donation through the site's
-- payment gateway (currently the internal mock of the İş Bankası NestPay POS).
-- Rows are written exclusively by the server (Vercel functions with the
-- service-role key); the browser never touches this table directly and only
-- admins may read it from the dashboard.
-- Re-runnable. Run after 0005.
-- =============================================================================

create table if not exists public.donation_payments (
  id uuid primary key default gen_random_uuid(),
  -- Gateway order id AND the status-lookup bearer token (32 random hex chars).
  oid text unique not null,
  opportunity_slug text,
  -- Title snapshot in the donor's locale at payment time; the catalogue row
  -- may be renamed or deleted later.
  opportunity_title text,
  donor_name text not null,
  donor_email text,
  donor_phone text,
  locale text,
  amount numeric(12,2) not null check (amount > 0),
  currency text not null default 'TRY',
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed')),
  -- Which gateway handled the row: the internal mock, the bank's test
  -- environment, or production. Mock rows stay distinguishable forever.
  gateway_mode text not null default 'mock' check (gateway_mode in ('mock', 'test', 'production')),
  -- Gateway response fields (NestPay naming).
  md_status text,
  proc_return_code text,
  auth_code text,
  trans_id text,
  error_message text,
  masked_pan text,
  -- Whitelisted gateway callback params only; never card data.
  raw_response jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists donation_payments_created_at_idx
  on public.donation_payments (created_at desc);
create index if not exists donation_payments_status_idx
  on public.donation_payments (status);

drop trigger if exists set_updated_at on public.donation_payments;
create trigger set_updated_at before update on public.donation_payments
  for each row execute function public.set_updated_at();

alter table public.donation_payments enable row level security;

-- No public policies on purpose: anon can neither read nor write. The Vercel
-- functions use the service-role key (bypasses RLS); the dashboard reads with
-- the signed-in admin session.
drop policy if exists "admin read" on public.donation_payments;
create policy "admin read" on public.donation_payments
  for select using (public.is_admin());

-- ---------------------------------------------------------------------------
-- Catalogue data fix: seeded opportunity rows still point at the temporary
-- contact-form flow; move them to the new checkout pages. Admin-entered custom
-- URLs (anything else) are left untouched.
-- ---------------------------------------------------------------------------
update public.donation_opportunities
  set url = '/donate/checkout/' || slug
  where url = '/participate/contact';

-- Seeded rows carried dev-server image paths (/src/assets/...) that 404 in a
-- production build; the same files are mirrored under public/media/donate.
update public.donation_opportunities
  set image = replace(image, '/src/assets/donate/', '/media/donate/')
  where image like '/src/assets/donate/%';
