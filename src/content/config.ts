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
    icon: z.string(),
    order: z.number().default(99),
    href: z.string().optional(),   // ← agregado: link a página de detalle
  }),
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
    coverImage: z.string().optional(),
    coverAlt: z.string().optional(),
    priority: z.number().min(0).max(1).default(0.5),
    pillarSlug: z.string().optional(),
    vertical: z.enum(['alimentos', 'inmobiliaria', 'salud', 'ecommerce', 'transversal']).default('transversal'),
  }),
});

export const collections = { projects, services, blog };