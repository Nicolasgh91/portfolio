# SectionWrapper

**Ruta:** [`src/components/SectionWrapper.astro`](../../src/components/SectionWrapper.astro)

**Usado en:** landings [`index.astro`](../../src/pages/index.astro), [`servicios.astro`](../../src/pages/servicios.astro), [`talento.astro`](../../src/pages/talento.astro).

## Props

| Prop | Tipo | Requerida | Descripción |
|------|------|-----------|-------------|
| `bg` | `string` | No | Clases de fondo; default **`bg-[var(--bg-primary)]`** (tema vía `:root` / `:root.light` en `tokens.css`). Para bandas alternativas usar tokens (ej. `bg-[var(--bg-secondary)]`). **No** usar utilidades Tailwind `dark:` para el tema: el sitio alterna la clase **`light`** en `<html>`, no `dark`. |
| `padding` | `string` | No | Default `py-24 md:py-32`. |
| `maxWidth` | `string` | No | Default `max-w-7xl`. |
| `tone` | `'default' \| 'dark' \| 'accent'` | No | **`default`:** sin bloque fijo; fondo/texto según tokens globales. **`dark` / `accent`:** `.section-dark` / `.section-accent` (texto fijo sobre color blocking). |
| `id` | `string` | No | `id` del `<section>`. |
| `class` | `string` | No | Clases en el `<section>`. |
| `innerClass` | `string` | No | Clases en el contenedor interno (`mx-auto` + `maxWidth`). |
| `revealAlt` | `boolean` | No | Si es `true`, añade `data-alt-reveal` y clases iniciales de Alt B (`opacity-0`, `translate-y-4`, transición). Solo tiene efecto en `/`, `/servicios` y `/talento` (ver [`scroll-reveal.md`](../scroll-reveal.md)). |
| `revealDelayMs` | `number` | No | Retraso en ms para `transition-delay` (stagger RD-4.1); solo tiene sentido con `revealAlt`. |

## Comportamiento

- En [`servicios.astro`](../../src/pages/servicios.astro) el hero superior es [`PageHeroSection`](./page-hero-section.md) (bloque oscuro fijo, no `SectionWrapper`). Las franjas con `tone="default"` siguientes usan **`bg-[var(--bg-primary)]`** (caso de uso), **`bg-[var(--bg-surface-container-low)]`** en el catálogo y **`bg-[var(--bg-secondary)]`** en contacto.
- Composición de sección con slot por defecto.
- Con `tone="default"`, el fondo por defecto sigue `--bg-primary` (cambia al togglear `:root.light`); con `tone="dark"` o `accent`, la paleta de texto es **fija** (ver [`sistema-diseno.md`](../subsistemas/sistema-diseno.md)).
- Scroll-reveal Alt B usa `transition-[opacity,transform]` en el `<section>` para no animar `background-color` al cambiar tema.

## Estado

Documentado
