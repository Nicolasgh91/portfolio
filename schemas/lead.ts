import { z } from 'zod';

export const LeadSchema = z.object({
  name: z.string().min(1).max(200).trim(),
  email: z.string().email().max(320).optional(),
  phone: z.string().max(30).trim().optional(),
  source: z.enum(['chatbot', 'web', 'whatsapp', 'landing']).default('web'),
  message: z.string().max(2000).trim().default(''),
  interest: z.string().max(200).trim().optional(),
});
