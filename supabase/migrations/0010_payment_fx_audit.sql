-- =============================================================================
-- Donation payment FX audit fields.
-- Store the original USD donation and the exact İş Bankası Banka Alış quote
-- used to calculate the TRY amount sent to NestPay.
-- Existing rows remain valid because all new fields are nullable.
-- =============================================================================

alter table public.donation_payments
  add column if not exists original_amount numeric(12,2),
  add column if not exists original_currency text,
  add column if not exists fx_rate numeric(18,8),
  add column if not exists fx_source text,
  add column if not exists fx_quoted_at timestamptz;

comment on column public.donation_payments.amount is
  'Actual amount sent to the payment gateway; TRY for new İş Bankası payments.';
comment on column public.donation_payments.currency is
  'Currency of amount sent to the gateway; TRY for new İş Bankası payments.';
comment on column public.donation_payments.original_amount is
  'Donation amount selected by the donor before FX conversion.';
comment on column public.donation_payments.original_currency is
  'Currency of original_amount; currently USD.';
comment on column public.donation_payments.fx_rate is
  'USD/TRY rate used for conversion at payment creation time.';
comment on column public.donation_payments.fx_source is
  'FX source identifier; currently ISBANK_BANK_BUYING.';
comment on column public.donation_payments.fx_quoted_at is
  'Timestamp when the FX quote was fetched from the source.';
