# Roadmap de contenido — escalatunegocioconia.com

_Objetivo: popular el sitio con contenido consistente en servicios, talento, blog y chatbot durante 4 semanas. Este ciclo consolida la marca, afirma conocimientos técnicos y posiciona orgánicamente antes de activar pauta o desarrollar productos nuevos._

_Última actualización: 2026-03-25_

---

## Estado actual del contenido

| Sección                               | Publicado                                                                   | Pendiente                                                        | Notas                                                                      |
| ------------------------------------- | --------------------------------------------------------------------------- | ---------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Servicios (`src/content/services/`)   | 5 MDX (ia-agents, ecommerce, local-llms, workflow-automation, landing-page) | 5 nuevos (SVC-002 a SVC-006) + 2 reescrituras (SVC-001, SVC-ECO) | ia-agents y landing-page ya actualizados en fase 1 del roadmap consolidado |
| Proyectos (`src/content/projects/`)   | 3 MDX (forestguard, double-click, chatbot-widget)                           | 1 nuevo (PRJ-002: demo menú viandas)                             | chatbot-widget ya creado en S1-T5                                          |
| Blog (`src/content/blog/`)            | 6 MDX existentes                                                            | 13 nuevos (ART-001 a ART-013)                                    | Esquema Zod ya soporta `priority`, `pillarSlug`, `vertical`                |
| Chatbot data (`public/chatbot/data/`) | config.json, services.json, articles.json                                   | Actualizar ambos JSON con cada publicación                       | Sin esto, el chatbot responde con información desactualizada               |

---

## Prerrequisitos (antes de semana 1)

| #    | Tarea                                                                                    | Estado        | Referencia                        |
| ---- | ---------------------------------------------------------------------------------------- | ------------- | --------------------------------- |
| P-01 | Verificar que `config.ts` incluya `priority`, `pillarSlug`, `vertical` en colección blog | ✅ Completado | Tarea 0.1 del roadmap consolidado |
| P-02 | Verificar que `ServiceCard` consuma `roiFocus` y `priceFrom`                             | ✅ Completado | S1-T1                             |
| P-03 | Verificar que `BlogCard` muestre badge de `vertical`                                     | ✅ Completado | S1-T2                             |
| P-04 | Confirmar que SVC-001 (chatbot IA, enfoque ROI) está publicado                           | ✅ Completado | S1-T3                             |
| P-05 | Confirmar que SVC-003 (landing page) está publicado                                      | ✅ Completado | S1-T4                             |
| P-06 | Confirmar que PRJ-001 (chatbot-widget caso técnico) está publicado                       | ✅ Completado | S1-T5                             |

Todo lo anterior ya fue ejecutado. El punto de partida de este roadmap es contenido nuevo a partir de la semana 1.

---

## Regla transversal: sincronización del chatbot

Cada vez que se publique un servicio, artículo o proyecto nuevo, se debe actualizar el JSON correspondiente del chatbot:

| Tipo de contenido          | Archivo a actualizar                                    |
| -------------------------- | ------------------------------------------------------- |
| Servicio nuevo o reescrito | `public/chatbot/data/services.json`                     |
| Artículo de blog nuevo     | `public/chatbot/data/articles.json`                     |
| Proyecto nuevo             | Mencionar en `services.json` si conecta con un servicio |

Esta tarea se marca como **DATA-SYNC** en cada semana y es condición de cierre.

---

## Semana 1 — Servicios core + primer artículo

**Foco:** completar las tarjetas de servicios que faltan y arrancar el blog con el vertical de alimentos.

### Servicios

| #     | Entregable                                                          | Archivo                                        | Referencia |
| ----- | ------------------------------------------------------------------- | ---------------------------------------------- | ---------- |
| S1-01 | Reescribir tarjeta e-commerce → catálogo digital y carrito WhatsApp | `src/content/services/ecommerce-platforms.mdx` | SVC-ECO    |
| S1-02 | Crear tarjeta SEO/GEO mensual                                       | `src/content/services/seo-geo.mdx`             | SVC-002    |
| S1-03 | Crear tarjeta CRM + seguimiento                                     | `src/content/services/crm-seguimiento.mdx`     | SVC-004    |

