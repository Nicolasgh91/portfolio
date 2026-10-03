# FaqSection

**Ruta:** [`src/components/FaqSection.astro`](../../src/components/FaqSection.astro)

**Usado en:** [`src/pages/servicios.astro`](../../src/pages/servicios.astro) (`variant="darkBand"`, `idPrefix="services-faq"`) y [`src/pages/plantillas.astro`](../../src/pages/plantillas.astro) (`idPrefix="templates-faq"`, `singleOpen`). Las rutas `/en/services` y `/en/templates` reexportan esas páginas.

Bloque FAQ completo: eyebrow, heading, intro, CTA lateral opcional y el acordeón. El acordeón **no** se implementa acá: se delega en [`FaqAccordion`](./faq-accordion.md), la fuente única.

## Props

| Prop                      | Tipo                      | Requerida | Descripción                                                                                                   |
| ------------------------- | ------------------------- | --------- | ------------------------------------------------------------------------------------------------------------- |
| `entries`                 | `FaqItem[]`               | Sí        | Shape `FaqItem` de [`faq-taxonomy.ts`](../../src/lib/faq-taxonomy.ts).                                        |
| `idPrefix`                | `string`                  | Sí        | Determinista y único por página. Heading: `{idPrefix}-heading` (para `aria-labelledby`); se pasa al acordeón. |
| `ctaHref`                 | `string`                  | No        | Href del CTA lateral; default `#contacto`. Solo se usa si `showSidebarCta`.                                   |
| `showSidebarCta`          | `boolean`                 | No        | Default `true`. En `false` se oculta el bloque lateral y el encabezado ocupa una columna.                     |
| `eyebrowEs` / `eyebrowEn` | `string`                  | No        | Rótulo superior.                                                                                              |
| `headingEs` / `headingEn` | `string`                  | No        | Título del bloque.                                                                                            |
| `introEs` / `introEn`     | `string`                  | No        | Párrafo introductorio.                                                                                        |
| `class`                   | `string`                  | No        | Clases extra en el contenedor raíz (p. ej. `!mt-0`).                                                          |
| `singleOpen`              | `boolean`                 | No        | Default `false`. Se pasa a `FaqAccordion` (un ítem abierto a la vez).                                         |
| `defaultOpen`             | `number \| null`          | No        | Default `0` (primer ítem abierto).                                                                            |
| `variant`                 | `'default' \| 'darkBand'` | No        | `darkBand`: paleta fija slate/naranja sobre fondos oscuros, sin depender de `html.light`.                     |

## Comportamiento

- Chips de categoría si `entries.length > FAQ_TAG_THRESHOLD` (8).
- CTA del sidebar: `btn-primary btn-bounce` con flecha en `span.arrow` (ver [`btn-bounce.md`](./btn-bounce.md)).
- Sin JS propio ni microdata. El JSON-LD `FAQPage` lo inyecta la página con `buildFaqPageJsonLd`.

## i18n

- Contenido resuelto por SSR con `localeFromPathname`; `data-es` / `data-en` se conservan para el controlador global de idioma.

## Deuda técnica conocida

- `FaqItem` duplica el shape del schema Zod en `config.ts`: mantenerlos alineados.

## SEO / QA

[`docs/subsistemas/faq-jsonld-seo.md`](../subsistemas/faq-jsonld-seo.md).

## Estado

Documentado
