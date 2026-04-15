import { z } from "zod";

export const LeadSchema = z.object({
  name: z
    .string()
    .min(1)
    .max(200)
    .trim()
    .describe("Nombre del contacto o lead."),
  email: z
    .string()
    .email()
    .max(320)
    .optional()
    .describe("Email para respuesta."),
  phone: z.string().max(30).trim().optional().describe("Teléfono opcional."),
  source: z
    .enum(["chatbot", "web", "whatsapp", "landing"])
    .default("web")
    .describe("Canal de captación para atribución."),
  message: z
    .string()
    .max(2000)
    .trim()
    .default("")
    .describe("Mensaje o consulta inicial."),
  interest: z
    .string()
    .max(200)
    .trim()
    .optional()
    .describe("Producto o tema de interés declarado."),
});
