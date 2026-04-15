import type { ImageMetadata } from "astro";

/** Shape of a module returned by `import.meta.glob` for slide WebP assets. */
export type SlideGlobModule = { default: ImageMetadata };

export function isSlideGlobModule(mod: unknown): mod is SlideGlobModule {
  if (typeof mod !== "object" || mod === null) return false;
  if (!("default" in mod)) return false;
  const img = (mod as { default: unknown }).default;
  if (typeof img !== "object" || img === null) return false;
  return "src" in img && "width" in img && "height" in img;
}

/** Resolves `default` export as Astro `ImageMetadata`; throws if the glob entry is invalid. */
export function getSlideImageFromGlobModule(mod: unknown): ImageMetadata {
  if (!isSlideGlobModule(mod)) {
    throw new TypeError("Slide glob entry must export default ImageMetadata");
  }
  return mod.default;
}
