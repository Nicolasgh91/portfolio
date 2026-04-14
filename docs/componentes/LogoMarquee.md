# LogoMarquee

**Ruta:** [`src/components/LogoMarquee.astro`](../../src/components/LogoMarquee.astro)

**Usado en:** [`src/pages/talento.astro`](../../src/pages/talento.astro)

## Props

Ninguna; la lista de marcas está definida en el frontmatter del componente como imports `?raw` de `src/assets/marquee/*.svg`.

## Layout (opción A)

- El bloque vive **dentro de** `.page-container` (~960px): **no** hay wrapper full-bleed ni `w-screen` / `100vw` en la página.
- La raíz combina **`logo-marquee--accent`** con **`rounded-2xl`**, **`overflow-hidden`** y padding **`px-5 md:px-8`** (alineado a secciones como Roles / Habilidades).

## Estilo (franja de acento)

- Contenedor: clase **`logo-marquee--accent`** en [`tokens.css`](../../src/styles/tokens.css) `@layer components`.
- **Fondo:** tema por defecto (sin `html.light`) → `hsl(var(--accent-h), var(--accent-s), 56%)` (equivalente a **`--color-accent-400`**). Con **`html.light`** → **`var(--color-accent-600)`**.
- **Texto e íconos (SVG `currentColor`):** **`var(--color-on-accent)`** (`#0D0D10` en `:root`; no se redefine en `:root.light`, mismo valor por herencia). Los `<p>` del bloque usan **`color: inherit`** vía `.logo-marquee--accent p` para anular la regla global `p { color: var(--text-secondary) }`.
- Slots de logo: **`logo-marquee__slot`** (altura de ícono fija).
- Cabecera: rótulo “Stack y herramientas” + “Stack principal” / “Core stack” (`data-es` / `data-en`), alineación responsive como antes.

## Comportamiento

- Fila horizontal con animación **`marqueeScroll`** 30s linear infinite (`theme.extend.animation.marqueeScroll` → **`animate-marqueeScroll`**). Pausa en hover del carril (`hover:[animation-play-state:paused]`).
- **`prefers-reduced-motion: reduce`:** lista estática (`<ul>` con `motion-reduce:flex`), carril oculto (`motion-reduce:hidden`). Tras el layout contenido, comprobar que la lista sigue centrada y no desborda horizontalmente.

## Diagnóstico si el carril se ve estático

1. Tras `npm run build`, inspeccionar **`dist/talento/index.html`**: deben existir **dos** hijos `flex shrink-0` dentro del carril con `animate-marqueeScroll` (pista duplicada).
2. Confirmar en CSS de salida **`@keyframes marqueeScroll`** y **`.animate-marqueeScroll`**.
3. Si el usuario tiene **`prefers-reduced-motion: reduce`**, debe mostrarse la lista estática y ocultarse el carril animado.
4. **`tailwind.config.mjs`** safelist: **`animate-marqueeScroll`** y **`hover:[animation-play-state:paused]`** (clases poco repetidas en el repo).

## Excepción: no usar `<Image />` para SVG

Los logos del marquee son **vectoriales** embebidos como markup. No pasan por `astro:assets` `<Image />` (reservado a raster WebP/AVIF). Si en el futuro se sustituyen por marcas oficiales complejas, mantener `?raw` + `currentColor` o iconos inline; solo usar `<Image />` si el asset es raster.

## Estado

Documentado
