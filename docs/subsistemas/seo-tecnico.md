# SEO técnico

## Base global
- `src/layouts/Layout.astro` define:
  - `meta description`, `canonical`, `robots`.
  - Open Graph base + Twitter card.
  - `hreflang` (`es`, `en`, `x-default`).
  - JSON-LD global (`Person`, `ProfessionalService`).
  - CSP por meta (`SEC-005`).

## JSON-LD por tipo
- Servicios: `src/pages/servicios.astro` inyecta `Service` graph en slot `head`.
- Artículo: `src/pages/blog/[slug].astro` inyecta:
  - `BreadcrumbList`
  - `TechArticle`
  - metas `article:*` (published_time, section, tags).

## Sitemap
- `src/pages/sitemap.xml.ts` genera:
  - estáticas (`/`, `/servicios`, `/talento`, `/blog`, ofertas)
  - blog por slug
  - categorías
  - tags
- Usa `priority` de frontmatter en posts.

## Convenciones operativas
- Un solo `h1` por ruta.
- Rutas dinámicas de taxonomía con `getStaticPaths`.
- Página dev `component-scripts-audit` marcada `noindex,nofollow`.

## Gaps / deuda
- `projects` se consulta en sitemap pero hoy no se usa en XML.
- `hreflang` usa misma URL canónica para ES/EN; no hay rutas locales separadas.

## Estado
✅ Documentado
