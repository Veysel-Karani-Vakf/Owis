-- =============================================================================
-- Visitor attachments (CVs, documents sent through the participate forms) are
-- personal. They move from the public media bucket to a private one that only
-- admins can read; the dashboard opens them through signed URLs.
-- Re-runnable. Run after 0004.
-- =============================================================================

insert into storage.buckets (id, name, public, file_size_limit)
values ('submissions', 'submissions', false, 10485760)
on conflict (id) do update set public = false, file_size_limit = 10485760;

-- Anyone may upload (that is how the public forms work); only admins may see,
-- list or delete what was uploaded.
drop policy if exists "submissions public upload" on storage.objects;
create policy "submissions public upload" on storage.objects
  for insert with check (bucket_id = 'submissions');

drop policy if exists "submissions admin read" on storage.objects;
create policy "submissions admin read" on storage.objects
  for select using (bucket_id = 'submissions' and public.is_admin());

drop policy if exists "submissions admin delete" on storage.objects;
create policy "submissions admin delete" on storage.objects
  for delete using (bucket_id = 'submissions' and public.is_admin());

-- The public media bucket no longer accepts visitor uploads.
drop policy if exists "media public submission upload" on storage.objects;
