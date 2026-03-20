# Tareas técnicas — rediseño de tarjetas de servicios

*Proyecto: escalatunegocioconia.com*
*Fecha: 2026-03-20*
*Referencia de diseño: `service_cards_redesign.html`*

---

## Contexto y gap analysis

| Atributo | Estado actual (`ServiceCard.astro`) | Estado objetivo (rediseño) |
|---|---|---|
| Imagen de portada | ❌ No existe | ✅ `<Image />` de `astro:assets`, 148 px alto, overlay gradiente |
| Badge "más elegido" | ❌ No existe | ✅ Campo `featured` del schema |
| Precio visible en tarjeta | ❌ No existe | ✅ Campo `priceFrom` + `priceCurrency` |
| Prop `featured` | ❌ No existe en Zod | ✅ Requiere extensión del schema |
| CSS | ⚠️ Bloques `<style>` locales con selectores `:hover` | ✅ Utilidades Tailwind exclusivas |
| Sección contenedora | ⚠️ Desconocida | ✅ Nuevo componente `ServicesSection.astro` |
| `<img>` estándar | Riesgo latente | ✅ Prohibido, reemplazar por `<Image />` |

---

## Jerarquía de implementación

### Capa 1 — Schema

#### TASK-1.1 — Extender el schema Zod de servicios en `config.ts`

**Archivo:** `src/content/config.ts`

**Cambios:**

```typescript
const services = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string(),
    titleEn: z.string(),
    description: z.string(),
    descriptionEn: z.string(),
    shortDescription: z.string().max(120),        // nuevo — texto de tarjeta
    icon: z.string(),
    order: z.number().default(99),
    href: z.string().optional(),
    featured: z.boolean().default(false),          // nuevo — badge "más elegido"
    badgeLabel: z.string().optional(),             // nuevo — texto del badge
    priceFrom: z.string().optional(),              // nuevo — ej. "$50.000"
    priceCurrency: z.string().default('ARS'),      // nuevo
    priceNote: z.string().optional(),              // nuevo — ej. "Proyecto a medida"
    coverImage: image().optional(),                // nuevo — astro:assets
    coverAlt: z.string().optional(),               // nuevo — alt obligatorio si hay imagen
  }),
});
```

**Criterios de aceptación:**
- `astro build` sin errores de validación Zod.
- El campo `coverImage` usa el helper `image()` de Astro para optimización automática.
- Los campos nuevos son opcionales para no romper los cinco MDX existentes.

---

#### TASK-1.2 — Actualizar los cinco MDX de servicios con los campos nuevos

**Archivos:** `src/content/services/*.mdx`

**Campos a agregar en cada frontmatter:**

| Servicio | `shortDescription` | `featured` | `badgeLabel` | `priceFrom` | `priceNote` | `coverImage` |
|---|---|---|---|---|---|---|
| `ia-agents.mdx` | Atención 24/7, leads y ventas sin carga operativa. | `true` | Más elegido | $50.000 | — | imagen IA |
| `ecommerce-platforms.mdx` | Tienda propia sin dependencia de SaaS de terceros. | `false` | — | $80.000 | — | imagen ecommerce |
| `local-llms.mdx` | LLMs on-premise: privacidad total, sin costos recurrentes. | `false` | — | — | Proyecto a medida | imagen infra |
| `workflow-automation.mdx` | Pipelines que eliminan tareas manuales del equipo. | `false` | — | $40.000 | — | imagen automation |
| *(landing-page, pendiente)* | Presencia web indexable y captación de clientes. | `false` | — | $20.000 | — | imagen web |

**Criterios de aceptación:**
- Todos los MDX superan la validación Zod en `astro check`.
- Las imágenes de portada se ubican en `src/assets/services/` y se referencian con ruta relativa.

---

### Capa 2 — Flow logic

#### TASK-2.1 — Definir el orden de renderizado y las reglas de negocio de la tarjeta

**Reglas a implementar en el componente:**

