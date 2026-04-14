# Chatbot

## Alcance
- Widget en `public/chatbot/widget/` + datos en `public/chatbot/data/`.
- Backend BFF en `api/chat.js` (Vercel Edge).
- Inyección global del iframe desde `src/layouts/Layout.astro`.

## Flujo end-to-end

```mermaid
sequenceDiagram
  participant U as User
  participant W as widget/main.js
  participant A as widget/api.js
  participant B as api/chat.js
  participant G as GeminiAPI
  participant R as widget/render.js
  participant S as widget/session.js
  U->>W: envía mensaje
  W->>A: callChatAPI({history,profile})
  A->>B: POST /api/chat
  B->>B: valida CORS/rate/payload
  B->>B: construye systemPrompt server-side
  B->>G: generateContent
  G-->>B: reply
  B-->>A: {reply}
  A-->>W: reply
  W->>R: appendStreamingMessage(reply)
  W->>S: saveSession(history,profile)
```

## Módulos
- `main.js`: estado, eventos, open/close, envío, quick replies.
- `api.js`: carga `config/services/articles` y llama `/api/chat`.
- `render.js`: DOM, markdown básico, streaming, CTAs, copy.
- `session.js`: persistencia en `sessionStorage` por perfil.
- `index.html`: bootstrap de tokens/tema + wiring de módulos.

## Demo viandas
- Habilitada por query `?demo=viandas`.
- Usa `config-viandas.json`, `services-viandas.json`, `articles-viandas.json`.
- Perfil allowlist en backend (`resolveDataProfile`).

## Integración con sitio
- `Layout.astro` inserta iframe fijo y escucha `postMessage` (`open`/`close`).
- El widget sincroniza `light/dark` y tokens desde el documento padre (incluye variables del sistema de botones: `--btn-primary-bg`, `--btn-primary-bg-hover`, `--btn-disabled-opacity`, `--color-on-accent`, `--text-lg` para `#send-btn`).

## Decisiones
- API key nunca en browser (proxy Edge).
- System prompt server-side con cache por perfil.
- Fallo “fail-silent”: fallback legible ante errores de proveedor.

## Deuda técnica
- `window.parent.origin` en `index.html` no es estándar; usar validación por `document.referrer`/handshake postMessage firmado.
- `document.addEventListener('click', ...)` global en `Layout.astro` para cerrar chat puede cerrar en interacciones no deseadas.

## Estado
✅ Documentado
