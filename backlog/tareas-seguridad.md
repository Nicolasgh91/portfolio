# Tareas técnicas de seguridad — escalatunegocioconia.com

*Derivadas del análisis de seguridad. Cada tarea incluye: vulnerabilidad que resuelve, archivos afectados, implementación, criterios de aceptación y dependencias.*

*Última actualización: 2026-03-20*

---

## Sprint 0 — Parches al código en producción

**Alcance:** solo archivos que ya existen y están desplegados. No se agregan dependencias nuevas. No se toca Supabase.

**Objetivo:** cerrar las 2 vulnerabilidades críticas (V-1, V-2) y las 3 altas que son aplicables al código actual (V-3, V-4, V-5).

---

### SEC-001 — Mover construcción del system prompt al server

**Vulnerabilidad:** V-1 (crítica). El cliente envía `systemPrompt` como string al Edge Function. Un atacante puede reemplazarlo desde DevTools.

**Archivos afectados:**

| Archivo | Acción |
|---|---|
| `api/chat.js` (Edge Function en Vercel) | Modificar: cargar JSON + construir prompt server-side |
| `public/chatbot/widget/js/api.js` | Modificar: eliminar `buildSystemPrompt()` del export, dejar de enviar `systemPrompt` en el body |
| `public/chatbot/data/config.json` | Sin cambios — se lee desde el server |
| `public/chatbot/data/services.json` | Sin cambios — se lee desde el server |
| `public/chatbot/data/articles.json` | Sin cambios — se lee desde el server |

**Implementación en `api/chat.js` (Edge Function):**

```
ANTES:
  request body: { systemPrompt, history }
  → usa systemPrompt tal cual

DESPUÉS:
  request body: { history }
  → Edge Function importa/lee los 3 JSON (config, services, articles)
  → Edge Function ejecuta buildSystemPrompt() internamente
  → systemPrompt nunca sale del server

Pseudocódigo:
  export default async function handler(req) {
    const { history } = await req.json()

    // Cargar datos server-side (fetch interno o import estático)
    const config   = await loadJSON('/chatbot/data/config.json')
    const services = await loadJSON('/chatbot/data/services.json')
    const articles = await loadJSON('/chatbot/data/articles.json')

    const systemPrompt = buildSystemPrompt({ config, services, articles })

    // Llamar a Gemini con el prompt seguro
    const reply = await callGemini(systemPrompt, history)
    return Response.json({ reply })
  }
```

**Implementación en `api.js` (cliente):**

```
ANTES:
  export async function callChatAPI({ systemPrompt, history }) {
    body: JSON.stringify({ systemPrompt, history })
  }

DESPUÉS:
  export async function callChatAPI({ history }) {
    body: JSON.stringify({ history })
  }

Eliminar:
  - export de buildSystemPrompt() (ya no se usa en el cliente)
  - loadData() puede quedarse solo para mostrar greeting y CTAs
```

**Implementación en `main.js` (cliente):**

```
ANTES:
  const systemPrompt = buildSystemPrompt(appData)
  const reply = await callChatAPI({ systemPrompt, history })

DESPUÉS:
  const reply = await callChatAPI({ history })
```

**Criterios de aceptación:**

- El body del POST a `/api/chat` no contiene el campo `systemPrompt`.
- Interceptar el request en DevTools y agregar `systemPrompt` manualmente no tiene efecto: el server lo ignora.
- El chatbot sigue respondiendo con el contexto correcto (servicios, precios, contacto).
- `buildSystemPrompt()` no existe en ningún archivo del directorio `public/`.

**Dependencias:** ninguna. Es autocontenida.

**Riesgo de regresión:** medio. Verificar que la Edge Function tenga acceso a los JSON estáticos. En Vercel Edge, los archivos de `public/` son accesibles vía fetch interno a la misma URL.

---

### SEC-002 — Implementar rate limiting en `/api/chat`

**Vulnerabilidad:** V-2 (crítica). Sin límite de requests, un atacante puede agotar la cuota de Gemini con un loop.

**Archivos afectados:**

| Archivo | Acción |
|---|---|
| `api/chat.js` | Modificar: agregar lógica de rate limiting al inicio del handler |

**Implementación:**

