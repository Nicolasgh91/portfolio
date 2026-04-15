# Tareas técnicas de contenido — escalatunegocioconia.com

_Tarjetas de servicios, proyectos, talento y artículos derivados del roadmap consolidado. Cada tarea indica: tipo de contenido, archivo, frontmatter, estructura del body, CTA y relación con otros contenidos._

_Última actualización: 2026-03-20_

---

### PROMPT

El documento tiene 22 piezas de contenido organizadas en 3 bloques:
Bloque A — 7 tarjetas de servicios: 5 nuevas (SEO/GEO, landing page, CRM, turnos, dashboard) + 2 reescrituras (chatbot IA con enfoque ROI, e-commerce reenfocado a carrito WhatsApp). Cada una tiene frontmatter listo, estructura del body y relación explícita con los artículos y proyectos que la alimentan.
Bloque B — 2 proyectos/talento: caso de estudio técnico del chatbot widget (arquitectura serverless, decisiones de diseño, seguridad) y demo del menú digital para viandas (template replicable). Ambos son activos de venta y de portfolio simultáneamente.
Bloque C — 13 artículos de blog: organizados por prioridad (6 prioridad 1, 2 prioridad 2, 5 prioridad 3) con frontmatter completo incluyendo los campos nuevos (priority, pillarSlug, vertical). El artículo 3.12 (comparativa IA) funciona como pillar page al que linkean los artículos satélite.
Prerrequisito bloqueante: la tarea 0.1 del roadmap (actualizar config.ts con los campos priority, pillarSlug y vertical) debe ejecutarse antes de publicar cualquier artículo nuevo, porque los frontmatter de los 13 artículos usan esos campos y Zod los va a rechazar si no están en el schema.
El calendario sugiere 12 semanas de publicación, intercalando servicios + blog + talento para mantener ritmo y diversidad.

## Inventario actual vs. necesario

### Servicios (MDX en `src/content/services/`)

| Servicio existente                  | Archivo                   | Cubre módulo del roadmap                                  |
| ----------------------------------- | ------------------------- | --------------------------------------------------------- |
| Agentes de IA y chatbots avanzados  | `ia-agents.mdx`           | Chatbot IA (parcial — enfoque técnico, falta enfoque ROI) |
| E-commerce y plataformas de gestión | `ecommerce-platforms.mdx` | Carrito + stock (parcial — genérico, falta caso concreto) |
| LLMs locales                        | `local-llms.mdx`          | No corresponde a módulo del roadmap (nicho específico)    |
| Automatización de flujos de trabajo | `workflow-automation.mdx` | Automatizaciones (ok, mantener)                           |
| _(falta)_                           | —                         | SEO/GEO mensual                                           |
| _(falta)_                           | —                         | CRM + seguimiento                                         |
| _(falta)_                           | —                         | Sistema de turnos                                         |
| _(falta)_                           | —                         | Dashboard de métricas                                     |
| _(falta)_                           | —                         | Landing page / menú digital                               |

### Proyectos / talento (MDX en `src/content/projects/`)

| Proyecto existente | Archivo            | Estado                               |
| ------------------ | ------------------ | ------------------------------------ |
| ForestGuard        | `forestguard.mdx`  | Publicado. Microservicios + PostGIS. |
| Double Click™      | `double-click.mdx` | En progreso. Gestión para pilates.   |
| _(falta)_          | —                  | Caso de estudio del chatbot widget   |
| _(falta)_          | —                  | Demo "menú digital" para viandas     |

### Blog (MDX en `src/content/blog/`)

| Artículo existente                         | Archivo                          | Vertical                |
| ------------------------------------------ | -------------------------------- | ----------------------- |
| Agentes IA                                 | `ia-agents.mdx` (blog)           | Técnico/transversal     |
| Local LLMs                                 | `local-llms.mdx` (blog)          | Técnico/infraestructura |
| Workflow automation                        | `workflow-automation.mdx` (blog) | Automatización          |
| Analista funcional en era IA               | `analista-funcional-era-ia.mdx`  | Gestión tecnología      |
| Caso ForestGuard                           | `caso-forestguard.mdx`           | Arquitectura            |
| IA local vs cloud                          | `ia-local-vs-cloud.mdx`          | Infraestructura         |
| _(faltan 13 artículos del roadmap fase 3)_ | —                                | —                       |

---

## Bloque A — Tarjetas de servicios

Cada servicio nuevo requiere un MDX con frontmatter compatible con `config.ts` (colección `services`).

**Campos del frontmatter (vigentes en `config.ts`):**

```yaml
title: string
titleEn: string
description: string
descriptionEn: string
icon: string
order: number
href: string (opcional — link a página de detalle)
```

**Campos adicionales recomendados (agregar a `config.ts` en fase 0.1):**

```yaml
shortDescription: string # resumen de 1 línea para tarjeta
roiFocus: string # beneficio económico principal
module: string # módulo del roadmap que representa
priceFrom: string # precio base visible en tarjeta
```

**Estructura estándar del body:**

