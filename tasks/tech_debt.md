# Technical Debt

## Nav.astro

- [ ] **CSS scoped (~517 líneas):** migrar a Tailwind atómico. Excepción documentada 2026-03-25 — el componente mezcla pseudo-elementos, keyframes y media queries que hacen inviable la migración parcial.
- [ ] **Animación drawer rota (P0):** `display: none → display: flex` no es animable; la transición de `opacity`/`transform` nunca se ejecuta. Fix: `visibility` + `pointer-events` + `opacity`.
- [ ] **backdrop-filter duplicado:** `blur(12px)` en `.nav`, `.nav-drawer` y `.a11y-panel`. Con drawer abierto hay dos capas de blur simultáneas en mobile.
- [ ] **translateY(-1px) innecesario:** hover de `.ctrl-btn` y `.a11y-btn` fuerza layer promotion imperceptible en 32px.
- [ ] **Variables `:root` escapan scope:** L297–304 usan `:root`/`:root.light` dentro de `<style>` scoped pero Astro no aplica scope a `:root`. Mover a `tokens.css` con `--nav-*`.
- [ ] **onclick inline acoplado a globals:** botones de tema/idioma/a11y dependen de `window.nh*`; migrar a `addEventListener` en `<script>`.
- [ ] **Panel a11y dentro de `<header>`:** semánticamente no es parte de la nav. Extraer a `A11yPanel.astro` o mover a Layout.
- [ ] **SVG sociales inline:** 4 íconos (~80 líneas). Extraer a componente o loop.
- [ ] **Radius parciales en dropdown:** contradicen plan de refactoring que decía pill radius independiente.

> **Regla:** Extraer dropdown a sub-componente genérico (`NavDropdown.astro`) **antes** de agregar cualquier nuevo dropdown al nav.