### Blog

| #     | Entregable                                               | Archivo                                     | Referencia |
| ----- | -------------------------------------------------------- | ------------------------------------------- | ---------- |
| S1-04 | Del WhatsApp a la web: cómo triplicar pedidos de viandas | `src/content/blog/whatsapp-web-viandas.mdx` | ART-001    |

### Sincronización

| #            | Entregable                                                                                        |
| ------------ | ------------------------------------------------------------------------------------------------- |
| DATA-SYNC-S1 | Actualizar `services.json` con SVC-ECO, SVC-002, SVC-004. Actualizar `articles.json` con ART-001. |

### Criterio de cierre semana 1

- 3 tarjetas de servicios publicadas y visibles en `/servicios`.
- 1 artículo publicado y visible en `/blog`.
- Chatbot responde correctamente sobre los servicios y artículos nuevos.

---

## Semana 2 — Servicios restantes + blog alimentos

**Foco:** cerrar todas las tarjetas de servicios pendientes y continuar el vertical de alimentos con artículos que alimentan SEO.

### Servicios

| #     | Entregable                          | Archivo                                       | Referencia |
| ----- | ----------------------------------- | --------------------------------------------- | ---------- |
| S2-01 | Crear tarjeta sistema de turnos     | `src/content/services/sistema-turnos.mdx`     | SVC-005    |
| S2-02 | Crear tarjeta dashboard de métricas | `src/content/services/dashboard-metricas.mdx` | SVC-006    |

### Blog

| #     | Entregable                                     | Archivo                                            | Referencia |
| ----- | ---------------------------------------------- | -------------------------------------------------- | ---------- |
| S2-03 | Menú digital vs PDF                            | `src/content/blog/menu-digital-vs-pdf.mdx`         | ART-002    |
| S2-04 | Cómo automatizar la toma de pedidos de viandas | `src/content/blog/automatizar-pedidos-viandas.mdx` | ART-003    |

### Talento

| #     | Entregable                     | Archivo                                         | Referencia |
| ----- | ------------------------------ | ----------------------------------------------- | ---------- |
| S2-05 | Demo menú digital para viandas | `src/content/projects/menu-digital-viandas.mdx` | PRJ-002    |

### Sincronización

| #            | Entregable                                                                                                                                           |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| DATA-SYNC-S2 | Actualizar `services.json` con SVC-005, SVC-006. Actualizar `articles.json` con ART-002, ART-003. Agregar PRJ-002 en `services.json` si corresponde. |

### Criterio de cierre semana 2

- Todas las tarjetas de servicios (7 en total) publicadas. Sección `/servicios` completa.
- 3 artículos de blog acumulados.
- Sección `/talento` con 4 proyectos (forestguard, double-click, chatbot-widget, menu-digital-viandas).
- Chatbot actualizado y consistente con todo el contenido publicado.

---

## Semana 3 — Blog e-commerce + transversal + infraestructura SEO

**Foco:** expandir el blog hacia e-commerce y gestión. Implementar infraestructura SEO técnica.

### Blog

| #     | Entregable                                                   | Archivo                                              | Referencia |
| ----- | ------------------------------------------------------------ | ---------------------------------------------------- | ---------- |
| S3-01 | IA en tiendas online: el impacto de perder ventas a las 3 AM | `src/content/blog/ia-ecommerce-ventas-nocturnas.mdx` | ART-004    |
| S3-02 | CRM básico para pymes                                        | `src/content/blog/crm-basico-pymes.mdx`              | ART-005    |
| S3-03 | ERP y persistencia en la era de la IA                        | `src/content/blog/erp-persistencia-era-ia.mdx`       | ART-006    |

### Infraestructura SEO

| #     | Entregable                                                                         | Referencia                         |
| ----- | ---------------------------------------------------------------------------------- | ---------------------------------- |
| S3-04 | Implementar JSON-LD `Service` en página de servicios                               | Tarea 3.15 del roadmap consolidado |
| S3-05 | Agregar campos `priority` y `pillarSlug` retroactivos a los 6 artículos existentes | Tarea 3.16                         |
| S3-06 | Configurar Google Business Profile (inicio — verificación puede demorar)           | Tarea 3.14                         |

