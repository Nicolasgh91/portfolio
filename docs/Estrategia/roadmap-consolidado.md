# Roadmap consolidado — escalatunegocioconia.com

_Documento único de referencia. Reemplaza a: `Roadmap.md`, `roadmap-accion-escalatunegocio.md`, `integracion-nuevas-ideas-roadmap.md`, `tareas-por-fase-escalatunegocio.md`._

_Última actualización: 2026-03-22_

---

## Estado actual del sistema

| Componente                              | Estado         | Notas                                                                                                                      |
| --------------------------------------- | -------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Landing page (Astro SSG + Vercel CDN)   | ✅ Operativo   | 5 servicios MDX, 3 blog MDX, 2 proyectos; rutas `/oferta/*` para ofertas comerciales                                       |
| Chatbot widget (iframe + Gemini + Edge) | ✅ Operativo   | CSS estabilizado, `theme.js` ya eliminado; hardening SEC (rate limit, circuit breaker, validación) en `api/chat.js` y libs |
| Schema Zod (`config.ts`)                | ✅ Actualizado | Blog: `priority`, `pillarSlug`, `vertical`. Servicios: `roiFocus`, `priceFrom`, `module` opcionales                        |
| Event schema JSON                       | ✅ En código   | `schemas/event.ts` (+ barrel); emisión runtime pendiente según Fase 4+                                                     |
| Carrito WhatsApp                        | 📐 Diseñado    | Spec en arquitectura modular                                                                                               |
| Stock / BOM                             | 📐 Diseñado    | Schema SQL definido, sin código                                                                                            |
| CRM                                     | 📐 Diseñado    | Schema SQL definido, sin código                                                                                            |
| Sistema de turnos                       | 📐 Diseñado    | Conecta con Double Click                                                                                                   |
| Dashboard de métricas                   | 📐 Diseñado    | Prerrequisito: 3+ clientes activos                                                                                         |
| SEO/GEO mensual                         | 🔄 En progreso | Blog activo, falta Google Business                                                                                         |

---

## Fase 0 — Fundamentos y deuda técnica

**Objetivo:** cerrar la deuda técnica que bloquea todas las fases siguientes.

**Módulo afectado:** transversal (schema, config, limpieza).

| #   | Tarea                                                 | Entregable                                                                                                                           | Estado                                                                  |
| --- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------- |
| 0.1 | Actualizar `config.ts` con campos SEO                 | Agregar `priority`, `pillarSlug`, `vertical` a la colección blog + sitemap dinámico por frontmatter                                  | ✅ Completado                                                           |
| 0.2 | Eliminar `theme.js` del chatbot                       | Sin acción de código: archivo inexistente en repo y sin imports activos                                                              | ✅ Completado                                                           |
| 0.3 | Consolidar schemas Zod en barrel canónico             | `schemas/index.ts` con re-exports + tipos inferidos y `WhatsAppOrderSchema` en `schemas/order.ts` + tests en `schemas/index.test.ts` | ✅ Completado                                                           |
| 0.4 | Extraer datos del JSX de arquitectura a JSON canónico | `data/modules.json`, `data/scenarios.json`, `data/connections.json` consumidos por el JSX                                            | ⏸️ Omitido (bloqueado: falta `src/components/arquitectura-modular.jsx`) |
| 0.5 | Eliminar proyectos prioridad 4–5 de talento           | Verificación aplicada: solo 2 proyectos activos y ninguno cumple criterio de archivado                                               | ✅ N/A (sin cambios)                                                    |

---

## Fase 1 — Módulo landing page

**Objetivo:** monetizar el activo existente. Empaquetar y comunicar lo que ya funciona.

**Módulo:** landing page (tier 0, ARS 20.000).

| #   | Tarea                                                | Tipo      | Entregable                                                                            | Estado        |
| --- | ---------------------------------------------------- | --------- | ------------------------------------------------------------------------------------- | ------------- |
| 1.1 | Publicar tarjeta comercial del chatbot (enfoque ROI) | Servicios | `src/content/services/chatbots-ia.mdx` (SVC-001: rename + rewrite ROI)                | ✅ Completado |
| 1.2 | Crear landing de oferta ARS 20.000                   | Web       | `/oferta/menu-digital` + `ContactForm`; chatbot global vía `Layout`                   | ✅ Completado |
| 1.3 | Producto empaquetado para creadores de contenido     | Template  | `/oferta/hub-creadores` (bio, FAQ accordion, videos placeholder, links por categoría) | ✅ Completado |
| 1.4 | Implementar botones de compartir                     | Feature   | `ArticleShare.astro` en páginas de blog (`/blog/[slug]`)                              | ✅ Completado |

