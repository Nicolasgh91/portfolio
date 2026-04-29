import type { LandingTemplate, PricingPlan } from "../schemas";

interface TemplateForJsonLd extends LandingTemplate {
  resolvedDemoUrl?: string;
}

interface CatalogJsonLdInput {
  templates: TemplateForJsonLd[];
  isEnglish: boolean;
  siteUrl: string;
  templatesHref: string;
}

/**
 * ItemList JSON-LD for the templates catalog. Position is 1-indexed and
 * mirrors the visual order; only `available` templates are included so we
 * don't advertise placeholders to crawlers.
 */
export function buildTemplatesCatalogJsonLd(input: CatalogJsonLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: input.templates
      .filter((t) => t.status === "available")
      .map((t, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: input.isEnglish ? (t.titleEn ?? t.title) : t.title,
        description: input.isEnglish
          ? (t.descriptionEn ?? t.description)
          : t.description,
        url: `${input.siteUrl}${input.templatesHref}/${t.slug}`,
      })),
  };
}

interface PricingJsonLdInput {
  plans: PricingPlan[];
  isEnglish: boolean;
  siteUrl: string;
  templatesHref: string;
}

/**
 * Service + Offer JSON-LD describing the landing pricing plans on the
 * templates page (#planes anchor).
 */
export function buildPricingPlansJsonLd(input: PricingJsonLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.isEnglish ? "Landing plans" : "Planes de landing",
    serviceType: input.isEnglish
      ? "Landing website plans for SMEs"
      : "Planes de sitios landing para pymes",
    areaServed: "AR",
    url: `${input.siteUrl}${input.templatesHref}#planes`,
    offers: input.plans.map((plan) => ({
      "@type": "Offer",
      name: input.isEnglish ? (plan.nameEn ?? plan.name) : plan.name,
      description: input.isEnglish ? (plan.pitchEn ?? plan.pitch) : plan.pitch,
      url: `${input.siteUrl}${input.templatesHref}#planes`,
      category: input.isEnglish ? "Website plan" : "Plan web",
      availability: "https://schema.org/InStock",
    })),
  };
}
