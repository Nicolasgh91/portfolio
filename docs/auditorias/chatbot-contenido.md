# Auditoría de contenido del chatbot

Fecha: 2026-04-27

Estado: auditoría inicial completa. No corrige código ni datos productivos; deja hallazgos y recomendaciones para el sprint posterior.

## Resumen ejecutivo

El chatbot productivo responde y mantiene continuidad en producción: se probaron cinco preguntas representativas y una conversación de dos turnos contra `https://escalatunegocioconia.com/api/chat`, todas con `HTTP 200`.

El síntoma “el flujo finaliza después de una pregunta” no se reprodujo en producción desde la API, pero sí hay causas probables para verlo en desarrollo o en configuraciones parciales:

- `astro dev` sirve el widget y los JSON, pero no sirve correctamente `POST /api/chat`; devuelve la página 404 del sitio.
- Si `GEMINI_API_KEY` no existe, `api/chat.js` devuelve `500` y el cliente muestra un fallback genérico.
- Si Gemini devuelve texto vacío, el backend responde `200` con `reply: ""`; el cliente lo transforma en `Sin respuesta.`, sin CTA contextual.

El problema más crítico no es de disponibilidad sino de contenido: el bot usa `public/chatbot/data/services.json` y `public/chatbot/data/articles.json` desactualizados. Eso hace que responda con precios, servicios y artículos que no coinciden con `src/data/pricing.json`, los MDX actuales ni los posts reales.

## Trazabilidad de ejecución

- Entorno verificado: `hostname = entorno-principal`.
- Ruta de trabajo usada durante la auditoría: `/home/nicogabh/projects/portfolio`.
- Rama observada durante la ejecución: `feat/article-references`.
- Alcance de validación runtime: pruebas reales contra producción (`/api/chat`) y pruebas locales del handler con mock del proveedor.

## 1. Schema / conocimiento

### Fuentes reales del bot

El conocimiento productivo que llega al modelo se construye desde:

| Fuente                              | Rol actual                                            | Estado                                              |
| ----------------------------------- | ----------------------------------------------------- | --------------------------------------------------- |
| `public/chatbot/data/config.json`   | Identidad, contacto, saludo, persona y marca          | Vigente con correcciones menores de copy            |
| `public/chatbot/data/services.json` | Servicios, precios, entregables, stack y plazos       | Desactualizado frente al catálogo actual            |
| `public/chatbot/data/articles.json` | Índice de artículos sugeridos por el bot              | Desactualizado; todas las URLs relevadas no existen |
| `api/chat.js`                       | Construye `systemPrompt` server-side y llama a Gemini | Funcional, con gaps de observabilidad y texto vacío |
| `src/data/pricing.json`             | SSOT de precios comerciales                           | No está sincronizado con el chatbot                 |
| `src/content/services/*.mdx`        | Oferta comercial publicada                            | No está sincronizada con el chatbot                 |
| `src/content/faq/entries.json`      | FAQ visible del sitio y JSON-LD                       | No alimenta el chatbot                              |

### Drift de servicios y precios

`src/data/pricing.json` define:

| Servicio              | Precio SSOT          |
| --------------------- | -------------------- |
| `chatbots-ia`         | ARS 20.000           |
| `landing-page`        | ARS 20.000           |
| `ecommerce-platforms` | ARS 50.000           |
| `local-llms`          | Sin precio publicado |
| `workflow-automation` | Sin precio publicado |

`public/chatbot/data/services.json` define otros IDs y precios:

| Servicio del chatbot | Precio del chatbot  | Problema                                                                |
| -------------------- | ------------------- | ----------------------------------------------------------------------- |
| `web-dev`            | ARS 40.000          | No coincide con `landing-page` ni con `pricing.json`                    |
| `saas-apps`          | ARS 99.000          | No existe como servicio actual con ese slug                             |
| `chatbots-ai`        | ARS 20.000          | Precio correcto, pero ID no coincide con `chatbots-ia`                  |
| `automatizaciones`   | ARS 150.000         | No coincide con `workflow-automation`; `pricing.json` no publica precio |
| `consultoria`        | ARS 20.000 / sesión | No aparece como servicio MDX actual                                     |

