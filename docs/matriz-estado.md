# Matriz de estado (actual vs objetivo)

## Componentes y layout

| Elemento | Estado actual | Estado objetivo | Gap | Prioridad |
|---|---|---|---|---|
| `SlideViewer` | Documentado; fullscreen con listener global y posible issue de safelist | Reutilizable sin listeners globales y clases dinámicas seguras | Refactor acotado de script + validación Tailwind | Alta |
| `Nav` | Funcional; acoplado a `window.nhTheme/nhLang/nhA11y`; CSS scoped extenso | Contrato UI más desacoplado y patrón de controladores estable | Separar responsabilidades y reducir acoplamiento global | Media |
| `ContactForm` | Funciona; IDs fijos y script acoplado a una instancia | Soporte multi-instancia o contrato explícito de instancia única | Namespacing de IDs o encapsulado por root | Media |
| `BlogCard` | Renderea portada/meta; `vertical` tipado sin UI visible | Taxonomía consistente y señal visual por vertical (si se decide) | Definir regla de uso de `vertical` | Baja |
| `ProjectDemo` | Existe pero sin uso | Decisión explícita: integrar o retirar | Evitar código huérfano | Baja |
| `Layout` | Centraliza SEO, i18n, a11y, chatbot | Menor acoplamiento de scripts globales | Modularizar scripts globales por feature | Media |

## Subsistemas

| Subsistema | Estado actual | Estado objetivo | Gap | Prioridad |
|---|---|---|---|---|
| Chatbot | Arquitectura documentada; control de seguridad base activo | Contratos más estrictos de postMessage/origen y observabilidad | Endurecer SEC-009 + métricas | Alta |
| Sistema de diseño | Tokens claros y consumidos por web/chatbot | Consistencia Tailwind vs CSS scoped | Reducir mezcla y definir criterio único | Media |
| SEO técnico | JSON-LD y sitemap en producción | Cobertura completa y limpia de taxonomías/proyectos | Resolver hint de sitemap (`projects`) y revisar hreflang real | Media |
| Convenciones MDX | Estructura y frontmatter documentados | Pipeline editorial repetible + checklist de publicación | Checklist operativo por pieza | Media |
| Seguridad | SEC-001..014 mapeado (SEC-012 pendiente) | Catálogo cerrado de controles y evidencias por release | Definir SEC-012 y pruebas asociadas | Alta |

## Resultado

- Esta matriz alimenta el backlog técnico de `docs/deuda-tecnica.md`.
- Priorizar primero los gaps **Alta** con riesgo de regresión funcional o seguridad.