1. Si `featured === true` → aplicar clase de borde activo y renderizar `<span>` de badge.
2. Si `coverImage` existe → renderizar `<Image />` con overlay; si no, renderizar `srv-img-placeholder` con el emoji `icon`.
3. Si `priceFrom` existe → mostrar precio con etiqueta "Desde"; si `priceNote` existe y `priceFrom` no → mostrar solo `priceNote` en color neutro.
4. El botón "Ver servicio" → si `href` existe, renderizar como `<a>`; si no, deshabilitar o redirigir al formulario de contacto (fail-silent).
5. La grilla en la sección contenedora debe ordenar las tarjetas por `order` ASC, con `featured` siempre primero (`featured` DESC, `order` ASC).

---

### Capa 3 — Contenedor (sección)

#### TASK-3.1 — Crear `ServicesSection.astro`

**Archivo:** `src/components/ServicesSection.astro` (nuevo)

**Responsabilidad:** obtener la colección, aplicar el ordenamiento (TASK-2.1, regla 5) y renderizar el header + grid.

**Estructura del componente:**

```astro
---
import { getCollection } from 'astro:content';
import ServiceCard from './ServiceCard.astro';

const raw = await getCollection('services');
const services = raw
  .sort((a, b) => {
    if (a.data.featured !== b.data.featured) return a.data.featured ? -1 : 1;
    return a.data.order - b.data.order;
  })
  .map(s => s.data);
---

<section
  id="servicios"
  aria-labelledby="servicios-titulo"
  class="bg-[#0e0e0e] py-16 px-4 sm:px-8 rounded-2xl"
>
  <!-- Header -->
  <header class="mb-10">
    <p class="text-[11px] tracking-[0.18em] uppercase text-amber-500 font-medium mb-1">
      Catálogo
    </p>
    <h2
      id="servicios-titulo"
      class="font-display text-3xl font-extrabold text-[#f5f5f0] mb-1"
    >
      Servicios
    </h2>
    <p class="text-sm text-[#888]">
      Cuatro ejes de intervención con impacto directo en la operación.
    </p>
  </header>

  <!-- Grid -->
  <div
    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
    role="list"
  >
    {services.map(service => (
      <ServiceCard service={service} />
    ))}
  </div>
</section>
```

**Criterios de aceptación:**
- Un único `<h2>` en la sección (el `<h1>` vive en la página).
- `aria-labelledby` conecta la sección con su encabezado.
- `role="list"` en el grid para lectores de pantalla.

---

### Capa 4 — API (no aplica)

No hay nueva Edge Function requerida para este rediseño. Los datos provienen de la colección estática de Astro (SSG). Esta capa queda documentada como N/A para mantener la trazabilidad de la jerarquía.

---

### Capa 5 — UI

#### TASK-5.1 — Reescribir `ServiceCard.astro` con Tailwind exclusivo

**Archivo:** `src/components/ServiceCard.astro`

**Reglas obligatorias:**
- Eliminar completamente el bloque `<style>` local existente (deuda técnica CSS).
- Usar únicamente utilidades Tailwind. Ningún selector `:hover` en `<style>`.
- `<Image />` de `astro:assets` — prohibido `<img>` estándar.
- Animación de conversión (B2B): `hover:-translate-y-[3px] hover:border-amber-500` (sutil y premium).

**Estructura del componente (props interface):**

```typescript
interface Props {
  service: {
    title: string;
    shortDescription: string;
    icon: string;
    href?: string;
    featured?: boolean;
    badgeLabel?: string;
    priceFrom?: string;
    priceCurrency?: string;
    priceNote?: string;
    coverImage?: ImageMetadata;
    coverAlt?: string;
  };
}
```

**Mapa visual → clases Tailwind:**

