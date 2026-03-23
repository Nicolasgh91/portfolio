# Prompt: implementación del componente SlideViewer

## Contexto

Estás trabajando en `escalatunegocioconia.com`, un sitio Astro 4.x SSG desplegado en Vercel con costo operativo $0. El stack es Astro + Tailwind CSS + tokens CSS (`src/styles/tokens.css`) + contenido MDX validado con Zod (`src/content/config.ts`). El sitio tiene colecciones `blog`, `services` y `projects`.

Se decidió implementar un componente `<SlideViewer />` que permita visualizar PDFs y presentaciones PPTX dentro de las páginas de artículos (y reutilizable en servicios/proyectos). La arquitectura elegida es **alternativa B: imágenes rasterizadas en build time**, con posibilidad de evolucionar a un híbrido con PDF.js en el futuro.

## Objetivo

Implementar un pipeline completo que:

1. Tome archivos PDF o PPTX como input
2. Los convierta a imágenes WebP optimizadas (una por página/slide) mediante un script Python
3. Los muestre en un componente Astro reutilizable con navegación por páginas

## Instrucciones de ejecución

**Seguir estrictamente esta jerarquía de implementación: Schema → Flow → UI.**

Antes de escribir cualquier código:

1. Leer `src/content/config.ts` para entender los schemas Zod actuales de las colecciones `blog`, `services` y `projects`
2. Leer `src/styles/tokens.css` para entender los tokens de diseño disponibles
3. Leer `src/pages/blog/[slug].astro` para entender cómo se renderizan los artículos
4. Leer `src/components/` para entender los patrones de componentes existentes
5. Leer `tailwind.config.mjs` para verificar configuraciones de Tailwind
6. Leer `package.json` para verificar dependencias existentes

---

## Paso 1 — Schema (Zod en config.ts)

Agregar un campo opcional `slides` a la colección `blog` en `src/content/config.ts`. Este campo representa las imágenes pre-rasterizadas de un documento.

Diseño del campo:

```typescript
slides: z.object({
  src: z.string(),           // ruta base en src/assets/slides/ (ej: "whatsapp-web-viandas")
  alt: z.string(),           // texto alt descriptivo para accesibilidad
  totalPages: z.number(),    // cantidad de páginas/slides
  sourceType: z.enum(['pdf', 'pptx']).default('pdf'),
}).optional(),
```

**Convención de archivos:** las imágenes rasterizadas se almacenan en `src/assets/slides/{src}/` con nombres `slide-01.webp`, `slide-02.webp`, etc. Astro las procesa con su pipeline de imágenes.

**Importante:**
- No romper los schemas existentes. El campo es `.optional()`
- Evaluar si tiene sentido agregar el mismo campo a `services` y `projects` ahora o dejarlo solo en `blog`. Si los schemas de esas colecciones son similares, agregarlo. Si no, solo en `blog`
- Verificar que el build pasa después de este cambio

---

## Paso 2 — Flow (script Python de conversión)

Crear `scripts/rasterize-slides.py`. Este script convierte PDFs y PPTX a imágenes WebP optimizadas.

### Requisitos funcionales

- Input: un archivo PDF o PPTX ubicado en `content-sources/slides/` (directorio en la raíz del proyecto)
- Output: imágenes WebP en `src/assets/slides/{nombre-del-archivo}/slide-01.webp`, `slide-02.webp`, etc.
- Resolución objetivo: 1280px de ancho (suficiente para pantalla completa sin ser excesivo)
- Calidad WebP: 85 (buen balance tamaño/calidad)
- El script debe imprimir al final un bloque de frontmatter listo para copiar/pegar en el MDX

### Dependencias Python

```
pymupdf (fitz)       — para renderizar PDF a imagen
python-pptx          — para leer PPTX
Pillow               — para manipulación de imagen y export WebP
```

Para PPTX, el flujo es: PPTX → exportar cada slide como imagen usando LibreOffice headless en modo batch (`libreoffice --headless --convert-to pdf`), luego PDF → imágenes con pymupdf. Alternativamente, si LibreOffice no está disponible, el script debe detectarlo e informar al usuario que instale LibreOffice o convierta el PPTX a PDF manualmente antes de ejecutar.

### Interfaz CLI

```bash
python scripts/rasterize-slides.py content-sources/slides/mi-presentacion.pdf
python scripts/rasterize-slides.py content-sources/slides/mi-presentacion.pptx
```

### Output esperado en consola

```
Procesando: mi-presentacion.pdf
  → Página 1/12 → src/assets/slides/mi-presentacion/slide-01.webp (47 KB)
  → Página 2/12 → src/assets/slides/mi-presentacion/slide-02.webp (52 KB)
  ...
  → 12 páginas procesadas. Total: 583 KB

Frontmatter para copiar en tu MDX:
---
slides:
  src: "mi-presentacion"
  alt: "Presentación mi-presentacion"
  totalPages: 12
  sourceType: pdf
---
```

