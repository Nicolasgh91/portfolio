# ArticleFooter

**Ruta:** `src/components/blog/ArticleFooter.astro`

**Usado en:** `src/pages/blog/[slug].astro`

## Props

| Prop | Tipo | Requerida | Descripción |
|------|------|-----------|-------------|
| `tags` | `string[]` | Sí | Etiquetas del post; enlaces a `/blog/etiqueta/{encodeURIComponent(tag)}`. |
| `category` | `string` | Sí | Categoría; enlace a `/blog/categoria/{category}`. |

## Comportamiento

- Pie de artículo: enlace a categoría (estilo uppercase) y lista de tags en pills.

## Decisiones de diseño

- Taxonomía coherente con `TaxonomyFilter` y rutas dinámicas del blog.

## Deuda técnica conocida

- Ninguna relevante.

## Estado

Documentado
