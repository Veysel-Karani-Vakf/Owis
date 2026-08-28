-- =============================================================================
-- Admin auth compatibility + PostgREST schema reload.
-- Safe to run after 0001/0002 or on partially configured projects.
-- =============================================================================

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'
    or exists (select 1 from public.admin_users a where a.user_id = auth.uid());
$$;

notify pgrst, 'reload schema';
