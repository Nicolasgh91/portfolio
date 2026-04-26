# Landing templates (subdominio demo)

**Rutas relacionadas**

- [`src/schemas/landing-template.ts`](../../src/schemas/landing-template.ts) — contrato Zod (`LandingTemplate`).
- [`src/data/landing-templates.ts`](../../src/data/landing-templates.ts) — datos parseados + `VERTICAL_ORDER`, `VERTICAL_LABELS` (SSOT de labels de vertical).
- [`src/lib/resolve-template-demo-url.ts`](../../src/lib/resolve-template-demo-url.ts) — resolución de `demoUrl` (env solo en páginas).
- [`src/pages/plantillas.astro`](../../src/pages/plantillas.astro) — índice del catálogo.
- [`src/pages/index.astro`](../../src/pages/index.astro) — strip “Plantillas con demo en vivo” (plantillas `available` con `demoUrl` resuelto).
- [`src/pages/plantillas/[slug].astro`](../../src/pages/plantillas/[slug].astro) — ficha canónica por plantilla.
- [`src/content/services/landing-page.mdx`](../../src/content/services/landing-page.mdx)
- [`src/pages/sitemap.xml.ts`](../../src/pages/sitemap.xml.ts)
- [`src/data/template-carousel-images.ts`](../../src/data/template-carousel-images.ts) — miniaturas del carrusel (`slug` → import estático desde `src/assets/templates/`).

## Imágenes del carrusel

- **Fuente:** `src/assets/templates/`. Preferir `{slug}.webp` (≥800×450 px, 16:9); `.png` solo si hace falta transparencia.
- **Mapeo:** [`template-carousel-images.ts`](../../src/data/template-carousel-images.ts) — registro explícito cuando el nombre de archivo no coincide con el slug (ej. `viandas.webp` → `menu-digital-viandas`).
- El campo Zod `thumbnail` no duplica este mapeo; sirve para rutas `/public` u otras URLs si otro flujo las necesita.

## Strip de demos en la home

- **Datos:** mismos `landingTemplates` + [`resolveTemplateDemoUrl`](../../src/lib/resolve-template-demo-url.ts) + `PUBLIC_TEMPLATE_PYME_URL` (fallback como en `plantillas.astro`). Solo entradas **`status === 'available'`** y con demo resuelto (no `null`).
- **Orden:** por `priority` descendente (como criterio estable).
- **Imagen:** [`getTemplateCarouselImage(slug)`](../../src/data/template-carousel-images.ts) + `<Image />` de Astro en contenedor **`aspect-video`**; si no hay miniatura mapeada, placeholder neutro.
- **Layout:** mobile — `flex` horizontal, `overflow-x-auto`, `snap-x` / `snap-mandatory` / `snap-start` por ítem, sin flechas; desktop — `md:grid md:grid-cols-3` (1–2 ítems ocupan columnas naturales sin huecos forzados).
- **CTA:** enlace “Ver demo” + flecha SVG con `group-hover:translate-x-1`; demos absolutas abren en nueva pestaña.

| Slug                      | Archivo en repo              |
| ------------------------- | ---------------------------- |
| `menu-digital-viandas`    | `viandas.webp`               |
| `menu-digital-congelados` | `congelados.webp`            |
| `portfolio-profesional`   | `portfolio.webp`             |
| `hub-creador-contenido`   | `hub-creador-contenido.webp` |
| `catalogo-productos`      | `ecommerce.webp`             |
| `landing-inmobiliaria`    | `inmobiliaria.webp`          |
| `landing-dietetica`       | `healthy-food.webp`          |
| `landing-consultora`      | `consultora.webp`            |

## Contrato Zod (resumen)

| Campo                          | Notas                                                                                                                            |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| `slug`, `title`, `description` | Obligatorios                                                                                                                     |
| `titleEn`, `descriptionEn`     | Opcionales (i18n en tarjetas, fichas, JSON-LD y meta)                                                                            |
| `vertical`                     | `gastronomia` \| `profesionales` \| `contenido` \| `ecommerce` \| `salud` \| `inmobiliaria` — display solo vía `VERTICAL_LABELS` |
| `status`                       | `available` \| `coming_soon` — solo `available` entra en JSON-LD `ItemList` del índice; ambas se listan en UI                    |
| `type`                         | `landing` \| `menu-digital` \| `hub-contenido` \| `catalogo`                                                                     |
| `features`, `featuresEn`       | `features` es obligatorio; `featuresEn` es opcional y se alinea por índice para fichas EN                                        |
| `thumbnail`                    | Opcional; `/public` u URL absoluta (otros usos). Carrusel: ver `template-carousel-images.ts` + assets en `src/assets/templates/` |
| `cardBackground`               | `dark` \| `light` \| `warm` — fondo de tarjeta en carrusel                                                                       |
| `demoUrl`                      | Opcional; URL absoluta o path `/...` (resolución solo en la página)                                                              |
| `priceGroup`                   | `basico` \| `plantilla` \| `full` — alineado a planes del catálogo                                                               |
| `priceLabel`                   | Opcional; no se muestra en la tarjeta del carrusel (puede usarse para lógica futura)                                             |
| `priority`                     | 0–1; orden en catálogo (mayor primero)                                                                                           |
| `tags`                         | Opcional                                                                                                                         |

### Sugerencia de `cardBackground` por vertical (orientativa)

| Vertical                         | Suele usarse                   |
| -------------------------------- | ------------------------------ |
| Gastronomía                      | `dark`, `warm`                 |
| Profesionales                    | `light`                        |
| Contenido                        | `dark`                         |
| Ecommerce / salud / inmobiliaria | según branding de la plantilla |

## Resolución por entorno

- No usar `import.meta.env` en `src/data/*.ts`.
- En [`plantillas.astro`](../../src/pages/plantillas.astro) y [`plantillas/[slug].astro`](../../src/pages/plantillas/[slug].astro): `PUBLIC_TEMPLATE_PYME_URL` (default `https://template-pyme.escalatunegocioconia.com`); rutas `/` → `resolveTemplateDemoUrl()` con `new URL(path, base)`.
- `status === 'coming_soon'`: tarjeta en modo “Próximamente”; sin entrada en `ItemList` del índice.
- `status === 'available'`: ficha en `/plantillas/:slug`; si hay `demoUrl`, CTA “Ver demo”; si no, CTA “Ver ficha”.

## Desarrollo local (template PYME)

- **Template PYME:** repo `template-pyme` en puerto **5174**; `PUBLIC_TEMPLATE_PYME_URL=http://localhost:5174` para resolver paths relativos como `/servicios`, `/productos`, etc.
- **Demo en subdominio propio:** si la plantilla no vive bajo el host de template-pyme, usar en datos una `demoUrl` absoluta (ej. hub creador: `https://creador-contenido.escalatunegocioconia.com/`); `resolveTemplateDemoUrl` la devuelve sin prefijar la base.

## SEO y despliegue

- `/plantillas` y `/plantillas/:slug` indexables; `ItemList` usa URLs canónicas de ficha, no fragmentos ni demo externa como única URL.
- Redirección legacy `/catalogo-de-landings` → `/plantillas` (Vercel).
- El SPA hub/editorial en `creador-contenido.escalatunegocioconia.com` puede mantener `noindex` en su propio `index.html` mientras sea política de producto; el dominio legacy `demo.*` debe redirigir al nuevo host (p. ej. regla en `vercel.json` del repo SPA) si sigue apuntando al mismo proyecto.

## Estado

Documentado
