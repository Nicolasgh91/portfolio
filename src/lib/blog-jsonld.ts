interface ArticleJsonLdInput {
  title: string;
  description: string;
  url: string;
  pubDateISO: string;
  tags: string[];
  isEnglish: boolean;
  authorName: string;
  siteUrl: string;
  readingTime?: number | null;
  imageAbsolute?: string;
}

/**
 * Builds the TechArticle JSON-LD payload for a blog post.
 * `dateModified` mirrors `datePublished` until the blog Zod gains an
 * `updatedDate` field.
 */
export function buildArticleJsonLd(input: ArticleJsonLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: input.title,
    description: input.description,
    datePublished: input.pubDateISO,
    dateModified: input.pubDateISO,
    author: {
      "@type": "Person",
      name: input.authorName,
      url: input.siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "escalatunegocioconia.com",
      url: input.siteUrl,
    },
    url: input.url,
    inLanguage: input.isEnglish ? "en-US" : "es-AR",
    keywords: input.tags.join(", "),
    ...(input.readingTime != null && {
      timeRequired: `PT${input.readingTime}M`,
    }),
    ...(input.imageAbsolute && { image: input.imageAbsolute }),
  };
}

interface BreadcrumbJsonLdInput {
  siteUrl: string;
  blogBaseHref: string;
  postUrl: string;
  postTitle: string;
  isEnglish: boolean;
}

export function buildBlogBreadcrumbJsonLd(input: BreadcrumbJsonLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: `${input.siteUrl}${input.isEnglish ? "/en" : "/"}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${input.siteUrl}${input.blogBaseHref}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: input.postTitle,
        item: input.postUrl,
      },
    ],
  };
}
