# Estado del proyecto (bitácora breve)

## SEO / Open Graph — `og:image:type` y dimensiones

**Problema:** `Layout.astro` fijaba siempre `og:image:type` como `image/png` y tamaño 1366×768. Los artículos de blog que usan portada vía `astro:assets` (p. ej. WebP bajo `/_astro/...`) quedaban con metadatos incorrectos respecto al archivo real.

**Cambio:**

- [`src/layouts/Layout.astro`](src/layouts/Layout.astro): props opcionales `ogImageType`, `ogImageWidth`, `ogImageHeight`. Si no se pasa tipo, se infiere por extensión del path (`.webp` → `image/webp`, `.png` → `image/png`, etc.). Valores por defecto sin props: PNG y 1366×768 (compatibles con [`public/og-desktop.png`](public/og-desktop.png)).
- [`src/pages/blog/[slug].astro`](src/pages/blog/[slug].astro): cuando existe `coverImageKey`, se pasan tipo `image/webp` y dimensiones desde el resultado de `getImage` (con fallback de alto según ratio del import del asset).

**Referencia:** portadas del blog se definen en schema con `coverImageKey` (ver [`src/content/config.ts`](src/content/config.ts)); el caso Huella del fuego usa `huella-del-fuego` → [`src/assets/open-graphs/og-huella-del-fuego.webp`](src/assets/open-graphs/og-huella-del-fuego.webp).