Impacto: en producción el bot responde que una landing cuesta desde ARS 40.000, aunque `pricing.json` y `src/content/services/landing-page.mdx` publican ARS 20.000.

### Drift de artículos

`public/chatbot/data/articles.json` contiene:

| URL                                 | Existe en `src/content/blog` |
| ----------------------------------- | ---------------------------- |
| `/blog/chatbot-costo-cero`          | No                           |
| `/blog/nextjs-vs-astro`             | No                           |
| `/blog/automatizar-reportes-python` | No                           |

Posts reales detectados:

- `/blog/ia-local-vs-cloud`
- `/blog/diseniar-microservicios`
- `/blog/caso-huelladelfuego`
- `/blog/arquitectura-sistemas-gran-escala`
- `/blog/analista-funcional-era-ia`

Impacto: el bot recomienda artículos que llevan a 404, afectando confianza, SEO interno y experiencia del usuario.

### Paridad demo viandas

La demo `viandas` usa la misma forma general que producción: `owner`, `talento`, `chatbot`, `branding`, `services[]` y `articles[]`. Agrega `chatbot.quick_replies` y `demo.profile`.

No se detecta necesidad de auditar contenido de viandas en esta fase. Solo debe conservarse como fixture comercial y de paridad de schema.

## 2. Flow logic

Flujo esperado:

1. El usuario escribe en el iframe.
2. `main.js` agrega el mensaje a `history`, deshabilita input y llama `callChatAPI`.
3. `api.js` hace `POST /api/chat` con `{ history }` y opcionalmente `{ profile: "viandas" }`.
4. `api/chat.js` valida origen, content-type, rate limit, body y presupuesto.
5. `api/chat.js` carga JSON públicos, arma `systemPrompt`, llama Gemini y devuelve `{ reply }`.
6. `main.js` renderiza con `appendStreamingMessage`, guarda sesión y rehabilita input.

Validaciones ejecutadas:

- Local con handler importado y Gemini simulado: cinco preguntas consecutivas devolvieron `200`.
- Producción: cinco preguntas representativas devolvieron `200`.
- Producción: conversación de dos turnos con historial devolvió `200` en ambos turnos.
- Local con `astro dev`: `POST /api/chat` devuelve 404 HTML.

### Diagnóstico del corte de flujo

El corte no se reproduce como fallo de backend productivo. La causa probable depende del entorno:

- En desarrollo con `astro dev`: el endpoint `/api/chat` no existe como función Vercel.
- En entornos sin `GEMINI_API_KEY`: el backend devuelve 500.
- En respuestas vacías del proveedor: el backend devuelve `reply: ""`; el cliente lo convierte en `Sin respuesta.` sin CTA contextual.

Recomendación funcional para sprint posterior: normalizar respuesta vacía de Gemini en servidor y documentar que el flujo completo se prueba con `vercel dev` o preview, no con `astro dev`.

## 3. API / prompt

`buildSystemPrompt` arma secciones claras: perfil, menú/servicios, artículos, contacto e instrucciones. Construir el prompt server-side es correcto: evita exponer API keys y reduce manipulación del cliente.

Gaps detectados:

- El prompt no recibe FAQ estructuradas, objeciones comerciales ni casos de uso.
- No hay campo de fuente o vigencia por entrada.
- `articlesBlock` asume que los artículos existen y no valida rutas.
- El fallback del circuit breaker no deja trazabilidad editorial.
- La respuesta vacía de Gemini no se normaliza en servidor.

Instrucciones actuales:

- Responder en el idioma del usuario.
- Ser concreto.
- Dar precio base y aclarar que depende del proyecto.
- Derivar a WhatsApp o email ante interés de contratación.
- No inventar información fuera del contexto.
- Máximo 3-4 párrafos.

## 4. UI / formato

Fortalezas:

- Bienvenida inicial con quick replies.
- Markdown básico en `render.js` (bold, italic, code, saltos de línea).
- Streaming simulado.
- Persistencia de sesión por perfil.

Riesgos:

