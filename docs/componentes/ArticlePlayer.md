# ArticlePlayer

**Ruta:** `src/components/blog/ArticlePlayer.astro`

**Usado en:** `src/components/blog/ShareBar.astro`

## Props

| Prop              | Tipo           | Requerida | Descripción                                                                 |
| ----------------- | -------------- | --------- | --------------------------------------------------------------------------- |
| `lang`            | `"es" \| "en"` | Sí        | Idioma activo del artículo. Usa `es-AR` para español y `en-US` para inglés. |
| `articleSelector` | `string`       | No        | Selector del contenedor de texto. Default: `"article"`.                     |

## Comportamiento

- Renderiza un botón único de play/pausa con SVG inline y `currentColor`, alineado visualmente con los íconos de compartir.
- El badge de velocidad aparece a la derecha del ícono solo mientras la lectura está reproduciendo; se oculta al pausar o finalizar.
- El botón play/pausa y el badge de velocidad usan tooltip visual con Tailwind (`group-hover`) en vez de `title` nativo.
- El tooltip de play/pausa actualiza su texto junto con el estado: escuchar, pausar o reanudar.
- Al hacer click sobre el botón o el badge, el tooltip se oculta aunque el cursor siga encima; se reactiva al salir y volver a hacer hover.
- El tooltip del badge solo puede aparecer mientras el badge está visible, porque el wrapper completo se oculta fuera del estado de reproducción.
- La inicialización se difiere con `IntersectionObserver` sobre `[data-article-player]`, equivalente al objetivo de `client:visible` sin crear una isla de framework.
- Si el navegador no soporta `speechSynthesis` o `SpeechSynthesisUtterance`, el contenedor queda oculto y no bloquea la lectura.
- La extracción clona el artículo y remueve `pre`, `code`, `table` y `figcaption` antes de leer `textContent`.
- El texto se divide en chunks de unas 200 palabras para evitar cancelaciones de Chrome en utterances largas.
- Cancela la reproducción en `beforeunload`.

## Limitaciones conocidas

- La calidad, disponibilidad y acento de las voces depende del sistema operativo y del navegador del usuario.
- `speechSynthesis.getVoices()` puede devolver vacío en el primer llamado; el componente espera `voiceschanged` y reintenta.
- La velocidad cambia entre `1x`, `1.2x` y `0.85x`; si se modifica durante una lectura, aplica al siguiente chunk.

## Decisiones de diseño

- Se usa Web Speech API en lugar de TTS pago para evitar costo, latencia y gestión de archivos de audio en artículos sin tráfico probado.
- El componente vive junto a `ShareBar` porque es una acción contextual de lectura/compartir del artículo, no un control global.
- No usa emojis, `<style>` local ni variantes `dark:`; todo el estilo depende de utilidades Tailwind, SVG inline y tokens CSS.

## Ruta de upgrade

Para artículos de alto tráfico (>500 visitas/mes), pre-generar `.mp3` en build time con TTS externo y servirlo con `<audio>` nativo. El upgrade esperado es que `ArticlePlayer` detecte `/audio/{slug}.mp3` y use ese archivo antes de recurrir a Web Speech API.

## Estado

Documentado
