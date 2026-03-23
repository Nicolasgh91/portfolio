# Plan de acción — refactor UI de `blog/[slug].astro`

*Documento técnico para el agente de código. 6 tareas ordenadas por dependencia.*

*Fecha: 2026-03-23*

---

## Contexto

La página de detalle de artículo (`src/pages/blog/[slug].astro`) presenta 6 problemas de UI/UX detectados en auditoría visual. Este plan define las tareas técnicas en orden de ejecución, respetando la jerarquía schema → flow → API → UI del proyecto.

**Stack relevante:** Astro 4.x SSG, Tailwind CSS + tokens CSS (`src/styles/tokens.css`), colección `blog` validada con Zod en `config.ts`.

**Tokens de diseño activos (referencia):**

```
Fondos:    --bg-primary (hsl 240,10%,6%)  --bg-secondary (240,9%,9%)  --bg-tertiary (240,11%,12%)
Textos:    --text-primary (240,11%,96%)  --text-secondary (240,9%,60%)  --text-muted (240,6%,35%)
Bordes:    --border-subtle (white 6%)  --border-normal (white 11%)  --border-strong (white 19%)
Accent:    --color-accent-400 (hsl 43,96%,56%)
Radios:    --radius-sm 6px  --radius-md 10px  --radius-lg 14px  --radius-xl 20px
Fuentes:   --font-display: Outfit  --font-body: Inter  --font-mono: JetBrains Mono
```

**Regla de estilos:** solo utilidades Tailwind. Prohibido mezclar con `<style>` locales o CSS tradicional (ver `.cursorrules` §4).

---

## Dependencias entre tareas

```
TAREA-01 (ImageCarousel)          → independiente
TAREA-02 (layout grid + TOC)      → independiente
TAREA-03 (underline TOC)          → depende de TAREA-02
TAREA-04 (tags al footer)         → depende de TAREA-02
TAREA-05 (ShareBar)               → depende de TAREA-02 (posición relativa al grid)
TAREA-06 (TableWrapper)           → independiente
```

**Orden de ejecución:** 01 → 02 → 03 → 04 → 05 → 06

---

## TAREA-01 — Componente ImageCarousel (P0 — roto)

**Problema:** el slider actual muestra solo la primera imagen. El contador "1/15" se renderiza sobre una franja blanca vacía. No hay navegación ni swipe.

**Causa raíz probable:** el contenedor no tiene height explícito, los hijos están en `overflow: hidden` sin lógica de scroll, o el JS de navegación no se inicializa.

### Archivos

| Acción | Ruta |
|---|---|
| Crear | `src/components/blog/ImageCarousel.astro` |
| Modificar | `src/pages/blog/[slug].astro` (reemplazar slider actual por `<ImageCarousel />`) |

### Especificación técnica

**Props del componente:**

```typescript
interface Props {
  images: { src: string; alt: string }[];  // array de imágenes del artículo
  aspectRatio?: string;                     // default: "aspect-video"
}
```

**Arquitectura interna (CSS scroll-snap, cero dependencias):**

```
<div class="relative overflow-hidden rounded-xl">       ← contenedor principal con height explícito

  <div class="flex overflow-x-auto snap-x snap-mandatory
              scrollbar-hide scroll-smooth">             ← track horizontal
    {images.map((img, i) => (
      <div class="w-full flex-shrink-0 snap-start">     ← cada slide ocupa 100%
        <Image src={img.src} alt={img.alt}
               class="w-full h-full object-cover" />    ← usar astro:assets, NO <img>
      </div>
    ))}
  </div>

  <!-- Flechas prev/next -->
  <button data-carousel="prev"
          class="absolute left-3 top-1/2 -translate-y-1/2
                 w-10 h-10 rounded-full bg-bg-primary/70 backdrop-blur
                 flex items-center justify-center
                 text-text-primary hover:bg-bg-tertiary transition
                 opacity-0 group-hover:opacity-100">     ← visibles en hover
    ‹
  </button>
  <button data-carousel="next"> › </button>

  <!-- Contador -->
  <div class="absolute bottom-3 right-3
              bg-bg-primary/70 backdrop-blur rounded-full
              px-3 py-1 text-xs text-text-secondary">
    <span data-carousel="current">1</span>/<span data-carousel="total">{images.length}</span>
  </div>

</div>
```

