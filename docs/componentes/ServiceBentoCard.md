# ServiceBentoCard

Componente de tarjeta para el bento grid de `/servicios`. Reemplaza el carrusel horizontal anterior con un layout de grilla de 12 columnas.

**Archivo:** `src/components/ServiceBentoCard.astro`

## Props

| Prop | Tipo | Requerido | Descripcion |
|------|------|-----------|-------------|
| `title` | `string` | Si | Nombre del servicio (ES) |
| `titleEn` | `string` | No | Nombre del servicio (EN) |
| `description` | `string` | Si | Descripcion larga (ES) |
| `descriptionEn` | `string` | No | Descripcion larga (EN) |
| `shortDescription` | `string` | No | Resumen corto para la tarjeta. Si no existe, usa `description`. |
| `shortDescriptionEn` | `string` | No | Resumen corto (EN) |
| `roiFocus` | `string` | No | Linea de beneficio/ROI. Solo se muestra en variantes anchas (`wide-left`, `wide-right`). |
| `roiFocusEn` | `string` | No | Linea de ROI (EN) |
| `icon` | `string` | Si | Emoji del servicio, renderizado a `text-7xl` en la zona visual |
| `module` | `string` | No | Identificador de modulo. Se muestra como badge pill si existe. |
| `href` | `string` | No | URL del CTA. Fallback: `#contacto` |
| `variant` | `enum` | Si | Layout de la tarjeta (ver tabla abajo) |

## Variantes

| Variante | col-span | Posicion en grid | Layout interno |
|----------|----------|-----------------|----------------|
| `wide-left` | `md:col-span-8` | Card 1 (index 0) | Flex row: texto izquierda, visual derecha |
| `narrow-top` | `md:col-span-4` | Card 2 (index 1) | Columna: visual arriba, texto abajo |
| `narrow-bottom` | `md:col-span-4` | Card 3 (index 2) | Columna: texto arriba, visual abajo |
| `wide-right` | `md:col-span-8` | Card 4 (index 3) | Flex row-reverse: texto derecha, visual izquierda |
| `default` | `md:col-span-4` | Index 4+ | Igual que `narrow-top` |

## Uso

```astro
---
import ServiceBentoCard from '../components/ServiceBentoCard.astro';
---

<ServiceBentoCard
  title="Landing page y menu digital"
  titleEn="Landing page and digital menu"
  description="Descripcion completa..."
  shortDescription="Resumen corto para la card"
  icon="🌐"
  module="landing"
  href="/catalogo-de-landings"
  variant="wide-left"
/>
```

## Asignacion de variante en servicios.astro

La variante se asigna automaticamente segun el indice del servicio (ordenado por `order`):

```ts
const variantByIndex = ['wide-left', 'narrow-top', 'narrow-bottom', 'wide-right'];
// index >= 4 => 'default'
```

## Tokens CSS utilizados

- Fondos: `--bg-card`, `--bg-tertiary`
- Texto: `--text-primary`, `--text-secondary`, `--text-muted`
- Bordes: `--border-subtle`, `--border-normal`
- Accent: `--accent-text`, `--accent-h`, `--accent-s`
- Tipografia: `--font-display`, `--font-body`
- Tamanos: `--text-xs`, `--text-sm`, `--text-base`, `--text-xl`, `--text-2xl`
- Radio: `--radius-xl`, `--radius-pill`

## Soporte bilingue

Todos los textos visibles llevan atributos `data-es` y `data-en` para el toggle de idioma global (`nhLang.toggle()`).

## Notas

- No renderiza precios en ningun caso.
- No usa `<img>` ni imagenes externas, solo emojis decorativos.
- `ServiceCard.astro` sigue existiendo para uso en otras paginas (index.astro).
