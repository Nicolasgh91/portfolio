# FAQ JSON-LD y Rich Results

## Fuente de verdad

- Helper: [`src/lib/faq-jsonld.ts`](../../src/lib/faq-jsonld.ts) — `buildFaqPageJsonLd(entries)` genera un objeto con `@type: FAQPage`, `mainEntity[]` de `Question` / `Answer` (`acceptedAnswer.text` en texto plano, sin HTML).
- **Sin microdata** en la UI del FAQ: [`FaqAccordion`](../../src/components/FaqAccordion.astro) (y [`FaqSection`](../../src/components/FaqSection.astro), que lo envuelve) no usan `itemscope` / `itemprop`, para evitar una señal duplicada frente al JSON-LD.
- Preguntas y respuestas se renderizan completas en el HTML (SSR), incluidos los ítems cerrados del acordeón.

## Páginas que inyectan FAQPage

| Ruta                           | Head                                                                                                     | Contenido visible             |
| ------------------------------ | -------------------------------------------------------------------------------------------------------- | ----------------------------- |
| `/servicios`, `/en/services`   | [`servicios.astro`](../../src/pages/servicios.astro) — `buildFaqPageJsonLd(faqEntries)` en `slot="head"` | `FaqSection` → `FaqAccordion` |
| `/plantillas`, `/en/templates` | [`plantillas.astro`](../../src/pages/plantillas.astro) — `buildFaqPageJsonLd(templatesFaqEntries)`       | `FaqSection` → `FaqAccordion` |

`/oferta/hub-creadores` usa `FaqAccordion` sin JSON-LD (FAQ de demostración de la plantilla).

> **Deuda conocida:** en `/en/*` el FAQPage se genera con `question`/`answer` en español, aunque el contenido visible está en inglés. Ver [`deuda-tecnica.md`](../deuda-tecnica.md).

## Validación en CI

```bash
npm run build && npm test
```

- [`src/lib/faq-jsonld.test.ts`](../../src/lib/faq-jsonld.test.ts): shape esperado para Google Rich Results (FAQ).
- [`src/lib/faq-dist.test.ts`](../../src/lib/faq-dist.test.ts): sobre `dist/`, verifica que el FAQ visible coincida con `mainEntity` en ES (en EN queda como `todo` por la deuda), además de ids únicos, estado inicial y atributos de accesibilidad.
- [`scripts/faq-snapshot.mjs`](../../scripts/faq-snapshot.mjs): snapshot antes/después de un cambio (hash del JSON-LD, texto visible, headings, canonical, hreflang, links, scripts inline) con diff automático.

## Validación manual (post-deploy)

Cuando la URL esté pública o en staging, usar la [herramienta de prueba de resultados enriquecidos de Google](https://search.google.com/test/rich-results) con `/servicios` y `/plantillas`: debe detectarse **FAQ** sin errores críticos y sin microdata duplicada en el HTML de la sección FAQ.

## Estado

Documentado
