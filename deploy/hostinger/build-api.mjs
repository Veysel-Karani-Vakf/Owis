// Bundles the standalone API host (api/_server) into one file for the runtime
// image. esbuild is already installed as part of Vite, so nothing is added to
// package.json.
import { build } from 'esbuild';

await build({
  entryPoints: ['api/_server/index.ts'],
  outfile: 'dist-api/server.cjs',
  bundle: true,
  platform: 'node',
  target: 'node22',
  format: 'cjs',
  legalComments: 'none',
  logLevel: 'info',
});
