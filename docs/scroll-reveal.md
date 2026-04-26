# Sistema scroll reveal

Hay **dos mecanismos** mutuamente excluyentes por página/sección: **`.reveal` / `.reveal--scale`** (blog y plantillas) y **Alt B** (`data-alt-reveal` + utilidades Tailwind) en las landings principales ES/EN. Estilos globales en [`src/styles/tokens.css`](../src/styles/tokens.css); inicialización en [`public/scripts/reveal.js`](../public/scripts/reveal.js), cargado desde [`src/layouts/Layout.astro`](../src/layouts/Layout.astro).

## Partición por ruta

| Rutas                                                                                                       | Mecanismo                        | Marcado típico                                                                                                                                                                                                                         | Notas                                                                                                                            |
| ----------------------------------------------------------------------------------------------------------- | -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `/`, `/en`, `/servicios`, `/en/services`, `/talento`, `/en/talent` y futuras landings con `data-alt-reveal` | **Alt B**                        | `data-alt-reveal` en `<section>` (p. ej. vía [`SectionWrapper`](./componentes/section-wrapper.md) `revealAlt`) + clases iniciales `opacity-0 translate-y-4` y finales `opacity-100 translate-y-0` aplicadas por `IntersectionObserver` | No usar `.reveal` en estas páginas. El observer se activa por presencia de nodos `[data-alt-reveal]`, no por whitelist de rutas. |
| Blog (índice, categoría, etiqueta, `[slug]`) y **plantillas**                                               | **`.reveal` / `.reveal--scale`** | `class="reveal reveal--scale"` (+ opcional `--reveal-delay`)                                                                                                                                                                           | Sin cambio respecto al subsistema auditado (umbrales, prose largo, stagger). No mezclar Alt B aquí.                              |

### Contrato Alt B (landings)

1. **Hero / primera sección con H1:** no llevar `data-alt-reveal` (LCP y jerarquía visual).
2. **Bloques siguientes:** `revealAlt` en `SectionWrapper` o atributo manual `data-alt-reveal` con transición Tailwind en el mismo nodo.
3. **`prefers-reduced-motion` / `html.no-motion` / `nhA11y.motionReduced`:** el script quita el estado oculto de inmediato (misma función `reduceMotionActive()` que `.reveal`).
4. **Sin JS:** regla **`.no-js [data-alt-reveal]`** en `tokens.css` fuerza `opacity: 1` y `translateY(0)` para crawlers y usuarios sin JS.
5. **Safelist:** utilidades dinámicas (`opacity-0`, `translate-y-4`, etc.) están en `tailwind.config.mjs`.

### Stagger RD-4.1 (`/` y `/servicios`)

[`SectionWrapper`](./componentes/section-wrapper.md) expone **`revealDelayMs`**: se aplica como `transition-delay` en el `<section>` cuando `revealAlt` es true. En [`index.astro`](../src/pages/index.astro) los valores son **0, 100, 200, 300** ms. En [`servicios.astro`](../src/pages/servicios.astro) el stagger por claves (`catalog`, `caseStudy`, `how`, `faq`, `contact`) usa **`Math.min(i * 100, 600)`** (si no hay segunda fila de catálogo, no se reserva índice para `catalog2`). El bloque naranja de cierre (`tone="accent"`) tiene **`revealAlt` sin `revealDelayMs`**, alineado al bloque equivalente en [`talento.astro`](../src/pages/talento.astro).

## Clases `.reveal`

| Clase                | Rol                                                                                                             |
| -------------------- | --------------------------------------------------------------------------------------------------------------- |
| `.reveal`            | Estado base: `opacity: 0`, transición en `opacity` y `transform`, `transition-delay: var(--reveal-delay, 0ms)`. |
| `.reveal--scale`     | Entrada desde `scale(0.92)`. **Única variante en uso** en blog y plantillas.                                    |
| `.reveal.is-visible` | Añadida por JS al intersectar (fire-once); `opacity: 1`, `transform: none`.                                     |

**Artículo (`blog/[slug].astro`):** conviene partir en bloques (ShareBar, slides, prose, etc.); un único wrapper gigante agrava el problema de ratio. El `IntersectionObserver` en Layout usa **`threshold: 0`** (intersección no nula): con `threshold: 0.15`, incluso el solo bloque `<article class="prose">` puede ser tan alto que la ratio visible/total **nunca** llega al 15% y el texto no se muestra. Mapeo actual (header con `<h1>` sin reveal): ShareBar `0ms`; slides `100ms`; `<article class="prose">` `200ms`; `ArticleFooter` `300ms`; pie con CTAs `350ms`; bloque “relacionados” `400ms` (un solo `.reveal` en la `<section>`, sin reveal por tarjeta).

## Accesibilidad (ambos sistemas)

