# Sistema de botones (acciones)

## Fuente de verdad

- Implementación: `src/styles/tokens.css`, bloque `@layer components` (variantes, modificadores, `--btn-*` en `:root` / `html.light`).
- Al **final** del mismo `@layer components`, reglas para `a.btn-primary` / `a.btn-secondary` / `a.btn-tertiary` (y `:hover`): anulan el color del `a` global del mismo archivo. Conviven en el layer para que `.section-dark` / `.section-accent` ganen por especificidad donde corresponda (ver [`sistema-diseno.md`](sistema-diseno.md)).
- No hay componente Astro `Button`; enlaces y `<button>` comparten las mismas clases.
- **Iframe chatbot:** `public/chatbot/widget/index.html` inyecta `--btn-primary-*`, `--btn-disabled-opacity`, `--color-on-accent`, `--text-lg`; `chat.css` usa esas variables en `#send-btn` (y mantiene el trigger con gradiente propio).

## Variantes de acción

| Clase            | Uso                                                                               |
| ---------------- | --------------------------------------------------------------------------------- |
| `.btn-primary`   | CTA de conversión (accent, texto `--color-on-accent`).                            |
| `.btn-secondary` | Acción secundaria (transparente, borde sutil).                                    |
| `.btn-tertiary`  | Navegación / texto + icono (sin borde de caja; outline solo en `:focus-visible`). |

## Modificadores de tamaño

| Clase                                               | Rol                                                                |
| --------------------------------------------------- | ------------------------------------------------------------------ |
| `.btn-primary--sm` / `--sm` en secondary y tertiary | Nav CTA con glow, TOC móvil, flechas carrusel plantillas (`--sm`). |
| (sin sufijo)                                        | CTAs de página, tarjetas, sidebar FAQ.                             |
| `.btn-primary--lg` / `--lg`                         | Submit de formulario, CTA del drawer móvil (`w-full`).             |
| `.btn-primary--compact`                             | Texto más chico en CTA nav móvil (junto con `--sm` + `--glow`).    |

## Modificadores especiales

| Clase                    | Rol                                                                                                                                                                                                                                                    |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `.btn-primary--glow`     | Solo con `.btn-primary--sm` en el CTA del header: sombra en dark, `cta-pulse` en `::after` si `prefers-reduced-motion: no-preference`; con `reduce` o `:root.no-motion` la animación se anula y la sombra queda estática (`--btn-glow-shadow-static`). |
| `.btn-*--icon-only`      | Controles circulares (SlideViewer: **primary** sólido sobre slides; BackToTop: **secondary** + utilidades Tailwind para vidrio oscuro).                                                                                                                |
| `.catalog-carousel__nav` | Capa glass sobre `.btn-secondary--sm` en `/plantillas` (fondo/borde dark vs `html.light`).                                                                                                                                                             |

## Flecha animada (`.btn-bounce`)

- Patrón documentado en [`../componentes/btn-bounce.md`](../componentes/btn-bounce.md): hook `btn-bounce` + hijo `.arrow`; animación `bounce-right` en keyframes **fuera** de `@layer components` en `tokens.css`; overrides `prefers-reduced-motion` en el layer y `:root.no-motion` en **raíz** del archivo (sin `!important`).

## Estados

- `:hover`, `:focus-visible` (outline 2px accent, offset 2px), `:active` (ligero `translateY` / `scale`).
- `:disabled` y **`[aria-disabled="true"]`** comparten opacidad, `cursor: not-allowed` y `pointer-events: none` (necesario en `<a>` que simula botón).

## Familias fuera de este sistema

- Controles de UI en `Nav.astro`: `.ctrl-btn`, `.nav-tab`, `.nav-burger`, `.a11y-btn`, `.drawer-link`, `.services-item` (affordance neutra).
- Filtros: `.taxonomy__pill` (blog + catálogo).
- Enlaces de icono social: `.social-icon-link` (branding por red).

## Jerarquía en vista de pricing

Por defecto, el CTA de **PricingCard** es **primary** (conversión por plan). Si el producto define que en `/servicios` el único CTA primario sea el del **FaqSection** y el de la tarjeta deba ser secundario, documentar aquí la **inversión de jerarquía** y usar `.btn-secondary` en la tarjeta.

## Controles sobre media (SlideViewer)

Los botones del visor usan **`.btn-primary--icon-only`** (opción **b** del plan: contraste sobre imágenes). Si en el futuro un fondo claro los hace ilegibles, valorar utilidades extra o escape documentado a Tailwind local solo en ese componente.

## Criterio de accesibilidad

Tras cambios, verificar **tab** en cada superficie: `:focus-visible` visible en todos los controles con apariencia de botón.

## Estado

Documentado — mantener alineado con `tokens.css`.
