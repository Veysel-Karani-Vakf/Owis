-- Complete the bank-account catalogue introduced in 0008.
--
-- The six rows below are the bank details that were previously compiled into
-- the React bundle. They are inserted once into the database so the admin and
-- public page now have one runtime source of truth. Existing rows always win.

create or replace function public.valid_bank_account_list(value jsonb)
returns boolean
language sql
immutable
strict
set search_path = public
as $$
  select case
    when jsonb_typeof(value) <> 'array' or jsonb_array_length(value) = 0 then false
    else
      not exists (
        select 1
        from jsonb_array_elements(value) as entry
        where jsonb_typeof(entry) <> 'object'
           or coalesce(entry->>'currency', '') not in ('TRY', 'USD', 'EUR', 'SAR')
           or regexp_replace(upper(coalesce(entry->>'iban', '')), '[[:space:]]', '', 'g')
                !~ '^[A-Z]{2}[A-Z0-9]{13,32}$'
      )
      and (
        select count(*) = count(distinct entry->>'currency')
        from jsonb_array_elements(value) as entry
      )
  end;
$$;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.bank_accounts'::regclass
      and conname = 'bank_accounts_name_present'
  ) then
    alter table public.bank_accounts
      add constraint bank_accounts_name_present check (btrim(name) <> '') not valid;
  end if;
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.bank_accounts'::regclass
      and conname = 'bank_accounts_slug_present'
  ) then
    alter table public.bank_accounts
      add constraint bank_accounts_slug_present check (btrim(slug) <> '') not valid;
  end if;
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.bank_accounts'::regclass
      and conname = 'bank_accounts_swift_format'
  ) then
    alter table public.bank_accounts
      add constraint bank_accounts_swift_format
      check (swift is null or btrim(swift) = '' or btrim(swift) ~* '^[A-Z0-9]{8,11}$') not valid;
  end if;
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.bank_accounts'::regclass
      and conname = 'bank_accounts_brand_color_format'
  ) then
    alter table public.bank_accounts
      add constraint bank_accounts_brand_color_format
      check (brand_color is null or btrim(brand_color) = '' or btrim(brand_color) ~* '^#[0-9A-F]{6}$') not valid;
  end if;
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.bank_accounts'::regclass
      and conname = 'bank_accounts_entries_valid'
  ) then
    alter table public.bank_accounts
      add constraint bank_accounts_entries_valid check (public.valid_bank_account_list(accounts)) not valid;
  end if;
end $$;

insert into public.bank_accounts (
  slug, name, monogram, logo, brand_color, branch, swift,
  account_number, accounts, sort_order, is_published
)
values
  (
    'vakifbank', 'VakıfBank', 'VB', '/media/banks/vakifbank.svg', '#f7c600',
    'Taksim / İstanbul Şubesi – 0005', 'TVBATR2A', null,
    '[{"currency":"TRY","iban":"TR140001500158007305877312","accountNumber":"00158007305877312"},{"currency":"USD","iban":"TR360001500158048016524134","accountNumber":"00158048016524134"},{"currency":"EUR","iban":"TR950001500158048016524139","accountNumber":"00158048016524139"}]'::jsonb,
    0, true
  ),
  (
    'albaraka', 'Albaraka Türk', 'AB', '/media/banks/albaraka.svg', '#e8552f',
    'Yıldıztepe Bağcılar Şubesi', 'BTFHTRIS', '7740936',
    '[{"currency":"TRY","iban":"TR790020300007740936000001"},{"currency":"USD","iban":"TR520020300007740936000002"},{"currency":"EUR","iban":"TR250020300007740936000003"}]'::jsonb,
    1, true
  ),
  (
    'kuveyt-turk', 'Kuveyt Türk', 'KT', '/media/banks/kuveyt-turk.svg', '#0a7a5c',
    'Şirinevler Şubesi', 'KTEFTRISXXX', '94823084',
    '[{"currency":"TRY","iban":"TR020020500009482308400001"},{"currency":"USD","iban":"TR180020500009482308400101"},{"currency":"EUR","iban":"TR880020500009482308400102"}]'::jsonb,
    2, true
  ),
  (
    'vakif-katilim', 'Vakıf Katılım', 'VK', '/media/banks/vakif-katilim.svg', '#c2258a',
    'Gaziosmanpaşa Şubesi', 'VAKFTRIS', null,
    '[{"currency":"TRY","iban":"TR500021000000023703800001"},{"currency":"USD","iban":"TR660021000000023703800101"},{"currency":"EUR","iban":"TR390021000000023703800102"}]'::jsonb,
    3, true
  ),
  (
    'is-bankasi', 'Türkiye İş Bankası', 'İŞ', '/media/banks/is-bankasi.svg', '#1c4e9c',
    'Nişantaşı Şubesi', 'ISBKTRISXXX', null,
    '[{"currency":"TRY","iban":"TR710006400000110401777290"},{"currency":"USD","iban":"TR950006400000210403637410"},{"currency":"EUR","iban":"TR870006400000210403688867"},{"currency":"SAR","iban":"TR450006400000210403639959"}]'::jsonb,
    4, true
  ),
  (
    'ziraat-katilim', 'Ziraat Katılım', 'ZK', '/media/banks/ziraat-katilim.svg', '#b3121b',
    'Güneşli Şubesi / İstanbul', null, '1355957',
    '[{"currency":"TRY","iban":"TR620020900001355957000001"},{"currency":"USD","iban":"TR350020900001355957000002"},{"currency":"EUR","iban":"TR080020900001355957000003"},{"currency":"SAR","iban":"TR780020900001355957000004"}]'::jsonb,
    5, true
  )
on conflict (slug) do nothing;

-- PostgREST privileges plus RLS: visitors see published rows; authenticated
-- admins can read drafts and perform CRUD through the existing admin policy.
grant select on public.bank_accounts to anon, authenticated;
grant insert, update, delete on public.bank_accounts to authenticated;

drop policy if exists "public read" on public.bank_accounts;
drop policy if exists "public read published" on public.bank_accounts;
create policy "public read published" on public.bank_accounts
  for select using (is_published or public.is_admin());

notify pgrst, 'reload schema';
