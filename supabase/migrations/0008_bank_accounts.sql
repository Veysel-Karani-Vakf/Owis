-- Bank accounts shown on /bank-accounts. One row per bank; that bank's IBANs
-- live in the `accounts` jsonb list ([{ currency, iban, accountNumber }]).
-- Bank names, branches and IBANs are the same in every language, so the row is
-- not localized; the page's labels around them live in site_pages.

create table if not exists public.bank_accounts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null default '',
  monogram text not null default '',
  logo text,
  brand_color text,
  branch text not null default '',
  swift text,
  account_number text,
  accounts jsonb not null default '[]'::jsonb,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_updated_at on public.bank_accounts;
create trigger set_updated_at before update on public.bank_accounts
  for each row execute function public.set_updated_at();

alter table public.bank_accounts enable row level security;

drop policy if exists "public read" on public.bank_accounts;
create policy "public read" on public.bank_accounts for select using (true);

drop policy if exists "admin write" on public.bank_accounts;
create policy "admin write" on public.bank_accounts for all
  using (public.is_admin()) with check (public.is_admin());

notify pgrst, 'reload schema';
