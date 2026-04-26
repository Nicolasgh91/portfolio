# PlantillaCarouselCard

Tarjeta del carrusel del catálogo de plantillas.

**Archivo:** [`src/components/PlantillaCarouselCard.astro`](../../src/components/PlantillaCarouselCard.astro)

## Props

| Prop              | Tipo              | Descripción                                   |
| ----------------- | ----------------- | --------------------------------------------- |
| `template`        | `LandingTemplate` | Datos validados (Zod), incl. `status`         |
| `resolvedDemoUrl` | `string \| null`  | URL final de demo; `null` si no hay `demoUrl` |

## Estructura

- `<article class="plantilla-card">` con `data-vertical`, `data-filtered`, `data-demo-available`, `data-status`.
- Zona superior `aspect-video`: si hay asset para `template.slug` en [`getTemplateCarouselImage`](../../src/data/template-carousel-images.ts), se renderiza `<Image />` de `astro:assets` (800×450, `object-cover`, `loading="lazy"`, `alt=""` — zona decorativa con `aria-hidden` en el contenedor). Si no hay mapeo, **fallback** SVG inline sobre el mismo gradiente de fondo.
- Badge de vertical desde **`VERTICAL_LABELS`** en [`landing-templates.ts`](../../src/data/landing-templates.ts) — no hardcodear labels en el componente.
- `h3` título, descripción `line-clamp-2`.
- **Sin precio en UI** (`priceLabel` no se renderiza).
- CTAs:
  - `status === 'coming_soon'`: texto “Próximamente” / “Coming soon”, tarjeta atenuada.
  - `available` + demo: enlace “Ver demo” + flecha en `span.arrow`, patrón [`btn-bounce`](./btn-bounce.md) (externo, `rel="noopener noreferrer"`). Si la demo interna apunta a `/servicios`, se localiza a `/en/services` en rutas EN.
  - `available` sin demo: enlace “Ver ficha” + flecha, mismo patrón, a `/plantillas/{slug}` o `/en/templates/{slug}` según locale.

## Estilo y contraste

- Variantes `cardBackground`: `dark`, `light`, `warm` — colores de texto fijos por variante para WCAG.
- Anchos: `w-[78vw] sm:w-[60vw] md:w-[340px] lg:w-[360px]` (`snap-start shrink-0`) para peek en mobile; desktop sin cambios de intención.
- Hover: `hover:-translate-y-1 hover:shadow-orange-500/10`, `transition-all duration-200 ease-out` (sin `hover:scale`).

## i18n

Título, descripción, badge y CTAs se renderizan según `localeFromPathname`; `data-es` / `data-en` se conservan cuando aplica para el toggle global.

## Orden en el índice `/plantillas`

El padre ordena `sortedTemplatesWithDemo` antes de renderizar: primero entradas con demo resuelta (`Boolean(resolvedDemoUrl)`), luego `priority` y título. El carrusel y el JSON-LD `ItemList` consumen ese mismo orden.

## Filtrado

El script de la página pone `data-filtered="true"` en tarjetas ocultas por filtro; estilos en [`tokens.css`](../../src/styles/tokens.css).

## Estado

Documentado
