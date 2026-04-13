/**
 * Filtro común para el TOC del blog: solo incluye h2/h3 (L-13).
 */
export interface TocHeading {
  depth: number;
  slug: string;
  text: string;
}

export function filterTocHeadings<T extends { depth: number }>(headings: T[]): T[] {
  return headings.filter((heading) => heading.depth === 2 || heading.depth === 3);
}
