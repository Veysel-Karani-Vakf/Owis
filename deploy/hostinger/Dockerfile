# syntax=docker/dockerfile:1
#
# Images for the Hostinger VPS. Build context is the repository root:
#   docker build -f deploy/hostinger/Dockerfile --target web .
#   docker build -f deploy/hostinger/Dockerfile --target api .
#
# Both targets share one dependency layer, so `npm ci` runs once.

FROM node:24-bookworm-slim AS deps
WORKDIR /app
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
COPY package.json package-lock.json ./
RUN npm ci

# --- API: the functions in api/ bundled into a single file -------------------
FROM deps AS build-api
COPY api ./api
COPY deploy/hostinger/build-api.mjs ./deploy/hostinger/build-api.mjs
RUN node deploy/hostinger/build-api.mjs

# --- Web: the Vite build -----------------------------------------------------
# The Supabase values are public (URL + anon key) and are compiled into the
# bundle. vite.config.ts refuses to build without them, and refuses a staging
# build that points at the production project.
FROM deps AS build-web
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_SUPABASE_MEDIA_BUCKET=media
ARG VITE_DEPLOY_ENV=staging
ENV VITE_SUPABASE_URL=${VITE_SUPABASE_URL} \
    VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY} \
    VITE_SUPABASE_MEDIA_BUCKET=${VITE_SUPABASE_MEDIA_BUCKET} \
    VITE_DEPLOY_ENV=${VITE_DEPLOY_ENV}
COPY . .
RUN npm run build

# --- Pictures shipped with the site: lighter files and WebP copies -----------
# public/ holds hundreds of pictures, many of them over 1 MB. This stage makes
# lighter files (same names) and WebP copies of them; see lighter-pictures.sh.
# Only public/ comes into it, so the work is redone only when a picture there
# changes, not on every deployment.
FROM alpine:3.22 AS pictures
RUN apk add --no-cache findutils imagemagick imagemagick-jpeg imagemagick-webp
COPY deploy/hostinger/lighter-pictures.sh /usr/local/bin/lighter-pictures
COPY public /in
RUN sh /usr/local/bin/lighter-pictures /in /out

# --- Runtime: API ------------------------------------------------------------
FROM node:24-alpine AS api
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build-api /app/dist-api/server.cjs ./server.cjs
USER node
EXPOSE 3000
HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/api/healthz > /dev/null || exit 1
CMD ["node", "server.cjs"]

# --- Runtime: web (Caddy serves the SPA and fronts the API and Supabase) ------
FROM caddy:2-alpine AS web
COPY deploy/hostinger/Caddyfile /etc/caddy/Caddyfile
COPY --from=build-web /app/dist /srv
# The lighter pictures replace the originals Vite copied from public/.
COPY --from=pictures /out/ /srv/
HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8081/healthz > /dev/null || exit 1