- El renderer no convierte bullets en `<ul><li>`.
- Los CTAs dependen del texto del usuario (regex), no de intención inferida de la respuesta.
- `Sin respuesta.` no guía al usuario hacia un siguiente paso.
- `public/chatbot/README.md` mantiene instrucciones legacy incompatibles con la arquitectura actual.

## 5. Muestreo de respuestas reales

Muestreo contra producción (2026-04-27):

| Pregunta                   | Estado | Observación                                                              |
| -------------------------- | ------ | ------------------------------------------------------------------------ |
| Qué servicios ofrecés      | 200    | Responde con servicios legacy y menciona Desarrollo Web desde ARS 40.000 |
| Cuánto cuesta un chatbot   | 200    | Responde ARS 20.000, consistente con `pricing.json`                      |
| Cuánto tarda una landing   | 200    | Responde 1 a 2 semanas, pero costo ARS 40.000, inconsistente             |
| Qué necesitás para empezar | 200    | Respuesta útil pero genérica; no pide un set concreto de insumos         |
| Ver artículos del blog     | 200    | Recomienda artículos inexistentes en el repo actual                      |

Prueba de continuidad:

| Turno | Pregunta                    | Estado | Resultado                                       |
| ----- | --------------------------- | ------ | ----------------------------------------------- |
| 1     | Qué servicios ofrecés       | 200    | Responde lista de servicios                     |
| 2     | Y cuánto cuesta el chatbot? | 200    | Mantiene contexto y responde precio del chatbot |

Conclusión: el flujo productivo continúa. El problema inmediato es la vigencia de conocimiento.

## 6. Contenido accionable

### Banco inicial de FAQ recomendado

| Eje            | Pregunta                              | Respuesta base recomendada                                                                                                                                               |
| -------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| servicio       | ¿Qué incluye un chatbot con IA?       | Incluye configuración del asistente, tono de marca, carga de contenido del negocio, integración web, derivación a WhatsApp/email y soporte inicial.                      |
| servicio       | ¿Cuánto cuesta un chatbot?            | Desde ARS 20.000, según `pricing.json`. El valor final depende de cantidad de contenido, integraciones y flujo comercial.                                                |
| servicio       | ¿Cuánto tarda implementar un chatbot? | Entre 3 y 10 días para un alcance inicial, si el cliente entrega contenido y accesos a tiempo.                                                                           |
| servicio       | ¿Qué incluye una landing page?        | Sitio one-page responsive, copy base, formulario, WhatsApp, SEO local y deploy en Vercel.                                                                                |
| servicio       | ¿Cuánto cuesta una landing?           | Desde ARS 20.000 según `pricing.json` y `landing-page.mdx`.                                                                                                              |
| servicio       | ¿Hacen ecommerce o sistemas a medida? | Sí. Se construyen plataformas de ecommerce y sistemas de gestión propietarios para centralizar operaciones. Precio de referencia: ARS 50.000 para `ecommerce-platforms`. |
| servicio       | ¿Trabajan con automatizaciones?       | Sí. Se relevan procesos repetitivos, se identifican cuellos de botella y se proponen integraciones, pipelines o agentes cuando aportan valor.                            |
| servicio       | ¿Implementan IA local o privada?      | Sí. Para empresas con requisitos de privacidad, se pueden desplegar LLMs en infraestructura propia para no enviar datos a terceros.                                      |
| objeción       | ¿Qué pasa si el bot responde mal?     | El alcance debe incluir revisión del contenido, pruebas con preguntas frecuentes y ajuste de instrucciones. Para casos críticos, derivar a humano.                       |
| objeción       | ¿El precio incluye soporte?           | El servicio de chatbot publicado menciona soporte post-lanzamiento de 30 días. Luego se puede acordar mantenimiento.                                                     |
| objeción       | ¿Necesito tener una web ya hecha?     | No necesariamente. Puede integrarse en una web existente o sumarse a una landing nueva.                                                                                  |
| objeción       | ¿El bot reemplaza WhatsApp?           | No. Atiende preguntas frecuentes y califica consultas, pero deriva a WhatsApp cuando hay intención de compra.                                                            |
| descubrimiento | ¿Para quién conviene un chatbot?      | Negocios que reciben consultas repetidas, pierden clientes fuera de horario o quieren capturar leads sin sumar personal.                                                 |
| descubrimiento | ¿Qué contenido necesito entregar?     | Servicios, precios, horarios, preguntas frecuentes, tono de marca, datos de contacto y reglas sobre qué no debe responder.                                               |
| contratación   | ¿Cómo empezamos?                      | Primero se hace una conversación breve para definir objetivo, fuentes de contenido, flujo de derivación y canal de contacto.                                             |
| contratación   | ¿Cómo te contacto?                    | WhatsApp o email publicados en `config.json`: `+54 9 11 3061-1776` y `comercial@escalatunegocioconia.com`.                                                               |

