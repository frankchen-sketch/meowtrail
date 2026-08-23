import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import path from 'path';

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
    resolve: {
      alias: {
        '@lib': path.resolve('./src/lib'),
      },
    },
  },
});
