# Documentación del proyecto

Índice de guías y estado.

| Documento                              | Descripción                                                                              | Estado |
| -------------------------------------- | ---------------------------------------------------------------------------------------- | ------ |
| [scroll-reveal.md](./scroll-reveal.md) | `.reveal` vs Alt B (`data-alt-reveal`), partición por ruta, `no-js`, `nhA11y`, checklist | Activo |

## Decisiones (ADR)

| Documento                                                                                          | Descripción                                                                                         | Estado   |
| -------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | -------- |
| [decisiones/adr-001-catalogo-visual.md](./decisiones/adr-001-catalogo-visual.md)                   | Storybook / catálogo visual                                                                         | Diferido |
| [decisiones/adr-002-sitio-docs.md](./decisiones/adr-002-sitio-docs.md)                             | Starlight / sitio docs dedicado                                                                     | Diferido |
| [decisiones/adr-003-servicios-tonal-layering.md](./decisiones/adr-003-servicios-tonal-layering.md) | Capas tonales + glass solo en oscuro en `/servicios`                                                | Activo   |
| [subsistemas/landing-templates.md](./subsistemas/landing-templates.md)                             | Contrato Zod, demos, carrusel `/plantillas`, strip de demos en home (`template-carousel-images.ts`) | Activo   |
| [subsistemas/seo-tecnico.md](./subsistemas/seo-tecnico.md)                                         | Sitemap único con `@astrojs/sitemap`, `robots.txt`, i18n ES/EN indexable y checklist operativo GSC  | Activo   |
| [subsistemas/sistema-diseno.md](./subsistemas/sistema-diseno.md)                                   | Tokens, `.section-dark` / `.section-accent`, safelist, animación marquee                            | Activo   |
| [subsistemas/convenciones-contenido.md](./subsistemas/convenciones-contenido.md)                   | Frontmatter MDX por colección                                                                       | Activo   |
| [subsistemas/faq-jsonld-seo.md](./subsistemas/faq-jsonld-seo.md)                                   | FAQPage JSON-LD, sin microdata, tests y Rich Results manual                                         | Activo   |
| [subsistemas/ci-github-actions.md](./subsistemas/ci-github-actions.md)                             | GitHub Actions: lint, check, build en `main`, caché npm, permisos mínimos                           | Activo   |

## Componentes (fichas)

| Documento                                                                    | Componente                                        |
| ---------------------------------------------------------------------------- | ------------------------------------------------- |
| [componentes/section-wrapper.md](./componentes/section-wrapper.md)           | `SectionWrapper`                                  |
| [componentes/section-label.md](./componentes/section-label.md)               | `SectionLabel`                                    |
| [componentes/btn-bounce.md](./componentes/btn-bounce.md)                     | Patrón `.btn-bounce` / `.arrow` (CTAs con flecha) |
| [componentes/metric-display.md](./componentes/metric-display.md)             | `MetricDisplay`                                   |
| [componentes/project-card.md](./componentes/project-card.md)                 | `ProjectCard`                                     |
| [componentes/faq-accordion.md](./componentes/faq-accordion.md)               | `FAQAccordion`                                    |
| [componentes/LogoMarquee.md](./componentes/LogoMarquee.md)                   | `LogoMarquee`                                     |
| [componentes/hero-section.md](./componentes/hero-section.md)                 | `HeroSection`                                     |
| [componentes/liquid-glass-marquee.md](./componentes/liquid-glass-marquee.md) | `LiquidGlassMarquee`                              |
| [componentes/page-hero-section.md](./componentes/page-hero-section.md)       | `PageHeroSection`                                 |
| [componentes/faq-section.md](./componentes/faq-section.md)                   | `FaqSection`                                      |
| [componentes/service-card.md](./componentes/service-card.md)                 | `ServiceCard`                                     |
| [componentes/ArticlePlayer.md](./componentes/ArticlePlayer.md)               | `ArticlePlayer`                                   |

El resto de fichas en [`componentes/`](./componentes/) siguen el mismo formato (ruta, props, comportamiento).

## Claves `localStorage` (shell / `Layout.astro`)

| Clave               | Escritura                                                                                                | Semántica                                                                                                                                                                                                                                                                                       |
| ------------------- | -------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `nh-theme`          | Toggle tema (barra)                                                                                      | `'dark'` \| `'light'`.                                                                                                                                                                                                                                                                          |
| `nh-font-scale`     | Botones tamaño de texto en panel a11y                                                                    | Número serializado (p. ej. `1`, `1.15`, `1.3`).                                                                                                                                                                                                                                                 |
| `nh-hc`             | Alto contraste en panel a11y                                                                             | `'true'` cuando activo; ausente u otro valor → no forzar HC al cargar (el init solo aplica si `'true'`).                                                                                                                                                                                        |
| `nh-reduced-motion` | Solo al usar **Activado** / **Reducido** en el panel (segundo argumento `persist` en `setReducedMotion`) | `'true'` = movimiento reducido en el sitio; `'false'` = elección explícita de movimiento completo (override respecto al SO hasta que el usuario cambie o borre datos del sitio). **Ausente:** no se escribe en la primera visita; el head y `nhA11y` usan `prefers-reduced-motion` del sistema. |

Orden relevante: el script síncrono del `<head>` lee `nh-reduced-motion` y aplica `html.no-motion` antes del primer paint cuando corresponde; el bloque `nhA11y` al final del `<body>` sincroniza botones, estilo `#nh-no-motion` y `window.nhA11y.motionReduced` sin persistir en la inicialización automática.