**Segmentos target:** profesionales independientes, emprendedores sin web, creadores de contenido.

### Ejecución técnica — Semana 1 (UI + contenido)

| #     | Tarea técnica                                                                                  | Estado        |
| ----- | ---------------------------------------------------------------------------------------------- | ------------- |
| S1-T1 | Refactor `ServiceCard` para consumir `roiFocus` y `priceFrom` con render seguro                | ✅ Completado |
| S1-T2 | Actualizar `BlogCard` para mostrar badge de `vertical` en sección de etiquetas                 | ✅ Completado |
| S1-T3 | Sustituir `ia-agents.mdx` por `chatbots-ia.mdx` con enfoque comercial ROI (SVC-001)            | ✅ Completado |
| S1-T4 | Crear `src/content/services/landing-page.mdx` con propuesta ARS 20.000 y escalabilidad modular | ✅ Completado |
| S1-T5 | Crear `src/content/projects/chatbot-widget.mdx` como caso técnico de seniority                 | ✅ Completado |

---

## Fase 2 — Módulo chatbot IA

**Objetivo:** documentar la arquitectura existente como caso de estudio y adaptar el chatbot para verticales específicos.

**Módulo:** chatbot IA (tier 1, ARS 20.000–50.000).

| #   | Tarea                                                | Tipo    | Entregable                                                                                                                          | Estado        |
| --- | ---------------------------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| 2.1 | Caso de estudio técnico del chatbot                  | Talento | MDX: arquitectura serverless, protección API key, manejo 429, inyección JSON                                                        | Pendiente     |
| 2.2 | Adaptar chatbot demo para toma de pedidos de viandas | Widget  | `config-viandas.json` + `services-viandas.json` + `articles-viandas.json`; widget `?demo=viandas`; API `profile: viandas` allowlist | ✅ Completado |
| 2.3 | Tipar módulos JS del chatbot                         | Código  | Tipos TypeScript para `api.js`, `render.js`, `session.js`, `main.js`                                                                | Pendiente     |

**Segmentos target:** e-commerce (FAQ 24/7), viandas (toma de pedidos), inmobiliarias (calificación de leads), clínicas (agenda de turnos).

**Nota de ejecución:** las tareas 2.2 y 2.3 (demo vertical, tipado TS) pueden avanzar **en paralelo** con la Fase 3 (contenido blog / infra SEO). No están bloqueadas por el calendario de artículos. La tarea **2.1** es un caso de estudio técnico **aparte** de la tarjeta de proyecto S1-T5 (`chatbot-widget.mdx`): sigue pendiente hasta publicar el MDX de profundidad de arquitectura.

---

## Fase 3 — Módulo SEO/GEO

**Objetivo:** posicionamiento orgánico por vertical con contenido optimizado y Google Business.

**Módulo:** SEO/GEO mensual (tier 1, ARS 20.000/mes).

### Contenido prioridad 1 (alimentos + e-commerce)

| #   | Artículo                                                     | Keyword target                | Servicio que alimenta        |
| --- | ------------------------------------------------------------ | ----------------------------- | ---------------------------- |
| 3.1 | Del WhatsApp a la web: cómo triplicar pedidos de viandas     | viandas delivery web          | Landing + chatbot            |
| 3.2 | Menú digital vs PDF                                          | catálogo productos congelados | Landing                      |
| 3.3 | Cómo automatizar la toma de pedidos de viandas               | automatizar pedidos viandas   | Chatbot + automatización     |
| 3.4 | IA en tiendas online: el impacto de perder ventas a las 3 AM | chatbot ecommerce             | Chatbot                      |
| 3.5 | CRM básico para pymes                                        | crm pymes gratis              | CRM + consultoría            |
| 3.6 | ERP y persistencia en la era de la IA                        | ERP vs IA, alternativas SAP   | Consultoría + automatización |

### Contenido prioridad 2 (inmobiliarias + salud)

