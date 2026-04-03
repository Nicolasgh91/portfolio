Ahora tengo todo el contexto necesario. El prompt a continuación está listo para pasarlo directamente al agente.

---

## Prompt para el agente de código

```
# Tarea: implementar página /plantillas con carrusel corregido

## Contexto del proyecto
- Stack: Astro SSG + Tailwind CSS + TypeScript + MDX, deployado en Vercel.
- Archivo de diseño: `src/styles/tokens.css` es el único source of truth de tokens globales.
- Regla absoluta de estilos: solo utilidades Tailwind. Los bloques `<style>` locales
  están prohibidos salvo para `Nav.astro` (excepción documentada). Cualquier clase
  reutilizable va en `tokens.css` bajo `@layer components`.
- Fuentes: solo `@fontsource-variable`. Prohibido importar desde Google Fonts.
- Imágenes: solo `<Image />` de `astro:assets`. La etiqueta `<img>` está prohibida.
- Comandos npm: siempre vía WSL (`wsl npm ...`).
- Toda modificación de componente o esquema requiere actualizar su doc en `docs/`
  en la misma tarea (regla atómica). Los cambios que generen deuda deben registrarse
  en `docs/deuda-tecnica.md`.

---

## Orden de ejecución obligatorio

Ejecutar estrictamente en este orden. No invertir.

### Paso 1 — Schema

1.1 Abrir `src/data/landing-templates.ts` y verificar que el tipo de cada entrada
    incluye los siguientes campos. Agregar los que falten sin eliminar los existentes:

    ```ts
    status: 'available' | 'coming_soon'
    vertical: 'gastronomia' | 'profesionales' | 'contenido' | 'ecommerce' | 'salud' | 'inmobiliaria'
    description: string
    coverImage: ImageMetadata   // importada desde src/assets/templates/, NO string URL
    slug: string
    ```

1.2 Abrir `src/data/pricing.json`. Si no existe, crearlo. Debe contener exactamente
    tres planes con esta estructura mínima:

    ```json
    [
      {
        "id": "basico",
        "name": "Básico",
        "label": null,
        "price": 30000,
        "frequency": "pago único por página",
        "description": "One-page lista para vender",
        "recommended": false,
        "features": [
          "Diseño one-page responsive",
          "Formulario de contacto + WhatsApp",
          "SEO básico (title, meta, OG)",
          "Deploy en Vercel (hosting incluido)",
          "1 ronda de revisión"
        ]
      },
      {
        "id": "plantilla",
        "name": "Plantilla disponible",
        "label": "Recomendado",
        "price": 70000,
        "frequency": "por única vez — primer mes de mantenimiento incluido",
        "description": "Diseño listo para personalizar",
        "recommended": true,
        "features": [
          "Todo lo del plan básico",
          "Catálogo visual por categorías",
          "Chatbot IA integrado",
          "JSON-LD para fragmentos enriquecidos",
          "Google Business optimizado",
          "3 rondas de revisión"
        ]
      },
      {
        "id": "full",
        "name": "Full",
        "label": null,
        "price": 85000,
        "frequency": "mensual",
        "description": "Sitio a medida con mantenimiento",
        "recommended": false,
        "features": [
          "Sitio a medida completo",
          "Mantenimiento mensual incluido",
          "Carga de pack de imágenes",
          "Contenido y copywriting",
          "Mejoras y funcionalidades extra",
          "Soporte prioritario"
        ]
      }
    ]
    ```

    Nota: `priceFrom` en frontmatter de cualquier MDX tiene prioridad sobre este JSON
    si coexisten. Este JSON es el source of truth para la página /plantillas.

---

### Paso 2 — Flow logic

2.1 El filtrado de plantillas por vertical es client-side puro. Se implementa con un
    `<script>` vanilla dentro del componente Astro (no island React, no librería externa).
    Lógica:
    - Cada card del carrusel tiene un atributo `data-vertical="gastronomia"` (etc.).
    - Cada pill de filtro tiene un atributo `data-filter="gastronomia"` (etc.) y uno
      adicional `data-filter="todas"` para el pill activo por defecto.
    - Al hacer clic en un pill:
      a. Remover clase `active` de todos los pills.
      b. Agregar clase `active` al pill clickeado.
      c. Si el filtro es `"todas"`, mostrar todas las cards (remover `hidden`).
      d. Si no, ocultar cards cuyo `data-vertical` no coincida, mostrar las que sí.
    - Usar `el.classList.toggle('hidden', condición)`. No manipular `style.display`.

2.2 El scroll del carrusel ya funciona. No reemplazar la lógica de scroll existente.
    Solo agregar los handlers de los botones de flecha según el paso 4.

2.3 El FAQ usa `<details>`/`<summary>` nativo. No agregar JS para el acordeón.
    La animación de apertura va en `tokens.css`:

    ```css
    @layer components {
      .faq-item summary {
        @apply cursor-pointer list-none flex justify-between items-center
               py-5 text-on-surface font-medium;
      }
      details.faq-item[open] summary {
        @apply text-primary;
      }
    }
    ```

---

### Paso 3 — Containers

3.1 Crear `src/components/TemplateCarousel.astro`. Este componente encapsula:
    - Pills de filtro (verticales).
    - Track del carrusel (scroll-snap).
    - Botones de flecha desktop (absolute, costados).
    - Botones de flecha mobile (flex, debajo del track).
    - El `<script>` de filtrado (paso 2.1) y scroll (paso 2.2).

    No crear ningún otro componente auxiliar sin aprobación. No crear archivos
    de utilidad JS separados.

---

### Paso 4 — UI: correcciones del carrusel (en TemplateCarousel.astro)

#### 4.1 Ancho de cards en mobile (peek effect)

El track del carrusel debe tener:

```html
<div
  id="carousel-track"
  class="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory
         px-4 pb-4
         md:px-0 md:pb-0 md:gap-6
         [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
>
```

Cada card debe tener:

```html
<div class="snap-start shrink-0
            w-[78vw] sm:w-[60vw] md:w-[340px] lg:w-[360px]
            ...resto de clases de la card">
```

`78vw` en mobile garantiza que siempre asome el borde de la card siguiente (~11%
del viewport), creando el efecto visual "hay más". No cambiar los valores `md:` y
`lg:` — desktop no se toca.

#### 4.2 Posición de flechas

Las flechas tienen dos estados según breakpoint. Deben coexistir en el markup;
no se duplica lógica JS.

**Flechas desktop** — dentro del wrapper relativo del carrusel, ocultas en mobile:

```html
<div class="relative">
  <!-- track aquí -->

  <button id="btn-prev"
    class="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2
           items-center justify-center w-10 h-10 rounded-full
           bg-white/40 dark:bg-black/30 backdrop-blur-md
           border border-white/20 dark:border-white/10
           shadow-sm hover:bg-white/60 dark:hover:bg-black/50
           transition-all duration-200 z-10"
    aria-label="Anterior">
    <!-- ícono SVG chevron-left o Material Symbol -->
  </button>

  <button id="btn-next"
    class="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2
           items-center justify-center w-10 h-10 rounded-full
           bg-white/40 dark:bg-black/30 backdrop-blur-md
           border border-white/20 dark:border-white/10
           shadow-sm hover:bg-white/60 dark:hover:bg-black/50
           transition-all duration-200 z-10"
    aria-label="Siguiente">
    <!-- ícono SVG chevron-right o Material Symbol -->
  </button>
</div>
```

**Flechas mobile** — fuera del wrapper, debajo del track, visibles solo en mobile:

```html
<div class="flex md:hidden justify-center gap-3 mt-4">
  <button id="btn-prev-mobile"
    class="flex items-center justify-center w-9 h-9 rounded-full
           bg-white/40 dark:bg-black/30 backdrop-blur-md
           border border-white/20 dark:border-white/10
           shadow-sm transition-all duration-200"
    aria-label="Anterior">
    <!-- ícono -->
  </button>

  <button id="btn-next-mobile"
    class="flex items-center justify-center w-9 h-9 rounded-full
           bg-white/40 dark:bg-black/30 backdrop-blur-md
           border border-white/20 dark:border-white/10
           shadow-sm transition-all duration-200"
    aria-label="Siguiente">
    <!-- ícono -->
  </button>
</div>
```

#### 4.3 Script de scroll para los cuatro botones

Los cuatro botones apuntan al mismo `carousel-track`. Una sola función reutilizada:

```js
const track = document.getElementById('carousel-track');
const STEP = track?.querySelector('[class*="snap-start"]')?.offsetWidth ?? 320;

function scrollPrev() { track?.scrollBy({ left: -STEP, behavior: 'smooth' }); }
function scrollNext() { track?.scrollBy({ left:  STEP, behavior: 'smooth' }); }

['btn-prev', 'btn-prev-mobile'].forEach(id =>
  document.getElementById(id)?.addEventListener('click', scrollPrev)
);
['btn-next', 'btn-next-mobile'].forEach(id =>
  document.getElementById(id)?.addEventListener('click', scrollNext)
);
```

#### 4.4 Glassmorphism en flechas — todas las resoluciones

Las clases de glass ya están en los botones del paso 4.2. Verificar que en
`tokens.css` exista (o agregar) la siguiente clase reutilizable:

```css
@layer components {
  .glass-btn {
    @apply bg-white/40 dark:bg-black/30 backdrop-blur-md
           border border-white/20 dark:border-white/10
           shadow-sm transition-all duration-200;
  }
}
```

Si la clase existe, reemplazar las utilidades de glass en los botones por `.glass-btn`
para evitar duplicación. Si no existe, crearla y usarla.

No usar `bg-surface-container-highest` en las flechas — ese token es para cards,
no para controles flotantes.

#### 4.5 Animaciones de cards (patrón de conversión B2B)

```html
class="... hover:-translate-y-1 hover:shadow-orange-500/10
       transition-all duration-200 ease-out"
```

No usar `hover:scale-*` en estas cards — ese patrón corresponde a pills/skills.

#### 4.6 Tag "Próximamente"

Renderizado condicional desde `status === 'coming_soon'`. El botón de la card debe
estar deshabilitado:

```html
{template.status === 'coming_soon' && (
  <span class="...">Próximamente</span>
)}


  href={template.status === 'available' ? `/plantillas/${template.slug}` : undefined}
  aria-disabled={template.status === 'coming_soon'}
  class:list={[
    '...',
    { 'pointer-events-none opacity-50': template.status === 'coming_soon' }
  ]}
>
  Ver plantilla
</a>
```

---

### Paso 5 — UI: página src/pages/plantillas.astro

#### 5.1 Ruta y metadatos

- Ruta: `src/pages/plantillas.astro` → URL canónica `/plantillas`.
- Un único `<h1>` por página.
- Inyectar dinámicamente en `<head>` via el componente de layout:

  ```
  title: "Plantillas web para pymes | escalatunegocioconia.com"
  description: "Plantillas profesionales optimizadas para SEO y diseñadas para convertir. Gastronomía, profesionales, e-commerce y más."
  og:title: igual que title
  og:image: imagen representativa del catálogo (en src/assets/)
  ```

#### 5.2 JSON-LD (SEO obligatorio)

Inyectar en `<head>` un bloque `ItemList` de Schema.org con una entrada por plantilla
cuyo `status === 'available'`:

```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Plantillas web para pymes",
  "description": "Plantillas profesionales optimizadas para SEO",
  "url": "https://escalatunegocioconia.com/plantillas",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Nombre de la plantilla",
      "url": "https://escalatunegocioconia.com/plantillas/slug"
    }
  ]
}
```

Generarlo de forma dinámica iterando sobre el array importado de `landing-templates.ts`.

#### 5.3 Estructura de secciones (en orden, sin invertir)

```
<main>
  <section> <!-- Hero -->
  <section> <!-- Carrusel con filtros → <TemplateCarousel /> -->
  <section> <!-- Stats bar: 50+, 1–2 semanas, Optimizado para Google -->
  <section> <!-- Pricing → datos de pricing.json -->
  <section> <!-- FAQ → <details>/<summary> -->
  <section> <!-- CTA contacto -->
  <section> <!-- CTA final: "Convertí tu operación..." -->
