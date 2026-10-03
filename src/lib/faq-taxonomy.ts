/**
 * Fuente única para la taxonomía de FAQ: umbral de tags, etiquetas bilingües
 * y clases de Tailwind por categoría. Consumido por `FaqSection.astro` y
 * `FaqAccordion.astro` (M-10).
 */
export type FaqCategory = "proceso" | "comercial" | "tecnico" | "soporte";

/** Shape of a single FAQ entry consumed by FaqSection.astro. */
export interface FaqItem {
  order: number;
  category: FaqCategory;
  question: string;
  questionEn: string;
  answer: string;
  answerEn: string;
  highlight?: string;
  highlightEn?: string;
}

/** Umbral de entradas a partir del cual renderizamos tags de categoría. */
export const FAQ_TAG_THRESHOLD = 8;

export const FAQ_CATEGORY_LABEL: Record<
  FaqCategory,
  { es: string; en: string }
> = {
  proceso: { es: "Proceso", en: "Process" },
  comercial: { es: "Comercial", en: "Commercial" },
  tecnico: { es: "Técnico", en: "Technical" },
  soporte: { es: "Soporte", en: "Support" },
};

export const FAQ_CATEGORY_CLASS: Record<FaqCategory, string> = {
  proceso:
    "border-[var(--accent-border)] bg-[hsla(var(--accent-h),var(--accent-s),56%,0.1)] text-[var(--accent)]",
  comercial:
    "border-[hsla(152,43%,55%,0.25)] bg-[hsla(152,43%,55%,0.1)] text-[var(--color-success)]",
  tecnico:
    "border-[hsla(258,60%,70%,0.25)] bg-[hsla(258,60%,70%,0.1)] text-[hsl(258,55%,72%)]",
  soporte:
    "border-[hsla(199,70%,60%,0.25)] bg-[hsla(199,70%,60%,0.1)] text-[hsl(199,75%,68%)]",
};

/**
 * Paleta fija de chips para la variante `darkBand` (FAQ sobre fondos oscuros,
 * p. ej. /servicios): no depende de `html.light`.
 */
export const FAQ_CATEGORY_CLASS_DARK: Record<FaqCategory, string> = {
  proceso: "border-orange-400/35 bg-orange-500/10 text-orange-300",
  comercial: "border-emerald-400/30 bg-emerald-500/10 text-emerald-300",
  tecnico: "border-violet-400/30 bg-violet-500/10 text-violet-200",
  soporte: "border-sky-400/30 bg-sky-500/10 text-sky-200",
};

/**
 * Ítem mínimo que renderiza `FaqAccordion.astro`. `FaqItem` lo satisface por
 * estructura; `category` solo se usa si el acordeón muestra chips.
 */
export type FaqAccordionItem = Pick<
  FaqItem,
  "question" | "questionEn" | "answer" | "answerEn"
> & { category?: FaqCategory };
