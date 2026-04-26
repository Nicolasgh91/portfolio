# FAQAccordion

**Ruta:** [`src/components/FAQAccordion.astro`](../../src/components/FAQAccordion.astro)

**Usado en:** [`src/pages/servicios.astro`](../../src/pages/servicios.astro)

## Props

Misma superficie que el bloque FAQ “nativo” de [`FaqSection`](./faq-section.md) **excepto** `accordionStyle`, `faqAnimatedRootId`: solo acordeón con `<details>` / `<summary>` (estilos `faq-item--native` en `tokens.css`).

| Prop                      | Tipo                      | Requerida | Descripción                                                                                                                                                                                                                                                     |
| ------------------------- | ------------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `entries`                 | `FaqItem[]`               | Sí        | Mismo shape que exporta `FaqSection.astro`.                                                                                                                                                                                                                     |
| `ctaHref`                 | `string`                  | No        | Default `#contacto`.                                                                                                                                                                                                                                            |
| `showSidebarCta`          | `boolean`                 | No        | Default `true`. Si es `false`, el grid superior pasa a una sola columna (`md:grid-cols-1`): el encabezado ocupa todo el ancho y **no queda columna vacía**; el listado de acordeones va debajo a ancho completo (p. ej. `/servicios`).                          |
| `eyebrowEs` / `eyebrowEn` | `string`                  | No        | Rótulo superior.                                                                                                                                                                                                                                                |
| `headingEs` / `headingEn` | `string`                  | No        | Título del bloque.                                                                                                                                                                                                                                              |
| `introEs` / `introEn`     | `string`                  | No        | Intro.                                                                                                                                                                                                                                                          |
| `class`                   | `string`                  | No        | Clases del contenedor raíz (p. ej. `!mt-0` para anular el `mt-10` por defecto).                                                                                                                                                                                 |
| `variant`                 | `'default' \| 'darkBand'` | No        | Default `default`. En `darkBand`, colores fijos (slate/orange) para el bloque sobre fondo oscuro; evita que, con `html.light`, los tokens claros rompan contraste en FAQ incrustada en `section-dark` (p. ej. [`/servicios`](../../src/pages/servicios.astro)). |

## Comportamiento

- CTA del sidebar (si `showSidebarCta`): `btn-primary btn-bounce` con flecha en `span.arrow` (ver [`btn-bounce.md`](./btn-bounce.md)).
- **Sin microdata** en el HTML; el FAQ estructurado para buscadores debe inyectarse en `<Fragment slot="head">` con `buildFaqPageJsonLd` (u otro helper) en la página que consume el componente.
- Chips de categoría si `entries.length > 8` (igual que FaqSection modo native).
- **`darkBand`:** borde exterior naranja suave, fondo `slate-900/95`, ítems del acordeón con bordes `white/10` y estados `open` con acento naranja; categorías usan clases Tailwind fijas en lugar de variables de tema.
- **i18n:** eyebrow, heading, intro, CTA, preguntas, respuestas y chips se resuelven por SSR con `localeFromPathname`; no depende de spans ocultos.

## SEO / QA

Ver guía [`docs/subsistemas/faq-jsonld-seo.md`](../subsistemas/faq-jsonld-seo.md) (tests `npm test`, checklist Rich Results en producción).

## Estado

Documentado
