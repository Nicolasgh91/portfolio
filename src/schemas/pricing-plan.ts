import { z } from 'zod';

export const pricingPlanSchema = z.object({
  id: z
    .enum(['basico', 'plantilla', 'full'])
    .describe('Identificador estable del plan: básico, plantilla disponible o full.'),
  name: z.string(),
  nameEn: z.string().optional(),
  subtitle: z.string(),
  subtitleEn: z.string().optional(),
  price: z
    .union([z.number().int().nonnegative(), z.string()])
    .describe(
      'Importe en ARS como número (prefijo $ y toLocaleString es-AR en UI) o literal p. ej. Consultar.'
    ),
  priceDetail: z.string().optional().describe('Ej: "pago único" o "/mes"'),
  features: z.array(z.string()).min(1),
  featuresEn: z.array(z.string()).optional(),
  recommended: z.boolean().default(false),
  recommendedLabel: z
    .string()
    .optional()
    .describe(
      'Texto del badge cuando recommended es true (p. ej. «Más elegido»). Si falta, la UI usa un default.'
    ),
  recommendedLabelEn: z
    .string()
    .optional()
    .describe('Versión EN del badge de plan recomendado; fallback al default en inglés si falta.'),
  ctaText: z.string().default('Contactar'),
  ctaTextEn: z.string().optional(),
  ctaHref: z.string().default('/servicios#contacto'),
});

export const pricingPlansSchema = z.array(pricingPlanSchema);

export type PricingPlan = z.infer<typeof pricingPlanSchema>;
