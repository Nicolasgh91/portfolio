import { getCollection, type CollectionEntry } from "astro:content";

export interface FooterData {
  services: CollectionEntry<"services">[];
  blogPosts: CollectionEntry<"blog">[];
}

const FOOTER_BLOG_LIMIT = 6;

/**
 * Single point of access for Footer collections so the component stays
 * presentational. Astro caches getCollection internally; this helper
 * encapsulates ordering rules (services by `order`, blog newest-first,
 * draft filter) so they don't drift across consumers.
 */
export async function getFooterData(): Promise<FooterData> {
  const [services, posts] = await Promise.all([
    getCollection("services"),
    getCollection("blog", ({ data }) => !data.draft),
  ]);

  return {
    services: services.sort(
      (a, b) => (a.data.order ?? 99) - (b.data.order ?? 99),
    ),
    blogPosts: posts
      .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
      .slice(0, FOOTER_BLOG_LIMIT),
  };
}
