# FAQ — `src/content/faq/entries.json`

## Decisión de contenido

Las entradas siguen el copy del prototipo en [`backlog/tareas-rediseio-faq.md`](../backlog/tareas-rediseio-faq.md) (6 preguntas), no una migración literal de las cuatro FAQ que estaban hardcodeadas en `servicios.astro`.

**Importante:** en la carpeta `src/content/faq/` solo debe existir **`entries.json`**. No agregar archivos `.md` ahí: Astro las trataría como entradas `content` y rompería la colección `type: 'data'`.

## Cómo agregar o editar preguntas

1. Editá `src/content/faq/entries.json`: archivo **array JSON en la raíz** `[{ ... }, ...]`.
2. Cada objeto incluye:
   - `order` (número): orden de visualización (menor primero).
   - `category`: `proceso` | `comercial` | `tecnico` | `soporte`.
   - `question`, `questionEn`, `answer`, `answerEn` (strings).
   - Opcional: `highlight`, `highlightEn` — reservados para futura UI (no se muestran en la v1 del componente).
3. Ejecutá `npm run build` (en WSL, según convención del repo) para validar contra Zod en `src/content/config.ts`.
4. **Tags de categoría en la UI:** solo se muestran si hay **más de 8** entradas (`FAQ_TAG_THRESHOLD` en `FaqSection.astro`). Con 6 ítems no hay tags; al superar el umbral, revisá cada `category`.