**Lógica JS (inline `<script>` con directiva Astro, o `client:visible`):**

1. Obtener el track (`overflow-x-auto`).
2. Botón next: `track.scrollBy({ left: track.clientWidth, behavior: 'smooth' })`.
3. Botón prev: `track.scrollBy({ left: -track.clientWidth, behavior: 'smooth' })`.
4. `IntersectionObserver` en cada slide (`threshold: 0.5`) para actualizar el contador.
5. Ocultar flecha prev en slide 1, ocultar flecha next en último slide.

**Validaciones:**

- Si `images.length === 0`: no renderizar nada.
- Si `images.length === 1`: renderizar imagen sola sin flechas ni contador.
- Clase `scrollbar-hide` (Tailwind plugin o utility manual): `scrollbar-width: none; -ms-overflow-style: none; &::-webkit-scrollbar { display: none }`.

**Soporte touch:** `scroll-snap` funciona nativamente con swipe en iOS/Android. No se necesita JS para gestos táctiles.

**Accesibilidad:**

- `role="region"` y `aria-label="Galería de imágenes"` en el contenedor.
- `aria-label="Imagen anterior"` / `"Imagen siguiente"` en botones.
- `aria-live="polite"` en el contador.

### Criterios de aceptación

- [ ] Las N imágenes se muestran y son navegables con flechas y swipe.
- [ ] El contador refleja la imagen visible en viewport.
- [ ] Sin franja blanca. El contenedor tiene height consistente.
- [ ] Usa `<Image />` de `astro:assets`, no `<img>`.
- [ ] Funciona en mobile (touch) y desktop (flechas + click).

---

## TAREA-02 — Layout grid con TOC sticky en sidebar (P1)

**Problema:** la columna lateral derecha muestra tags/categoría — información de baja utilidad durante la lectura. El espacio se desperdicia. El lector pierde orientación en artículos largos.

### Archivos

| Acción | Ruta |
|---|---|
| Crear | `src/components/blog/TableOfContents.astro` |
| Modificar | `src/pages/blog/[slug].astro` (reestructurar layout a grid 2 columnas) |

### Especificación técnica

**Nuevo layout del slug page:**

```
<div class="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-10 max-w-6xl mx-auto px-4">

  <!-- Columna principal -->
  <article class="min-w-0">                    ← min-w-0 evita overflow en code blocks
    <header>
      <!-- Título, fecha, reading time, imagen cover -->
      <!-- En mobile: TOC colapsable aquí (ver abajo) -->
    </header>
    <div class="prose">
      <slot />                                  ← contenido MDX renderizado
    </div>
    <footer>
      <!-- Tags + share (TAREA-04 y TAREA-05) -->
    </footer>
  </article>

  <!-- Sidebar — solo desktop -->
  <aside class="hidden lg:block">
    <TableOfContents headings={headings} />
  </aside>

</div>
```

**Props de TableOfContents:**

```typescript
interface Props {
  headings: { depth: number; slug: string; text: string }[];
}
```

Nota: Astro expone `headings` en las entradas MDX vía `entry.render()`. Extraer del resultado de `render()` y pasar como prop.

**Estructura del componente TOC:**

