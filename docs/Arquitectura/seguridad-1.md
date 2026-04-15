Las 14 tareas de seguridad + los 2 templates están implementados. Resumen de lo que se hizo:

**Sprint 0 — 8 tareas (4 archivos modificados):**

- **SEC-001**: `buildSystemPrompt()` movido al server. El cliente ya no envía `systemPrompt` en el body. Se carga y cachea server-side.
- **SEC-002**: Rate limiting mejorado a 10 req/min con headers `Retry-After`, `X-RateLimit-Limit` y `X-RateLimit-Remaining`.
- **SEC-003**: Límites de input (2000 chars, `maxlength` en textarea), history truncado a 20 msgs, roles sanitizados a `user`|`model`, body >50KB devuelve 413.
- **SEC-004**: CORS restrictivo — allowlist de dominios, `lib/chat-origin-allowlist.js` (local con hostname exacto; preview Vercel con `https` y hostnames del despliegue). Preflight devuelve 204 con `Max-Age: 86400`.
- **SEC-005**: Meta tag CSP en Layout.astro con directivas para scripts, estilos, fonts, imágenes, conexiones y frames.
- **SEC-006**: Validación de `Content-Type: application/json` — devuelve 415 si no es JSON.
- **SEC-007**: Errores sanitizados — no se expone `err.message` al usuario. 429 muestra mensaje específico, errores genéricos incluyen CTA de WhatsApp.
- **SEC-008**: Textarea deshabilitado durante carga con placeholder "Esperando respuesta...".

**Sprint 1 — 6 tareas (12 archivos nuevos):**

- **SEC-009**: Validación de `window.parent.origin` en los 2 scripts del `<head>` del iframe.
- **SEC-010**: `lib/circuit-breaker.js` — módulo reutilizable (CLOSED→OPEN→HALF_OPEN). Integrado en `api/chat.js` para Gemini.
- **SEC-011**: `lib/fetch-with-timeout.js` — wrapper con AbortController (10s para Gemini). Integrado en `api/chat.js`.
- **SEC-012**: 8 schemas Zod en `schemas/` (upload, product, order, lead, customer, booking, event, index).
- **SEC-013**: `supabase/migrations/001_rls_policies.sql` — RLS policies con owner_id, eventos inmutables.
- **SEC-014**: `lib/image-upload.js` — validación de magic bytes, rename UUID, upload a Supabase Storage.

**Sprint 2 (SEC-T01, SEC-T02)**: Son templates/checklists documentados en `backlog/tareas-seguridad.md`, no requieren implementación de código.

Build pasa correctamente. Código pusheado y funcional!
