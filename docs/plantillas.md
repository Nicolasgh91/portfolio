# Plantillas

Páginas generadas en Astro SSG:

- Índice: [`src/pages/plantillas.astro`](../src/pages/plantillas.astro)
- Ficha por slug: [`src/pages/plantillas/[slug].astro`](../src/pages/plantillas/[slug].astro)

## Fuente de datos

- Plantillas: [`src/data/landing-templates.ts`](../src/data/landing-templates.ts) (`VERTICAL_ORDER`, `VERTICAL_LABELS`, lista parseada con Zod).
- Schema: [`src/schemas/landing-template.ts`](../src/schemas/landing-template.ts).
- Demo URL: [`src/lib/resolve-template-demo-url.ts`](../src/lib/resolve-template-demo-url.ts) (no usar `import.meta.env` en `src/data/*.ts`).
- Planes: [`src/data/pricing-plans.ts`](../src/data/pricing-plans.ts) + [`src/schemas/pricing-plan.ts`](../src/schemas/pricing-plan.ts) (SSOT separado de `pricing.json`; ver [`ADR-005`](./decisiones/adr-005-pricing-ssot-por-dominio.md)).

## Layout y secciones del índice (orden)

**Contenedor post-hero:** el bloque principal mantiene `.page-container` estándar y agrega `templates-index-stack` para aplicar solo ritmo vertical entre bandas. En [`tokens.css`](../src/styles/tokens.css), `templates-index-stack > .templates-index-section` define `padding-block` con `clamp` (~120–160px de respiro acumulado entre contenidos contiguos en desktop; menor en viewport estrecho), sin reducir `max-width` ni incrementar padding lateral respecto al contenedor base.

1. Hero — bloque `templates-hero` en [`src/pages/plantillas.astro`](../src/pages/plantillas.astro), alineado al patrón visual del hero de Home y marca (`PageHeroSection` / `SectionLabel`):
   - Fondo con `<Image />` de Astro usando [`src/assets/templates/hero_templates-v2.webp`](../src/assets/templates/hero_templates-v2.webp), envuelto en `.templates-hero__bg-image` con **`mask-image`** / **`-webkit-mask-image`** (gradiente lineal hacia transparencia inferior) para fusionar con el `background` sin depender solo de colores fijos.
   - Gradiente vertical suave encima (`from-slate-950/…` hacia transparente) más ruido SVG y glow; **sin** segunda capa inferior `bg-gradient-to-t` (la máscara sustituye ese refuerzo).
   - Línea superior sobre el `h1` con dos `span` usando utilitarias del patrón `SectionLabel` (`block text-xs font-bold uppercase tracking-widest text-[var(--accent-text)]`), sin clases custom de kicker en CSS.
   - `h1` y descripción mantienen resaltados con `<em class="not-italic text-[var(--accent-text)]">` siguiendo el patrón de Talento/Servicios. Estos bloques no usan `data-es/data-en` para evitar que el script de idioma reemplace el HTML inline y elimine los resaltados.
   - Sin botones CTA en el hero (se prioriza composición editorial + bloque visual).
   - Columna visual derecha con stack de mockups decorativos solo en desktop (`.templates-hero__visual`).
   - Proporción horizontal reforzada en desktop (contenedor ancho + relación copy/mockup más cercana al hero Home) y copy centrado verticalmente en viewport.
   - Sin chips/pills y sin bloque de métricas en el hero.
2. Filtro por vertical — pills (`.taxonomy__pill` en [`tokens.css`](../src/styles/tokens.css)); botones con `data-filter`; script inline en la página (no reemplazar por `TaxonomyFilter` sin beneficio; ver deuda P3 en [`deuda-tecnica.md`](deuda-tecnica.md)). Separación mayor entre bloque de titular (label + `h2` + párrafo) y filtros (`mt-10` sobre la taxonomy).
3. Carrusel — `scroll-snap`, track `#catalog-carousel` con **gap** `gap-8` / `md:gap-10`, `px-4` en mobile y flechas: desktop `btn-secondary btn-secondary--sm btn-secondary--icon-only catalog-carousel__nav flex-shrink-0` a los lados (`btn-prev` / `btn-next`); mobile fila bajo el track (`btn-prev-mobile` / `btn-next-mobile`); mismo scroll en script. Tarjetas [`PlantillaCarouselCard`](componentes/plantilla-carousel-card.md); miniaturas vía [`template-carousel-images.ts`](../src/data/template-carousel-images.ts) y `src/assets/templates/`. **Orden del listado:** un solo array `sortedTemplatesWithDemo` en la página: primero plantillas con demo efectiva (`Boolean(resolvedDemoUrl)`), luego `priority` descendente y título según locale (`title` / `titleEn`); misma fuente para el `.map` del carrusel y para el JSON-LD (sin segundo `.sort()`).
4. Planes — grid con `gap-8` / `md:gap-10` y `mt-12` tras el titular; [`PricingCard`](componentes/pricing-card.md) (pitch y features; sin CTA en tarjeta), sin mostrar precio en UI.
5. FAQ — [`FaqSection`](componentes/faq-section.md), `showSidebarCta={false}`.
6. Cierre — bloque informativo.

## Ficha `/plantillas/:slug`

- `getStaticPaths` desde `landingTemplates`.
- `h1` título de la plantilla; `h2` para bloque “Incluye”.
- JSON-LD `WebPage` en `slot="head"` + `link rel="canonical"`.
- Demo vía `resolveTemplateDemoUrl`; si no hay demo, badge “Próximamente”.

## URLs de demo

`PUBLIC_TEMPLATE_PYME_URL` (default template-pyme en prod); rutas `/` relativas se resuelven contra esa base. Ver [`docs/subsistemas/landing-templates.md`](subsistemas/landing-templates.md).

## Estilos

- Sin `<style>` local en estas páginas; tokens + Tailwind.
- Índice: modificadores `.page-container--templates-index` y `.templates-index-section` en [`tokens.css`](../src/styles/tokens.css) (ver arriba).
- Titulares de sección: label con `mb-3`; párrafo bajo `h2` con `mt-4` / `md:mt-5` donde aplica; bloque CTA final alinea label/`h2`/p con más margen entre niveles.
- Carrusel: `.catalog-scroll-hide`, `.plantilla-card[data-filtered]` en `tokens.css`.

## SEO

- `title` / `description` / OG vía [`Layout`](../src/layouts/Layout.astro).
- Índice: JSON-LD `ItemList` solo para plantillas con `status === 'available'`; `position` es 1-indexed en el orden del array `sortedTemplatesWithDemo` (alineado al orden visual del carrusel con filtro “Todos”); cada `url` es `${siteUrl}/plantillas/${slug}` (ruta canónica de la ficha).
- Planes: JSON-LD adicional de tipo `Service` con `offers` (uno por plan) para describir el bloque comercial de `/plantillas` sin duplicar entidades del catálogo.
- Sitemap: índice + cada `/plantillas/:slug` en [`src/pages/sitemap.xml.ts`](../src/pages/sitemap.xml.ts).

## i18n

Textos resueltos por locale con pares `data-es` / `data-en` donde aplica; labels de vertical siempre desde `VERTICAL_LABELS` en datos.

## Estado

Documentado.
