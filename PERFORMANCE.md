# Performance & Accessibility Guidelines

Documento de referencia para mantener un score Lighthouse **90+ Performance** y **95+ Accessibility**.
Antes de cada PR, verificar que no se introduzcan regresiones en estos puntos.

---

## Métricas objetivo

| Métrica | Target | Notas |
|---------|--------|-------|
| Performance | 90+ | Correr Lighthouse en incógnito (sin extensiones) |
| FCP | < 1.2s | First Contentful Paint |
| LCP | < 1.5s | Largest Contentful Paint |
| TBT | < 300ms | Total Blocking Time — el más impactante |
| CLS | < 0.1 | Cumulative Layout Shift |
| SI | < 1.5s | Speed Index |
| Accessibility | 95+ | WCAG AA mínimo |

---

## Checklist para nuevas features

### Fonts
- **Nunca** usar `@import` para fuentes en CSS. Genera cadenas de carga bloqueantes (HTML → CSS → font).
- Declarar `@font-face` inline en `tokens.css` con `font-display: swap`.
- Solo incluir los subsets necesarios (`latin` + `latin-ext` para ES/EN).
- Si se agrega una nueva fuente, considerar si realmente es necesaria. Cada fuente variable pesa ~30-50 KiB.

### JavaScript
- **Diferir todo lo no crítico.** Usar `requestIdleCallback` o `setTimeout` para widgets, analytics y scripts que no afectan el first paint.
- Evitar scripts `is:inline` grandes. Si supera ~20 líneas, considerar moverlo a un módulo con `defer`.
- El script de tema anti-FOUC debe seguir siendo síncrono e inline (es el único caso justificado).
- Para iframes pesados (ej: chatbot), siempre lazy-load tras el load principal.

### CSS Animations
- **Solo animar propiedades GPU-compositable:** `transform`, `opacity`.
- **Nunca animar en keyframes infinitos:** `box-shadow`, `border-color`, `color`, `background-color`, `width`, `height`, `top/left`.
- Las transiciones cortas (< 200ms) en hover para `border-color`/`color` son aceptables.
- Para efectos tipo "pulse", usar un pseudo-element (`::after`) que anime `opacity` + `transform`.
- Respetar siempre `prefers-reduced-motion: reduce`.

#### Propiedades compositable vs no-compositable

| GPU-compositable (usar) | No-compositable (evitar en loops) |
|--------------------------|-----------------------------------|
| `transform` | `box-shadow` |
| `opacity` | `border-color` / `border-width` |
| `filter` | `color` / `background-color` |
| `clip-path` | `width` / `height` |
| | `top` / `left` / `right` / `bottom` |
| | `margin` / `padding` |

### Imágenes
- Usar siempre el componente `<Image>` de Astro para optimización automática.
- Formato WebP preferido.
- Setear `width` y `height` explícitos para evitar CLS.
- Usar `loading="lazy"` para imágenes below-the-fold.
- No usar `loading="lazy"` en la imagen LCP (above-the-fold).

### Heading Hierarchy
- Mantener la secuencia: `H1` → `H2` → `H3` → `H4`. Nunca saltear niveles.
- Solo un `H1` por página.
- Si un heading necesita ser visualmente más chico, usar CSS (`font-size`) en vez de bajar el nivel semántico.

### Color Contrast
- **WCAG AA mínimo:** ratio 4.5:1 para texto normal, 3:1 para texto grande (18px+ o 14px+ bold).
- `--text-muted` en light mode: no bajar de `hsl(240, 6%, 42%)` sobre fondos claros.
- Verificar contraste con: [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/).
- En dark mode, `--text-secondary` (60% lightness) ya cumple contra `--bg-primary` (6% lightness).

---

## Decisiones de arquitectura actuales

### Font loading
Las fuentes Inter Variable y Outfit Variable se cargan con `@font-face` inline en `tokens.css` con `font-display: swap`, usando solo subsets `latin` y `latin-ext`. Esto elimina la cadena de carga `@import` que agregaba ~300ms al critical path.

### Chat widget
El iframe del chatbot se inicializa con `requestIdleCallback` (fallback: `setTimeout 3500ms`) para no competir con el rendering inicial. Esto elimina ~530ms de long tasks del TBT.

### CTA pulse animation
Usa un pseudo-element `::after` con `opacity` + `transform` (GPU-compositable) en vez de animar `box-shadow` directamente.

---

## Cómo verificar

```bash
# Build local
npm run build

# Preview
npm run preview

# Lighthouse CLI (requiere Chrome)
npx lighthouse http://localhost:4321 --only-categories=performance,accessibility --chrome-flags="--headless"
```

Siempre correr Lighthouse en **modo incógnito** o con `--chrome-flags="--headless"` para evitar que extensiones contaminen los resultados.
