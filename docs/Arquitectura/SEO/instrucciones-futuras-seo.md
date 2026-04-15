# Instrucciones y Aprendizajes SEO para Modificaciones Futuras

Documento de referencia para mantener un enfoque SEO (performance, datos estructurados, jerarquía de headings y accesibilidad) en cualquier cambio futuro.

## Fuentes (aprendizajes de tareas recientes)

- [docs/backlog/SEO/tarea-p1-self-hosting-fuentes.md](docs/backlog/SEO/tarea-p1-self-hosting-fuentes.md)
- [docs/backlog/SEO/tarea-p2-jsonld-article.md](docs/backlog/SEO/tarea-p2-jsonld-article.md)
- [docs/backlog/SEO/tarea-p3-headings-contraste.md](docs/backlog/SEO/tarea-p3-headings-contraste.md)
- [docs/backlog/SEO/tareas-p4-p5-issues-pendientes.md](docs/backlog/SEO/tareas-p4-p5-issues-pendientes.md)

## Propósito y alcance

- Usar este documento antes de abrir PRs o aplicar cambios que toquen: `Layout`, estilos de tipografía, rutas de blog (`/blog/[slug]`, `/blog/categoria/[category]`, `/blog/etiqueta/[tag]`) o componentes de navegación/cars.
- La meta es prevenir regresiones que afecten: Core Web Vitals, Rich Results (JSON-LD), Lighthouse Accessibility y calidad semántica del HTML.
  |

## Regla de arquitectura (para decidir dónde tocar)

Mantener la siguiente jerarquía en cambios futuros:

1. Schema (datos puros en `src/content/`, validados con Zod en `config.ts`)
2. Flow Logic (obtención y armado de datos en `src/pages/`)
3. Containers (si aplica: lógica de composición)
4. API (adaptadores/edge functions; nunca llamadas desde el frontend con claves)
5. UI (presentación en `src/components/`)

Cuando un cambio afecte SEO, colocar la lógica en el nivel correcto:

- JSON-LD depende del `frontmatter` (datos) y se inyecta en la **página de blog**.
- Jerarquía de headings se corrige en la **página contenedora** (no en los cards).
- Fuentes se controlan en **CSS/tokens** y `Layout` solo orquesta head si aplica.

## Performance: self-hosting de fuentes (obligatorio)

### Regla

- No cargar fuentes desde `fonts.googleapis.com` o `fonts.gstatic.com`.
- Migrar a self-hosting usando `@fontsource-variable` en `src/styles/tokens.css`.

### Restricciones

- En `src/styles/tokens.css`, las importaciones de fuentes deben ir al inicio del archivo, antes de otras reglas.
- Actualizar los tokens de tipografía para reflejar variable fonts:
  - `--font-display: 'Outfit Variable'`
  - `--font-body: 'Inter Variable'`
- No modificar otros tokens de tipografía excepto los indicados por esta regla.
- No eliminar `--font-mono` (esas fuentes son del sistema y no requieren instalación).
- No agregar `font-display: swap` manualmente; `@fontsource-variable` ya lo incluye.

### Verificación

1. Correr `npm run dev`.
2. En DevTools, pestaña Network, filtrar por `font`.
3. Confirmar que:
   - Las descargas son `.woff2` servidas desde `localhost` (o dominio del build), no desde Google Fonts.
   - No aparecen requests a `fonts.googleapis.com`.

### Punto de control

- `src/layouts/Layout.astro`: eliminar el bloque de `<link>` preconnect/preload/styles de Google Fonts. No reemplazarlo por nada.

## SEO/GEO: JSON-LD `Article` en páginas de blog (obligatorio)

### Regla

- Inyectar un `<script type="application/ld+json">` con `slot="head"` en `src/pages/blog/[slug].astro`.
- El `<script>` debe ser **hijo directo** del componente `Layout` (para que Astro eleve correctamente el slot).

### Campos y origen

- Construir el objeto usando los campos validados por Zod disponibles en `entry.data.*`:
  - `title`, `description`, `pubDate`, `tags`, `readingTime?`, `coverImage?`.

### Reglas críticas (anti-regresión)

