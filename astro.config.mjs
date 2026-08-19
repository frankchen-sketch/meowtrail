import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://meowtrail.org',
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      filter: (page) => !page.includes('/api/'),
    }),
  ],
  vite: {
    build: {
      // Keep puzzle engine in the bundle (it's client-side)
      rollupOptions: {
        output: {
          manualChunks: {
            'puzzle-engine': ['./src/lib/puzzle-engine.ts'],
          },
        },
      },
    },
  },
});
