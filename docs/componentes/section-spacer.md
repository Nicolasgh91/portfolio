# SectionSpacer

**Ruta:** `src/components/SectionSpacer.astro`

**Usado en:** `src/pages/blog/[slug].astro` (componentes por defecto MDX), `src/content/blog/arquitectura-sistemas-gran-escala.mdx`, `src/content/blog/diseniar-microservicios.mdx`

## Props

| Prop   | Tipo                           | Requerida | Descripción                                        |
| ------ | ------------------------------ | --------- | -------------------------------------------------- |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | No        | Margen vertical (`my-*` Tailwind); default `'lg'`. |

## Comportamiento

- Renderiza un `<div aria-hidden="true">` con clases de espaciado; sin contenido visible.

## Decisiones de diseño

- API mínima para separar bloques en MDX sin repetir clases.

## Deuda técnica conocida

- Ninguna relevante.

## Estado

Documentado