```
Párrafo introductorio (2-3 oraciones, lenguaje del cliente).

## Problema
  Dolor del segmento target. Sin tecnicismos.

## Solución
  Qué incluye el servicio (lista concreta de entregables).

## Resultado
  Beneficios medibles (horas ahorradas, revenue recuperado, costos eliminados).

## Cómo funciona
  3 pasos simples del proceso de contratación → entrega.

## CTA
  WhatsApp + email. Precio desde ARS X.
```

---

### SVC-001 — Actualizar tarjeta de chatbot IA (enfoque ROI)

**Fase del roadmap:** 1.1

**Archivo:** `src/content/services/chatbots-ia.mdx` (reescribir `ia-agents.mdx` existente)

**Justificación:** el MDX actual tiene enfoque técnico ("agentes con memoria, herramientas y razonamiento multi-paso"). El público target (dueños de pymes) necesita enfoque ROI ("dejá de perder ventas a las 3 AM").

**Frontmatter:**

```yaml
---
title: "Chatbots e IA para tu negocio"
titleEn: "AI chatbots for your business"
shortDescription: "Atención al cliente 24/7 sin costo por mensaje. Tu negocio responde mientras dormís."
roiFocus: "Recuperá las ventas que perdés fuera de horario. Un chatbot que atiende 50 consultas/día reemplaza 4 horas de trabajo humano."
description: "Chatbots inteligentes entrenados con el contenido de tu negocio. Se integran en cualquier web, toman pedidos, califican leads y derivan a WhatsApp cuando corresponde."
descriptionEn: "Smart chatbots trained on your business content. They integrate into any website, take orders, qualify leads and handoff to WhatsApp when needed."
icon: "🤖"
order: 1
module: "chatbot"
priceFrom: "ARS 20.000"
---
```

**Estructura del body:**

```
Intro: "¿Cuántas consultas perdés porque llegaron a las 2 AM?"

## Problema
  - Ventas perdidas fuera de horario.
  - Equipo saturado respondiendo las mismas preguntas.
  - Leads que se van a la competencia por falta de respuesta inmediata.
  - Sin datos de qué preguntan los clientes.

## Qué incluye
  - Chatbot personalizado con tu marca y tono.
  - Entrenado con tus servicios, precios y FAQ.
  - Integración en tu web existente (cualquier plataforma).
  - Derivación a WhatsApp cuando hay intención de compra.
  - Soporte post-lanzamiento 30 días.

## Resultado
  - 50 consultas/día atendidas automáticamente = 120 horas/mes liberadas.
  - Captura de leads estructurada (nombre, email, qué necesita).
  - Datos de preguntas frecuentes para mejorar tu oferta.

## Cómo funciona
  1. Nos enviás tu contenido (servicios, precios, FAQ).
  2. Entrenamos el chatbot y lo integramos en tu web.
  3. En 3–10 días está respondiendo 24/7.

## Segmentos que atendemos
  | Segmento | Caso de uso |
  | E-commerce | FAQ 24/7 + captura de leads |
  | Viandas / alimentos | Toma de pedidos automática |
  | Inmobiliarias | Calificación de leads por presupuesto y zona |
  | Clínicas / estética | Agenda de turnos desde el chat |
```

**Relación con otros contenidos:**

- Blog: 3.4 (IA en tiendas online), 3.7 (lead scoring inmobiliarias), 3.8 (turnos clínicas)
- Talento: caso de estudio del chatbot (PRJ-001)
- Servicio upsell: CRM (SVC-004), turnos (SVC-005)

---

### SVC-002 — Crear tarjeta de SEO/GEO mensual

**Fase del roadmap:** 3 (módulo SEO/GEO)

**Archivo:** `src/content/services/seo-geo.mdx` (nuevo)

**Frontmatter:**

```yaml
---
title: "SEO/GEO: posicionamiento en Google y modelos de IA"
titleEn: "SEO/GEO: search engine and AI model positioning"
shortDescription: "Que te encuentren los clientes que buscan lo que vendés. En Google, en ChatGPT, en Gemini."
roiFocus: "Tráfico orgánico que no depende de pauta ni de redes sociales. Visitas que nadie te puede quitar."
description: "Posicionamiento orgánico en buscadores y modelos de IA generativa. Google Business Profile, contenido optimizado y datos estructurados."
descriptionEn: "Organic positioning in search engines and generative AI models. Google Business Profile, optimized content and structured data."
icon: "🔍"
order: 5
module: "seo"
priceFrom: "ARS 20.000/mes"
---
```

**Estructura del body:**

```
Intro: "Si no aparecés en Google cuando alguien busca lo que vendés, es como tener un local sin cartel."

## Problema
  - Dependencia total de Instagram/redes para generar clientes.
  - Cero presencia en Google para búsquedas locales.
  - Invisibilidad en modelos de IA (ChatGPT, Gemini, Perplexity).
  - Competidores que ya posicionan las keywords de tu rubro.

## Qué incluye
  - Auditoría SEO técnica (velocidad, estructura, indexación).
  - Optimización de contenido existente + creación de nuevo.
  - Google Business Profile configurado y optimizado.
  - Datos estructurados (JSON-LD) para fragmentos enriquecidos.
  - Reporte mensual de posiciones y tráfico.

## Resultado
  - Aparecer en Google cuando buscan "[tu servicio] + [tu zona]".
  - Tráfico orgánico mensual creciente sin costo por clic.
  - Presencia en respuestas de IA generativa.

## Cómo funciona
  1. Auditoría inicial + selección de keywords.
  2. Optimización técnica + contenido en el primer mes.
  3. Mantenimiento mensual: nuevo contenido + seguimiento.
```

