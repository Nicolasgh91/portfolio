# Nav

**Ruta:** `src/components/Nav.astro`

**Usado en:** `index.astro`, `servicios.astro`, `talento.astro`, `blog/index.astro`, `blog/[slug].astro`, `blog/categoria/[category].astro`, `blog/etiqueta/[tag].astro`, `oferta/menu-digital.astro`, `oferta/hub-creadores.astro`, `dev/component-scripts-audit.astro`

## Props

| Prop         | Tipo                                           | Requerida | Descripción                                                |
| ------------ | ---------------------------------------------- | --------- | ---------------------------------------------------------- |
| `activePage` | `'home' \| 'servicios' \| 'talento' \| 'blog'` | No        | Resalta pestaña y `aria-current="page"`; default `'home'`. |

## Comportamiento

- Navegación principal: logo, enlaces (Inicio, Servicios B2B con submenú anclado a `/servicios#…` — p. ej. `#agentes-ia`, `#ecommerce`, `#automatizacion`; el ítem “Sitios web” enlaza a `/plantillas`, Blog, Perfil), CTA "Diagnóstico gratis".
- **Tema:** botón que llama `nhTheme.toggle()` (definido en `Layout.astro`): alterna clase `light` en `<html>` y persiste en `localStorage`.
- **Idioma:** el enlace navega a la ruta alterna de `locale-path.ts`; labels, aria y submenú se resuelven por `localeFromPathname`. `nhLang` queda como sincronizador de nodos `data-en` / `data-es` cuando la página ya cargó.
- **Accesibilidad desktop:** `nhA11y.togglePanel()` (botón `#a11y-btn`) abre/cierra `#a11y-panel` horizontal bajo el header. El panel controla escala de fuente, contraste y movimiento.
- **Accesibilidad mobile:** dentro del drawer, el botón `☰ Accesibilidad` abre un panel inline (`#drawer-a11y-panel`) con los 3 grupos de controles (fuente, contraste, movimiento) usando los mismos handlers `nhA11y.set*` de Layout.
- Variante mobile: menú hamburguesa que abre un drawer con enlaces, controles (tema/idioma + panel inline de accesibilidad), CTA completo e **íconos sociales** (GitHub, LinkedIn, X, Instagram).
- **Drawer mobile — fondo:** `.nav-drawer` usa capa propia con alfa **0.92**: dark `hsla(240, 10%, 6%, 0.92)`, light `hsla(0, 0%, 100%, 0.92)` vía `:root.light`. No emplea `--nav-bg` para no acoplar el drawer al glass de `.nav` ni tocar el token global.
- **Drawer mobile — scroll:** si el menú está abierto y `window.scrollY > 10`, el drawer se cierra por completo (misma rutina que `Escape` y click en links del drawer), patrón habitual en apps móviles.
- **Dropdown servicios (click en el botón):** alterna abrir/cerrar con `if (servicesMenu?.hasAttribute("hidden")) { openServices(); } else { closeServices(); }`. Se evita un ternario como sentencia suelta porque `@typescript-eslint/no-unused-expressions` lo rechaza (valor del ternario descartado).
- **Keyboard nav — dropdown servicios:** `ArrowUp`/`ArrowDown` para navegar ítems, `Escape` para cerrar y devolver foco al botón, `Tab` para cerrar y continuar.
- **Keyboard nav — drawer mobile:** `Escape` cierra el drawer y devuelve foco al burger. Links dentro del drawer cierran el drawer al hacer click.

## Decisiones de diseño

- Enlaces desktop "siempre en el DOM" para SEO aunque el menú móvil esté colapsado.
- Submenú de servicios como `role="menu"` con botón chevron separado del enlace principal.
- En mobile, los controles a11y se renderizan inline dentro del drawer para mantener contexto y evitar abrir un panel externo fuera del flujo del menú.
- El drawer declara su propio fondo (0.92 dark/light) en lugar de `--nav-bg`, para opacidad consistente en el panel sin alterar el glass de `.nav`.
- Hover individual con fondo translúcido por tab (`--nav-tab-hover-bg` / `--nav-tab-active-bg`) — estilo Vercel/Linear.
- CTA desktop y móvil: clases globales `btn-primary btn-primary--sm btn-primary--glow` (móvil añade `btn-primary--compact`). Glow, sombras dark y animación `btn-cta-pulse` viven en `tokens.css` (`.btn-primary--glow`), con `prefers-reduced-motion: reduce` y `:root.no-motion` sin pulso.
- CTA del drawer: `btn-primary btn-primary--lg w-full` (+ utilidades Tailwind de margen/peso).
- `display: contents` en `<li>` para preservar layout flex — riesgo conocido en VoiceOver Safari < 16 (semántica `listitem` perdida); mitigado con `role="list"` explícito.

## Deuda técnica conocida

- Bloque `<style>` scoped extenso (~517 líneas). Ver `tasks/tech_debt.md` para items específicos y la excepción de migración a Tailwind.
- Mantener sincronizados labels ES/EN de accesibilidad, CTA y submenú cuando cambien las rutas o el copy global.

## Estado

Documentado — Última auditoría: 2026-04-14
