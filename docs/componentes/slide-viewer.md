# SlideViewer

**Ruta:** `src/components/SlideViewer.astro`

**Usado en:** `src/pages/blog/[slug].astro` (si `post.data.slides`), `src/pages/dev/component-scripts-audit.astro`

## Props

| Prop    | Tipo     | Requerida | Descripción                                                                |
| ------- | -------- | --------- | -------------------------------------------------------------------------- |
| `src`   | `string` | Sí        | Nombre de carpeta bajo `src/assets/slides/<src>/` con `slide-NN.webp`.     |
| `alt`   | `string` | Sí        | Descripción accesible del bloque; se compone por página en cada `<Image>`. |
| `class` | `string` | No        | Clases Tailwind extra en el `<section>` contenedor.                        |

## Comportamiento

- Resuelve imágenes con `import.meta.glob('../assets/slides/**/slide-*.webp', { eager: true })`, filtra por `/slides/${src}/` y ordena por número en el nombre del archivo.
- Muestra una diapositiva a la vez (`opacity`); botones anterior/siguiente solo si hay más de una.
- Teclado: flechas ←/→ en el contenedor con foco.
- Touch: swipe horizontal con umbral ~40px.
- Controles: fullscreen con `btn-primary btn-primary--icon-only btn-primary--sm`; anterior/siguiente con `btn-primary btn-primary--icon-only` (contraste sobre la diapositiva).
- Pantalla completa: botón que alterna un overlay dedicado `fixed inset-0` (mueve la `data-slide-surface` al overlay) y ajusta el layout de la imagen (remueve `aspect-video` y habilita `h-full` tanto en el wrapper como en la superficie del visor) para evitar alto 0 y respetar viewport en mobile/desktop; `Escape` cierra (listener en `document`).
- Fallback de viewport units en fullscreen: solo se define inline `height` (`100vh` -> `100dvh` -> `100svh`), evitando repetir inline `width/top/left/right/bottom` que ya están resueltos por clases estáticas del overlay.
- Guard centralizado de fullscreen: `getFullscreenDom()` valida `overlay`, `overlayInner` y `surface`; retorna `null` si falta algún nodo y cada caller (`toggle`, `expand`, `collapse`) hace early return.
- Accesibilidad del overlay fullscreen: estado sincronizado en una única función para clase `hidden`, `aria-hidden` y atributo `inert` (oculto: `aria-hidden="true"` + `inert`; visible: `aria-hidden="false"` y sin `inert`).
- Fondo visual (glassmorphism): el `data-slide-surface` y el overlay fullscreen usan el mismo patrón del chatbot (`backdrop-filter: blur(20px)` con `-webkit-backdrop-filter`) con fondos `hsla(...)` para garantizar que la opacidad funcione consistentemente en Tailwind + light/dark.
- Primera imagen `loading="eager"`, resto `lazy`.
- Sin archivos: bloque sustituto con mensaje y carpeta indicada.

## Decisiones de diseño

- IDs estables derivados de `src` (`slide-viewer-…`) en el markup; el `<script>` está al **final del componente** (fuera del ternario `hasSlides`) para tooling/Prettier y recorre `document.querySelectorAll('[data-slide-viewer]')` (sin `define:vars`).
- Uso de `getSlideImageFromGlobModule` (`src/lib/slides.ts`) en lugar de cast manual al tipo de Astro.

## Deuda técnica conocida

- Listener global `keydown` en `document` para `Escape` en fullscreen: cada instancia usa `AbortController` por viewer; revisar teardown si en el futuro hay view transitions.
- Clases Tailwind aplicadas solo desde el script en modo fullscreen: asegurar purga JIT / `safelist` en `tailwind.config.mjs` (principalmente `h-full`; el resto del overlay usa clases estáticas en el markup).

## Estado

Documentado
