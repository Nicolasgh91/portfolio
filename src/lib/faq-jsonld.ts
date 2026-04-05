/** Mínimo para FAQPage JSON-LD (español como texto canónico en schema). */
export type FaqJsonLdEntry = { question: string; answer: string };

function stripInlineMarkup(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

export function buildFaqPageJsonLd(entries: FaqJsonLdEntry[]) {
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
