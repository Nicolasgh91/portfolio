# MetricDisplay

**Ruta:** [`src/components/MetricDisplay.astro`](../../src/components/MetricDisplay.astro)

**Usado en:** [`src/pages/index.astro`](../../src/pages/index.astro) (bloque de métricas).

## Props

| Prop              | Tipo     | Requerida | Descripción                                                                                                |
| ----------------- | -------- | --------- | ---------------------------------------------------------------------------------------------------------- |
| `value`           | `string` | Sí        | Valor mostrado (p. ej. `−40%`, `+3×`).                                                                     |
| `label`           | `string` | Sí        | Descripción corta ES.                                                                                      |
| `labelEn`         | `string` | Sí        | Descripción corta EN.                                                                                      |
| `valueColorClass` | `string` | No        | Color del valor; default **`text-[var(--accent)]`** (definido en `tokens.css` en `:root` y `:root.light`). |

## Comportamiento

- El tamaño del valor usa `style="font-size: var(--text-metric)"` para acoplarse a `--font-scale` (no utilidades `text-7xl` fijas).
- El label usa `text-[var(--text-secondary)]` para seguir el tema sin utilidades `dark:` de Tailwind.
- El label ES/EN se resuelve por SSR con `localeFromPathname`, sin spans duplicados ni dependencia de `.hidden`.

## Estado

Documentado
