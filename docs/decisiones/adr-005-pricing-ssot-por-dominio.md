# ADR-005: SSOT de pricing separado por dominio

## Estado

Activo

## Fecha

2026-04-28

## Contexto

El proyecto hoy maneja pricing en dos contextos de producto con objetivos distintos:

- `src/data/pricing.json`: pricing operativo del catálogo de servicios (`/servicios`).
- `src/data/pricing-plans.ts`: planes comerciales editoriales del catálogo de plantillas (`/plantillas`).

Forzar una única estructura para ambos contextos introduce acoplamiento entre dominios con copy, jerarquía y reglas de presentación diferentes (por ejemplo, en `/plantillas` no se muestran importes en UI y se prioriza pitch de valor por plan).

## Decisión

Mantener SSOT separado por dominio:

- `/servicios` usa `src/data/pricing.json`.
- `/plantillas` usa `src/data/pricing-plans.ts` validado con `src/schemas/pricing-plan.ts`.

No se incorpora lógica intermedia de sincronización entre ambos archivos en esta fase.

## Consecuencias

### Positivas

- Evita acoplar contratos de datos con semántica distinta.
- Permite evolucionar copy y estructura de planes de plantillas sin romper `/servicios`.
- Mantiene trazabilidad explícita de ownership por ruta.

### Negativas

- Existen dos fuentes de pricing en el repositorio.
- Requiere disciplina documental para evitar confusión de alcance.

## Alternativas consideradas

1. Unificar todo en `src/data/pricing.json`.
   - Rechazada para esta iteración por costo de migración y riesgo de romper flujos existentes en `/plantillas`.
2. Crear un adaptador intermedio para derivar `pricing-plans.ts` desde `pricing.json`.
   - Rechazada por agregar complejidad sin beneficio inmediato.

## Próximos pasos

1. Mantener esta frontera documentada en `docs/subsistemas/pricing-plans.md` y `docs/plantillas.md`.
2. Revisar en una futura iteración si conviene unificar solo metadatos compartidos (sin mezclar contratos completos).
