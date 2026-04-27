# ArticlePlayer

**Ruta:** `src/components/blog/ArticlePlayer.astro`

**Usado en:** `src/components/blog/ShareBar.astro`

## Props

| Prop              | Tipo           | Requerida | Descripción                                                                 |
| ----------------- | -------------- | --------- | --------------------------------------------------------------------------- |
| `lang`            | `"es" \| "en"` | Sí        | Idioma activo del artículo. Usa `es-AR` para español y `en-US` para inglés. |
| `articleSelector` | `string`       | No        | Selector del contenedor de texto. Default: `"article"`.                     |
| `audioSrc`        | `string`       | No        | MP3 pre-generado bajo `public/audio/`. Si existe, tiene prioridad.          |

## Comportamiento

- Renderiza un botón único de play/pausa con SVG inline y `currentColor`, alineado visualmente con los íconos de compartir.
- El badge de velocidad aparece a la derecha del ícono solo mientras la lectura está reproduciendo; se oculta al pausar o finalizar.
- El botón play/pausa y el badge de velocidad usan tooltip visual con Tailwind (`group-hover`) en vez de `title` nativo.
- El tooltip de play/pausa actualiza su texto junto con el estado: escuchar, pausar o reanudar.
- Al hacer click sobre el botón o el badge, el tooltip se oculta aunque el cursor siga encima; se reactiva al salir y volver a hacer hover.
- El tooltip del badge solo puede aparecer mientras el badge está visible, porque el wrapper completo se oculta fuera del estado de reproducción.
- La inicialización se difiere con `IntersectionObserver` sobre `[data-article-player]`, equivalente al objetivo de `client:visible` sin crear una isla de framework.
- Si existe `audioSrc`, el componente usa un `HTMLAudioElement` creado por script y controla play/pausa/velocidad sobre el MP3.
- Si no existe `audioSrc`, usa Web Speech API como fallback.
- Si el navegador no soporta `speechSynthesis` o `SpeechSynthesisUtterance` y tampoco existe `audioSrc`, el contenedor queda oculto y no bloquea la lectura.
- La extracción clona el artículo y remueve `pre`, `code`, `table` y `figcaption` antes de leer `textContent`.
- El texto se divide en chunks de unas 200 palabras para evitar cancelaciones de Chrome en utterances largas.
- Cancela la reproducción en `beforeunload`.

## Audio pre-generado

El flujo preferido para artículos publicados es MP3 estático generado con Google Cloud TTS Neural2:

```text
public/audio/manifest.json → blog/[slug].astro → ShareBar → ArticlePlayer
```

- `src/pages/blog/[slug].astro` importa `public/audio/manifest.json` en build time y resuelve el archivo por `post.slug` + idioma activo (`es` o `en`).
- `ShareBar` recibe `audioSrc` y lo pasa sin alterar el diseño visual del bloque de compartir.
- `ArticlePlayer` usa MP3 cuando `audioSrc` existe; si el manifiesto no tiene entrada para el artículo/idioma, mantiene Web Speech API.
- Para regenerar audio manualmente en GitHub Actions, ejecutar el workflow `Generate TTS audio` con `workflow_dispatch`.
- Para cambiar voces por defecto, editar las constantes `voices` en `scripts/generate-tts.mjs`; para una tanda puntual, usar `TTS_ES_VOICE` y/o `TTS_EN_VOICE`.
- Para invalidar todo el cache de audio, aumentar `TTS_ENGINE_VERSION` en el workflow o al ejecutar el script localmente.
- Para validar sin costo, usar `node scripts/generate-tts.mjs --dry-run --slug=<slug>`.

## Limitaciones conocidas

- La calidad, disponibilidad y acento de Web Speech API depende del sistema operativo y del navegador del usuario; no aplica cuando existe MP3 pre-generado.
- `speechSynthesis.getVoices()` puede devolver vacío en el primer llamado; el componente espera `voiceschanged` y reintenta solo en fallback Web Speech.
- La velocidad cambia entre `1x`, `1.2x` y `0.85x`; en MP3 aplica inmediatamente y en Web Speech aplica al siguiente chunk.

## Decisiones de diseño

- Se prioriza MP3 pre-generado porque da calidad consistente, evita el límite de utterances largas de Chrome y se sirve desde CDN como asset estático.
- Se conserva Web Speech API como fallback sin costo para artículos o idiomas que todavía no tengan MP3.
- El componente vive junto a `ShareBar` porque es una acción contextual de lectura/compartir del artículo, no un control global.
- No usa emojis, `<style>` local ni variantes `dark:`; todo el estilo depende de utilidades Tailwind, SVG inline y tokens CSS.

## Ruta de upgrade

Próximo upgrade posible: exponer una barra de progreso nativa/custom para permitir seek explícito en MP3 pre-generados, manteniendo el botón compacto actual en la `ShareBar`.

## Estado

Documentado