</main>
```

Semántica obligatoria: `<main>`, `<section>`, `<article>` donde corresponda.
Un solo `<h1>` en el hero. Las secciones de pricing y FAQ usan `<h2>`.

#### 5.4 Hero

```
<h1>: "Comenzá tu emprendimiento con un sitio y posicionamiento estratégico"
<p> subtítulo: "Plantillas profesionales optimizadas para SEO y diseñadas para convertir."
```

Texto fiel al prototipo. Sin truncar ni parafrasear.

#### 5.5 Stats bar

Tres columnas estáticas:
- "50+" — "Plantillas entregadas"
- "1–2 semanas" — "Tiempo de entrega"
- "Optimizado para Google" — "Visibilidad en buscadores"

HTML estático, sin JS, sin fetch.

#### 5.6 Pricing

Iterar sobre `pricing.json`. La card con `"recommended": true` muestra el badge
"Recomendado" usando el color de acento del sitio (token naranja/ámbar de `tokens.css`,
no el azul `primary` del prototipo de referencia `catalog_code.html`).

Formato de precio: `$${plan.price.toLocaleString('es-AR')}` para mostrar separador de miles.

#### 5.7 FAQ — cuatro preguntas del prototipo

1. ¿Qué diferencia hay entre los planes?
2. ¿Cuánto tarda la entrega?
3. ¿Puedo cambiar el contenido después?
4. ¿Necesito contratar hosting aparte?

Las respuestas deben extraerse del prototipo PDF de forma fiel. Implementar con
`<details>`/`<summary>`. Sin JS.

---

### Paso 6 — Tokens.css: clases nuevas

Agregar al final de `src/styles/tokens.css`, dentro de `@layer components`, solo
las clases que no existan:

```css
.glass-btn {
  @apply bg-white/40 dark:bg-black/30 backdrop-blur-md
         border border-white/20 dark:border-white/10
         shadow-sm transition-all duration-200;
}

