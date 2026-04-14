# PageHeroSection

**Ruta:** [`src/components/PageHeroSection.astro`](../../src/components/PageHeroSection.astro)

**Usado en:**

- [`src/pages/servicios.astro`](../../src/pages/servicios.astro) — asset [`hero-servicios-derecha.webp`](../../src/assets/services/hero-servicios-derecha.webp) (1536×1024).
- [`src/pages/talento.astro`](../../src/pages/talento.astro) — asset [`banner-talento-naranja.webp`](../../src/assets/talento/banner-talento-naranja.webp) (1671×940; **pasar `imageWidth` / `imageHeight` reales** del raster, no copiar de `/servicios`).

Patrón reutilizable para rutas que necesiten imagen de fondo a pantalla completa y copy en una columna, **sin** el mock de dashboard de la home.

## Props

| Prop | Tipo | Requerida | Default | Descripción |
|------|------|-----------|---------|-------------|
| `image` | `ImageMetadata` | Sí | — | Origen del `<Image />`; importar en la página y pasar la referencia. |
| `alt` | `string` | Sí | — | Texto alternativo. Evaluar el asset: si es puramente ornamental tras las capas, puede ser `""`; si aporta contexto reconocible, descripción breve en el idioma adecuado. |
| `imageWidth` | `number` | Sí | — | Ancho intrínseco del raster (p. ej. `1536` para `hero-servicios-derecha.webp` en `/servicios`). |
| `imageHeight` | `number` | Sí | — | Alto intrínseco (p. ej. `1024`). |
| `headingId` | `string` | Sí | — | `id` del `<h1>`; el `<section>` usa `aria-labelledby={headingId}`. |
| `labelText` | `string` | No | — | Rótulo superior en español (tipo `SectionLabel`). |
| `labelTextEn` | `string` | No | — | Rótulo en inglés. |

Si **ambos** `labelText` y `labelTextEn` están ausentes o en blanco, no se renderiza el rótulo. Si solo uno está definido, el otro toma el mismo valor (fallback) para mantener ambos idiomas en `SectionLabel`.

## Slots

| Slot | Uso |
|------|-----|
| `heading` | Contenido del `<h1>` (markup bilingüe `data-es` / `data-en`, `<em>`, etc.). |
| `default` | Cuerpo introductorio bajo el título; suele ser un `<p>` con el mismo patrón bilingüe. |

## Comportamiento

- Sección **`section-dark`** sobre `bg-slate-950`, **`min-h-screen`**, capas de fondo alineadas con el patrón visual de [`HeroSection`](./hero-section.md): `<Image />` con opacidad reducida, gradientes verticales, textura de ruido SVG y `hero-glow` (`motion-reduce:hidden` donde aplica).
- **Rendimiento / LCP:** `loading="eager"`, `fetchpriority="high"`, `decoding="async"`, `sizes="100vw"`, **`widths={[640, 768, 1024, 1280, 1536]}`** (valor fijo; no inventar otros breakpoints sin revisar uso).
- Contenedor de copy: `max-w-7xl`, columna única centrada verticalmente (`min-h-[calc(100vh-4rem)]`), tipografía clara (`text-white`, `text-slate-300`); rótulo del `SectionLabel` con `text-[var(--accent-text)]` (naranja en tema claro `html.light`, ámbar en tema oscuro por defecto).
- **No** usa `revealAlt` ni `data-alt-reveal`.

## Ejemplo `/servicios`

- Asset: `src/assets/services/hero-servicios-derecha.webp` (1536×1024).
- `alt` adoptado: banner visual del catálogo de servicios con ambiente cálido y detalle a la derecha (revisar si el asset cambia).

## Ejemplo `/talento`

- Asset: `src/assets/talento/banner-talento-naranja.webp` (1671×940).
- Rótulo (`labelText` / `labelTextEn`): línea de roles (“Analista funcional · …” / “Functional analyst · …”), no un título genérico “Perfil profesional”.
- En el cuerpo del hero, énfasis como en `/servicios`: `<em class="not-italic text-[var(--accent-text)]">…</em>` (acento naranja en claro, ámbar en oscuro vía tokens).

## Estado

Documentado
