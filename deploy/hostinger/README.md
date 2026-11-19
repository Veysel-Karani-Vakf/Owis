# OWIS on the Hostinger VPS

Everything needed to run the site outside Vercel and hosted Supabase. This
directory is used by the staging environment first; production follows only
after the acceptance tests and an explicit go-ahead.

## What runs

| Container | Image | Role |
| --- | --- | --- |
| `web` | Caddy + the Vite build | HTTPS, the SPA, and the public edge |
| `api` | Node 24 | The functions in `api/`, unchanged |
| `supabase-db` | `supabase/postgres` | PostgreSQL (internal network only) |
| `supabase-auth` | `supabase/gotrue` | Admin sign-in |
| `supabase-rest` | `postgrest/postgrest` | Database API with RLS |
| `supabase-storage` | `supabase/storage-api` | `media` and `submissions` buckets |
| `supabase-envoy` | `envoyproxy/envoy` | Supabase API gateway |

Supabase comes from the official self-hosted release pinned in
`supabase-setup.sh`. Its compose file is used as published; only
`supabase.override.yml` is added, to start five of its services instead of
eleven and to keep the gateway off the public interface.

Request routing, all on one origin:

| Path | Goes to |
| --- | --- |
| `/auth/v1/*`, `/rest/v1/*`, `/storage/v1/*` | Supabase gateway |
| `/api/*` | `api` |
| everything else | the SPA (`/donate-now` redirects to `/donate`) |

## Safety rules built into the code

- A build outside Vercel fails unless `VITE_SUPABASE_URL` and
  `VITE_SUPABASE_ANON_KEY` are set. There is no silent fallback to the
  production project.
- A staging build or a staging API process that points at the production
  Supabase project refuses to build or start.
- A staging API process only starts with `PAYMENT_MODE=mock`.
- PostgreSQL publishes no port. The Supabase gateway listens on `127.0.0.1`
  only.

## First-time setup of an environment

Run as an administrator on the server.

```sh
docker network create owis-edge

sh deploy/hostinger/supabase-setup.sh /opt/owis/supabase-staging https://staging.example.org
cd /opt/owis/supabase-staging
docker compose up -d --wait db auth rest storage api-gw
```

Apply the schema (same order as `scripts/db.mjs`):

```sh
for file in $(ls supabase/migrations/*.sql | sort); do
  docker exec -i supabase-db psql -h localhost -U postgres -d postgres \
    -v ON_ERROR_STOP=1 --single-transaction -q -f - < "$file"
done
```

Then create `deploy/hostinger/.env` from `.env.example`, filling
`SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY` from
`/opt/owis/supabase-staging/.env`, and start the application:

```sh
cd deploy/hostinger
docker compose up -d --build --wait
```

## Administration

Studio (the Supabase dashboard) is not part of the running set. Start it when
needed and reach it through an SSH tunnel to `127.0.0.1:8000`:

```sh
cd /opt/owis/supabase-staging
docker compose up -d studio meta
# ... work ...
docker compose stop studio meta
```

## Not done yet

- Daily off-server backups and a tested restore.
- Outgoing mail (SMTP) for password resets.
- Moving production data, accounts and files.
- Bank test and production payment configuration.
