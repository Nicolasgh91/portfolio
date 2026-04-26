# Sistema de diseño

## Fuente de verdad

- Tokens globales: `src/styles/tokens.css` (único archivo de tokens en el build; no existe copia activa bajo `public/`).
- Se importan en `src/layouts/Layout.astro`.
- Chatbot consume tokens del parent + fallbacks en `public/chatbot/widget/chat.css`.

## Tokens principales

- Color/acento: `--accent-*`, `--color-accent-*`.
- Superficies/textos: `--bg-*`, `--text-*`, `--border-*`.
- **Capas tonales (catálogo servicios):** `--bg-surface-container-low` (franja padre del listado) y `--bg-surface-container-lowest` (base opaca de la tarjeta en modo claro). En oscuro, el shell de la tarjeta usa la clase **`.service-card-shell-bg`** en `tokens.css` (`@layer components`): fondo `--bg-card` + `backdrop-filter: blur(12px)` solo cuando **`:root:not(.light)`** (alineado con `nhTheme`, no con `dark:` de Tailwind). Para hover sin duplicar utilidades Tailwind en la página, la clase plana **`.shell-hover`** (mismo nodo que el shell) aplica `transition` de `background-color` y, en hover, **`var(--bg-tertiary)`** con **`:root.light`** y **`hsla(0, 0%, 100%, 0.1)`** con **`:root:not(.light)`** (p. ej. grids en `/talento`).
- Tipografía/espaciado/radius: `--font-*`, `--text-xs` … `--text-6xl`, `--text-metric` (métricas monumentales, escala con `--font-scale`), `--sp-*` (incluye `--sp-3xl`, `--sp-4xl` para macro-padding).
- **ProjectCard:** `--card-project-min-h` (400px) y `--card-project-min-h-md` (450px) en `@layer components` de `tokens.css`; altura mínima de la tarjeta en home y `/talento`.
- **LogoMarquee (`/talento`):** franja **contenida** en `.page-container` (sin breakout `100vw`); raíz con utilidades **`rounded-2xl`** + padding horizontal alineado a secciones vecinas en [`LogoMarquee.astro`](../../src/components/LogoMarquee.astro). Clases **`logo-marquee--accent`** (fondo `--color-accent-400` en default / `--color-accent-600` con `html.light`; color de texto/iconos **`--color-on-accent`**) y **`logo-marquee__slot`** en `@layer components` de `tokens.css`.
- Bloques de color fijo (rediseño vanguardia): `.section-dark` y `.section-accent` en `@layer components` fuerzan color de texto **sin** depender de `html.dark` / `:root.light` (contraste sobre `bg-slate-950` u `bg-orange-600`). Cubren el contenedor, `h1–h4`, `p`, enlaces **`a:not(.btn-primary)`** (el primario mantiene su estilo de marca) y **`.btn-secondary`** (texto claro). El secundario añade borde/fondo semitransparentes en el mismo bloque para legibilidad con `:root.light`. Las reglas `a.btn-primary` / `a.btn-secondary` / `a.btn-tertiary` viven en el **mismo** `@layer components` (no fuera del layer) para que estos selectores ganen por especificidad sin duplicar overrides.
- Accesibilidad: `--font-scale`, modo `light`, modo `hc`.
- **Pasos con número monumental (`/servicios`, "Cómo trabajamos"):** los dígitos son **texto** (`01`…`03`) con `font-size: var(--text-6xl)`, no imágenes. Si el número va `absolute` sobre el bloque, el calce del título no debe depender solo de `mt-*` fijo en `rem`: `--text-6xl` ya multiplica por `--font-scale` (panel a11y) y el margen fijo no, lo que provoca solapamiento. Reservar altura con el mismo token en el contenedor (p. ej. `padding-top: calc(var(--text-6xl) * 1)` vía utilidad arbitraria Tailwind) y el `h3` con `mt-0` respecto a ese padding.

## Tema y a11y

- `nhTheme`: alterna clase `light`.
- `nhLang`: inicializa desde `<html lang>` y sincroniza textos/placeholder de nodos interactivos con `data-en/data-es`. El contenido visible de páginas compartidas se resuelve por SSR con `localeFromPathname`; `tokens.css` ya no mantiene reglas globales de visibilidad i18n ni depende de `.hidden` para alternar idiomas.
- `nhA11y`: escala, alto contraste y motion reduction.

## Ancho de layout

- **`.page-container`** (`tokens.css`): `max-width: 960px`, centrado; pensado para listados, talento y lectura de blog donde conviene acotar la línea de texto. Padding horizontal `var(--sp-lg)` (equivalente a `1.5rem` / `px-6` con `rem` por defecto).
- **Footer** (`Footer.astro`): no usa `.page-container`; usa **`max-w-7xl` + `mx-auto` + `px-6`** para alinearse con `SectionWrapper` en páginas anchas. La grilla de enlaces del pie se beneficia del ancho extra sin forzar artículos a 1280px.

## Tailwind y tokens

- `tokens.css` incluye `@tailwind components` + `@layer components` para **sistema de botones**, FAQ y utilidades asociadas, y `@tailwind utilities` al final.
- Tailwind convive con CSS tradicional en el mismo archivo.
- Variables CSS son usadas tanto por utilidades como por estilos scoped.
- **Tema:** el sitio usa `:root` y `:root.light` (clase `light` en `<html>`). Las utilidades Tailwind **`dark:`** (`darkMode: 'class'` esperando clase `dark`) **no aplican**; superficies y textos responsivos deben usar `var(--bg-*)`, `var(--text-*)`, etc. El alias **`--accent`** ya mapea a `--color-accent-400` (default) y `--color-accent-600` (light) y sirve para acentos que deben seguir el tema.
- Safelist en `tailwind.config.mjs` incluye utilidades usadas por scroll-reveal Alt B (`opacity-0`, `translate-y-4`, etc.), más `animate-marqueeScroll` y `hover:[animation-play-state:paused]` para LogoMarquee. `theme.extend` define keyframes/animación **`marqueeScroll`** (clase `animate-marqueeScroll`).

## Botones

Ver subsistema dedicado: [`botones.md`](botones.md) (incluye `.btn-bounce` / `bounce-right` en `tokens.css`).

## Catálogo de landings (excepciones en `tokens.css`)

- Carrusel en `/plantillas`: scrollbar oculto vía utilidades en el track (`[scrollbar-width:none]`, `[&::-webkit-scrollbar]:hidden`); la clase `.catalog-scroll-hide` puede seguir existiendo por compatibilidad.
- `.plantilla-card[data-filtered]`: colapsa tarjetas filtradas sin `position: absolute` (compatibilidad con `scroll-snap`).
- `.catalog-carousel__nav`: vidrio + blur sobre `.btn-secondary--sm` en flechas del carrusel; contraste con `html.light`.
- `.faq-item summary` / `details.faq-item[open] > summary`: estilos del acordeón FAQ reutilizables (ver [`FaqSection`](../componentes/faq-section.md)). FAQ animado: `.faq-icon` / `.faq-item--animated.open .faq-icon` en el mismo `@layer components`; `prefers-reduced-motion` para el ícono vive en ese layer (no mezclar cascada con reglas fuera del bloque FAQ).
- `#catalog-filters button[data-selected]`: estado activo/inactivo de chips de filtro.

## Chatbot

- `index.html` inyecta tokens del padre en `:root`.
- `chat.css` define variables propias `--chat-*` para glassmorphism.

## Riesgos/deuda

- Mezcla extensa Tailwind + `<style>` scoped en varios componentes.
- Clases dinámicas en scripts requieren control de purga/safelist.

## Estado

✅ Documentado