### Gaps priorizados

P0:

- Alinear `services.json` con slugs y precios de `src/data/pricing.json`.
- Reemplazar artículos inexistentes en `articles.json` por posts reales.
- Corregir `chatbots-ai` a `chatbots-ia` o documentar alias.

P1:

- FAQ de objeciones comerciales.
- Insumos necesarios para iniciar cada servicio.
- Alcance y exclusiones por servicio.
- Regla de derivación humana cuando el bot no sabe.

P2:

- Quick replies productivas desde `config.json`.
- CTAs por intención, no solo por regex.
- Respuestas modelo para escenarios de contratación frecuentes.

P3:

- Fecha de última revisión por fuente.
- Campo `source` por respuesta.
- Checklist/validación de URLs de `articles.json`.

## 7. Recomendación de schema

No conviene seguir ampliando `services.json` como contenedor de todo. Para nutrir el bot sin mezclar capas, conviene introducir una fuente estructurada de FAQ conversacional.

Decisión para el próximo sprint: usar `public/chatbot/data/faq.json` como SSOT del chatbot.

Ejemplo:

```json
{
  "id": "chatbot-precio",
  "axis": "servicio",
  "service_id": "chatbots-ia",
  "question": "¿Cuánto cuesta un chatbot?",
  "answer": "Desde ARS 20.000. El valor final depende de contenido, integraciones y flujo comercial.",
  "cta": "whatsapp",
  "priority": 1,
  "source": "src/data/pricing.json",
  "last_reviewed": "2026-04-27"
}
```

Consecuencias:

- Mantener `pricing.json` como SSOT de precios.
- Mantener MDX como SSOT editorial para servicios y artículos.
- No acoplar en esta fase con `src/content/faq/entries.json`.
- Evaluar sincronización futura en ADR separado.

## 8. Documentación asociada

Desfasajes encontrados:

- `public/chatbot/README.md` contiene setup legacy (API key en browser).
- El README adjudica construcción de prompt a `api.js`, pero hoy está en `api/chat.js`.
- `docs/subsistemas/chatbot.md` no refleja explícitamente el drift de contenido detectado.
- `docs/subsistemas/convenciones-contenido.md` no tiene validación automática de rutas para `articles.json`.

## 9. Acciones recomendadas

1. Normalizar respuesta vacía de Gemini en `api/chat.js`.
2. Actualizar `public/chatbot/data/services.json` desde `pricing.json` y `src/content/services/*.mdx`.
3. Reemplazar `public/chatbot/data/articles.json` con artículos reales.
4. Diseñar e implementar `public/chatbot/data/faq.json`.
5. Reescribir `public/chatbot/README.md` sin instrucciones legacy.
6. Agregar validación automática de rutas de `articles.json` contra `src/content/blog`.

## Estado

Documentado. La auditoría deja evidencia suficiente para ejecutar un sprint de corrección de contenido y luego otro de mejoras funcionales y de schema.

# Auditoría de contenido del chatbot

Fecha: 2026-04-27

Estado: auditoría inicial completa. No corrige codigo ni datos productivos; deja hallazgos y recomendaciónes para el sprint posterior.

## Resumen ejecutivo

El chatbot productivo responde y mantiene continuidad en producción: se probaron cinco preguntas representativas y una conversación de dos turnos contra `https://escalatunegocioconia.com/api/chat`, todas con `HTTP 200`. El síntoma "el flujo finaliza despues de una pregunta" no se reprodujo en producción desde la API, pero si hay causas probables para verlo en desarrollo o en configuraciones parciales:

- `astro dev` sirve el widget y los JSON, pero no sirve correctamente `POST /api/chat`; devuelve la página 404 del sitio. Para probar el flujo real hace falta `vercel dev` o invocar el handler con mock.
- Si `GEMINI_API_KEY` no existe, `api/chat.js` devuelve `500` y el cliente muestra un fallback de contacto.
- Si Gemini devuelve texto vacío, el backend responde `200` con `reply: ""`; el cliente lo transforma en `Sin respuestá.`, lo que evita un crash pero degrada la conversación.

El problema más crítico no es de disponibilidad sino de contenido: el bot usa `public/chatbot/data/services.json` y `articles.json` desactualizados. Eso hace que responda con precios, servicios y artículos que no coinciden con `src/data/pricing.json`, los MDX actuales ni los posts reales.

## 1. Schema / conocimiento

### Fuentes reales del bot

El conocimiento productivo que llega al modelo se construye desde:

| Fuente                              | Rol actual                                            | Estado                                              |
| ----------------------------------- | ----------------------------------------------------- | --------------------------------------------------- |
| `public/chatbot/data/config.json`   | Identidad, contacto, saludo, persona y marca          | Vigente con correcciónes menores de copy            |
| `public/chatbot/data/services.json` | Servicios, precios, entregables, stack y plazos       | Desactualizado frente al catálogo actual            |
| `public/chatbot/data/articles.json` | Índice de artículos sugeridos por el bot              | Desactualizado; todas las URLs relevadas no existen |
| `api/chat.js`                       | Construye `systemPrompt` server-side y llama a Gemini | Funcional, con gaps de observabilidad y texto vacío |
| `src/data/pricing.json`             | SSOT de precios comerciales                           | No está sincronizado con el chatbot                 |
| `src/content/services/*.mdx`        | Oferta comercial publicada                            | No está sincronizada con el chatbot                 |
| `src/content/faq/entries.json`      | FAQ visible del sitio y JSON-LD                       | No alimenta el chatbot                              |

### Drift de servicios y precios

`src/data/pricing.json` define:

| Servicio              | Precio SSOT          |
| --------------------- | -------------------- |
| `chatbots-ia`         | ARS 20.000           |
| `landing-page`        | ARS 20.000           |
| `ecommerce-platforms` | ARS 50.000           |
| `local-llms`          | Sin precio publicado |
| `workflow-automation` | Sin precio publicado |

`public/chatbot/data/services.json` define otros IDs y precios:

| Servicio del chatbot | Precio del chatbot  | Problema                                                                |
| -------------------- | ------------------- | ----------------------------------------------------------------------- |
| `web-dev`            | ARS 40.000          | No coincide con `landing-page` ni con `pricing.json`                    |
| `saas-apps`          | ARS 99.000          | No existe como servicio actual con ese slug                             |
| `chatbots-ai`        | ARS 20.000          | Precio correcto, pero ID no coincide con `chatbots-ia`                  |
| `automatizaciones`   | ARS 150.000         | No coincide con `workflow-automation`; `pricing.json` no publica precio |
| `consultoria`        | ARS 20.000 / sesión | No aparece como servicio MDX actual                                     |

Impacto: en producción el bot responde que una landing cuestá desde ARS 40.000, aunque `pricing.json` y `src/content/services/landing-page.mdx` publican ARS 20.000.

### Drift de artículos

`public/chatbot/data/articles.json` contiene:

| URL                                 | Existe en `src/content/blog` |
| ----------------------------------- | ---------------------------- |
| `/blog/chatbot-costo-cero`          | No                           |
| `/blog/nextjs-vs-astro`             | No                           |
| `/blog/automatizar-reportes-python` | No                           |

Posts reales detectados:

- `/blog/ia-local-vs-cloud`
- `/blog/diseniar-microservicios`
- `/blog/caso-huelladelfuego`
- `/blog/arquitectura-sistemás-gran-escala`
- `/blog/analista-funcional-era-ia`

Impacto: el bot recomienda artículos que llevan a 404, afectando confianza, SEO interno y experiencia del usuario.

### Paridad demo viandas

