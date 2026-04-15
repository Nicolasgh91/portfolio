# Patrones de arquitectura objetivo

Documento target para evolución incremental del proyecto.

## 1) Barrel exports por dominio

- Objetivo: puntos de entrada estables por carpeta (`index.ts`) para reducir imports largos y fragilidad.
- Aplicación sugerida: `src/components/`, `src/lib/`, futuras utilidades de `api/`.

## 2) Adaptadores para APIs externas (BFF)

- Mantener API externa detrás de adaptadores server-side (`api/chat.js` + `lib/*`).
- Regla: UI nunca conoce proveedores ni claves; solo contratos JSON mínimos.

## 3) Contratos first (schema-driven)

- Zod en `src/content/config.ts` y `schemas/*.ts` como SSOT.
- Cualquier cambio de shape: actualizar schema + docs asociadas en el mismo PR.

## 4) Stateless + idempotencia en backend

- Reintentos de red no deben duplicar operaciones.
- Uso explícito de `idempotency_key` donde aplique (ya presente en `OrderSchema`).

## 5) Resiliencia para integraciones

- Circuit breaker + timeout como patrón estándar (`withBreaker`, `fetchWithTimeout`).
- Fallback “fail-silent” orientado a UX (mensaje utilizable, no stack trace).

## 6) Event log inmutable

- Mantener eventos append-only y controles RLS (línea actual en migración SEC-013).
- Objetivo futuro: trazabilidad por operación y actor.

## 7) Diseño tokenizado

- Variables CSS (`tokens.css`) como núcleo de tema, contraste, espaciado y tipografía.
- Componentes deben consumir tokens, evitando valores hardcodeados repetidos.

## 8) Gobernanza de documentación

- Cada módulo tocado exige doc sincronizada (`docs/componentes/*` o `docs/subsistemas/*`).
- Índice (`docs/README.md`) siempre actualizado por fase y estado.

## Backlog derivado

- Adoptar estos patrones gradualmente vía `docs/deuda-tecnica.md` y `docs/matriz-estado.md`.
