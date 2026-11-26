-- =============================================================================
-- 1. The media bucket stays public for its files: each one is read at its own
--    address (/storage/v1/object/public/media/...), which does not go through
--    these policies. The list of what the bucket holds, however, is for the
--    dashboard only. Until now anyone could list it with the public key.
-- 2. media-originals: a private bucket for the camera originals of the pictures
--    that `owis-migrate optimize-images` made lighter. It has no policy, so only
--    the service role on the server reads or writes it.
-- Re-runnable. Run after 0015.
-- =============================================================================

drop policy if exists "media public read" on storage.objects;
drop policy if exists "media admin read" on storage.objects;
create policy "media admin read" on storage.objects
  for select using (bucket_id = 'media' and public.is_admin());

insert into storage.buckets (id, name, public)
values ('media-originals', 'media-originals', false)
on conflict (id) do update set public = false;