```
Estrategia: rate limiting por IP con ventana deslizante.
Almacenamiento: Map en memoria (se reinicia con cada cold start de la Edge Function).
Límite: 10 requests por minuto por IP.

Nota sobre edge functions: cada instancia de Vercel Edge tiene memoria
aislada. El Map funciona mientras la instancia esté caliente (típicamente
5–15 minutos). Para volumen alto, migrar a Vercel KV o Upstash Redis.
Para el volumen actual del proyecto, el Map en memoria es suficiente.

Pseudocódigo:
  const rateLimitMap = new Map()
  const WINDOW_MS   = 60_000  // 1 minuto
  const MAX_REQUESTS = 10

  function checkRateLimit(ip) {
    const now = Date.now()
    const entry = rateLimitMap.get(ip) || { count: 0, windowStart: now }

    if (now - entry.windowStart > WINDOW_MS) {
      // Ventana expirada: reiniciar
      entry.count = 1
      entry.windowStart = now
    } else {
      entry.count++
    }

    rateLimitMap.set(ip, entry)

    return {
      allowed: entry.count <= MAX_REQUESTS,
      remaining: Math.max(0, MAX_REQUESTS - entry.count),
      retryAfter: Math.ceil((entry.windowStart + WINDOW_MS - now) / 1000),
    }
  }

Uso en el handler:
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
           || req.headers.get('x-real-ip')
           || 'unknown'

  const limit = checkRateLimit(ip)

  if (!limit.allowed) {
    return new Response(
      JSON.stringify({ error: 'Demasiadas solicitudes. Intentá en un momento.' }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(limit.retryAfter),
          'X-RateLimit-Limit': String(MAX_REQUESTS),
          'X-RateLimit-Remaining': '0',
        },
      }
    )
  }

  // Agregar headers de rate limit en respuestas exitosas también:
  responseHeaders['X-RateLimit-Limit'] = String(MAX_REQUESTS)
  responseHeaders['X-RateLimit-Remaining'] = String(limit.remaining)
```

**Criterios de aceptación:**

- Enviar 11 requests en menos de 60 segundos desde la misma IP devuelve status 429 en el request #11.
- El response 429 incluye `Retry-After` con los segundos restantes.
- Las respuestas exitosas incluyen `X-RateLimit-Remaining`.
- El chatbot UI muestra un mensaje amigable cuando recibe 429 (ya implementado en `main.js` catch).

**Dependencias:** ninguna.

---

### SEC-003 — Limitar longitud de input y tamaño de history

**Vulnerabilidad:** V-3 (alta). Sin límite, un atacante puede enviar payloads gigantes para maximizar consumo de tokens.

**Archivos afectados:**

| Archivo | Acción |
|---|---|
| `api/chat.js` | Modificar: validar `history` antes de procesarlo |
| `public/chatbot/widget/js/main.js` | Modificar: truncar input antes de enviar |

**Implementación server-side (`api/chat.js`):**

```
Constantes:
  const MAX_MESSAGE_LENGTH = 2_000  // caracteres por mensaje
  const MAX_HISTORY_LENGTH = 20     // mensajes en historial
  const MAX_BODY_SIZE      = 50_000 // bytes totales del body

Validación (primera línea del handler, después de rate limit):
  // 1. Verificar tamaño total del body
  const bodyText = await req.text()
  if (bodyText.length > MAX_BODY_SIZE) {
    return Response.json({ error: 'Solicitud demasiado grande.' }, { status: 413 })
  }

  const body = JSON.parse(bodyText)

  // 2. Validar que history sea un array
  if (!Array.isArray(body.history)) {
    return Response.json({ error: 'Formato inválido.' }, { status: 400 })
  }

  // 3. Truncar history a los últimos N mensajes
  const history = body.history.slice(-MAX_HISTORY_LENGTH)

  // 4. Truncar cada mensaje individual
  const sanitizedHistory = history.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{
      text: String(msg.parts?.[0]?.text || '').slice(0, MAX_MESSAGE_LENGTH)
    }],
  }))
```

**Implementación client-side (`main.js`):**

```
ANTES:
  const trimmed = text?.trim() || input.value.trim()
  if (!trimmed || isLoading) return

DESPUÉS:
  const MAX_INPUT = 2_000
  let trimmed = (text?.trim() || input.value.trim()).slice(0, MAX_INPUT)
  if (!trimmed || isLoading) return

  // Visual: si se truncó, notificar
  if ((text || input.value).trim().length > MAX_INPUT) {
    // Opcional: mostrar aviso sutil
  }

En textarea (HTML):
  <textarea id="chat-input" maxlength="2000" ...>
```

**Criterios de aceptación:**

- El textarea no permite escribir más de 2.000 caracteres (atributo `maxlength`).
- Un request con history de 50 mensajes se trunca a los últimos 20 server-side.
- Un mensaje individual de 10.000 caracteres se trunca a 2.000 server-side.
- Un body de 100 KB devuelve status 413.
- El campo `role` solo puede ser `'user'` o `'model'` — cualquier otro valor se fuerza a `'model'`.

**Dependencias:** SEC-001 (el body ya no tiene `systemPrompt`, así que la validación del body es más simple).

