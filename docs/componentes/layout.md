# Layout

**Ruta:** `src/layouts/Layout.astro`

**Usado en:** Todas las páginas Astro bajo `src/pages/` que envuelven contenido del sitio.

## Props

| Prop            | Tipo               | Requerida | Descripción                                  |
| --------------- | ------------------ | --------- | -------------------------------------------- |
| `title`         | `string`           | Sí        | `<title>` y Open Graph / Twitter.            |
| `description`   | `string`           | Sí        | Meta description y OG/Twitter.               |
| `titleEn`       | `string`           | No        | Variante inglesa de `<title>` y OG/Twitter.  |
| `descriptionEn` | `string`           | No        | Variante inglesa de meta description.        |
| `lang`          | `'es' \| 'en'`     | No        | `lang` del `<html>`; default `'es'`.         |
| `ogImage`       | `string`           | No        | Ruta OG; default `/og-desktop.png`.          |
| `ogImageType`   | `string`           | No        | MIME OG; si falta, se infiere por extensión. |
| `ogImageWidth`  | `string \| number` | No        | Default 1366.                                |
| `ogImageHeight` | `string \| number` | No        | Default 768.                                 |

## Slots

| Slot    | Uso                                                                                                                         |
| ------- | --------------------------------------------------------------------------------------------------------------------------- |
| default | Cuerpo de la página.                                                                                                        |
| `head`  | JSON-LD extra, meta (`robots`, etc.), título no sustituye el del layout (el `<title>` está después del slot en el archivo). |

## Comportamiento

- Importa `tokens.css`, meta canonical, OG, Twitter, CSP (comentario SEC-005), hreflang, favicon, sitemap link.
- JSON-LD global: `Person` (datos desde `site.json`) y `ProfessionalService` con copy ES/EN según `localeFromPathname`.
- Script inline **en** `<head>` (antes del primer paint): anti-flash de tema (`nh-theme` + `prefers-color-scheme`), strip de `no-js`, y clase `no-motion` según `nh-reduced-motion` / `prefers-reduced-motion` (detalle en [`docs/README.md`](../README.md) y [`docs/scroll-reveal.md`](../scroll-reveal.md)).
- Body: skip link localizado, slot, `BackToTop`, `Footer`, Vercel Analytics + SpeedInsights.
- Scripts globales: `nhTheme`, `nhLang`, `nhA11y` (claves `localStorage`: ver [`docs/README.md`](../README.md)).
- Chatbot: script empaquetado por Astro (sin `define:vars` ni `is:inline`, compatible con CSP `script-src 'self'`) crea `<iframe src="/chatbot/widget/index.html">`, resuelve `title`/`aria-label` por `document.documentElement.lang`, redimensiona con `postMessage` (`chat: open/close`) y mantiene el click-outside-to-close en el mismo bloque para compartir estado del iframe.

## Decisiones de diseño

- `<html class="dark">` por defecto; modo claro vía clase `light` en `documentElement`.
- CSP vía headers en `vercel.json`; los scripts de interacción no deben depender de inline runtime salvo hashes explícitos.

## Deuda técnica conocida

- Listeners globales (`message`, `click`) para el iframe del chatbot en todas las páginas que usan Layout; deben permanecer junto al inyector para no perder el estado `chatOpen`.
- `GEMINI_API_KEY` se lee en frontmatter pero el uso principal del modelo está en el widget/API, no en el shell del layout (revisar si hace falta en layout).

## Estado

Documentado