**Relación con otros contenidos:**

- Blog: 3.1 a 3.13 (todos los artículos alimentan el SEO)
- Servicio complementario: landing page (SVC-003), chatbot (SVC-001)

---

### SVC-003 — Crear tarjeta de landing page / menú digital

**Fase del roadmap:** 1 (módulo landing page)

**Archivo:** `src/content/services/landing-page.mdx` (nuevo)

**Frontmatter:**

```yaml
---
title: "Landing page y menú digital"
titleEn: "Landing page and digital menu"
shortDescription: "Tu negocio online en menos de 2 semanas. Desde ARS 20.000 — menos que una salida a cenar."
roiFocus: "Presencia profesional en Google 24/7. Cada visita orgánica es un cliente potencial que hoy no te encuentra."
description: "Diseño y desarrollo de landing pages optimizadas para SEO local, con formulario de contacto, WhatsApp directo y opción de catálogo visual para reemplazar el PDF."
descriptionEn: "Design and development of locally-optimized landing pages with contact forms, WhatsApp integration and optional visual catalog to replace PDF menus."
icon: "🌐"
order: 6
module: "landing"
priceFrom: "ARS 20.000"
---
```

**Estructura del body:**

```
Intro: "Por el precio de una hamburguesa gourmet, tu negocio tiene presencia profesional en Google."

## Problema
  - Sin web propia: dependés 100% de Instagram y boca a boca.
  - Catálogo en PDF que nadie descarga ni Google indexa.
  - Clientes potenciales que buscan tu servicio y encuentran a la competencia.

## Variantes
  | Producto | Ideal para | Qué incluye |
  | Landing one-page | Profesionales, emprendedores | Bio, servicios, formulario, WhatsApp CTA |
  | Menú digital | Viandas, congelados, dietéticas | Catálogo visual por categorías, fotos, precios, WhatsApp directo |
  | Hub de contenido | Creadores de contenido | Bio, FAQ accordion, galería de videos, links categorizados |

## Resultado
  - Presencia en Google para "[tu servicio] + [tu zona]".
  - Canal de contacto 24/7 (formulario + WhatsApp).
  - Base para agregar chatbot, carrito o SEO después.

## Cómo funciona
  1. Nos enviás tu contenido (textos, fotos, servicios/productos).
  2. Diseñamos y desarrollamos en 1–2 semanas.
  3. Deploy en Vercel (hosting gratuito incluido).
```

**Relación con otros contenidos:**

- Blog: 3.1 (WhatsApp a la web), 3.2 (menú digital vs PDF)
- Talento: demo menú digital viandas (PRJ-002)
- Servicio upsell: chatbot (SVC-001), SEO (SVC-002)

---

### SVC-004 — Crear tarjeta de CRM + seguimiento

**Fase del roadmap:** 6 (módulo CRM)

**Archivo:** `src/content/services/crm-seguimiento.mdx` (nuevo)

**Frontmatter:**

```yaml
---
title: "CRM y seguimiento de clientes"
titleEn: "CRM and client follow-up"
shortDescription: "Dejá de perder clientes por falta de seguimiento. Registro, historial y recontacto automático."
roiFocus: "Si perdés 3 ventas al mes por olvido de seguimiento a ARS 50.000 cada una, son ARS 150.000/mes en la mesa."
description: "Sistema de registro de clientes con historial de interacciones, scoring automático y seguimientos programados. Integra con chatbot y carrito."
descriptionEn: "Client registry with interaction history, automatic scoring and scheduled follow-ups. Integrates with chatbot and cart."
icon: "📋"
order: 7
module: "crm"
priceFrom: "ARS 50.000"
---
```

**Estructura del body:**

```
Intro: "¿Cuántos clientes te contactaron y nunca les volviste a escribir?"

## Problema
  - Datos de clientes dispersos entre WhatsApp, email y cuaderno.
  - No sabés quién compró qué ni cuándo fue la última interacción.
  - Leads que se enfrían porque nadie les hizo seguimiento.
  - Imposibilidad de segmentar para ofertas personalizadas.

## Qué incluye
  - Panel de clientes con historial completo.
  - Scoring automático (por fuente, interacciones, compras).
  - Seguimientos programados: si no compró en X días → alerta.
  - Integración con chatbot (leads se cargan automáticamente).
  - Integración con carrito (historial de compras por cliente).

## Resultado
  - Cero leads perdidos por olvido.
  - Segmentación: clientes recurrentes, ticket alto, abandonadores.
  - Recontacto automatizado que convierte leads fríos en ventas.

## Cómo funciona
  1. Conectamos el CRM con tu chatbot/carrito existente.
  2. Los leads empiezan a cargarse automáticamente.
  3. Configuramos reglas de seguimiento según tu ciclo de venta.
```

**Relación con otros contenidos:**

