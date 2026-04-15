# FAQ JSON-LD y Rich Results

## Fuente de verdad

- Helper: [`src/lib/faq-jsonld.ts`](../../src/lib/faq-jsonld.ts) — `buildFaqPageJsonLd(entries)` genera un objeto con `@type: FAQPage`, `mainEntity[]` de `Question` / `Answer` (`acceptedAnswer.text` en texto plano, sin HTML).
- **Sin microdata** en la UI del FAQ: [`FAQAccordion`](../../src/components/FAQAccordion.astro) y [`FaqSection`](../../src/components/FaqSection.astro) no usan `itemscope` / `itemprop` (evitar señal duplicada frente al JSON-LD).

## Páginas que inyectan FAQPage

| Ruta          | Head                                                                                                     | Contenido visible |
| ------------- | -------------------------------------------------------------------------------------------------------- | ----------------- |
| `/servicios`  | [`servicios.astro`](../../src/pages/servicios.astro) — `buildFaqPageJsonLd(faqEntries)` en `slot="head"` | `FAQAccordion`    |
| `/plantillas` | [`plantillas.astro`](../../src/pages/plantillas.astro) — `buildFaqPageJsonLd(catalogFaqEntries)`         | `FaqSection`      |

## Validación en CI

```bash
npm test
```

Incluye [`src/lib/faq-jsonld.test.ts`](../../src/lib/faq-jsonld.test.ts): comprueba el shape esperado para consumo tipo Google Rich Results (FAQ).

## Validación manual (post-deploy)

Cuando la URL esté pública o en staging, usar la [herramienta de prueba de resultados enriquecidos de Google](https://search.google.com/test/rich-results) con `/servicios` y `/plantillas`: debe detectarse **FAQ** sin errores críticos y sin microdata duplicada en el HTML de la sección FAQ.

## Estado

Documentado
