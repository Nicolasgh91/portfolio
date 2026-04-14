# ShareBar

**Ruta:** `src/components/blog/ShareBar.astro`

**Usado en:** `src/pages/blog/[slug].astro`, `src/pages/dev/component-scripts-audit.astro`

## Props

| Prop | Tipo | Requerida | Descripción |
|------|------|-----------|-------------|
| `title` | `string` | Sí | Texto prellenado para compartir (X, LinkedIn, WhatsApp). |
| `url` | `string` | Sí | URL absoluta o canónica del artículo. |

## Comportamiento

- Enlaces externos con `target="_blank"` y `rel="noopener noreferrer"`.
- `shareRootId` único vía `randomUUID()` para evitar colisiones si hay varias barras en la misma página (página de auditoría).

## Decisiones de diseño

- Sin SDK de redes: solo URLs de intent/share estándar.

## Deuda técnica conocida

- Ninguna relevante.

## Estado

Documentado
