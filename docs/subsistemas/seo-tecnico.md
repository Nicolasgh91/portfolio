# SEO técnico

## Base global
- `src/layouts/Layout.astro` define:
  - `meta description`, `canonical`, `robots` con URL absoluta.
  - Open Graph base + Twitter card (alineados con canonical actual).
  - `hreflang` (`es`, `en`, `x-default`) con URLs ES/EN separadas.
  - JSON-LD global (`Person`, `ProfessionalService`).
  - `<link rel="sitemap" href="/sitemap-index.xml">`.

## JSON-LD por tipo
- Servicios: `src/pages/servicios.astro` inyecta `Service` graph en slot `head`.
- Artículo: `src/pages/blog/[slug].astro` inyecta:
  - `BreadcrumbList`
  - `TechArticle`
  - metas `article:*` (published_time, section, tags).

## Sitemap
- Fuente de verdad: `@astrojs/sitemap` en `astro.config.mjs`.
- Genera `sitemap-index.xml` + `sitemap-0.xml`.
- Incluye rutas ES y EN indexables (`/en`, `/en/services`, `/en/talent`, `/en/blog`, `/en/templates` y dinámicas EN de blog/templates).
- Excluye rutas de desarrollo vía `filter: (page) => !page.includes('/dev/')`.

## Robots y rastreo
- `public/robots.txt` publicado con:
  - `User-agent: *`
  - `Allow: /`
  - `Sitemap: https://escalatunegocioconia.com/sitemap-index.xml`

## Internacionalización indexable
- Configuración i18n en `astro.config.mjs`:
  - `defaultLocale: 'es'`
  - `locales: ['es', 'en']`
  - `routing.prefixDefaultLocale: false`
- Rutas EN activas en `src/pages/en/**`.
- El selector de idioma del nav usa navegación por URL (anchor con `href` a la ruta alterna), no mutación de contenido via JS.
- Navegación y footer resuelven enlaces internos por locale para reforzar descubrimiento de URLs EN.

## 404 y señales de calidad
- `src/pages/404.astro` agrega página de error dedicada.
- Build valida generación de `/404.html`.
- Auditoría de metadatos en build:
  - `title` únicos: OK.
  - `meta description` únicas: OK.

## Operativa Google Search Console (manual)
1. Crear propiedad de dominio `escalatunegocioconia.com`.
2. Verificar DNS (TXT) en proveedor del dominio.
3. Enviar sitemap: `https://escalatunegocioconia.com/sitemap-index.xml`.
4. Solicitar indexación semilla:
   - `/`
   - `/servicios`
   - `/en`
   - `/en/services`
5. Seguimiento:
   - Día 7: revisar `Rastreada - actualmente no indexada` y `Descubierta - actualmente no indexada`.
   - Día 14: repetir revisión y ajustar enlazado interno/señales on-page de URLs rezagadas.

## Estado
✅ Documentado
