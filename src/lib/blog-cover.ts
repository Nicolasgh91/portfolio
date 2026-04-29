import { getImage } from "astro:assets";
import type { ImageMetadata } from "astro";
import humanAi from "../assets/blog/human-ai.webp";
import satellite from "../assets/blog/satellite.webp";
import cloudServers from "../assets/blog/cloud-servers.webp";
import ogHuellaDelFuego from "../assets/open-graphs/og-huella-del-fuego.webp";
import thumbArquitecturaGranEscala from "../assets/blog/thumbnails/thumb-articulo-arquitectura-a-gran-escala.webp";
import thumbMicroservicies from "../assets/blog/thumbnails/thumb-microservicies.webp";

export type CoverImageKey =
  | "human-ai"
  | "cloud-servers"
  | "satellite"
  | "huella-del-fuego"
  | "arquitectura-gran-escala"
  | "microservicios-urban-blueprint";

export const COVER_BY_KEY: Record<CoverImageKey, ImageMetadata> = {
  "human-ai": humanAi,
  satellite,
  "cloud-servers": cloudServers,
  "huella-del-fuego": ogHuellaDelFuego,
  "arquitectura-gran-escala": thumbArquitecturaGranEscala,
  "microservicios-urban-blueprint": thumbMicroservicies,
};

export interface ResolvedCover {
  ogImagePath: string;
  articleImageAbsolute?: string;
  ogImageWidth?: string;
  ogImageHeight?: string;
  ogImageType?: string;
}

const FALLBACK_OG_PATH = "/og-desktop.png";

/**
 * Resolves the optimized cover image (1200px wide WebP) plus absolute URL +
 * dimensions for OpenGraph / JSON-LD. Returns the desktop fallback when the
 * post has no `coverImageKey`.
 */
export async function resolveCover(
  coverImageKey: CoverImageKey | undefined,
  siteUrl: string,
): Promise<ResolvedCover> {
  if (!coverImageKey) return { ogImagePath: FALLBACK_OG_PATH };

  const coverSrc = COVER_BY_KEY[coverImageKey];
  const optimized = await getImage({ src: coverSrc, width: 1200 });
  const w = optimized.attributes.width as number | undefined;
  const h = optimized.attributes.height as number | undefined;
  const fallbackH = h ?? Math.round((coverSrc.height * 1200) / coverSrc.width);

  return {
    ogImagePath: optimized.src,
    articleImageAbsolute: new URL(optimized.src, siteUrl).href,
    ogImageWidth: String(w ?? 1200),
    ogImageHeight: String(fallbackH),
    ogImageType: "image/webp",
  };
}