| #   | Artículo                                   | Keyword target             | Servicio que alimenta |
| --- | ------------------------------------------ | -------------------------- | --------------------- |
| 3.7 | Calificación de leads inmobiliarios con IA | lead scoring inmobiliaria  | Chatbot               |
| 3.8 | Automatización de turnos en clínicas       | automatizar turnos clínica | Chatbot + turnos      |

### Contenido prioridad 3 (transversal + B2B)

| #    | Artículo                                       | Keyword target                    | Servicio que alimenta   |
| ---- | ---------------------------------------------- | --------------------------------- | ----------------------- |
| 3.9  | Ciclo completo de venta (end-to-end)           | proceso de venta pymes            | CRM + automatización    |
| 3.10 | El poder de las APIs                           | qué es una API, API REST tutorial | Consultoría integración |
| 3.11 | Sistemas RAG para empresas                     | chatbot base conocimiento         | Chatbot premium         |
| 3.12 | Comparativa herramientas IA 2026 (pillar page) | mejor IA para código/marketing    | Tráfico transversal     |
| 3.13 | Embudo B2B con agentes de IA                   | precualificación leads IA         | Chatbot B2B             |

### Infraestructura SEO

| #    | Tarea                                                                           | Entregable                                                                                                                             |
| ---- | ------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| 3.14 | Configurar Google Business Profile                                              | Perfil verificado para SEO local                                                                                                       |
| 3.15 | Implementar JSON-LD por tipo de contenido                                       | `TechArticle` + breadcrumbs en `/blog/[slug]`; `@graph` de `Service` por ítem en `/servicios` (sin requerir rutas `/servicios/[slug]`) |
| 3.16 | Agregar campos `priority` y `pillarSlug` al frontmatter de artículos existentes | MDX actualizados retroactivamente                                                                                                      |

---

## Fase 4 — Módulo carrito WhatsApp

**Objetivo:** primer módulo tier 2. Catálogo web dinámico con carrito client-side y resumen estructurado vía WhatsApp.

**Módulo:** carrito WhatsApp (tier 2, ARS 50.000–99.000).

### Schema del producto

Cada producto tiene campos base fijos y **atributos dinámicos** definidos por el cliente. El cliente puede agregar o eliminar atributos según su negocio.

```
Campos fijos:
  id          UUID
  name        string (requerido)
  description string (texto libre, markdown básico)
  category    string
  price       number
  image_url   string | null (thumbnail)
  active      boolean
  created_at  timestamp

Atributos dinámicos (array):
  attributes  [{ key: string, value: string, type: enum('text','number','select') }]
```

Ejemplos de atributos dinámicos por vertical:

| Vertical             | Atributos posibles                                               |
| -------------------- | ---------------------------------------------------------------- |
| Viandas              | Tipo de dieta (keto, vegano, clásico), tamaño porción, alérgenos |
| Congelados mayorista | Peso neto, temperatura almacenamiento, unidad mínima de venta    |
| Ropa / accesorios    | Talle, color, material                                           |
| Estética / turnos    | Duración del servicio, profesional asignado                      |

### Hosting de imágenes (costo $0)

**Alternativas evaluadas:**

| Opción                           | Costo | Límite                          | Complejidad                          | Recomendación                                               |
| -------------------------------- | ----- | ------------------------------- | ------------------------------------ | ----------------------------------------------------------- |
| **Supabase Storage (free tier)** | $0    | 1 GB, 50 MB por archivo         | Baja (ya se usa Supabase en tier 2+) | ✅ Recomendado                                              |
| Cloudflare R2 (free tier)        | $0    | 10 GB, 10M requests clase B/mes | Media (cuenta aparte, SDK separado)  | Alternativa si se necesita más espacio                      |
| Oracle Cloud Object Storage      | $0    | 10 GB                           | Alta (setup complejo, SDK pesado)    | Descartado por complejidad                                  |
| Imágenes en base64 en JSON       | $0    | Sin límite técnico              | Nula                                 | Solo para thumbnails <50 KB. No escala.                     |
| GitHub raw + CDN                 | $0    | Ilimitado (repo público)        | Baja                                 | Solo viable para catálogos estáticos que no cambian seguido |

