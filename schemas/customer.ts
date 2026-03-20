import { z } from 'zod';

export const CustomerSchema = z.object({
  name: z.string().min(1).max(200).trim(),
  email: z.string().email().max(320).optional(),
  phone: z.string().max(30).trim().optional(),
  company: z.string().max(200).trim().optional(),
  notes: z.string().max(2000).trim().default(''),
});

export const CustomerUpdateSchema = CustomerSchema.partial().extend({
  id: z.string().uuid(),
});
