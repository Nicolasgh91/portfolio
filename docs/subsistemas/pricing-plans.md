# Pricing plans (catálogo de landings)

Planes embebidos en [`src/pages/plantillas.astro`](../../src/pages/plantillas.astro) vía [`src/data/pricing-plans.ts`](../../src/data/pricing-plans.ts). El pricing de `/servicios` vive en [`src/data/pricing.json`](../../src/data/pricing.json). Ver frontera formal en [`ADR-005`](../decisiones/adr-005-pricing-ssot-por-dominio.md).

## Contrato Zod

Archivo: [`src/schemas/pricing-plan.ts`](../../src/schemas/pricing-plan.ts).

- `id`: `basico` \| `plantilla` \| `full`
- `name`, `subtitle`, `pitch`, `price` (número entero ARS o string literal), `features` (mínimo 1 ítem)
- `nameEn`, `subtitleEn`, `featuresEn`, `priceDetail`, `ctaTextEn` opcionales
- `pitchEn` opcional
- `recommended`: típicamente `true` en el plan plantilla disponible (`plantilla`)
- `recommendedLabel`, `recommendedLabelEn` opcionales: texto del badge cuando `recommended` es true (p. ej. «Más elegido»); si faltan, [`PricingCard`](../componentes/pricing-card.md) usa un default
- `ctaHref` / `ctaText` (y `ctaTextEn`): presentes en datos y schema; la UI de [`PricingCard`](../componentes/pricing-card.md) en `/plantillas` **no** muestra enlace de conversión (los campos permanecen por SSOT y posible reutilización).

## Acento visual

La UI de cards destacadas usa **solo** tokens de acento existentes (`--accent`, `--accent-bg`, `--accent-border`, `--color-on-accent`), coherentes con el amarillo del sistema (~`#F5B800` en tema oscuro), sin crear una paleta paralela al brief de prototipo.

## Datos

Archivo: [`src/data/pricing-plans.ts`](../../src/data/pricing-plans.ts). Export `pricingPlans` validado con `pricingPlansSchema.parse()`.

## UI

Render con [`PricingCard`](../componentes/pricing-card.md). En desktop, el plan recomendado se muestra en el centro vía clases `order` en la grid (`basico` → `plantilla` → `full`).

En `/plantillas` se renderiza **pitch + lista de features**, sin CTA ni precio en la tarjeta. `price` y los CTAs en datos se mantienen por compatibilidad y futura reutilización.

## Estado

Documentado
