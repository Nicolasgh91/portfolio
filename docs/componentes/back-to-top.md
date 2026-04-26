# BackToTop

**Ruta:** `src/components/BackToTop.astro`

**Usado en:** `src/layouts/Layout.astro`

## Props

| Prop | Tipo | Requerida | Descripción |
| ---- | ---- | --------- | ----------- |
| —    | —    | —         | Ninguna.    |

## Comportamiento

- Botón fijo centrado abajo (`data-back-to-top`); oculto con `opacity-0` y `pointer-events-none` hasta que `scrollY > 300`.
- Click hace scroll al inicio (`scrollTo` suave o instantáneo según script).
- Una sola instancia por página (inyectada desde Layout).
- `aria-label` localizado por `localeFromPathname`.

## Decisiones de diseño

- Clases del sistema: `btn-secondary btn-secondary--icon-only` con tamaño fijo `58px` y utilidades Tailwind (`bg-black/55`, borde claro, `backdrop-blur-md`, texto blanco) para legibilidad sobre el fondo de página.
- Implementación mínima sin props para no duplicar estado en cada ruta.

## Deuda técnica conocida

- Selector `document.querySelector('[data-back-to-top]')` asume un único botón en el DOM.

## Estado

Documentado
