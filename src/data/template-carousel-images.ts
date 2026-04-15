/** Miniaturas del carrusel /plantillas: slug → import; excepciones a {slug}.webp solo aquí. */
import type { ImageMetadata } from "astro";

import imgCatalogoProductos from "../assets/templates/ecommerce.webp";
import imgCongelados from "../assets/templates/congelados.webp";
import imgConsultora from "../assets/templates/consultora.webp";
import imgHubCreador from "../assets/templates/hub-creador-contenido.webp";
import imgInmobiliaria from "../assets/templates/inmobiliaria.webp";
import imgLandingDietetica from "../assets/templates/healthy-food.webp";
import imgPortfolio from "../assets/templates/portfolio.webp";
import imgViandas from "../assets/templates/viandas.webp";

export const templateCarouselImageBySlug: Record<string, ImageMetadata> = {
  "menu-digital-viandas": imgViandas,
  "menu-digital-congelados": imgCongelados,
  "portfolio-profesional": imgPortfolio,
  "hub-creador-contenido": imgHubCreador,
  "catalogo-productos": imgCatalogoProductos,
  "landing-inmobiliaria": imgInmobiliaria,
  "landing-dietetica": imgLandingDietetica,
  "landing-consultora": imgConsultora,
};

export function getTemplateCarouselImage(
  slug: string,
): ImageMetadata | undefined {
  return templateCarouselImageBySlug[slug];
}
