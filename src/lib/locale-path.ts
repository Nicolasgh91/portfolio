export type Locale = "es" | "en";

const PATH_TRANSLATIONS: Record<string, string> = {
  "/": "/en",
  "/servicios": "/en/services",
  "/talento": "/en/talent",
  "/blog": "/en/blog",
  "/plantillas": "/en/templates",
};

const REVERSE_TRANSLATIONS = Object.fromEntries(
  Object.entries(PATH_TRANSLATIONS).map(([esPath, enPath]) => [enPath, esPath]),
) as Record<string, string>;

export function localeFromPathname(pathname: string): Locale {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "es";
}

function swapBlogPost(pathname: string): string | null {
  if (pathname.startsWith("/blog/"))
    return pathname.replace("/blog/", "/en/blog/");
  if (pathname.startsWith("/en/blog/"))
    return pathname.replace("/en/blog/", "/blog/");
  return null;
}

function swapTemplateDetail(pathname: string): string | null {
  if (pathname.startsWith("/plantillas/"))
    return pathname.replace("/plantillas/", "/en/templates/");
  if (pathname.startsWith("/en/templates/"))
    return pathname.replace("/en/templates/", "/plantillas/");
  return null;
}

export function getAlternatePathname(pathname: string): string {
  if (PATH_TRANSLATIONS[pathname]) return PATH_TRANSLATIONS[pathname];
  if (REVERSE_TRANSLATIONS[pathname]) return REVERSE_TRANSLATIONS[pathname];

  const blogPost = swapBlogPost(pathname);
  if (blogPost) return blogPost;

  const templateDetail = swapTemplateDetail(pathname);
  if (templateDetail) return templateDetail;

  return pathname;
}

export function getLocalizedPath(pathname: string, locale: Locale): string {
  const currentLocale = localeFromPathname(pathname);
  if (currentLocale === locale) return pathname;
  return getAlternatePathname(pathname);
}