- Blog: 3.5 (CRM básico pymes), 3.9 (ciclo completo de venta)
- Servicio previo: chatbot (SVC-001), carrito (actualizar SVC-ECO)
- Servicio upsell: dashboard (SVC-006)

---

### SVC-005 — Crear tarjeta de sistema de turnos

**Fase del roadmap:** 7 (módulo turnos)

**Archivo:** `src/content/services/sistema-turnos.mdx` (nuevo)

**Frontmatter:**

```yaml
---
title: "Sistema de turnos y agenda online"
titleEn: "Booking system and online scheduling"
shortDescription: "Agendá turnos 24/7, reducí el ausentismo con recordatorios automáticos y llenás cancelaciones con lista de espera."
roiFocus: "Si el ausentismo baja del 25% al 10%, recuperás 3 turnos/día que antes perdías."
description: "Agenda online con recordatorios automáticos, lista de espera y conexión con chatbot. Ideal para clínicas, estudios de pilates y centros de estética."
descriptionEn: "Online booking with automatic reminders, waitlist and chatbot integration. Ideal for clinics, pilates studios and beauty centers."
icon: "📅"
order: 8
module: "bookings"
priceFrom: "ARS 50.000"
---
```

**Estructura del body:**

```
Intro: "¿Tu recepcionista pasa 4 horas/día agendando turnos por WhatsApp?"

## Problema
  - Recepcionista colapsada respondiendo "¿tienen turno para el martes?".
  - Ausentismo del 20–30% por olvido del paciente/cliente.
  - Cancelaciones de último momento sin reemplazo.
  - No se puede agendar fuera del horario de atención.

## Qué incluye
  - Agenda online accesible desde el chat o la web.
  - Recordatorios automáticos 24h antes (WhatsApp/email).
  - Lista de espera: cancelación → primer candidato recibe oferta.
  - Panel de agenda para el administrador.
  - Integración con chatbot (agendar desde el chat).

## Resultado
  - Ausentismo reducido del 25% al 10%.
  - Turnos agendados 24/7 sin intervención humana.
  - Cancelaciones cubiertas automáticamente.

## Segmentos ideales
  | Segmento | Conexión |
  | Estudio de pilates / yoga | Double Click™ (proyecto existente) |
  | Clínica odontológica / estética | Recordatorios reducen ausentismo |
  | Coach / mentor digital | Agenda de sesiones integrada en landing |
```

**Relación con otros contenidos:**

- Blog: 3.8 (automatización turnos clínicas)
- Talento: Double Click™ (proyecto existente)
- Servicio previo: chatbot (SVC-001), landing (SVC-003)

---

### SVC-006 — Crear tarjeta de dashboard de métricas

**Fase del roadmap:** 8 (módulo dashboard)

**Archivo:** `src/content/services/dashboard-metricas.mdx` (nuevo)

**Frontmatter:**

```yaml
---
title: "Dashboard de métricas para tu negocio"
titleEn: "Business metrics dashboard"
shortDescription: "Dejá de tomar decisiones por intuición. Métricas en tiempo real de pedidos, clientes, stock y ventas."
roiFocus: "Una sola decisión informada por el dashboard puede aumentar tu margen mensual un 15–20%."
description: "Panel de inteligencia de negocio en tiempo real. Consume datos de todos los módulos (chatbot, carrito, stock, CRM, turnos) vía API estandarizada."
descriptionEn: "Real-time business intelligence dashboard. Consumes data from all modules (chatbot, cart, stock, CRM, bookings) via standardized API."
icon: "📊"
order: 9
module: "dashboard"
priceFrom: "ARS 15.000/mes"
---
```

**Estructura del body:**

```
Intro: "Facturás, pero ¿sabés si ganás plata?"

## Problema
  - "No sé cuál es mi producto estrella."
  - "No sé cuántos clientes repiten."
  - "Tomo decisiones por intuición, no por datos."
  - "Abrir planillas me lleva horas."

## Qué incluye
  - Panel web con acceso protegido.
  - KPIs en tiempo real según módulos activos:
    · Pedidos/día, ticket promedio (carrito)
    · Leads capturados, tasa de conversión (chatbot + CRM)
    · Turnos agendados, ausentismo (turnos)
    · Niveles de stock, alertas de reposición (stock)
    · Margen por producto, vianda más vendida (stock + carrito)
  - Gráficos de tendencias y comparativas.
  - Funciona con cualquier combinación de módulos.

## Resultado
  - Visibilidad total del negocio en una sola pantalla.
  - Decisiones basadas en datos, no en sensaciones.
  - Detección temprana de problemas (stock bajo, leads fríos, ausentismo alto).

## Cómo funciona
  1. Conectamos el dashboard con tus módulos activos.
  2. Los datos fluyen automáticamente (event bus).
  3. Configuramos las métricas relevantes para tu negocio.
```

**Relación con otros contenidos:**

- Consume datos de: chatbot, carrito, stock, CRM, turnos
- Servicio previo: al menos 1 módulo tier 2 activo
- Talento: caso de arquitectura event-driven (PRJ-003 futuro)

---

### SVC-ECO — Actualizar tarjeta de e-commerce (enfoque carrito WhatsApp)

**Fase del roadmap:** 4 (módulo carrito)