**Decisión:** Supabase Storage es la opción natural porque el tier 2+ ya depende de Supabase para persistencia. Un solo servicio para DB + storage + auth simplifica la operación y elimina vendor adicional.

**Flujo de carga de imagen:**

1. Cliente sube imagen desde panel admin (web o mobile).
2. Edge Function recibe, comprime a WebP ≤100 KB (thumbnail 200×200), y sube a Supabase Storage.
3. URL pública del bucket se guarda en el campo `image_url` del producto.
4. El catálogo web consume la URL directamente. CDN de Supabase sirve la imagen.

### Tareas de implementación

| #    | Tarea                                                     | Capa (jerarquía) | Entregable                                                                         |
| ---- | --------------------------------------------------------- | ---------------- | ---------------------------------------------------------------------------------- |
| 4.1  | Definir schema Zod para productos con atributos dinámicos | 1 — Schema       | `schemas/product.ts`                                                               |
| 4.2  | Definir schema SQL de productos en Supabase               | 1 — Schema       | Migración SQL con tabla `products` + columna JSONB para `attributes`               |
| 4.3  | Configurar bucket de imágenes en Supabase Storage         | 1 — Schema       | Bucket `product-images`, políticas de acceso público lectura                       |
| 4.4  | Lógica de compresión y upload de imagen                   | 2 — Flow         | Edge Function `api/upload-image.js` (WebP, resize, validación)                     |
| 4.5  | Lógica del carrito (client-side)                          | 2 — Flow         | `cart.js`: agregar, quitar, calcular total, persistir en sessionStorage            |
| 4.6  | Generador de resumen WhatsApp                             | 2 — Flow         | Función que formatea pedido en texto → link `wa.me`                                |
| 4.7  | Emisión de evento `order_placed`                          | 2 — Flow         | Integración con event schema `{ event, timestamp, module, data }`                  |
| 4.8  | API REST de productos (CRUD)                              | 4 — API          | Edge Functions: `api/products.js` (GET, POST, PUT, DELETE)                         |
| 4.9  | Panel admin de productos                                  | 5 — UI           | Interfaz para cargar productos, subir imagen, gestionar atributos dinámicos        |
| 4.10 | Catálogo web público                                      | 5 — UI           | Página de catálogo con filtros por categoría, thumbnails, botón agregar al carrito |
| 4.11 | Widget de carrito                                         | 5 — UI           | Resumen flotante, edición de cantidades, botón "enviar por WhatsApp"               |

**Segmentos target:** viandas/alimentos (catálogo reemplaza PDF), mayoristas (órdenes de compra estructuradas), dietéticas (delivery propio).

---

## Fase 5 — Módulo stock e inventario

**Objetivo:** control de inventario, recetas/BOM, cálculo de merma y margen por producto.

**Módulo:** stock e inventario (tier 2, ARS 99.000–150.000).

**Prerrequisito:** fase 4 (carrito) operativa. Stock consume eventos `order_placed` del carrito.

| #   | Tarea                                             | Capa       | Entregable                                                            |
| --- | ------------------------------------------------- | ---------- | --------------------------------------------------------------------- |
| 5.1 | Schema SQL de stock, recetas/BOM                  | 1 — Schema | Tablas `stock_movements`, `recipes` (ingrediente, qty_per_unit, cost) |
| 5.2 | Schema Zod para recetas y movimientos             | 1 — Schema | `schemas/stock.ts`                                                    |
| 5.3 | Lógica de descuento automático por pedido         | 2 — Flow   | Listener de evento `order_placed` → descuenta ingredientes según BOM  |
| 5.4 | Cálculo de necesidad de compra semanal            | 2 — Flow   | Proyección: pedidos promedio × ingredientes/receta = compra necesaria |
| 5.5 | Cálculo de margen por producto                    | 2 — Flow   | Precio de venta − costo de ingredientes (BOM) = margen unitario       |
| 5.6 | API REST de stock                                 | 4 — API    | `api/stock.js` (consultar niveles, registrar movimiento, alertas)     |
| 5.7 | Panel admin de stock y recetas                    | 5 — UI     | Interfaz de inventario, carga de recetas, alertas de reposición       |
| 5.8 | Emisión de eventos `stock_updated`, `margin_calc` | 2 — Flow   | Integración con event bus                                             |

---

## Fase 6 — Módulo CRM + seguimiento