```
<nav class="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto"
     aria-label="Índice del artículo">

  <p class="text-[11px] uppercase tracking-widest text-text-muted mb-4
            font-semibold">
    En este artículo
  </p>

  <ul class="space-y-1 text-[13px] border-l border-border-subtle">
    {headings
      .filter(h => h.depth === 2 || h.depth === 3)
      .map(h => (
        <li class={h.depth === 3 ? 'ml-4' : ''}>
          <a href={`#${h.slug}`}
             data-toc-link={h.slug}
             class="block py-1.5 pl-4 -ml-px border-l border-transparent
                    text-text-secondary no-underline
                    hover:text-accent-400 hover:border-accent-400
                    transition-colors duration-200">
            {h.text}
          </a>
        </li>
    ))}
  </ul>

</nav>
```

**Lógica JS — highlight del heading activo:**

```javascript
// En un <script> al final del componente o client:visible
const links = document.querySelectorAll('[data-toc-link]');
const headings = document.querySelectorAll('article h2, article h3');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      links.forEach(link => {
        const isActive = link.dataset.tocLink === id;
        link.classList.toggle('text-accent-400', isActive);
        link.classList.toggle('border-accent-400', isActive);
        link.classList.toggle('font-medium', isActive);
        link.classList.toggle('text-text-secondary', !isActive);
        link.classList.toggle('border-transparent', !isActive);
      });
    }
  });
}, { rootMargin: '-80px 0px -70% 0px', threshold: 0 });

headings.forEach(h => observer.observe(h));
```

`rootMargin: '-80px 0px -70% 0px'` significa: el heading se considera "activo" cuando cruza el 30% superior del viewport (debajo del nav fijo).

**Comportamiento mobile (< lg):**

Renderizar un acordeón colapsable debajo del header del artículo:

```
<details class="lg:hidden border border-border-subtle rounded-lg p-4 mb-8">
  <summary class="text-sm font-medium text-text-secondary cursor-pointer">
    Índice del artículo
  </summary>
  <ul class="mt-3 space-y-1.5 text-sm">
    <!-- mismos links que el TOC desktop -->
  </ul>
</details>
```

### Criterios de aceptación

- [ ] Desktop (≥1024px): artículo a la izquierda, TOC sticky a la derecha.
- [ ] TOC se mantiene fijo al scrollear y acompaña el contenido.
- [ ] El heading visible se resalta con accent y borde izquierdo.
- [ ] Mobile: TOC aparece como acordeón colapsable debajo del título.
- [ ] Sidebar anterior (tags/categoría) queda eliminada de esa posición.
- [ ] `min-w-0` en la columna principal para evitar overflow de bloques de código.

---

## TAREA-03 — Eliminar underline en links del TOC (P1)

**Problema:** los links del índice tienen `text-decoration: underline` por defecto, innecesario en un contexto de navegación.

### Archivos

| Acción | Ruta |
|---|---|
| Modificar | `src/components/blog/TableOfContents.astro` (creado en TAREA-02) |

### Especificación

Si TAREA-02 se ejecutó correctamente, los links ya tienen `no-underline` en sus clases. Esta tarea es una **verificación** de que:

1. No existe ninguna regla CSS global en `tokens.css` o Tailwind base que fuerce `text-decoration: underline` sobre `nav a` o `aside a`.
2. Si existe, agregar en `tailwind.config.mjs` dentro de `@layer base`:

```css
nav a, aside a { text-decoration: none; }
```

O preferiblemente, usar `@apply no-underline` en el componente.

3. Verificar que los links dentro del `prose` (contenido MDX) sigan manteniendo underline para accesibilidad (solo los del TOC pierden el underline).

### Criterio de aceptación

- [ ] Links del TOC sin underline en todos los estados (normal, hover, active, focus).
- [ ] Links dentro del cuerpo del artículo (`prose`) mantienen underline.

---

## TAREA-04 — Mover tags al footer del artículo (P1)

**Problema:** las etiquetas debajo del primer párrafo interrumpen la lectura. Deben moverse al final del artículo como enlaces a las páginas de taxonomía.

### Archivos

| Acción | Ruta |
|---|---|
| Crear | `src/components/blog/ArticleFooter.astro` |
| Modificar | `src/pages/blog/[slug].astro` (quitar tags de la posición actual, agregar `<ArticleFooter />` después del contenido) |

### Especificación técnica

**Props:**

```typescript
interface Props {
  tags: string[];
  category: string;
  pubDate: Date;
}
```

**Estructura:**

```
<footer class="mt-16 pt-8 border-t border-border-subtle">

  <!-- Categoría -->
  <a href={`/blog/categoria/${category}`}
     class="inline-block text-xs uppercase tracking-widest text-text-muted
            hover:text-accent-400 transition-colors no-underline mb-4">
    {category}
  </a>

  <!-- Tags como pills -->
  <div class="flex flex-wrap gap-2">
    {tags.map(tag => (
      <a href={`/blog/etiqueta/${tag}`}
         class="inline-flex items-center px-3 py-1 rounded-full
                text-xs text-text-secondary
                bg-bg-tertiary/50 border border-border-subtle
                hover:border-accent-400/30 hover:text-accent-400
                transition-all duration-200 no-underline">
        #{tag}
      </a>
    ))}
  </div>

