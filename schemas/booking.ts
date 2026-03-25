import { z } from 'zod';

export const BookingSchema = z.object({
  customer_id: z.string().uuid().optional().describe('Cliente existente en el sistema, si aplica.'),
  customer_name: z.string().min(1).max(200).trim().describe('Nombre quien reserva (obligatorio).'),
  customer_email: z.string().email().max(320).optional().describe('Email para confirmación.'),
  customer_phone: z.string().max(30).trim().optional().describe('Teléfono de contacto.'),
  service: z.string().min(1).max(200).trim().describe('Servicio o recurso reservado (texto libre o slug).'),
  date: z.string().date().describe('Día de la reserva (ISO date).'),
  time: z
    .string()
    .regex(/^\d{2}:\d{2}$/, 'Formato HH:MM')
    .describe('Hora local de inicio en formato HH:MM.'),
  duration_minutes: z
    .number()
    .int()
    .positive()
    .max(480)
    .default(60)
    .describe('Duración de la franja en minutos (máx. 480).'),
  notes: z.string().max(1000).trim().default('').describe('Comentarios del cliente o del agenda.'),
  status: z
    .enum(['pending', 'confirmed', 'cancelled', 'completed'])
    .default('pending')
    .describe('Estado del turno en el flujo operativo.'),
});
