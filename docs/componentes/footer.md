# Footer

**Ruta:** `src/components/Footer.astro`

**Usado en:** `src/layouts/Layout.astro`

## Props

| Prop | Tipo | Requerida | Descripción                                                                             |
| ---- | ---- | --------- | --------------------------------------------------------------------------------------- |
| —    | —    | —         | Ninguna; datos vía `getCollection('services')` y `getCollection('blog')` + `site.json`. |

## Comportamiento

- Inyecta JSON-LD `SiteNavigationElement` con títulos y URLs de servicios (anclas `#`), posts de blog (hasta 6, no draft), CTA contacto, email.
- Pie con enlaces a servicios (mapeo slug → id de ancla `serviceAnchorId`), artículos recientes, redes desde `site.json`, año dinámico.
- CTA “Agenda una reunión” / “Book a meeting”: `btn-primary btn-bounce` con `span.arrow` para la flecha (ver [`btn-bounce.md`](./btn-bounce.md)).
- Estructura semántica `contentinfo` y enlaces legales/CTA según diseño actual del archivo.

## Decisiones de diseño

- Contenedor interno del pie: **`mx-auto w-full max-w-7xl px-6`** (mismo patrón que el inner de `SectionWrapper`), no `.page-container`. Así home/servicios alinean bordes con secciones marketing; blog/talento siguen usando `.page-container` (960px) en el `<main>` para prosa legible — el footer puede verse más ancho que el cuerpo en esas rutas de forma intencional.
- Servicios ordenados por `order` del frontmatter; blog por `pubDate` descendente.

## Deuda técnica conocida

- Acoplamiento al mapa fijo `serviceAnchorId`: nuevos slugs de servicio requieren entrada en el mapa o fallback `service-{slug}`.

## Estado

Documentado
