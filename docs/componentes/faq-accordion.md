# FaqAccordion

**Ruta:** [`src/components/FaqAccordion.astro`](../../src/components/FaqAccordion.astro)

**Fuente única del acordeón FAQ.** Cualquier cambio visual o de comportamiento se hace acá y llega a todas las instancias.

**Usado en:**

| Ruta                                             | Vía                                           | `idPrefix`        | Config                                |
| ------------------------------------------------ | --------------------------------------------- | ----------------- | ------------------------------------- |
| `/servicios`, `/en/services`                     | [`FaqSection`](./faq-section.md) (`darkBand`) | `services-faq`    | primero abierto, varios abiertos      |
| `/plantillas`, `/en/templates`                   | [`FaqSection`](./faq-section.md)              | `templates-faq`   | primero abierto, **`singleOpen`**     |
| `/oferta/hub-creadores`, `/en/offer/creator-hub` | directo                                       | `creator-hub-faq` | `defaultOpen={null}` (todos cerrados) |

## Props

| Prop          | Tipo                      | Requerida | Default   | Descripción                                                                                                                                                                        |
| ------------- | ------------------------- | --------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `items`       | `FaqAccordionItem[]`      | Sí        | —         | `{ question, questionEn, answer, answerEn, category? }` ([`faq-taxonomy.ts`](../../src/lib/faq-taxonomy.ts)). `FaqItem` es compatible.                                             |
| `idPrefix`    | `string`                  | Sí        | —         | Determinista y único por página. Genera `id={idPrefix}` en la raíz, `{idPrefix}-item-{i}` por ítem y el grupo `name` si `singleOpen`. Nunca usar valores aleatorios ni timestamps. |
| `variant`     | `'default' \| 'darkBand'` | No        | `default` | `darkBand`: paleta fija slate/naranja para fondos oscuros; no depende de `html.light`.                                                                                             |
| `showTags`    | `boolean`                 | No        | `false`   | Chip de categoría por ítem (requiere `category`). `FaqSection` lo activa con más de 8 entradas.                                                                                    |
| `defaultOpen` | `number \| null`          | No        | `0`       | Índice abierto en el HTML inicial; `null` = todos cerrados.                                                                                                                        |
| `singleOpen`  | `boolean`                 | No        | `false`   | Un solo ítem abierto a la vez, mediante el atributo nativo `name` de `<details>`.                                                                                                  |

## Comportamiento

- Marcado: `<details class="faq-accordion__item">` > `<summary>` (pregunta + ícono) + panel con la respuesta. **Sin `<script>`**: apertura, foco, estado expandido y exclusividad los resuelve el navegador.
- Animación CSS en [`tokens.css`](../../src/styles/tokens.css) (`.faq-accordion*`, `@layer components`):
  - altura con `::details-content` + `grid-template-rows: 0fr → 1fr` y `content-visibility … allow-discrete`, para animar también el cierre;
  - la respuesta aparece con `opacity` + `translateY(-4px)`;
  - ícono SVG: el trazo vertical rota 90° y el "+" pasa a "−"; el círculo pasa de borde a relleno con el acento.
- Navegadores sin `::details-content`: abren y cierran al instante, sin animación (`@supports`).
- Movimiento reducido: `@media (prefers-reduced-motion: reduce)` anula las transiciones; la preferencia del panel de accesibilidad (`:root.no-motion`) ya la cubre `controllers.js` con `transition: none !important` global.

## Accesibilidad

- `<summary>` es el control nativo: se activa con Tab, Enter y Espacio, y el lector de pantalla anuncia "expandido/contraído".
- Contenido cerrado fuera del recorrido de foco: el navegador no renderiza el contenido de un `<details>` cerrado (`content-visibility: hidden`), así que no hace falta `inert` manual.
- Foco visible: hereda el `:focus-visible` global con `outline-offset: -2px`, porque el ítem recorta su overflow.
- Ícono `aria-hidden="true" focusable="false"`.
- Las preguntas **no** son headings, a propósito: no se altera el outline de la página y se evitan los problemas de VoiceOver con headings dentro de `summary`.
- Búsqueda en página (Ctrl+F): los navegadores que la soportan abren el `<details>` que contiene la coincidencia.

## Reglas de uso

- **`data-en`/`data-es` solo en elementos hoja** (pregunta, respuesta, chip). `nhLang.apply()` reemplaza su `textContent` y borraría el SVG o los chips si estuvieran en `summary`.
- El texto se resuelve por SSR con `localeFromPathname`: el contenido está completo en el HTML, sin depender de JS.
- Sin microdata. El JSON-LD `FAQPage` lo inyecta la página (ver [`faq-jsonld-seo.md`](../subsistemas/faq-jsonld-seo.md)).
- **Separación tonal, sin líneas divisorias**: los ítems se separan por fondo (`--bg-tertiary`) y `gap`. El borde solo aparece en el ítem abierto, como acento (`--accent-border`).

## Tests

[`src/lib/faq-dist.test.ts`](../../src/lib/faq-dist.test.ts) (dentro de `npm test`, después de `npm run build`) valida en las 6 rutas: contenido visible vs. datos, FAQ visible vs. JSON-LD (ES), ids únicos, estado inicial, `name`, ícono decorativo, `data-*` en hojas y `lang`.

Snapshot SSR/SEO antes/después: [`scripts/faq-snapshot.mjs`](../../scripts/faq-snapshot.mjs).

## Estado

Documentado