**Objetivo:** registro de clientes, historial de interacciones, seguimientos automáticos.

**Módulo:** CRM + seguimiento (tier 2, ARS 50.000–99.000).

**Prerrequisito:** chatbot operativo (fase 2). CRM consume leads capturados por el chatbot.

| #   | Tarea                                        | Capa       | Entregable                                                        |
| --- | -------------------------------------------- | ---------- | ----------------------------------------------------------------- |
| 6.1 | Schema SQL de clientes y seguimientos        | 1 — Schema | Tablas `customers`, `interactions`, `follow_ups`                  |
| 6.2 | Schema Zod para clientes                     | 1 — Schema | `schemas/customer.ts`                                             |
| 6.3 | Lógica de ingesta de leads desde chatbot     | 2 — Flow   | Webhook/evento `lead_captured` → crear o actualizar cliente       |
| 6.4 | Lógica de scoring automático                 | 2 — Flow   | Score basado en: fuente, interacciones, historial de compras      |
| 6.5 | Lógica de seguimientos automáticos           | 2 — Flow   | Reglas: si no compró en X días → notificación de recontacto       |
| 6.6 | API REST de clientes                         | 4 — API    | `api/customers.js` (CRUD + búsqueda + filtros por score/segmento) |
| 6.7 | Panel CRM                                    | 5 — UI     | Vista de clientes, timeline de interacciones, pipeline de ventas  |
| 6.8 | Emisión de eventos `follow_up`, `conversion` | 2 — Flow   | Integración con event bus                                         |

---

## Fase 7 — Módulo sistema de turnos

**Objetivo:** agenda online, recordatorios automáticos, lista de espera.

**Módulo:** sistema de turnos (tier 2, ARS 50.000+).

**Prerrequisito:** chatbot operativo (fase 2). Conecta con Double Click™.

| #   | Tarea                                                   | Capa       | Entregable                                                    |
| --- | ------------------------------------------------------- | ---------- | ------------------------------------------------------------- |
| 7.1 | Schema SQL de turnos y disponibilidad                   | 1 — Schema | Tablas `bookings`, `availability_slots`, `waitlist`           |
| 7.2 | Schema Zod para turnos                                  | 1 — Schema | `schemas/booking.ts`                                          |
| 7.3 | Lógica de disponibilidad y conflictos                   | 2 — Flow   | Validación de solapamiento, bloqueo de slots ocupados         |
| 7.4 | Lógica de recordatorios (24h antes)                     | 2 — Flow   | Cron o webhook → notificación WhatsApp/email                  |
| 7.5 | Lógica de lista de espera automática                    | 2 — Flow   | Cancelación → primer candidato en waitlist recibe oferta      |
| 7.6 | Integración chatbot → turnos                            | 2 — Flow   | Chatbot consulta disponibilidad y agenda desde el chat        |
| 7.7 | API REST de turnos                                      | 4 — API    | `api/bookings.js` (crear, cancelar, consultar disponibilidad) |
| 7.8 | Panel de agenda                                         | 5 — UI     | Vista calendario, gestión de slots, lista de espera visible   |
| 7.9 | Emisión de eventos `booking`, `no_show`, `cancellation` | 2 — Flow   | Integración con event bus                                     |

---

## Fase 8 — Módulo dashboard de métricas

**Objetivo:** panel de inteligencia de negocio en tiempo real. Consume eventos de todos los módulos.

**Módulo:** dashboard de métricas (tier 3, ARS 15.000/mes).

**Prerrequisito:** al menos 3 clientes activos con módulos que emitan eventos.

| #   | Tarea                                    | Capa       | Entregable                                                                 |
| --- | ---------------------------------------- | ---------- | -------------------------------------------------------------------------- |
| 8.1 | Schema SQL de eventos (si no existe aún) | 1 — Schema | Tabla `events` con índice por módulo y fecha                               |
| 8.2 | API de consulta de eventos con filtros   | 4 — API    | `api/events.js` (filtros: módulo, rango de fecha, tipo de evento)          |
| 8.3 | Autenticación del dashboard              | 4 — API    | Supabase Auth — acceso protegido por cliente                               |
| 8.4 | Panel de métricas con gráficos           | 5 — UI     | Recharts o Chart.js: KPIs, tendencias, comparativas por módulo             |
| 8.5 | Widgets de métricas por módulo           | 5 — UI     | Pedidos/día, ticket promedio, leads, turnos, stock — según módulos activos |

