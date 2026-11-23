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

Every push to `main` runs `Staging CI`: type checks, the production-fallback
guards, the whole stack on the runner (including the mock donation flow), and
only then a deployment to veysvakfi.org through the restricted deploy key.
Pull requests into `main` get the same checks without the deployment. (Until
23 Nov 2026 the site deployed from `infra/hostinger-staging`; the server now
refuses commits that are not on `main`.)
If the new containers do not become healthy the server goes back to the
previous images by itself. `owis-deploy-staging rollback-drill` (root only)
proves that safety net with a build that cannot start; the staging API is
unavailable for about a minute while it runs.

Database migrations are deliberately **not** part of a deployment. After CI
has proved a new file in `supabase/migrations` on a fresh database, apply it on
the server as root:

```sh
docker exec -i supabase-db psql -v ON_ERROR_STOP=1 --single-transaction \
  -U postgres -h localhost -d postgres \
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

### Copy outside the server (Google Drive)

Only the encrypted archives are uploaded, each one checked to be an AES-256
encrypted file first; they are copied, never moved, and compared with the
remote afterwards. The key and the Google token (`/opt/owis/rclone.conf`, root
only) stay on the server and are not part of any archive.

Connecting needs a person: Google asks for consent in a browser. From your own
computer, with a tunnel to the small page rclone opens on the server:

```sh
ssh -t -L 53682:127.0.0.1:53682 owisadmin@<server> "sudo owis-backup offsite-connect staging"
```

Open the link it prints in your browser, sign in and approve. The default
access is `restricted` (Google's `drive.file`): the connection can only see
files it created itself, so a stolen token cannot read the rest of the Drive.
The price is that it cannot use a folder made by hand; it creates its own
`OWIS-Encrypted-Backups/staging`. `... offsite-connect staging full` grants the
whole Drive instead and uses an existing folder of that name.

| Command | What it does |
| --- | --- |
| `owis-backup offsite-sync staging` | uploads every local archive the remote lacks, then verifies them |
| `owis-restore-test offsite staging` | downloads the newest remote archive and restores it into the scratch database |
| `owis-backup key-show` / `key-check` | show the key on your own terminal / compare a saved copy (hidden input) |

After that the daily backup uploads its archive by itself and the weekly
restore test also tests the remote copy. A failed run is written to
`/var/log/owis-backup-staging.log`, and `status` reports `backup_alert=yes`
until the next clean run.

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
attention. GitHub offers the manual button and the daily schedule only for
workflows on the default branch; until this branch is merged, the monitor runs
when its own file changes, and every deployment prints the same status.

## The live data and the production settings

`owis-migrate` (root only, `/usr/local/sbin`) moved the live site here. Every
command prints what it does; none of them writes to the old project.

| Command | What it does |
| --- | --- |
| `secrets`, `store-key`, `repair`, `state` | values typed by the owner (hidden input), kept root-only in `/opt/owis/migrate`, never printed |
| `source-test`, `source-dump` | read the old database; the dump is kept as an encrypted archive in `/var/backups/owis/source` |
| `import plan`, `import apply` | back up this server, then replace the site tables and the login accounts in one transaction and compare row counts and access policies |
| `source-changes [baseline]` | content fingerprint of every table against a recorded baseline: has the old site received anything since? |
| `urls <from> <to> [apply]` | rewrite stored file addresses (they are saved in the content with their full address) |
| `files-test`, `files-copy`, `files-auto on\|off\|status` | copy the stored files through this server's own storage service; `files-auto` retries every 10 minutes until all are here |
| `promote plan\|apply [payments-off]` | switch the stack from the staging settings to the production ones |
| `dns`, `cutover plan\|apply` | the last step, once the domain's records point here: certificate, redirects, sign-in links, stored file addresses |

The stack keeps its internal label `staging` (paths, container and backup
names) after it serves the official site; `DEPLOY_ENV` in
`/opt/owis/staging.env` says what it really is, and `owis-deploy-staging status`
reports it. A push to the branch still builds, tests and deploys it, and the
checks after the deployment follow what the server reports.

### Online payments

`PAYMENT_MODE` decides what the donation checkout does:

| Value | Behaviour |
| --- | --- |
| `mock` | simulated bank; only accepted when `DEPLOY_ENV=staging` |
| `test`, `production` | the bank's gateway; needs `PAYMENT_CLIENT_ID`, `PAYMENT_STORE_KEY`, `PAYMENT_GATE_URL`, and the API refuses to start in production without them |
| `disabled` | no online payment at all: the checkout shows a notice with the bank accounts, `/api/payments/create` and `/direct` answer 503, nothing is recorded or sent to a bank |

Production never runs the simulated bank. To switch the bank on later: type the
store key with `owis-migrate store-key`, then `owis-migrate promote apply`.

`deploy/hostinger/tests/admin-api-check.py` (run as root on the server) checks
what a visitor may read, that an administrator can add, change and remove
records and files, and that the sign-in service refuses unknown accounts.

## Not done yet

- An alert that reaches a person when a backup fails (needs a mail or
  notification channel).
- Outgoing mail (SMTP) for password resets.
- Bank production payments: waiting for the store key (`PAYMENT_MODE=disabled`
  until then).
- The domain: `owis-migrate cutover apply` after the DNS records are changed.
