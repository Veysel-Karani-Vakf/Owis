-- Details shown on the public statistics flip cards.
alter table public.stat_indicators
  add column if not exists detail jsonb not null default '{}'::jsonb;

notify pgrst, 'reload schema';
