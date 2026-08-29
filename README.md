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
| **Site pages** — fixed text/images/buttons of each page | `site_pages` (one jsonb row per key, locale-first: `{ ar: {…}, tr: {…}, en: {…} }`) | `src/admin/lib/pageSchema.ts` (`SITE_PAGES`) | `/admin/content/:pageKey/:locale` |
| **Records** — news, projects, programs, donations, partners, figures, library items | one table each | `src/admin/lib/resources.ts` (`RESOURCES`) | `/admin/r/:key` |

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
  (nav, Ctrl+K search palette), `Toast.tsx`, `ConfirmDialog.tsx`,
  `EditingLocale.tsx` (one editing language per form), `hooks/useUnsavedChanges.ts`
  (needs the data router set up in `src/main.tsx`).
* Field engine: `components/FormEngine.tsx` (records), `PageFields.tsx` (site
  pages), shared controls in `FieldControls.tsx`; pickers `IconPicker.tsx`,
  `MediaPicker.tsx`.
* Validation & errors: `lib/validate.ts`, `lib/errors.ts` (Postgres → human text).
* Restore (`/admin/restore`, `lib/seed.ts`): **fill** adds only what is missing
  (never touches existing rows/pages); **reset** replaces everything with the
  built-in copy and requires a typed confirmation.
* Adding a new editable thing:
  1. column → `supabase/migrations/000N_*.sql` (additive, re-runnable) + `src/lib/types.ts`;
  2. adapter → `src/cms/adapters.ts`; static default → `src/data/*`;
  3. admin field → `resources.ts` (records) or `pageSchema.ts` (site pages);
  4. seed → `lib/seed.ts`; render it in the component.

## Migrations

`supabase/migrations/` — run in order with `node scripts/db.mjs migrate`.
`0004_admin_coverage.sql` (new columns) and `0005_private_submissions.sql`
(private `submissions` bucket for form attachments; the dashboard opens them
through signed URLs) are applied on the production project (Aug 2026).
Attachments uploaded before 0005 still sit in the public `media/submissions/`
folder — move or delete them from the media library if they are sensitive.
