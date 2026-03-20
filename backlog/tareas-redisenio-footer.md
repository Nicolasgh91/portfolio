# Tareas técnicas — Implementación del footer rediseñado

## FASE 1 — Esquema (schema)

### FT-01 · Extender tokens.css con tokens del footer
**Archivo:** `src/styles/tokens.css`
**Descripción:** El diseño introduce patrones visuales nuevos (pre-footer CTA, glow decorativo,
stack pills) que necesitan tokens propios para no usar valores hardcodeados.
**Tokens a agregar:**
- `--footer-bg: var(--bg-primary)` (mapear, no duplicar)
- `--footer-card-bg: var(--bg-secondary)` (mapear a `#141414` equivalente)
- `--footer-glow-size: 280px`
- `--footer-col-gap: 40px`
**Criterio de aceptación:** Ningún valor de color o spacing en `Footer.astro` es un literal
hexadecimal o px fijo; todos referencian tokens.

---

## FASE 2 — Lógica de flujo

### FT-02 · Definir fuente de datos del stack tecnológico
**Archivo:** `public/chatbot/data/config.json` (existente) o nuevo
`src/data/site.json`
**Descripción:** El stack del footer (`Python`, `Astro`, etc.) debe provenir de una única
fuente de verdad. Evaluar si ya existe en `config.json`; si no, agregar una clave `stack[]`
en el archivo de datos apropiado.
**Criterio de aceptación:** El arreglo de tecnologías se lee en build-time desde un JSON;
no hay strings hardcodeados en el componente.

### FT-03 · Definir datos de redes sociales
**Archivo:** `src/data/site.json` (o `config.ts` si se agrega como constante de Astro)
**Descripción:** URLs reales de GitHub, Twitter/X, Instagram, LinkedIn. Estas deben
coincidir con los `sameAs` del JSON-LD en `Layout.astro`.
**Criterio de aceptación:** Un cambio de URL social se hace en un único lugar y se refleja
tanto en el footer como en el JSON-LD.

---

## FASE 3 — Componente (container)

### FT-04 · Crear `Footer.astro` como componente autónomo
**Archivo:** `src/components/Footer.astro` (nuevo)
**Descripción:** Extraer el footer de `Layout.astro` a su propio componente.
Implementar el diseño con las siguientes restricciones:
- **Cero CSS vanilla**: todo en clases Tailwind o tokens CSS vía `style=""` con variables.
- **Fuentes**: usar `font-display` (`Outfit`) para el título CTA y logo; `font-body` (`Inter`)
  para el resto. Eliminar `Syne` y `DM Sans`.
- **Semántica**: envolver en `<footer role="contentinfo" aria-label="Pie de página">`.
- **Glow decorativo**: implementar como `<div>` con clases Tailwind
  `absolute -top-20 -right-20 w-[280px] h-[280px] rounded-full
  bg-[radial-gradient(...)] pointer-events-none` + `aria-hidden="true"`.
- **Ícono social**: cada `<a>` debe tener `aria-label="Perfil en [red]"`.
- **Email**: renderizar como `<a href="mailto:...">` generado desde la fuente de datos,
  no como texto literal.
- **Botón CTA**: debe ser `<a href="/contacto">` o anchor a `#contacto`, no `<button>` sin href.
- **Soporte `reduced-motion`**: envolver transiciones en
  `@media (prefers-reduced-motion: no-preference)` o via clase Tailwind `motion-safe:`.

### FT-05 · Integrar `Footer.astro` en `Layout.astro`
**Archivo:** `src/layouts/Layout.astro`
**Descripción:** Importar y renderizar `<Footer />` dentro del `<body>`, antes del cierre
`</body>` y después del `<slot />`. El footer debe ser parte del layout global para
garantizar presencia en todas las rutas.
**Criterio de aceptación:** Footer visible en `/`, `/servicios`, `/blog`, `/talento`.

---

## FASE 4 — API / SEO

### FT-06 · Sincronizar redes sociales con JSON-LD en `Layout.astro`
**Archivo:** `src/layouts/Layout.astro`
**Descripción:** El array `sameAs` del schema `Person` debe leer las mismas URLs que
`FT-03` define como fuente de verdad. Eliminar los `href="#"` placeholder del footer.
**Criterio de aceptación:** `sameAs` en JSON-LD y `href` del footer apuntan a las mismas
URLs; sin valores `#`.

### FT-07 · Agregar structured data `SiteNavigationElement` para links del footer
**Archivo:** `src/layouts/Layout.astro` (slot `head`) o `Footer.astro`
**Descripción:** Los bloques de links (Servicios, Recursos, Contacto) son candidatos a
`SiteNavigationElement` en Schema.org, lo que mejora la comprensión de estructura por
parte de Google.
**Criterio de aceptación:** JSON-LD válido verificado con el Rich Results Test de Google.

---

## FASE 5 — UI / QA

### FT-08 · Validar contraste en modo light
**Descripción:** El diseño está concebido 100% en dark. Verificar que cada token mapeado
produce contraste WCAG AA en modo `:root.light`. Especial atención a:
- Texto `.text-muted` equivalente sobre `--bg-secondary` en light.
- Badges "Nuevo" / "Gratis" con `--accent-bg` y `--accent-text` en light.
**Herramienta:** Axe DevTools o WebAIM Contrast Checker.
**Criterio de aceptación:** Ratio mínimo 4.5:1 para texto normal, 3:1 para texto grande.

### FT-09 · Validar responsive en breakpoints del proyecto
**Descripción:** El diseño tiene un breakpoint en 700px. El proyecto usa Tailwind; alinear
a los breakpoints estándar (`sm: 640px`, `md: 768px`). Ajustar la grilla de 4 columnas:
- `≥ md`: `grid-cols-4`
- `< md` y `≥ sm`: `grid-cols-2`
- `< sm`: `grid-cols-1` con brand col completa arriba.
**Criterio de aceptación:** Sin overflow horizontal en viewport de 375px.

### FT-10 · Smoke test de performance post-deploy
**Descripción:** Correr Lighthouse en la rama de staging después de integrar el footer.
Verificar que LCP no regresa con respecto a la línea base por la carga de fuentes.
**Criterio de aceptación:** LCP ≤ valor base ± 200 ms. Si se detecta regresión, activar
`font-display: optional` o mover a `next/font` equivalente en Astro.