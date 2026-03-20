import { z } from 'zod';

export const OrderItemSchema = z.object({
  product_id: z.string().uuid(),
  qty: z.number().int().positive().max(9_999),
  unit_price: z.number().positive().max(99_999_999),
});

export const OrderSchema = z.object({
  items: z.array(OrderItemSchema).min(1).max(100),
  total: z.number().positive().max(999_999_999),
  delivery_date: z.string().date().optional(),
  delivery_address: z.string().max(500).trim().optional(),
  customer_id: z.string().uuid().optional(),
  source: z.enum(['web', 'chatbot', 'whatsapp']).default('web'),
  idempotency_key: z.string().uuid(),
});

export const WhatsAppOrderSchema = z.object({
  customer_phone: z.string().min(7).max(30).trim(),
  items: z.array(
    z.object({
      name: z.string().min(1).max(200),
      qty: z.number().int().positive().max(9_999),
      unit_price: z.number().positive().max(99_999_999),
    }),
  ).min(1).max(100),
  notes: z.string().max(500).trim().default(''),
  source: z.literal('whatsapp'),
});