**Archivo:** `src/content/services/ecommerce-platforms.mdx` (reescribir)

**Justificación:** el MDX actual es genérico ("sistemas unificados a medida"). Necesita caso concreto: carrito WhatsApp con catálogo dinámico, atributos por producto y thumbnails.

**Frontmatter actualizado:**

```yaml
---
title: "Catálogo digital y carrito WhatsApp"
titleEn: "Digital catalog and WhatsApp cart"
shortDescription: "Tus clientes arman el pedido solos desde el celular y te llega listo por WhatsApp. Sin pasarela de pago, sin comisiones."
roiFocus: "Eliminá las horas copiando pedidos a mano. 40 pedidos/día estructurados y sin errores."
description: "Catálogo web dinámico con fotos, precios y atributos por producto. Carrito client-side con resumen estructurado enviado por WhatsApp. Sin pasarela de pago."
descriptionEn: "Dynamic web catalog with photos, prices and per-product attributes. Client-side cart with structured summary sent via WhatsApp. No payment gateway."
icon: "🛒"
order: 3
module: "cart"
priceFrom: "ARS 50.000"
---
```

**Estructura del body:**

```
Intro: "¿Seguís tomando pedidos copiando mensajes de WhatsApp uno por uno?"

## Problema
  - Catálogo en PDF que nadie actualiza.
  - Pedidos que llegan desestructurados ("quiero 3 de las de pollo y 2 de las otras").
  - Errores al copiar cantidades, precios y direcciones.
  - No hay forma de que el cliente repita un pedido habitual.

## Qué incluye
  - Catálogo web con categorías, fotos y precios.
  - Atributos dinámicos por producto (talle, dieta, peso, etc.).
  - Carrito desde el celular: agregar, quitar, ver total.
  - Resumen estructurado enviado por WhatsApp (nombre, items, total, dirección, fecha).
  - Sin pasarela de pago: cobrás como quieras (efectivo, transferencia, MP).

## Resultado
  - Pedidos llegan completos y sin errores.
  - El cliente arma el pedido solo, sin esperar respuesta.
  - Catálogo actualizable en minutos.

## Segmentos ideales
  | Segmento | Caso |
  | Viandas / comidas | Menú semanal con categorías, alérgenos, zona de entrega |
  | Mayorista de congelados | Catálogo por categoría con unidad mínima de venta |
  | Dietética con delivery | Carrito + zona de entrega + cobro contra entrega |
```

**Relación con otros contenidos:**

- Blog: 3.1 (WhatsApp a la web), 3.2 (menú digital vs PDF), 3.3 (automatizar pedidos)
- Servicio previo: landing (SVC-003)
- Servicio upsell: stock (mantener servicio existente), dashboard (SVC-006)

---

## Bloque B — Proyectos / talento

Cada proyecto requiere MDX compatible con la colección `projects` de `config.ts`.

**Campos del frontmatter:**

```yaml
title: string
description: string
descriptionEn: string
url: string (opcional)
status: 'live' | 'in-progress' | 'completed'
tags: string[]
icon: string
githubUrl: string (opcional)
order: number
featured: boolean
```

---

### PRJ-001 — Caso de estudio: chatbot widget serverless

**Fase del roadmap:** 2.1

**Archivo:** `src/content/projects/chatbot-widget.mdx` (nuevo)

**Frontmatter:**

```yaml
---
title: "Chatbot widget serverless"
description: "Widget de chat con IA embebible en cualquier web. Arquitectura serverless con costo operativo $0/mes. Protección de API key, manejo de cuotas y contexto inyectado vía JSON."
descriptionEn: "Embeddable AI chat widget for any website. Serverless architecture with $0/month operating cost. API key protection, quota handling and JSON-injected context."
status: "live"
tags: ["JavaScript", "Vercel Edge", "Gemini API", "Serverless", "iframe"]
icon: "🤖"
order: 3
featured: true
---
```

**Estructura del body:**

```
Intro: qué es y por qué existe.

## Contexto y restricción principal
  Costo operativo $0/mes. Sin servidor persistente.

## Decisiones de arquitectura
  - Por qué serverless (Vercel Edge) y no backend tradicional.
  - Por qué iframe y no web component.
  - Por qué JSON estáticos y no base de datos.

## Seguridad
  - API key protegida vía proxy (nunca en el cliente).
  - System prompt construido server-side (SEC-001).
  - Rate limiting por IP (SEC-002).
  - CORS restrictivo (SEC-004).

## Manejo de cuotas
  - Detección de HTTP 429 de Gemini.
  - Circuit breaker con fallback a contacto.
  - UI que inhabilita input durante procesamiento.

## Inyección de contexto
  - config.json, services.json, articles.json alimentan el system prompt.
  - El chatbot responde solo con datos del negocio, no inventa.

## Stack
  Astro SSG · Vercel Edge Functions · Gemini API · JavaScript ES modules · CSS custom properties

## Lecciones aprendidas
  - (completar con experiencia real del desarrollo)

## Link al servicio
  → Este es el producto que se vende como "Chatbot IA" (link a SVC-001).
```

**Relación con otros contenidos:**