La demo `viandas` usa la misma forma general que producción: `owner`, `talento`, `chatbot`, `branding`, `services[]` y `articles[]`. Agrega `chatbot.quick_replies` y `demo.profile`.

No se detecta necesidad de auditar contenido de viandas en está fase. Solo debe conservarse como fixture comercial y de paridad de schema.

## 2. Flow logic

Flujo esperado:

1. El usuario escribe en el iframe.
2. `main.js` agrega el mensaje a `history`, deshabilita input y llama `callChatAPI`.
3. `api.js` hace `POST /api/chat` con `{ history }` y opcionalmente `{ profile: "viandas" }`.
4. `api/chat.js` valida origen, content-type, rate limit, body y presupuesto.
5. `api/chat.js` carga JSON públicos, arma `systemPrompt`, llama Gemini y devuelve `{ reply }`.
6. `main.js` renderiza con `appendStreamingMessage`, guarda sesión y rehabilita input.

Validaciones ejecutadas:

- Local con handler importado y Gemini simulado: cinco preguntas consecutivas devolvieron `200`.
- Produccion: cinco preguntas representativas devolvieron `200`.
- Produccion: conversación de dos turnos con historial devolvio `200` en ambos turnos.
- Local con `astro dev`: `POST /api/chat` devuelve 404 HTML. Esto explica fallas locales si se prueba sin Vercel Functions.

### Diagnostico del corte de flujo

El corte no se reproduce como fallo de backend productivo. La causa probable depende del entorno:

- En desarrollo con `astro dev`: el endpoint `/api/chat` no existe como funcion Vercel. El cliente cae al fallback y parece que la conversación no avanza.
- En entornos sin `GEMINI_API_KEY`: el backend devuelve 500. `main.js` rehabilita input, pero el usuario ve un fallback genérico.
- En respuestás vacias del proveedor: el backend devuelve `reply: ""`. El cliente lo convierte en `Sin respuestá.`, pero no hay explicación ni CTA contextual.

Recomendacion funcional para sprint posterior: agregar una respuestá fallback server-side cuando Gemini devuelva texto vacío, y documentar que el flujo completo se prueba con `vercel dev` o deploy preview, no con `astro dev`.

## 3. API / prompt

`buildSystemPrompt` arma secciónes claras: perfil, menu/servicios, artículos, contacto e instrucciones. La decision de construir el prompt server-side es correcta: evita exponer API keys y reduce manipulación del cliente.

Gaps detectados:

- El prompt no recibe FAQ estructuradas, objeciones comerciales ni casos de uso. Solo recibe servicios y artículos.
- No hay campo de fuente o vigencia por entrada. El bot no puede distinguir contenido validado de contenido legacy.
- `articlesBlock` asume que los artículos existen y no valida rutas.
- El fallback del circuit breaker devuelve un texto útil, pero no queda trazabilidad visible para auditoría de contenido.
- La respuestá vacia de Gemini no se normaliza en servidor.

Instrucciones actuales:

- Responder en el idioma del usuario.
- Ser concreto.
- Dar precio base y aclarar que depende del proyecto.
- Derivar a WhatsApp o email ante interes de contratación.
- No inventar información fuera del contexto.
- Maximo 3-4 parrafos.

Estas instrucciones son adecuadas, pero la calidad queda limitada por los datos desactualizados que alimentan el prompt.

## 4. UI / formato

El formato del widget es simple y funcional:

- Bienvenida inicial con quick replies por defecto.
- Markdown basico en `render.js`: bold, italic, code y saltos de línea.
- Streaming simulado char a char.
- CTAs de WhatsApp/email cuando el input del usuario coincide con keywords comerciales.
- Sesion persistida por perfil en `sessionStorage`.

Riesgos de formato:

- Las respuestás reales usan listas con `*`, pero el renderer no convierte bullets a `<ul><li>`. Se muestran como texto con asteriscos y saltos de línea.
- Los CTAs dependen del mensaje del usuario, no de la respuestá del modelo. Si el usuario pregunta "como empiezo" sin keyword exacta, puede no aparecer CTA.
- `Sin respuestá.` no orienta al usuario ni ofrece siguiente paso.
- El README público del widget todavía dice que hay que poner la API key en `widget/chatbot.html`, lo que contradice la arquitectura real.