---

### SEC-004 — Agregar CORS restrictivo en Edge Functions

**Vulnerabilidad:** V-5 (alta). Sin CORS, cualquier dominio puede hacer requests a `/api/chat`.

**Archivos afectados:**

| Archivo | Acción |
|---|---|
| `api/chat.js` | Modificar: agregar headers CORS y manejar preflight |

**Implementación:**

```
Constantes:
  const ALLOWED_ORIGINS = [
    'https://escalatunegocioconia.com',
    'https://www.escalatunegocioconia.com',
    'https://escalatunegocioconia.com.ar',
    'https://www.escalatunegocioconia.com.ar',
  ]

  // Desarrollo local (eliminar en producción o controlar con env var):
  if (process.env.NODE_ENV === 'development') {
    ALLOWED_ORIGINS.push('http://localhost:3000', 'http://localhost:4321')
  }

Al inicio del handler:
  const origin = req.headers.get('origin')
  const isAllowed = ALLOWED_ORIGINS.includes(origin)

  // Preflight (OPTIONS)
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': isAllowed ? origin : '',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
      },
    })
  }

  // Rechazar orígenes no permitidos
  if (origin && !isAllowed) {
    return Response.json({ error: 'Origen no permitido.' }, { status: 403 })
  }

En TODAS las respuestas (éxito y error):
  headers: {
    'Access-Control-Allow-Origin': isAllowed ? origin : ALLOWED_ORIGINS[0],
    'Vary': 'Origin',
  }
```

**Criterios de aceptación:**

- Un fetch desde `https://evil.com` a `/api/chat` recibe status 403.
- Un fetch desde `https://escalatunegocioconia.com.ar` funciona normalmente.
- El preflight OPTIONS devuelve 204 con los headers correctos.
- El chatbot funciona sin cambios desde el sitio propio.

**Dependencias:** ninguna.

---

### SEC-005 — Agregar CSP headers en Layout.astro

**Vulnerabilidad:** V-4 (alta). Sin Content-Security-Policy, un XSS exitoso tiene acceso total al DOM.

**Archivos afectados:**

| Archivo | Acción |
|---|---|
| `src/layouts/Layout.astro` | Modificar: agregar meta tag CSP en `<head>` |

**Implementación:**

```
Agregar en <head>, después de los meta existentes:

  <meta http-equiv="Content-Security-Policy"
    content="
      default-src 'self';
      script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com;
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
      font-src 'self' https://fonts.gstatic.com;
      img-src 'self' data: https:;
      connect-src 'self' https://generativelanguage.googleapis.com https://va.vercel-scripts.com;
      frame-src 'self';
      object-src 'none';
      base-uri 'self';
    " />

Justificación de cada directiva:
  - script-src 'unsafe-inline': necesario para los <script is:inline> de
    tema/idioma/a11y en Layout.astro. Migrar a nonce en el futuro (SEC-013).
  - style-src 'unsafe-inline': necesario para Tailwind y el token injection
    del iframe. Migrar a nonce en el futuro.
  - connect-src: Gemini API + Vercel Analytics.
  - img-src https: : permite og-images y futuras imágenes de Supabase Storage.
  - object-src 'none': bloquea Flash, Java, etc.
  - frame-src 'self': solo iframes del mismo dominio (chatbot widget).
```

**Criterios de aceptación:**

- El header CSP aparece en el HTML de todas las páginas (verificar con DevTools → Elements → `<head>`).
- No hay errores CSP en la consola para el flujo normal (navegar landing, abrir chatbot, enviar mensaje).
- Un intento de cargar un script externo no autorizado es bloqueado (verificar en consola: "Refused to load the script...").
- Vercel Analytics sigue funcionando.
- Google Fonts sigue cargando.

**Dependencias:** ninguna. Pero verificar que Vercel Analytics use el dominio `va.vercel-scripts.com` (puede variar).

**Riesgo de regresión:** medio-alto. CSP puede romper funcionalidad existente si alguna directiva es demasiado restrictiva. Testear en staging primero.

---

### SEC-006 — Validar Content-Type en Edge Functions

**Vulnerabilidad:** complementa V-5. Rechazar requests que no sean JSON.

**Archivos afectados:**

| Archivo | Acción |
|---|---|
| `api/chat.js` | Modificar: verificar Content-Type al inicio |

**Implementación:**

```
Al inicio del handler (después de CORS, antes de rate limit):

  if (req.method === 'POST') {
    const contentType = req.headers.get('content-type') || ''
    if (!contentType.includes('application/json')) {
      return Response.json(
        { error: 'Content-Type debe ser application/json.' },
        { status: 415 }
      )
    }
  }
```

