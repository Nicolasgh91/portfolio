# Patrón `.btn-bounce` (flecha animada)

**Implementación:** [`src/styles/tokens.css`](../../src/styles/tokens.css) — reglas en `@layer components`; `@keyframes bounce-right` en **raíz del archivo** (fuera de `@layer`); override `:root.no-motion .btn-bounce:hover .arrow` también en raíz, **sin `!important`**, para ganar por cascada sobre el layer.

## Contrato de markup

- Clase **`btn-bounce`** en el elemento interactivo (`<a>` o control con apariencia de CTA), **junto** con `.btn-primary`, utilidades Tailwind u otras clases visuales. No redefine padding, fondo ni color: solo enlaza la animación.
- Un hijo **`span.arrow`** (o contenedor equivalente) con **`aria-hidden="true"`** envuelve la flecha decorativa (`→` o `<svg>`). El texto traducible debe resolverse por SSR cuando vive en Astro; si usa `data-es` / `data-en` para sincronización cliente, la flecha **no** forma parte de esos atributos.

## Comportamiento

- En hover, `.arrow` ejecuta **`bounce-right`** (0,5s, easing estándar), **sin `animation-fill-mode: forwards`**: los keyframes terminan en `translateX(0)` para un rebote que vuelve al reposo en el mismo ciclo.
- **`.btn-bounce .arrow`** usa `transition-transform duration-300 ease-out` (Tailwind vía `@apply`) para suavizar la salida del hover en modos que solo aplican `transform` (p. ej. movimiento reducido).
- **`prefers-reduced-motion: reduce`:** sin animación; `transform: translateX(5px)` en hover sobre `.arrow`.
- **`:root.no-motion`** (panel a11y / head): misma intención que arriba; reglas en raíz del CSS, después del cierre de `@layer components`.

## Dónde aplicar / excluir

- **Sí:** CTAs con flecha explícita en cuerpo de página (`.btn-primary` / `.btn-secondary` + **`btn-bounce`**, enlaces de texto con `→`). En [`talento.astro`](../../src/pages/talento.astro), el CTA “Contactar” del bloque ¿Hablamos? y en [`servicios.astro`](../../src/pages/servicios.astro) el cierre naranja (“¿Listo para el siguiente paso?”) usan **`btn-secondary btn-bounce`** sobre **`SectionWrapper`** con `tone="accent"` (contenedor `.section-accent`).
- **Variante [`ProjectCard`](./project-card.md):** el `article` lleva `group/card` (no `btn-bounce`); la flecha sigue siendo `span.arrow` y usa las mismas reglas `bounce-right` duplicadas en `tokens.css` bajo `.group\/card:hover .arrow` para no anidar un segundo enlace.
- **Variante [`ServiceCard`](./service-card.md):** el shell lleva `group/card`; el texto “Ver servicio” se resuelve por locale/SSR o por `data-en`/`data-es` si requiere sincronización cliente; la flecha es **`span.arrow`** con `<svg>` dentro (no `btn-bounce` en el enlace overlay).
- **No:** [`Nav.astro`](../../src/components/Nav.astro), envíos de formulario, controles **icon-only** (carrusel, SlideViewer), flechas puramente de navegación.
- **Tag compacto** en [`servicios.astro`](../../src/pages/servicios.astro) (`tag tag-accent` + **`btn-bounce`**): texto traducible en un `span` con **`data-en` y `data-es`** (para `nhLang`); la flecha **`→`** va en **`span.arrow`** hermano para que el toggle de idioma no borre el ícono.

## Tailwind

- Clases `btn-bounce` y `arrow` aparecen en plantillas estáticas; **no** hace falta safelist para purga.

## Estado

Documentado
