import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    descriptionEn: z.string(),
    url: z.string().url().optional(),
    status: z.enum(['live', 'in-progress', 'completed']),
    tags: z.array(z.string()),
    icon: z.string(),
    githubUrl: z.string().url().optional(),
    order: z.number().default(99),
    featured: z.boolean().default(false),
  }),
});

const services = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    titleEn: z.string(),
    description: z.string(),
    descriptionEn: z.string(),
    shortDescription: z.string().optional(),
    shortDescriptionEn: z.string().optional(),
    icon: z.string(),
    order: z.number().default(99),
    href: z.string().optional(),
    featured: z.boolean().default(false),
    imageKey: z.enum(['human-ai', 'cloud-servers', 'satellite']).optional(),
  }),
});

const faqEntrySchema = z.object({
  order: z.number(),
  category: z.enum(['proceso', 'comercial', 'tecnico', 'soporte']),
  question: z.string(),
  questionEn: z.string(),
  answer: z.string(),
  answerEn: z.string(),
  highlight: z.string().optional(),
  highlightEn: z.string().optional(),
});

// src/content/faq/: solo archivos de datos (p. ej. entries.json). No .md en esta carpeta:
// Astro las trataría como `content` y fallaría con MixedContentDataCollectionError.
const faq = defineCollection({
  type: 'data',
  schema: z.array(faqEntrySchema),
});

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    titleEn: z.string().optional(),
    description: z.string(),
    descriptionEn: z.string().optional(),
    pubDate: z.date(),
    category: z.string(),
    tags: z.array(z.string()),
    draft: z.boolean().default(false),
    readingTime: z.number().optional(),
    coverImageKey: z
      .enum(['human-ai', 'cloud-servers', 'satellite', 'huella-del-fuego'])
      .optional(),
    coverAlt: z.string().optional(),
    priority: z.number().min(0).max(1).default(0.5),
    pillarSlug: z.string().optional(),
    vertical: z.enum(['alimentos', 'inmobiliaria', 'salud', 'ecommerce', 'transversal']).default('transversal'),
  }),
});

export const collections = { projects, services, blog, faq };