### Sincronización

| #            | Entregable                                                |
| ------------ | --------------------------------------------------------- |
| DATA-SYNC-S3 | Actualizar `articles.json` con ART-004, ART-005, ART-006. |

### Criterio de cierre semana 3

- 6 artículos de blog acumulados (3 alimentos + 1 e-commerce + 1 gestión + 1 gestión tecnología).
- JSON-LD de servicios implementado.
- Artículos existentes con frontmatter retroactivo completo.
- Google Business Profile en proceso de verificación.

---

## Semana 4 — Blog verticales específicos + cierre de consistencia

**Foco:** publicar los artículos de inmobiliarias y salud. Cerrar el ciclo con revisión de consistencia total del sitio.

### Blog

| #     | Entregable                                 | Archivo                                                 | Referencia |
| ----- | ------------------------------------------ | ------------------------------------------------------- | ---------- |
| S4-01 | Calificación de leads inmobiliarios con IA | `src/content/blog/lead-scoring-inmobiliaria-ia.mdx`     | ART-007    |
| S4-02 | Automatización de turnos en clínicas       | `src/content/blog/automatizacion-turnos-clinica-ia.mdx` | ART-008    |

### Revisión de consistencia

| #     | Tarea                                                                                            |
| ----- | ------------------------------------------------------------------------------------------------ |
| S4-03 | Verificar que `/servicios` muestre las 7 tarjetas con `roiFocus`, `priceFrom` y links correctos  |
| S4-04 | Verificar que `/talento` muestre los 4 proyectos con tags, status y descripciones consistentes   |
| S4-05 | Verificar que `/blog` muestre los 14 artículos (6 existentes + 8 nuevos) con badges de vertical  |
| S4-06 | Verificar que el chatbot responda correctamente sobre todos los servicios, artículos y proyectos |
| S4-07 | Verificar que el sitemap incluya todas las URLs nuevas                                           |
| S4-08 | Verificar JSON-LD en páginas de blog (Article) y servicios (Service)                             |

### Sincronización

| #            | Entregable                                                                                                                       |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| DATA-SYNC-S4 | Actualizar `articles.json` con ART-007, ART-008. Revisión final de `services.json` y `articles.json` contra contenido publicado. |

### Criterio de cierre semana 4

- 8 artículos nuevos publicados (14 en total contando los 6 existentes).
- Todas las secciones del sitio populadas y consistentes entre sí.
- Chatbot completamente alineado con el contenido del sitio.
- Infraestructura SEO técnica operativa (JSON-LD, sitemap, Google Business Profile en verificación).
- **El sitio está listo para activar pauta y generar tráfico.**

---

## Resumen de entregables por semana

| Semana    | Servicios                     | Blog                          | Talento     | SEO técnico                             | Data sync    |
| --------- | ----------------------------- | ----------------------------- | ----------- | --------------------------------------- | ------------ |
| 1         | 3 (SVC-ECO, SVC-002, SVC-004) | 1 (ART-001)                   | —           | —                                       | ✓            |
| 2         | 2 (SVC-005, SVC-006)          | 2 (ART-002, ART-003)          | 1 (PRJ-002) | —                                       | ✓            |
| 3         | —                             | 3 (ART-004, ART-005, ART-006) | —           | JSON-LD + frontmatter retroactivo + GBP | ✓            |
| 4         | —                             | 2 (ART-007, ART-008)          | —           | Verificación de consistencia            | ✓            |
| **Total** | **5 nuevos + 2 reescritos**   | **8 nuevos**                  | **1 nuevo** | **3 tareas**                            | **4 ciclos** |

---

## Contenido diferido al próximo roadmap

Los siguientes entregables quedan fuera de este ciclo de 4 semanas. Se abordarán en el roadmap de productos y pauta:

### Artículos (prioridad 3 — transversal y B2B)

