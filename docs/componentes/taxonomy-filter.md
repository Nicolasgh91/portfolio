# TaxonomyFilter

**Ruta:** `src/components/TaxonomyFilter.astro`

**Usado en:** `src/pages/blog/index.astro`, `src/pages/blog/categoria/[category].astro`, `src/pages/blog/etiqueta/[tag].astro`

## Props

| Prop             | Tipo       | Requerida | Descripción                                                                                                |
| ---------------- | ---------- | --------- | ---------------------------------------------------------------------------------------------------------- |
| `categories`     | `string[]` | Sí        | Lista de categorías (texto mostrado = segmento de URL en `/blog/categoria/...` o `/en/blog/category/...`). |
| `tags`           | `string[]` | No        | Etiquetas; default `[]`; enlaces a `/blog/etiqueta/` o `/en/blog/tag/` con `encodeURIComponent`.           |
| `activeCategory` | `string`   | No        | Marca pill activa y `aria-current` en categoría.                                                           |
| `activeTag`      | `string`   | No        | Marca pill activa en etiquetas.                                                                            |

## Comportamiento

- Primera pill “Todos” / “All” enlaza a `/blog` o `/en/blog` y está activa si no hay categoría ni etiqueta activa.
- Dos grupos: Categorías y Etiquetas, con labels resueltos por `localeFromPathname` y `data-en` / `data-es` como metadatos del toggle global.
- Navegación solo por enlaces (sin JS).

## Decisiones de diseño

- Layout del nav (`.taxonomy`, `.taxonomy__group`, labels) en `<style>` scoped.
- Apariencia de `.taxonomy__pill`, `.taxonomy__pill--active` y lista `.taxonomy__pills` compartida con el filtro del catálogo en [`src/styles/tokens.css`](../../src/styles/tokens.css).

## Deuda técnica conocida

- Uso de `<style>` local en lugar de utilidades Tailwind puras.

## Estado

Documentado
