# Índice maestro — Plan de documentación (5 fases)

Este archivo es la **exportación** del plan acordado para documentar el proyecto. El plan canónico en Cursor vive en `.cursor/plans/estrategia_documentación_proyecto_342295a9.plan.md`.

**Reglas generales**

- Cada fase es **autónoma**: ejecutar, verificar y cerrar antes de la siguiente.
- Cada tarea tiene un **entregable concreto** (ruta de archivo o diff claro).
- **No** implementar Storybook ni Starlight hasta **Fase 4** (evaluación y ADR).

## Estado de ejecución

| Fase  | Estado                    |
| ----- | ------------------------- |
| **0** | **Completa** (2026-03-24) |
| **1** | **Completa** (2026-03-24) |
| **2** | **Completa** (2026-03-24) |
| **3** | **Completa** (2026-03-24) |
| **4** | **Completa** (2026-03-25) |

**Correcciones al plan original**

- SlideViewer se documenta en **Fase 2**, no al inicio: sin inventario (Fase 0) hay ángulos muertos.
- **Storybook / Starlight:** diferidos; decisión en `docs/decisiones/adr-001-catalogo-visual.md` y `adr-002-sitio-docs.md`.
- **Safelist Tailwind** y **listener global `keydown`** en SlideViewer: solo **deuda documentada** en `docs/componentes/slide-viewer.md`; fixes de código fuera de las fases de documentación.

---

## Fase 0 — Inventario y estructura base

**Estado: completa.**

**Objetivo:** saber qué existe y crear el esqueleto de documentación.

| #   | Entregable                                                                                                                        |
| --- | --------------------------------------------------------------------------------------------------------------------------------- |
| 0.1 | `public/chatbot/docs/inventario-componentes.md` — tabla: componentes/páginas/layouts/content/api; nombre, ruta, tipo, props, usos |
| 0.2 | Rutas del sitio + tipo de renderizado: sección en 0.1 **o** `docs/inventario-rutas.md`                                            |
| 0.3 | `docs/README.md` — índice con links y **estado** por guía (pendiente / en progreso / completa)                                    |
| 0.4 | `docs/grafo-dependencias.md` — importaciones entre componentes (tabla o Mermaid)                                                  |

**Cierre:** inventario = repo real, sin suposiciones.

---

## Fase 1 — Contratos de datos

**Estado: completa.**

**Objetivo:** `config.ts` y `schemas/*.ts` autoexplicativos.

| #   | Entregable                                                                                                           |
| --- | -------------------------------------------------------------------------------------------------------------------- |
| 1.1 | `src/content/config.ts` — `.describe()` en **todos** los campos de `blog`, `services`, `projects`                    |
| 1.2 | `schemas/*.ts` — `.describe()` en cada campo (order, product, customer, booking, event, lead, upload, según existan) |
| 1.3 | `slides` documentado en `config.ts` + `docs/convenciones-assets.md`                                                  |
| 1.4 | `src/lib/slides.ts` — helper/tipo para glob de slides (reemplaza cast en SlideViewer)                                |
| 1.5 | `tsconfig.json` — `include`: `src/**/*.ts` y `schemas/**/*.ts` si aplica                                             |

**Cierre:** `astro check` OK; campos Zod con `.describe()`.

---

## Fase 2 — Guías de componentes

**Estado: completa.** Índice en [`docs/README.md`](README.md) (tabla Fase 2).

**Objetivo:** un `docs/componentes/<nombre>.md` por componente del inventario.

**Template obligatorio**

- Título, ruta del archivo, usado en
- Tabla **Props**
- **Comportamiento**
- **Decisiones de diseño**
- **Deuda técnica conocida**
- **Estado** (✅ / ⚠️ / 🔴)

| #   | Entregable                                                      |
| --- | --------------------------------------------------------------- |
| 2.1 | `docs/componentes/slide-viewer.md`                              |
| 2.2 | `docs/componentes/service-card.md`                              |
| 2.3 | `docs/componentes/blog-card.md`                                 |
| 2.4 | `docs/componentes/nav.md`                                       |
| 2.5 | `docs/componentes/contact-form.md`                              |
| 2.6 | `docs/componentes/taxonomy-filter.md`                           |
| 2.7 | `docs/componentes/layout.md` (ruta real, p. ej. `src/layouts/`) |
| 2.8 | Resto del inventario Fase 0 — un `.md` por componente           |

**Cierre:** todos listados en `docs/README.md`.

---

## Fase 3 — Subsistemas

**Estado: completa.** Índice en [`docs/README.md`](README.md) (tabla Fase 3).

| #   | Entregable                                   |
| --- | -------------------------------------------- |
| 3.1 | `docs/subsistemas/chatbot.md`                |
| 3.2 | `docs/subsistemas/sistema-diseno.md`         |
| 3.3 | `docs/subsistemas/seo-tecnico.md`            |
| 3.4 | `docs/subsistemas/convenciones-contenido.md` |
| 3.5 | `docs/subsistemas/seguridad.md`              |

**Cierre:** cada doc enlazada desde `docs/README.md`.

---

## Fase 4 — Estado, deuda, decisiones

**Estado: completa.** Índice en [`docs/README.md`](README.md) (tabla Fase 4).

| #   | Entregable                                                                            |
| --- | ------------------------------------------------------------------------------------- |
| 4.1 | `docs/matriz-estado.md`                                                               |
| 4.2 | `docs/deuda-tecnica.md`                                                               |
| 4.3 | `docs/patrones-arquitectura.md`                                                       |
| 4.4 | `docs/decisiones/adr-001-catalogo-visual.md`, `docs/decisiones/adr-002-sitio-docs.md` |

**Cierre:** backlog priorizado derivado de la documentación.

---

## Prompts sugeridos por fase

1. Fase 0 — _Inventariá el proyecto y creá `docs/README.md` + inventarios y grafo._
2. Fase 1 — _Agregá `.describe()` a todos los schemas y completá slides + `src/lib/slides.ts`._
3. Fase 2 — _Documentá cada componente con el template en `docs/componentes/`._
4. Fase 3 — _Documentá cada subsistema en `docs/subsistemas/`._
5. Fase 4 — _Consolidá estado, deuda, patrones y ADRs._