| Elemento | Clase base | Clase en hover/featured |
|---|---|---|
| Tarjeta contenedor | `bg-[#161616] border border-[#2a2a2a]/50 rounded-[14px] overflow-hidden flex flex-col transition-all duration-200 cursor-pointer relative` | `hover:-translate-y-[3px] hover:border-amber-500` |
| Tarjeta featured | `border-amber-500` | — (ya activo) |
| Badge | `absolute top-3 right-3 bg-amber-500 text-[#0e0e0e] text-[10px] font-bold tracking-wide uppercase px-2.5 py-[3px] rounded-full z-10` | — |
| Imagen | `w-full h-[148px] object-cover brightness-85 saturate-[0.7]` | — |
| Overlay gradiente | `absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-b from-transparent to-[#161616] pointer-events-none` | — |
| Placeholder (sin imagen) | `w-full h-[148px] flex items-center justify-center text-sm text-[#555] bg-[#1a1a1a]` | — |
| Body | `p-[18px_18px_20px] flex flex-col flex-1` | — |
| Título | `font-display text-[15px] font-bold text-[#f5f5f0] mb-2 leading-snug` | — |
| Descripción | `text-[13px] text-[#888] leading-relaxed mb-auto pb-[18px]` | — |
| Footer | `flex items-center justify-between pt-[14px] border-t border-[#222]/70` | — |
| Precio etiqueta | `text-[10px] text-[#555] uppercase tracking-wider` | — |
| Precio valor | `font-display text-[17px] font-bold text-amber-500` | — |
| Precio moneda | `text-[11px] font-normal text-[#666]` | — |
| Precio nota | `text-[14px] text-[#aaa]` | — |
| CTA button | `text-xs font-medium text-[#f5f5f0] bg-[#222] border border-[#333]/80 px-[14px] py-[7px] rounded-lg cursor-pointer transition-colors duration-150 whitespace-nowrap` | `group-hover:bg-amber-500 group-hover:text-[#0e0e0e] group-hover:border-amber-500` |

> Nota: usar `group` en el contenedor y `group-hover:` en el CTA para el cambio de color coordinado sin JS.

**Criterios de aceptación:**
- `astro check` sin errores de tipos.
- Cero bloques `<style>` en el archivo final.
- El componente renderiza correctamente con y sin `coverImage`.
- Contraste texto/fondo ≥ 4.5:1 (WCAG AA) verificado con DevTools.
- `focus-visible` con outline amber para navegación por teclado.

---

#### TASK-5.2 — Agregar fuente `Syne` al layout global

**Archivo:** `src/layouts/Layout.astro`

**Cambio:** agregar `Syne` al preconnect y al link de Google Fonts si no está presente, y extender la config de Tailwind:

```javascript
// tailwind.config.mjs
theme: {
  extend: {
    fontFamily: {
      display: ['Syne', 'sans-serif'],   // ya usado en el rediseño
    }
  }
}
```

**Criterios de aceptación:**
- No duplicar fuentes ya cargadas.
- Usar `font-display: swap` para evitar FOUT.

---

#### TASK-5.3 — Reemplazar el uso del componente en las páginas

**Archivos afectados:** toda página que importe `ServiceCard` o renderice la sección de servicios directamente.

**Acción:** reemplazar las importaciones sueltas de `ServiceCard` por el nuevo contenedor `ServicesSection`, que ya gestiona la obtención de datos y el ordenamiento.

---

## Roadmap de estado

```
TASK-1.1  Extender schema Zod (config.ts)          [ ] pendiente
TASK-1.2  Actualizar frontmatter de los MDX         [ ] pendiente
TASK-2.1  Reglas de negocio del componente          [ ] pendiente (documentado arriba)
TASK-3.1  Crear ServicesSection.astro               [ ] pendiente
TASK-4    API                                       [N/A] no aplica (SSG)
TASK-5.1  Reescribir ServiceCard.astro (Tailwind)   [ ] pendiente
TASK-5.2  Agregar fuente Syne a Tailwind config     [ ] pendiente
TASK-5.3  Actualizar páginas consumidoras           [ ] pendiente
```

**Orden de ejecución recomendado:** 1.1 → 1.2 → 3.1 → 5.1 → 5.2 → 5.3

---

## Restricciones y notas

- **`services.json`** es un archivo legado del chatbot (context injection). No reemplaza a la colección MDX. No modificar su estructura en esta tarea.
- Las imágenes de portada deben colocarse en `src/assets/services/` (no en `public/`) para que `astro:assets` las optimice a WebP/AVIF.
- El precio en pesos argentinos es volátil; considerar a futuro mover `priceFrom` a un archivo de configuración central para actualizar sin tocar cada MDX.
- El componente no debe incluir lógica de internacionalización en esta iteración; los campos `titleEn`/`descriptionEn` ya existen en el schema para uso futuro.
