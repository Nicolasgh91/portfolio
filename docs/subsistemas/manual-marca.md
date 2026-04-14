# Manual de marca

Guía de identidad y comunicación del sitio **escalatunegocioconia.com**. Los valores visuales ejecutables (colores exactos, escalas, fuentes) viven en [`src/styles/tokens.css`](../../src/styles/tokens.css); este documento enlaza esa fuente de verdad y fija reglas editoriales.

## Nombre y propósito

- **Marca / sitio:** escalatunegocioconia.com — presencia profesional y oferta de servicios digitales de Nicolás Hruszczak.
- **Stack de producto:** portfolio + blog técnico + chatbot asistente integrado en iframe.

## URL canónica

- **Producción:** `https://escalatunegocioconia.com` (coincide con `site` en [`astro.config.mjs`](../../astro.config.mjs)).
- Enlaces públicos, metadatos Open Graph, JSON-LD y datos de contacto orientados a visitantes deben usar esta URL base salvo una decisión explícita de mercado (p. ej. dominio regional).

## Identidad visual (resumen)

| Elemento | Regla |
|----------|--------|
| Acento | Dorado (`--accent-h` / `--color-accent-*` en tokens). No sustituir por otro acento en UI principal sin actualizar tokens. |
| Fondos y texto | Escala oscura/clara y neutros fríos definidos en tokens (`--bg-*`, `--text-*`). |
| Tipografía titulares | `Outfit Variable` (`--font-display`). |
| Tipografía cuerpo / UI | `Inter Variable` (`--font-body`). |
| Código / mono | `JetBrains Mono`, `Fira Code`, `monospace` por orden (`--font-mono`): fuentes del sistema si están instaladas; no hay paquete `@fontsource` de mono en el proyecto. |

Detalle técnico (Tailwind, tema, a11y): [`sistema-diseno.md`](sistema-diseno.md).

## Logo y navegación

- Marca textual en barra: **`nh.`** enlazando al inicio (ver componente Nav).
- Mantener contraste y tamaño acordes a tokens; no inventar variantes de color fuera de tema claro/oscuro y modos de accesibilidad ya soportados.

## Tono y voz

- Profesional, claro y directo; español e inglés según controles de idioma del sitio.
- El chatbot refleja la misma línea: útil, conciso, sin presión comercial; derivación a WhatsApp o email cuando el usuario muestra intención de contratar (ver `persona` en `public/chatbot/data/config.json`).

## Chatbot y datos JSON

- **Render del widget:** los colores efectivos se alinean al **documento padre** (tokens inyectados en `:root` desde el iframe), no a un tema aislado del JSON.
- El bloque `branding` en `config.json` es **metadato de referencia** (aproximación en hex / stack tipográfico) alineado con tokens para otros usos o integraciones; si cambia la paleta del sitio, actualizar tokens primero y luego este bloque para coherencia documental.

## Estado

Documentación viva: ante cambios de paleta, dominio canónico o nombre comercial, actualizar este archivo y [`sistema-diseno.md`](sistema-diseno.md) en el mismo cambio.
