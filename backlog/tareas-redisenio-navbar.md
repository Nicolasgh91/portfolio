# Tareas técnicas — rediseño navbar v2

## Estado actual
- [x] Nav.astro funcional con tabs, drawer, a11y panel, tema, idioma
- [ ] Dropdown de servicios
- [ ] Iconos sociales en drawer mobile
- [ ] Indicador activo visual mejorado

---

## NAV-001 — Migrar tokens de color del prototipo a variables semánticas
**Prioridad:** bloqueante  
**Archivo:** ninguno nuevo — es precondición de todas las tareas siguientes  
**Acción:** mapear cada valor hardcodeado del prototipo a su equivalente en `tokens.css`:

| Prototipo         | Token del proyecto         |
|-------------------|----------------------------|
| `#0e0e0e`         | `--bg-primary`             |
| `#f0a500`         | `--accent`                 |
| `#888`            | `--nav-text-idle`          |
| `#f5f5f0`         | `--nav-logo-color`         |
| `#141414`         | `--bg-secondary`           |
| `#252525`         | `--border-subtle`          |
| `rgba(14,14,14,0.85)` | `--nav-bg`            |
| `#1e1e1e`         | `--nav-border`             |

**Criterio de aceptación:** ningún color hexadecimal hardcodeado en el componente final.

---

## NAV-002 — Implementar dropdown de servicios accesible
**Prioridad:** alta  
**Archivo:** `src/components/Nav.astro`  
**Acción:**
1. Reemplazar el tab "Servicios B2B" por un `<button>` con `aria-haspopup="true"` y `aria-expanded="false"`.
2. El panel del dropdown debe ser un `<div role="menu">` con `<a role="menuitem">` para cada servicio.
3. Cada `<a>` debe apuntar a su ruta real: `/servicios#agentes-ia`, `/servicios#ecommerce`, `/servicios#automatizacion`, `/servicios#landing`.
4. Añadir al bloque `<script>` los listeners: click en el botón togglea `aria-expanded`, click-outside cierra, `Escape` cierra y devuelve foco al trigger.
5. Los iconos del dropdown deben ser SVG inline o emojis con `aria-hidden="true"` + texto visible, nunca solo emoji sin texto.

**Criterio de aceptación:** navegable completo con teclado (Tab, Enter, Escape, flechas). No usar CSS `:hover` como único mecanismo de apertura.

---

## NAV-003 — Ajustar animación del CTA para respetar `prefers-reduced-motion`
**Prioridad:** alta  
**Archivo:** `src/components/Nav.astro`  
**Acción:**
1. Añadir el elemento visual del pulso del CTA (si se adopta del prototipo).
2. Envolver el `@keyframes` en `@media (prefers-reduced-motion: no-preference)`.
3. Exponer una clase `.no-motion` desde `nhA11y.setReducedMotion()` que también detenga la animación vía CSS.

**Criterio de aceptación:** con movimiento reducido activado, el CTA no anima. Con movimiento normal, el pulso es visible.

---

## NAV-004 — Añadir iconos de redes sociales al drawer mobile
**Prioridad:** media  
**Archivo:** `src/components/Nav.astro`  
**Acción:**
1. Añadir al footer del `.nav-drawer` una fila de iconos sociales (GitHub, LinkedIn, X/Twitter, Instagram).
2. Usar SVG inline con `aria-label` en cada `<a>`. No usar fuentes de iconos.
3. Los SVG deben tener `aria-hidden="true"` y el `<a>` debe tener el `aria-label` descriptivo.
4. Colores tomados de `--nav-text-idle` con hover a `--accent`.

**Criterio de aceptación:** iconos visibles en vista mobile, invisible en desktop. Links abren en `target="_blank" rel="noopener noreferrer"`.

---

## NAV-005 — Mejorar indicador de página activa con punto animado
**Prioridad:** baja  
**Archivo:** `src/components/Nav.astro`  
**Acción:**
1. Añadir un `<span aria-hidden="true">` de 4px circular debajo del tab activo, coloreado con `--accent`.
2. Su aparición debe ser una transición `opacity` (no `display`).
3. Debe respetar `prefers-reduced-motion` (sin transición si está activo).

**Criterio de aceptación:** el punto aparece únicamente en el tab con `aria-current="page"`.

---

## NAV-006 — Corregir `role="dialog"` en el drawer mobile
**Prioridad:** alta  
**Archivo:** `src/components/Nav.astro`  
**Acción:** Reemplazar `role="dialog"` por la ausencia de `role` (el contexto semántico lo provee el `<header>` y el `<nav>` padre). Alternativamente, si se quiere ser explícito, usar `role="navigation"` con un `aria-label` distinto al del `<nav>` principal.

**Criterio de aceptación:** validación con axe DevTools sin errores de role incorrecto.

---

## Orden de ejecución

NAV-001 → NAV-006 → NAV-002 → NAV-003 → NAV-004 → NAV-005