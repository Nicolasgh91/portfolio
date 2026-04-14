# ADR-002 — Sitio de documentación dedicado (Starlight)

- **Fecha:** 2026-03-25
- **Estado:** Diferido (no adoptar por ahora)

## Contexto

La documentación actual en `docs/` ya cubre fases, componentes y subsistemas con navegación suficiente para el tamaño presente. Starlight aportaría búsqueda, navegación avanzada y experiencia de docs dedicada, pero suma estructura y mantenimiento extra.

## Decisión

Mantener documentación en Markdown dentro del repo por ahora. No montar Starlight en esta etapa.

## Consecuencias

### Positivas
- Coste de mantenimiento bajo.
- Documentación cerca del código y del flujo diario del equipo.

### Negativas
- Sin motor de búsqueda/documentación dedicado.
- Navegación limitada frente a un portal docs completo.

## Señal para reabrir ADR

Reevaluar cuando se supere un volumen aproximado de 20+ guías activas y la navegación/descubrimiento en `docs/README.md` deje de ser suficiente.
