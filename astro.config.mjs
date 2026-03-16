import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // Replace with your actual domain once decided
  site: 'https://escalatunegocioconia.com',
  integrations: [
    tailwind({ applyBaseStyles: false }),
    sitemap(),
  ],
});
