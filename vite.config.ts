import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// The production Supabase project. Only a Vercel build may fall back to it
// (see src/lib/supabase.ts). Every other build needs explicit VITE_SUPABASE_*
// values, and a staging build is refused if those values point at production.
const PRODUCTION_SUPABASE_REF = 'goyqlyrtclpywvolayzu';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const onVercel = Boolean(process.env.VERCEL);
  const supabaseUrl = (env.VITE_SUPABASE_URL ?? '').trim();
  const supabaseAnonKey = (env.VITE_SUPABASE_ANON_KEY ?? '').trim();

  if (command === 'build') {
    if (!onVercel && (!supabaseUrl || !supabaseAnonKey)) {
      throw new Error(
        'VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are required for builds outside Vercel. ' +
          'Refusing to fall back to the production Supabase project.',
      );
    }
    if (env.VITE_DEPLOY_ENV === 'staging' && supabaseUrl.includes(PRODUCTION_SUPABASE_REF)) {
      throw new Error('Staging builds must not point at the production Supabase project.');
    }
  }

  return {
    plugins: [react()],
    define: {
      __ALLOW_PROD_SUPABASE_FALLBACK__: JSON.stringify(onVercel),
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    server: {
      // Payment functions live in api/ and are served by `vercel dev` (default
      // port 3000). Plain `npm run dev` proxies /api there when it is running.
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:3000',
          changeOrigin: true,
        },
      },
    },
  };
});
