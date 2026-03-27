# Roadmap — Sistema de landing templates replicables

*Proyecto: escalatunegocioconia.com × remix-of-personal-blog*
*Última actualización: 2026-03-27*

---

## Estado actual

| Componente | Estado |
|---|---|
| `src/content/services/landing-page.mdx` | ✅ Existe y tiene `href: "/catalogo-de-landings"` |
| `ServiceCard.astro` | ✅ Maneja `href` condicional (`<a>` vs `<div>`) |
| `src/pages/catalogo-de-landings.astro` | ✅ Creada y conectada a datos |
| `src/data/landing-templates.ts` | ✅ SSOT de templates (sin lógica de env en módulo) |
| `src/pages/sitemap.xml.ts` | ✅ Incluye `/catalogo-de-landings` |
| `remix-of-personal-blog` (repo) | ✅ Clonado, build validado y deployado |
| `demo.escalatunegocioconia.com` | ✅ Configurado con HTTPS + alias operativo |

---

## Fase 0 — Preparación (sin código)

| # | Tarea | Responsable | Entregable |
|---|---|---|---|
| 0.1 | Clonar `remix-of-personal-blog` localmente y correr `npm install && npm run build` | Dev | Build sin errores confirmado |
| 0.2 | Verificar si `lovable-tagger` en `vite.config.ts` tiene guard de entorno | Dev | Si no tiene → removerlo de `devDependencies` y del config |
| 0.3 | Crear `public/robots.txt` en el repo del template con `Disallow: /` | Dev | Archivo commiteado |
| 0.4 | Agregar `<meta name="robots" content="noindex, nofollow">` en `index.html` del template | Dev | HTML actualizado |

**Estado:** ✅ Completada.

**Criterio de salida (ejecutable):**
- `npm run build` produce `/dist` sin errores de tipos.
- Si aparece warning de chunk >500 KB, ejecutar diagnóstico obligatorio del módulo causante con `npx vite-bundle-visualizer` (o build verbose) antes de continuar al deploy.

---

## Fase 1 — Conexión en `escalatunegocioconia.com`

| # | Tarea | Archivo | Detalle |
|---|---|---|---|
| 1.1 | Verificar campo `href` en schema Zod | `src/content/config.ts` | Confirmar `href: z.string().optional()` en colección `services` |
| 1.2 | Agregar `href` al frontmatter | `src/content/services/landing-page.mdx` | `href: "/catalogo-de-landings"` |
| 1.3 | Verificar manejo condicional de `href` | `src/components/ServiceCard.astro` | Si `href` existe → tarjeta envuelta en `<a>`. Si no → `<div>` |
| 1.4 | Crear página de catálogo | `src/pages/catalogo-de-landings.astro` | Ver spec en arquitectura. URL demo via variable de entorno |
| 1.5 | Agregar variable de entorno local | `.env` / `.env.local` | `PUBLIC_DEMO_LANDING_URL=http://localhost:5173` |
| 1.6 | Agregar variable en Vercel | Dashboard Vercel → env vars | `PUBLIC_DEMO_LANDING_URL=https://demo.escalatunegocioconia.com` |

**Estado:** ✅ Completada.

**Notas de implementación:**
- La página `catalogo-de-landings.astro` no contiene array embebido; consume `src/data/landing-templates.ts`.
- La resolución de `PUBLIC_DEMO_LANDING_URL` se hace en la página (no en el módulo de datos).

**Criterio de salida:** navegar `/servicios` → click en tarjeta "Landing page" → llega a `/catalogo-de-landings` → el enlace a la demo funciona en local (localhost:5173).

---

## Fase 2 — Deploy del template

| # | Tarea | Herramienta | Detalle |
|---|---|---|---|
| 2.1 | Crear proyecto en Vercel | Dashboard Vercel | Importar repo `Nicolasgh91/remix-of-personal-blog`. Framework: Vite. Output: `dist` |
| 2.2 | Verificar deploy exitoso | Vercel | URL temporal `*.vercel.app` funcional |
| 2.3 | Configurar dominio `demo.escalatunegocioconia.com` | Vercel → Domains | Agregar dominio al proyecto del template |
| 2.4 | Agregar CNAME en DNS | Panel DNS del registrador | `demo` → `cname.vercel-dns.com` |
| 2.5 | Verificar SSL y propagación | Browser | `https://demo.escalatunegocioconia.com` sin warnings |

**Estado:** ✅ Completada.

**Validaciones registradas:**
- `https://demo.escalatunegocioconia.com` operativo.
- `robots.txt` de demo en `Disallow: /`.
- HTML con `<meta name="robots" content="noindex, nofollow">`.

**Criterio de salida:** el subdominio resuelve correctamente con HTTPS.

---

## Fase 3 — Documentación y talento

| # | Tarea | Archivo | Detalle |
|---|---|---|---|
| 3.1 | Crear caso de talento PRJ-002 | `src/content/projects/menu-digital-viandas.mdx` | Según spec en `tareas-contenido.md`. Incluir link al deploy |
| 3.2 | Actualizar `public/chatbot/data/articles.json` | `articles.json` | Ver decisión explícita debajo |

**Estado:** 🟡 Parcial.
- 3.1 ✅ completada.
- 3.2 ❌ descartada por decisión arquitectónica (no corresponde mezclar tipos de contenido).

### 3.2 — Actualizar `articles.json` del chatbot
**Estado:** descartado.  
**Razón:** `articles.json` alimenta recomendaciones de artículos de blog. Los templates son un tipo de dato distinto. Agregar un template en ese índice contaminaría la fuente de datos del chatbot con contenido heterogéneo.  
**Sustituto futuro:** cuando el chatbot deba recomendar templates, crear `public/chatbot/data/templates.json` y actualizar `buildSystemPrompt()` en `api.js` para consumirlo. Registrar esa tarea en `docs/deuda-tecnica.md` cuando sea el momento.

---

## Fase 4 — Escalabilidad: primer cliente real

*Esta fase se activa cuando el primer cliente contrate el servicio de landing.*

| # | Tarea | Detalle |
|---|---|---|
| 4.1 | Fork del template en repo del cliente | `github.com/[cliente]/landing-[negocio]` o repo privado propio |
| 4.2 | Personalizar datos en el fork | Ver sección "Variables de personalización" en arquitectura |
| 4.3 | Deploy en Vercel como proyecto nuevo | Un proyecto Vercel por cliente. Costo: $0 en Hobby |
| 4.4 | Dominio del cliente | Subdominio del cliente o dominio propio — configuración CNAME idéntica a fase 2 |
| 4.5 | Cambiar `robots.txt` a `Allow: /` | Solo cuando el contenido sea real y el cliente quiera indexación |
| 4.6 | Documentar en talento | Nuevo MDX en `src/content/projects/` con el caso del cliente |

---

## Resumen visual

```
Fase 0 ──── Fase 1 ──── Fase 2 ──── Fase 3 ──── Fase 4 (por cliente)
 Build ok    Astro        Deploy      Talento      Fork → personalizar
 robots.txt  conectado    subdominio  PRJ-002      → deploy → dominio
```

---

## Deuda técnica a monitorear

- **Bundle size del template:** si en el futuro el template crece y supera 500 KB en algún chunk, implementar `React.lazy()` + `Suspense` por ruta.
- **`lovable-tagger`:** si se actualiza el template desde Lovable, verificar que el plugin no haya vuelto a agregarse sin guard de entorno.
- **Tokens de diseño:** no sincronizar manualmente entre Astro y Vite. Si se necesita consistencia visual cross-proyecto, evaluar paquete npm privado en fase 10+.
