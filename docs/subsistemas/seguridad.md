# Seguridad (SEC-001 a SEC-014)

Referencia viva de controles observados en código.

| Control                                 | Estado            | Evidencia                                                                                                                                                                                                                                                              |
| --------------------------------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SEC-001 system prompt server-side       | Implementado      | `api/chat.js`, `public/chatbot/widget/js/api.js`, `main.js`                                                                                                                                                                                                            |
| SEC-002 rate limiting por IP            | Implementado      | `api/chat.js` (`RATE_LIMIT`, `Retry-After`)                                                                                                                                                                                                                            |
| SEC-003 límites de payload/input        | Implementado      | `main.js` (`MAX_INPUT`), `api/chat.js` (`MAX_BODY_SIZE`, `MAX_HISTORY_LEN`)                                                                                                                                                                                            |
| SEC-004 CORS restrictivo                | Implementado      | `api/chat.js` + `lib/chat-origin-allowlist.js`: dominios en `ALLOWED_ORIGINS`; local solo con hostname exacto (`localhost`, `127.0.0.1`, `::1`); preview Vercel solo `https` y hostname igual a `VERCEL_URL`, `VERCEL_BRANCH_URL` o `{VERCEL_PROJECT_NAME}.vercel.app` |
| SEC-005 CSP                             | Implementado      | `src/layouts/Layout.astro` meta `Content-Security-Policy`                                                                                                                                                                                                              |
| SEC-006 Content-Type estricto           | Implementado      | `api/chat.js` valida `application/json`                                                                                                                                                                                                                                |
| SEC-007 errores no sensibles al usuario | Implementado      | `main.js` mensaje genérico; `api/chat.js` errores acotados                                                                                                                                                                                                             |
| SEC-008 UI bloqueada en requests        | Implementado      | `main.js` deshabilita `input` y `send` durante carga                                                                                                                                                                                                                   |
| SEC-009 validación origen iframe/parent | Parcial           | `public/chatbot/widget/index.html` allowlist; revisar uso de `window.parent.origin`                                                                                                                                                                                    |
| SEC-010 circuit breaker                 | Implementado      | `lib/circuit-breaker.js`, uso en `api/chat.js`                                                                                                                                                                                                                         |
| SEC-011 timeout de fetch                | Implementado      | `lib/fetch-with-timeout.js`, uso en Gemini call                                                                                                                                                                                                                        |
| SEC-012                                 | No evidenciado    | No se encontró referencia en el repo actual                                                                                                                                                                                                                            |
| SEC-013 Row-Level Security              | Implementado (DB) | `supabase/migrations/001_rls_policies.sql`                                                                                                                                                                                                                             |
| SEC-014 validación uploads              | Implementado      | `lib/image-upload.js`, `schemas/upload.ts`                                                                                                                                                                                                                             |

## Decisiones

- Defensa en capas en `/api/chat`: origen, content-type, rate, tamaño, budget, breaker.
- Clave Gemini confinada a servidor (`process.env`).
- SEC-004: no se usa coincidencia por substring en `Origin` ni prefijo libre sobre `*.vercel.app`; dominios de preview ajenos al despliegue no reciben CORS aunque compartan prefijo de nombre de proyecto.

## Pendientes recomendados

- Definir formalmente SEC-012 (documento o implementación faltante).
- Endurecer SEC-009 con handshake postMessage explícito y origen firmado.

## Estado

✅ Documentado