- Servicio: SVC-001 (chatbot IA)
- Blog: caso técnico detallado (expandir en artículo si se quiere más profundidad)

---

### PRJ-002 — Demo: menú digital para viandas

**Fase del roadmap:** 9.2

**Archivo:** `src/content/projects/menu-digital-viandas.mdx` (nuevo)

**Frontmatter:**

```yaml
---
title: "Menú digital para elaboradores de viandas"
description: "Landing template con catálogo visual de viandas, WhatsApp directo y chatbot de pedidos. Diseñada como producto replicable para el segmento de alimentos."
descriptionEn: "Landing template with visual meal catalog, direct WhatsApp and ordering chatbot. Designed as a replicable product for the food segment."
status: "completed"
tags: ["Astro", "Tailwind CSS", "Chatbot", "SEO local", "WhatsApp"]
icon: "🍱"
order: 4
featured: false
---
```

**Estructura del body:**

```
## Contexto del problema
  Elaboradores de viandas operan 100% por WhatsApp e Instagram.
  Sin catálogo profesional, sin presencia en Google, sin automatización.

## Decisiones de diseño
  - Mobile-first (el 90% de los clientes accede desde el celular).
  - Categorías visuales (por tipo de dieta, por día de entrega).
  - WhatsApp como canal de cierre (sin pasarela de pago).
  - Chatbot integrado para toma de pedidos fuera de horario.

## Stack
  Astro SSG · Tailwind CSS · Chatbot widget (PRJ-001) · Vercel

## Resultado
  Template replicable en 3 días para cualquier elaborador.
  Configuración: solo cambiar JSON de menú + fotos.

## Link al servicio
  → Este es el producto que se vende como "Landing page / menú digital" (link a SVC-003).
```

---

## Bloque C — Artículos de blog

Cada artículo requiere MDX compatible con la colección `blog` de `config.ts`.

**Campos del frontmatter (vigentes + campos nuevos de fase 0.1):**

```yaml
title: string
titleEn: string (opcional)
description: string
descriptionEn: string (opcional)
pubDate: date
category: string
tags: string[]
draft: boolean
readingTime: number (opcional)
coverImage: string (opcional)
coverAlt: string (opcional)
# Campos nuevos (fase 0.1):
priority: number (0-5)
pillarSlug: string (opcional — slug del artículo pillar al que pertenece)
vertical: 'ecommerce' | 'inmobiliaria' | 'salud' | 'alimentos' | 'b2b' | 'general'
```

**Estructura estándar del body de un artículo:**

```
Intro (hook de 2-3 oraciones con el dolor del lector).

## [Sección 1 — El problema]
  Descripción del dolor. Lenguaje del segmento target.

## [Sección 2 — Contexto / datos]
  Datos, estadísticas, comparativas que validen el problema.

## [Sección 3 — La solución]
  Qué existe, cómo funciona, caso práctico.

## [Sección 4 — Resultado / ROI]
  Números concretos de beneficio.

## Siguiente paso
  CTA al servicio correspondiente. Link a WhatsApp/email.
```

---

### Prioridad 1 — Alimentos + e-commerce (6 artículos)

#### ART-001 — Del WhatsApp a la web: cómo triplicar pedidos de viandas

**Fase:** 3.1 · **Vertical:** alimentos · **Priority:** 1 · **Servicio:** landing + chatbot

**Archivo:** `src/content/blog/whatsapp-web-viandas.mdx`

**Frontmatter:**

```yaml
---
title: "Del WhatsApp a la web: cómo un elaborador de viandas puede triplicar sus pedidos"
description: "Por qué depender solo de WhatsApp limita tu crecimiento y cómo una web simple con chatbot cambia el juego."
pubDate: 2026-04-01
category: "gestion-operativa"
tags: ["viandas", "WhatsApp", "delivery", "chatbot", "SEO local"]
draft: false
readingTime: 6
priority: 1
pillarSlug: null
vertical: "alimentos"
---
```

**Keywords target:** viandas delivery web, vender viandas online

**CTA:** servicios de landing page (SVC-003) + chatbot (SVC-001)

---

#### ART-002 — Menú digital vs PDF

**Fase:** 3.2 · **Vertical:** alimentos · **Priority:** 1 · **Servicio:** landing

**Archivo:** `src/content/blog/menu-digital-vs-pdf.mdx`

**Frontmatter:**

```yaml
---
title: "Menú digital vs PDF: por qué tu catálogo de congelados necesita una actualización"
description: "El PDF no se indexa en Google, no se actualiza en tiempo real y no permite medir. El menú digital sí."
pubDate: 2026-04-08
category: "ecommerce"
tags: ["catálogo digital", "PDF", "congelados", "SEO", "menú digital"]
draft: false
readingTime: 5
priority: 1
pillarSlug: null
vertical: "alimentos"
---
```

**Keywords target:** catálogo productos congelados, menú digital restaurante

**CTA:** landing page / menú digital (SVC-003)

---

#### ART-003 — Cómo automatizar la toma de pedidos de viandas

**Fase:** 3.3 · **Vertical:** alimentos · **Priority:** 1 · **Servicio:** chatbot + automatización

**Archivo:** `src/content/blog/automatizar-pedidos-viandas.mdx`

