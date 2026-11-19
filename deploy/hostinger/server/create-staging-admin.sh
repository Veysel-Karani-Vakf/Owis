#!/usr/bin/env bash
# Creates the admin account of the STAGING site. Run as root on the server:
#
#   bash /opt/owis/repo/deploy/hostinger/server/create-staging-admin.sh [email]
#
# The password is random, is written to a file only root can read, and is never
# printed. Read it with:  sudo cat /opt/owis/staging-admin.txt
# Change it after the first sign-in (account page of the dashboard).
set -euo pipefail

ROOT="/opt/owis"
ENV_FILE="$ROOT/staging.env"
OUT="$ROOT/staging-admin.txt"
GATEWAY="http://127.0.0.1:8000"
EMAIL="${1:-admin@staging.veysvakfi.org}"

[ "$(id -u)" -eq 0 ] || {
  echo "run as root" >&2
  exit 1
}
grep -qx 'DEPLOY_ENV=staging' "$ENV_FILE" || {
  echo "this script is for the staging environment only" >&2
  exit 1
}
[ ! -e "$OUT" ] || {
  echo "an admin account was already created; its details are in $OUT" >&2
  exit 1
}
case "$EMAIL" in
  *[!A-Za-z0-9@._+-]* | "")
    echo "unexpected characters in the email address" >&2
    exit 1
    ;;
esac

setting() {
  grep "^$1=" "$ENV_FILE" | head -n 1 | cut -d= -f2-
}
service_key="$(setting SUPABASE_SERVICE_ROLE_KEY)"
anon_key="$(setting SUPABASE_ANON_KEY)"
site_url="$(setting PUBLIC_SITE_URL)"
password="$(openssl rand -hex 12)"

created="$(curl -sS -X POST "$GATEWAY/auth/v1/admin/users" \
  -H "apikey: $service_key" -H "Authorization: Bearer $service_key" -H 'Content-Type: application/json' \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$password\",\"email_confirm\":true,\"app_metadata\":{\"role\":\"admin\"}}")"
user_id="$(printf '%s' "$created" | grep -o '"id":"[0-9a-f-]\{36\}"' | head -n 1 | cut -d'"' -f4)"
[ -n "$user_id" ] || {
  echo "the account could not be created:" >&2
  printf '%s\n' "$created" | head -c 300 >&2
  exit 1
}

# The dashboard also keeps an allow-list of admins.
docker exec -i supabase-db psql -h localhost -U postgres -d postgres -v ON_ERROR_STOP=1 -q \
  -c "insert into public.admin_users (user_id, email) values ('$user_id', '$EMAIL') on conflict do nothing"

(
  umask 077
  {
    echo "site:     $site_url"
    echo "email:    $EMAIL"
    echo "password: $password"
    echo "created:  $(date -u +%FT%TZ)"
  } > "$OUT"
)

signed_in="$(curl -sS -o /dev/null -w '%{http_code}' -X POST "$GATEWAY/auth/v1/token?grant_type=password" \
  -H "apikey: $anon_key" -H 'Content-Type: application/json' \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$password\"}")"

echo "Staging admin created: $EMAIL"
echo "Sign-in check: HTTP $signed_in"
echo "Password stored in $OUT (root only): sudo cat $OUT"
