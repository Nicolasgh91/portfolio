import { z } from "zod";

export const landingTemplateSchema = z.object({
  slug: z.string(),
  title: z.string(),
  titleEn: z.string().optional(),
  description: z.string(),
  descriptionEn: z.string().optional(),
  vertical: z.enum([
    "gastronomia",
    "profesionales",
    "contenido",
    "ecommerce",
    "salud",
    "inmobiliaria",
  ]),
  type: z.enum(["landing", "menu-digital", "hub-contenido", "catalogo"]),
  status: z
    .enum(["available", "coming_soon"])
    .describe(
      "available: plantilla con URL canónica publicada y apta para JSON-LD; coming_soon: sin ficha indexable como ItemList.",
    ),
  features: z.array(z.string()).min(1),
  featuresEn: z
    .array(z.string())
    .optional()
    .describe(
      "Lista de beneficios traducida al inglés, alineada por índice con features.",
    ),
  thumbnail: z
    .string()
    .optional()
    .describe(
      "Opcional: ruta bajo /public o URL absoluta (p. ej. OG o listados que no usen astro:assets). La miniatura del carrusel en /plantillas se resuelve con imports estáticos en src/data/template-carousel-images.ts → src/assets/templates/ (convención {slug}.webp o mapa explícito), no duplicar aquí.",
    ),
  cardBackground: z
    .enum(["dark", "light", "warm"])
    .default("dark")
    .describe(
      "Fondo de la tarjeta en el carrusel. Mixto por vertical como Apple Education.",
    ),
  demoUrl: z
    .union([z.string().url(), z.string().regex(/^\//)])
    .optional()
    .describe(
      "URL absoluta o path relativo. Resolución en la página, no en este archivo.",
    ),
  priceGroup: z
    .enum(["basico", "plantilla", "full"])
    .describe(
      "Alineado a planes del catálogo: básico, plantilla disponible o full.",
    ),
  priceLabel: z
    .string()
    .optional()
    .describe('Ej: "Desde ARS 20.000". Si vacío, mostrar "Consultar".'),
  priority: z.number().min(0).max(1).default(0.5),
  tags: z.array(z.string()).optional(),
});

export const landingTemplatesSchema = z.array(landingTemplateSchema);

export type LandingTemplate = z.infer<typeof landingTemplateSchema>;