```yaml
---
title: "Cómo automatizar la toma de pedidos de viandas sin contratar personal"
description: "Un chatbot entrenado con tu menú toma pedidos mientras cocinás, dormís o entregás."
pubDate: 2026-04-15
category: "automatizacion"
tags: ["automatización", "pedidos", "viandas", "chatbot", "WhatsApp"]
draft: false
readingTime: 6
priority: 1
pillarSlug: null
vertical: "alimentos"
---
```

**Keywords target:** automatizar pedidos viandas, chatbot pedidos comida

---

#### ART-004 — IA en tiendas online: el impacto de perder ventas a las 3 AM

**Fase:** 3.4 · **Vertical:** ecommerce · **Priority:** 1 · **Servicio:** chatbot

**Archivo:** `src/content/blog/ia-ecommerce-ventas-nocturnas.mdx`

```yaml
---
title: "Cómo dejar de perder ventas a las 3 AM: el impacto de la IA en tiendas online"
description: "El 35% de las consultas de compra llegan fuera de horario. Sin atención automática, esas ventas van a la competencia."
pubDate: 2026-04-22
category: "ecommerce"
tags: ["ecommerce", "chatbot", "IA", "ventas nocturnas", "Tiendanube"]
draft: false
readingTime: 5
priority: 1
pillarSlug: null
vertical: "ecommerce"
---
```

---

#### ART-005 — CRM básico para pymes

**Fase:** 3.5 · **Vertical:** general · **Priority:** 1 · **Servicio:** CRM + consultoría

**Archivo:** `src/content/blog/crm-basico-pymes.mdx`

```yaml
---
title: "CRM básico para pymes: cómo dejar de perder clientes por falta de seguimiento"
description: "No necesitás Salesforce. Un CRM puede ser una planilla bien organizada. Lo que importa es la disciplina."
pubDate: 2026-04-29
category: "gestion-operativa"
tags: ["CRM", "pymes", "seguimiento", "clientes", "Google Sheets"]
draft: false
readingTime: 7
priority: 0
pillarSlug: null
vertical: "general"
---
```

**Nota:** prioridad 0 por alto volumen de búsqueda.

---

#### ART-006 — ERP y persistencia en la era de la IA

**Fase:** 3.6 · **Vertical:** general · **Priority:** 1 · **Servicio:** consultoría + automatización

**Archivo:** `src/content/blog/erp-persistencia-era-ia.mdx`

```yaml
---
title: "¿Tu ERP tiene los días contados? Persistencia y redefinición en la era de la IA"
description: "El ERP no desaparece, se simplifica. La gestión estratégica se delega a capas de IA. Análisis equilibrado para decision-makers."
pubDate: 2026-05-06
category: "gestion-tecnologia"
tags: ["ERP", "IA", "SAP", "transformación digital", "contabilidad"]
draft: false
readingTime: 8
priority: 1
pillarSlug: null
vertical: "general"
---
```

---

### Prioridad 2 — Inmobiliarias + salud (2 artículos)

#### ART-007 — Calificación de leads inmobiliarios con IA

**Fase:** 3.7 · **Vertical:** inmobiliaria · **Priority:** 2 · **Servicio:** chatbot

**Archivo:** `src/content/blog/lead-scoring-inmobiliaria-ia.mdx`

```yaml
---
title: "Calificación de leads en piloto automático: cómo la IA filtra a los verdaderos compradores"
description: "Un chatbot que pregunta presupuesto, zona y urgencia antes de que el agente invierta tiempo en una visita."
pubDate: 2026-05-20
category: "automatizacion"
tags: ["inmobiliaria", "lead scoring", "chatbot", "IA", "ventas"]
draft: false
readingTime: 6
priority: 2
pillarSlug: null
vertical: "inmobiliaria"
---
```

---

#### ART-008 — Automatización de turnos en clínicas

**Fase:** 3.8 · **Vertical:** salud · **Priority:** 2 · **Servicio:** chatbot + turnos

**Archivo:** `src/content/blog/automatizacion-turnos-clinica-ia.mdx`

```yaml
---
title: "De la agenda de papel a la automatización: reduciendo el ausentismo con IA"
description: "Recordatorios automáticos, lista de espera inteligente y agenda 24/7. El 60% de la gestión de turnos se puede automatizar."
pubDate: 2026-05-27
category: "automatizacion"
tags: ["turnos", "clínica", "pilates", "estética", "chatbot", "ausentismo"]
draft: false
readingTime: 6
priority: 2
pillarSlug: null
vertical: "salud"
---
```

---

### Prioridad 3 — Transversal + B2B (5 artículos)

#### ART-009 — Ciclo completo de venta (end-to-end)

**Fase:** 3.9 · **Vertical:** general · **Priority:** 3

**Archivo:** `src/content/blog/ciclo-venta-completo.mdx`

```yaml
---
title: "El ciclo completo de venta: de la primera consulta a la fidelización"
description: "Framework paso a paso para organizar tu proceso de ventas. Desde generar demanda hasta que el cliente vuelva."
pubDate: 2026-06-03
category: "gestion-operativa"
tags: ["ventas", "pipeline", "proceso comercial", "pymes", "CRM"]
draft: false
readingTime: 8
priority: 3
pillarSlug: null
vertical: "general"
---
```

