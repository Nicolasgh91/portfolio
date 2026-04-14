# Inventario de componentes, páginas, layouts, contenido y API

Generado a partir del árbol del repositorio el **2026-03-24**. Sin suposiciones: rutas y props tomadas del código.

## Convenciones

- **Props:** solo interfaces `Props` explícitas o comentario en frontmatter; `Astro.props` genérico se indica como *atributos HTML de tabla*.
- **Tipo:** extensión del archivo principal.

---

## `src/components/` (18 archivos únicos)

| Nombre | Ruta | Tipo | Props (resumen) | Usado en |
|--------|------|------|-----------------|----------|
| BackToTop | `src/components/BackToTop.astro` | astro | *(ninguna)* | `Layout.astro` |
| BlogCard | `src/components/BlogCard.astro` | astro | `post` (slug + data de blog: título, fechas, category, tags, vertical, readingTime, coverImageKey, coverAlt) | `blog/index.astro`, `blog/categoria/[category].astro`, `blog/etiqueta/[tag].astro` |
| CapabilityCard | `src/components/CapabilityCard.astro` | astro | `capability` (title, titleEn?, description, descriptionEn?, icon?, level?, tags?) | `talento.astro` |
| ContactForm | `src/components/ContactForm.astro` | astro | *(ninguna; usa `PUBLIC_WEB3FORMS_KEY`)* | `servicios.astro`, `oferta/menu-digital.astro` |
| FaqSection | `src/components/FaqSection.astro` | astro | `entries` (FaqItem[]), `ctaHref?` | `servicios.astro` |
| Footer | `src/components/Footer.astro` | astro | *(ninguna; `getCollection` servicios/blog)* | `Layout.astro` |
| HeroSection | `src/components/HeroSection.astro` | astro | *(ninguna)* | `index.astro` |
| Nav | `src/components/Nav.astro` | astro | `activePage?` (`'home' \| 'servicios' \| 'talento' \| 'blog'`) | `index.astro`, `servicios.astro`, `talento.astro`, `blog/index.astro`, `blog/[slug].astro`, `blog/categoria/[category].astro`, `blog/etiqueta/[tag].astro`, `oferta/menu-digital.astro`, `oferta/hub-creadores.astro`, `dev/component-scripts-audit.astro` |
| ProjectDemo | `src/components/ProjectDemo.astro` | astro | `src`, `title`, `poster?`, `width?`, `height?`, `autoplay?` | **Sin uso** en `src/pages` ni MDX (solo comentario de uso en el archivo) |
| SectionSpacer | `src/components/SectionSpacer.astro` | astro | `size?` (`sm \| md \| lg \| xl`) | `blog/[slug].astro` (default MDX), `content/blog/arquitectura-sistemas-gran-escala.mdx`, `content/blog/diseniar-microservicios.mdx` |
| ServiceCard | `src/components/ServiceCard.astro` | astro | `service` (título, descripciones cortas, roiFocus, href, imageKey, price, priceUnit, pricePrefix, featured, …) | `servicios.astro` |
| SlideViewer | `src/components/SlideViewer.astro` | astro | `src`, `alt`, `class?` | `blog/[slug].astro`, `dev/component-scripts-audit.astro` |
| TaxonomyFilter | `src/components/TaxonomyFilter.astro` | astro | `categories`, `tags?`, `activeCategory?`, `activeTag?` | `blog/index.astro`, `blog/categoria/[category].astro`, `blog/etiqueta/[tag].astro` |
| ArticleFooter | `src/components/blog/ArticleFooter.astro` | astro | `tags`, `category` | `blog/[slug].astro` |
| ShareBar | `src/components/blog/ShareBar.astro` | astro | `title`, `url` | `blog/[slug].astro`, `dev/component-scripts-audit.astro` |
| TableOfContents | `src/components/blog/TableOfContents.astro` | astro | `headings` (HeadingEntry[]) | `blog/[slug].astro`, `dev/component-scripts-audit.astro` |
| TableWrapper | `src/components/mdx/TableWrapper.astro` | astro | *spread `Astro.props` → atributos nativos de `<table>`* | `blog/[slug].astro` vía `Content components={{ table: TableWrapper }}` |

---

## `src/layouts/`

| Nombre | Ruta | Tipo | Props (resumen) | Usado en |
|--------|------|------|-----------------|----------|
| Layout | `src/layouts/Layout.astro` | astro | `title`, `description`, `lang?`, `ogImage?`, `ogImageType?`, `ogImageWidth?`, `ogImageHeight?` + slot `head` | Todas las páginas bajo `src/pages/*.astro` (incl. blog y oferta) |

---

## `src/pages/`

| Ruta URL | Archivo | Tipo | Notas |
|----------|---------|------|--------|
| `/` | `src/pages/index.astro` | astro | `Layout`, `Nav`, `HeroSection` |
| `/servicios` | `src/pages/servicios.astro` | astro | `Layout`, `Nav`, `ServiceCard`, `ContactForm`, `FaqSection` |
| `/talento` | `src/pages/talento.astro` | astro | `Layout`, `Nav`, `CapabilityCard` |
| `/blog` | `src/pages/blog/index.astro` | astro | `Layout`, `Nav`, `BlogCard`, `TaxonomyFilter` |
| `/blog/[slug]` | `src/pages/blog/[slug].astro` | astro | `getStaticPaths`; MDX + componentes blog |
| `/blog/categoria/[category]` | `src/pages/blog/categoria/[category].astro` | astro | `getStaticPaths` |
| `/blog/etiqueta/[tag]` | `src/pages/blog/etiqueta/[tag].astro` | astro | `getStaticPaths` |
| `/oferta/menu-digital` | `src/pages/oferta/menu-digital.astro` | astro | `Layout`, `Nav`, `ContactForm` |
| `/oferta/hub-creadores` | `src/pages/oferta/hub-creadores.astro` | astro | `Layout`, `Nav` |
| `/dev/component-scripts-audit` | `src/pages/dev/component-scripts-audit.astro` | astro | `noindex`; prueba SV-07 |
| *(endpoint XML)* | `src/pages/sitemap.xml.ts` | ts | `GET`; no es página HTML |

---

## `src/content/`

| Ruta | Tipo | Rol |
|------|------|-----|
| `src/content/config.ts` | ts | Colecciones Astro + Zod (`projects`, `services`, `blog`, `faq`) |
| `src/content/blog/*.mdx` | mdx | **5** entradas: `analista-funcional-era-ia`, `arquitectura-sistemas-gran-escala`, `caso-forestguard`, `diseniar-microservicios`, `ia-local-vs-cloud` |
| `src/content/services/*.mdx` | mdx | **5** entradas: `chatbots-ia`, `ecommerce-platforms`, `landing-page`, `local-llms`, `workflow-automation` |
| `src/content/projects/*.mdx` | mdx | **3** entradas: `chatbot-widget`, `double-click`, `huelladelfuego` |
| `src/content/faq/entries.json` | json | Datos FAQ (colección tipo `data`) |

---

## `api/`

| Ruta | Tipo | Rol |
|------|------|-----|
| `api/chat.js` | js | Handler Vercel; `export const config = { runtime: 'edge' }`; chat Gemini + rate limit |

---

## Rutas del sitio (detalle de renderizado)

Ver archivo dedicado: [`docs/inventario-rutas.md`](../../../docs/inventario-rutas.md) (rutas relativas desde repo: `docs/inventario-rutas.md`).
