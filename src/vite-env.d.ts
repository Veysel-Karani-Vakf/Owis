/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PARTICIPATE_FORM_ENDPOINT?: string;
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_SUPABASE_MEDIA_BUCKET?: string;
  readonly VITE_DEPLOY_ENV?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/**
 * Set by vite.config.ts. True only for builds on Vercel, the one host where
 * falling back to the production Supabase project is still allowed.
 */
declare const __ALLOW_PROD_SUPABASE_FALLBACK__: boolean;