**Criterios de aceptación:**

- Un POST con `Content-Type: text/plain` devuelve 415.
- Un POST con `Content-Type: application/json` funciona normalmente.
- Un POST con `Content-Type: application/json; charset=utf-8` también funciona.

**Dependencias:** SEC-004 (CORS debe ir primero porque preflight OPTIONS no tiene Content-Type).

---

### SEC-007 — Sanitizar mensajes de error expuestos al usuario

**Vulnerabilidad:** complementa V-1 y V-3. Los errores internos no deben exponerse.

**Archivos afectados:**

| Archivo | Acción |
|---|---|
| `api/chat.js` | Modificar: catch genérico sin exponer detalles |
| `public/chatbot/widget/js/main.js` | Modificar: no mostrar `err.message` crudo |

**Implementación server-side:**

```
ANTES (supuesto):
  catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }

DESPUÉS:
  catch (err) {
    console.error('[chat] Error interno:', err)
    return Response.json(
      { error: 'Error procesando la solicitud. Intentá de nuevo.' },
      { status: 500 }
    )
  }
```

**Implementación client-side (`main.js`):**

```
ANTES (línea 98):
  appendMessage('bot', `Ups, hubo un error: ${err.message}. Intentá de nuevo.`)

DESPUÉS:
  const isRateLimit = err.message?.includes('429') || err.message?.includes('Demasiadas')
  const userMessage = isRateLimit
    ? 'Estás enviando mensajes muy rápido. Esperá un momento e intentá de nuevo.'
    : 'Nuestro asistente no está disponible en este momento. Podés contactarnos por WhatsApp.'

  appendMessage('bot', userMessage, {
    showContact: true,
    config: appData.config,
  })
```

**Criterios de aceptación:**

- Ningún mensaje de error en la UI del chatbot contiene stack traces, nombres de funciones ni mensajes internos de Gemini.
- El error 429 muestra un mensaje diferente al error genérico.
- Los errores genéricos incluyen CTA de WhatsApp como alternativa.
- Los errores internos se loguean en `console.error` server-side (visible en Vercel logs).

**Dependencias:** SEC-002 (para que el mensaje de rate limit sea relevante).

---

### SEC-008 — Inhabilitar input completo durante carga

**Vulnerabilidad:** complementa V-3. El usuario puede enviar múltiples mensajes mientras espera respuesta.

**Archivos afectados:**

| Archivo | Acción |
|---|---|
| `public/chatbot/widget/js/main.js` | Modificar: deshabilitar textarea además del botón |

**Implementación:**

```
ANTES (línea 73):
  isLoading = true
  sendBtn.disabled = true

DESPUÉS:
  isLoading = true
  sendBtn.disabled = true
  input.disabled = true
  input.placeholder = 'Esperando respuesta...'

En finally (línea 99):
ANTES:
  isLoading = false
  sendBtn.disabled = false
  input.focus()

DESPUÉS:
  isLoading = false
  sendBtn.disabled = false
  input.disabled = false
  input.placeholder = 'Escribí tu mensaje...'
  input.focus()
```

**Criterios de aceptación:**

- Mientras el chatbot procesa, el textarea está deshabilitado visualmente y no acepta input.
- El placeholder cambia a "Esperando respuesta..." durante la carga.
- Al terminar (éxito o error), el textarea se reactiva y recupera el focus.

**Dependencias:** ninguna.

---

## Sprint 1 — Hardening pre-tier 2

**Alcance:** preparar la infraestructura de seguridad antes de implementar cualquier módulo con persistencia (Supabase). Estas tareas no tocan la funcionalidad existente, solo agregan capas de protección.

---

### SEC-009 — Validar origen del iframe antes de leer tokens CSS

**Vulnerabilidad:** V-6 (media). Si el widget se embebe en un sitio malicioso, ese sitio puede inyectar tokens CSS arbitrarios.

**Archivos afectados:**

| Archivo | Acción |
|---|---|
| `public/chatbot/widget/index.html` | Modificar: agregar validación de origen en ambos scripts de `<head>` |

**Implementación:**

```
Agregar al inicio de cada bloque try del <head>:

  const ALLOWED_PARENTS = [
    'https://escalatunegocioconia.com',
    'https://www.escalatunegocioconia.com',
    'https://escalatunegocioconia.com.ar',
    'https://www.escalatunegocioconia.com.ar',
    'http://localhost:3000',
    'http://localhost:4321',
  ];

  // Validar origen antes de acceder al DOM del padre
  if (!ALLOWED_PARENTS.includes(window.parent.origin)) {
    throw new Error('Origen no permitido');
  }

  // ... resto de la lógica de tokens (sin cambios)
```

