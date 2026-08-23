/**
 * Post-build: compile akari-engine.ts to JS and copy to dist/.
 */

import { readFileSync, writeFileSync, existsSync, copyFileSync } from 'fs';
import { resolve } from 'path';

// Use esbuild from node_modules
const esbuildPath = resolve('./node_modules/.pnpm/esbuild@0.25.12/node_modules/esbuild/lib/main.js');
const esbuild = await import(esbuildPath);

const src = readFileSync(resolve('./src/lib/akari-engine.ts'), 'utf-8');
const result = esbuild.transformSync(src, {
  loader: 'ts',
  format: 'esm',
  target: 'es2020',
});

// Remove export keywords (make functions global for <script src> loading)
let code = result.code.replace(/^export /gm, '');

writeFileSync(resolve('./public/akari-engine.js'), code);
console.log('[bundle-engine] Compiled akari-engine.ts → public/akari-engine.js (' + code.length + ' chars)');

// Copy to dist if it exists
const distFile = resolve('./dist/akari-engine.js');
if (existsSync(resolve('./dist'))) {
  copyFileSync(resolve('./public/akari-engine.js'), distFile);
  console.log('[bundle-engine] Copied to dist/akari-engine.js');
}
