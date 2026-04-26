# Plantillas

Páginas generadas en Astro SSG:

- Índice: [`src/pages/plantillas.astro`](../src/pages/plantillas.astro)
- Ficha por slug: [`src/pages/plantillas/[slug].astro`](../src/pages/plantillas/[slug].astro)

## Fuente de datos

- Plantillas: [`src/data/landing-templates.ts`](../src/data/landing-templates.ts) (`VERTICAL_ORDER`, `VERTICAL_LABELS`, lista parseada con Zod).
- Schema: [`src/schemas/landing-template.ts`](../src/schemas/landing-template.ts).
- Demo URL: [`src/lib/resolve-template-demo-url.ts`](../src/lib/resolve-template-demo-url.ts) (no usar `import.meta.env` en `src/data/*.ts`).
- Planes: [`src/data/pricing-plans.ts`](../src/data/pricing-plans.ts) + [`src/schemas/pricing-plan.ts`](../src/schemas/pricing-plan.ts).

## Layout y secciones del índice (orden)

1. Hero — `h1`, subtítulo.
2. Filtro por vertical — pills (`.taxonomy__pill` en [`tokens.css`](../src/styles/tokens.css)); botones con `data-filter`; script inline en la página (no reemplazar por `TaxonomyFilter` sin beneficio; ver deuda P3 en [`deuda-tecnica.md`](deuda-tecnica.md)).
3. Carrusel — `scroll-snap`, track con `px-4` en mobile y flechas: desktop `btn-secondary btn-secondary--sm btn-secondary--icon-only catalog-carousel__nav flex-shrink-0` a los lados (`btn-prev` / `btn-next`); mobile fila bajo el track (`btn-prev-mobile` / `btn-next-mobile`); mismo scroll en script. Tarjetas [`PlantillaCarouselCard`](componentes/plantilla-carousel-card.md); miniaturas vía [`template-carousel-images.ts`](../src/data/template-carousel-images.ts) y `src/assets/templates/`. **Orden del listado:** un solo array `sortedTemplatesWithDemo` en la página: primero plantillas con demo efectiva (`Boolean(resolvedDemoUrl)`), luego `priority` descendente y título según locale (`title` / `titleEn`); misma fuente para el `.map` del carrusel y para el JSON-LD (sin segundo `.sort()`).
4. Social proof — tres métricas.
5. Planes — [`PricingCard`](componentes/pricing-card.md) con CTA desde datos del plan.
6. FAQ — [`FaqSection`](componentes/faq-section.md), `showSidebarCta={false}`.
7. Cierre — bloque informativo.

## Ficha `/plantillas/:slug`

- `getStaticPaths` desde `landingTemplates`.
- `h1` título de la plantilla; `h2` para bloque “Incluye”.
- JSON-LD `WebPage` en `slot="head"` + `link rel="canonical"`.
- Demo vía `resolveTemplateDemoUrl`; si no hay demo, badge “Próximamente”.

## URLs de demo

`PUBLIC_TEMPLATE_PYME_URL` (default template-pyme en prod); rutas `/` relativas se resuelven contra esa base. Ver [`docs/subsistemas/landing-templates.md`](subsistemas/landing-templates.md).

## Estilos

- Sin `<style>` local en estas páginas; tokens + Tailwind.
- Carrusel: `.catalog-scroll-hide`, `.plantilla-card[data-filtered]` en `tokens.css`.

## SEO

- `title` / `description` / OG vía [`Layout`](../src/layouts/Layout.astro).
- Índice: JSON-LD `ItemList` solo para plantillas con `status === 'available'`; `position` es 1-indexed en el orden del array `sortedTemplatesWithDemo` (alineado al orden visual del carrusel con filtro “Todos”); cada `url` es `${siteUrl}/plantillas/${slug}` (ruta canónica de la ficha).
- Sitemap: índice + cada `/plantillas/:slug` en [`src/pages/sitemap.xml.ts`](../src/pages/sitemap.xml.ts).

## i18n

Textos resueltos por locale con pares `data-es` / `data-en` donde aplica; labels de vertical siempre desde `VERTICAL_LABELS` en datos.

## Estado

Documentado.