**Criterios de aceptación:**

- El chatbot funciona normalmente cuando está embebido en `escalatunegocioconia.com.ar`.
- Si alguien copia el iframe y lo embebe en otro dominio, los tokens CSS no se leen del padre y se usan los fallbacks HSL definidos en `chat.css`.
- No hay errores en consola para el flujo normal (el catch ya existe y falla silenciosamente).

**Dependencias:** ninguna.

---

### SEC-010 — Crear módulo circuit breaker reutilizable

**Vulnerabilidad:** V-10 (media) + resiliencia transversal.

**Archivos nuevos:**

| Archivo | Acción |
|---|---|
| `lib/circuit-breaker.js` | Crear: módulo reutilizable para Edge Functions |

**Implementación:**

```javascript
// lib/circuit-breaker.js

const breakers = new Map()

export function withBreaker(name, fn, fallback, opts = {}) {
  const { threshold = 3, cooldownMs = 60_000 } = opts

  if (!breakers.has(name)) {
    breakers.set(name, { state: 'CLOSED', failures: 0, lastFailure: 0 })
  }

  const b = breakers.get(name)

  // OPEN: no ejecutar, devolver fallback
  if (b.state === 'OPEN') {
    if (Date.now() - b.lastFailure > cooldownMs) {
      b.state = 'HALF_OPEN'
    } else {
      return fallback()
    }
  }

  // CLOSED o HALF_OPEN: intentar
  return fn().then(
    (result) => {
      b.failures = 0
      b.state = 'CLOSED'
      return result
    },
    (err) => {
      b.failures++
      b.lastFailure = Date.now()
      if (b.failures >= threshold) {
        b.state = 'OPEN'
      }
      return fallback()
    }
  )
}

export function getBreakerState(name) {
  return breakers.get(name) || null
}
```

**Uso en `api/chat.js`:**

```
import { withBreaker } from '../lib/circuit-breaker.js'

const reply = await withBreaker(
  'gemini',
  () => callGemini(systemPrompt, sanitizedHistory),
  () => 'Nuestro asistente no está disponible. Contactanos por WhatsApp.',
  { threshold: 3, cooldownMs: 60_000 }
)
```

**Criterios de aceptación:**

- Después de 3 fallos consecutivos de Gemini, las siguientes llamadas devuelven el fallback sin intentar contactar la API.
- Después de 60 segundos en estado OPEN, una llamada de prueba se ejecuta (HALF_OPEN).
- Si la prueba tiene éxito, se restablece el circuito (CLOSED).
- El módulo es importable desde cualquier Edge Function futura.

**Dependencias:** SEC-001 (para que se use en el handler refactorizado).

---

### SEC-011 — Crear timeout wrapper para llamadas externas

**Vulnerabilidad:** complementa V-10. Sin timeout, una llamada a Gemini puede colgar indefinidamente.

**Archivos nuevos:**

| Archivo | Acción |
|---|---|
| `lib/fetch-with-timeout.js` | Crear: wrapper de fetch con AbortController |

**Implementación:**

```javascript
// lib/fetch-with-timeout.js

export async function fetchWithTimeout(url, options = {}, timeoutMs = 10_000) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    })
    return response
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error(`Timeout: la solicitud a ${new URL(url).hostname} excedió ${timeoutMs}ms`)
    }
    throw err
  } finally {
    clearTimeout(timer)
  }
}
```

**Timeouts por servicio:**

| Servicio | Timeout | Justificación |
|---|---|---|
| Gemini API | 10.000 ms | Modelos generativos pueden tardar, pero >10s es mala UX |
| Supabase queries | 5.000 ms | Queries simples deben ser rápidas |
| Supabase Storage (upload) | 15.000 ms | Upload de imagen puede ser más lento |

**Criterios de aceptación:**

- Si Gemini no responde en 10 segundos, la llamada se cancela y se dispara el fallback del circuit breaker.
- El AbortController cancela el request real (no solo ignora la respuesta).
- El timer se limpia en todos los caminos (éxito, error, timeout).

**Dependencias:** ninguna.

---

### SEC-012 — Crear schemas Zod compartidos para tier 2+

**Vulnerabilidad:** V-7 (alta, preventiva), V-8 (alta, preventiva), V-9 (alta, preventiva).

**Archivos nuevos:**

| Archivo | Contenido |
|---|---|
| `schemas/event.ts` | Schema del event bus |
| `schemas/product.ts` | Schema de producto con atributos dinámicos |
| `schemas/order.ts` | Schema de pedido + items |
| `schemas/lead.ts` | Schema de lead capturado por chatbot |
| `schemas/customer.ts` | Schema de cliente CRM |
| `schemas/booking.ts` | Schema de turno |
| `schemas/upload.ts` | Schema de validación de imagen |
| `schemas/index.ts` | Re-export centralizado |