.faq-item summary {
  @apply cursor-pointer list-none flex justify-between items-center
         py-5 text-on-surface font-medium;
}

details.faq-item[open] summary {
  @apply text-primary;
}
```

Verificar antes de agregar que no existan con otro nombre. No duplicar.

---

### Paso 7 — Documentación (atómico con los cambios anteriores)

7.1 Crear o actualizar `docs/componentes/TemplateCarousel.md` describiendo:
    - Props que recibe (array de templates tipado).
    - Comportamiento del filtro por vertical.
    - Patrón de scroll-snap y los cuatro botones de navegación.
    - Clases de tokens.css usadas.

7.2 Actualizar `docs/deuda-tecnica.md` con las siguientes entradas:

    ```md
    ## Deuda P2 — Carrusel Safari iOS
    Scroll-snap puede tener comportamiento inconsistente en Safari iOS < 16.
    Sin fix inmediato. Revisitar cuando se reporte en campo.

    ## Deuda futura — Precios dinámicos en /plantillas
    Los precios en `pricing.json` están en ARS hardcodeados. Path futuro:
    migrar a tabla en Supabase (Phase 4) para actualización sin redeploy.

    ## Deuda futura — Cover images de plantillas
    Si `landing-templates.ts` no tiene imágenes locales reales al momento
    de la ejecución, usar placeholders SVG en `src/assets/templates/`.
    No usar URLs externas. Reemplazar con assets reales al tenerlos.
    ```

7.3 Registrar en `services.json` la nueva página /plantillas si corresponde
    según la regla DATA-SYNC del proyecto.

---

### Paso 8 — Validación antes de hacer commit

Ejecutar en orden vía WSL:

```bash
wsl npm run typecheck
wsl npx astro check
wsl npm run build
```

Si alguno falla, leer el stacktrace completo antes de diagnosticar. No asumir
la causa. Corregir el error real, no el error supuesto.

Si el build pasa, hacer commit con mensaje descriptivo:
`feat(plantillas): página /plantillas con carrusel, pricing y FAQ`

---

## Restricciones absolutas (no negociables)

- No crear archivos de utilidad JS/TS fuera de los designados sin aprobación.
- No usar Google Fonts.
- No usar la etiqueta `<img>`.
- No usar `style` inline ni bloques `<style>` locales con selectores (salvo Nav.astro).
- No usar librerías de carrusel externas.
- No duplicar datos de precio fuera de `pricing.json`.
- No invertir el orden de ejecución (Schema → Flow → Containers → API → UI → Doc).
- `import.meta.env` solo en páginas/componentes Astro, nunca en archivos de datos.
- Leer el error real antes de proponer cualquier fix.
```