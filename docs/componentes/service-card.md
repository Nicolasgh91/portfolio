# ServiceCard

**Ruta:** [`src/components/ServiceCard.astro`](../../src/components/ServiceCard.astro)

**Usado en:** [`src/pages/servicios.astro`](../../src/pages/servicios.astro)

## Props

| Prop        | Tipo                | Requerida | Descripción                                                                                                                                                                                                         |
| ----------- | ------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `headingId` | `string`            | Sí        | `id` del `<h3>` del servicio; usado en `aria-labelledby` del enlace overlay (tarjeta clicable completa) o del enlace superior en flujo “Consultar”. Debe ser único en la página (p. ej. `service-heading-${slug}`). |
| `imageSide` | `'left' \| 'right'` | No        | Default `left`. Desde `md:` define zig-zag: imagen a la izquierda o a la derecha; en móvil la imagen va siempre arriba (orden DOM fijo).                                                                            |
| `service`   | objeto              | Sí        | Ver subcampos.                                                                                                                                                                                                      |

**`service`**

| Campo                     | Tipo                                           | Requerida | Descripción                                                                                                                                                                                                   |
| ------------------------- | ---------------------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `title`                   | `string`                                       | Sí        | Título (ES).                                                                                                                                                                                                  |
| `titleEn`                 | `string`                                       | No        | Título EN (`data-en`).                                                                                                                                                                                        |
| `shortDescription`        | `string`                                       | Sí        | Resumen para la tarjeta.                                                                                                                                                                                      |
| `shortDescriptionEn`      | `string`                                       | No        | Resumen EN.                                                                                                                                                                                                   |
| `roiFocus` / `roiFocusEn` | `string`                                       | No        | Línea ROI; color `var(--text-muted)` para jerarquía bajo el cuerpo.                                                                                                                                           |
| `href`                    | `string`                                       | No        | URL interna o externa.                                                                                                                                                                                        |
| `coverImage`              | `ImageMetadata`                                | No        | Prioridad sobre `imageKey`.                                                                                                                                                                                   |
| `imageKey`                | `'human-ai' \| 'cloud-servers' \| 'satellite'` | No        | Respaldo raster.                                                                                                                                                                                              |
| `featured`                | `boolean`                                      | No        | Chip “Más elegido” sobre la imagen.                                                                                                                                                                           |
| `price`                   | `string`                                       | No        | Valor o literal `Consultar` (pie con enlaces a contacto / WhatsApp).                                                                                                                                          |
| `priceUnit`               | `string`                                       | No        | Unidad (ej. `ARS`).                                                                                                                                                                                           |
| `pricePrefix`             | `string`                                       | No        | Default `"$"`; `""` para ARS u otro.                                                                                                                                                                          |
| `tags`                    | `string[]`                                     | No        | Pills bajo la descripción; las dos primeras también en overlay sobre la imagen (esquina inferior izquierda). Origen: frontmatter `tags` en colección `services` ([`config.ts`](../../src/content/config.ts)). |

## Comportamiento

- **Alternativa C (catálogo):** tarjeta horizontal con **`border-[var(--border-strong)]`** + **`border-l-4 border-l-[var(--color-accent-600)]`**, clase **`service-card-shell-bg`** (fondo por capa tonal + vidrio solo en oscuro; ver abajo), **`shadow-md` / `hover:shadow-lg`**, **`transition-all duration-200 ease-out`**, **`will-change-transform`** con **`motion-reduce:will-change-auto`** y transiciones acotadas en movimiento reducido. Fila `flex-col` en móvil y `md:flex-row` / **`md:flex-row-reverse`** según `imageSide` (zig-zag).
- **Capas tonales:** la franja del catálogo en [`servicios.astro`](../../src/pages/servicios.astro) usa **`--bg-surface-container-low`**; el shell de la tarjeta usa **`--bg-surface-container-lowest`** en claro vía la misma clase. En tema oscuro, **`.service-card-shell-bg`** en [`tokens.css`](../../src/styles/tokens.css) aplica **`--bg-card`** y **`backdrop-filter: blur(12px)`** solo con **`:root:not(.light)`** (no confiar en `dark:` de Tailwind en este repo).
- **CTA “Ver servicio”:** el ícono va dentro de **`<span class="arrow" aria-hidden="true">`** para reutilizar **`bounce-right`** con **`group/card:hover`** (mismo patrón que [`ProjectCard`](./project-card.md)). Tras cambios, verificar con búsqueda del path SVG `M5 12h14` que ninguna copia quede sin `.arrow` padre.
- **Tema claro / oscuro:** shell, tipografía y pills usan tokens (`--text-primary`, `--text-secondary`, `--text-muted`, `--bg-tag`, `--accent`, etc.); no depender de `slate-*` fijos en la tarjeta.
- **Imagen:** `<Image />` Astro, `object-cover`, hover `scale-[1.02]` (respeto `motion-reduce:`). Wrapper **`bg-[var(--bg-tertiary)]`** con **`md:rounded-tl-3xl md:rounded-bl-3xl`** (imagen izquierda) o **`md:rounded-tr-3xl md:rounded-br-3xl`** (derecha); en móvil `rounded-t-xl` en el bloque imagen.
- **Precio / enlaces:**
  - `price === 'Consultar'`: pie fijo con “Consultar precio” y WhatsApp opcional (`site.json`); borde superior **`var(--border-normal)`**, fondo pie **`var(--bg-surface-container-low)`**; si hay `href`, la zona imagen+texto es un `<a>`; si no hay `href`, solo el pie enlaza.
  - `price` distinto de `Consultar` y `href`: `<article>` con **overlay** `<a>` a pantalla completa (`aria-labelledby={headingId}`), `target="_blank` solo si `href` comienza con `http`.
  - Sin `href`: bloque informativo con precio si aplica, sin overlay.
- **Bilingüe:** `data-en` / `data-es` en textos conmutables.

## Verificación / despliegue

Tras `npm run build`, el HTML de `/servicios` debe incluir `id="service-heading-<slug>"` y clases **`md:flex-row-reverse`** en aproximadamente la mitad de las tarjetas (filas pares). Si en producción aún se ve un grid antiguo: comprobar rama desplegada, caché CDN/navegador y que la URL corresponda a este proyecto.

## Decisiones de diseño

- Misma línea editorial que la home en uso de `--color-accent-600` en la barra lateral; zig-zag análogo en espíritu a [`ProjectCard`](./project-card.md) pero con superficie tokenizada (no overlay cinematográfico).
- Pills en imagen con `bg-black/55` para legibilidad sobre portadas variables.
- Fundamento de capas y glass: [`adr-003-servicios-tonal-layering.md`](../decisiones/adr-003-servicios-tonal-layering.md).

## Estado

Documentado