**Implementación de `schemas/upload.ts` (ejemplo crítico):**

```typescript
import { z } from 'zod'

// Magic bytes de formatos de imagen permitidos
export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const

export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB

export const UploadSchema = z.object({
  filename: z.string()
    .max(200)
    .regex(/^[a-zA-Z0-9._-]+$/, 'Nombre de archivo inválido'),
  mimeType: z.enum(ALLOWED_MIME_TYPES),
  size: z.number().positive().max(MAX_FILE_SIZE),
})

// Validación de magic bytes (server-side)
export const MAGIC_BYTES: Record<string, number[]> = {
  'image/jpeg': [0xFF, 0xD8, 0xFF],
  'image/png':  [0x89, 0x50, 0x4E, 0x47],
  'image/webp': [0x52, 0x49, 0x46, 0x46], // RIFF header
}

export function validateMagicBytes(buffer: ArrayBuffer, declaredMime: string): boolean {
  const expected = MAGIC_BYTES[declaredMime]
  if (!expected) return false
  const bytes = new Uint8Array(buffer).slice(0, expected.length)
  return expected.every((b, i) => bytes[i] === b)
}
```

**Implementación de `schemas/product.ts`:**

```typescript
import { z } from 'zod'

export const ProductAttributeSchema = z.object({
  key: z.string().min(1).max(64).regex(
    /^[a-zA-Z0-9_\u00C0-\u024F ]+$/,
    'Solo letras, números, espacios y guiones bajos'
  ),
  value: z.string().max(500),
  type: z.enum(['text', 'number', 'select']).default('text'),
})

export const ProductSchema = z.object({
  name: z.string().min(1).max(200).trim(),
  description: z.string().max(5000).default(''),
  category: z.string().max(100).optional(),
  price: z.number().nonnegative().max(99_999_999),
  image_url: z.string().url().nullable().default(null),
  active: z.boolean().default(true),
  attributes: z.array(ProductAttributeSchema).max(20).default([]),
})

export const ProductUpdateSchema = ProductSchema.partial().extend({
  id: z.string().uuid(),
})
```

**Implementación de `schemas/order.ts`:**

```typescript
import { z } from 'zod'

export const OrderItemSchema = z.object({
  product_id: z.string().uuid(),
  qty: z.number().int().positive().max(9_999),
  unit_price: z.number().positive().max(99_999_999),
})

export const OrderSchema = z.object({
  items: z.array(OrderItemSchema).min(1).max(100),
  total: z.number().positive().max(999_999_999),
  delivery_date: z.string().date().optional(),
  delivery_address: z.string().max(500).optional(),
  customer_id: z.string().uuid().optional(),
  source: z.enum(['web', 'chatbot', 'whatsapp']).default('web'),
  idempotency_key: z.string().uuid(),
})
```

**Criterios de aceptación:**

- Cada schema se puede importar desde `schemas/index.ts`.
- Los schemas rechazan payloads que excedan los límites (max length, max items, tipos incorrectos).
- `ProductSchema` acepta atributos dinámicos con key alfanumérico y value de hasta 500 caracteres.
- `UploadSchema` rechaza MIME types que no sean imagen.
- `validateMagicBytes()` detecta un archivo `.exe` renombrado a `.jpg`.
- `OrderSchema` requiere `idempotency_key` para prevenir pedidos duplicados.
- Todos los schemas usan `.trim()` en strings de texto libre.

**Dependencias:** ninguna.

---

### SEC-013 — Definir políticas RLS para Supabase

**Vulnerabilidad:** V-7 (alta) y V-8 (alta). Sin RLS, un cliente puede leer datos de otro.

**Archivos nuevos:**

| Archivo | Contenido |
|---|---|
| `supabase/migrations/001_rls_policies.sql` | Políticas de Row-Level Security |

**Implementación:**