</footer>
```

### Criterios de aceptación

- [ ] Tags eliminados de la posición original (debajo del primer párrafo o sidebar).
- [ ] Tags visibles al final del artículo, antes de cualquier sección de artículos relacionados.
- [ ] Cada tag es un link funcional a `/blog/etiqueta/[tag]`.
- [ ] Categoría es un link funcional a `/blog/categoria/[category]`.

---

## TAREA-05 — Componente ShareBar (P1)

**Problema:** iconos de compartir genéricos, poco prominentes, sin diseño coherente.

### Archivos

| Acción | Ruta |
|---|---|
| Crear | `src/components/blog/ShareBar.astro` |
| Modificar | `src/pages/blog/[slug].astro` (insertar `<ShareBar />` en el footer del artículo, debajo de tags) |

### Especificación técnica

**Props:**

```typescript
interface Props {
  title: string;
  url: string;       // URL completa del artículo
  description: string;
}
```

**Redes:** X (Twitter), LinkedIn, WhatsApp, copiar enlace.

**Layout:**

- **Desktop (≥1024px):** barra horizontal dentro del footer del artículo, debajo de los tags. Alineada a la izquierda.
- **Mobile:** misma posición (dentro del footer). No usar barra flotante fija para evitar conflicto con el chatbot widget que ocupa `position: fixed; bottom: 0; right: 0`.

**Estructura:**

```
<div class="flex items-center gap-1 mt-6">
  <span class="text-xs text-text-muted mr-2">Compartir</span>

  {/* X (Twitter) */}
  <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
     target="_blank" rel="noopener noreferrer"
     aria-label="Compartir en X"
     class="share-icon group">
    <svg><!-- icono X --></svg>
  </a>

  {/* LinkedIn */}
  <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
     target="_blank" rel="noopener noreferrer"
     aria-label="Compartir en LinkedIn"
     class="share-icon group">
    <svg><!-- icono LinkedIn --></svg>
  </a>

  {/* WhatsApp */}
  <a href={`https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`}
     target="_blank" rel="noopener noreferrer"
     aria-label="Compartir en WhatsApp"
     class="share-icon group">
    <svg><!-- icono WhatsApp --></svg>
  </a>

  {/* Copiar enlace */}
  <button data-copy-url={url}
          aria-label="Copiar enlace"
          class="share-icon group">
    <svg><!-- icono link/clipboard --></svg>
  </button>
