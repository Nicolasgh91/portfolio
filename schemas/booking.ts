import { z } from 'zod';

export const BookingSchema = z.object({
  customer_id: z.string().uuid().optional(),
  customer_name: z.string().min(1).max(200).trim(),
  customer_email: z.string().email().max(320).optional(),
  customer_phone: z.string().max(30).trim().optional(),
  service: z.string().min(1).max(200).trim(),
  date: z.string().date(),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'Formato HH:MM'),
  duration_minutes: z.number().int().positive().max(480).default(60),
  notes: z.string().max(1000).trim().default(''),
  status: z
    .enum(['pending', 'confirmed', 'cancelled', 'completed'])
    .default('pending'),
});