```sql
-- Habilitar RLS en todas las tablas
ALTER TABLE products    ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders      ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers   ENABLE ROW LEVEL SECURITY;
ALTER TABLE events      ENABLE ROW LEVEL SECURITY;

-- Columna owner_id en cada tabla (referencia al usuario de Supabase Auth)
ALTER TABLE products    ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id);
ALTER TABLE orders      ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id);
ALTER TABLE customers   ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id);
ALTER TABLE events      ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id);

-- Política: cada usuario solo ve sus propios datos
CREATE POLICY "Users see own products"  ON products    FOR ALL USING (auth.uid() = owner_id);
CREATE POLICY "Users see own orders"    ON orders      FOR ALL USING (auth.uid() = owner_id);
CREATE POLICY "Users see own customers" ON customers   FOR ALL USING (auth.uid() = owner_id);
CREATE POLICY "Users see own events"    ON events      FOR ALL USING (auth.uid() = owner_id);

-- order_items hereda acceso del order padre
CREATE POLICY "Users see own order items" ON order_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM orders WHERE orders.id = order_items.order_id
      AND orders.owner_id = auth.uid()
    )
  );

-- Eventos: solo INSERT (inmutabilidad)
CREATE POLICY "Events are immutable" ON events
  FOR UPDATE USING (false);
CREATE POLICY "Events cannot be deleted" ON events
  FOR DELETE USING (false);

-- Bucket de imágenes: lectura pública, escritura autenticada
-- (se configura en Supabase Dashboard → Storage → Policies)
-- product-images:
--   SELECT: public (true)
--   INSERT: auth.uid() IS NOT NULL
--   UPDATE: auth.uid() = owner_id (metadata del objeto)
--   DELETE: auth.uid() = owner_id
```

**Criterios de aceptación:**

- Un usuario autenticado como cliente A no puede leer productos del cliente B.
- Un INSERT en `events` funciona, pero un UPDATE o DELETE falla con error de política.
- Las imágenes del bucket `product-images` son accesibles sin autenticación (lectura pública).
- Solo un usuario autenticado puede subir imágenes.
- Las migraciones son idempotentes (`IF NOT EXISTS`).

**Dependencias:** se ejecuta al crear la instancia de Supabase, antes de cualquier módulo tier 2.

---

### SEC-014 — Definir política de upload de imágenes

**Vulnerabilidad:** V-9 (alta). Archivos maliciosos disfrazados de imágenes.

**Archivos nuevos:**

| Archivo | Contenido |
|---|---|
| `lib/image-upload.js` | Módulo de validación, compresión y upload |

**Implementación:**

```
Flujo completo:

  1. Recibir archivo del request (FormData)
  2. Validar tamaño (≤5 MB)
  3. Leer los primeros 8 bytes → validar magic bytes
  4. Validar MIME type contra magic bytes (no confiar en Content-Type)
  5. Generar nombre UUID v4 + extensión
  6. Comprimir a WebP ≤100 KB, 200×200 (usar sharp o canvas en Edge)
  7. Subir a Supabase Storage bucket 'product-images'
  8. Retornar URL pública

Pseudocódigo:
  import { validateMagicBytes, ALLOWED_MIME_TYPES, MAX_FILE_SIZE } from '../schemas/upload.ts'

  export async function processImageUpload(file, ownerId) {
    // 1. Tamaño
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('Archivo demasiado grande. Máximo 5 MB.')
    }

    // 2. Magic bytes
    const buffer = await file.arrayBuffer()
    const declaredMime = file.type
    if (!ALLOWED_MIME_TYPES.includes(declaredMime)) {
      throw new Error('Tipo de archivo no permitido.')
    }
    if (!validateMagicBytes(buffer, declaredMime)) {
      throw new Error('El contenido del archivo no coincide con su tipo declarado.')
    }

    // 3. Renombrar
    const ext = declaredMime === 'image/png' ? 'png' : 'webp'
    const filename = `${crypto.randomUUID()}.${ext}`

    // 4. Comprimir (si se dispone de sharp o canvas en el runtime)
    //    En Vercel Edge no hay sharp nativo. Opciones:
    //    a) Subir sin comprimir y delegar a Supabase Image Transformation
    //    b) Usar un Serverless Function (no Edge) con sharp
    //    c) Comprimir client-side con canvas antes de enviar
    //    Decisión recomendada: opción (c) client-side + validación server-side

    // 5. Upload a Supabase Storage
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(`${ownerId}/${filename}`, buffer, {
        contentType: 'image/webp',
        upsert: false,
      })

    if (error) throw error

    // 6. URL pública
    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(`${ownerId}/${filename}`)

    return publicUrl
  }
```

**Criterios de aceptación:**

- Un archivo `.exe` renombrado a `.jpg` es rechazado (magic bytes no coinciden).
- Un archivo de 10 MB es rechazado antes de procesarse.
- Un `.svg` es rechazado (no está en ALLOWED_MIME_TYPES).
- El nombre del archivo en storage es un UUID, no el nombre original del usuario.
- Cada cliente tiene su propio subdirectorio en el bucket (`{owner_id}/`).
- La URL pública del thumbnail es accesible sin autenticación.

**Dependencias:** SEC-012 (schemas), SEC-013 (políticas RLS del bucket).

---

## Sprint 2 — Aplicación por módulo (template)

