# SectionLabel

**Ruta:** [`src/components/SectionLabel.astro`](../../src/components/SectionLabel.astro)

**Usado en:** landings de negocio (home, servicios, talento) como rótulo sobre títulos de bloque.

## Props

| Prop | Tipo | Requerida | Descripción |
|------|------|-----------|-------------|
| `text` | `string` | Sí | Texto ES (visible por defecto). |
| `textEn` | `string` | Sí | Texto EN (`hidden` hasta `nhLang`). |
| `colorClass` | `string` | No | Clases de color; default `text-orange-400`. |

## Comportamiento

- `<span>` con pares `data-es` / `data-en` para el toggle de idioma global.

## Estado

Documentado
