import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  configFile: false,
  build: {
    lib: {
      entry: resolve('./src/lib/akari-engine.ts'),
      name: 'AkariEngine',
      formats: ['es'],
      fileName: 'akari-engine',
    },
    outDir: resolve('./dist'),
    emptyDir: false,
    rollupOptions: {
      output: {
        entryFileNames: 'akari-engine.js',
      },
    },
  },
});
