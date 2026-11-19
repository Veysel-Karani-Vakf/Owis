-- Newsletter sign-ups are written straight from the browser (anonymous role,
-- insert-only policy), so the database is the only place that can refuse junk.
-- Until now it accepted any text: an empty string, "not-an-email", a
-- 400-character value, and the same address again in a different letter case.
--
-- 1. New rows are trimmed and lower-cased, so the existing unique constraint
--    also recognises "Name@Example.org" after "name@example.org".
-- 2. A CHECK constraint refuses values that are not shaped like an address.
--    It is added NOT VALID on purpose: rows that are already stored are left
--    exactly as they are (nothing is deleted or rewritten); only new or
--    changed rows are checked.
--
-- Safe to run more than once.

create or replace function public.newsletter_normalize_email()
returns trigger
language plpgsql
as $$
begin
  new.email := lower(btrim(new.email));
  return new;
end;
$$;

drop trigger if exists newsletter_normalize_email on public.newsletter_subscribers;
create trigger newsletter_normalize_email
  before insert or update of email on public.newsletter_subscribers
  for each row execute function public.newsletter_normalize_email();

alter table public.newsletter_subscribers
  drop constraint if exists newsletter_subscribers_email_format;
alter table public.newsletter_subscribers
  add constraint newsletter_subscribers_email_format
  check (
    char_length(email) between 6 and 254
    and email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'
  ) not valid;
