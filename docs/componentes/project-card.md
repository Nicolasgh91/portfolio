# ProjectCard

**Ruta:** [`src/components/ProjectCard.astro`](../../src/components/ProjectCard.astro)

**Usado en:** [`src/pages/index.astro`](../../src/pages/index.astro), [`src/pages/talento.astro`](../../src/pages/talento.astro).

## Props

| Prop                            | Tipo                            | Requerida | Descripción                                                                                                                                                                                                                                                                            |
| ------------------------------- | ------------------------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `headingId`                     | `string`                        | Sí        | `id` del `<h3>`; debe ser único en la página. Usar p. ej. `project-card-${slug}` para no chocar con anclas (`#slug` en el mismo documento).                                                                                                                                            |
| `title` / `titleEn`             | `string`                        | Sí        | Título bilingüe.                                                                                                                                                                                                                                                                       |
| `description` / `descriptionEn` | `string`                        | Sí        | Resumen bilingüe.                                                                                                                                                                                                                                                                      |
| `image`                         | `ImageMetadata`                 | No        | Portada desde colección (`coverImage` resuelto).                                                                                                                                                                                                                                       |
| `href`                          | `string`                        | Sí        | URL del proyecto.                                                                                                                                                                                                                                                                      |
| `badge` / `badgeEn`             | `string`                        | No        | Chip opcional.                                                                                                                                                                                                                                                                         |
| `badgeVariant`                  | `'live' \| 'in-progress'`       | No        | Solo si hay `badge`: verde fijo (`live`) o amarillo fijo (`in-progress`). Default `in-progress`.                                                                                                                                                                                       |
| `external`                      | `boolean`                       | No        | Añade `target="_blank"` y `rel`.                                                                                                                                                                                                                                                       |
| `coverPosition`                 | `'top' \| 'center' \| 'bottom'` | No        | Anclaje vertical de la portada con `object-cover`: **`md:` y superior** usa `md:object-top` / `md:object-center` / `md:object-bottom` según valor. **Por debajo de `md`** el componente fuerza **`max-md:object-center`** (crop centrado en móvil). Default alineado al schema: `top`. |
| `direction`                     | `'left' \| 'right'`             | No        | Desktop: gradiente lateral y alineación del bloque de texto (izquierda vs derecha). Default `left`. En mobile el gradiente es siempre vertical inferior; el texto va abajo (`justify-end`).                                                                                            |
| `tags`                          | `string[]`                      | No        | Etiquetas de stack desde el frontmatter de la colección `projects`; se muestran como pills bajo la descripción si el array no está vacío. Default `[]`.                                                                                                                                |

**Schema (SSOT):** `coverPosition`, `coverImage`, `status` y `tags` en [`src/content/config.ts`](../../src/content/config.ts), colección `projects`.

## Layout y comportamiento

- **Banner cinematográfico:** `article` con `rounded-2xl`, `overflow-hidden`, altura mínima `--card-project-min-h` / `--card-project-min-h-md` (tokens en `tokens.css`).
- **Imagen:** `<Image />` de Astro, `loading="lazy"`, `decoding="async"`, `object-cover`. Posición: **`max-md:object-center`** siempre; desde breakpoint `md`, `md:object-*` según `coverPosition` del frontmatter. **`sizes`:** `(min-width: 1280px) 1280px, 100vw`. **`widths`:** `[640, 960, 1280, 1920]`.
- **Sin imagen:** capa `absolute inset-0` con `bg-[var(--bg-secondary)]` (sin `dark:` ni slates fijos en esa capa).
- **Overlays (oscuros fijos, no tokenizados):**
  - **&lt; md:** un `div` con gradiente vertical (`to top`, opacidades del diseño).
  - **md+:** un `div` con gradiente lateral `to right` o `to left` según `direction`.
  - Ambos `pointer-events-none`, estilos vía `style` inline con los `linear-gradient` definidos en el diseño.
- **Bloque de contenido:** `div` `relative z-[1]`, `flex flex-col`, `max-w-full md:max-w-[50%]`, `p-8 md:p-10`, `justify-end md:justify-center`, alineación según `direction`. Tipografía: título Outfit `font-medium` blanco; cuerpo Inter `text-sm` `text-white/65`.
- **CTA visual:** línea “Ver proyecto →” como `<span>` (no es un segundo enlace); la flecha va en **`span.arrow`** con `aria-hidden="true"` y reutiliza **`bounce-right`** vía [`tokens.css`](../../src/styles/tokens.css) (`.group\/card:hover .arrow`, mismo patrón que `.btn-bounce`). El hover sobre cualquier zona de la tarjeta anima la flecha (overlay `<a>` es descendiente del `article.group/card`).
- **Enlace:** `<a>` overlay vacío `absolute inset-0 z-[2]`, `rounded-2xl`, `aria-labelledby={headingId}` para nombre conciso del enlace (título en el `h3`). Sin flex ni layout de texto en el `<a>`.
- **i18n:** título, descripción, badge y CTA visual se resuelven por SSR con `localeFromPathname`; no se renderizan pares ocultos ES/EN.

## Stacking (solo dentro del `article`)

| Capa              | z-index | Notas               |
| ----------------- | ------- | ------------------- |
| Imagen / fallback | —       | Primero en el DOM   |
| Overlays          | —       | Encima de la imagen |
| Bloque texto      | `z-[1]` |                     |
| `<a>` overlay     | `z-[2]` | Captura clic y foco |

## Hover / motion

- **`group/card` en el `article`:** escala leve en la imagen (`group-hover/card:scale-105`). Flecha del CTA: ver [`docs/componentes/btn-bounce.md`](./btn-bounce.md) — animación compartida con reglas `.group\/card .arrow` en `tokens.css` (`prefers-reduced-motion` y `:root.no-motion` alineados con `btn-bounce`).

## Estado

Documentado
