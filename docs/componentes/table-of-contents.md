# TableOfContents

**Ruta:** `src/components/blog/TableOfContents.astro`

**Usado en:** `src/pages/blog/[slug].astro`, `src/pages/dev/component-scripts-audit.astro`

## Props

| Prop       | Tipo             | Requerida | Descripción                                                                         |
| ---------- | ---------------- | --------- | ----------------------------------------------------------------------------------- |
| `headings` | `HeadingEntry[]` | Sí        | `depth`, `slug`, `text`; suelen venir de `post.render().headings` en Astro Content. |

## Comportamiento

- Filtra `depth` 2 y 3; no renderiza nada si la lista queda vacía.
- Lista de enlaces `#slug`; `id` del nav único por `randomUUID()`.
- El `<script>` está **fuera** del bloque condicional del markup (misma razón que otros componentes con cliente mínimo: Prettier/parser); solo enlaza `[data-toc-root]` si existe. `IntersectionObserver` sobre `article h2[id], article h3[id]` para resaltar el enlace activo (clases Tailwind toggled en runtime).

## Decisiones de diseño

- Scroll spy con `rootMargin` para alinear con header sticky.

## Deuda técnica conocida

- Clases aplicadas vía `classList.toggle` deben estar disponibles para Tailwind (JIT + posible safelist para variantes arbitrarias).

## Estado

Documentado
