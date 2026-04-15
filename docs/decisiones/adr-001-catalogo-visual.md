# ADR-001 — Catálogo visual de componentes (Storybook)

- **Fecha:** 2026-03-25
- **Estado:** Diferido (no adoptar por ahora)

## Contexto

El proyecto ya documenta componentes en `docs/componentes/*.md` y hoy tiene un conjunto acotado de componentes reutilizables. La adopción de Storybook agregaría setup, mantenimiento de stories y pipeline adicional.

## Decisión

No incorporar Storybook en esta etapa. Mantener documentación funcional en Markdown + páginas de validación interna (`/dev/component-scripts-audit`) y reevaluar cuando:

1. haya mayor volumen de componentes de UI compartida, o
2. exista necesidad de review visual sistemática por equipo/diseño.

## Consecuencias

### Positivas

- Menor complejidad operativa inmediata.
- Menos mantenimiento paralelo (código + stories).

### Negativas

- Sin catálogo visual aislado por componente.
- Más dependencia de páginas reales para QA de estados UI.

## Señal para reabrir ADR

Reevaluar cuando haya 25+ componentes reutilizables o múltiples variantes visuales por componente que hoy no se puedan validar eficientemente.
