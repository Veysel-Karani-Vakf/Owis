-- =============================================================================
-- Storage bucket for admin-uploaded media + admin bootstrap.
-- Run after 0001_schema.sql.
-- =============================================================================

-- Public media bucket (images, pdfs uploaded from the dashboard).
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

-- Anyone can read; only admins can write to the media bucket.
drop policy if exists "media public read" on storage.objects;
create policy "media public read" on storage.objects
  for select using (bucket_id = 'media');

drop policy if exists "media admin insert" on storage.objects;
create policy "media admin insert" on storage.objects
  for insert with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "media admin update" on storage.objects;
create policy "media admin update" on storage.objects
  for update using (bucket_id = 'media' and public.is_admin());

drop policy if exists "media admin delete" on storage.objects;
create policy "media admin delete" on storage.objects
  for delete using (bucket_id = 'media' and public.is_admin());

-- Public site visitors may upload form attachments, but only under submissions/.
drop policy if exists "media public submission upload" on storage.objects;
create policy "media public submission upload" on storage.objects
  for insert with check (bucket_id = 'media' and (storage.foldername(name))[1] = 'submissions');

-- ---------------------------------------------------------------------------
-- Bootstrap the owner account.
--  * Confirm the email so password login works.
--  * Register the user as an admin.
-- Change the email below if the owner account differs.
-- ---------------------------------------------------------------------------
update auth.users
   set email_confirmed_at = coalesce(email_confirmed_at, now())
 where email = 'vktysv@gmail.com';

insert into public.admin_users (user_id, email)
select id, email from auth.users where email = 'vktysv@gmail.com'
on conflict (user_id) do nothing;
