import { z } from 'zod';

export const EventSchema = z.object({
  type: z.string().min(1).max(100).describe('Tipo de evento de dominio (p. ej. order.created).'),
  entity_type: z.string().min(1).max(50).describe('Nombre de la entidad afectada (tabla o agregado).'),
  entity_id: z.string().uuid().describe('UUID de la entidad relacionada.'),
  payload: z
    .record(z.unknown())
    .default({})
    .describe('Cuerpo flexible del evento (serializable a JSON).'),
  actor_id: z.string().uuid().optional().describe('Usuario o sistema que originó el evento.'),
  timestamp: z
    .string()
    .datetime()
    .optional()
    .describe('Momento ISO 8601; si falta, lo asigna el productor.'),
});
