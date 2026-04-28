# PricingCard

Tarjeta de plan de precios para el catálogo de landings.

**Archivo:** [`src/components/PricingCard.astro`](../../src/components/PricingCard.astro)

## Props

| Prop         | Tipo          | Descripción                                                        |
| ------------ | ------------- | ------------------------------------------------------------------ |
| `plan`       | `PricingPlan` | Datos validados (Zod)                                              |
| `orderClass` | `string`      | Opcional; clases Tailwind para orden en grid (p. ej. `md:order-2`) |

## Variantes

- **Normal:** fondo `var(--bg-surface-container-low)`; hover `-translate-y-0.5` y subida tonal.
- **Recomendado** (`plan.recommended`): fondo `var(--bg-surface-container-lowest)`, elevación extra, badge superior y glow ambiental con `--accent-glow` (sin borde duro).

## Badge

Si `recommended` es true, el texto del badge sale de `plan.recommendedLabel` / `plan.recommendedLabelEn` (datos). Si faltan, fallback **Recomendado** / **Recommended**. Estilo: badge sólido `bg-[var(--accent)]`, texto `var(--color-on-accent)`. Posicionamiento centrado en tope con `pointer-events-none`.

## Contenido

- `h3` con nombre del plan
- `pitch` como propuesta de valor principal (ES/EN)
- Separador horizontal (`h-px`, opacidad baja) entre bloque de pitch y lista; márgenes `mt-[19px] mb-6` respecto al bloque superior para un hueco vertical compacto respecto a la lista
- Lista de features: cada ítem incluye un **SVG check** inline (círculo + stroke en color acento vía tokens), sin pseudo-elementos globales en CSS
- Sin CTA en la tarjeta: los campos `ctaText` / `ctaHref` del plan siguen en datos y schema para SSOT u otros usos, pero no se renderizan aquí.
- **A11y recomendado:** la tarjeta recomendada anuncia jerarquía con texto `sr-only` y etiqueta aria de plan recomendado.

## i18n

Textos visibles resueltos por `localeFromPathname`; `data-es` / `data-en` quedan como metadatos para el toggle global. Features usan `features` y `featuresEn` alineados por índice.

## Estado

Documentado
