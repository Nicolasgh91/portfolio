import { z } from 'zod';

export const EventSchema = z.object({
  type: z.string().min(1).max(100),
  entity_type: z.string().min(1).max(50),
  entity_id: z.string().uuid(),
  payload: z.record(z.unknown()).default({}),
  actor_id: z.string().uuid().optional(),
  timestamp: z.string().datetime().optional(),
});
