#!/usr/bin/env bash
# One-time preparation of the staging environment on the VPS. Run as root:
#
#   git clone -b main https://github.com/Veysel-Karani-Vakf/Owis /opt/owis/repo
#   bash /opt/owis/repo/deploy/hostinger/server/bootstrap-staging.sh
#
# Safe to run again: each step checks what already exists. It never regenerates
# secrets, never touches existing data, and changes nothing outside /opt/owis,
# /usr/local/sbin/owis-*, /etc/sudoers.d/owis-deploy-staging and the
# authorized_keys file of the deploy account.
set -euo pipefail

SITE_HOST="${SITE_HOST:-staging.veysvakfi.org}"
PUBLIC_URL="https://${SITE_HOST}"
ROOT="/opt/owis"
REPO="$ROOT/repo"
HERE="$REPO/deploy/hostinger"
SUPABASE_DIR="$ROOT/supabase-staging"
ENV_FILE="$ROOT/staging.env"
DEPLOY_USER="owisdeploy"
LOG="/var/log/owis-bootstrap-staging.log"

step() {
  printf '\n[%s] %s\n' "$(date -u +%T)" "$*"
}

[ "$(id -u)" -eq 0 ] || {
  echo "run as root" >&2
  exit 1
}
[ -d "$REPO/.git" ] || {
  echo "$REPO is missing; clone the repository there first" >&2
  exit 1
}
command -v docker > /dev/null || {
  echo "docker is not installed" >&2
  exit 1
}
id "$DEPLOY_USER" > /dev/null 2>&1 || {
  echo "account $DEPLOY_USER does not exist" >&2
  exit 1
}

exec > >(tee -a "$LOG") 2>&1
echo "== $(date -u +%FT%TZ) bootstrap for ${SITE_HOST}"

chmod 700 "$ROOT"
install -d -m 700 "$ROOT/app"

step "Docker network"
docker network inspect owis-edge > /dev/null 2>&1 || docker network create owis-edge > /dev/null
echo "owis-edge ready"

step "Self-hosted Supabase (official pinned release)"
if [ -e "$SUPABASE_DIR/.env" ]; then
  echo "already prepared in $SUPABASE_DIR"
else
  sh "$HERE/supabase-setup.sh" "$SUPABASE_DIR" "$PUBLIC_URL"
fi
(cd "$SUPABASE_DIR" && docker compose up -d --quiet-pull --wait --wait-timeout 900 db auth rest storage api-gw)
(cd "$SUPABASE_DIR" && docker compose ps)

sql() {
  docker exec -i supabase-db psql -h localhost -U postgres -d postgres -v ON_ERROR_STOP=1 "$@"
}

step "Database schema (first run only; later migrations are applied on purpose, not on deploy)"
if [ -e "$ROOT/staging.migrated" ]; then
  echo "already applied on $(cat "$ROOT/staging.migrated")"
else
  ready=0
  for _ in $(seq 1 60); do
    ready="$(sql -Atc "select (to_regclass('storage.buckets') is not null and to_regclass('storage.objects') is not null)::int" || echo 0)"
    [ "$ready" = "1" ] && break
    sleep 2
  done
  [ "$ready" = "1" ] || {
    echo "storage tables did not appear" >&2
    exit 1
  }
  for file in $(ls "$REPO"/supabase/migrations/*.sql | sort); do
    echo "-> $(basename "$file")"
    sql --single-transaction -q -f - < "$file" > /dev/null
  done
  date -u +%FT%TZ > "$ROOT/staging.migrated"
fi
echo "public tables: $(sql -Atc "select count(*) from information_schema.tables where table_schema = 'public'")"
echo "RLS policies:  $(sql -Atc "select count(*) from pg_policies where schemaname in ('public', 'storage')")"
echo "buckets:       $(sql -Atc "select string_agg(id || (case when public then ' (public)' else ' (private)' end), ', ' order by id) from storage.buckets")"

step "Application settings"
if [ -e "$ENV_FILE" ]; then
  echo "$ENV_FILE exists; left as is"
else
  read_supabase_env() {
    grep "^$1=" "$SUPABASE_DIR/.env" | head -n 1 | cut -d= -f2-
  }
  (
    umask 077
    {
      echo "DEPLOY_ENV=staging"
      echo "SITE_ADDRESS=${SITE_HOST}"
      echo "PUBLIC_SITE_URL=${PUBLIC_URL}"
      echo "SUPABASE_ANON_KEY=$(read_supabase_env ANON_KEY)"
      echo "SUPABASE_SERVICE_ROLE_KEY=$(read_supabase_env SERVICE_ROLE_KEY)"
      echo "SUPABASE_MEDIA_BUCKET=media"
      echo "PAYMENT_MODE=mock"
      echo "ROBOTS_TAG=noindex, nofollow"
    } > "$ENV_FILE"
  )
  echo "written $ENV_FILE (mode 600, staging, mock payments)"
fi

step "Root-owned compose file and deploy scripts"
install -o root -g root -m 644 "$HERE/docker-compose.yml" "$ROOT/app/docker-compose.yml"
install -o root -g root -m 755 "$HERE/server/owis-deploy-staging" /usr/local/sbin/owis-deploy-staging
install -o root -g root -m 755 "$HERE/server/owis-deploy-gate" /usr/local/sbin/owis-deploy-gate
echo "installed"

step "Deploy account: one sudo rule, one forced command"
sudoers_tmp="$(mktemp)"
cat > "$sudoers_tmp" << 'EOF'
# Managed by bootstrap-staging.sh. The deploy account may run one script as
# root, with these two forms only. The script validates its own arguments.
owisdeploy ALL=(root) NOPASSWD: /usr/local/sbin/owis-deploy-staging deploy *, /usr/local/sbin/owis-deploy-staging status
EOF
visudo -cf "$sudoers_tmp" > /dev/null
install -o root -g root -m 440 "$sudoers_tmp" /etc/sudoers.d/owis-deploy-staging
rm -f "$sudoers_tmp"

keys="/home/${DEPLOY_USER}/.ssh/authorized_keys"
[ -s "$keys" ] || {
  echo "no authorized_keys for $DEPLOY_USER" >&2
  exit 1
}
[ -e "${keys}.before-owis-gate" ] || cp -p "$keys" "${keys}.before-owis-gate"
keys_tmp="$(mktemp)"
awk -v prefix='command="/usr/local/sbin/owis-deploy-gate",restrict ' '
  /^[[:space:]]*(#|$)/ { print; next }
  /owis-deploy-gate/ { print; next }
  /^(ssh-|ecdsa-|sk-)/ { print prefix $0; next }
  { print "# disabled by bootstrap-staging.sh (unexpected options): " $0 }
' "$keys" > "$keys_tmp"
install -o "$DEPLOY_USER" -g "$(id -gn "$DEPLOY_USER")" -m 600 "$keys_tmp" "$keys"
rm -f "$keys_tmp"
echo "keys restricted to the gate: $(grep -c 'owis-deploy-gate' "$keys")"
echo "sudo rule: $(sudo -l -U "$DEPLOY_USER" | grep -c 'owis-deploy-staging') line(s); docker group member: $(id -nG "$DEPLOY_USER" | grep -qw docker && echo yes || echo no)"

step "First deployment"
/usr/local/sbin/owis-deploy-staging deploy "$(git -C "$REPO" rev-parse HEAD)"

step "Resource usage"
docker stats --no-stream --format 'table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}'
free -m
df -h / | tail -n 1

echo
echo "BOOTSTRAP_OK ${SITE_HOST}"