## 5. Muestreo de respuestás reales

Muestreo contra producción el 2026-04-27:

| Pregunta                   | Estado | Observacíon                                                              |
| -------------------------- | ------ | ------------------------------------------------------------------------ |
| Qué servicios ofreces      | 200    | Responde con servicios legacy y menciona Desarrollo Web desde ARS 40.000 |
| Cuánto cuestá un chatbot   | 200    | Responde ARS 20.000, consistente con `pricing.json`                      |
| Cuánto tarda una landing   | 200    | Responde 1 a 2 semanas, pero costo ARS 40.000, inconsistente             |
| Qué necesitas para empezar | 200    | Respuestá útil pero generica; no pide un set concreto de insumos         |
| Ver artículos del blog     | 200    | Recomienda artículos inexistentes en el repo actual                      |

Prueba de continuidad:

| Turno | Pregunta                    | Estado | Resultado                                       |
| ----- | --------------------------- | ------ | ----------------------------------------------- |
| 1     | Qué servicios ofreces       | 200    | Responde lista de servicios                     |
| 2     | Y cuanto cuestá el chatbot? | 200    | Mantiene contexto y responde precio del chatbot |

Conclusión: el flujo productivo continúa. El problema accionable inmediato es la calidad y vigencia del conocimiento.

## 6. Contenido accionable

### Banco inicial de FAQ recomendado

| Eje            | Pregunta                             | Respuestá base recomendada                                                                                                                                                         |
| -------------- | ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| servicio       | Qué incluye un chatbot con IA?       | Incluye configuracion del asistente, tono de marca, carga de contenido del negocio, integracion web, derivacíon a WhatsApp/email y soporte inicial.                                |
| servicio       | Cuánto cuestá un chatbot?            | Desde ARS 20.000, segun `pricing.json`. El valor final depende de cantidad de contenido, integraciones y flujo comercial.                                                          |
| servicio       | Cuánto tarda implementar un chatbot? | Entre 3 y 10 dias para un alcance inicial, si el cliente entrega contenido y accesos a tiempo.                                                                                     |
| servicio       | Qué incluye una landing page?        | Sitio one-page responsive, copy base, formulario, WhatsApp, SEO local y deploy en Vercel.                                                                                          |
| servicio       | Cuánto cuestá una landing?           | Desde ARS 20.000 segun `pricing.json` y `landing-page.mdx`.                                                                                                                        |
| servicio       | Hacen ecommerce o sistemás a medida? | Si. Se construyen plataformás de ecommerce y sistemás de gestion propietarios para centralizar operaciones. Precio de referencia publicado: ARS 50.000 para `ecommerce-platforms`. |
| servicio       | Trabajan con automatizaciones?       | Si. Se relevan procesos repetitivos, se identifican cuellos de botella y se proponen integraciones, pipelines o agentes cuando aportan valor.                                      |
| servicio       | Implementan IA local o privada?      | Si. Para empresas con requisitos de privacidad, se pueden desplegar LLMs en infraestructura propia para no enviar datos a terceros.                                                |
| objecion       | Qué pasa si el bot responde mal?     | El alcance debe incluir revision del contenido, pruebas con preguntas frecuentes y ajuste de instrucciones. Para casos críticos, derivar a humano.                                 |
| objecion       | El precio incluye soporte?           | El servicio de chatbot publicado menciona soporte post-lanzamiento de 30 dias. Luego se puede acordar mantenimiento.                                                               |
| objecion       | Necesito tener una web ya hecha?     | No necesariamente. Puede integrarse en una web existente o sumarse a una landing nueva.                                                                                            |
| objecion       | El bot reemplaza WhatsApp?           | No. Atiende preguntas frecuentes y califica consultas, pero deriva a WhatsApp cuando hay intencion de compra.                                                                      |
| descubrimiento | Para quien conviene un chatbot?      | Negocios que reciben consultas repetidas, pierden clientes fuera de horario o quieren capturar leads sin sumar personal.                                                           |
| descubrimiento | Qué contenido necesito entregar?     | Servicios, precios, horarios, preguntas frecuentes, tono de marca, datos de contacto y reglas sobre que no debe responder.                                                         |
| contratación   | Cómo empezamos?                      | Primero se hace una conversación breve para definir objetivo, fuentes de contenido, flujo de derivacíon y canal de contacto.                                                       |
| contratación   | Cómo te contacto?                    | WhatsApp o email publicados en `config.json`: `+54 9 11 3061-1776` y `comercial@escalatunegocioconia.com`.                                                                         |

