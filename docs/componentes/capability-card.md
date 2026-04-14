# CapabilityCard

**Ruta:** `src/components/CapabilityCard.astro`

**Usado en:** `src/pages/talento.astro`

## Props

| Prop | Tipo | Requerida | Descripción |
|------|------|-----------|-------------|
| `capability` | objeto | Sí | Datos de la capacidad o skill. |

**`capability`**

| Campo | Tipo | Requerida | Descripción |
|-------|------|-----------|-------------|
| `title` | `string` | Sí | Nombre de la capacidad. |
| `titleEn` | `string` | No | Título EN. |
| `description` | `string` | Sí | Texto descriptivo. |
| `descriptionEn` | `string` | No | Descripción EN. |
| `icon` | `string` | No | Contenido mostrado en el recuadro de icono (ej. emoji). |
| `level` | `number` | No | 0–100 para barra visual; default 80 si ausente. |
| `tags` | `string[]` | No | Chips opcionales bajo la tarjeta. |

## Comportamiento

- Tarjeta con borde hover, icono opcional, barra de nivel vía CSS variable `--level`.
- Textos con `data-en` / `data-es` para i18n global.

## Decisiones de diseño

- Nivel acotado con `Math.min/Math.max` para evitar valores fuera de rango en CSS.

## Deuda técnica conocida

- Ninguna crítica identificada.

## Estado

Documentado
