# Owis — Veysel Karani Waqf site + admin

Vite + React 18 + TypeScript + Tailwind. Trilingual (ar / tr / en, Arabic is RTL).
Content is served from Supabase and edited in the dashboard at `/admin`.

```bash
npm install
cp .env.example .env.local        # fill in the Supabase values
npm run dev                       # http://localhost:5173
npm run typecheck && npm run lint && npm run build
node scripts/db.mjs migrate       # apply supabase/migrations/*.sql (re-runnable)
node scripts/db.mjs check         # list tables + row counts
```

## How content flows

```
src/data/*.ts, src/i18n/content.ts     static copy = fallback of last resort
          │
src/cms/hydrate.ts  ──► src/cms/store.ts (snapshot)  ──► src/cms/adapters.ts
                                                            │
                                   page accessors (getProjectsContent, getAboutContent, …)
                                                            │
                                                     React components
```

Two kinds of editable content:

| Kind | Where it lives | Admin definition | Admin page |
|---|---|---|---|
| **Site pages** — fixed text/images/buttons of each page | `site_pages` (one jsonb row per key, locale-first: `{ ar: {…}, tr: {…}, en: {…} }`) | `src/admin/lib/pageSchema.ts` (`SITE_PAGES`) | a tab of its hub, `/admin/site/:areaKey/:pageKey/:locale` |
| **Records** — news, projects, programs, donations, partners, figures, banks, library items | one table each | `src/admin/lib/resources.ts` (`RESOURCES`) | a tab of its hub, `/admin/site/:areaKey/:resourceKey` |

The admin is organised as **one hub per public page** (`src/admin/lib/siteMap.ts`,
`SITE_AREAS`): the sidebar lists the site's pages in the site's own order, and a
hub shows that page's record lists and its texts as tabs. The old addresses
`/admin/content/:pageKey/:locale` and `/admin/r/:key` still work — they redirect
into the owning hub (`?section=` and list filters survive), and the record form
stays at `/admin/r/:key/:id`.

### Rules the layers agree on

* **Records:** a column that is `null`/`undefined` was never set → the static
  record with the same slug fills it in. Anything stored — including `''` or an
  emptied list — is shown as stored. A table that loaded with zero published
  rows renders **empty** (`cmsRows()` returns `[]`); it returns `null` only when
  the fetch failed, which means "use the static copy".
* **Site pages:** `cmsPageContent()` deep-merges the row's own locale over the
  static page (`pageForLocale`). A row that only has Arabic does not leak
  Arabic into Turkish/English.
* **Routes derive from slugs** (`/news/<slug>`, `/projects/<slug>`, …). Nothing
  is matched by array position.
* **Localized jsonb shapes** the adapters read (`src/cms/localize.ts`):
  locale-first containers (`{ ar: [...], tr: [...] }` / `{ ar: {...} }`) and
  single structures with localized leaves (`[{ label: { ar, tr } }]`). The
  admin writes locale-first for `localizedRepeater`/`localizedGroup` fields and
  "one structure, localized leaves" for plain `repeater`/`group` fields
  (`src/admin/lib/localizedShapes.ts` converts stored rows on open).
* **Every path in `pageSchema.ts` must have a static default** in the data file
  and be read by a component. `node <scratch>/coverage-check.mjs`-style check:
  `buildPageValue(key, locale, 'static')` must not be `undefined` for the path.
