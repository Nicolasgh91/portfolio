# ProjectDemo

**Ruta:** `src/components/ProjectDemo.astro`

**Usado en:** Ninguna página ni MDX en el repo actual (componente listo para uso; comentario de ejemplo en el archivo).

## Props

| Prop | Tipo | Requerida | Descripción |
|------|------|-----------|-------------|
| `src` | `string` | Sí | Ruta base **sin extensión**; se cargan `<source>` `${src}.webm` y `${src}.mp4`. |
| `title` | `string` | Sí | `aria-label` y `title` del `<video>`. |
| `poster` | `string` | No | Imagen poster (recomendado WebP). |
| `width` / `height` | `number` | No | Dimensiones del video. |
| `autoplay` | `boolean` | No | Default `true`; siempre `muted`, `loop`, `playsinline`. |

## Comportamiento

- `<video>` con WebM preferido y MP4 fallback; enlace de descarga en fallback de texto.
- Estilos en `<style>` scoped (`project-demo`).

## Decisiones de diseño

- Evitar GIFs: video HTML5 con formatos modernos.

## Deuda técnica conocida

- Sin uso: riesgo de rotura silenciosa si los paths `/demos/...` no existen cuando se integre.

## Estado

Documentado
