# HeroSection

**Ruta:** [`src/components/HeroSection.astro`](../../src/components/HeroSection.astro)

**Usado en:** [`src/pages/index.astro`](../../src/pages/index.astro)

## Props

Ninguna; copy y estructura viven en el componente.

## Comportamiento

- Hero a pantalla completa sobre **`bg-slate-950`** + **`.section-dark`**: imagen raster de fondo (`<Image />` desde [`src/assets/home/hero-banner.webp`](../../src/assets/home/hero-banner.webp), 1536×1024 intrínseco), gradiente vertical, **refuerzo en zona inferior** (`bg-gradient-to-t` sobre ~58% de altura) para atenuar texto incrustado en el asset, textura de ruido SVG y glow decorativos (`motion-reduce:hidden` donde aplica).
- **LCP / imagen prioritaria:** el fondo usa `loading="eager"`, `fetchpriority="high"`, `decoding="async"`, `sizes="100vw"` y `widths` responsivos para que el navegador elija ancho adecuado. `alt=""` (decorativa tras capas de oscurecimiento).
- Titular y párrafo se resuelven por SSR con `localeFromPathname`; no usan pares ocultos `data-es` / `data-en`, evitando flash y DOM duplicado en `/en`. Sin CTA en el hero: la conversión principal está en las tarjetas de audiencia y en el resto de la home.
- Grid principal: **`gap-10`** en una columna (stack móvil), **`lg:gap-16`** en dos columnas para separar copy y mockup en desktop. Bloque de texto: **`min-w-0 max-w-2xl`** para no expandir el titular hacia el mockup en viewports anchos.
- Columna derecha: mock de dashboard (markup + Tailwind), sin segunda imagen raster (evita competir con el LCP del fondo). El microcopy del mock se resuelve por `localeFromPathname` para `/en`.
- `aria-labelledby` apuntando al `<h1>`.

## Decisiones de diseño

- Decoraciones con `aria-hidden="true"`.
- Contraste estable en claro/oscuro global gracias al bloque oscuro fijo y al gradiente sobre la foto.

## Assets

- Backdrop home: `src/assets/home/hero-banner.webp`. Sustituciones futuras deben mantener la API de `<Image />`, dimensiones intrínsecas coherentes en `width`/`height`/`widths`, y los atributos LCP.

## Relacionado

- Patrón de fondo fullscreen reutilizable en otras rutas (imagen + copy, sin mock): [`PageHeroSection`](./page-hero-section.md).

## Estado

Documentado
