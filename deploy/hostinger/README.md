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

## Deployments and database changes

Every push to `infra/hostinger-staging` runs `Staging CI`: type checks, the
production-fallback guards, the whole stack on the runner (including the mock
donation flow), and only then a deployment through the restricted deploy key.
If the new containers do not become healthy the server goes back to the
previous images by itself.

Database migrations are deliberately **not** part of a deployment. After CI
has proved a new file in `supabase/migrations` on a fresh database, apply it on
the server as root:

```sh
docker exec -i supabase-db psql -v ON_ERROR_STOP=1 --single-transaction \
  -U supabase_admin -h localhost -d postgres \
  < /opt/owis/repo/supabase/migrations/00NN_name.sql
```

## Backups and restore

Installed once as root, from the root-owned checkout:

```sh
bash /opt/owis/repo/deploy/hostinger/server/install-backups.sh
```

| What | When | How |
| --- | --- | --- |
| `owis-backup run staging` | every day, 01:30 UTC | database (schemas `public`, `auth`, `storage`), every uploaded file, and the settings needed to rebuild the stack, in one encrypted archive under `/var/backups/owis/staging` (14 days kept) |
| `owis-restore-test run staging` | every Sunday, 03:00 UTC | decrypts the newest archive, restores it into a scratch PostgreSQL with no network, and compares every table's row count, the security policies and every stored file with what the backup recorded |

The archives are encrypted with `/opt/owis/backup.key` (root only). **Copy that
key to a password manager.** It is never printed by the scripts, and an archive
kept anywhere else cannot be opened without it.

Copies outside the server are made when `/opt/owis/backup-offsite.conf`
contains `OFFSITE_RCLONE_REMOTE=<remote>:<path>` and `/opt/owis/rclone.conf`
describes that remote. Until then the archives exist on this server only.

Restoring for real, on a rebuilt server:

1. Run `bootstrap-staging.sh` (or restore `config.tar` from the archive to keep
   the same keys), so that the five Supabase services exist and are healthy.
2. Decrypt the archive:
   `gpg --pinentry-mode loopback --passphrase-file /opt/owis/backup.key -d owis-staging-<time>.tar.gpg | tar -xf -`
3. Stop `auth`, `rest` and `storage`, then restore the dump exactly as the
   restore test does:
   `pg_restore -l db.dump | grep -v " SCHEMA - " > db.toc` and
   `pg_restore -U supabase_admin -h localhost -d postgres --clean --if-exists -L db.toc db.dump`
4. Unpack `storage.tar` into `/opt/owis/supabase-staging/volumes/`.
5. Start the services again and run `owis-deploy-staging status`.

## Monitoring

`owis-deploy-staging status` (also reachable by the deploy key as `status`)
prints what is deployed, container health, disk, memory, the age of the last
backup and the result of the last restore test. The `Staging monitor` workflow
reads it, checks the site and its certificate, and fails when something needs
attention. GitHub only runs its daily schedule from the default branch; until
this branch is merged, start it by hand from the Actions tab.

## Not done yet

- A destination outside the server for the encrypted backups.
- Outgoing mail (SMTP) for password resets.
- Moving production data, accounts and files.
- Bank test and production payment configuration.
