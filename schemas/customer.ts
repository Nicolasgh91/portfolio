import { z } from 'zod';

export const CustomerSchema = z.object({
  name: z.string().min(1).max(200).trim().describe('Nombre completo o razón social.'),
  email: z.string().email().max(320).optional().describe('Correo de contacto.'),
  phone: z.string().max(30).trim().optional().describe('Teléfono en formato libre o E.164 según integración.'),
  company: z.string().max(200).trim().optional().describe('Empresa u organización.'),
  notes: z.string().max(2000).trim().default('').describe('Notas internas o del CRM.'),
});

export const CustomerUpdateSchema = CustomerSchema.partial().extend({
  id: z.string().uuid().describe('UUID del cliente a actualizar.'),
});
