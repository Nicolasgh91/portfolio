# LiquidGlassMarquee

## Ruta

- `src/components/LiquidGlassMarquee.astro`

## Descripción

Contenedor visual estilo liquid glass para el stack tecnológico en `/talento`. Renderiza un marquee de texto plano no interactivo, con fondo mesh por tema, blur de cristal y pausa de animación cuando el sitio está en modo reduced motion.

## Props

| Prop      | Tipo       | Default                  | Descripción                                                    |
| --------- | ---------- | ------------------------ | -------------------------------------------------------------- |
| `items`   | `string[]` | —                        | Lista de tecnologías mostradas en el marquee.                  |
| `label`   | `string`   | `"Stack y herramientas"` | Label superior izquierdo en español.                           |
| `labelEn` | `string`   | `"Stack & tools"`        | Label equivalente en inglés (`data-en`).                       |
| `speed`   | `number`   | `22`                     | Duración del ciclo completo (`liquidGlassScroll`) en segundos. |
| `class`   | `string`   | `""`                     | Clase adicional para el contenedor externo.                    |

## Tokens CSS consumidos

Definidos en `src/styles/tokens.css` dentro de `@layer components`:

- `--lg-bg`
- `--lg-border`
- `--lg-backdrop`
- `--lg-shadow`
- `--lg-shadow-hover`
- `--lg-label-color`
- `--lg-item-color`
- `--lg-separator`

También consume reglas de `.light .liquid-glass`, `@keyframes liquidGlassScroll` y `.liquid-glass:hover`.

## Dependencias de imágenes

- `src/assets/talento/dark_liquid.webp`
- `src/assets/talento/light_liquid.webp`

Las dos imágenes se importan con `astro:assets` y se renderizan con `<Image />` (no `<img>` crudo).  
Se usa `loading="eager"` en ambas para minimizar flash al alternar tema cuando la imagen no visible pasa a visible.

## Accesibilidad y reduced motion

- Estado inicial: lectura sincrónica de `localStorage` (`nh-reduced-motion`) con fallback a `prefers-reduced-motion`.
- Sincronización runtime: `MutationObserver` sobre `document.documentElement`, observando atributo `class` y reaccionando solo cuando cambia el estado real de `no-motion`.
- Comportamiento: la animación del slider cambia a `animation-play-state: paused` cuando reduced motion está activo y vuelve a `running` al desactivarse.

Nota: no se usa `nh:reduced-motion` porque actualmente el sistema de accesibilidad no emite un custom event para ese cambio.

## Restricciones técnicas

- `backdrop-filter` requiere una capa no opaca detrás para que el efecto sea perceptible.
- El fondo mesh (`.webp`) actúa como capa de soporte visual para que el cristal no quede plano en dark/light.
- Los items del marquee no son interactivos (`cursor: default`, `user-select: none`) y no tienen hover individual.

## Uso actual

- `/talento`
