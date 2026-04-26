# FaqSection

**Ruta:** [`src/components/FaqSection.astro`](../../src/components/FaqSection.astro)

**Usado en:** [`src/pages/plantillas.astro`](../../src/pages/plantillas.astro) (modo animado, CTA lateral según props).

**No usado en:** [`src/pages/servicios.astro`](../../src/pages/servicios.astro) — allí el FAQ del catálogo es [`FAQAccordion`](./faq-accordion.md) + **JSON-LD** en `slot="head"`.

## Props

| Prop                      | Tipo                       | Requerida | Descripción                                                                                                                                                                                                                                                           |
| ------------------------- | -------------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `entries`                 | `FaqItem[]`                | Sí        | Array alineado a la forma `FaqItem` (ver `export interface FaqItem` en el mismo archivo).                                                                                                                                                                             |
| `ctaHref`                 | `string`                   | No        | Href del CTA lateral; default `#contacto`. Solo se usa si `showSidebarCta` es true.                                                                                                                                                                                   |
| `showSidebarCta`          | `boolean`                  | No        | Default `true`. En `false`, oculta el bloque lateral para no duplicar conversión en páginas como el catálogo.                                                                                                                                                         |
| `eyebrowEs` / `eyebrowEn` | `string`                   | No        | Rótulo superior; defaults iguales al copy histórico de `/servicios`.                                                                                                                                                                                                  |
| `headingEs` / `headingEn` | `string`                   | No        | Título del bloque FAQ.                                                                                                                                                                                                                                                |
| `introEs` / `introEn`     | `string`                   | No        | Párrafo introductorio bajo el título.                                                                                                                                                                                                                                 |
| `class`                   | `string`                   | No        | Clases extra en el contenedor raíz (p. ej. `!mt-0` si el padre ya define margen).                                                                                                                                                                                     |
| `accordionStyle`          | `'native'` \| `'animated'` | No        | Default `native`. `native`: `<details>` sin JS. `animated`: botones + panel con **CSS Grid** `grid-template-rows: 0fr` → `1fr`; un solo ítem abierto; script del componente acotado a nodos con `data-faq-animated-root` (sin listeners globales fuera de cada root). |
| `faqAnimatedRootId`       | `string`                   | No        | Default `faq-animated-root`. Id del contenedor del listado en modo `animated` (scope del script; evita listeners globales fuera del bloque).                                                                                                                          |

## Comportamiento

### Modo `native` (default)

- Lista de `<details class="faq-item faq-item--native">`; primera entrada abierta por defecto.
- Estilos de `summary` en [`tokens.css`](../../src/styles/tokens.css) bajo `details.faq-item--native`.

### Modo `animated`

- Ítems: `div.faq-item.faq-item--animated` con `button.faq-q`, panel `.faq-answer-panel` (grid 0fr/1fr) e ícono `.faq-icon` (texto `+`).
- Estilos en [`tokens.css`](../../src/styles/tokens.css) (`@layer components`): una sola propiedad `transition` en `.faq-icon` para `transform`, `border-color`, `background-color` y `color`. Con `.faq-item--animated.open`, el ícono alinea borde/fondo/color al modo `native` y `rotate(45deg)`.
- `prefers-reduced-motion: reduce`: `transition: none` sobre `.faq-icon`; los estilos de `.open` se aplican igual.
- El `<script>` vive al **final del componente** (fuera del JSX condicional) para compatibilidad con el formateador; solo actúa sobre `document.querySelectorAll('[data-faq-animated-root]')` (si no hay modo animado, no hay nodos y no hace nada).
- **Sin microdata** (`itemscope` / `itemprop`) en el HTML; la página debe aportar **JSON-LD** `FAQPage` en el head si se requiere Rich Results (p. ej. `plantillas.astro` con `buildFaqPageJsonLd`).
- Botones con `aria-expanded` sincronizado al abrir/cerrar (un panel abierto a la vez).

Si `entries.length > FAQ_TAG_THRESHOLD` (8), en modo `native` se muestran chips de categoría por ítem (no en el markup animado del catálogo de plantillas, donde el umbral no se supera).

## i18n

- El contenido visible se resuelve en SSR con `localeFromPathname` para que `/en/*` emita headings, preguntas, respuestas y CTA en inglés desde el HTML inicial.
- Los atributos `data-es` / `data-en` se conservan como metadatos para el controlador global de idioma.

## Decisiones de diseño

- CTA lateral (cuando `showSidebarCta`): enlace con `btn-primary btn-bounce w-fit font-medium` y flecha en `span.arrow` (ver [`btn-bounce.md`](./btn-bounce.md)).
- **`native`:** sin JS para abrir/cerrar; accesibilidad nativa del navegador.
- **`animated`:** JS mínimo e inline; animación con grid en lugar de `max-height` fijo.
- El catálogo de plantillas usa `showSidebarCta={false}`, `accordionStyle="animated"` y `faqAnimatedRootId="faq-plantillas"`.

## Deuda técnica conocida

- `FaqItem` duplica el shape del schema Zod en `config.ts`: mantener alineados si cambia el frontmatter.

## SEO / QA

Guía de JSON-LD, tests y Rich Results manual: [`docs/subsistemas/faq-jsonld-seo.md`](../subsistemas/faq-jsonld-seo.md).

## Estado

Documentado
