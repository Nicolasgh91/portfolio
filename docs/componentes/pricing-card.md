# PricingCard

Tarjeta de plan de precios para el catálogo de landings.

**Archivo:** [`src/components/PricingCard.astro`](../../src/components/PricingCard.astro)

## Props

| Prop         | Tipo          | Descripción                                                        |
| ------------ | ------------- | ------------------------------------------------------------------ |
| `plan`       | `PricingPlan` | Datos validados (Zod)                                              |
| `orderClass` | `string`      | Opcional; clases Tailwind para orden en grid (p. ej. `md:order-2`) |

## Variantes

- **Normal:** borde `var(--border-subtle)`, fondo `var(--bg-secondary)`; hover `border-white/12`, `-translate-y-0.5`, transición 300ms.
- **Recomendado** (`plan.recommended`): fondo `var(--accent-bg)`, borde `var(--accent-border)`, escala base `1.02`, hover misma escala + `-translate-y-0.5`, transición 300ms. Colores de acento alineados a la paleta global (`--accent`, `--color-on-accent` en el sitio, ~`#F5B800` en modo oscuro), sin duplicar hex paralelos.

## Badge

Si `recommended` es true, el texto del badge sale de `plan.recommendedLabel` / `plan.recommendedLabelEn` (datos). Si faltan, fallback **Recomendado** / **Recommended**. Estilo: badge sólido `bg-[var(--accent)]`, texto `var(--color-on-accent)`, uppercase compacto. **Posicionamiento:** contenedor `absolute -top-3 left-0 right-0 flex justify-center` con `pointer-events-none` para centrar sin chocar con el `scale` del padre (evita `left-1/2` + `translate` sobre el transform del card). El `<span>` del badge es el portador de `data-es` / `data-en`. Si en el futuro el badge fuera un enlace o botón, añadir `pointer-events-auto` al elemento interactivo interno.

## Contenido

- `h3` con nombre del plan
- Subtítulo (`subtitle`); precio: si `plan.price` es número, `$` + `toLocaleString('es-AR')`; `priceDetail` opcional
- Separador horizontal (`h-px`, opacidad baja) entre bloque de precio y lista
- Lista de features: cada ítem incluye un **SVG check** inline (círculo + stroke en color acento vía tokens), sin pseudo-elementos globales en CSS
- **CTA obligatorio:** enlace con `plan.ctaText`, `plan.ctaTextEn` y `plan.ctaHref`; clases `btn-primary w-full font-semibold` (variante primaria del sistema de botones).

## i18n

Textos visibles con `data-es` / `data-en`; features usan `features` y `featuresEn` alineados por índice.

## Estado

Documentado