- **`@media (prefers-reduced-motion: reduce)`:** `.reveal` visible sin transición; **`[data-alt-reveal]`** queda visible con `transition: none` en [`tokens.css`](../src/styles/tokens.css) (refuerzo además del script); Alt B sin animación de entrada.
- **Fallback sin JS:** `<html>` lleva `no-js` hasta que un script síncrono en `<head>` lo quita; reglas **`.no-js .reveal`** y **`.no-js [data-alt-reveal]`** fuerzan contenido visible.
- **Panel de accesibilidad (`nhA11y`):** si hay movimiento reducido, el script aplica visibilidad a `.reveal` y a nodos `[data-alt-reveal]` sin depender de scroll.

## `nh-reduced-motion` y `html.no-motion`

- **Script en `<head>`:** lee `localStorage.getItem('nh-reduced-motion')`. Si la clave **existe**, `'true'` → movimiento reducido; `'false'` → movimiento completo. Si **no existe**, se usa `prefers-reduced-motion: reduce` del sistema. Si corresponde reducir, se añade `class="no-motion"` en `<html>` **antes del primer paint**.
- **`nhA11y` al final del `<body>`:** calcula el mismo tri-estado, asigna `motionReduced` y llama `setReducedMotion` **sin** persistir salvo clics del panel.
- **Script reveal:** `reduceMotionActive()` considera `matchMedia`, `document.documentElement.classList.contains('no-motion')` y `nhA11y.motionReduced`. Contrato de claves: [`docs/README.md`](./README.md).

## Uso en páginas nuevas

### Blog / plantillas (`.reveal`)

1. **No animar el hero** (primera sección con H1 / LCP): no añadir `.reveal` ahí.
2. Bloques siguientes: `class="reveal reveal--scale"`, opcional `style="--reveal-delay: Nms"`.
3. **Blog — listados:** envolver cada tarjeta en un `<div class="reveal reveal--scale">` con `style={\`--reveal-delay: ${Math.min(i \* 100, 600)}ms\`}`; no modificar `BlogCard.astro` para reveal.
4. Stagger máximo efectivo recomendado: **600 ms** por ítem (`Math.min(i * 100, 600)`).

### Landings home / servicios / talento ES/EN (Alt B)

1. Preferir `SectionWrapper` con `revealAlt={true}` en secciones posteriores al hero.
2. No duplicar `.reveal` en el mismo nodo.

## Orden de scripts en Layout

Head: tema + strip `no-js` + decisión temprana `no-motion` → body → `nhA11y` → script reveal (`.reveal` + `initAltReveal`) → chat widget (diferido).

## Comportamiento del script

- Tras `nhA11y`: inicialización con `DOMContentLoaded` y `requestAnimationFrame`.
- **`.reveal`:** si aplica movimiento reducido, `is-visible` en todos; si no, `IntersectionObserver` con `threshold: 0`, `rootMargin: '0px 0px -50px 0px'`, fire-once.
- **Alt B:** mismo umbral y fire-once; si no existen nodos `[data-alt-reveal]`, no hace nada. Si existen, muta clases Tailwind (`opacity-0` / `translate-y-4` → `opacity-100` / `translate-y-0`) sin depender de `pathname`.

## Rollback

Si Alt B vuelve a dejar secciones invisibles o anima rutas no esperadas, revertir en bloque:

1. [`public/scripts/reveal.js`](../public/scripts/reveal.js)
2. [`src/components/SectionWrapper.astro`](../src/components/SectionWrapper.astro)
3. Este documento

## Grid y `BlogCard`

El grid (p. ej. `.posts-grid`) debe tener como **hijos directos** los wrappers `<div class="reveal reveal--scale">`, no el `<article class="blog-card">`. Si alguna ruta usara utilidades de columna en el root de la tarjeta, trasladarlas al wrapper.

## Validación

**Comandos (VM Ubuntu, desde la raíz del repo):**

```bash
npm run typecheck && npx astro check && npm run build
```

**Manual (tras `npm run preview` o entorno de staging):**

1. **`.reveal`:** scroll en plantillas, blog índice y un artículo; entradas al viewport sin revertir al subir.
2. **Alt B ES:** scroll en `/`, `/servicios`, `/talento`; mismos criterios.
3. **Alt B EN:** scroll en `/en`, `/en/services`, `/en/talent`; las secciones deben aparecer al entrar al viewport.
4. **`prefers-reduced-motion`:** contenido visible sin depender de animación en ambos sistemas.
5. **Panel de accesibilidad:** “reducir movimiento”; misma visibilidad inmediata.
6. **Sin JS:** deshabilitar JS → contenido bajo `.reveal` y `[data-alt-reveal]` **visible**.

## Deuda / extensiones

- Ninguna abierta sobre persistencia de movimiento reducido: la clave es `nh-reduced-motion` (ver [`README.md`](./README.md)).
