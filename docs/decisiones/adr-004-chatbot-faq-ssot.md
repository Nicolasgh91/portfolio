# ADR-004: SSOT de FAQ para chatbot

## Estado

Activo

## Fecha

2026-04-27

## Contexto

La auditoría del chatbot identificó dos necesidades simultáneas:

- Mejorar cobertura conversacional (objeciones, descubrimiento, contratación).
- Evitar seguir mezclando datos de negocio en `services.json`.

Actualmente existe FAQ del sitio en `src/content/faq/entries.json`, orientada a SEO/UI y renderizado en páginas (`/servicios`, `/plantillas`). Ese contrato no contempla todos los campos conversacionales que el chatbot requiere para trazabilidad y orquestación comercial.

## Decisión

Usar `public/chatbot/data/faq.json` como fuente de verdad (SSOT) del conocimiento conversacional del chatbot.

Campos mínimos esperados por entrada:

- `id`
- `axis` (`servicio`, `objecion`, `descubrimiento`, `contratacion`)
- `service_id` (opcional, cuando aplica)
- `question`
- `answer`
- `cta`
- `priority`
- `source`
- `last_reviewed`

## Consecuencias

### Positivas

- Desacopla FAQ conversacional del FAQ SEO/UI del sitio.
- Permite trazabilidad por fuente y fecha de revisión.
- Facilita priorización de respuestas por intención comercial.

### Negativas

- Introduce una nueva fuente de datos que debe mantenerse.
- Requiere definir validación de schema y control editorial para evitar drift.

## Alternativas consideradas

1. Sincronizar directamente desde `src/content/faq/entries.json`.
   - Rechazada para esta fase por acoplamiento con contrato SEO/UI y falta de campos de trazabilidad conversacional.
2. Modelo híbrido (base en `entries.json` + extensiones chatbot).
   - Diferida. Se puede evaluar más adelante cuando el schema conversacional esté estable.

## Próximos pasos

1. Crear `public/chatbot/data/faq.json` con un primer set priorizado por eje.
2. Extender `buildSystemPrompt` en `api/chat.js` para incorporar FAQ.
3. Definir validación automática del schema FAQ en CI.
