import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://escalatunegocioconia.com',
  integrations: [
    tailwind({ applyBaseStyles: false }),
    mdx(),
  ],
  vite: {
    build: {
      // CSP-005: la CSP en vercel.json es `script-src 'self' https://va.vercel-scripts.com`
      // (sin 'unsafe-inline'). Vite por defecto inlinea modulos < 4 KB como
      // <script type="module">...</script>, y esos bloques los bloquea la CSP.
      // Forzamos siempre emitir assets como archivos externos para que el
      // navegador los cargue desde /_astro/*.js (mismo origen, permitido por CSP).
      assetsInlineLimit: 0,
    },
  },
});