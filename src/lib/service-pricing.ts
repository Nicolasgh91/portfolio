import type { CollectionEntry } from "astro:content";
import pricing from "../data/pricing.json";

type PricingEntry = { price: string; unit?: string; prefix?: string };

export type ServicePriceSlug =
  | "chatbots-ia"
  | "landing-page"
  | "local-llms"
  | "ecommerce-platforms"
  | "workflow-automation";

const prices = pricing as Record<ServicePriceSlug, PricingEntry>;

/** Sentinel that ServiceCard renders as a contact CTA instead of a numeric block. */
export const PRICE_INQUIRE = "Consultar";

export interface ResolvedPrice {
  price?: string;
  priceUnit?: string;
  pricePrefix: string;
}

function parsePriceFromFrontmatter(
  data: CollectionEntry<"services">["data"],
): ResolvedPrice | null {
  const raw = data.priceFrom?.trim();
  if (!raw) return null;
  const ars = raw.match(/^ARS\s+(.+)$/i);
  if (ars) {
    const price = ars[1].trim();
    if (!price) return null;
    return { price, priceUnit: "ARS", pricePrefix: "" };
  }
  if (raw.startsWith("$")) {
    const price = raw.slice(1).trim();
    if (!price) return null;
    return { price, priceUnit: undefined, pricePrefix: "$" };
  }
  return { price: raw, priceUnit: undefined, pricePrefix: "" };
}

/**
 * Resolves a service's price using (in order): frontmatter `priceFrom`,
 * the central `pricing.json` table by slug, or the `Consultar` sentinel.
 */
export function resolveServicePrice(
  slug: string,
  data: CollectionEntry<"services">["data"],
): ResolvedPrice {
  const fromMatter = parsePriceFromFrontmatter(data);
  if (fromMatter) return fromMatter;

  const entry = prices[slug as ServicePriceSlug];
  const numeric = entry?.price?.trim();
  if (numeric) {
    const unit = entry.unit?.trim();
    return {
      price: numeric,
      priceUnit: unit || undefined,
      pricePrefix: entry.prefix ?? "",
    };
  }

  return { price: PRICE_INQUIRE, pricePrefix: "", priceUnit: undefined };
}

/** Maps a service collection entry to the prop shape ServiceCard expects. */
export function serviceCardPayload(service: CollectionEntry<"services">) {
  const resolved = resolveServicePrice(service.slug, service.data);
  return {
    title: service.data.title,
    titleEn: service.data.titleEn,
    shortDescription: service.data.shortDescription ?? service.data.description,
    shortDescriptionEn:
      service.data.shortDescriptionEn ?? service.data.descriptionEn,
    roiFocus: service.data.roiFocus,
    roiFocusEn: service.data.roiFocusEn,
    coverImage: service.data.coverImage,
    imageKey: service.data.imageKey,
    featured: service.data.featured,
    href: service.data.href,
    price: resolved.price,
    priceUnit: resolved.priceUnit,
    pricePrefix: resolved.pricePrefix,
    tags: service.data.tags,
  };
}
