import { z } from 'zod';

export const ProductAttributeSchema = z.object({
  key: z
    .string()
    .min(1)
    .max(64)
    .regex(
      /^[a-zA-Z0-9_\u00C0-\u024F ]+$/,
      'Solo letras, números, espacios y guiones bajos',
    ),
  value: z.string().max(500),
  type: z.enum(['text', 'number', 'select']).default('text'),
});

export const ProductSchema = z.object({
  name: z.string().min(1).max(200).trim(),
  description: z.string().max(5000).trim().default(''),
  category: z.string().max(100).trim().optional(),
  price: z.number().nonnegative().max(99_999_999),
  image_url: z.string().url().nullable().default(null),
  active: z.boolean().default(true),
  attributes: z.array(ProductAttributeSchema).max(20).default([]),
});

export const ProductUpdateSchema = ProductSchema.partial().extend({
  id: z.string().uuid(),
});
