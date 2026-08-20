import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  // Surface a clear message during development rather than a cryptic runtime error.
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in the environment.');
}

export const MEDIA_BUCKET = import.meta.env.VITE_SUPABASE_MEDIA_BUCKET || 'media';

export const supabase = createClient(url ?? '', anonKey ?? '', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: 'vkv-admin-auth',
  },
});

export const isSupabaseConfigured = Boolean(url && anonKey);
