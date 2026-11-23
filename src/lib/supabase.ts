import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// The production Supabase project. Its anon key is public by design (access is
// governed by Row Level Security), so it may live in the bundle, but only as a
// fallback where the build explicitly allows it: Vercel builds (the current
// production host) and the local Vite dev server. Every other build (Docker,
// the Hostinger VPS, CI) must receive VITE_SUPABASE_URL and
// VITE_SUPABASE_ANON_KEY; vite.config.ts fails such a build without them.
const PRODUCTION_PROJECT_REF = 'goyqlyrtclpywvolayzu';
const FALLBACK_URL = `https://${PRODUCTION_PROJECT_REF}.supabase.co`;
const FALLBACK_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdveXFseXJ0Y2xweXd2b2xheXp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyMTY3MTQsImV4cCI6MjEwMjc5MjcxNH0.1XFsXrUFbfcMAVKrjO7M-WTDnGRN4QSHGDoiTJqSoIs';

const allowProductionFallback = __ALLOW_PROD_SUPABASE_FALLBACK__ || import.meta.env.DEV;

const url = import.meta.env.VITE_SUPABASE_URL?.trim() || (allowProductionFallback ? FALLBACK_URL : '');
const anonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() || (allowProductionFallback ? FALLBACK_ANON_KEY : '');

// A staging build must never talk to the production project, even if its
// environment is pointed there by mistake.
if (import.meta.env.VITE_DEPLOY_ENV === 'staging' && url.includes(PRODUCTION_PROJECT_REF)) {
  throw new Error('Staging build refuses to use the production Supabase project.');
}

export const MEDIA_BUCKET = import.meta.env.VITE_SUPABASE_MEDIA_BUCKET || 'media';
export const isSupabaseConfigured = Boolean(url && anonKey);
/** Base URL of the Supabase instance this build talks to (no trailing slash). */
export const SUPABASE_URL = url.replace(/\/+$/, '');

const clientOptions = {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: 'vkv-admin-auth',
  },
};

function createMissingSupabaseClient(): SupabaseClient {
  const message = 'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local.';
  const throwMissingConfig = () => {
    throw new Error(message);
  };

  return new Proxy(
    {},
    {
      get() {
        return new Proxy(throwMissingConfig, {
          apply: throwMissingConfig,
          get: throwMissingConfig,
        });
      },
    },
  ) as SupabaseClient;
}

export const supabase = isSupabaseConfigured
  ? createClient(url!, anonKey!, clientOptions)
  : createMissingSupabaseClient();