* **Icons** are stored as names from `src/lib/icons.ts` (`resolveIcon(name,
  defaults, index)` keeps each component's old position-based default).
* **Never link to veysvakfi.org** — this repo is the official site.

## Admin

* Shell: `src/admin/AdminApp.tsx` (routes, providers), `components/AdminLayout.tsx`
  (nav from `lib/siteMap.ts`, Ctrl+K search palette), `pages/SitePageHub.tsx`
  (the per-page hub: header, tabs, inbox shortcuts), `Toast.tsx`,
  `ConfirmDialog.tsx`, `EditingLocale.tsx` (one editing language per form),
  `hooks/useUnsavedChanges.ts` (needs the data router set up in `src/main.tsx`).
* Field engine: `components/FormEngine.tsx` (records), `PageFields.tsx` (site
  pages), shared controls in `FieldControls.tsx`; pickers `IconPicker.tsx`,
  `MediaPicker.tsx`. The embeddable editors behind the hub tabs are
  `components/PageContentEditor.tsx` (one page's texts: drafts, save, live
  preview) and `components/ResourceCollection.tsx` (one record list).
* Validation & errors: `lib/validate.ts`, `lib/errors.ts` (Postgres → human text).
* Restore (`/admin/restore`, `lib/seed.ts`): **fill** adds only what is missing
  (never touches existing rows/pages); **reset** replaces everything with the
  built-in copy and requires a typed confirmation.
* Adding a new editable thing:
  1. column → `supabase/migrations/000N_*.sql` (additive, re-runnable) + `src/lib/types.ts`;
  2. adapter → `src/cms/adapters.ts`; static default → `src/data/*`;
  3. admin field → `resources.ts` (records) or `pageSchema.ts` (site pages;
     also register the key in `pageDefaults.ts` → `pageSource`);
  4. put it in a hub → `lib/siteMap.ts` (`SITE_AREAS`);
  5. seed → `lib/seed.ts`; render it in the component.

## Migrations

`supabase/migrations/` — run in order with `node scripts/db.mjs migrate`.
`0004_admin_coverage.sql` (new columns) and `0005_private_submissions.sql`
(private `submissions` bucket for form attachments; the dashboard opens them
through signed URLs) are applied on the production project (Aug 2026).
Attachments uploaded before 0005 still sit in the public `media/submissions/`
folder — move or delete them from the media library if they are sensitive.
`0006_donation_payments.sql` (payments table + catalogue URL/image data fix)
is applied on the production project (Aug 2026).
`0008_bank_accounts.sql` creates the `bank_accounts` table behind `/bank-accounts`
and the admin's "Banks & accounts" list; until it is applied the site simply
renders the built-in bank list (`cmsBankAccounts` also treats an *empty* table
as "use the built-in list" — a page of IBANs must never render empty).

## Payments (test mode)

The donate flow charges cards through the site's own gateway, built to speak
the İş Bankası NestPay (Payten/Asseco EST) protocol in the `3d_pay_hosting`
model (the card is typed on the bank's own page; no card data reaches this site):

1. `/donate/checkout/:slug` collects the amount (USD) and donor details; the
   card is entered on the bank's hosted page.
2. `POST /api/payments/create` validates, inserts a `pending` row in
   `donation_payments` and returns the ver3-SHA512-signed field set.
3. The browser form-POSTs those fields to the 3D gate. In **mock** mode that is
   our own `POST /api/payments/mock-gate`, a simulated bank page (approve /
   decline buttons, TEST banner) that signs its response exactly like the bank.
4. The gate posts the outcome to `POST /api/payments/callback` (okUrl=failUrl),
   which verifies the hash, cross-checks clientid+amount, finalizes the row
   (`paid` iff `mdStatus ∈ {1,2,3,4}` and `ProcReturnCode = 00`; replay-safe)
   and 303-redirects to `/donate/result?oid=…`.
5. The result page reads `GET /api/payments/status?oid=…` (the random 128-bit
   oid is the bearer token; there is no public listing).

Everything protocol-specific (field names, ver3 hash, callback charset) lives
in `api/_lib/nestpay.ts` — correct it there against the bank's integration
guide when real credentials arrive.

Server env (Vercel project settings — never `VITE_`-prefixed):

| Variable | mock (default) | bank test / production |
| --- | --- | --- |
| `PAYMENT_MODE` | `mock` | `test` / `production` |
| `PAYMENT_CLIENT_ID` | placeholder `TEST_CLIENT_ID` (ignored) | merchant id (clientid) from İş Bank |
| `PAYMENT_STORE_KEY` | placeholder `TEST_STORE_KEY` (ignored) | store key ("3D Secure key") set in the İş Bank merchant panel |
| `PAYMENT_GATE_URL` | placeholder `TEST_GATEWAY_URL` (ignored) | test `https://entegrasyon.asseco-see.com.tr/fim/est3Dgate`, production `https://sanalpos.isbank.com.tr/fim/est3Dgate` |
| `PUBLIC_SITE_URL` | optional | optional; pins okUrl/failUrl to the canonical domain |
| `SUPABASE_SERVICE_ROLE_KEY` | required | required |

Going live is an env change only; `mock-gate` returns 404 outside mock mode,
and `donation_payments.gateway_mode` keeps mock rows distinguishable forever.
The `TEST_*` placeholders are safe to leave in place: mock mode falls back to
its built-in values, and test/production refuse to start (500 on
`/api/payments/create`) while any of them is still a placeholder, so a
half-configured deployment can never post a card to a bogus gate.

Protocol notes (İş Bankası NestPay/EST, `3d_pay_hosting`, hash `ver3`): field
set `clientid, storetype, islemtipi=Auth, amount, currency, oid, okUrl,
failUrl, lang, rnd, taksit, refreshtime, hashAlgorithm, encoding=UTF-8`; hash =
base64(SHA-512) over all fields except `hash`/`encoding`/`countdown`, sorted
like PHP `natcasesort`, escaped, joined with `|`, store key last. The callback
is verified over the exact bytes the bank posted (`readFormBodyBinary`), so it
holds whether the gate answers in ISO-8859-9 or UTF-8; the string-based
fallbacks (lower-case ordering, Latin-5) remain and log which one matched
(`api/_lib/nestpay.ts`). Go-live checklist: the bank confirms the merchant is
enabled for the **3D_PAY_HOSTING** model and for USD (currency 840), store key
set in the bank panel, the three env vars set in Vercel, then
`PAYMENT_MODE=test` first with the bank's test cards.

Mock test cards (any Luhn-valid number also works): `4508 0345 0803 4509`
interactive approve/decline, `4000 0000 0000 0002` fails 3-D Secure,
`4242 4242 4208 0069` is declined by the bank (code 51).

Local dev: `npm run dev:full` (vercel dev, one-time `vercel login` + `vercel
link`) serves the SPA and `api/` together; plain `npm run dev` proxies `/api`
to port 3000. Payments show up read-only in the dashboard at `/admin/payments`
(RLS: no anon access; server writes with the service-role key only).

`api/package.json` pins the functions to CommonJS. The root `package.json` is
`"type": "module"`, and Vercel compiles `api/**/*.ts` with TypeScript's
`NodeNext`, which would otherwise emit ESM with the extensionless `../_lib/*`
imports and crash every function at load (`ERR_MODULE_NOT_FOUND`, surfaced as
`FUNCTION_INVOCATION_FAILED`). Keep that file, or add `.js` to every relative
import in `api/`, whenever the API layout changes.
