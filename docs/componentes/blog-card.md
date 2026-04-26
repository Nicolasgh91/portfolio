# BlogCard

**Ruta:** `src/components/BlogCard.astro`

**Usado en:** `src/pages/blog/index.astro`, `src/pages/blog/categoria/[category].astro`, `src/pages/blog/etiqueta/[tag].astro`

## Props

| Prop   | Tipo   | Requerida | Descripción                                       |
| ------ | ------ | --------- | ------------------------------------------------- |
| `post` | objeto | Sí        | Entrada alineada al shape de la colección `blog`. |

**`post`**

| Campo                                | Tipo       | Requerida | Descripción                                                                                    |
| ------------------------------------ | ---------- | --------- | ---------------------------------------------------------------------------------------------- |
| `slug`                               | `string`   | Sí        | Slug para `/blog/{slug}`.                                                                      |
| `data.title` / `titleEn`             | `string`   | Sí / No   | Título y opcional EN.                                                                          |
| `data.description` / `descriptionEn` | `string`   | Sí / No   | Lead en listado.                                                                               |
| `data.pubDate`                       | `Date`     | Sí        | Fecha para `<time datetime>`.                                                                  |
| `data.category`                      | `string`   | Sí        | Usada en fallback de portada por categoría.                                                    |
| `data.tags`                          | `string[]` | Sí        | Taxonomía (no se listan en la tarjeta; ver página de post).                                    |
| `data.vertical`                      | enum       | No        | Presente en el tipo de frontmatter; **no hay UI dedicada en la tarjeta en la versión actual**. |
| `data.readingTime`                   | `number`   | No        | Minutos de lectura en meta.                                                                    |
| `data.coverImageKey`                 | enum       | No        | Clave a mapa de imports (`human-ai`, thumbnails, etc.).                                        |
| `data.coverAlt`                      | `string`   | No        | Alt de la imagen; fallback `title`.                                                            |

## Comportamiento

- Portada: `coverImageKey` → asset importado; si falta, fallback por `category` (`arquitectura`, `infraestructura`, `metodología`) y luego default.
- Overlay y CTA “Leer artículo” visibles en hover (desktop); enlace principal con `aria-label` descriptivo.
- Meta: fecha localizada por ruta (`es-AR` / `en-US`), tiempo de lectura opcional con icono.
- i18n: título, descripción, CTA, alt y tiempo de lectura se renderizan desde `localeFromPathname`; `data-en` / `data-es` quedan como metadatos para el toggle global.

## Decisiones de diseño

- `<Image />` con dimensiones fijas y `loading="lazy"` en listados.
- Card con `<style>` scoped para layout hover y tipografía (no solo utilidades Tailwind).

## Deuda técnica conocida

- `vertical` tipado en props pero sin badge visual en este componente: o implementar badge o documentar uso futuro en otro contenedor.

## Estado

Documentado
