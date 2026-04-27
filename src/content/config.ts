import { defineCollection, z } from "astro:content";

const projects = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      title: z.string().describe("Título del proyecto en español."),
      description: z
        .string()
        .describe("Descripción corta en español para listados y tarjetas."),
      descriptionEn: z.string().describe("Misma descripción en inglés."),
      url: z
        .string()
        .url()
        .optional()
        .describe("URL del sitio o demo en producción, si aplica."),
      status: z
        .enum(["live", "in-progress", "completed"])
        .describe("Estado de madurez: en vivo, en curso o completado."),
      tags: z
        .array(z.string())
        .describe("Etiquetas libres para filtrar o agrupar en UI."),
      icon: z
        .string()
        .optional()
        .describe(
          "Opcional; la UI prioriza coverImage sobre emoji decorativo.",
        ),
      githubUrl: z
        .string()
        .url()
        .optional()
        .describe("Repositorio público en GitHub, si existe."),
      order: z
        .number()
        .default(99)
        .describe("Orden ascendente en listas (menor = primero)."),
      featured: z
        .boolean()
        .default(false)
        .describe("Si debe destacarse en la home u otras secciones."),
      coverImage: image()
        .optional()
        .describe(
          "Portada para ProjectCard; ruta relativa al MDX (p. ej. ../../assets/blog/nombre.webp o ./cover.webp).",
        ),
      coverPosition: z
        .enum(["top", "center", "bottom"])
        .default("top")
        .describe(
          "Anclaje vertical de la portada en ProjectCard (object-position desde md): top para screenshots con cabecera reconocible; center/bottom para fotos u otros focos. Por debajo de md ProjectCard fuerza crop centrado (max-md:object-center).",
        ),
    }),
});

const services = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      title: z.string().describe("Nombre del servicio en español."),
      titleEn: z.string().describe("Nombre del servicio en inglés."),
      description: z
        .string()
        .describe("Descripción larga en español (página de detalle)."),
      descriptionEn: z.string().describe("Descripción larga en inglés."),
      shortDescription: z
        .string()
        .optional()
        .describe("Resumen para tarjetas del catálogo."),
      shortDescriptionEn: z
        .string()
        .optional()
        .describe("Resumen en inglés para tarjetas."),
      roiFocus: z
        .string()
        .optional()
        .describe(
          "Línea comercial / ROI en la tarjeta (p. ej. beneficio medible).",
        ),
      roiFocusEn: z
        .string()
        .optional()
        .describe("Versión en inglés de roiFocus."),
      priceFrom: z
        .string()
        .optional()
        .describe(
          "Precio “desde” en texto libre (ej. ARS 20.000); UI puede combinarlo con pricePrefix en ServiceCard.",
        ),
      module: z
        .string()
        .max(64)
        .optional()
        .describe(
          "Identificador estable para analytics o deep links al ancla del servicio.",
        ),
      icon: z
        .string()
        .optional()
        .describe("Opcional; la tarjeta puede usar solo coverImage."),
      order: z
        .number()
        .default(99)
        .describe("Orden en la página /servicios (menor = primero)."),
      href: z
        .string()
        .optional()
        .refine(
          (v) =>
            !v ||
            v.startsWith("/") ||
            v.startsWith("#") ||
            /^https?:\/\//.test(v),
          {
            message: "href must be a relative path (/ or #) or an http(s) URL.",
          },
        )
        .describe(
          "URL interna o externa si la tarjeta enlaza fuera del ancla por defecto.",
        ),
      featured: z
        .boolean()
        .default(false)
        .describe("Marca el servicio como destacado en el catálogo."),
      imageKey: z
        .enum(["human-ai", "cloud-servers", "satellite"])
        .optional()
        .describe(
          "Respaldo si no hay coverImage: clave de imagen en ServiceCard.",
        ),
      coverImage: image()
        .optional()
        .describe(
          "Imagen de tarjeta; ruta relativa al MDX (p. ej. ../../assets/blog/nombre.webp o ../../assets/services/nombre.webp). Tiene prioridad sobre imageKey.",
        ),
      tags: z
        .array(z.string())
        .optional()
        .describe(
          "Etiquetas cortas (stack / categoría) para pills en ServiceCard del catálogo /servicios; p. ej. tecnologías o verticales.",
        ),
    }),
});