### Estructura de directorios resultante

```
content-sources/
└── slides/
    └── mi-presentacion.pdf        ← archivo fuente (no se commitea, agregar a .gitignore)

src/assets/slides/
└── mi-presentacion/
    ├── slide-01.webp              ← se commitea, Astro las optimiza en build
    ├── slide-02.webp
    └── ...
```

**Importante:**
- Agregar `content-sources/` a `.gitignore` (archivos fuente pesados no van al repo)
- Las imágenes en `src/assets/slides/` sí se commitean (Astro las necesita en build)
- El script debe ser idempotente: si se ejecuta dos veces, sobreescribe sin duplicar

---

## Paso 3 — UI (componente Astro)

Crear `src/components/SlideViewer.astro`.

### Props

```typescript
interface Props {
  src: string;           // nombre de la carpeta en src/assets/slides/
  alt: string;           // texto alt base (se sufija con " - página N")
  totalPages: number;    // cantidad de slides
  class?: string;        // clases adicionales opcionales
}
```

### Comportamiento

- Renderiza la primera slide como imagen visible, las demás con lazy loading
- Navegación: botones prev/next + indicador de página ("3 / 12")
- Navegación por teclado: flechas izquierda/derecha
- Swipe en mobile (touch events básicos, sin librería)
- Todas las imágenes se importan dinámicamente con `import.meta.glob` de Astro/Vite para pasar por el pipeline de optimización
- El componente usa `client:visible` para hidratar solo cuando es visible en viewport

### Diseño visual

- Respetar los tokens de diseño del sitio (`tokens.css`):
  - Fondo del visor: `var(--bg-secondary)`
  - Bordes: `var(--border-subtle)`
  - Botones de navegación: fondo `var(--bg-tertiary)` con hover `var(--color-accent-400)`
  - Texto del indicador de página: `var(--text-secondary)`
  - Radio de bordes: `var(--radius-lg)` para el contenedor
- El visor debe tener aspect ratio 16:9 por defecto (ajustable vía prop si se necesita en el futuro)
- Los botones prev/next deben estar superpuestos sobre la imagen (posicionados a los lados), con opacidad reducida que aumenta en hover
- En mobile, los botones deben ser más grandes (touch-friendly, mínimo 44x44px)
- Transición entre slides: fade suave de 200ms

### Uso en MDX

El componente se usa dentro de los artículos MDX así:

```mdx
import SlideViewer from '../../components/SlideViewer.astro';

<SlideViewer
  src="mi-presentacion"
  alt="Presentación sobre automatización de pedidos"
  totalPages={12}
/>
```

### Accesibilidad

- `role="region"` con `aria-label="Visor de presentación: {alt}"`
- `aria-live="polite"` en el indicador de página
- Botones con `aria-label="Página anterior"` / `aria-label="Página siguiente"`
- Imágenes con alt text descriptivo: `"{alt} - página {n} de {total}"`
- Focus visible en los controles de navegación

---

## Paso 4 — Integración en la página de artículos

Verificar cómo se renderizan los artículos en `src/pages/blog/[slug].astro`. El componente `<SlideViewer />` se usa directamente en el MDX de cada artículo, no requiere cambios en la página de detalle. Sin embargo, verificar que:

1. El layout del artículo tiene ancho suficiente para que el visor se vea bien (idealmente full-width del contenedor del artículo, breakout si es posible)
2. Si el artículo tiene `slides` en el frontmatter, considerar mostrar un indicador visual en el `BlogCard` del listado (ej: un ícono de presentación) — esto es opcional y de baja prioridad

---

## Validación final

Antes de dar por terminada la implementación:

1. Verificar que `npm run build` (o `astro build`) pasa sin errores
2. Crear un artículo de prueba con slides ficticias (3 imágenes WebP de placeholder) para validar el flujo completo
3. Verificar que el componente funciona en mobile (responsive)
4. Verificar que las imágenes pasan por el pipeline de Astro (se generan en formatos optimizados)
5. Verificar navegación por teclado y swipe
6. Eliminar el artículo de prueba después de validar

---

## Restricciones

- **No usar `<img>` HTML.** Solo `<Image />` de `astro:assets` o `import.meta.glob` para imágenes
- **No agregar dependencias JS de cliente** (no Swiper, no Splide, no ningún carrusel). La navegación se implementa con JS vanilla mínimo
- **No usar `<style>` blocks en el componente.** Solo utilidades Tailwind y variables CSS de tokens
- **No romper schemas existentes.** Todo campo nuevo es `.optional()`
- **El script Python debe funcionar en Linux y macOS** (el entorno de desarrollo usa WSL)
- **Mantener el patrón de componentes existente** del proyecto (revisar otros componentes antes de crear)
