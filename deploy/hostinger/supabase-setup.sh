#!/bin/sh
# Prepares a self-hosted Supabase project directory from the pinned official
# release, with fresh secrets and the OWIS override.
#
#   sh supabase-setup.sh <target-dir> <public-site-url>
#   sh supabase-setup.sh /opt/owis/supabase-staging https://staging.example.org
#
# Run once per environment. It refuses to touch a directory that already has a
# .env file, so existing secrets and data are never overwritten. Generated
# secrets are written to <target-dir>/.env only; nothing is printed.
set -eu

# Official release this setup was verified against. Upgrade deliberately.
SUPABASE_REF="self-hosted/v0.8.4"

TARGET_DIR="${1:?usage: supabase-setup.sh <target-dir> <public-site-url>}"
PUBLIC_URL="${2:?usage: supabase-setup.sh <target-dir> <public-site-url>}"
PUBLIC_URL="${PUBLIC_URL%/}"
HERE="$(cd "$(dirname "$0")" && pwd)"

case "$PUBLIC_URL" in
  http://* | https://*) ;;
  *)
    echo "public-site-url must start with http:// or https://" >&2
    exit 1
    ;;
esac

if [ -e "$TARGET_DIR/.env" ]; then
  echo "$TARGET_DIR is already initialised (.env exists); refusing to overwrite it." >&2
  exit 1
fi

for tool in git openssl sed; do
  command -v "$tool" > /dev/null 2>&1 || {
    echo "$tool is required." >&2
    exit 1
  }
done

workdir="$(mktemp -d)"
trap 'rm -rf "$workdir"' EXIT

# Only the docker/ directory of the (large) upstream repository is needed.
git clone --quiet --depth 1 --filter=blob:none --sparse \
  --branch "$SUPABASE_REF" https://github.com/supabase/supabase "$workdir/supabase"
git -C "$workdir/supabase" sparse-checkout set docker

mkdir -p "$TARGET_DIR"
cp -rf "$workdir/supabase/docker/." "$TARGET_DIR"
cd "$TARGET_DIR"

cp .env.example .env
chmod 600 .env
printf 'ref=%s\n' "$SUPABASE_REF" > .supabase-version

# Writes JWT_SECRET, ANON_KEY, SERVICE_ROLE_KEY, POSTGRES_PASSWORD,
# DASHBOARD_PASSWORD and the other secrets into .env. Its stdout lists every
# secret, so it is discarded.
sh utils/generate-keys.sh --update-env > /dev/null
rm -f .env.old

cp "$HERE/supabase.override.yml" docker-compose.owis.yml

set_env() {
  key="$1"
  value="$2"
  if grep -q "^${key}=" .env; then
    sed -i -e "s|^${key}=.*$|${key}=${value}|" .env
  else
    printf '%s=%s\n' "$key" "$value" >> .env
  fi
}

set_env COMPOSE_FILE "docker-compose.yml:docker-compose.owis.yml"
set_env SUPABASE_PUBLIC_URL "$PUBLIC_URL"
set_env API_EXTERNAL_URL "$PUBLIC_URL/auth/v1"
set_env SITE_URL "$PUBLIC_URL"
set_env ADDITIONAL_REDIRECT_URLS "$PUBLIC_URL/**"
# The site has admin accounts only; they are created with the service role.
set_env DISABLE_SIGNUP "true"
set_env ENABLE_ANONYMOUS_USERS "false"
set_env ENABLE_PHONE_SIGNUP "false"
# No outgoing mail is configured yet, so new accounts are confirmed directly.
# Configure SMTP_* and set this back to false before real users are moved.
set_env ENABLE_EMAIL_AUTOCONFIRM "true"

echo "Supabase project prepared in $TARGET_DIR (release $SUPABASE_REF)."
echo "Start it with: docker compose up -d --wait db auth rest storage api-gw"
