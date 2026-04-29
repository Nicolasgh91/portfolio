import type { CollectionEntry } from "astro:content";
import { serviceAnchorId } from "./service-anchor-id";

interface ServicesJsonLdInput {
  services: CollectionEntry<"services">[];
  isEnglish: boolean;
  siteUrl: string;
  authorName: string;
}

/**
 * Builds the @graph payload describing the catalog as schema.org/Service
 * entries. Each service URL points at its anchor on the localized listing.
 */
export function buildServicesJsonLd(input: ServicesJsonLdInput) {
  const listingPath = input.isEnglish ? "/en/services" : "/servicios";
  return {
    "@context": "https://schema.org",
    "@graph": input.services.map((s) => ({
      "@type": "Service",
      name: input.isEnglish ? s.data.titleEn : s.data.title,
      description: input.isEnglish
        ? (s.data.shortDescriptionEn ?? s.data.descriptionEn)
        : (s.data.shortDescription ?? s.data.description),
      url: `${input.siteUrl}${listingPath}#${serviceAnchorId(s.slug)}`,
      provider: {
        "@type": "Person",
        name: input.authorName,
        url: input.siteUrl,
      },
    })),
  };
}