- No crear un componente separado solo para JSON-LD si la variable puede vivir en el frontmatter/página.
- No usar `JSON.stringify` con indentación en producción (evitar bytes extra).
- No duplicar JSON-LD de `Person` si ya existe en `Layout`; los schemas se agregan de forma aditiva.

### Verificación

1. Navegar a un artículo en desarrollo (ej. `/blog/analista-funcional-era-ia`).
2. En DevTools, inspeccionar `<head>` y confirmar que existe:
   - Un `<script type="application/ld+json">` con un objeto `TechArticle`.
   - `datePublished` con formato ISO 8601 (`toISOString()`).
   - `timeRequired` solo si existe `readingTime` en frontmatter.
3. Probar en producción con `https://search.google.com/test/rich-results`.

### Punto de control

- Solo `src/pages/blog/[slug].astro` debe manejar esta inyección.

## Accesibilidad que impacta SEO

### Jerarquía de headings (obligatoria)

### Regla por página

- La jerarquía válida debe cumplir:
  - `<h1>` único de la ruta
  - `<h2>` para cada sección principal
  - `<h3>` para títulos internos de cards o subsecciones

### Dónde aplicar correcciones

- Corregir jerarquía en las **páginas contenedoras** que renderizan `BlogCard.astro` y/o `ServiceCard.astro`.
- No modificar el nivel de headings dentro de:
  - `src/components/BlogCard.astro`
  - `src/components/ServiceCard.astro`

### Restricción clave

- Evitar saltos `h1 -> h3` sin `h2` intermedio.

### Verificación

1. Correr `npm run dev`.
2. Lighthouse Accessibility.
3. Confirmar ausencia de warnings del tipo:
   - “Heading elements are not in a sequentially-descending order”.

### Contraste de color (WCAG AA)

### Regla

- Mantener contraste suficiente en modo oscuro para:
  - fecha y tiempo dentro de `BlogCard.astro`
  - descripciones/tipografía secundaria dentro de `ServiceCard.astro`
  - token global `--text-muted` en `src/styles/tokens.css`

### Restricción de corrección

- Si un elemento es decorativo y ya tiene `aria-hidden="true"`, puede no exigir contraste funcional (mantener consistencia con el HTML existente).

### Verificación

1. Lighthouse Accessibility.
2. Confirmar que no aparecen warnings de contraste WCAG AA.

## Issues ARIA y headings residuales (P4 y P5)

### ARIA en navegación (obligatorio)

### Regla

- No usar `role="list"` + `role="listitem"` en `<a>`.
- En `src/components/Nav.astro`, reemplazar el patrón por lista HTML nativa:
  - `<ul>` y `<li>` con el `<a>` dentro.

### Ajuste CSS requerido

- Reset de estilos por defecto de `<ul>/<li>`.
- Usar `display: contents` en `<li>` para que el layout con flex se mantenga.

### Verificación

1. Lighthouse Accessibility.
2. Confirmar ausencia de: “Uses ARIA roles only on compatible elements”.

### Heading residual en rutas dinámicas (obligatorio)

- En `src/pages/blog/categoria/[category].astro`, agregar un `<h2>` con el nombre de la categoría antes del grid de posts dentro del mismo `<section>`.
- En `src/pages/blog/etiqueta/[tag].astro`, aplicar el mismo patrón con el `<h2>` del tag.

### Verificación

1. Visitar una categoría (ej. `/blog/categoria/arquitectura`) y una etiqueta.
2. Confirmar que el árbol de headings queda `h1 -> h2 -> h3` sin saltos.

## Checklist de PR (anti-regresiones)

Antes de aceptar un cambio que pueda afectar SEO, verificar:

- Performance: no hay requests a Google Fonts (self-host) y `tokens.css` conserva los tokens obligatorios.
- Rich Results: en páginas de blog `/blog/[slug]` existe JSON-LD `TechArticle` en `<head>` (script con slot correcto y sin indentación extra).
- Accessibility: Lighthouse Accessibility sin warnings críticas de headings y roles ARIA.
- HTML headings: sin saltos `h1 -> h3` sin `h2` intermedio.
- Contraste: sin fallos WCAG AA para `--text-muted`, fecha/tiempo (BlogCard) y descripción secundaria (ServiceCard).
