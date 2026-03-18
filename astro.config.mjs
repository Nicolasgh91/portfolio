import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://escalatunegocioconia.com',
  integrations: [
    tailwind({ applyBaseStyles: false }),
    sitemap({
      // Filtrar rutas que no deben indexarse
      filter: (page) => !page.includes('/404'),
    }),
    mdx(),
  ],
});
