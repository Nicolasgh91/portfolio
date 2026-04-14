/** Entrada mínima para FAQPage (p. ej. colección FAQ o datos estáticos con `question` / `answer`). */
export type FaqPageEntryInput = { question: string; answer: string };

function stripInlineMarkup(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

export function buildFaqPageJsonLd(entries: readonly FaqPageEntryInput[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: entries.map((e) => ({
      '@type': 'Question',
      name: e.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: stripInlineMarkup(e.answer),
      },
    })),
  };
}
