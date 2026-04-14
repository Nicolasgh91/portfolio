# TableWrapper

**Ruta:** `src/components/mdx/TableWrapper.astro`

**Usado en:** `src/pages/blog/[slug].astro` — `Content components={{ table: TableWrapper }}`

## Props

| Prop | Tipo | Requerida | Descripción |
|------|------|-----------|-------------|
| *spread* | atributos HTML | — | Todas las props se reenvían al `<table>` nativo (`class` se fusiona con clases base). |

## Comportamiento

- Contenedor con scroll horizontal, borde y fondo; `<table>` con ancho completo y `min-w` para tablas anchas en móvil.
- `<slot />` recibe el contenido generado por MDX (`thead`, `tbody`, etc.).

## Decisiones de diseño

- Sustituye el `<table>` por defecto del MDX para un único estilo en artículos.

## Deuda técnica conocida

- Tipado implícito como props de tabla; no hay `interface Props` explícita.

## Estado

Documentado
