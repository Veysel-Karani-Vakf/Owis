import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Public Supabase project values. The anon key is public by design (access is
// governed by Row Level Security), so it is safe to ship in the bundle as a
// fallback. Environment variables override these when provided.
const FALLBACK_URL = 'https://goyqlyrtclpywvolayzu.supabase.co';
const FALLBACK_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdveXFseXJ0Y2xweXd2b2xheXp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyMTY3MTQsImV4cCI6MjEwMjc5MjcxNH0.1XFsXrUFbfcMAVKrjO7M-WTDnGRN4QSHGDoiTJqSoIs';

const url = import.meta.env.VITE_SUPABASE_URL?.trim() || FALLBACK_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() || FALLBACK_ANON_KEY;

export const MEDIA_BUCKET = import.meta.env.VITE_SUPABASE_MEDIA_BUCKET || 'media';
export const isSupabaseConfigured = Boolean(url && anonKey);

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
