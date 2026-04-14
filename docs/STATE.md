# Estado del proyecto (cambios recientes)

## 2026-03-25 — Fase 4 del plan de documentación (estado, deuda y ADRs)

- **Qué:** creados [`docs/matriz-estado.md`](matriz-estado.md), [`docs/deuda-tecnica.md`](deuda-tecnica.md), [`docs/patrones-arquitectura.md`](patrones-arquitectura.md), [`docs/decisiones/adr-001-catalogo-visual.md`](decisiones/adr-001-catalogo-visual.md) y [`docs/decisiones/adr-002-sitio-docs.md`](decisiones/adr-002-sitio-docs.md). Fase 4 marcada completa en [`README.md`](README.md) y [`doc-index.md`](doc-index.md).

## 2026-03-24 — Fase 3 del plan de documentación (subsistemas)

- **Qué:** creados [`docs/subsistemas/chatbot.md`](subsistemas/chatbot.md), [`sistema-diseno.md`](subsistemas/sistema-diseno.md), [`seo-tecnico.md`](subsistemas/seo-tecnico.md), [`convenciones-contenido.md`](subsistemas/convenciones-contenido.md) y [`seguridad.md`](subsistemas/seguridad.md). Índice actualizado en [`README.md`](README.md) y [`doc-index.md`](doc-index.md).

## 2026-03-24 — Fase 2 del plan de documentación (guías de componentes)

- **Qué:** 18 archivos en [`docs/componentes/`](componentes/) (17 componentes `.astro` del inventario + `layout.md`), template unificado: props, comportamiento, decisiones, deuda, estado. Índice actualizado en [`README.md`](README.md) y [`doc-index.md`](doc-index.md).

## 2026-03-24 — Fase 1 del plan de documentación (contratos Zod)

- **Qué:** `.describe()` en colecciones `projects`, `services`, `blog` y entradas `faq` en `config.ts`; mismo criterio en `schemas/*.ts`; `blogSlidesSchema` + [`docs/convenciones-assets.md`](convenciones-assets.md); [`src/lib/slides.ts`](../src/lib/slides.ts) con `getSlideImageFromGlobModule` usado por `SlideViewer.astro`; `tsconfig.json` incluye `src/**/*.ts`.
- **Verificación:** `astro check` (WSL) sin errores.

## 2026-03-24 — Fase 0 del plan de documentación (inventario)

- **Qué:** Cerrada la Fase 0 de [`doc-index.md`](doc-index.md): inventario de componentes/páginas/layouts/content/API, rutas y renderizado, índice maestro `docs/README.md`, grafo de dependencias (tabla + Mermaid).
- **Archivos:** [`public/chatbot/docs/inventario-componentes.md`](../public/chatbot/docs/inventario-componentes.md), [`docs/inventario-rutas.md`](inventario-rutas.md), [`docs/README.md`](README.md), [`docs/grafo-dependencias.md`](grafo-dependencias.md); `doc-index.md` y esta bitácora actualizados.

## 2026-03-21 — Home: barra de estadísticas oculta

- **Qué:** En la ruta `/` (home), la barra de estadísticas (3+ años, conteo de proyectos de la colección, ∞ IA) dejó de mostrarse. El HTML se mantiene. En el `div` hay `class="stats-bar hidden"`, pero la utilidad global Tailwind `hidden` **no alcanzaba**: el `<style>` scoped de la página aplica `.stats-bar { display: grid }` con selector `.stats-bar[data-astro-cid-…]`, que gana en especificidad a `.hidden`. Por eso en el mismo `<style>` se añadió `.stats-bar.hidden { display: none; }` (también scoped), que sí anula el grid.
- **Archivo:** [`src/pages/index.astro`](../src/pages/index.astro) — bloque `<!-- ── Stats bar ── -->` y regla `.stats-bar.hidden` en el `<style>` del final.
- **Revertir:** Quitar `hidden` del `div` y eliminar la regla `.stats-bar.hidden` (y el comentario asociado) del `<style>` local.

## 2026-03-21 — Hero home: CTAs ocultos

- **Qué:** En la ruta `/` (home), el bloque de CTAs del hero dejó de mostrarse: enlace «Solicitar diagnóstico gratuito» (`/contacto`) y botón «Ver cómo funciona». El HTML se mantiene en el componente; solo se oculta con CSS (Tailwind `hidden` → `display: none`).
- **Archivo:** [`src/components/HeroSection.astro`](../src/components/HeroSection.astro) — contenedor del comentario `<!-- CTAs: ... -->`, clase del `div` pasó a `mb-12 hidden` (antes incluía `flex flex-wrap items-center gap-4`).
- **Revertir:** En ese `div`, quitar `hidden` y restaurar las clases de layout: `flex flex-wrap items-center gap-4 mb-12`.