---

#### ART-010 — El poder de las APIs

**Fase:** 3.10 · **Vertical:** general · **Priority:** 3

**Archivo:** `src/content/blog/poder-apis.mdx`

```yaml
---
title: "El poder de las APIs: cómo hacer que tus sistemas hablen entre sí"
description: "Tu facturación, tu web y tu WhatsApp pueden conectarse sin reemplazar nada. La API es el puente."
pubDate: 2026-06-10
category: "arquitectura"
tags: ["API", "REST", "integración", "sistemas", "automatización"]
draft: false
readingTime: 7
priority: 3
pillarSlug: null
vertical: "general"
---
```

---

#### ART-011 — Sistemas RAG para empresas

**Fase:** 3.11 · **Vertical:** general · **Priority:** 3

**Archivo:** `src/content/blog/sistemas-rag-empresas.mdx`

```yaml
---
title: "Sistemas RAG: cuando el chatbot necesita responder con precisión del 95%"
description: "La diferencia entre un chatbot que inventa y uno que busca en tus documentos antes de responder."
pubDate: 2026-06-17
category: "arquitectura"
tags: ["RAG", "chatbot", "base de conocimiento", "IA", "embeddings"]
draft: false
readingTime: 8
priority: 3
pillarSlug: null
vertical: "general"
---
```

---

#### ART-012 — Comparativa herramientas IA 2026 (pillar page)

**Fase:** 3.12 · **Vertical:** general · **Priority:** 3

**Archivo:** `src/content/blog/comparativa-herramientas-ia-2026.mdx`

```yaml
---
title: "Comparativa de herramientas de IA en 2026: cuál usar para cada tarea"
description: "No existe la mejor IA. Cada herramienta domina en un eje. Comparamos por caso de uso real."
pubDate: 2026-06-24
category: "gestion-tecnologia"
tags: ["IA", "ChatGPT", "Claude", "Gemini", "comparativa", "herramientas"]
draft: false
readingTime: 10
priority: 3
pillarSlug: null
vertical: "general"
---
```

**Nota:** este artículo funciona como pillar page. Los artículos 3.4, 3.7, 3.8, 3.11 son satélites que linkean a este.

---

#### ART-013 — Embudo B2B con agentes de IA

**Fase:** 3.13 · **Vertical:** b2b · **Priority:** 3

**Archivo:** `src/content/blog/embudo-b2b-agentes-ia.mdx`

```yaml
---
title: "El embudo perfecto: cómo usar agentes de IA para pre-cualificar clientes B2B"
description: "Un chatbot que hace las 5 preguntas correctas antes de que tu equipo comercial invierta tiempo."
pubDate: 2026-07-01
category: "automatizacion"
tags: ["B2B", "leads", "precualificación", "chatbot", "agentes IA"]
draft: false
readingTime: 6
priority: 3
pillarSlug: null
vertical: "b2b"
---
```

---

## Resumen de entregables

| Tipo          | Nuevos                 | Actualizar           | Total  |
| ------------- | ---------------------- | -------------------- | ------ |
| Servicios MDX | 5 (SVC-002 a SVC-006)  | 2 (SVC-001, SVC-ECO) | 7      |
| Proyectos MDX | 2 (PRJ-001, PRJ-002)   | 0                    | 2      |
| Blog MDX      | 13 (ART-001 a ART-013) | 0                    | 13     |
| **Total**     | **20**                 | **2**                | **22** |

## Calendario de publicación sugerido

| Semana | Contenido                                                     | Tipo            |
| ------ | ------------------------------------------------------------- | --------------- |
| 1      | SVC-001 (chatbot actualizado) + SVC-003 (landing)             | Servicios       |
| 2      | SVC-ECO (carrito actualizado) + SVC-002 (SEO/GEO)             | Servicios       |
| 3      | PRJ-001 (caso chatbot) + ART-001 (viandas WhatsApp)           | Talento + blog  |
| 4      | ART-002 (menú digital vs PDF) + ART-003 (automatizar pedidos) | Blog            |
| 5      | ART-004 (ventas 3 AM) + ART-005 (CRM pymes)                   | Blog            |
| 6      | ART-006 (ERP) + SVC-004 (CRM servicio)                        | Blog + servicio |
| 7      | ART-007 (lead scoring) + SVC-005 (turnos)                     | Blog + servicio |
| 8      | ART-008 (turnos clínicas) + PRJ-002 (demo viandas)            | Blog + talento  |
| 9      | ART-009 (ciclo venta) + SVC-006 (dashboard)                   | Blog + servicio |
| 10     | ART-010 (APIs) + ART-011 (RAG)                                | Blog            |
| 11     | ART-012 (comparativa IA — pillar page)                        | Blog            |
| 12     | ART-013 (embudo B2B)                                          | Blog            |

## Prerrequisito transversal

Antes de publicar el primer artículo nuevo, ejecutar tarea **0.1 del roadmap**: actualizar `config.ts` con los campos `priority`, `pillarSlug` y `vertical` en la colección blog. Sin esto, los frontmatter de ART-001 a ART-013 fallan la validación Zod.