</div>
```

**Clase utilitaria `share-icon` (definir en Tailwind config o como clase inline repetida):**

```
w-9 h-9 rounded-lg flex items-center justify-center
text-text-muted
hover:bg-bg-tertiary hover:text-text-primary
transition-all duration-200
```

**Hover con color de marca por red (opcional, vía `group-hover`):**

- X: `group-hover:text-white`
- LinkedIn: `group-hover:text-[#0A66C2]`
- WhatsApp: `group-hover:text-[#25D366]`
- Copiar: `group-hover:text-accent-400`

**JS para copiar enlace:**

```javascript
document.querySelector('[data-copy-url]')?.addEventListener('click', async (e) => {
  const url = e.currentTarget.dataset.copyUrl;
  await navigator.clipboard.writeText(url);
  // Feedback: cambiar icono a ✓ por 2 segundos
  const icon = e.currentTarget.querySelector('svg');
  icon.classList.add('text-green-400');
  setTimeout(() => icon.classList.remove('text-green-400'), 2000);
});
```

**SVGs:** usar iconos inline de 18×18 o 20×20. No cargar librerías de iconos. Copiar paths SVG de las marcas oficiales (X, LinkedIn, WhatsApp) + un icono genérico de link para copiar.

### Criterios de aceptación

- [ ] 4 iconos visibles: X, LinkedIn, WhatsApp, copiar enlace.
- [ ] Cada link abre en nueva pestaña con `rel="noopener noreferrer"`.
- [ ] Botón copiar escribe la URL al clipboard y muestra feedback visual.
- [ ] `aria-label` descriptivo en cada botón/link.
- [ ] No genera conflicto visual con el chatbot widget (no usar `position: fixed`).

---

## TAREA-06 — Componente TableWrapper para MDX (P2)

**Problema:** las tablas dentro de artículos MDX tienen estilo por defecto del markdown, sin diseño coherente con el sistema de tokens del sitio. En mobile desbordan sin scroll.

### Archivos

| Acción | Ruta |
|---|---|
| Crear | `src/components/mdx/TableWrapper.astro` |
| Modificar | `astro.config.mjs` (mapear tag `<table>` al componente en la config de MDX) |

### Especificación técnica

**Objetivo:** interceptar globalmente todas las tablas renderizadas por MDX y envolverlas en un wrapper con scroll horizontal, bordes y estilos consistentes. Aplica retroactivamente a todos los artículos sin modificar archivos MDX.

**Mapeo global en `astro.config.mjs`:**

```javascript
// En la configuración de Astro, dentro de markdown o mdx:
export default defineConfig({
  // ...
  markdown: {
    // si se usa remark/rehype custom, evaluar integración
  },
});
```

Alternativa más limpia: en `src/pages/blog/[slug].astro`, al renderizar el contenido MDX, pasar el componente como override:

```astro
---
const { Content, headings } = await entry.render();
import TableWrapper from '@/components/mdx/TableWrapper.astro';
---
<Content components={{ table: TableWrapper }} />
```

Esto intercepta cada `<table>` del MDX y lo envuelve en `TableWrapper` sin tocar los archivos MDX.

**Estructura del componente:**

```
<!-- src/components/mdx/TableWrapper.astro -->
---
// No necesita props: recibe children vía slot (el <table> original)
---

<div class="my-8 overflow-x-auto rounded-xl border border-border-subtle
            bg-bg-secondary/30">
  <table class="w-full text-sm text-left">
    <slot />
  </table>
</div>

<!-- Nota: verificar si Astro pasa el contenido del <table> (thead, tbody, tr, td)
     como children del slot, o si pasa el <table> completo.
     Si pasa el <table> completo, el wrapper debe ser solo el <div> y NO incluir
     un <table> adicional para evitar tabla anidada. Testear. -->
```

**Estilos de las celdas (vía Tailwind plugin o `@layer`):**

Dado que no se puede poner clases directamente en los `<th>` y `<td>` generados por MDX, definir estilos vía selector descendente en `tailwind.config.mjs` o en una capa base:

```css
/* En @layer base o como plugin de Tailwind */
.prose table th {
  @apply px-4 py-3 text-xs uppercase tracking-wider text-text-muted
         font-semibold bg-bg-tertiary/50 border-b border-border-normal;
}

.prose table td {
  @apply px-4 py-3 text-text-secondary border-b border-border-subtle;
}

.prose table tbody tr:hover {
  @apply bg-white/[0.03];
}

/* Stripe alternado (opcional) */
.prose table tbody tr:nth-child(even) {
  @apply bg-white/[0.02];
}
```

**Indicador de scroll (mobile):**

Si la tabla desborda horizontalmente, mostrar un gradiente sutil en el borde derecho como indicador de "hay más contenido":

```css
.table-scroll-indicator {
  position: relative;
}
.table-scroll-indicator::after {
  content: '';
  position: absolute;
  right: 0; top: 0; bottom: 0;
  width: 40px;
  background: linear-gradient(to right, transparent, var(--bg-primary));
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s;
}
.table-scroll-indicator[data-overflows="true"]::after {
  opacity: 1;
}
```

JS mínimo: en mount, comprobar si `scrollWidth > clientWidth`. Si sí, agregar `data-overflows="true"`. Observar resize.

**Nota sobre la regla de solo Tailwind:** los estilos de `th`/`td` requieren selectores descendentes porque MDX genera HTML sin clases. Esto es una excepción justificada. Documentar en el componente con comentario: `/* Excepción: selectores descendentes necesarios para celdas generadas por MDX */`.

### Criterios de aceptación

- [ ] Todas las tablas de artículos existentes se renderizan con el nuevo estilo sin editar MDX.
- [ ] Scroll horizontal funcional en mobile con indicador visual.
- [ ] Header de tabla diferenciado (fondo tertiary, texto muted, uppercase).
- [ ] Filas con hover sutil y stripe alternado.
- [ ] Bordes coherentes con el sistema de tokens.
- [ ] Sin tabla anidada (verificar comportamiento de `components={{ table: TableWrapper }}`).

---

## Resumen de entregables

| Tarea | Archivos nuevos | Archivos modificados | Prioridad |
|---|---|---|---|
| 01 — ImageCarousel | `src/components/blog/ImageCarousel.astro` | `src/pages/blog/[slug].astro` | P0 |
| 02 — TOC sticky + layout grid | `src/components/blog/TableOfContents.astro` | `src/pages/blog/[slug].astro` | P1 |
| 03 — Sin underline en TOC | — | `TableOfContents.astro` (verificación) | P1 |
| 04 — Tags al footer | `src/components/blog/ArticleFooter.astro` | `src/pages/blog/[slug].astro` | P1 |
| 05 — ShareBar | `src/components/blog/ShareBar.astro` | `src/pages/blog/[slug].astro` | P1 |
| 06 — TableWrapper | `src/components/mdx/TableWrapper.astro` | `astro.config.mjs` o `[slug].astro` | P2 |

**Total:** 5 componentes nuevos, 2 archivos modificados.

## Estructura de carpetas resultante

```
src/components/
├── blog/
│   ├── ImageCarousel.astro      ← TAREA-01
│   ├── TableOfContents.astro    ← TAREA-02
│   ├── ArticleFooter.astro      ← TAREA-04
│   └── ShareBar.astro           ← TAREA-05
├── mdx/
│   └── TableWrapper.astro       ← TAREA-06
├── BlogCard.astro               (existente)
├── ServiceCard.astro            (existente)
├── Nav.astro                    (existente)
├── TaxonomyFilter.astro         (existente)
└── ContactForm.astro            (existente)
```

## Checklist pre-implementación

Antes de comenzar, el agente debe:

1. Leer `src/content/config.ts` para confirmar campos disponibles en la colección `blog` (headings, tags, category).
2. Leer `src/pages/blog/[slug].astro` completo para entender el layout actual y dónde están las tags hoy.
3. Leer `src/styles/tokens.css` para usar variables CSS correctas.
4. Leer `tailwind.config.mjs` para verificar si existe configuración de `prose` o plugins custom.
5. Verificar si existe un slider/carousel previo en `src/components/` para entender qué reemplazar.
6. Verificar cómo se extraen los `headings` del `entry.render()` en Astro para pasarlos al TOC.