**Estas tareas se ejecutan cada vez que se implementa un nuevo módulo tier 2+.** No son tareas únicas sino un checklist recurrente.

---

### SEC-T01 — Template: validación Zod en Edge Function

**Aplica a:** cada nueva Edge Function (`api/products.js`, `api/orders.js`, `api/stock.js`, `api/customers.js`, `api/bookings.js`, `api/events.js`).

**Implementación por endpoint:**

```
export default async function handler(req) {
  // 1. CORS (copiar patrón de SEC-004)
  // 2. Content-Type (copiar patrón de SEC-006)
  // 3. Rate limit (copiar patrón de SEC-002, ajustar límites por endpoint)
  // 4. Autenticación (verificar JWT de Supabase)

  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  const { data: { user }, error } = await supabase.auth.getUser(token)
  if (error || !user) {
    return Response.json({ error: 'No autenticado.' }, { status: 401 })
  }

  // 5. Parsear body con schema Zod
  const body = await req.json()
  const parsed = ProductSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json(
      { error: 'Datos inválidos.', details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  // 6. Ejecutar lógica con withBreaker()
  // 7. Emitir evento al event bus
  // 8. Retornar respuesta con headers de seguridad
}
```

**Checklist por endpoint:**

- [ ] CORS restrictivo
- [ ] Content-Type validation
- [ ] Rate limiting (ajustado al endpoint)
- [ ] Autenticación via Supabase Auth
- [ ] Body parseado con schema Zod antes de tocar la DB
- [ ] Queries via SDK de Supabase (nunca SQL raw)
- [ ] Circuit breaker en llamadas a Supabase
- [ ] Timeout de 5s en queries
- [ ] Respuestas de error genéricas (sin exponer internals)
- [ ] Evento emitido al event bus en operaciones de escritura
- [ ] Test manual de inyección SQL en cada parámetro
- [ ] Test manual de IDOR (acceder a recurso de otro usuario)

---

### SEC-T02 — Template: fallback visual en UI

**Aplica a:** cada componente de UI que consume datos de una API.

**Implementación:**

```
Patrón para componentes vanilla JS:

  async function loadProducts() {
    const container = document.getElementById('product-list')

    try {
      container.innerHTML = '<div class="skeleton">Cargando...</div>'
      const products = await fetchWithTimeout('/api/products', {}, 5000)
      renderProducts(products)
    } catch (err) {
      container.innerHTML = `
        <div class="error-state">
          <p>No se pudieron cargar los productos.</p>
          <button onclick="loadProducts()">Reintentar</button>
        </div>
      `
    }
  }

Patrón para datos en cache:

  async function loadWithCache(key, fetchFn) {
    try {
      const fresh = await fetchFn()
      sessionStorage.setItem(key, JSON.stringify({
        data: fresh,
        timestamp: Date.now(),
      }))
      return fresh
    } catch {
      const cached = sessionStorage.getItem(key)
      if (cached) {
        const { data, timestamp } = JSON.parse(cached)
        // Mostrar badge: "Datos de hace X minutos"
        showStaleDataBadge(timestamp)
        return data
      }
      throw new Error('Sin datos disponibles')
    }
  }
```

**Checklist por componente:**

- [ ] Estado de carga visible (skeleton o spinner)
- [ ] Estado de error con botón de reintentar
- [ ] Cache en sessionStorage para lectura cuando la API falla
- [ ] Badge visual indicando datos stale ("actualizado hace X min")
- [ ] No se muestran errores técnicos al usuario

---

## Resumen de entregables

| Sprint | Tareas | Archivos nuevos | Archivos modificados |
|---|---|---|---|
| Sprint 0 | SEC-001 a SEC-008 | 0 | 4 (`api/chat.js`, `api.js`, `main.js`, `Layout.astro`) |
| Sprint 1 | SEC-009 a SEC-014 | 10+ (`lib/`, `schemas/`, `supabase/migrations/`) | 1 (`index.html`) |
| Sprint 2 | SEC-T01, SEC-T02 (templates) | 0 (son patrones, no archivos) | Cada endpoint nuevo |

**Orden de ejecución del sprint 0:**

```
SEC-001 (system prompt server-side)
    ↓
SEC-004 (CORS) + SEC-006 (Content-Type) — pueden ir en paralelo
    ↓
SEC-002 (rate limiting) — depende del handler refactorizado
    ↓
SEC-003 (límites de input) — depende de SEC-001
    ↓
SEC-007 (sanitizar errores) — depende de SEC-002
    ↓
SEC-008 (inhabilitar input) — independiente
    ↓
SEC-005 (CSP headers) — última, porque requiere testing cuidadoso
```