| ID      | Título                                         | Motivo del diferimiento                                                          |
| ------- | ---------------------------------------------- | -------------------------------------------------------------------------------- |
| ART-009 | Ciclo completo de venta                        | Requiere CRM operativo para case study real                                      |
| ART-010 | El poder de las APIs                           | Contenido técnico profundo, no urgente para SEO local                            |
| ART-011 | Sistemas RAG para empresas                     | Ídem                                                                             |
| ART-012 | Comparativa herramientas IA 2026 (pillar page) | Alto esfuerzo de investigación, mejor publicar con más artículos satélite listos |
| ART-013 | Embudo B2B con agentes de IA                   | Vertical B2B es prioridad 3                                                      |

### Productos y plantillas

| Entregable                                     | Descripción                                                   |
| ---------------------------------------------- | ------------------------------------------------------------- |
| Repositorio base landing corporativa           | Template Astro plug & play para despliegue rápido de clientes |
| Repositorio base e-commerce liviano            | Catálogo + carrito WhatsApp listo para configurar por JSON    |
| Repositorio base landing + chatbot             | Producto de mayor ticket, listo para deploy                   |
| Casos de uso ficticios (clínica, inmobiliaria) | Demos desplegadas con templates para mostrar al prospecto     |

### Desarrollo de módulos (fases 4–8 del roadmap consolidado)

| Módulo                | Fase   |
| --------------------- | ------ |
| Carrito WhatsApp      | Fase 4 |
| Stock e inventario    | Fase 5 |
| CRM + seguimiento     | Fase 6 |
| Sistema de turnos     | Fase 7 |
| Dashboard de métricas | Fase 8 |

### Pauta y adquisición

| Entregable                                               | Fase                              |
| -------------------------------------------------------- | --------------------------------- |
| Campaña Instagram stories + WhatsApp                     | Fase 9.1                          |
| Landing de oferta ARS 20.000 con formulario              | Tarea 1.2 del roadmap consolidado |
| Definición de canal de pauta (Instagram/Google/LinkedIn) | Por definir                       |

### Contenido de autoridad técnica (largo plazo)

| Artículo                                                                    | Foco                                |
| --------------------------------------------------------------------------- | ----------------------------------- |
| Arquitectura y redes de datos (OSI, TCP/IP → microservicios)                | Posicionamiento ante pares técnicos |
| Bases de datos: de la teoría a la escala (ER, normalización, CAP, sharding) | Autoridad arquitectónica            |

Estos artículos posicionan ante audiencia técnica, no ante clientes B2B directos. Se priorizan después de que el embudo comercial esté generando tráfico.

---

## Flujo de trabajo por artículo

Para cada artículo de blog, el proceso de producción es:

1. **Investigación y borrador:** redacción del contenido completo con foco en el dolor del segmento target.
2. **Estructura MDX:** aplicar frontmatter según schema Zod + estructura estándar (intro → problema → contexto → solución → resultado → CTA).
3. **Revisión editorial:** verificar que todo el contenido original esté presente, con estructura y jerarquía editorial correctas. No resumir ni recortar.
4. **CTA y links internos:** conectar con el servicio correspondiente + links a artículos relacionados.
5. **Data sync:** agregar entrada en `articles.json` del chatbot.
6. **Verificación:** confirmar que aparece en `/blog`, en el sitemap y que el chatbot lo conoce.

---

## Métricas de éxito del ciclo

| Métrica                          | Valor objetivo                                   |
| -------------------------------- | ------------------------------------------------ |
| Tarjetas de servicios publicadas | 7 (todas)                                        |
| Artículos de blog nuevos         | 8                                                |
| Proyectos en talento             | 4                                                |
| Chatbot alineado con contenido   | 100% de servicios y artículos reflejados en JSON |
| JSON-LD implementado             | Blog (Article) + servicios (Service)             |
| Google Business Profile          | Verificación iniciada                            |
| Sitemap actualizado              | Todas las URLs nuevas incluidas                  |

Al cierre de la semana 4, el sitio tiene contenido suficiente para: recibir tráfico orgánico, demostrar seniority técnico, soportar conversaciones del chatbot con información completa, y servir como base para activar pauta publicitaria.