const faqEntrySchema = z.object({
  order: z.number().describe("Orden de visualización dentro de la FAQ."),
  category: z
    .enum(["proceso", "comercial", "tecnico", "soporte"])
    .describe("Eje de clasificación para filtros y estilos de chip."),
  question: z.string().describe("Pregunta en español."),
  questionEn: z.string().describe("Pregunta en inglés."),
  answer: z
    .string()
    .describe("Respuesta en español (markdown/HTML según renderizado)."),
  answerEn: z.string().describe("Respuesta en inglés."),
  highlight: z
    .string()
    .optional()
    .describe("Texto corto opcional para resaltar en la tarjeta."),
  highlightEn: z.string().optional().describe("Highlight en inglés."),
});

// src/content/faq/: solo archivos de datos (p. ej. entries.json). No .md en esta carpeta:
// Astro las trataría como `content` y fallaría con MixedContentDataCollectionError.
const faq = defineCollection({
  type: "data",
  schema: z.array(faqEntrySchema),
});

/**
 * Metadatos opcionales para el visor de diapositivas (SlideViewer).
 * Convención de assets: ver docs/convenciones-assets.md.
 */
const blogSlidesSchema = z
  .object({
    src: z
      .string()
      .describe(
        "Nombre de carpeta bajo src/assets/slides/<src>/ con archivos slide-01.webp, slide-02.webp, …",
      ),
    alt: z
      .string()
      .describe(
        "Descripción accesible del conjunto de diapositivas (prefijo de alt por página en el visor).",
      ),
    sourceType: z
      .enum(["pdf", "pptx"])
      .describe(
        "Formato de origen editorial (trazabilidad); el build sirve solo WebP generados a partir de ese origen.",
      ),
  })
  .describe(
    "Si está presente, la plantilla del post renderiza SlideViewer con imágenes bajo src/assets/slides/<src>/.",
  );

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string().describe("Título del artículo en español."),
    titleEn: z
      .string()
      .optional()
      .describe("Título en inglés para i18n / meta."),
    description: z
      .string()
      .describe("Resumen o lead en español (listados y meta)."),
    descriptionEn: z.string().optional().describe("Resumen en inglés."),
    pubDate: z
      .date()
      .describe("Fecha de publicación (control de orden y freshness)."),
    category: z
      .string()
      .describe("Slug o etiqueta de categoría para URLs /blog/categoria/...."),
    tags: z
      .array(z.string())
      .describe("Etiquetas para /blog/etiqueta/... y pies de artículo."),
    draft: z
      .boolean()
      .default(false)
      .describe("Si true, el post se excluye del build público."),
    readingTime: z
      .number()
      .optional()
      .describe("Minutos de lectura estimados (entero)."),
    coverImageKey: z
      .enum([
        "human-ai",
        "cloud-servers",
        "satellite",
        "huella-del-fuego",
        "arquitectura-gran-escala",
        "microservicios-urban-blueprint",
      ])
      .optional()
      .describe("Imagen de portada predefinida en BlogCard y cabecera."),
    coverAlt: z
      .string()
      .optional()
      .describe("Texto alternativo de la portada (accesibilidad)."),
    priority: z
      .number()
      .min(0)
      .max(1)
      .default(0.5)
      .describe("Prioridad 0–1 para sitemap u ordenación secundaria."),
    pillarSlug: z
      .string()
      .optional()
      .describe(
        "Slug del pilar de contenido relacionado, si la taxonomía lo usa.",
      ),
    vertical: z
      .enum(["alimentos", "inmobiliaria", "salud", "ecommerce", "transversal"])
      .default("transversal")
      .describe("Vertical de negocio para badge y segmentación."),
    slides: blogSlidesSchema.optional(),
    references: z
      .array(
        z.object({
          title: z
            .string()
            .describe("Título de la fuente o referencia citada."),
          url: z
            .string()
            .url()
            .optional()
            .describe("URL pública de la fuente, si existe."),
          author: z
            .string()
            .optional()
            .describe("Autor, entidad o publicación responsable de la fuente."),
          year: z
            .number()
            .optional()
            .describe("Año de publicación o consulta de la referencia."),
        }),
      )
      .optional()
      .describe("Bibliografía o fuentes del artículo renderizadas al final."),
  }),
});

const blogEn = defineCollection({
  type: "content",
  schema: z.object({
    sourceSlug: z
      .string()
      .optional()
      .describe(
        "Slug del artículo español equivalente; si se omite, se usa el slug del archivo.",
      ),
    title: z
      .string()
      .describe("Título editorial del cuerpo traducido al inglés."),
    description: z
      .string()
      .describe("Resumen editorial del cuerpo traducido al inglés."),
  }),
});

export const collections = { projects, services, blog, "blog-en": blogEn, faq };
