# SectionLabel

**Ruta:** [`src/components/SectionLabel.astro`](../../src/components/SectionLabel.astro)

**Usado en:** landings de negocio (home, servicios, talento) como rótulo sobre títulos de bloque.

## Props

| Prop         | Tipo     | Requerida | Descripción                                  |
| ------------ | -------- | --------- | -------------------------------------------- |
| `text`       | `string` | Sí        | Texto ES (visible por defecto).              |
| `textEn`     | `string` | Sí        | Texto EN renderizado por SSR en rutas `/en`. |
| `colorClass` | `string` | No        | Clases de color; default `text-orange-400`.  |

## Comportamiento

- `<span>` único con texto resuelto por `localeFromPathname`; no depende de `nhLang` ni de `.hidden`.

## Estado

Documentado
