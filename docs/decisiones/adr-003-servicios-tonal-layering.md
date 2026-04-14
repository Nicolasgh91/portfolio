# ADR-003 — Catálogo /servicios: capas tonales y glass solo en oscuro

- **Fecha:** 2026-04-05
- **Estado:** Aceptado

## Contexto

Las tarjetas del catálogo (`ServiceCard`) compartían con la franja del listado el mismo token de fondo (`--bg-secondary`). En modo claro el contraste era casi nulo y la delimitación dependía casi solo del borde. Se evaluó aplicar **glass** (`--bg-card` + `backdrop-filter`) de forma uniforme en ambos temas.

## Decisión

1. **Tonal layering (inspirado en surface containers):** introducir `--bg-surface-container-low` (franja padre del catálogo) y `--bg-surface-container-lowest` (base opaca de la tarjeta en claro), con valores distintos en `:root` y `:root.light` derivados del ramp existente (`--bg-primary` / `--bg-secondary` / `--bg-tertiary`).
2. **Glass solo con tema oscuro:** la clase **`.service-card-shell-bg`** en `tokens.css` aplica `background-color: var(--bg-card)` y `blur(12px)` únicamente bajo **`:root:not(.light)`**, alineado con `nhTheme` y con el resto del sitio que no usa `dark:` de Tailwind de forma fiable (`html` conserva `class="dark"` en ambos temas).
3. **Pie “Consultar”:** mismo escalón tonal que la franja (`--bg-surface-container-low`), sin opacidad `/95` sobre `--bg-tertiary`.
4. **Micro-interacción:** `transition-all duration-200 ease-out` y `will-change-transform` en el shell (con `motion-reduce:will-change-auto` / transiciones reducidas).

## Alternativas descartadas

| Alternativa | Motivo |
|-------------|--------|
| Glass también en modo claro | Sobre fondos claros el blur apenas se percibe; no mejora la jerarquía frente a dos capas opacas bien separadas. |
| Solo subir el borde / sombra sin capas | Mejora marginal; no resuelve el “mismo blanco sobre blanco” del catálogo en light. |
| Reorganizar el catálogo en layout tipo **bento** | Mayor refactor de layout y contenido; fuera del alcance de endurecer lectura y consistencia con la home. |

## Consecuencias

### Positivas

- Contraste predecible entre franja y tarjeta en light; vidrio visible en dark sin duplicar lógica con `dark:` de Tailwind.
- Tokens reutilizables si otras vistas necesitan la misma jerarquía de superficie.

### Negativas

- Una clase de componente global (`.service-card-shell-bg`) acoplada al catálogo; cambios de tema deben revisar `:root:not(.light)` y `:root.light`.

## Señal para reabrir

Reevaluar si se unifica el contrato de tema en `html` (p. ej. quitar `dark` fijo o adoptar `dark:` de forma consistente) o si se introduce un sistema de elevación/sombras compartido en todo el marketing site.