### Gaps priorizados

P0 - Corregir información incorrecta:

- Alínear `services.json` con slugs y precios de `src/data/pricing.json`.
- Reemplazar artículos inexistentes en `articles.json` por posts reales.
- Corregir `chatbots-ai` a `chatbots-ia` o documentar el alias si se conserva.

P1 - Agregar conocimiento que evita invención:

- FAQ de objeciones comerciales.
- Insumos necesarios para empezar cada servicio.
- Alcance y exclusiones por servicio.
- Regla de derivacíon humana cuando el bot no sabe.

P2 - Mejorar conversión:

- Quick replies productivas desde `config.json`: precios, tiempos, empezar, artículos reales.
- CTAs por intencion, no solo por regex del texto del usuario.
- Respuestás modelo para "quiero contratar", "tengo una web", "no tengo contenido", "quiero WhatsApp".

P3 - Observabilidad editorial:

- Fecha de última revision por fuente.
- Campo `source` para rastrear si una respuestá viene de pricing, MDX, FAQ o articulo.
- Checklist de publicación que valide URLs de `articles.json`.

## 7. Recomendacion de schema

No conviene seguir ampliando `services.json` como contenedor de todo. Para nutrir el bot sin mezclar capas, recomiendo introducir una fuente estructurada de FAQ/conocimiento comercial.

Opción preferida:

```json
{
  "id": "chatbot-precio",
  "axis": "servicio",
  "service_id": "chatbots-ia",
  "question": "Cuánto cuestá un chatbot?",
  "answer": "Desde ARS 20.000. El valor final depende de contenido, integraciones y flujo comercial.",
  "cta": "whatsapp",
  "priority": 1,
  "source": "src/data/pricing.json",
  "last_reviewed": "2026-04-27"
}
```

Decisión de arquitectura recomendada:

- Mantener `pricing.json` como SSOT de precios.
- Mantener MDX como SSOT editorial para servicios y artículos.
- Crear una fuente FAQ para conocimiento conversaciónal, idealmente generada o sincronizada desde `src/content/faq/entries.json` y un nuevo set específico del chatbot.
- Evitar duplicar precios dentro de FAQ; la respuestá puede referenciar el servicio y usar precio derivado en la etapa de build o sincronización.

## 8. Documentación asociada

Desfasajes encontrados:

- `public/chatbot/README.md` contiene setup legacy: indica poner `GEMINI_API_KEY` en `widget/chatbot.html`, archivo que ya no existe como punto de entrada real.
- El README dice que `api.js` construye el system prompt; hoy esa responsabilidad está en `api/chat.js`.
- `docs/subsistemás/chatbot.md` está mucho más cerca de la arquitectura actual, pero no documenta el drift de contenido ni el requisito de probar funciones Vercel con `vercel dev` o deploy preview.
- `docs/subsistemás/convenciones-contenido.md` indica actualizar `articles.json` al publicar artículos, pero no hay validación automática que lo asegure.

## 9. Acciones recomendadas

1. Crear una tarea de fix funcional para normalizar respuestá vacia de Gemini en `api/chat.js`.
2. Actualizar `public/chatbot/data/services.json` desde `pricing.json` y `src/content/services/*.mdx`.
3. Reemplazar `articles.json` con artículos reales del repo.
4. Diseñar `faq.json` o una fuente equivalente para objeciones, discovery y contratación.
5. Actualizar `public/chatbot/README.md` para eliminar instrucciones legacy de API key en browser.
6. Agregar validación automática de rutas de `articles.json` contra `src/content/blog`.

## Estado

Documentado. La auditoría deja evidencia suficiente para ejecutar un sprint de corrección de contenido y luego otro de mejoras funcionales/schema.
