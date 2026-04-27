# ShareBar

**Ruta:** `src/components/blog/ShareBar.astro`

**Usado en:** `src/pages/blog/[slug].astro`, `src/pages/dev/component-scripts-audit.astro`

## Props

| Prop              | Tipo           | Requerida | Descripción                                                                       |
| ----------------- | -------------- | --------- | --------------------------------------------------------------------------------- |
| `title`           | `string`       | Sí        | Texto prellenado para compartir (X, LinkedIn, WhatsApp).                          |
| `url`             | `string`       | Sí        | URL absoluta o canónica del artículo.                                             |
| `lang`            | `"es" \| "en"` | No        | Idioma activo para componer `ArticlePlayer`. Default: se deriva de la ruta.       |
| `articleSelector` | `string`       | No        | Selector del artículo que lee `ArticlePlayer`. Default: `[data-article-content]`. |

## Comportamiento

- Enlaces externos con `target="_blank"` y `rel="noopener noreferrer"`.
- `shareRootId` único vía `randomUUID()` para evitar colisiones si hay varias barras en la misma página (página de auditoría).
- Labels visibles, `aria-label` y tooltips visuales se resuelven en ES/EN con `localeFromPathname`.
- Los tooltips usan markup local con Tailwind (`group-hover`) en vez de `title` nativo para evitar inconsistencias de navegador o WebView.
- Al hacer click sobre un control, el tooltip se oculta aunque el cursor siga encima; se reactiva al salir y volver a hacer hover.
- La raíz usa `flex-nowrap`, `justify-between` y `mb-6`: el grupo social queda a la izquierda, `ArticlePlayer` se ubica a la derecha y el bloque deja `1.5rem` de separación inferior antes del contenido siguiente.
- En mobile los botones sociales bajan a `2rem` y el gap se reduce para mantener el reproductor en la misma línea que los íconos.
- Compone `ArticlePlayer` para escuchar el artículo con Web Speech API cuando el navegador lo soporta.

## Decisiones de diseño

- Sin SDK de redes: solo URLs de intent/share estándar.
- La reproducción TTS se mantiene dentro de la barra porque es una acción secundaria del artículo y comparte contexto con los controles sociales.

## Deuda técnica conocida

- Ninguna relevante.

## Estado

Documentado
