# Convenciones de contenido (MDX)

## Colecciones activas
- `blog`, `services`, `projects` (content) y `faq` (data) en `src/content/config.ts`.
- Los frontmatter validan por Zod y usan `.describe()` (Fase 1).

## Frontmatter mínimo por colección
- `services`: `title`, `titleEn`, `description`, `descriptionEn`, `order` (+ opcionales: `icon`, `shortDescription`, `roiFocus`, `module`, `priceFrom`, `coverImage` vía `image()`, `imageKey` como respaldo, `href`, etc.).
- `blog`: `title`, `description`, `pubDate`, `category`, `tags` (+ opcionales: `readingTime`, `coverImageKey`, `priority`, `pillarSlug`, `vertical`, `slides`).
- `projects`: `title`, `description`, `descriptionEn`, `status`, `tags`, `order`, `featured` (+ opcionales: `icon`, `coverImage` vía `image()`, `coverPosition` `top` \| `center` \| `bottom` con default `top`, URLs, etc.).

## Estructura editorial recomendada (extraída de backlog)
- Introducción breve orientada a problema.
- Secciones: `## Problema`, `## Solución`, `## Resultado`, `## Cómo funciona`, `## CTA`.
- Lenguaje de negocio (beneficio medible) antes que detalle técnico.

## Convenciones específicas
- Slides en blog: ver `docs/convenciones-assets.md`.
- Tablas MDX: pasan por `TableWrapper` en `blog/[slug].astro`.
- Taxonomías (`category`, `tags`) deben ser consistentes para páginas dinámicas.
- En `services`, el campo `href` se usa para desviar una tarjeta hacia rutas dedicadas (por ejemplo `/plantillas`) sin romper el flujo por anclas en `/servicios`.
- `coverImage` en `services`: rutas relativas al MDX (`../../assets/...`); para arte del catálogo se usa `src/assets/services/` además de `blog/` cuando aplique.

## Flujo sugerido de publicación
1. Crear/editar MDX.
2. Validar contra Zod (`astro check`).
3. Agregar/actualizar entradas de apoyo del chatbot (`public/chatbot/data/articles.json`) solo para contenido editorial tipo artículo.

## Nota de integración (subdominio de templates)
- El catálogo de landings se alimenta desde `src/data/landing-templates.ts`.
- `src/pages/plantillas.astro` y `src/pages/plantillas/[slug].astro` solo renderizan datos importados (sin arrays hardcodeados de negocio en la página).

## Estado
✅ Documentado
