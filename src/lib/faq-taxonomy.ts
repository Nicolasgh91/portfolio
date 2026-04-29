/**
 * Fuente única para la taxonomía de FAQ: umbral de tags, etiquetas bilingües
 * y clases de Tailwind por categoría. Consumido por `FaqSection.astro` (M-10).
 *
 * Nota: la paleta "darkBand" vive dentro de `FaqSection.astro` ya que solo
 * aplica a su variante darkBand.
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