---

## Fase 9 — Campañas de adquisición

**Objetivo:** generar flujo de leads para los módulos ya operativos.

| #   | Tarea                                        | Canal                        | Entregable                                               | Estado    |
| --- | -------------------------------------------- | ---------------------------- | -------------------------------------------------------- | --------- |
| 9.1 | Campaña "hamburguesa vs. web"                | Instagram stories + WhatsApp | 3 variantes de storie + imágenes Nano Banana             | Pendiente |
| 9.2 | Demo de "menú digital" para viandas          | Web                          | Landing template reutilizable — documentar en talento    | Pendiente |
| 9.3 | Artículo: automatización WhatsApp → planilla | Blog                         | MDX educativo con CTA a automatización                   | Pendiente |
| 9.4 | Documentar en talento cada servicio vendido  | Talento                      | MDX por proyecto: contexto, decisiones, stack, resultado | Continuo  |

---

## Fase 10 — Growth

**Objetivo:** mecanismos de crecimiento orgánico. Se activa con 10+ clientes activos.

| #    | Tarea                                    | Entregable                                                          | Prerrequisito                 |
| ---- | ---------------------------------------- | ------------------------------------------------------------------- | ----------------------------- |
| 10.1 | Programa de referidos                    | Mecánica: 10% descuento en próximo módulo por referido que contrate | 10+ clientes con 2+ productos |
| 10.2 | Tracking manual de referidos             | WhatsApp/email — sin sistema automatizado hasta 50+ clientes        | 10.1 activo                   |
| 10.3 | Automatización del programa de referidos | Sistema con códigos, tracking y aplicación automática de descuento  | 50+ clientes activos          |

---

## Embudo de productos consolidado

```
ENTRADA — low-ticket (ARS 20.000)
├── Landing "menú digital" (viandas/alimentos)
├── Landing "marca personal" (profesionales)
└── Landing "hub de contenido" (creadores)

UPSELL 1 (ARS 20.000–50.000)
├── Chatbot de pedidos (alimentos)
├── Chatbot FAQ + leads (e-commerce, inmobiliarias)
├── Chatbot de turnos (salud/estética)
└── SEO/GEO mensual (ARS 20.000/mes recurrente)

UPSELL 2 (ARS 50.000–150.000)
├── Carrito WhatsApp + catálogo dinámico
├── Stock e inventario + recetas/BOM
├── CRM + seguimiento automático
└── Sistema de turnos + recordatorios

UPSELL 3 — premium (ARS 99.000+ o suscripción)
├── Dashboard de métricas (ARS 15.000/mes)
├── SaaS a medida (Double Click, etc.)
└── Consultoría de integración / APIs

GROWTH
└── Programa de referidos (10% descuento)
```

---

## Segmentos priorizados

| Prioridad | Segmento               | Producto estrella                        | Ticket promedio   |
| --------- | ---------------------- | ---------------------------------------- | ----------------- |
| 1         | E-commerce / retail    | Chatbot FAQ + leads 24/7                 | ARS 20.000–50.000 |
| 1         | Viandas / alimentos    | Landing "menú digital" + chatbot pedidos | ARS 20.000–50.000 |
| 2         | Inmobiliarias          | Chatbot calificador de leads + CRM       | ARS 50.000–99.000 |
| 2         | Salud / estética       | Chatbot turnos + sistema de turnos       | ARS 20.000–50.000 |
| 3         | Agencias B2B           | Chatbot pre-cualificador + CRM           | ARS 50.000–99.000 |
| 3         | Catering corporativo   | Carrito + stock + dashboard (SaaS)       | ARS 99.000+       |
| 3         | Creadores de contenido | Landing hub + chatbot FAQ + SEO          | ARS 40.000–60.000 |

---

## Regla de oro

```
Un cliente puede comprar CUALQUIER combinación de módulos.
Cada módulo funciona de forma autónoma.
Cuando se combinan, los datos fluyen automáticamente entre ellos.
Agregar un módulo nuevo nunca requiere reescribir los existentes.
La jerarquía de implementación siempre es: Schema → Flow → API → UI.
```
